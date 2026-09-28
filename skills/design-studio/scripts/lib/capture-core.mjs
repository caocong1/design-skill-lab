// Shared browser-capture primitives (Playwright + Chrome), used by
//   skills/design-studio/scripts/capture.mjs   (agents capturing pages in host projects)
//   scripts/shoot-catalog.mjs                  (the lab's catalogue thumbnails)
//
// Readiness, consent removal, wall detection, pixel QA and WebP encoding all run
// inside Chrome, so the only dependency is Playwright. Playwright is resolved at
// runtime (never a static import) so a missing install produces a clear message.
//
// Pixel work (QA, encoding, frame comparison) runs in a private about:blank page
// per browser, so a captured site's CSP or patched globals cannot interfere.
import { createRequire } from 'node:module';
import { dirname, join, delimiter } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeFileSync, unlinkSync } from 'node:fs';

export const PLAYWRIGHT_VERSION = '1.63.0';

// Pixel QA thresholds, calibrated on the lab's thumbnails at 800x500
// (see the calibration note in scripts/shoot-catalog.mjs). A frame is rejected
// when any one of these holds. tiles = how many of 16 grid tiles are flat (half-painted pages).
export const QA = { stddev: 8, edge: 0.012, dominant: 0.97, tiles: 12 };
// Looser limits for arbitrary app screens (capture.mjs): only frames that are nearly one colour
// (unpainted, spinner-only) fail; a sparse empty state or a minimal page still passes.
export const QA_BLANK = { stddev: 3, edge: 0.001, dominant: 0.995, tiles: Infinity }; // no flat-tile rule: app screens have big flat areas

// ---------------------------------------------------------------- Playwright

// Where Playwright may live: next to this file (the lab's node_modules), the
// current project, or an `npx -p playwright` cache (npx puts its .bin on PATH).
export async function loadPlaywright() {
  const here = dirname(fileURLToPath(import.meta.url));
  const npxDirs = (process.env.PATH || '').split(delimiter)
    .filter((p) => p.endsWith(join('node_modules', '.bin'))).map((p) => dirname(p));
  for (const base of [here, process.cwd(), ...npxDirs]) {
    for (const name of ['playwright', 'playwright-core']) {
      let file;
      try { file = createRequire(join(base, 'noop.js')).resolve(name); } catch { continue; } // not installed there
      const mod = await import(pathToFileURL(file).href);
      const chromium = mod.chromium || (mod.default && mod.default.chromium);
      if (chromium) return chromium;
    }
  }
  return null;
}

// System Chrome first (real codecs, fewer bot flags), bundled Chromium second.
export async function launch({ headless = true } = {}) {
  const chromium = await loadPlaywright();
  if (!chromium) throw Object.assign(new Error('Playwright is not installed'), { code: 'NO_PLAYWRIGHT' });
  const args = ['--disable-blink-features=AutomationControlled', '--hide-scrollbars'];
  try {
    return await chromium.launch({ channel: 'chrome', headless, args });
  } catch (chromeErr) {
    try {
      return await chromium.launch({ headless, args });
    } catch (bundledErr) {
      throw new Error(`Could not start Google Chrome (${firstLine(chromeErr)}) nor Playwright's Chromium ` +
        `(${firstLine(bundledErr)}). Install Google Chrome, or run: npx playwright@${PLAYWRIGHT_VERSION} install chromium`);
    }
  }
}

// ---------------------------------------------------------------- pages

// Hosts of consent-management platforms and ad networks. Blocking them (newPage {block:true}) stops banners
// and anchor ads before they paint, but it is OFF by default: any request interception (Playwright routes, and
// CDP setBlockedURLs too, even matching nothing) makes Cloudflare Turnstile fail silently, so gated content
// never loads while the page still looks fine (measured on designarchives.aiga.org, 2026-09-27).
// dismissConsent removes the same things from the DOM instead.
export const CMP_HOSTS = [
  'cdn.cookielaw.org', 'geolocation.onetrust.com', 'optanon.blob.core.windows.net', 'consent.cookiebot.com',
  'consentcdn.cookiebot.com', 'cdn.privacy-mgmt.com', 'app.usercentrics.eu', 'web.cmp.usercentrics.eu',
  'sdk.privacy-center.org', 'quantcast.mgr.consensu.org', 'cmp.quantcast.com', 'cdn-cookieyes.com',
  'consent.trustarc.com', 'consent.truste.com', 'cmp.osano.com', 'cdn.iubenda.com', 'app.termly.io',
  'cdn.cookie-script.com', 'js.hs-banner.com', 'policy.app.cookieinformation.com', 'cdn.consentmanager.net',
  'transcend-cdn.com',
];
export const AD_HOSTS = [
  'googlesyndication.com', 'doubleclick.net', 'googleadservices.com', 'adservice.google.com', 'amazon-adsystem.com',
  'adnxs.com', 'taboola.com', 'outbrain.com', 'criteo.com', 'criteo.net', 'pubmatic.com', 'rubiconproject.com',
  'openx.net', 'casalemedia.com', 'moatads.com', 'adsrvr.org', 'media.net', 'carbonads.com', 'buysellads.com',
  'ethicalads.io', 'pos.baidu.com', 'cpro.baidustatic.com',
];
const AD_SELECTORS = 'ins.adsbygoogle, [id^="google_ads_iframe"], [id^="div-gpt-ad"], iframe[src*="googlesyndication"], ' +
  'iframe[src*="doubleclick"], #carbonads, [id^="aswift_"], [data-ad-slot], .ad-container, .ad-slot, .ad-wrapper, .ad-banner, ' +
  '.advertisement, .carbon-ad-wrapper'; // whole class tokens only: substrings would hit names like "download-slot"
