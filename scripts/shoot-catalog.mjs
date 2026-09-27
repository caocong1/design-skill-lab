#!/usr/bin/env node
// Catalogue thumbnails: docs/assets/thumbs/<id>.webp (800x500) + docs/assets/thumbs/manifest.json.
//
//   npm run shoot -- [--ids a,b] [--only-failing] [--stale DAYS] [--force] [--limit N]
//                    [--concurrency 6] [--headed] [--no-revalidate] [--sheet review.png]
//
// Which rows are shot (status "sunset" rows never are; they get a placeholder record):
//   default          rows without an ok thumbnail: never shot, URL changed, placeholder, failed re-validation
//   --only-failing   only rows that already have a record that is not ok (skips rows never shot)
//   --stale DAYS     also ok rows captured more than DAYS ago (a failed refresh keeps the old file)
//   --force          every selected row; a failed refresh keeps the last good file only if no verdict was reached
//   --ids a,b        restrict to these ids (reshoot them: --ids a,b --force)
//   --limit N        at most N rows this run
// Every run first re-checks the pixels of every existing file (skip with --no-revalidate) and
// deletes files whose ids left the catalogue. --sheet writes a labelled contact sheet of this run.
//
// Per row (catalog/shot-overrides.json wins):
//   github.com/<owner>/<repo>  -> GitHub social card, letterboxed on white
//   anything else              -> screenshot 1280x800 -> retry with longer settle and motion allowed
//                                 -> (--headed only) headed Chrome
//   then, if still no image    -> og:image / twitter:image -> placeholder (no file; the page draws a card)
// Every image must pass pixel QA (QA in capture-core). Politeness: one request at a time per host,
// hosts taken round-robin, at most --concurrency pages overall, the browser's native user agent.
//
// shot-overrides.json: {"<id>": {"url": "alt url", "hide": ["css selector"], "wait": extra ms,
//                                "ready": "css selector that exists only once the content has loaded",
//                                "css": "extra CSS applied before the shot (e.g. finish scroll-in transitions)",
//                                "scroll": "css selector the frame starts at (first match; headroom via scroll-margin-top in css)",
//                                "localStorage": {"key": "value"} set on the page's origin before it loads,
//                                "force": "og"|"placeholder"|"github"|"screenshot",
//                                "image": "og image URL to use instead of the page's meta tags (dead og, walled page)",
//                                "fit": "contain" (letterbox the og image instead of cropping it to 16:10),
//                                "block": true (abort consent/ad hosts; off by default, see CMP_HOSTS), "note": "why"}}
// hide and css go in as one stylesheet, so elements that mount after the check (late toasts, tours) are hidden too.
//
// QA calibration (2026-09-27): the old pipeline's 539 thumbnails re-encoded to 800x500 and checked against
// the audit's defect list. edge < 0.012 flagged 28, dominant > 0.97 flagged 22, stddev < 8 flagged 15, all
// genuine defects; dominant > 0.90 would also have rejected 26 legitimate white-space-heavy sites. 12+ flat
// tiles of 16 flagged 22, all defects, 3 of them (header-only frames) missed by the other three metrics.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, renameSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  launch, newPage, gotoReady, ready, waitStable, navInfo, cleanScreenshot, detectWall,
  pixelPage, pixelQA, encodeWebp, imageSize, userAgent, contactSheet,
} from '../skills/design-studio/scripts/lib/capture-core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/assets/thumbs');
const MANIFEST = join(OUT, 'manifest.json');
const OVERRIDES = join(ROOT, 'catalog/shot-overrides.json');
const W = 800, H = 500;

// ---------------------------------------------------------------- options

const USAGE = 'usage: node scripts/shoot-catalog.mjs [--ids a,b] [--only-failing] [--stale DAYS] [--force] ' +
  '[--limit N] [--concurrency N] [--headed] [--no-revalidate] [--sheet out.png]';
