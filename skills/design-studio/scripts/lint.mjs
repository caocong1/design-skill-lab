#!/usr/bin/env node
// Deterministic design lint on a rendered page: the mechanical floor under a critique, never a verdict.
// Needs Playwright + Chrome (or Playwright's Chromium), resolved like capture.mjs (lib/capture-core.mjs).
//
//   node lint.mjs <url-or-file> [--viewports 1280x800,390x844] [--dark] [--json] [--max 8] [--strict]
//                 [--scope css-selector] [--auth storage-state.json]
//
//   node lint.mjs .design/screens/home.html                 light at 1280x800 and 390x844 (touch)
//   node lint.mjs "http://localhost:5173/orders?state=empty-first" --dark   adds the same sizes in dark
//   node lint.mjs ios.html --viewports 402x874                native frames: pass their sizes (390 is web)
//   node lint.mjs page.html --json > .design/critique/2026-09-27-home/lint.json
//   node lint.mjs .design/directions/r1/index.html --scope '[data-direction="a"]'   one direction of a board
//
// Floor (exit 1)
//   contrast         text under 4.5:1, or 3:1 at >= 24px or >= 18.66px bold. Computed from the element
//                    and ancestor colours (group opacity included) and measured on the render: text made
//                    transparent, background pixels under each line sampled, the ratio 90% of them meet.
//                    The measurement wins when the two disagree (images, gradients, overlapping layers).
//   overflow         the page scrolls sideways at any viewport; names the element that sticks out.
//   unnamed-control  a button, link, field or other control with an empty name in Chrome's a11y tree.
// Warnings
//   contrast-unverified (text over an image that could not be sampled), overflow-clipped (content cut
//   by overflow-x on html/body), target-size (< 24x24 px, WCAG 2.5.8 with its spacing and inline
//   exceptions), touch-target (< 44x44 px at touch sizes), img-alt, transition-all, layout-animation
//   (transitions or keyframes on width, top, margin...), reduced-motion (motion identical under
//   prefers-reduced-motion: reduce), cjk-lang (CJK text without a zh/ja/ko lang), cjk-font (Chinese in
//   a Japanese-first stack, or rendered by a Japanese font), cjk-synthetic (italic or faux-bold CJK),
//   input-zoom (fields under 16px at touch sizes: iOS zooms), token-drift (near-duplicate values),
//   vocabulary (more distinct values than a constrained system uses).
// Inventory: colours, font sizes, weights, line heights, families, radii, shadows, spacing, z-index and
//   durations actually used across all runs, with near-duplicate clusters.
// --strict   target-size and img-alt also fail the floor.
// --scope    only elements inside this selector are checked and inventoried (overflow stays page-wide).
// --auth     a Playwright storage-state file (saved login) for routes behind sign-in.
// Not checked: non-text contrast (borders, icons, focus rings: color_tools.py matrix --from checks the
//   token pairs), focus visibility, keyboard order, requestAnimationFrame motion, text inside images,
//   iframes. Those stay with the critique and the screenshots.
// Exit: 0 floor passes, 1 floor fails, 2 usage error, Playwright missing, or the page did not load.
import { existsSync, readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launch, newPage, gotoReady, detectWall, PLAYWRIGHT_VERSION } from './lib/capture-core.mjs';

const SELF = fileURLToPath(import.meta.url);
const FLOOR = new Set(['contrast', 'overflow', 'unnamed-control']);
const RULES = {
  contrast: 'text below 4.5:1 (3:1 at >= 24px or >= 18.66px bold)',
  overflow: 'the page scrolls sideways',
  'unnamed-control': 'controls with no accessible name',
  'contrast-unverified': 'text over an image or gradient that could not be measured: check the render',
  'overflow-clipped': 'content wider than the viewport, cut off by overflow-x on html/body',
  'target-size': 'targets under 24x24 px (WCAG 2.5.8)',
  'touch-target': 'touch targets under 44x44 px (Apple 44 pt, Material 48 dp)',
  'img-alt': 'images without alt (decorative images take alt="")',
  'transition-all': 'transition: all (name the properties)',
  'layout-animation': 'animated layout properties (animate transform and opacity)',
  'reduced-motion': 'motion unchanged under prefers-reduced-motion: reduce',
  'cjk-lang': 'CJK text without a matching lang (glyph forms and line breaking follow lang)',
  'cjk-font': 'Chinese text in a Japanese font (glyph forms differ)',
  'cjk-synthetic': 'synthesised italic or bold on CJK text',
  'input-zoom': 'fields under 16px at touch sizes (iOS Safari zooms on focus)',
  'token-drift': 'near-duplicate values: merge them into one token',
  vocabulary: 'more distinct values than a constrained vocabulary uses',
};
// Soft budgets across all runs (practice, not a standard): above them the scale is probably not a scale.
const BUDGET = { fontSize: 10, fontWeight: 4, family: 3, lineHeight: 6, radius: 6, shadow: 6, duration: 6, zIndex: 10 };
const SHOT_CAP = 12000; // px of page height measured on pixels; text below falls back to computed colours
const CONTROL_ROLES = new Set(['button', 'link', 'textbox', 'searchbox', 'combobox', 'checkbox', 'radio', 'switch',
  'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'slider', 'spinbutton', 'listbox', 'treeitem']);

// ------------------------------------------------------------------ arguments

function parseArgs(argv) {
  const o = { viewports: ['1280x800', '390x844'], dark: false, json: false, max: 8, strict: false, auth: null, scope: null, target: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) usage(`${a} needs a value`);
      return v;
    };
    if (a === '-h' || a === '--help') usage();
    else if (a === '--dark') o.dark = true;
    else if (a === '--json') o.json = true;
    else if (a === '--strict') o.strict = true;
    else if (a === '--max') o.max = Number(value());
    else if (a === '--auth') o.auth = value();
    else if (a === '--scope') o.scope = value();
    else if (a === '--viewports') o.viewports = value().split(',').map((s) => s.trim()).filter(Boolean);
    else if (a.startsWith('--')) usage(`unknown option ${a}`);
    else if (!o.target) o.target = a;
    else usage(`unexpected argument ${a}`);
  }
  if (!o.target) usage('a URL or file is required');
  if (!o.viewports.every((v) => /^\d+x\d+$/.test(v))) usage('--viewports takes WxH,WxH (e.g. 1280x800,390x844)');
  if (!Number.isInteger(o.max) || o.max < 1) usage('--max takes a positive integer');
  if (o.auth && !existsSync(o.auth)) usage(`no such storage-state file: ${o.auth}`);
  return o;
}