const onHosts = (hosts) => (url) => hosts.some((h) => url.hostname === h || url.hostname.endsWith('.' + h));

const UA = new WeakMap();   // browser -> native user agent
const NAV = new WeakMap();  // page -> last main-document response

// The browser's own UA with only "HeadlessChrome" corrected, so the UA string and
// the client hints report the same version (a spoofed old version is a bot signal).
export async function userAgent(browser, mobile = false) {
  if (!UA.has(browser)) {
    const ctx = await browser.newContext();
    const ua = await (await ctx.newPage()).evaluate(() => navigator.userAgent);
    await ctx.close();
    UA.set(browser, ua.replace('HeadlessChrome/', 'Chrome/'));
  }
  const ua = UA.get(browser);
  const major = (ua.match(/Chrome\/(\d+)/) || [])[1] || '140';
  return mobile ? `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Mobile Safari/537.36` : ua;
}

// One page in its own fresh context. Mobile emulation (isMobile + touch) below 600 px.
export async function newPage(browser, {
  width = 1280, height = 800, dpr = 1, mobile = width < 600, colorScheme = 'light', reducedMotion = 'reduce',
  locale = 'en-US', storageState, block = false,
} = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile,
    colorScheme, reducedMotion, locale, storageState, ignoreHTTPSErrors: true,
    userAgent: await userAgent(browser, mobile),
  });
  if (block) await ctx.route(onHosts([...CMP_HOSTS, ...AD_HOSTS]), (route) => route.abort());
  const page = await ctx.newPage();
  const nav = { status: null, headers: {}, url: null };
  NAV.set(page, nav);
  page.on('response', (r) => {
    const s = r.status(), req = r.request();
    if (s >= 300 && s < 400) return; // redirects are not the document
    if (!req.isNavigationRequest() || req.serviceWorker() || req.frame() !== page.mainFrame()) return;
    nav.status = s; nav.headers = r.headers(); nav.url = r.url();
  });
  return page;
}

// Status, headers and URL of the document currently shown (updates when a challenge page navigates).
export async function navInfo(page, requested = null) {
  const nav = NAV.get(page) || {};
  const title = await soft(page.title()) || '';
  return { status: nav.status ?? null, finalUrl: page.url(), title, headers: nav.headers || {}, requested };
}

// ---------------------------------------------------------------- readiness

// Best-effort steps may run out, be cut short by a navigation or lose their frame; anything else is a real error.
const EXPECTED = /Timeout|timed out|Execution context was destroyed|navigat|detached|has been closed/i;
async function soft(promise) {
  try { return await promise; } catch (e) { if (EXPECTED.test(String(e && e.message))) return undefined; throw e; }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const firstLine = (e) => String((e && e.message) || e).split('\n')[0].slice(0, 160);

export async function gotoReady(page, url, { timeout = 30000, settle = 1, dwell = 0 } = {}) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  } catch (e) {
    if (!/interrupted by another navigation/i.test(String(e.message))) throw e; // JS redirect: keep going
  }
  await ready(page, { settle, dwell });
  return navInfo(page, url);
}

