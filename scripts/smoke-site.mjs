#!/usr/bin/env node
// Site smoke test for docs/ (the GitHub Pages root). Serves docs/ with python's http.server on a free port and
// drives Chrome (Playwright) over every page at 1440×900 and 390×844.
//
// Gates (exit 1 if any fails):
//   every visit   no console errors · no failed same-origin request · every <img> loaded (naturalWidth > 0) ·
//                 every link resolves (same-origin files, #ids, and github.com/caocong1/design-skill-lab/blob|tree/main/<path>
//                 against this checkout), read from the live DOM and from the served HTML so <noscript> links count
//   at 390        no horizontal overflow (document wider than the viewport)
//   /, /catalog/ (incl. ?q= and ?id=), /skills/   axe-core: 0 serious/critical (light at both widths, dark at 1440)
//   legacy links  /?style=<id> lands on /lab/?style=<id>; /?q= lands on /catalog/?q=
//   search        docs/assets/search-goldens.json against the page's own engine (DSL.catalogSearch), and the
//                 rendered list follows the engine's order
//   home weight   HTML+CSS+JS+fonts+data before images ≤ 150 KB (gzip for text, raw for fonts)
//   data fresh    data/thumbs.js wires exactly the QA-passed files in assets/thumbs/manifest.json (a stale build ships cards)
//   static HTML   the build-written regions match data/catalog.json: home case (compartments, counts), data stamp,
//                 ledger screenshot count; the catalogue's no-script list has one row per entry
//   no script     home shows the case and the picks and no language/theme switch; the catalogue lists every entry
//   320 px        /, /catalog/ and /skills/ reflow (no horizontal scroll)
//   fonts         every page and lab direction fits 390 px with the font CDN blocked and wide inputs
//   keys          from home: "/", type, Enter opens the top hit's note on /catalog/; "o" then opens that site
// Reported only: axe on /lab/ and every /lab/?style=<id>; external (CDN) request failures; catalogue/skills weight.
//
// Usage: node scripts/smoke-site.mjs [--grep <regex over visit names>] [--no-lab] [--json <report.json>]
// Env:   AXE=<path to axe.min.js>  (else node_modules/axe-core/axe.min.js, else cdnjs axe-core 4.10.3)
//        REPO=<repo root>          (default: the parent of this script's folder)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import vm from 'node:vm';
import zlib from 'node:zlib';

const REPO = resolve(process.env.REPO || join(dirname(fileURLToPath(import.meta.url)), '..'));
const DOCS = join(REPO, 'docs');
if (!existsSync(join(DOCS, 'index.html'))) { console.error(`no docs/index.html under ${REPO}; set REPO=<repo root>`); process.exit(2); }
const { chromium } = createRequire(join(REPO, 'package.json'))('playwright');

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const GREP = opt('--grep') ? new RegExp(opt('--grep'), 'i') : null;
const NO_LAB = args.includes('--no-lab');
const JSON_OUT = opt('--json');
const BUDGET = 150_000;               // bytes, home before images
const VIEWPORTS = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];
const WORKERS = 4;

/* ---------------- inputs derived from the repo, never hand-typed ---------------- */
const catalog = JSON.parse(readFileSync(join(DOCS, 'data/catalog.json'), 'utf8'));
const goldens = JSON.parse(readFileSync(join(DOCS, 'assets/search-goldens.json'), 'utf8'));
const labWin = {};
vm.runInNewContext(readFileSync(join(DOCS, 'lab/content.js'), 'utf8'), { window: labWin });
const STYLES = labWin.CONTENT.styles.map((s) => s.id);
/* a detail with a picture if any row has a checked thumbnail, else the first S row */
const detailRow = catalog.resources.find((r) => r.tier === 'S' && r.thumb) || catalog.resources.find((r) => r.tier === 'S');
const gridDomain = catalog.domains.map((d) => [d.id, catalog.resources.filter((r) => r.domain === d.id && r.thumb).length])
  .sort((a, b) => b[1] - a[1])[0][0];