const opt = { ids: null, onlyFailing: false, stale: null, force: false, limit: Infinity, concurrency: 6, headed: false, revalidate: true, sheet: null };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i], val = () => { if (argv[i + 1] === undefined) fail(`${a} needs a value`); return argv[++i]; };
  if (a === '--ids') opt.ids = new Set(val().split(',').filter(Boolean));
  else if (a === '--only-failing') opt.onlyFailing = true;
  else if (a === '--stale') opt.stale = Number(val());
  else if (a === '--force') opt.force = true;
  else if (a === '--limit') opt.limit = Number(val());
  else if (a === '--concurrency') opt.concurrency = Number(val());
  else if (a === '--headed') opt.headed = true;
  else if (a === '--no-revalidate') opt.revalidate = false;
  else if (a === '--sheet') opt.sheet = val();
  else if (a === '--help' || a === '-h') { console.log(USAGE); process.exit(0); }
  else fail(`unknown argument ${a}`);
}
function fail(msg) { console.error(`shoot-catalog: ${msg}\n${USAGE}`); process.exit(2); }

// ---------------------------------------------------------------- data

const readJson = (path, fallback) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback);

// Only id, url, region and status are needed, so both catalogue schemas work (v1: lang + updated).
const REGION_OF_LANG = { zh: 'cn', ja: 'jp', ko: 'kr' };
const rows = readFileSync(join(ROOT, 'catalog/resources.jsonl'), 'utf8').split('\n').filter((l) => l.trim())
  .map((l) => JSON.parse(l))
  .map((r) => ({ id: r.id, url: r.url, region: r.region || REGION_OF_LANG[r.lang] || 'global', status: r.status || r.updated || 'active' }));
const LOCALE = { cn: 'zh-CN', jp: 'ja-JP', kr: 'ko-KR' };
const overrides = readJson(OVERRIDES, {});
const manifest = readJson(MANIFEST, { generated: null, items: {} });
const items = manifest.items;

mkdirSync(OUT, { recursive: true });
const fileOf = (id) => join(OUT, `${id}.webp`);
const removeFile = (id) => { if (existsSync(fileOf(id))) unlinkSync(fileOf(id)); };
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const isOk = (item) => Boolean(item && item.file && item.qa && item.qa.verdict === 'ok');
const urlOf = (row) => (overrides[row.id] && overrides[row.id].url) || row.url;

function saveManifest() {
  const sorted = Object.fromEntries(Object.keys(items).sort().map((id) => [id, items[id]]));
  const tmp = MANIFEST + '.tmp';
  writeFileSync(tmp, JSON.stringify({ generated: now().slice(0, 10), items: sorted }, null, 1) + '\n');
  renameSync(tmp, MANIFEST);
}

function placeholder(url, attempts, { http = null, final_url = null } = {}) {
  return {
    source: 'placeholder', file: null, w: null, h: null, bytes: null, captured_at: now(), final_url, http,
    qa: { verdict: 'placeholder', stddev: null, edge: null, dominant: null, tiles: null }, url, attempts,
  };
}

// github.com/<owner>/<repo> exactly (any deeper path only when an override forces the card).
const NOT_OWNERS = new Set(['topics', 'features', 'marketplace', 'sponsors', 'collections', 'trending', 'orgs', 'settings',
  'explore', 'about', 'enterprise', 'pricing', 'apps', 'customer-stories', 'readme', 'security', 'site', 'events', 'login']);
function githubRepo(url, anyPath = false) {
  const m = url.match(anyPath ? /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/ : /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/);
  return m && !NOT_OWNERS.has(m[1].toLowerCase()) ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}
function strategyOf(row) {
  const ov = overrides[row.id] || {};
  if (ov.force) return ov.force;
  return githubRepo(urlOf(row)) ? 'github' : 'screenshot';
}
const hostOf = (row) => (strategyOf(row) === 'github' ? 'opengraph.githubassets.com' : new URL(urlOf(row)).hostname);

// ---------------------------------------------------------------- fetch helpers (og + GitHub cards)