// load <=15s -> networkidle <=8s -> fonts -> scroll sweep -> back to the start (top, or a #fragment's anchor) -> in-view images and playing videos
// -> optional dwell (delayed intros look "stable" while still blank) -> 2-frame stability. settle scales the caps.
// If a new document replaced the page meanwhile (JS challenge or redirect page), start over (at most twice).
export async function ready(page, { settle = 1, dwell = 0 } = {}, restarts = 0) {
  await soft(page.evaluate(() => { window.__captureDoc = true; }));
  await soft(page.waitForLoadState('load', { timeout: 15000 * settle }));
  await soft(page.waitForLoadState('networkidle', { timeout: 8000 * settle }));
  await soft(Promise.race([page.evaluate(() => document.fonts.ready.then(() => true)), sleep(5000)]));
  await soft(page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const start = scrollY; // not always 0: a URL #fragment scrolls to its anchor, and the capture should start there
    const end = Math.min(document.documentElement.scrollHeight, innerHeight * 4);
    for (let y = 0; y < end; y += innerHeight * 0.8) { scrollTo({ top: y, behavior: 'instant' }); await pause(150); }
    scrollTo({ top: start, behavior: 'instant' });
    await pause(300);
  }));
  await soft(page.waitForFunction(() => [...document.images].every((img) => {
    const r = img.getBoundingClientRect();
    return img.complete || r.bottom <= 0 || r.top >= innerHeight || r.width === 0;
  }), null, { timeout: 5000 * settle, polling: 250 }));
  await soft(page.waitForFunction(() => [...document.querySelectorAll('video')].every((v) => {
    const r = v.getBoundingClientRect();
    return v.readyState >= 2 || v.error || (v.paused && !v.autoplay) || r.bottom <= 0 || r.top >= innerHeight || r.width === 0;
  }), null, { timeout: 5000 * settle, polling: 250 }));
  // Freeze videos where they are. (Resetting one to its poster with load() makes custom players show a spinner.)
  await soft(page.evaluate(() => document.querySelectorAll('video').forEach((v) => v.pause())));
  if (dwell) await sleep(dwell);
  await waitStable(page, 6000 * settle);
  if (restarts < 2 && !(await soft(page.evaluate(() => window.__captureDoc === true)))) await ready(page, { settle, dwell }, restarts + 1);
}

// Two consecutive frames (400 ms apart) differing by under 1% = settled. Catches preloaders and entrance animations.
export async function waitStable(page, capMs = 6000) {
  const tool = await pixelPage(page.context().browser());
  const frame = () => page.screenshot({ type: 'jpeg', quality: 50, scale: 'css', timeout: 10000 });
  let prev = await soft(frame());
  const end = Date.now() + capMs;
  while (prev && Date.now() < end) {
    await sleep(400);
    const cur = await soft(frame());
    if (!cur) return false;
    if (await tool.evaluate(([a, b]) => window.px.diff(a, b), [prev.toString('base64'), cur.toString('base64')]) < 0.01) return true;
    prev = cur;
  }
  return false;
}

// ---------------------------------------------------------------- consent and overlays

const CMP_REJECT = [
  '#onetrust-reject-all-handler', '#CybotCookiebotDialogBodyButtonDecline', '#didomi-notice-disagree-button',
  '.qc-cmp2-summary-buttons button[mode="secondary"]', '[data-testid="uc-deny-all-button"]', '.osano-cm-denyAll',
  '.cky-btn-reject', '.iubenda-cs-reject-btn', '.cm-btn-decline', '.cmplz-deny', '.cc-deny',
  '.govuk-cookie-banner button[value="reject"]', '#shopify-pc__banner__btn-decline', '[data-cookiebanner="reject_button"]',
];
const CMP_ACCEPT = [
  '#onetrust-accept-btn-handler', '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', '#CybotCookiebotDialogBodyButtonAccept',
  '#didomi-notice-agree-button', '.qc-cmp2-summary-buttons button[mode="primary"]', '[data-testid="uc-accept-all-button"]',
  '.osano-cm-accept-all', '.cky-btn-accept', '.iubenda-cs-accept-btn', '.cm-btn-success', '.cmplz-accept',
  '.cc-allow', '.cc-dismiss', '#truste-consent-button', '.fc-cta-consent',
];
const CMP_ROOTS = [
  '#onetrust-consent-sdk', '#onetrust-banner-sdk', '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
  '.qc-cmp2-container', '#usercentrics-root', '#usercentrics-cmp-ui', '#didomi-host', '#truste-consent-track',
  '.truste_overlay', '.osano-cm-window', '#cookiescript_injected', '.cky-consent-container', '.cky-overlay',
  '#cmplz-cookiebanner-container', '.cc-window', '#cookie-law-info-bar', '.govuk-cookie-banner', '.fc-consent-root',
  '[id^="sp_message_container"]', '#hs-eu-cookie-confirmation', '.iubenda-cs-container', '#termly-code-snippet-support',
  '.ons-cookies-banner', '#transcend-consent-manager',
];

