#!/usr/bin/env node
// Screenshots of pages at true viewports, themes and states, with wall / blank / error detection.
// The preferred render tool (shot.sh is the zero-dependency fallback). Needs Playwright + Chrome.
//
//   node capture.mjs <url | file | routes.json> [options]
//
//   --out dir              output folder (default .design/shots)
//   --viewports list       WxH list (default 390x844,768x1024,1280x800,1920x1080); widths under 600
//                          are emulated as a phone (touch, mobile UA)
//   --themes list          light,dark (default light) -> prefers-color-scheme
//   --states list          default and/or query or hash variants, e.g. "default,?state=empty-first,#help"
//   --full                 full-page capture instead of the viewport
//   --dpr n                device scale factor (default 2)
//   --reduced-motion       emulate prefers-reduced-motion: reduce
//   --storage-state file   Playwright storageState JSON (saved login) for every capture
//   --login-script file    module whose default export async (page, {base}) logs in once; its session is reused
//   --build-stamp text     fail any capture whose HTML does not contain this text (proves the build is the new one)
//   --consent auto|dismiss|keep   remove cookie banners and newsletter modals: auto = on public sites only (default)
//   --no-qa                skip the blank-frame check (walls and error pages are still detected)
//   --sheet                also write <out>/contact-sheet.png
//   --name base            base name for a single url or file (default derived from it)
//   --timeout ms           navigation timeout (default 30000)
//   --concurrency n        pages in parallel (default 4)
//
// Output: <out>/<name>-<state>-<W>x<H>-<theme>.png (state "default", or the variant slugged) and
// <out>/capture-report.json listing every capture: path, url, http status, verdict, reason, pixel stats.
// Exit: 0 every capture ok · 1 some capture is a wall, error page, redirect to login, blank, missing
// its ready element or build stamp · 2 usage error or Playwright / Chrome not available.
//
// routes.json sweeps many routes of one app (paths relative to the file resolve against it):
//   {"base": "https://staging.example.com", "routes": [{"id": "orders", "path": "/orders", "ready": ".orders-table",
//    "states": ["default", "?filter=none"]}], "viewports": ["390x844", "1280x800"], "themes": ["light", "dark"],
//    "states": ["default"], "storageState": "auth.json", "loginScript": "login.mjs", "buildStamp": "build 4f2c1e"}
// Command-line options override the file's values.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  PLAYWRIGHT_VERSION, QA_BLANK, launch, newPage, gotoReady, cleanScreenshot, detectWall, pixelQA, contactSheet,
} from './lib/capture-core.mjs';

const USAGE = 'usage: node capture.mjs <url|file|routes.json> [--out dir] [--viewports 390x844,1280x800] [--themes light,dark]\n' +
  '       [--states "default,?state=empty-first"] [--full] [--dpr 2] [--reduced-motion] [--storage-state auth.json]\n' +
  '       [--login-script login.mjs] [--build-stamp text] [--consent auto|dismiss|keep] [--no-qa] [--sheet]\n' +
  '       [--name base] [--timeout ms] [--concurrency n]      (--help for details)';
const die = (msg, code = 2) => { console.error(`capture: ${msg}`); process.exit(code); };

// ---------------------------------------------------------------- options

const opt = {};
const argv = process.argv.slice(2);
let target = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const val = () => { if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) die(`${a} needs a value\n${USAGE}`); return argv[++i]; };
  const list = () => val().split(',').map((s) => s.trim()).filter(Boolean);
  if (a === '--help' || a === '-h') { console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\nimport ')[0].replace(/^#!.*\n/, '').replace(/^\/\/ ?/gm, '')); process.exit(0); }
  else if (a === '--out') opt.out = val();
  else if (a === '--viewports') opt.viewports = list();
  else if (a === '--themes') opt.themes = list();
  else if (a === '--states') opt.states = list();
  else if (a === '--full') opt.full = true;
  else if (a === '--dpr') opt.dpr = Number(val());
  else if (a === '--reduced-motion') opt.reducedMotion = true;
  else if (a === '--storage-state') opt.storageState = resolve(val());
  else if (a === '--login-script') opt.loginScript = resolve(val());
  else if (a === '--build-stamp') opt.buildStamp = val();
  else if (a === '--consent') opt.consent = val();
  else if (a === '--no-qa') opt.qa = false;
  else if (a === '--sheet') opt.sheet = true;
  else if (a === '--name') opt.name = val();
  else if (a === '--timeout') opt.timeout = Number(val());
  else if (a === '--concurrency') opt.concurrency = Number(val());
  else if (a.startsWith('--')) die(`unknown option ${a}\n${USAGE}`);
  else if (!target) target = a;
  else die(`unexpected argument ${a}\n${USAGE}`);
}
if (!target) die(USAGE);

// ---------------------------------------------------------------- what to capture