let UA = '';
async function download(url, { html = false } = {}, tries = 3) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: html ? 'text/html' : 'image/avif,image/webp,image/png,image/*;q=0.8' },
    redirect: 'follow', signal: AbortSignal.timeout(20000),
  });
  // Rate limited (opengraph.githubassets.com answers 429 when the GitHub cards come back to back): wait as asked.
  if (res.status === 429 && tries > 1) {
    await sleep(Math.min(Number(res.headers.get('retry-after')) || 10, 60) * 1000);
    return download(url, { html }, tries - 1);
  }
  if (!res.ok) throw new Error(`http ${res.status} for ${url}`);
  const type = res.headers.get('content-type') || '';
  if (html ? !type.includes('html') : !type.startsWith('image/')) throw new Error(`unexpected content-type ${type || 'none'}`);
  if (html) return { html: (await res.text()).slice(0, 400000), finalUrl: res.url };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 15e6) throw new Error('image over 15 MB');
  return buf;
}

const OG_KEYS = ['og:image', 'og:image:secure_url', 'og:image:url', 'twitter:image', 'twitter:image:src'];
function ogFromHtml(html, base) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const key of OG_KEYS) {
    for (const tag of metas) {
      const name = (tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
      const content = (tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (name && content && name.toLowerCase() === key) {
        return new URL(content.trim().replace(/&amp;/g, '&'), base).href;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------- attempts

const DEAD = /ERR_NAME_NOT_RESOLVED|ERR_CONNECTION_REFUSED|ERR_CERT/;
const RUNGS = [
  { mode: 'screenshot', settle: 1, dwell: 0, reducedMotion: 'reduce' },
  { mode: 'screenshot-slow', settle: 2, dwell: 5000, reducedMotion: 'no-preference' },
  { mode: 'screenshot-headed', settle: 2, dwell: 5000, reducedMotion: 'no-preference', headed: true },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const firstLine = (e) => String((e && e.message) || e).split('\n')[0].replace(/\s+/g, ' ').slice(0, 140);

// Each attempt appends {mode, result: ok|wall|gone|qa|error|none, reason, ms, ...} to s.attempts and returns an image or null.
// gone = the server answered with an error page (404, soft 404 text); error = no answer (exception, timeout, 5xx).
async function attempt(s, mode, fn) {
  const a = { mode, result: 'error', reason: null, ms: 0 };
  s.attempts.push(a);
  const t0 = Date.now();
  try { return await fn(a); } catch (e) { a.reason = firstLine(e); return null; } finally { a.ms = Date.now() - t0; }
}

function screenshot(browser, s, rung) {
  return attempt(s, rung.mode, async (a) => {
    const storageState = s.ov.localStorage && { cookies: [], origins: [{ origin: new URL(s.url).origin,
      localStorage: Object.entries(s.ov.localStorage).map(([name, value]) => ({ name, value })) }] };
    const page = await newPage(browser, { locale: LOCALE[s.row.region] || 'en-US', reducedMotion: rung.reducedMotion, block: Boolean(s.ov.block), storageState });
    try {
      let nav = await gotoReady(page, s.url, { settle: rung.settle, dwell: rung.dwell });
      let wall = await detectWall(page, nav);
      const waited = wall.kind === 'wall';
      for (let i = 0; wall.kind === 'wall' && i < 5; i++) { // challenges often clear by themselves
        await sleep(2000);
        wall = await detectWall(page, nav = await navInfo(page, s.url));
      }
      if (waited && !wall.walled) { await ready(page, { settle: rung.settle }); nav = await navInfo(page, s.url); }
      a.http = nav.status;
      s.http = nav.status; s.final_url = nav.finalUrl;
      if (wall.walled) {
        a.result = wall.kind !== 'error' ? 'wall' : nav.status >= 500 ? 'error' : 'gone';
        a.reason = wall.reason;
        return null;
      }
      s.og = s.og || await page.evaluate((keys) => {
        for (const k of keys) {
          const m = document.querySelector(`meta[property="${k}"],meta[name="${k}"]`);
          if (m && m.content) return new URL(m.content, location.href).href;
        }
        return null;
      }, OG_KEYS);
      if (s.ov.ready) { // content that loads late or not at all (gated XHR) shows up as a missing element, not in pixels
        const seen = await page.locator(s.ov.ready).first().waitFor({ state: 'visible', timeout: 10000 * rung.settle }).then(() => true, () => false);
        if (!seen) { a.result = 'qa'; a.reason = `ready element ${s.ov.ready} never appeared`; return null; }
      }
      const css = (s.ov.hide ? `${s.ov.hide.join(',')}{display:none!important}` : '') + (s.ov.css || '');
      if (css) { // a constructed sheet: CSP style-src does not apply to it, unlike an injected <style>
        await page.evaluate((text) => { const sheet = new CSSStyleSheet(); sheet.replaceSync(text); document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]; }, css);
      }
      if (s.ov.scroll) { // start the frame at this element; scrollIntoView honours scroll-margin-top, so css can add headroom
        const found = await page.evaluate((sel) => { const e = document.querySelector(sel); e?.scrollIntoView({ block: 'start', behavior: 'instant' }); return Boolean(e); }, s.ov.scroll);
        if (!found) { a.result = 'qa'; a.reason = `scroll element ${s.ov.scroll} not found`; return null; }
        await waitStable(page, 3000 * rung.settle);
      }
      if (s.ov.wait) await sleep(s.ov.wait);
      const shot = await cleanScreenshot(page, () => page.screenshot({ type: 'png', animations: 'disabled', timeout: 20000 }));
      a.consent = shot.consent;
      const webp = await encodeWebp(page, shot.png, { width: W, height: H, fit: 'cover' });
      const qa = await pixelQA(page, webp);
      if (qa.verdict !== 'ok') { a.result = 'qa'; a.reason = qa.reason; return null; }
      a.result = 'ok';
      return { source: 'screenshot', webp, qa, http: nav.status, final_url: nav.finalUrl };
    } finally {
      await page.context().close();
    }
  });
}

function remoteImage(browser, s, mode, src, fit) {
  return attempt(s, mode, async (a) => {
    a.src = src;
    const buf = await download(src);
    const tool = await pixelPage(browser);
    const { w, h } = await imageSize(tool, buf);
    if (mode === 'og' && (w < 400 || w / h < 1.2)) { a.result = 'qa'; a.reason = `logo-like ${w}x${h}`; return null; }
    const webp = await encodeWebp(tool, buf, { width: W, height: H, fit });
    const qa = await pixelQA(tool, webp);
    if (qa.verdict !== 'ok') { a.result = 'qa'; a.reason = qa.reason; return null; }
    a.result = 'ok';
    return { source: mode, webp, qa, http: s.http, final_url: s.final_url };
  });
}

async function ogImage(browser, s) {
  if (!s.og) {
    const found = await attempt(s, 'og-html', async (a) => {
      const { html, finalUrl } = await download(s.url, { html: true });
      s.og = ogFromHtml(html, finalUrl);
      a.result = s.og ? 'ok' : 'none';
      if (!s.og) a.reason = 'no og:image';
      return s.og;
    });
    if (!found) return null;
  }
  return remoteImage(browser, s, 'og', s.og, s.ov.fit || 'cover');
}

let headedBrowser = null;
async function shootRow(browser, row) {
  const ov = overrides[row.id] || {};
  const s = { row, ov, url: urlOf(row), attempts: [], og: ov.image || null, http: null, final_url: null };
  const strategy = strategyOf(row);
  let img = null;
  if (strategy === 'github') {
    const gh = githubRepo(s.url, true);
    if (gh) img = await remoteImage(browser, s, 'github', `https://opengraph.githubassets.com/1/${gh.owner}/${gh.repo}`, 'contain');
  }
  if (!img && strategy === 'screenshot') {
    for (const rung of RUNGS) {
      if (rung.headed && !opt.headed) break;
      const last = s.attempts[s.attempts.length - 1];
      if (last && (last.result === 'gone' || DEAD.test(last.reason || ''))) break;
      if (last && last.result === 'wall') await sleep(3000); // give the host a breather before asking again
      const b = rung.headed ? await (headedBrowser ||= launch({ headless: false })) : browser;
      if ((img = await screenshot(b, s, rung))) break;
    }
  }
  if (!img && strategy !== 'placeholder') img = await ogImage(browser, s);
  return record(s, img);
}

function record(s, img) {
  const id = s.row.id, prev = items[id];
  if (img) {
    writeFileSync(fileOf(id), img.webp);
    const { stddev, edge, dominant, tiles } = img.qa;
    return {
      source: img.source, file: `${id}.webp`, w: W, h: H, bytes: img.webp.length, captured_at: now(),
      final_url: img.final_url, http: img.http, qa: { verdict: 'ok', stddev, edge, dominant, tiles }, url: s.url, attempts: s.attempts,
    };
  }
  // A failed refresh keeps the last good thumbnail: always without --force; with --force only when no verdict was
  // reached (network outage, timeouts), since a wall or QA/ready rejection is an answer. Never when the server says
  // the page is gone (an error page) or an override now asks for a placeholder.
  const gone = s.attempts.some((a) => a.result === 'gone') || strategyOf(s.row) === 'placeholder';
  const judged = s.attempts.some((a) => a.mode !== 'og' && (a.result === 'wall' || a.result === 'qa'));
  if (isOk(prev) && prev.url === s.url && !gone && !(opt.force && judged)) {
    return { ...prev, attempts: [...s.attempts, { mode: 'kept', result: 'ok', reason: `refresh failed; keeping ${prev.captured_at}` }] };
  }
  removeFile(id);
  return placeholder(s.url, s.attempts, s);
}

// ---------------------------------------------------------------- scheduling

// One task per host at a time, hosts in round-robin, `concurrency` tasks overall.
async function runPolitely(todo, concurrency, fn) {
  const queues = new Map();
  for (const row of todo) {
    const host = hostOf(row);
    if (!queues.has(host)) queues.set(host, []);
    queues.get(host).push(row);
  }
  const hosts = [...queues.keys()], busy = new Set();
  let turn = 0;
  const nextHost = () => {
    for (let k = 0; k < hosts.length; k++) {
      const h = hosts[(turn + k) % hosts.length];
      if (!busy.has(h) && queues.get(h).length) { turn = (turn + k + 1) % hosts.length; return h; }
    }
    return null;
  };
  const pending = () => hosts.some((h) => queues.get(h).length);
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (pending()) {
      const host = nextHost();
      if (!host) { await sleep(200); continue; }
      busy.add(host);
      try { await fn(queues.get(host).shift()); } finally { busy.delete(host); }
    }
  }));
}

// ---------------------------------------------------------------- main

const catalogIds = new Set(rows.map((r) => r.id));
const pruned = new Set(); // ids whose record or file was removed
for (const id of Object.keys(items)) if (!catalogIds.has(id)) { delete items[id]; pruned.add(id); }
for (const f of readdirSync(OUT)) {
  if (f.endsWith('.webp') && !isOk(items[f.slice(0, -5)])) { unlinkSync(join(OUT, f)); pruned.add(f.slice(0, -5)); }
}
for (const row of rows) {
  if (row.status === 'sunset' && !items[row.id]) items[row.id] = placeholder(row.url, [{ mode: 'skip', result: 'none', reason: 'sunset', ms: 0 }]);
}

const browser = await launch();
UA = await userAgent(browser);
const tool = await pixelPage(browser);

let revalidated = 0, dropped = 0;
if (opt.revalidate) {
  for (const [id, item] of Object.entries(items)) {
    if (!item.file) continue;
    revalidated++;
    const why = !existsSync(fileOf(id)) ? 'file missing' : null;
    const qa = why ? null : await pixelQA(tool, readFileSync(fileOf(id)));
    if (qa) {
      Object.assign(item.qa, { stddev: qa.stddev, edge: qa.edge, dominant: qa.dominant, tiles: qa.tiles });
      item.bytes = statSync(fileOf(id)).size;
    }
    if (why || qa.verdict !== 'ok') {
      dropped++;
      removeFile(id);
      items[id] = placeholder(item.url, [...(item.attempts || []), { mode: 'revalidate', result: why ? 'error' : 'qa', reason: why || qa.reason, ms: 0 }],
        { http: item.http, final_url: item.final_url });
    }
  }
}

const staleBefore = opt.stale == null ? null : Date.now() - opt.stale * 864e5;
const todo = rows.filter((row) => {
  if (row.status === 'sunset' || (opt.ids && !opt.ids.has(row.id))) return false;
  const item = items[row.id];
  if (opt.onlyFailing) return Boolean(item) && !isOk(item);
  if (opt.force || !isOk(item) || item.url !== urlOf(row)) return true;
  return staleBefore != null && Date.parse(item.captured_at) < staleBefore;
}).slice(0, opt.limit);
if (opt.ids) for (const id of opt.ids) if (!catalogIds.has(id)) console.warn(`  warning: --ids ${id} is not in the catalogue`);

console.log(`shoot-catalog: ${rows.length} rows · revalidated ${revalidated} (dropped ${dropped}) · pruned ${pruned.size} · ${todo.length} to shoot`);
saveManifest();

const t0 = Date.now();
let n = 0;
await runPolitely(todo, opt.concurrency, async (row) => {
  const t = Date.now();
  items[row.id] = await shootRow(browser, row);
  saveManifest();
  const trail = items[row.id].attempts.map((a) => `${a.mode}:${a.result}${a.result === 'ok' || !a.reason ? '' : `(${a.reason.slice(0, 48)})`}`).join(' → ');
  console.log(`[${String(++n).padStart(3)}/${todo.length}] ${row.id.padEnd(28)} ${items[row.id].source.padEnd(11)} ${((Date.now() - t) / 1000).toFixed(1).padStart(5)}s  ${trail}`);
});

if (opt.sheet && todo.length) {
  const order = { placeholder: 0, og: 1, github: 2, screenshot: 3 };
  const tiles = todo.map((row) => ({ id: row.id, item: items[row.id] }))
    .sort((a, b) => order[a.item.source] - order[b.item.source] || a.id.localeCompare(b.id))
    .map(({ id, item }) => ({
      file: item.file ? fileOf(id) : null, bad: item.source === 'placeholder', title: id,
      lines: [`${item.source} · ${item.qa.verdict}${item.qa.edge != null ? ` · e${item.qa.edge} d${item.qa.dominant} s${item.qa.stddev}` : ''}`,
        item.attempts.map((a) => `${a.mode}:${a.result}${a.result === 'ok' || !a.reason ? '' : ` (${a.reason.slice(0, 60)})`}`).join(' → ')],
    }));
  const per = 40, pages = Math.ceil(tiles.length / per);
  for (let p = 0; p < pages; p++) {
    const out = pages === 1 ? opt.sheet : opt.sheet.replace(/(\.png)?$/i, `-${p + 1}.png`);
    await contactSheet(browser, tiles.slice(p * per, (p + 1) * per), out, { cols: 5, tileWidth: 256, heading: `shoot-catalog ${now()} · ${p + 1}/${pages}` });
    console.log(`sheet: ${out}`);
  }
}

await browser.close();
if (headedBrowser) await (await headedBrowser).close();

const all = Object.values(items), ran = todo.map((r) => items[r.id]);
const count = (list, key) => Object.entries(list.reduce((m, it) => ((m[key(it)] = (m[key(it)] || 0) + 1), m), {})).map(([k, v]) => `${k} ${v}`).join(', ') || '-';
console.log(`\nthis run (${todo.length} rows, ${((Date.now() - t0) / 1000).toFixed(0)}s): ${count(ran, (it) => it.source)}`);
console.log(`manifest (${all.length} records): ${count(all, (it) => it.source)} · verdict ${count(all, (it) => it.qa.verdict)}`);
const failed = todo.filter((r) => items[r.id].source === 'placeholder');
if (failed.length) {
  console.log('placeholders this run:');
  for (const r of failed) {
    const last = items[r.id].attempts.filter((a) => a.result !== 'ok').map((a) => `${a.mode}:${a.reason || a.result}`).join(' | ');
    console.log(`  ${r.id.padEnd(28)} ${last}`);
  }
}