function usage(error) {
  if (error) {
    process.stderr.write(`lint.mjs: ${error}\nusage: node lint.mjs <url-or-file> [--viewports WxH,...] [--dark] [--json] [--max n] [--strict] [--scope sel] [--auth state.json]\n`);
    process.exit(2);
  }
  const lines = [];
  for (const line of readFileSync(SELF, 'utf8').split('\n').slice(1)) {
    if (!line.startsWith('//')) break;
    lines.push(line.replace(/^\/\/ ?/, ''));
  }
  process.stdout.write(lines.join('\n') + '\n');
  process.exit(0);
}

function toUrl(target) {
  if (/^(https?|file):\/\//i.test(target)) return target;
  const m = target.match(/^([^?#]*)(.*)$/);
  const path = resolvePath(m[1]);
  if (!existsSync(path)) usage(`no such file: ${m[1]}`);
  return pathToFileURL(path).href + m[2];
}

// ------------------------------------------------------------------ colour maths (Node side)

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const wcag = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
  + (c[3] !== undefined && c[3] < 0.995 ? Math.round(c[3] * 255).toString(16).padStart(2, '0') : '');
function oklab(c) {
  const [r, g, b] = c.slice(0, 3).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

// ------------------------------------------------------------------ in-page work (serialised into the page)

// One function so helpers are defined once. Modes: finish, motion, collect, hide, show, selectors, unmark.
function PAGE([mode, opt = {}]) {
  const HAN = /[㐀-䶿一-鿿豈-﫿]/, KANA = /[぀-ヿ]/, HANGUL = /[가-힯ᄀ-ᇿ]/;
  const JP_FONT = /hiragino (kaku|mincho|maru)|hiragino sans(?! gb)|hiraginosans-|yu ?gothic|yu ?mincho|meiryo|ms p?gothic|ms p?mincho|(noto|source han) (sans|serif)( cjk)? jp|biz ud|m plus|kozuka|osaka|sawarabi|zen (kaku|maru|old)|ipaex?(gothic|mincho)/;
  const ZH_FONT = /pingfang|hiragino sans gb|heiti|stheiti|songti|stsong|yahei|jhenghei|simsun|simhei|kaiti|fangsong|(noto|source han) (sans|serif)( cjk)? (sc|tc|hk|cn|tw)|harmonyos sans (sc|tc)|misans|puhuiti|lxgw|wenkai|dengxian|苹方|微软雅黑|黑体|宋体|思源/;
  const LAYOUT = /^(width|height|min-width|min-height|max-width|max-height|top|left|right|bottom|inset.*|margin.*|padding.*|border(-top|-right|-bottom|-left)?-width|font-size|line-height|letter-spacing|flex|flex-basis|gap|row-gap|column-gap|grid-template-(rows|columns))$/;
  const MOVING = /^(all|transform|translate|scale|rotate|offset.*|background-position|perspective)$/;
  const parentOf = (n) => n.parentElement || (n.getRootNode && n.getRootNode().host) || null;
  const inScope = (el) => !opt.scope || !!el.closest(opt.scope);
  const styles = new Map();
  const cs = (el) => { let s = styles.get(el); if (!s) { s = getComputedStyle(el); styles.set(el, s); } return s; };
  const elements = () => {
    const out = [];
    const walk = (root) => { for (const el of root.querySelectorAll('*')) { out.push(el); if (el.shadowRoot) walk(el.shadowRoot); } };
    if (document.body) { out.push(document.body); walk(document.body); }
    return out;
  };
  const sel = (el) => {
    const parts = [];
    for (let n = el, depth = 0; n && n.nodeType === 1 && depth < 4; n = n.parentElement, depth++) {
      let p = n.localName;
      if (n.id && /^[A-Za-z][\w-]*$/.test(n.id)) { parts.unshift(`${p}#${n.id}`); break; }
      const cls = [...n.classList].filter((c) => /^[A-Za-z_][\w-]*$/.test(c) && c.length < 32).slice(0, 2);
      if (cls.length) p += '.' + cls.join('.');
      if (n.parentElement) {
        const same = [...n.parentElement.children].filter((c) => c.localName === n.localName);
        if (same.length > 1) p += `:nth-of-type(${same.indexOf(n) + 1})`;
      }
      parts.unshift(p);
      if (p.startsWith('body')) break;
    }
    return parts.join(' > ');
  };
  const snippet = (el) => (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 48);
  const visible = (el, opacity = true) => el.checkVisibility
    ? el.checkVisibility({ opacityProperty: opacity, visibilityProperty: true, contentVisibilityAuto: true })
    : cs(el).display !== 'none' && cs(el).visibility === 'visible';
  const ms = (t) => (t.trim().endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 0;
  const list = (t) => t.split(',').map((s) => s.trim());

  if (mode === 'finish') {
    let n = 0;
    for (const a of document.getAnimations()) {
      try { if (Number.isFinite(a.effect.getComputedTiming().endTime)) { a.finish(); n++; } } catch { /* infinite or detached */ }
    }
    scrollTo(0, 0);
    return n;
  }

  if (mode === 'hide' || mode === 'show') {
    if (mode === 'hide') {
      const saved = window.__lintSaved = [];
      const props = [['color', 'transparent'], ['-webkit-text-fill-color', 'transparent'], ['text-shadow', 'none'], ['transition', 'none'], ['caret-color', 'transparent']];
      for (const el of elements()) {
        if (!el.style) continue;
        const svgText = el instanceof SVGElement && /^(text|tspan|textPath)$/.test(el.localName);
        const own = svgText ? [...props, ['fill', 'transparent'], ['stroke', 'transparent']] : props;
        saved.push([el, own.map(([p]) => [p, el.style.getPropertyValue(p), el.style.getPropertyPriority(p)])]);
        for (const [p, v] of own) el.style.setProperty(p, v, 'important');
      }
    } else {
      for (const [el, props] of window.__lintSaved || []) for (const [p, v, prio] of props) {
        if (v) el.style.setProperty(p, v, prio); else el.style.removeProperty(p);
      }
      window.__lintSaved = null;
    }
    return true;
  }

  if (mode === 'selectors' || mode === 'unmark') {
    const out = [];
    for (const el of document.querySelectorAll(`[${opt.attr}]`)) {
      if (inScope(el)) out.push({ i: Number(el.getAttribute(opt.attr)), sel: sel(el), text: snippet(el) });
      el.removeAttribute(opt.attr);
    }
    return out;
  }

  // Keyframes: name -> Set of animated properties; plus whether any stylesheet mentions reduced motion.
  const keyframes = new Map();
  let reducedMotionCss = false;
  const walkRules = (rules) => {
    for (const r of rules) {
      if (r instanceof CSSKeyframesRule) {
        const props = keyframes.get(r.name) || new Set();
        for (const k of r.cssRules) for (let i = 0; i < k.style.length; i++) props.add(k.style[i]);
        keyframes.set(r.name, props);
      } else {
        const cond = r.conditionText || (r.media && r.media.mediaText) || '';
        if (/prefers-reduced-motion/.test(cond)) reducedMotionCss = true;
        if (r.cssRules) walkRules(r.cssRules);
      }
    }
  };
  const sheets = [...document.styleSheets, ...(document.adoptedStyleSheets || [])];
  for (const el of elements()) if (el.shadowRoot) sheets.push(...el.shadowRoot.styleSheets, ...(el.shadowRoot.adoptedStyleSheets || []));
  for (const sh of sheets) { try { walkRules(sh.cssRules); } catch { /* cross-origin sheet */ } }
  const animProps = (a) => {
    try { return a.effect.getKeyframes().flatMap((k) => Object.keys(k)).filter((p) => !/^(offset|computedOffset|easing|composite)$/.test(p)); } catch { return []; }
  };
  const dash = (p) => p.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

  if (mode === 'motion') {
    const sig = [];
    for (const el of elements().filter(inScope)) {
      const s = cs(el);
      if (s.animationName !== 'none') {
        const names = list(s.animationName), durs = list(s.animationDuration).map(ms);
        names.forEach((name, i) => {
          const d = durs[i % durs.length], props = keyframes.get(name);
          if (d > 0 && (!props || [...props].some((p) => MOVING.test(p) || LAYOUT.test(p)))) sig.push(`animation ${name} ${d}ms on ${sel(el)}`);
        });
      }
      const props = list(s.transitionProperty), durs = list(s.transitionDuration).map(ms);
      props.forEach((p, i) => {
        const d = durs[i % durs.length];
        if (d > 0 && (MOVING.test(p) || LAYOUT.test(p))) sig.push(`transition ${p} ${d}ms on ${sel(el)}`);
      });
    }
    for (const a of document.getAnimations()) {
      if (a.animationName || a.transitionProperty || a.playState !== 'running') continue; // CSS ones are counted above
      const props = animProps(a).map(dash);
      if (props.some((p) => MOVING.test(p) || LAYOUT.test(p))) sig.push(`script animation (${props.join(', ')}) on ${a.effect.target ? sel(a.effect.target) : 'unknown'}`);
    }
    return { sig: [...new Set(sig)], css: reducedMotionCss };
  }

  // ---------------------------------------------------------------- collect
  const canvasEl = document.createElement('canvas'); canvasEl.width = canvasEl.height = 1;
  const g = canvasEl.getContext('2d', { willReadFrequently: true });
  const parsed = new Map();
  const rgba = (text) => {
    if (!text) return [0, 0, 0, 0];
    let v = parsed.get(text);
    if (v) return v;
    const m = text.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    if (m) v = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]];
    else if (text === 'none' || text === 'transparent' || text.startsWith('url(') || text.startsWith('context-')) v = [0, 0, 0, 0];
    else { // oklch(), color(), lab()...: let the canvas convert (clipped to sRGB, as displayed)
      g.clearRect(0, 0, 1, 1); g.fillStyle = 'rgba(0,0,0,0)'; g.fillStyle = text; g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data; v = [d[0], d[1], d[2], d[3] / 255];
    }
    parsed.set(text, v);
    return v;
  };
  const key = (c) => `${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${Math.round(c[3] * 100) / 100}`;
  const over = (t, b) => {
    const a = t[3] + b[3] * (1 - t[3]);
    return a <= 0 ? [0, 0, 0, 0] : [0, 1, 2].map((i) => (t[i] * t[3] + b[i] * b[3] * (1 - t[3])) / a).concat(a);
  };
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;width:0;height:0;background-color:Canvas';
  document.documentElement.appendChild(probe);
  const canvasBg = rgba(getComputedStyle(probe).backgroundColor);
  probe.remove();
  const layers = new Map();
  const layer = (el) => {
    let L = layers.get(el);
    if (!L) {
      const s = cs(el), op = parseFloat(s.opacity);
      L = { bg: rgba(s.backgroundColor), op: Number.isNaN(op) ? 1 : op, img: s.backgroundImage !== 'none' || /^(img|video|canvas|picture)$/.test(el.localName),
        fixed: s.position === 'fixed', clips: s.overflowX !== 'visible' || s.overflowY !== 'visible' };
      layers.set(el, L);
    }
    return L;
  };
  // The colour on screen of `top` drawn inside el (or of el's background when top is null).
  const screen = (el, top) => {
    let c = top, image = false, fixed = false, glass = false, opaque = false;
    for (let n = el; n; n = parentOf(n)) {
      const L = layer(n);
      if (!opaque && L.img) image = true;
      c = c ? over(c, L.bg) : L.bg;
      if (L.op < 1) c = [c[0], c[1], c[2], c[3] * L.op];
      opaque = c[3] >= 0.999;
      if (L.fixed) { fixed = true; if (!opaque) glass = true; }
    }
    return { c: over(c, canvasBg), image, fixed, glass };
  };
  const clipRect = (el, r) => { // intersect with the element and every clipping ancestor; null when < 2px is left
    let [x1, y1, x2, y2] = [r.left, r.top, r.right, r.bottom];
    for (let n = el; n && n !== document.documentElement && n !== document.body; n = parentOf(n)) {
      const s = cs(n);
      if (/rect\(0px,? 0px,? 0px,? 0px\)/.test(s.clip) || /inset\((50|100)%\)/.test(s.clipPath)) return null;
      if (!layer(n).clips) continue;
      const b = n.getBoundingClientRect();
      x1 = Math.max(x1, b.left); y1 = Math.max(y1, b.top); x2 = Math.min(x2, b.right); y2 = Math.min(y2, b.bottom);
      if (x2 - x1 < 2 || y2 - y1 < 2) return null;
    }
    return [x1 + scrollX, y1 + scrollY, x2 - x1, y2 - y1];
  };

  scrollTo(0, 0);
  if (opt.scope && !document.querySelector(opt.scope)) return { error: `no element matches --scope ${opt.scope}` };
  const all = elements().filter(inScope);
  const inv = { color: {}, background: {}, border: {}, fontSize: {}, fontWeight: {}, lineHeight: {}, family: {}, radius: {}, shadow: {}, spacing: {}, zIndex: {}, duration: {} };
  const count = (bucket, k) => { if (k !== null && k !== undefined && k !== '') bucket[k] = (bucket[k] || 0) + 1; };
  const out = { url: location.href, lang: document.documentElement.lang || '', texts: [], targets: [], touch: [], images: [], transitionAll: [], layoutAnim: [], inputs: [], cjk: [], marks: 0 };

  // Text: every element with a direct, non-blank text node.
  const byParent = new Map();
  const collectText = (root) => {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let t = tw.nextNode(); t; t = tw.nextNode()) {
      if (!t.data.trim()) continue;
      const p = t.parentElement;
      if (!p || /^(script|style|noscript|template|title|option|optgroup)$/.test(p.localName) || !inScope(p)) continue;
      (byParent.get(p) || byParent.set(p, []).get(p)).push(t);
    }
  };
  if (document.body) collectText(document.body);
  for (const el of all) if (el.shadowRoot) collectText(el.shadowRoot);
  const range = document.createRange();
  let id = 0;
  const addText = (el, fgText, extra = {}) => {
    const s = cs(el), size = parseFloat(s.fontSize), weight = parseInt(s.fontWeight, 10) || 400;
    const fg = rgba(fgText);
    let alpha = fg[3];
    for (let n = el; n; n = parentOf(n)) alpha *= layer(n).op;
    const gradient = fg[3] === 0 && /text/.test(s.webkitBackgroundClip || s.backgroundClip || '');
    if (!gradient && alpha < 0.05) return null;
    const T = screen(el, fg), B = screen(el, null);
    const t = { id: id++, sel: sel(el), text: extra.text, size, weight, large: size >= 24 || (size >= 18.66 && weight >= 700),
      fg: [fg[0], fg[1], fg[2], alpha], txt: T.c, bg: B.c, image: B.image, fixed: B.fixed, glass: B.glass, rects: extra.rects || [],
      placeholder: !!extra.placeholder, unverified: gradient ? 'gradient text (background-clip: text)' : null };
    out.texts.push(t);
    return t;
  };
  for (const [el, nodes] of byParent) {
    if (!visible(el) || el.closest(':disabled, [aria-disabled="true"], [inert]')) continue;
    // A scaled-down miniature (thumbnail strip, preview card) repeats a full-size original: skip it.
    if (el.offsetWidth > 4 && el.getBoundingClientRect().width / el.offsetWidth < 0.6) continue;
    const text = nodes.map((n) => n.data).join(' ').replace(/\s+/g, ' ').trim();
    const rects = [];
    for (const n of nodes) {
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (rects.length >= 8 || r.width < 1 || r.height < 1 || r.right + scrollX <= 0) continue;
        const c = clipRect(el, r);
        if (c) rects.push(c);
      }
    }
    if (!rects.length) continue;
    const s = cs(el);
    const t = addText(el, el instanceof SVGElement ? s.fill : s.webkitTextFillColor || s.color, { text: text.slice(0, 48), rects });
    if (!t) continue;
    count(inv.color, key(rgba(el instanceof SVGElement ? s.fill : s.color)));
    count(inv.fontSize, t.size);
    count(inv.fontWeight, t.weight);
    count(inv.lineHeight, s.lineHeight === 'normal' ? 'normal' : Math.round(parseFloat(s.lineHeight) / t.size * 100) / 100);
    count(inv.family, (s.fontFamily.split(',')[0] || '').trim().replace(/^["']|["']$/g, ''));
    if (HAN.test(text) || KANA.test(text) || HANGUL.test(text)) {
      const langEl = el.closest('[lang]');
      const lang = (langEl ? langEl.getAttribute('lang') : '').toLowerCase();
      const script = /^(zh|ja|ko)/.test(lang) ? lang.slice(0, 2) : KANA.test(text) ? 'ja' : HANGUL.test(text) ? 'ko' : 'zh';
      const fams = s.fontFamily.toLowerCase().split(',').map((f) => f.trim().replace(/^["']|["']$/g, ''));
      const jp = fams.findIndex((f) => JP_FONT.test(f)), zh = fams.findIndex((f) => ZH_FONT.test(f));
      const entry = { id: t.id, sel: t.sel, text: t.text, lang, script, weight: t.weight,
        jpFirst: script === 'zh' && jp >= 0 && (zh < 0 || jp < zh) ? fams[jp] : null,
        italic: s.fontStyle !== 'normal' && s.fontSynthesisStyle !== 'none' };
      if (opt.markCjk && out.marks < 30) { el.setAttribute('data-lint-cjk', String(out.cjk.length)); out.marks++; entry.marked = true; }
      out.cjk.push(entry);
    }
  }
  // Placeholders count as text (WCAG 1.4.3).
  for (const el of all) {
    if (!/^(input|textarea)$/.test(el.localName) || !el.placeholder || el.value || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    addText(el, getComputedStyle(el, '::placeholder').color, { text: `placeholder "${el.placeholder.slice(0, 40)}"`, placeholder: true,
      rects: [[r.left + scrollX, r.top + scrollY, r.width, r.height]] });
  }

  // Inventory, motion and layout checks over every visible element.
  for (const el of all) {
    if (!visible(el)) continue;
    const s = cs(el), L = layer(el);
    const box = L.bg[3] > 0;
    if (box) count(inv.background, key(L.bg));
    let bordered = false;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(s[`border${side}Width`]) > 0 && s[`border${side}Style`] !== 'none') {
        const c = rgba(s[`border${side}Color`]);
        if (c[3] > 0) { count(inv.border, key(c)); bordered = true; }
      }
    }
    if (s.boxShadow !== 'none') count(inv.shadow, s.boxShadow);
    if (box || bordered || s.boxShadow !== 'none' || /^(img|video|canvas)$/.test(el.localName)) {
      for (const corner of ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft']) {
        const v = s[`border${corner}Radius`];
        if (v && v !== '0px') count(inv.radius, v.split(' ')[0]);
      }
    }
    for (const p of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap']) {
      const v = parseFloat(s[p]);
      if (v > 0) count(inv.spacing, Math.round(v * 2) / 2);
    }
    if (s.position !== 'static' && s.zIndex !== 'auto') count(inv.zIndex, parseInt(s.zIndex, 10));
    const tProps = list(s.transitionProperty), tDurs = list(s.transitionDuration).map(ms);
    tProps.forEach((p, i) => {
      const d = tDurs[i % tDurs.length];
      if (d <= 0) return;
      count(inv.duration, d);
      if (p === 'all') out.transitionAll.push({ sel: sel(el), d });
      else if (LAYOUT.test(p)) out.layoutAnim.push({ sel: sel(el), what: `transition ${p} ${d}ms` });
    });
    if (s.animationName !== 'none') {
      const aDurs = list(s.animationDuration).map(ms);
      list(s.animationName).forEach((name, i) => {
        const d = aDurs[i % aDurs.length];
        if (d <= 0) return;
        count(inv.duration, d);
        const bad = [...(keyframes.get(name) || [])].filter((p) => LAYOUT.test(p));
        if (bad.length) out.layoutAnim.push({ sel: sel(el), what: `@keyframes ${name} animates ${bad.join(', ')}` });
      });
    }
    // Images and form fields.
    if (el.localName === 'img' && !el.hasAttribute('alt') && el.getAttribute('aria-hidden') !== 'true' && !/^(presentation|none)$/.test(el.getAttribute('role') || '')) {
      const src = el.currentSrc || el.src || '';
      out.images.push({ sel: sel(el), src: src.startsWith('data:') ? 'data: URL' : src.split(/[?#]/)[0].split('/').pop().slice(0, 40) });
    }
    if (el.getAttribute('role') === 'img' && !(el.getAttribute('aria-label') || '').trim() && !el.getAttribute('aria-labelledby') && !(el.getAttribute('title') || '').trim()) {
      out.images.push({ sel: sel(el), src: 'role="img" without a name' });
    }
    if (el.localName === 'input' && el.type === 'image' && !el.alt) out.images.push({ sel: sel(el), src: 'input type=image' });
    if (opt.touch && (el.localName === 'textarea' || el.localName === 'select' ||
      (el.localName === 'input' && !/^(checkbox|radio|range|color|file|submit|button|image|reset|hidden)$/.test(el.type)))) {
      const size = parseFloat(s.fontSize);
      if (size < 16) out.inputs.push({ sel: sel(el), size });
    }
  }
  for (const a of document.getAnimations()) {
    if (a.animationName || a.transitionProperty) continue;
    const bad = animProps(a).map(dash).filter((p) => LAYOUT.test(p));
    if (bad.length) out.layoutAnim.push({ sel: a.effect && a.effect.target ? sel(a.effect.target) : 'script', what: `script animation of ${bad.join(', ')}` });
  }

  // Targets (WCAG 2.5.8: 24x24 px, with the inline and spacing exceptions).
  const TARGET = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="menuitem"], [role="option"], [tabindex]:not([tabindex="-1"])';
  const targets = [];
  for (const el of all) {
    if (!el.matches(TARGET) || !visible(el) || el.closest(':disabled, [inert]')) continue;
    let r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (el.localName === 'input' && /^(checkbox|radio)$/.test(el.type) && el.labels && el.labels[0]) {
      const l = el.labels[0].getBoundingClientRect();
      r = { left: Math.min(r.left, l.left), top: Math.min(r.top, l.top), right: Math.max(r.right, l.right), bottom: Math.max(r.bottom, l.bottom) };
    }
    const w = r.right - r.left, h = r.bottom - r.top;
    const p = el.parentElement;
    const inline = cs(el).display === 'inline' && p && (p.textContent || '').trim().length > (el.textContent || '').trim().length + 10;
    targets.push({ el, r, w, h, cx: r.left + w / 2, cy: r.top + h / 2, inline, small: !inline && (w < 24 || h < 24) });
  }
  const distToRect = (x, y, r) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
  for (const t of targets) {
    if (t.inline) continue;
    if (t.small) {
      const spaced = targets.every((o) => o === t || o.el.contains(t.el) || t.el.contains(o.el) ||
        (distToRect(t.cx, t.cy, o.r) >= 12 && (!o.small || Math.hypot(t.cx - o.cx, t.cy - o.cy) >= 24)));
      if (!spaced) out.targets.push({ sel: sel(t.el), text: snippet(t.el), w: Math.round(t.w), h: Math.round(t.h) });
    } else if (opt.touch && (t.w < 44 || t.h < 44)) {
      out.touch.push({ sel: sel(t.el), text: snippet(t.el), w: Math.round(t.w), h: Math.round(t.h) });
    }
  }

  // Horizontal overflow: the outermost elements that stick out of a parent that fits.
  const de = document.documentElement, vw = de.clientWidth;
  const sw = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const culprits = [];
  const scroller = (el) => { for (let n = parentOf(el); n && n !== de && n !== document.body; n = parentOf(n)) if (layer(n).clips || layer(n).fixed) return true; return false; };
  for (const el of all) {
    if (layer(el).fixed || !visible(el, false)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.right + scrollX <= vw + 1) continue;
    const p = parentOf(el);
    const pr = p ? p.getBoundingClientRect().right + scrollX : 0;
    if ((!p || p === de || pr <= vw + 1) && !scroller(el)) culprits.push({ sel: sel(el), right: Math.round(r.right + scrollX), width: Math.round(r.width) });
  }
  const hidden = [de, document.body].some((n) => n && /hidden|clip/.test(cs(n).overflowX));
  out.overflow = { vw, sw, scrolls: sw > vw + 1, hidden, culprits: culprits.sort((a, b) => b.right - a.right).slice(0, 6) };
  out.docHeight = Math.max(de.scrollHeight, document.body ? document.body.scrollHeight : 0);
  out.vw = vw;
  out.inventory = inv;
  out.reducedMotionCss = reducedMotionCss;
  return out;
}

// Runs in a private blank page: decodes the text-hidden screenshot and samples the background under each text.
async function SAMPLE([b64, items]) {
  const bmp = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob());
  const c = new OffscreenCanvas(bmp.width, bmp.height), g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(bmp, 0, 0);
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
  return items.map(({ id, rects, fg }) => {
    const samples = [];
    for (const [x, y, w, h] of rects) {
      const X = Math.max(0, Math.floor(x)), Y = Math.max(0, Math.floor(y));
      const W = Math.min(bmp.width - X, Math.ceil(w)), H = Math.min(bmp.height - Y, Math.ceil(h));
      if (W < 1 || H < 1) continue;
      const d = g.getImageData(X, Y, W, H).data, step = Math.max(1, Math.floor(Math.sqrt((W * H) / 400)));
      for (let yy = 0; yy < H; yy += step) for (let xx = 0; xx < W; xx += step) {
        const k = (yy * W + xx) * 4, a = fg[3];
        const t = [0, 1, 2].map((i) => fg[i] * a + d[k + i] * (1 - a));
        const l1 = L(t[0], t[1], t[2]), l2 = L(d[k], d[k + 1], d[k + 2]);
        samples.push([(Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05), d[k], d[k + 1], d[k + 2]]);
      }
    }
    if (!samples.length) return { id, ratio: null };
    samples.sort((p, q) => p[0] - q[0]);
    const p10 = samples[Math.floor(samples.length * 0.1)];
    return { id, ratio: p10[0], bg: [p10[1], p10[2], p10[3], 1], worst: samples[0][0], best: samples[samples.length - 1][0] };
  });
}

// ------------------------------------------------------------------ one run

async function lintRun(browser, url, run, o, first) {
  const page = await newPage(browser, { width: run.width, height: run.height, dpr: 1, colorScheme: run.scheme,
    reducedMotion: 'no-preference', storageState: o.auth || undefined });
  try {
    const nav = await gotoReady(page, url, { settle: 0.6 });
    if (nav.status && nav.status >= 400) throw Object.assign(new Error(`${url} answered HTTP ${nav.status}`), { load: true });
    let wall = null;
    if (/^https?:/.test(url) && !/^https?:\/\/(localhost|127\.|\[::1\])/.test(url)) {
      const w = await detectWall(page, nav);
      if (w.walled) wall = `${w.kind}: ${w.reason}`;
    }
    const scope = o.scope;
    const motion = await page.evaluate(PAGE, ['motion', { scope }]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    const reduced = await page.evaluate(PAGE, ['motion', { scope }]);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(PAGE, ['finish']);
    const data = await page.evaluate(PAGE, ['collect', { touch: run.touch, markCjk: first, scope }]);
    if (data.error) throw Object.assign(new Error(data.error), { load: true });
    data.wall = wall;
    data.motion = motion;
    data.reduced = reduced;
    data.samples = await sampleContrast(page, data);
    data.unnamed = await unnamedControls(page, scope);
    data.fonts = first && data.marks ? await cjkFonts(page, data) : [];
    return data;
  } finally {
    await page.context().close().catch(() => {});
  }
}

async function sampleContrast(page, data) {
  // Line boxes under 8px tall are dominated by anti-aliasing; they keep the computed ratio.
  const items = data.texts.filter((t) => !t.fixed && !t.placeholder && t.rects.length)
    .map((t) => ({ id: t.id, fg: t.fg, rects: t.rects.filter(([, y, , h]) => h >= 8 && y + h <= SHOT_CAP) }))
    .filter((t) => t.rects.length);
  if (!items.length) return {};
  await page.evaluate(PAGE, ['hide']);
  let shot;
  try {
    const tall = data.docHeight > SHOT_CAP;
    shot = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css', type: 'png',
      ...(tall ? { clip: { x: 0, y: 0, width: data.vw, height: SHOT_CAP } } : {}) });
  } finally {
    await page.evaluate(PAGE, ['show']);
  }
  const tool = await (await page.context().browser().newContext()).newPage();
  try {
    const res = await tool.evaluate(SAMPLE, [shot.toString('base64'), items]);
    return Object.fromEntries(res.map((r) => [r.id, r]));
  } finally {
    await tool.context().close().catch(() => {});
  }
}

async function unnamedControls(page, scope) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    let i = 0;
    const roles = {};
    for (const n of nodes) {
      const role = n.role && n.role.value;
      if (n.ignored || !CONTROL_ROLES.has(role) || ((n.name && n.name.value) || '').trim() || n.backendDOMNodeId == null) continue;
      try {
        const { object } = await cdp.send('DOM.resolveNode', { backendNodeId: n.backendDOMNodeId });
        await cdp.send('Runtime.callFunctionOn', { objectId: object.objectId, arguments: [{ value: i }],
          functionDeclaration: 'function (i) { if (this.setAttribute) this.setAttribute("data-lint-ax", String(i)); }' });
        roles[i++] = role;
      } catch { /* node went away */ }
    }
    if (!i) return [];
    const marked = await page.evaluate(PAGE, ['selectors', { attr: 'data-lint-ax', scope }]);
    return marked.map((m) => ({ ...m, role: roles[m.i] }));
  } finally {
    await cdp.detach().catch(() => {});
  }
}

// The fonts Chrome actually used for marked CJK elements (CSS.getPlatformFontsForNode).
async function cjkFonts(page, data) {
  const cdp = await page.context().newCDPSession(page);
  const out = [];
  try {
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-lint-cjk]' });
    for (const nodeId of nodeIds) {
      try {
        const { attributes } = await cdp.send('DOM.getAttributes', { nodeId });
        const idx = Number(attributes[attributes.indexOf('data-lint-cjk') + 1]);
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
        out.push({ idx, fonts });
      } catch { /* node went away */ }
    }
  } finally {
    await page.evaluate(PAGE, ['unmark', { attr: 'data-lint-cjk' }]).catch(() => {});
    await cdp.detach().catch(() => {});
  }
  return out.map(({ idx, fonts }) => ({ entry: data.cjk[idx], fonts })).filter((f) => f.entry);
}

// ------------------------------------------------------------------ findings

function judgeContrast(t, sample) {
  const min = t.large ? 3 : 4.5;
  if (t.unverified) return { unverified: t.unverified };
  const computed = t.image ? null : wcag(t.txt, t.bg);
  if (sample && sample.ratio != null) {
    if (computed != null && Math.abs(sample.ratio - computed) / computed < 0.1) return { ratio: computed, bg: t.bg, basis: 'computed', min };
    return { ratio: sample.ratio, bg: sample.bg, min, basis: computed == null ? 'measured over image' : `measured (computed ${computed.toFixed(2)})` };
  }
  if (computed != null) return { ratio: computed, bg: t.bg, min, basis: t.glass ? 'computed, translucent fixed layer' : 'computed' };
  return { unverified: 'text over an image or gradient outside the measured area' };
}

function analyse(run, data, add) {
  const r = run.id;
  if (data.wall) add('contrast-unverified', r, 'page', `the page looks like a ${data.wall}; results describe that page`);
  for (const t of data.texts) {
    const j = judgeContrast(t, data.samples[t.id]);
    if (j.unverified) { add('contrast-unverified', r, t.sel, j.unverified, t.text); continue; }
    if (j.ratio < j.min) {
      add('contrast', r, t.sel, `${j.ratio.toFixed(2)} < ${j.min}  ${hex(t.fg)} on ${hex(j.bg)}  ${Math.round(t.size * 10) / 10}px/${t.weight}  ${j.basis}`, t.text,
        { ratio: Math.round(j.ratio * 100) / 100, min: j.min, fg: hex(t.fg), bg: hex(j.bg), size: t.size, weight: t.weight, basis: j.basis });
    }
  }
  const ov = data.overflow;
  if (ov.scrolls) {
    add('overflow', r, 'page', `content ${ov.sw}px wide in a ${ov.vw}px viewport`);
    for (const c of ov.culprits) add('overflow', r, c.sel, `sticks out to ${c.right}px (width ${c.width}px)`);
  } else if (ov.hidden && ov.culprits.length) {
    for (const c of ov.culprits) add('overflow-clipped', r, c.sel, `cut off at ${ov.vw}px (extends to ${c.right}px)`);
  }
  for (const u of data.unnamed) add('unnamed-control', r, u.sel, `${u.role} has no accessible name`, u.text);
  for (const t of data.targets) add('target-size', r, t.sel, `${t.w}x${t.h}px`, t.text);
  for (const t of data.touch) add('touch-target', r, t.sel, `${t.w}x${t.h}px`, t.text);
  for (const i of data.images) add('img-alt', r, i.sel, i.src);
  for (const t of data.transitionAll) add('transition-all', r, t.sel, `transition: all ${t.d}ms`);
  for (const l of data.layoutAnim) add('layout-animation', r, l.sel, l.what);
  for (const i of data.inputs) add('input-zoom', r, i.sel, `font-size ${i.size}px`);
  const reduced = new Set(data.reduced.sig);
  const same = data.motion.sig.filter((s) => reduced.has(s));
  if (data.motion.sig.length && same.length === data.motion.sig.length) {
    const why = data.reducedMotionCss ? 'a prefers-reduced-motion rule exists but changes none of these' : 'no prefers-reduced-motion handling found';
    add('reduced-motion', r, 'page', `${same.length} motion declarations identical under reduce (${why})`);
    for (const s of same.slice(0, 20)) add('reduced-motion', r, s.split(' on ').pop(), s.split(' on ')[0]);
  } else {
    for (const s of same.filter((x) => x.startsWith('animation') || x.startsWith('script'))) add('reduced-motion', r, s.split(' on ').pop(), `${s.split(' on ')[0]} still runs under reduce`);
  }
  for (const c of data.cjk) {
    if (!/^(zh|ja|ko)/.test(c.lang)) add('cjk-lang', r, c.sel, c.lang ? `lang="${c.lang}" on ${c.script} text` : `no lang on ${c.script} text`, c.text);
    if (c.jpFirst) add('cjk-font', r, c.sel, `font stack puts "${c.jpFirst}" before any Chinese font`, c.text);
    if (c.italic) add('cjk-synthetic', r, c.sel, 'italic/oblique CJK is synthesised (use weight, colour or text-emphasis)', c.text);
  }
  for (const { entry, fonts } of data.fonts) {
    const main = fonts.slice().sort((a, b) => b.glyphCount - a.glyphCount)[0];
    if (!main) continue;
    const name = `${main.familyName}${main.postScriptName ? ` (${main.postScriptName})` : ''}`;
    if (entry.script === 'zh' && !entry.jpFirst && /hiragino (kaku|mincho|maru)|hiragino ?sans(?! ?gb)|yu ?gothic|yu ?mincho|meiryo|ms p?gothic|ms p?mincho| jp$/i.test(main.familyName)) {
      add('cjk-font', r, entry.sel, `rendered with ${name}, a Japanese font`, entry.text);
    }
    if (entry.weight >= 600 && !main.isCustomFont && /(^|[-_ ])(regular|light|thin|book|normal|w[1-5])$/i.test(main.postScriptName || '')) {
      add('cjk-synthetic', r, entry.sel, `weight ${entry.weight} drawn with ${name}: faux bold`, entry.text);
    }
  }
}

// Near-duplicate clusters and budgets over the merged inventory.
function inventorySummary(merged) {
  const out = {};
  const numeric = (bucket, near) => {
    const vals = Object.keys(bucket).filter((k) => k !== 'normal' && !Number.isNaN(parseFloat(k))).map(Number).sort((a, b) => a - b);
    const clusters = [];
    for (let i = 1; i < vals.length; i++) {
      if (near(vals[i - 1], vals[i])) {
        const last = clusters[clusters.length - 1];
        if (last && last[last.length - 1] === vals[i - 1]) last.push(vals[i]); else clusters.push([vals[i - 1], vals[i]]);
      }
    }
    return clusters;
  };
  const px = (a, b) => b / a <= 1.07 || (b - a <= 1 && a >= 8);
  for (const [name, bucket] of Object.entries(merged)) {
    const values = Object.entries(bucket).map(([v, n]) => ({ v, n })).sort((a, b) => b.n - a.n);
    let clusters = [];
    if (['fontSize', 'spacing'].includes(name)) clusters = numeric(bucket, px);
    else if (name === 'radius') {
      const pxOnly = Object.fromEntries(Object.entries(bucket).filter(([k]) => k.endsWith('px') && parseFloat(k) < 500).map(([k, n]) => [parseFloat(k), n]));
      clusters = numeric(pxOnly, px);
    } else if (name === 'lineHeight') clusters = numeric(bucket, (a, b) => b - a <= 0.05);
    else if (name === 'duration') clusters = numeric(bucket, (a, b) => b - a <= 50 && b / a <= 1.25);
    else if (['color', 'background', 'border'].includes(name)) {
      const cols = values.map(({ v }) => { const c = v.split(',').map(Number); return { v, c, lab: oklab(c) }; });
      for (let i = 0; i < cols.length; i++) for (let j = i + 1; j < cols.length; j++) {
        const a = cols[i], b = cols[j];
        if (Math.abs(a.c[3] - b.c[3]) < 0.05 && Math.hypot(...a.lab.map((x, k) => x - b.lab[k])) < 0.02) clusters.push([hex(a.c), hex(b.c)]);
      }
      values.forEach((x) => { x.v = hex(x.v.split(',').map(Number)); });
    }
    out[name] = { count: values.length, values, clusters, budget: BUDGET[name] ?? null };
  }
  return out;
}

// ------------------------------------------------------------------ report

function printReport(report, o) {
  const w = (s = '') => process.stdout.write(s + '\n');
  w(`lint.mjs  ${report.url}`);
  w(`runs      ${report.runs.map((r) => r.id + (r.touch ? ' (touch)' : '')).join(' · ')}`);
  const byRule = new Map();
  for (const f of report.findings) (byRule.get(f.rule) || byRule.set(f.rule, []).get(f.rule)).push(f);
  const section = (title, level) => {
    const rules = Object.keys(RULES).filter((k) => byRule.has(k) && byRule.get(k)[0].level === level);
    if (!rules.length) return;
    w(`\n${title}`);
    for (const rule of rules) {
      const fs = byRule.get(rule);
      w(`  ${rule.padEnd(20)} ${String(fs.length).padStart(3)}  ${RULES[rule]}`);
      for (const f of fs.slice(0, o.max)) {
        w(`    [${f.runs.join(', ')}] ${f.detail}  ${f.sel}${f.text ? `  "${f.text}"` : ''}`);
      }
      if (fs.length > o.max) w(`    +${fs.length - o.max} more (--max ${fs.length} or --json)`);
    }
  };
  section(`FLOOR  ${report.floor} finding(s)${report.floor ? ' -> exit 1' : ''}`, 'floor');
  section('WARN', 'warn');
  if (!report.floor) w('\nFLOOR  passes: contrast, overflow, accessible names');
  w('\nINVENTORY  distinct values used across all runs; "near" = near-duplicates (token drift)');
  const label = { color: 'text colour', background: 'background', border: 'border colour', fontSize: 'font-size', fontWeight: 'font-weight',
    lineHeight: 'line-height/size', family: 'family (first)', radius: 'radius', shadow: 'shadow', spacing: 'padding/gap', zIndex: 'z-index', duration: 'duration ms' };
  for (const [name, s] of Object.entries(report.inventory)) {
    const numericSort = ['fontSize', 'fontWeight', 'lineHeight', 'spacing', 'zIndex', 'duration'].includes(name);
    const shown = (numericSort ? s.values.slice().sort((a, b) => parseFloat(a.v) - parseFloat(b.v)) : s.values).slice(0, 14)
      .map((x) => (name === 'shadow' ? `[${x.n}x]` : name === 'family' ? `"${x.v}"` : x.v)).join(' ');
    const over = s.budget && s.count > s.budget ? `  (over ${s.budget})` : '';
    const near = s.clusters.length ? `  near: ${s.clusters.map((c) => c.join('~')).join(', ')}` : '';
    w(`  ${label[name].padEnd(17)} ${String(s.count).padStart(3)}${over}  ${shown}${s.values.length > 14 ? ' ...' : ''}${near}`);
  }
  w('\nNot checked: non-text contrast (color_tools.py matrix --from), focus visibility, keyboard order, rAF motion, text in images, iframes.');
}

// ------------------------------------------------------------------ main

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const url = toUrl(o.target);
  const runs = [];
  for (const scheme of o.dark ? ['light', 'dark'] : ['light']) {
    for (const v of o.viewports) {
      const [width, height] = v.split('x').map(Number);
      runs.push({ id: `${width} ${scheme}`, width, height, scheme, touch: width < 600 });
    }
  }
  let browser;
  try {
    browser = await launch();
  } catch (e) {
    if (e.code !== 'NO_PLAYWRIGHT') { process.stderr.write(`lint.mjs: ${e.message}\n`); process.exit(2); }
    process.stderr.write(`lint.mjs needs Playwright and Chrome (or Playwright's Chromium). Either:
  npx -y -p playwright@${PLAYWRIGHT_VERSION} node ${SELF} ${process.argv.slice(2).join(' ')}
  npm i -D playwright@${PLAYWRIGHT_VERSION}        then run the same command with node
Without Node: shot.sh renders; color_tools.py contrast / matrix --from tokens.css checks colour pairs.\n`);
    process.exit(2);
  }
  const findings = new Map();
  const merged = {};
  const meta = [];
  const strict = o.strict ? new Set([...FLOOR, 'target-size', 'img-alt']) : FLOOR;
  const add = (rule, run, sel, detail, text, data) => {
    const k = `${rule}|${sel}|${detail}|${text || ''}`;
    const f = findings.get(k);
    if (f) { if (!f.runs.includes(run)) f.runs.push(run); return; }
    findings.set(k, { rule, level: strict.has(rule) ? 'floor' : 'warn', runs: [run], sel, detail, ...(text ? { text } : {}), ...(data ? { data } : {}) });
  };
  try {
    for (const [i, run] of runs.entries()) {
      process.stderr.write(`lint.mjs: ${run.id} ${run.width}x${run.height}...\n`);
      let data;
      try {
        data = await lintRun(browser, url, run, o, i === 0);
      } catch (e) {
        process.stderr.write(`lint.mjs: ${e.load ? e.message : `could not lint ${url}: ${String(e.message).split('\n')[0]}`}\n`);
        process.exit(2);
      }
      meta.push({ ...run, url: data.url, lang: data.lang, texts: data.texts.length, measured: Object.keys(data.samples).length });
      analyse(run, data, add);
      for (const [name, bucket] of Object.entries(data.inventory)) {
        merged[name] = merged[name] || {};
        for (const [v, n] of Object.entries(bucket)) merged[name][v] = (merged[name][v] || 0) + n;
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  const inventory = inventorySummary(merged);
  for (const [name, s] of Object.entries(inventory)) {
    if (s.clusters.length) add('token-drift', 'all', name, s.clusters.map((c) => c.join(' ~ ')).join(', '));
    if (s.budget && s.count > s.budget) add('vocabulary', 'all', name, `${s.count} distinct (budget ${s.budget})`);
  }
  const list = [...findings.values()];
  const report = { tool: 'lint.mjs', target: o.target, url, date: new Date().toISOString().slice(0, 10), runs: meta,
    floor: list.filter((f) => f.level === 'floor').length, warnings: list.filter((f) => f.level === 'warn').length, findings: list, inventory };
  if (o.json) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  else printReport(report, o);
  process.exit(report.floor ? 1 : 0);
}

main().catch((e) => { process.stderr.write(`lint.mjs: ${e.stack || e}\n`); process.exit(2); });