const slug = (s) => s.replace(/^https?:\/\//, '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'page';
const toUrl = (t) => (/^(https?|file):\/\//.test(t) ? t : pathToFileURL(resolve(t.replace(/[?#].*$/, ''))).href + (t.match(/[?#].*$/) || [''])[0]);

// A plan: {routes: [{id, url, ready?, states?}], viewports, themes, states, storageState?, loginScript?, buildStamp?, base?}
function readPlan(t) {
  if (t.endsWith('.json') && existsSync(t)) {
    const file = JSON.parse(readFileSync(t, 'utf8'));
    if (!file.base || !Array.isArray(file.routes)) die(`${t}: a routes file needs "base" and "routes"`);
    const here = dirname(resolve(t)), rel = (p) => p && resolve(here, p);
    return {
      base: file.base, viewports: file.viewports, themes: file.themes, states: file.states,
      storageState: rel(file.storageState), loginScript: rel(file.loginScript), buildStamp: file.buildStamp,
      routes: file.routes.map((r, i) => ({ id: slug(r.id || r.path || `route-${i + 1}`), url: new URL(r.path || '/', file.base).href, ready: r.ready, states: r.states })),
    };
  }
  if (!/^(https?|file):\/\//.test(t) && !existsSync(t.replace(/[?#].*$/, ''))) die(`no such file or URL: ${t}`);
  const url = toUrl(t), u = new URL(url);
  const id = opt.name || (u.protocol === 'file:' ? basename(u.pathname, extname(u.pathname)) : u.host + u.pathname) + u.search + u.hash;
  return { base: url, routes: [{ id: slug(id), url }] };
}

const plan = readPlan(target);
const cfg = {
  out: resolve(opt.out || '.design/shots'),
  viewports: (opt.viewports || plan.viewports || ['390x844', '768x1024', '1280x800', '1920x1080']).map((v) => {
    const m = String(v).match(/^(\d+)x(\d+)$/);
    if (!m) die(`viewport "${v}" should look like 390x844`);
    return { w: Number(m[1]), h: Number(m[2]) };
  }),
  themes: opt.themes || plan.themes || ['light'],
  states: opt.states || plan.states || ['default'],
  storageState: opt.storageState || plan.storageState,
  loginScript: opt.loginScript || plan.loginScript,
  buildStamp: opt.buildStamp || plan.buildStamp,
  consent: opt.consent || 'auto',
  dpr: opt.dpr || 2, full: Boolean(opt.full), qa: opt.qa !== false, sheet: Boolean(opt.sheet),
  reducedMotion: opt.reducedMotion ? 'reduce' : 'no-preference',
  timeout: opt.timeout || 30000, concurrency: Math.max(1, opt.concurrency || 4),
};
for (const t of cfg.themes) if (!['light', 'dark'].includes(t)) die(`theme "${t}" should be light or dark`);
if (!['auto', 'dismiss', 'keep'].includes(cfg.consent)) die('--consent takes auto, dismiss or keep');
for (const f of [cfg.storageState, cfg.loginScript]) if (f && !existsSync(f)) die(`no such file: ${f}`);

// "default" keeps the URL; "?k=v" merges into its query; "#x" replaces its hash.
function stateUrl(url, state) {
  if (state === 'default') return url;
  const u = new URL(url);
  if (state.startsWith('?')) for (const [k, v] of new URLSearchParams(state)) u.searchParams.set(k, v);
  else if (state.startsWith('#')) u.hash = state;
  else die(`state "${state}" should be default, ?query or #hash`);
  return u.href;
}
const stateSlug = (state) => (state === 'default' ? 'default' : slug(state.replace(/^[?#]/, '')));
// Local pages keep their overlays (a dialog may be the state under review); public sites lose cookie banners.
const isLocal = (url) => /^file:|^https?:\/\/(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url);

const jobs = [], paths = new Set();
for (const route of plan.routes) {
  for (const state of route.states || cfg.states) {
    for (const { w, h } of cfg.viewports) {
      for (const theme of cfg.themes) {
        const path = join(cfg.out, `${route.id}-${stateSlug(state)}-${w}x${h}-${theme}.png`);
        if (paths.has(path)) die(`two captures would both write ${path}; give the routes distinct ids`);
        paths.add(path);
        jobs.push({ route, state, url: stateUrl(route.url, state), w, h, theme, path });
      }
    }
  }
}

// ---------------------------------------------------------------- capture

let browser;
try {
  browser = await launch();
} catch (e) {
  if (e.code !== 'NO_PLAYWRIGHT') die(e.message);
  die(`Playwright is not installed here. Either run through npx (nothing to install):\n` +
    `  npx -y -p playwright@${PLAYWRIGHT_VERSION} node ${process.argv[1]} ${process.argv.slice(2).join(' ')}\n` +
    `or add it to the project: npm i -D playwright@${PLAYWRIGHT_VERSION}  (Google Chrome is used when installed;\n` +
    `otherwise also run: npx playwright@${PLAYWRIGHT_VERSION} install chromium)`);
}

let storageState = cfg.storageState;
if (cfg.loginScript) {
  const login = (await import(pathToFileURL(cfg.loginScript).href)).default;
  if (typeof login !== 'function') die(`${cfg.loginScript} must export default async function (page, {base})`);
  const page = await newPage(browser, { storageState, reducedMotion: cfg.reducedMotion });
  try {
    await login(page, { base: plan.base });
    storageState = await page.context().storageState(); // kept in memory only: it holds session cookies
  } catch (e) {
    await browser.close();
    die(`login script failed: ${e.message.split('\n')[0]}`, 1);
  } finally {
    await page.context().close().catch(() => {});
  }
}

async function capture(job) {
  const t0 = Date.now();
  const rec = { path: job.path, url: job.url, route: job.route.id, state: job.state, viewport: `${job.w}x${job.h}`, theme: job.theme };
  const page = await newPage(browser, {
    width: job.w, height: job.h, dpr: cfg.dpr, colorScheme: job.theme, reducedMotion: cfg.reducedMotion, storageState,
  });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e.message).split('\n')[0].slice(0, 160)));
  try {
    const nav = await gotoReady(page, job.url, { timeout: cfg.timeout });
    Object.assign(rec, { http: nav.status, final_url: nav.finalUrl, title: nav.title });
    // First problem wins: [verdict, reason]. The PNG is written either way, so a failure can be looked at.
    const wall = await detectWall(page, nav);
    let problem = wall.walled ? [wall.kind, wall.reason] : null; // wall | error | login
    if (!problem && job.route.ready) {
      const seen = await page.locator(job.route.ready).first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);
      if (!seen) problem = ['not-ready', `ready element ${job.route.ready} never became visible`];
    }
    if (!problem && cfg.buildStamp && !(await page.content()).includes(cfg.buildStamp)) {
      problem = ['stale-build', `build stamp "${cfg.buildStamp}" is not in the page`];
    }
    const shoot = () => page.screenshot({ path: job.path, fullPage: cfg.full, animations: 'disabled', timeout: 30000 });
    let png;
    if (!problem && (cfg.consent === 'dismiss' || (cfg.consent === 'auto' && !isLocal(job.url)))) ({ png, consent: rec.consent } = await cleanScreenshot(page, shoot));
    else png = await shoot();
    if (!problem && cfg.qa) {
      const qa = await pixelQA(page, png, QA_BLANK);
      rec.qa = { stddev: qa.stddev, edge: qa.edge, dominant: qa.dominant };
      if (qa.verdict !== 'ok') problem = ['blank', `${qa.reason}; if this state is meant to be nearly empty, rerun with --no-qa`];
    }
    [rec.verdict, rec.reason] = problem || ['ok', null];
    return rec;
  } catch (e) {
    return Object.assign(rec, { verdict: 'error', reason: String(e.message).split('\n')[0].slice(0, 200) });
  } finally {
    if (pageErrors.length) rec.page_errors = pageErrors.slice(0, 5);
    rec.ms = Date.now() - t0;
    await page.context().close().catch(() => {});
  }
}

mkdirSync(cfg.out, { recursive: true });
const results = new Array(jobs.length);
let next = 0, done = 0;
await Promise.all(Array.from({ length: Math.min(cfg.concurrency, jobs.length) }, async () => {
  while (next < jobs.length) {
    const i = next++;
    const r = results[i] = await capture(jobs[i]);
    const shown = r.verdict === 'ok' ? r.path : `${r.verdict.toUpperCase()}: ${r.reason}  (${r.url})`;
    console.log(`[${String(++done).padStart(String(jobs.length).length)}/${jobs.length}] ${r.verdict === 'ok' ? 'ok ' : 'BAD'} ${r.route} ${r.state} ${r.viewport} ${r.theme}  ${shown}`);
  }
}));

// Failed captures keep their PNG (when one was taken) so the problem can be seen, but the run fails.
const report = { generated: new Date().toISOString(), target, playwright: PLAYWRIGHT_VERSION, browser: browser.version(), captures: results };
writeFileSync(join(cfg.out, 'capture-report.json'), JSON.stringify(report, null, 1) + '\n');
if (cfg.sheet) {
  const tiles = [...results].sort((a, b) => (a.verdict === 'ok') - (b.verdict === 'ok')).map((r) => ({
    file: existsSync(r.path) ? r.path : null, bad: r.verdict !== 'ok', title: basename(r.path, '.png'),
    lines: [`${r.verdict}${r.http ? ` · http ${r.http}` : ''}`, ...(r.reason ? [r.reason] : [])],
  }));
  console.log(`sheet: ${await contactSheet(browser, tiles, join(cfg.out, 'contact-sheet.png'), { cols: 4, tileWidth: 320, heading: `capture ${target}` })}`);
}
await browser.close();

const bad = results.filter((r) => r.verdict !== 'ok');
console.log(`\n${results.length - bad.length}/${results.length} ok · report ${join(cfg.out, 'capture-report.json')}`);
if (bad.length) {
  console.error(`capture: ${bad.length} capture(s) failed - do not judge the design from them:`);
  for (const r of bad) console.error(`  ${r.verdict.padEnd(11)} ${basename(r.path)}  ${r.reason}`);
  process.exit(1);
}