// Clears what covers a page before a capture, in this order:
//   1. known CMP buttons in every frame: reject, else accept (locators pierce open shadow roots);
//   2. up to 3 passes over fixed overlays: consent banners (vocabulary + banner/box shape), newsletter
//      prompts (an email field) and modal dialogs get their reject / close / accept button clicked
//      (a modal's close button first);
//   3. removal of known CMP roots, ad slots, remaining consent overlays and modals, and their backdrops;
//      html/body scrolling is restored.
// A modal is a dialog by markup, or by look: a full-viewport scrim dims the page and the topmost thing at the
// viewport centre sits in a fixed layer.
// Returns what it did, e.g. 'clicked:Reject all removed:2', or 'none'.
export async function dismissConsent(page) {
  const done = [];
  for (const frame of page.frames()) {
    // A loading="lazy" iframe that never scrolled into view has no URL and no document yet: locator calls on it
    // wait forever (magculture.com, developer.chrome.com stalled a catalogue run for 20 minutes).
    if (!frame.url()) continue;
    const label = await soft(clickFirst(frame, CMP_REJECT)) || await soft(clickFirst(frame, CMP_ACCEPT));
    if (label) { done.push(`clicked:${label}`); await sleep(700); break; }
  }
  for (let pass = 0; pass < 3; pass++) {
    const label = await soft(page.evaluate(SWEEP, { click: true, roots: CMP_ROOTS, ads: AD_SELECTORS }));
    if (!label) break;
    done.push(`clicked:${label}`);
    await sleep(700);
  }
  const removed = await soft(page.evaluate(SWEEP, { click: false, roots: CMP_ROOTS, ads: AD_SELECTORS, after: done.length > 0 }));
  if (removed) done.push(`removed:${removed}`);
  return done.join(' ') || 'none';
}

// Clears overlays, takes the screenshot (shoot() returns the PNG buffer), then sweeps once more: a popup that
// arrived in the meantime (newsletter widgets on a timer or a scroll trigger) is removed and the shot retaken.
// Returns {png, consent}.
export async function cleanScreenshot(page, shoot) {
  let consent = await dismissConsent(page);
  if (consent !== 'none') await waitStable(page, 3000);
  let png = await shoot();
  const late = await dismissConsent(page);
  if (late !== 'none') {
    consent = `${consent === 'none' ? '' : consent + ' '}late ${late}`;
    await waitStable(page, 3000);
    png = await shoot();
  }
  return { png, consent };
}

async function clickFirst(frame, selectors) {
  const loc = frame.locator(selectors.join(', ')).filter({ visible: true }).first();
  if (!(await loc.count())) return '';
  const label = ((await loc.innerText({ timeout: 1000 })) || 'button').trim().replace(/\s+/g, ' ').slice(0, 30);
  await loc.click({ timeout: 2000 });
  return label;
}