async function axeSource() {
  const local = [process.env.AXE, join(REPO, 'node_modules/axe-core/axe.min.js')].filter(Boolean).find((p) => existsSync(p));
  if (local) return readFileSync(local, 'utf8');
  const r = await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js');
  if (!r.ok) throw new Error('axe-core: no local copy and cdnjs answered ' + r.status);
  return r.text();
}

/* ---------------- server ---------------- */
function freePort() {
  return new Promise((ok, no) => { const s = net.createServer(); s.unref(); s.on('error', no); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }); });
}
async function serve() {
  const port = await freePort();
  /* python's stdlib http.server (what `python3 -m http.server` runs), with a listen backlog of 128 instead of 5:
     parallel page loads overflow the default backlog and macOS answers with connection resets */
  const py = 'import functools, sys, http.server as s\n' +
    's.ThreadingHTTPServer.request_queue_size = 128\n' +
    's.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), functools.partial(s.SimpleHTTPRequestHandler, directory=sys.argv[2])).serve_forever()';
  const proc = spawn('python3', ['-c', py, String(port), DOCS], { stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}/`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) return { proc, base }; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  proc.kill();
  throw new Error('python3 -m http.server did not start on ' + port);
}

/* ---------------- visits ---------------- */
const enc = encodeURIComponent;
const MAIN = { axe: true };
const visits = [
  { name: 'home', path: '', ...MAIN, weight: true },
  { name: 'catalog', path: 'catalog/', ...MAIN, weight: true },
  { name: 'catalog ?q=配色', path: 'catalog/?q=' + enc('配色'), ...MAIN },
  { name: `catalog ?id=${detailRow.id}`, path: 'catalog/?id=' + enc(detailRow.id), ...MAIN },
  { name: `catalog grid ${gridDomain}`, path: `catalog/?domain=${gridDomain}&view=grid` },
  { name: 'catalog ?lang=en', path: 'catalog/?lang=en&q=motion' },
  { name: 'skills', path: 'skills/', ...MAIN, weight: true },
  { name: 'home ?lang=en', path: '?lang=en' },
  { name: 'lab', path: 'lab/', lab: true },
  ...STYLES.map((s) => ({ name: 'lab ?style=' + s, path: 'lab/?style=' + s, lab: true })),
  { name: 'legacy ?style=songban', path: '?style=songban', expect: /\/lab\/\?style=songban$/ },
  { name: 'legacy ?q=font', path: '?q=font', expect: /\/catalog\/\?q=font$/ },
].filter((v) => (!NO_LAB || !/^lab/.test(v.name)) && (!GREP || GREP.test(v.name)));

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const isText = (type) => ['document', 'stylesheet', 'script', 'fetch', 'xhr'].includes(type);

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]);
    /* sweep down so lazy images and scroll reveals run, then wait for the images, then back to the top */
    for (let i = 0; i < 80 && innerHeight + scrollY < document.documentElement.scrollHeight - 2; i++) {
      scrollBy(0, Math.round(innerHeight * 0.8));
      await new Promise((r) => setTimeout(r, 60));
    }
    const pending = [...document.images].filter((im) => !im.complete && im.getClientRects().length);
    await Promise.race([Promise.all(pending.map((im) => new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); }))), new Promise((r) => setTimeout(r, 6000))]);
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
    /* let finite transitions and reveals finish: axe blends half-faded text into false contrast failures */
    const finite = document.getAnimations().filter((a) => { const t = a.effect && a.effect.getComputedTiming(); return t && Number.isFinite(t.endTime); });
    await Promise.race([Promise.all(finite.map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 4000))]);
  });
}

/* links: every href in the live DOM and in the served HTML (noscript included) must resolve.
   same-origin → the server answers < 400; #id → the element exists (not on lab pages, whose section anchors are
   click handlers that render their target first); this repo on GitHub → the path exists in REPO */
const REPO_URL = /^https:\/\/github\.com\/caocong1\/design-skill-lab\/(?:blob|tree)\/main\/([^?#]+)/;
const linkCache = new Map();
async function checkLinks(page, base, ids) {
  const origin = new URL(base).origin;
  const { dom, missingIds, url } = await page.evaluate(() => ({
    url: location.href,
    dom: [...document.querySelectorAll('a[href], link[href], script[src], img[src]')].map((e) => e.getAttribute('href') || e.getAttribute('src') || '').filter(Boolean),
    missingIds: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter((id) => id && !document.getElementById(decodeURIComponent(id))),
  }));
  const html = await (await fetch(url.split('#')[0])).text();
  const raw = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const bad = ids ? missingIds.map((id) => '#' + id + ' (no such id)') : [];
  for (const h of new Set([...dom, ...raw])) {
    if (/^(?:data:|mailto:|javascript:|#)/i.test(h)) continue;
    let u;
    try { u = new URL(h, url); } catch { bad.push(h + ' (unparseable)'); continue; }
    const repo = REPO_URL.exec(u.href);
    if (repo) { if (!existsSync(join(REPO, decodeURIComponent(repo[1])))) bad.push(h + ' (not in the repo)'); continue; }
    if (u.origin !== origin) continue;
    const key = u.pathname;
    if (!linkCache.has(key)) linkCache.set(key, fetch(origin + key).then((r) => r.status).catch(() => 0));
    const st = await linkCache.get(key);
    if (!(st >= 200 && st < 400)) bad.push(u.pathname + ' (' + (st || 'no answer') + ')');
  }
  return [...new Set(bad)];
}

async function run(browser, base, axe, v, vp, scheme = 'light') {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: scheme, isMobile: vp.w < 500, hasTouch: vp.w < 500, locale: 'zh-CN' });
  const page = await ctx.newPage();
  const origin = new URL(base).origin;
  const res = { visit: v.name, w: vp.w, scheme, console: [], failed: [], external: [], aborted: [], overflow: null, images: { n: 0, bad: [] }, links: [], axe: null, redirect: null, weight: null };
  const bodies = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const url = (m.location() && m.location().url) || '';
    /* "Failed to load resource" for a CDN file is the network, not the page; same-origin ones stay errors */
    if (/^Failed to load resource/.test(m.text()) && url && !url.startsWith(origin)) res.external.push(m.text() + ' ' + url);
    else res.console.push(m.text() + (url ? ' @ ' + url.replace(origin, '') : ''));
  });
  page.on('pageerror', (e) => res.console.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => {
    const err = (r.failure() && r.failure().errorText) || '';
    const line = err + ' ' + r.url().replace(origin, '');
    if (/ERR_ABORTED/.test(err)) res.aborted.push(line);          // cancelled by the client (navigation, lazy image swap)
    else if (r.url().startsWith(origin)) res.failed.push(line);
    else res.external.push(line);
  });
  page.on('response', (r) => {
    const t = r.request().resourceType();
    if (r.status() >= 400) (r.url().startsWith(origin) ? res.failed : res.external).push(r.status() + ' ' + r.url().replace(origin, ''));
    if (v.weight && (isText(t) || t === 'font')) bodies.push(r.body().then((b) => ({ url: r.url().replace(origin, ''), type: t, raw: b.length, gz: t === 'font' ? b.length : zlib.gzipSync(b).length })).catch(() => null));
  });
  try {
    await open(page, base + v.path, (m) => res.external.push(m));
    if (v.expect) {
      await page.waitForURL(v.expect, { timeout: 10000 }).catch(() => {});
      res.redirect = { to: page.url().replace(origin, ''), ok: v.expect.test(page.url()) };
      await page.waitForLoadState('load').catch(() => {});
    }
    await settle(page);

    if (vp.w < 500) {
      /* against the configured width: under mobile emulation innerWidth grows to fit an overflowing page */
      res.overflow = await page.evaluate((W) => {
        const sw = document.documentElement.scrollWidth;
        if (sw <= W + 1) return { sw, W, offenders: [] };
        const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
        const clipped = (el) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (cs.position === 'fixed') return true;
            if (cs.overflowX !== 'visible' && p.getBoundingClientRect().right <= W + 1) return true;
          }
          return false;
        };
        const offenders = [...document.body.querySelectorAll('*')].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > W + 1 && getComputedStyle(el).position !== 'fixed' && !clipped(el);
        }).slice(0, 6).map((el) => name(el) + ' right=' + Math.round(el.getBoundingClientRect().right));
        return { sw, W, offenders };
      }, vp.w);
    }

    if (vp.w === VIEWPORTS[0].w && scheme === 'light') res.links = await checkLinks(page, base, !v.lab);

    const imgs = await page.evaluate(() => [...document.images].map((im) => ({
      src: im.currentSrc || im.src, complete: im.complete, nw: im.naturalWidth, shown: im.getClientRects().length > 0,
    })));
    res.images.n = imgs.length;
    for (const im of imgs) {
      if (im.complete && im.nw > 0) continue;
      if (im.shown || im.complete) { res.images.bad.push(im.src.replace(origin, '') + (im.complete ? ' (broken)' : ' (not loaded)')); continue; }
      /* never rendered (hidden, lazy): the file must still exist */
      const ok = await fetch(im.src, { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
      if (!ok) res.images.bad.push(im.src.replace(origin, '') + ' (hidden, missing)');
    }

    if ((v.axe || v.lab) && axe) {
      await page.addScriptTag({ content: axe });
      res.axe = await page.evaluate(async (tags) => {
        const r = await window.axe.run(document, { runOnly: tags, resultTypes: ['violations'] });
        return r.violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, ex: x.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n').slice(1, 2).join(' ').trim()) }));
      }, AXE_TAGS);
    }
    if (v.weight) {
      const files = (await Promise.all(bodies)).filter(Boolean);
      res.weight = { files, gz: files.reduce((a, f) => a + f.gz, 0), raw: files.reduce((a, f) => a + f.raw, 0) };
    }
  } catch (e) {
    res.console.push('smoke: ' + e.message.split('\n')[0]);
  }
  await ctx.close();
  return res;
}

/* ---------------- search goldens (same rules as the catalogue stream's golden runner) ---------------- */
async function searchGoldens(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await open(page, base + 'catalog/');
  await page.waitForFunction(() => window.DSL && typeof DSL.catalogSearch === 'function' && window.CATALOG_V2, null, { timeout: 15000 });
  const out = [];
  for (const c of goldens) {
    const r = await page.evaluate((c) => {
      const ids = DSL.catalogSearch(c.q), by = {};
      CATALOG_V2.resources.forEach((r) => { by[r.id] = r; });
      const top = c.top || 5, rows = ids.slice(0, top).map((id) => by[id]);
      let ok, detail;
      if (c.expect_id) { ok = ids.slice(0, top).includes(c.expect_id); detail = 'rank ' + (ids.indexOf(c.expect_id) + 1); }
      else if (c.expect_word) {
        const re = new RegExp('(^|[^a-z0-9])' + c.expect_word + '([^a-z0-9]|$)', 'i');
        const dom = {}, kinds = {};
        CATALOG_V2.domains.forEach((d) => { dom[d.id] = d; });
        (CATALOG_V2.kinds || []).forEach((k) => { kinds[k.id] = k; });
        const bad = ids.map((id) => by[id]).filter((r) => {
          const d = dom[r.domain], s = d.sections.find((x) => x.id === r.section) || {}, k = kinds[r.kind] || {};
          return !re.test([r.name, r.name_zh, (r.tags || []).join(' '), r.zh, r.best_for, r.how_to_use, r.zh_how, d.zh, d.en, s.zh, s.en, k.zh, k.en, r.host].join(' \n '));
        });
        ok = !bad.length; detail = bad.length + ' of ' + ids.length + ' hits lack the whole word' + (bad.length ? ': ' + bad.slice(0, 3).map((r) => r.id).join(', ') : '');
      } else {
        const test = c.expect_domain ? (r) => r.domain === c.expect_domain
          : c.expect_section ? (r) => c.expect_section.includes(r.domain + ':' + r.section)
            : (r) => r.id.includes(c.expect_id_contains);
        const n = rows.filter(test).length, need = c.min || top;
        ok = rows.length >= need && n >= need; detail = n + '/' + rows.length + ' in the top ' + top + ' (need ' + need + ')';
      }
      return { ok, detail, hits: ids.length, top: rows.map((r) => r.id + ' [' + r.domain + ':' + r.section + ']') };
    }, c);
    const expect = Object.keys(c).filter((k) => k.startsWith('expect')).map((k) => k + '=' + JSON.stringify(c[k])).join(' ');
    out.push({ q: c.q, expect, ...r });
  }
  for (const q of ['配色', 'font', '动效曲线', 'figma mcp']) {
    await open(page, base + 'catalog/?q=' + enc(q));
    await page.waitForSelector('#out [data-id]', { timeout: 10000 }).catch(() => {});
    const same = await page.evaluate(() => {
      const dom = [...document.querySelectorAll('#out [data-id]')].map((e) => e.dataset.id);
      const eng = DSL.catalogSearch(document.getElementById('q').value).slice(0, dom.length);
      return dom.length > 0 && dom.join() === eng.join();
    });
    out.push({ q, expect: 'rendered order = engine order', ok: same, detail: same ? 'same' : 'differs', hits: null, top: [] });
  }
  await ctx.close();
  return out;
}

/* ---------------- round-2 gates: data freshness, static HTML, no script, 320 px, keys ---------------- */
async function extraGates(browser, base) {
  const out = [];
  const gate = (name, ok, detail) => out.push({ name, ok, detail });
  /* data freshness */
  const man = JSON.parse(readFileSync(join(DOCS, 'assets/thumbs/manifest.json'), 'utf8')).items || {};
  const tw = {};
  vm.runInNewContext(readFileSync(join(DOCS, 'data/thumbs.js'), 'utf8'), { window: tw });
  const ids = new Set(catalog.resources.map((r) => r.id));
  const passed = Object.entries(man).filter(([id, v]) => ids.has(id) && v.file && ['screenshot', 'og', 'github'].includes(v.source) &&
    (v.qa || {}).verdict === 'ok' && existsSync(join(DOCS, 'assets/thumbs', v.file))).map(([id]) => id);
  const wired = new Set(Object.keys(tw.THUMBS || {}));
  const missing = passed.filter((id) => !wired.has(id)), extra = [...wired].filter((id) => !passed.includes(id));
  gate('data/thumbs.js matches the thumbnail manifest', !missing.length && !extra.length,
    missing.length || extra.length ? `${missing.length} QA-passed not wired (${missing.slice(0, 4).join(', ')}), ${extra.length} wired without a passed file; run scripts/build-catalog.py` : `${wired.size} wired`);
  const withThumb = catalog.resources.filter((r) => r.thumb).length;
  gate('data/catalog.json thumb count matches data/thumbs.js', withThumb === wired.size, `${withThumb} rows with a thumb, ${wired.size} in thumbs.js`);
  /* static HTML regions */
  const region = (html, name) => { const m = new RegExp(`<!-- gen:${name} -->([\\s\\S]*?)<!-- /gen:${name} -->`).exec(html); return m ? m[1] : null; };
  const home = readFileSync(join(DOCS, 'index.html'), 'utf8'), cat = readFileSync(join(DOCS, 'catalog/index.html'), 'utf8');
  const cs = region(home, 'case') || '';
  const cells = (cs.match(/class="cell[ "]/g) || []).length, sum = [...cs.matchAll(/c-count num">(\d+)</g)].reduce((a, m) => a + +m[1], 0);
  gate('home case matches the catalogue', cells === catalog.domains.length && sum === catalog.resources.length, `${cells} compartments / ${catalog.domains.length} domains, ${sum} / ${catalog.resources.length} entries`);
  gate('home data stamp matches the catalogue', (region(home, 'stamp') || '').includes(catalog.generated), 'generated ' + catalog.generated);
  gate('home ledger screenshot count matches the catalogue', (region(home, 'ledger') || '').includes(`${withThumb} 张通过质检`), `${withThumb} with a thumb`);
  const rowsN = ((region(cat, 'list') || '').match(/<li id="r-/g) || []).length;
  gate('catalogue no-script list has every entry', rowsN === catalog.resources.length, `${rowsN} / ${catalog.resources.length}`);
  /* no script */
  const nj = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await nj.newPage();
  await open(np, base);
  const nh = await np.evaluate(() => ({
    cells: document.querySelectorAll('#case-rows .cell').length, picks: [...document.querySelectorAll('.picks a')].filter((a) => a.getClientRects().length).length,
    tools: [...document.querySelectorAll('.tool[data-act]')].filter((b) => b.getClientRects().length).length,
    proofs: document.querySelectorAll('.proofs a').length,
  }));
  gate('no script: home shows the case, picks and proofs', nh.cells === catalog.domains.length && nh.picks > 0 && nh.proofs > 0, JSON.stringify(nh));
  gate('no script: no language/theme switch shown', nh.tools === 0, nh.tools + ' visible');
  await open(np, base + 'catalog/');
  const nc = await np.evaluate(() => [...document.querySelectorAll('.static-list li')].filter((li) => li.getClientRects().length).length);
  gate('no script: the catalogue lists every entry', nc === catalog.resources.length, `${nc} / ${catalog.resources.length}`);
  await nj.close();
  /* 320 px */
  const n3 = await browser.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
  const p3 = await n3.newPage();
  for (const path of ['', 'catalog/', 'skills/']) {
    await open(p3, base + path);
    await p3.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); // own scripts have run; other hosts may hang
    const sw = await p3.evaluate(() => document.documentElement.scrollWidth);
    gate(`320 px reflow: /${path}`, sw <= 321, 'scrollWidth ' + sw);
  }
  await n3.close();
  /* fonts: a missing font CDN or a face with wide glyphs must not push 390 px sideways. CI found this on Linux
     while the local run was green, so the check no longer depends on the machine's fonts. */
  const nf = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await nf.route(/cdn\.jsdelivr\.net/, (r) => r.abort());
  const wide = [];
  for (const path of ['', 'catalog/', 'skills/', ...(NO_LAB ? [] : STYLES.map((s) => 'lab/?style=' + s))]) {
    const pf = await nf.newPage();
    await open(pf, base + path);
    await settle(pf);
    const w = await pf.evaluate(() => {
      document.querySelectorAll('input[type=search], input[type=text], input:not([type])').forEach((i) => { i.size = 60; });
      return Math.max(document.documentElement.scrollWidth, innerWidth);
    });
    if (w > 391) wide.push(`/${path} ${w}px`);
    await pf.close();
  }
  gate('390 px without the font CDN and with wide inputs', wide.length === 0, wide.join(', ') || 'every page fits');
  await nf.close();
  /* keys: / type Enter from home, then o */
  const nk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pk = await nk.newPage();
  await open(pk, base);
  await pk.keyboard.press('/');
  await pk.keyboard.type('配色');
  await pk.keyboard.press('Enter');
  await pk.waitForURL(/[?&]id=/, { timeout: 10000 }).catch(() => {});
  const kr = await pk.evaluate(() => ({ url: location.search, note: !!document.querySelector('#note .note-name'), top: window.DSL && DSL.catalogSearch && DSL.catalogSearch('配色')[0] }));
  const id = new URLSearchParams(kr.url).get('id');
  gate('keys: "/" 配色 Enter from home opens the top hit', kr.note && id === kr.top && !/open=/.test(kr.url), `${kr.url} (top hit ${kr.top})`);
  await pk.evaluate(() => { window.__opened = null; window.open = (u) => { window.__opened = u; }; });
  await pk.keyboard.press('o');
  const opened = await pk.evaluate(() => window.__opened);
  const row = catalog.resources.find((r) => r.id === id);
  gate('keys: "o" opens that site', !!row && opened === row.url, String(opened));
  await nk.close();
  return out;
}

/* ---------------- main ---------------- */
const t0 = Date.now();
const { proc, base } = await serve();
const stop = () => { try { proc.kill(); } catch { /* gone */ } };
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });
// Navigation never depends on other hosts: the pages must work when the font CDN hangs, and then the load event
// can be minutes away. Wait for the document, then for load at most 15 s; a late load is reported, not gated.
async function open(page, url, note) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('load', { timeout: 15000 })
    .catch(() => note && note('load event not reached within 15 s (a request to another host is still pending)'));
}

const browser = await chromium.launch();
let axe = null;
try { axe = await axeSource(); } catch (e) { console.error('WARN ' + e.message + ' (axe checks skipped, counted as a failure)'); }

const jobs = [];
for (const v of visits) {
  for (const vp of VIEWPORTS) jobs.push([v, vp, 'light']);
  if (v.axe) jobs.push([v, VIEWPORTS[0], 'dark']);
}
const results = [];
let next = 0;
await Promise.all(Array.from({ length: WORKERS }, async () => {
  while (next < jobs.length) { const [v, vp, s] = jobs[next++]; results.push(await run(browser, base, axe, v, vp, s)); }
}));
const golden = GREP && !GREP.test('search') ? [] : await searchGoldens(browser, base);
const extra = GREP ? [] : await extraGates(browser, base);
await browser.close();
stop();

/* ---------------- report ---------------- */
const order = new Map(jobs.map(([v, vp, s], i) => [v.name + vp.w + s, i]));
results.sort((a, b) => order.get(a.visit + a.w + a.scheme) - order.get(b.visit + b.w + b.scheme));
const vByName = Object.fromEntries(visits.map((v) => [v.name, v]));
const serious = (r) => (r.axe || []).filter((x) => x.impact === 'serious' || x.impact === 'critical');
const fails = [];
const kb = (n) => (n / 1000).toFixed(1) + ' KB';

console.log(`\nsmoke-site · ${visits.length} visits × viewports = ${results.length} page loads · ${base}\n`);
for (const r of results) {
  const v = vByName[r.visit], why = [];
  if (r.console.length) why.push(r.console.length + ' console error(s)');
  if (r.failed.length) why.push(r.failed.length + ' failed same-origin request(s)');
  if (r.overflow && r.overflow.sw > r.overflow.W + 1) why.push(`overflow ${r.overflow.sw}px > ${r.overflow.W}px`);
  if (r.images.bad.length) why.push(r.images.bad.length + ' broken image(s)');
  if (r.links.length) why.push(r.links.length + ' broken link(s)');
  if (v.axe && (!axe || serious(r).length)) why.push(axe ? serious(r).length + ' axe serious/critical rule(s)' : 'axe unavailable');
  if (r.redirect && !r.redirect.ok) why.push('redirect landed on ' + r.redirect.to);
  const tag = `${String(r.w).padStart(4)} ${r.scheme === 'dark' ? 'dark ' : '     '}${r.visit}`;
  const info = [`imgs ${r.images.n - r.images.bad.length}/${r.images.n}`];
  if (r.axe) info.push(`axe ${serious(r).length} serious/critical, ${r.axe.length} rule(s) total`);
  if (r.redirect) info.push('→ ' + r.redirect.to);
  if (r.external.length) info.push(r.external.length + ' external failure(s)');
  console.log(`${why.length ? 'FAIL' : 'pass'}  ${tag.padEnd(44)} ${why.length ? why.join(' · ') : info.join(' · ')}`);
  const detail = [...r.console.map((x) => 'console  ' + x), ...r.failed.map((x) => 'request  ' + x), ...r.images.bad.map((x) => 'image    ' + x), ...r.links.map((x) => 'link     ' + x),
    ...(r.overflow ? r.overflow.offenders.map((x) => 'overflow ' + x) : []),
    ...(v.axe ? serious(r).flatMap((x) => [`axe      ${x.id} (${x.impact}, ${x.n} node(s))`, ...x.ex.map((e) => '           ' + e)]) : [])];
  detail.slice(0, 14).forEach((d) => console.log('        ' + d.slice(0, 220)));
  if (why.length) fails.push(`${tag.trim()}: ${why.join(', ')}`);
}

const lab = results.filter((r) => vByName[r.visit].lab && r.axe);
if (lab.length) {
  console.log('\naxe on the lab (reported, not gated): serious/critical rules per direction');
  for (const r of lab) {
    const s = serious(r);
    console.log(`  ${String(r.w).padStart(4)} ${r.visit.padEnd(24)} ${s.length ? s.map((x) => `${x.id}×${x.n}`).join(', ') : '0'}`);
  }
}

if (golden.length) {
  console.log('\nsearch goldens (docs/assets/search-goldens.json)');
  for (const g of golden) {
    console.log(`${g.ok ? 'pass' : 'FAIL'}  ${JSON.stringify(g.q).padEnd(12)} ${g.expect}  → ${g.detail}${g.hits != null ? ' · ' + g.hits + ' hits' : ''}`);
    if (!g.ok) g.top.forEach((x) => console.log('        ' + x));
    if (!g.ok) fails.push(`search ${JSON.stringify(g.q)}: ${g.expect} → ${g.detail}`);
  }
}

if (extra.length) {
  console.log('\ndata, static HTML, no script, 320 px, keys');
  for (const g of extra) {
    console.log(`${g.ok ? 'pass' : 'FAIL'}  ${g.name.padEnd(52)} ${g.detail}`);
    if (!g.ok) fails.push(`${g.name}: ${g.detail}`);
  }
}

const weights = results.filter((r) => r.weight && r.scheme === 'light');
if (weights.length) {
  console.log(`\nweight before images (gzip for text, raw for fonts; home budget ${kb(BUDGET)})`);
  for (const r of weights) {
    const gate = r.visit === 'home';
    const over = gate && r.weight.gz > BUDGET;
    console.log(`${gate ? (over ? 'FAIL' : 'pass') : 'info'}  ${String(r.w).padStart(4)} ${r.visit.padEnd(10)} ${kb(r.weight.gz)} gzip (${kb(r.weight.raw)} raw, ${r.weight.files.length} files)`);
    if (gate || process.env.V) r.weight.files.sort((a, b) => b.gz - a.gz).slice(0, 8).forEach((f) => console.log(`        ${kb(f.gz).padStart(9)}  ${f.type.padEnd(10)} ${f.url.slice(0, 110)}`));
    if (over) fails.push(`home ${r.w}: ${kb(r.weight.gz)} gzip before images > ${kb(BUDGET)}`);
  }
}

const ext = [...new Set(results.flatMap((r) => r.external))];
if (ext.length) { console.log(`\nexternal request failures (network, not gated): ${ext.length}`); ext.slice(0, 8).forEach((x) => console.log('        ' + x.slice(0, 200))); }

console.log(`\n${fails.length ? fails.length + ' FAILED' : 'all gates passed'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ base, results, golden, fails }, null, 1));
process.exit(fails.length ? 1 : 0);