// Runs in the page. {click:true}: click the best button of the first consent overlay or modal, return its label.
// {click:false}: remove CMP roots, ad slots, consent overlays, modals (+ backdrops); return how many were removed.
function SWEEP({ click, roots, ads, after }) {
  const vw = innerWidth, vh = innerHeight;
  const STRONG = /cookie|consent|gdpr|ccpa|tracking technolog|个人信息|使用\s*cookie/i;
  const WEAK = /privacy|newsletter|subscribe|同意|隐私|订阅/i; // not "sign up": hero CTAs say that
  const REJECT = /^(reject( all)?( cookies)?|decline( all)?|deny( all)?|refuse( all)?|(use )?(only )?(strictly )?(necessary|essential)( cookies)?( only)?|拒绝|仅必要|alle ablehnen|ablehnen|tout refuser|refuser|拒否)$/i;
  const CLOSE = /^(close|dismiss)\b|^(no,? thanks|not now|maybe later|skip|later)$|^[×✕✖xX]$|^关闭|以后再说|跳过|暂不/i;
  const ACCEPT = /^(accept( all)?( cookies)?|allow( all)?( cookies)?|agree|i agree|i accept|got it|ok(ay)?|understood|continue|同意|接受|我知道了|知道了|全部接受|alle akzeptieren|akzeptieren|tout accepter|accepter|同意する)$/i;
  const MODAL = 'dialog[open], [aria-modal="true"]';
  const EMAIL = 'input[type=email], input[name*=mail i], input[placeholder*=mail i], input[placeholder*=邮箱]';
  const all = [];
  (function walk(root) { for (const e of root.querySelectorAll('*')) { all.push(e); if (e.shadowRoot) walk(e.shadowRoot); } })(document);
  const textOf = (e) => ((e.innerText || '') + ' ' + (e.shadowRoot ? e.shadowRoot.textContent : '')).replace(/\s+/g, ' ').trim();
  const overlays = [], scrims = [];
  const alpha = (c) => (c.startsWith('rgba') ? Number(c.match(/[\d.]+/g)[3]) : c.startsWith('rgb') ? 1 : 0);
  const page = (e) => e === document.body || e === document.documentElement; // app shells fix <body> itself (shots.so)
  for (const e of all) {
    if (page(e)) continue;
    const cs = getComputedStyle(e);
    const fixed = cs.position === 'fixed'; // not sticky: sticky heroes and headers are page content
    if (!fixed && !e.matches(MODAL)) continue;
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= vh) continue;
    // Taller than the viewport = the page itself: smooth-scroll sites keep all content in one fixed wrapper that is
    // translated as you scroll (topys.cn: 1280x7628, footer says 个人信息). Overlays are sized to the viewport.
    if (r.height > vh * 1.2) continue;
    const area = (Math.min(r.right, vw) - Math.max(r.left, 0)) * (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / (vw * vh);
    const text = textOf(e);
    const strong = STRONG.test(text) && text.length < 3000;
    const weak = WEAK.test(text) && text.length < 1500 && area > 0.2;
    const header = r.top <= 2 && r.height < 160 && !strong;
    // banner along the top or bottom edge (or floating up to 32px off it: getstark.co), box clear of both sides,
    // card of any position, or full-screen layer
    const shaped = (r.width >= vw * 0.6 && (r.bottom >= vh - 32 || r.top <= 32)) || (r.left > 4 && r.right < vw - 4)
      || (r.width < vw * 0.6 && r.height < vh * 0.6) || area > 0.6;
    const modal = text.length < 4000 && (e.matches(MODAL) || (fixed && area > 0.6 && e.querySelector(`${MODAL}, [role="dialog"]`)));
    // Newsletter prompt, any shape. It stacks above the page and has no h1; a fixed hero with an email
    // signup (github.com: z-index 0, holds the h1) is page content.
    const signup = fixed && Number(cs.zIndex) > 0 && text.length < 1500 && area > 0.05 && !e.querySelector('h1') && e.querySelector(EMAIL);
    const backdrop = area > 0.6 && !text && !e.querySelector('img,video,canvas,svg,picture') && Number(cs.zIndex) >= 10;
    const tint = alpha(cs.backgroundColor) * Number(cs.opacity);
    if (fixed && area > 0.6 && ((tint > 0.05 && tint < 0.98) || (cs.backdropFilter || 'none') !== 'none')) scrims.push(e);
    if (!header && ((shaped && (strong || weak)) || signup)) overlays.push({ e, kind: 'consent' });
    else if (modal) overlays.push({ e, kind: 'modal' });
    else if (backdrop) overlays.push({ e, kind: 'backdrop' });
  }
  // Modal by look (same.energy, lummi.ai's role=dialog without aria-modal, isqqw.com's promo layer): with a scrim
  // present, the outermost fixed layer under the viewport centre is the modal. In-flow content there = no modal.
  if (scrims.length) {
    let layer = null;
    for (let x = document.elementFromPoint(vw / 2, vh / 2); x && !page(x); x = x.parentElement || (x.getRootNode() || {}).host) {
      if (getComputedStyle(x).position === 'fixed') layer = x;
    }
    const r = layer && layer.getBoundingClientRect();
    if (layer && r.height <= vh * 1.2 && textOf(layer).length < 4000 && !overlays.some((o) => o.e === layer)) {
      overlays.push({ e: layer, kind: 'modal' });
      for (const s of scrims) if (s !== layer && !layer.contains(s)) overlays.push({ e: s, kind: 'backdrop' });
    }
  }
  if (click) {
    const label = (b) => ((b.innerText || '').trim() || b.value || b.getAttribute('aria-label') || b.title || '').replace(/\s+/g, ' ').trim();
    for (const { e, kind } of overlays) {
      if (kind === 'backdrop') continue;
      const found = [];
      (function walk(root) {
        for (const b of root.querySelectorAll('button,[role=button],input[type=button],input[type=submit],a,[aria-label]')) {
          const href = b.tagName === 'A' ? b.getAttribute('href') : null;
          if (href && !href.startsWith('#') && !href.startsWith('javascript')) continue; // never navigate away
          const r = b.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) found.push(b);
        }
        for (const x of root.querySelectorAll('*')) if (x.shadowRoot) walk(x.shadowRoot);
      })(e.shadowRoot || e);
      for (const re of kind === 'modal' ? [CLOSE, REJECT, ACCEPT] : [REJECT, CLOSE, ACCEPT]) {
        const b = found.find((x) => re.test(label(x)));
        if (b) { b.click(); return (label(b) || 'button').slice(0, 30); }
      }
    }
    return '';
  }
  let n = 0;
  for (const s of roots) document.querySelectorAll(s).forEach((e) => { e.remove(); n++; });
  document.querySelectorAll(ads).forEach((e) => e.remove());
  for (const { e, kind } of overlays) {
    if (!e.isConnected) continue;
    if (kind === 'backdrop' && !(n || after)) continue; // a lone full-screen layer is only removed after its dialog
    e.remove(); n++;
  }
  if (n || after) {
    for (const el of [document.documentElement, document.body]) {
      if (!el) continue;
      el.removeAttribute('inert');
      if (getComputedStyle(el).overflowY === 'hidden') el.style.setProperty('overflow', 'visible', 'important');
    }
  }
  return n;
}

// ---------------------------------------------------------------- walls and errors

const WALL_TITLE = /^(just a moment|attention required|access denied|403 forbidden|404 not found|page not found|not found|one moment,? please|please wait|security check|verifying|are you a robot|robot or human|pardon our interruption|request rejected|website unavailable|site not found|database unavailable|service unavailable|bad gateway|error\s*\d{3}|40[34]\b|50[23]\b|安全验证|访问验证|人机验证|验证码|页面不存在|访问受限|异常访问)|\|\s*cloudflare$/i;
const WALL_TEXT = new RegExp([
  'just a moment', 'one moment,? please', 'checking (your|if the site connection is secure)', 'verif(y|ying) (that )?you are (a )?human',
  'performing security verification', 'please wait while your request is being verified', 'please continue when verification is complete',
  'attention required', 'sorry,? you have been blocked', 'you are unable to access', 'access denied', 'access to this page has been denied',
  'pardon our interruption', 'the request could not be satisfied', 'request unsuccessful', 'the requested url was rejected',
  "you don.?t have permission to access", '403 forbidden', '404 not found', 'page not found', 'this page (could not|cannot) be found',
  'database unavailable', 'service (temporarily )?unavailable', 'bad gateway', 'internal server error', 'enable javascript and cookies to continue',
  'are you a robot', 'press (and|&) hold', 'you are being redirected', 'site can.?t be reached',
  '(page|content) you.?re looking for (seems to have disappeared|does(n.?t| not) exist|(can|could)(no|n.?)t be found)',
  '请完成安全验证', '安全验证', '访问验证', '人机验证', '滑动验证', '请完成验证', '异常访问', '访问受限', '访问被拒绝', '页面不存在', '页面未找到', '服务不可用',
  'アクセスが拒否', 'ページが見つかりません', '접근이 거부',
].join('|'), 'i');
const WALL_MARKERS = [
  '#challenge-form', '#challenge-running', '#challenge-stage', '#cf-challenge-running', '#cf-please-wait', '.cf-error-details',
  '#cf-error-details', '#px-captcha', '#sgcaptcha', '[class^="geetest_"]', '#nc_1_wrapper', '#tcaptcha_iframe', '#captcha-box',
];
const CAPTCHA_FRAMES = /challenges\.cloudflare\.com|hcaptcha\.com|captcha-delivery\.com|google\.com\/recaptcha|geetest|tcaptcha/i;
const LOGIN = /^(accounts?|login|signin|passport|auth|sso)\.|\/(login|log-in|signin|sign-in|sign_in|passport|auth|sso)(\.\w+)?(\/|$|\?|#)/i;

const ERROR_PAGE = /not found|could not be found|cannot be found|disappeared|does(n.?t| not) exist|unavailable|bad gateway|server error|can.?t be reached|^error|^404|^50\d|不存在|未找到|不可用|見つかりません/i;

// Multi-signal: status, vendor headers, DOM markers, captcha frames, title and (short-page) text, login redirects.
// `nav` is what gotoReady / navInfo returned. Returns {walled, kind, reason}; kind is
// 'wall' (anti-bot or access block), 'error' (not found, server error) or 'login' (redirected to sign in).
export async function detectWall(page, nav) {
  const h = nav.headers || {};
  const vendor = h['cf-mitigated'] || h['cf-ray'] ? 'cloudflare' : h['x-amz-cf-id'] ? 'cloudfront'
    : h['x-sucuri-id'] ? 'sucuri' : h['x-datadome'] ? 'datadome' : h['x-iinfo'] ? 'imperva' : '';
  const hit = (kind, reason) => ({ walled: true, kind, reason });
  if (h['cf-mitigated'] === 'challenge') return hit('wall', 'cloudflare challenge');
  if (nav.status >= 400) {
    const blocked = vendor || [401, 403, 405, 429, 451].includes(nav.status);
    return hit(blocked ? 'wall' : 'error', `http ${nav.status}${vendor ? ' ' + vendor : ''}`);
  }
  const dom = await soft(page.evaluate((markers) => {
    const text = ((document.body && document.body.innerText) || '').replace(/\s+/g, ' ').trim();
    return { title: document.title || '', text: text.slice(0, 3000), len: text.length, markers: markers.filter((s) => document.querySelector(s)) };
  }, WALL_MARKERS));
  if (!dom) return hit('wall', 'page kept navigating');
  if (dom.markers.length) return hit('wall', `challenge markup ${dom.markers[0]}`);
  const title = dom.title.trim();
  if (WALL_TITLE.test(title)) return hit(ERROR_PAGE.test(title) ? 'error' : 'wall', `title "${title.slice(0, 50)}"`);
  const m = dom.len < 2500 && dom.text.match(WALL_TEXT);
  if (m) return hit(ERROR_PAGE.test(m[0]) ? 'error' : 'wall', `text "${m[0]}"`);
  // A captcha frame alone is no wall: forms embed invisible reCAPTCHA v3 / Turnstile widgets on normal pages
  // (awwwards.com, pricingpages.design, image galleries with little text). It is one when it covers a real part
  // of the viewport (a challenge dialog or a full-page captcha) or the page holds almost nothing else.
  const captchas = page.frames().filter((f) => f !== page.mainFrame() && CAPTCHA_FRAMES.test(f.url()));
  if (captchas.length) {
    const vp = page.viewportSize() || { width: 1280, height: 800 };
    let cover = 0;
    for (const f of captchas) {
      const box = await soft(f.frameElement().then((el) => el.boundingBox()));
      if (box) cover = Math.max(cover, (box.width * box.height) / (vp.width * vp.height));
    }
    if (dom.len < 300 || cover > 0.2) return hit('wall', `captcha frame${cover > 0.2 ? ` covering ${Math.round(cover * 100)}%` : ''}`);
  }
  const final = nav.finalUrl || '', asked = nav.requested || '';
  if (LOGIN.test(final.replace(/^https?:\/\//, '')) && !LOGIN.test(asked.replace(/^https?:\/\//, ''))) return hit('login', 'login redirect');
  return { walled: false, kind: null, reason: null };
}

// ---------------------------------------------------------------- pixels (run in a private page)

const TOOLS = new WeakMap(); // browser -> Promise<page>

export async function pixelPage(browser) {
  if (!TOOLS.has(browser)) {
    TOOLS.set(browser, (async () => {
      const page = await (await browser.newContext()).newPage();
      await page.evaluate(PIXEL_LIB);
      return page;
    })());
  }
  return TOOLS.get(browser);
}

// Installs window.px in the tool page: decode, stats, diff, encode. Images travel as base64.
function PIXEL_LIB() {
  const decode = async (b64) => createImageBitmap(await (await fetch('data:application/octet-stream;base64,' + b64)).blob());
  const draw = (bmp, w, h, bg = '#fff') => {
    const c = new OffscreenCanvas(w, h), g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = bg; g.fillRect(0, 0, w, h); g.imageSmoothingQuality = 'high'; g.drawImage(bmp, 0, 0, w, h);
    return g.getImageData(0, 0, w, h).data;
  };
  window.px = {
    // Grey-level stddev; edge density = share of pixels whose 3x3 Laplacian (8*c - neighbours) exceeds 40
    // (the same kernel as PIL FIND_EDGES); dominant = share of the most common colour (32 levels per channel).
    async stats(b64) {
      const bmp = await decode(b64);
      const s = Math.min(1, 1280 / bmp.width), w = Math.round(bmp.width * s), h = Math.round(bmp.height * s);
      const d = draw(bmp, w, h), n = w * h, L = new Float32Array(n), bins = new Uint32Array(32768);
      let sum = 0, sum2 = 0;
      for (let i = 0, j = 0; j < n; i += 4, j++) {
        const l = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        L[j] = l; sum += l; sum2 += l * l;
        bins[((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3)]++;
      }
      let edges = 0;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const k = y * w + x;
        const v = 8 * L[k] - L[k - w - 1] - L[k - w] - L[k - w + 1] - L[k - 1] - L[k + 1] - L[k + w - 1] - L[k + w] - L[k + w + 1];
        if (v > 40) edges++;
      }
      let top = 0; for (const b of bins) if (b > top) top = b;
      let tiles = 0; // 4x4 grid; a tile is flat when its grey-level stddev is under 3
      for (let ty = 0; ty < 4; ty++) for (let tx = 0; tx < 4; tx++) {
        let ts = 0, ts2 = 0, tn = 0;
        for (let y = Math.floor(ty * h / 4); y < Math.floor((ty + 1) * h / 4); y++) {
          for (let x = Math.floor(tx * w / 4); x < Math.floor((tx + 1) * w / 4); x++) { const l = L[y * w + x]; ts += l; ts2 += l * l; tn++; }
        }
        if (Math.sqrt(Math.max(0, ts2 / tn - (ts / tn) ** 2)) < 3) tiles++;
      }
      const mean = sum / n;
      return { w: bmp.width, h: bmp.height, stddev: Math.sqrt(Math.max(0, sum2 / n - mean * mean)), edge: edges / ((w - 2) * (h - 2)), dominant: top / n, tiles };
    },
    // Mean absolute RGB difference of two frames at 160x100, 0..1.
    async diff(a, b) {
      const [x, y] = await Promise.all([a, b].map(async (v) => draw(await decode(v), 160, 100)));
      let t = 0; for (let i = 0; i < x.length; i += 4) t += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]);
      return t / (160 * 100 * 3 * 255);
    },
    async encode(b64, { width, height, quality, fit, background }) {
      const bmp = await decode(b64);
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      const g = c.getContext('2d');
      g.fillStyle = background; g.fillRect(0, 0, width, height); g.imageSmoothingQuality = 'high';
      const s = (fit === 'contain' ? Math.min : Math.max)(width / bmp.width, height / bmp.height);
      const dw = bmp.width * s, dh = bmp.height * s;
      g.drawImage(bmp, (width - dw) / 2, (height - dh) / 2, dw, dh);
      const url = c.toDataURL('image/webp', quality);
      if (!url.startsWith('data:image/webp')) throw new Error('this browser cannot encode WebP');
      return url.slice(url.indexOf(',') + 1);
    },
  };
}

// Pixel QA of any image buffer. Returns {verdict:'ok'|'reject', reason, stddev, edge, dominant, tiles, w, h}.
export async function pixelQA(page, buf, limits = QA) {
  const tool = await pixelPage(page.context().browser());
  const m = await tool.evaluate((b64) => window.px.stats(b64), buf.toString('base64'));
  const reason = m.stddev < limits.stddev ? `flat (stddev ${m.stddev.toFixed(1)})`
    : m.edge < limits.edge ? `blank (edge ${m.edge.toFixed(4)})`
      : m.dominant > limits.dominant ? `uniform (dominant ${m.dominant.toFixed(3)})`
        : m.tiles >= limits.tiles ? `sparse (${m.tiles}/16 flat tiles)` : null;
  return {
    verdict: reason ? 'reject' : 'ok', reason, w: m.w, h: m.h,
    stddev: Math.round(m.stddev * 10) / 10, edge: Math.round(m.edge * 10000) / 10000, dominant: Math.round(m.dominant * 1000) / 1000, tiles: m.tiles,
  };
}

// Resize + encode inside Chrome (no sharp/cwebp). fit 'cover' crops to fill, 'contain' letterboxes on `background`.
export async function encodeWebp(page, buf, { width = 800, height = 500, quality = 0.78, fit = 'cover', background = '#ffffff' } = {}) {
  const tool = await pixelPage(page.context().browser());
  const b64 = await tool.evaluate(([b, o]) => window.px.encode(b, o), [buf.toString('base64'), { width, height, quality, fit, background }]);
  return Buffer.from(b64, 'base64');
}

// Natural size of an image buffer (decoded by Chrome). Throws when Chrome cannot decode it.
export async function imageSize(page, buf) {
  const tool = await pixelPage(page.context().browser());
  return tool.evaluate(async (b64) => {
    const bmp = await createImageBitmap(await (await fetch('data:application/octet-stream;base64,' + b64)).blob());
    return { w: bmp.width, h: bmp.height };
  }, buf.toString('base64'));
}

// ---------------------------------------------------------------- contact sheet

// Renders a labelled grid of images to a PNG. tiles: [{file: absolute path | null, title, lines: [..], bad: bool}].
export async function contactSheet(browser, tiles, outPath, { cols = 5, tileWidth = 256, heading = '' } = {}) {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cells = tiles.map((t) => `<figure class="${t.bad ? 'bad' : ''}">${t.file
    ? `<img src="${pathToFileURL(t.file).href}">` : '<div class="none">no image</div>'}
    <figcaption><b>${esc(t.title)}</b>${(t.lines || []).map((l) => `<span>${esc(l)}</span>`).join('')}</figcaption></figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:16px;background:#f3f3f1;font:12px/1.35 -apple-system,system-ui,sans-serif;color:#222}
    h1{font-size:15px;margin:0 0 12px}
    main{display:grid;grid-template-columns:repeat(${cols},${tileWidth}px);gap:12px;align-items:start}
    figure{margin:0;background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden}
    figure.bad{border:2px solid #d33}
    img{display:block;width:100%;height:auto;border-bottom:1px solid #eee}
    .none{aspect-ratio:8/5;display:grid;place-items:center;background:repeating-linear-gradient(45deg,#eee 0 8px,#f7f7f7 8px 16px);color:#888}
    figcaption{padding:6px 8px;display:grid;gap:2px}figcaption span{color:#555;overflow-wrap:anywhere}
  </style>${heading ? `<h1>${esc(heading)}</h1>` : ''}<main>${cells}</main>`;
  const htmlPath = outPath.replace(/\.png$/i, '') + '.sheet.html';
  writeFileSync(htmlPath, html);
  const page = await newPage(browser, { width: cols * (tileWidth + 12) + 20, height: 600, reducedMotion: 'no-preference' });
  try {
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
    await page.screenshot({ path: outPath, fullPage: true });
  } finally {
    await page.context().close();
    unlinkSync(htmlPath);
  }
  return outPath;
}
