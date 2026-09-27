// Measured facts for the output eval: the same harness-owned measurement for every arm (judging.md section 4).
// No arm's own tools are used, so no arm is scored by the linter it may have designed against.
//
//   node evals/tools/facts.mjs <brief.md> <arm out/ dir> [--touch 44] [--md <label>]
//
// For each item of the brief's render manifest, on exactly what the judges see (the first screen of viewport items;
// the judged frames of full-page items, after the same preparation as evals/render.mjs):
// - Text contrast against WCAG 2.2 AA: 4.5:1, or 3:1 for text of at least 24 px, or 18.66 px and bold. Colours come
//   from computed styles, composited through opacity and translucent layers. Where the background is an image,
//   gradient, video or canvas, the background is read from pixels instead: all text is made transparent, the frame
//   is captured, and the median pixel under the text is used ("from pixels"). Gradient-filled text cannot be measured
//   and is counted as unmeasured. Text in disabled controls is exempt (WCAG 1.4.3), and so is text covered by a painted
//   overlay (a scrim, sheet or dialog). Placeholder text is not a DOM text node and is not measured.
// - Pointer targets under 24 x 24 CSS px that also fail the WCAG 2.5.8 spacing exception (inline text links are
//   exempt); with --touch N, also every target under N x N. Only elements marked up as interactive can be found
//   (links, buttons, form controls, interactive roles, onclick, tabindex), so target counts are a lower bound.
// - Images without an alt attribute; horizontal overflow at the manifest width.
// Prints JSON (one object per manifest item), or with --md the plain sentences for facts.md.
// Exit code: 0 all files measured, 1 some file missing or failed, 2 usage error.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { readManifest, preparePage, scrollTo, settle, frameCount } from './page.mjs';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const touch = Number(opt('--touch') || 0);
const mdLabel = opt('--md');
const [briefPath, outDir] = args;
if (!briefPath || !outDir) {
  console.error('usage: node evals/tools/facts.mjs <brief.md> <arm out/ dir> [--touch 44] [--md <label>]');
  process.exit(2);
}
const HIDE_TEXT = '*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important;'
  + ' text-shadow: none !important; transition: none !important; caret-color: transparent !important; }'
  + ' svg text, svg tspan, svg textPath { fill: transparent !important; stroke: transparent !important; }';

// Runs in the page once per judged frame; accumulates into window.__facts and skips nodes already measured.
// Returns the number of text nodes in this frame whose background must be read from pixels.
function measureFrame() {
  if (!window.__facts) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    const lib = {
      rgba(css) { // any CSS colour (oklch, color-mix, ...) -> [r, g, b] in sRGB 0-255 and alpha 0-1
        cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = css; cx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data; // ImageData is not premultiplied
        return [r, g, b, a / 255];
      },
      over: (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])),
      lum(c) {
        const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      },
      ratio(a, b) { const [x, y] = [lib.lum(a), lib.lum(b)].sort((p, q) => q - p); return Math.floor((x + 0.05) / (y + 0.05) * 100) / 100; },
      hex: (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''),
    };
    window.__facts = { lib, seen: new WeakSet(), text: [], pending: [], unmeasured: {}, exempt: 0, covered: 0, targets: [], noAlt: 0 };
  }
  const F = window.__facts, L = F.lib;
  const vw = innerWidth, vh = innerHeight;
  const inFrame = (y) => y >= 0 && y < vh;
  const where = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '';
    return el.tagName.toLowerCase() + cls;
  };
  const opacity = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  const MEDIA = new Set(['IMG', 'VIDEO', 'CANVAS', 'PICTURE', 'IFRAME', 'OBJECT', 'EMBED', 'svg']);

  // Background under a point, composited from the paint stack, starting at the text's own box.
  // Returns an [r, g, b] colour; null when an image, gradient or media element is involved; 'covered' when a painted
  // layer that is not part of the text's own box lies on top of it (a scrim, sheet or dialog).
  const painted = (c) => { const cs = getComputedStyle(c); return L.rgba(cs.backgroundColor)[3] > 0 || cs.backgroundImage !== 'none'; };
  const background = (el, x, y) => {
    const stack = document.elementsFromPoint(x, y);
    const start = Math.max(0, stack.findIndex((c) => c === el || c.contains(el)));
    if (stack.slice(0, start).some((c) => !el.contains(c) && painted(c))) return 'covered';
    const layers = [];
    for (const c of stack.slice(start)) {
      if (MEDIA.has(c.tagName) && !c.contains(el)) return null;
      if (c instanceof SVGGeometryElement && c !== el) return null; // an SVG shape's fill is not a CSS background
      const cs = getComputedStyle(c);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const bg = L.rgba(cs.backgroundColor);
      bg[3] *= Number(cs.opacity);
      if (bg[3] > 0) layers.push(bg);
      if (bg[3] >= 0.999) break;
    }
    return layers.reverse().reduce((under, top) => L.over(top, under), [255, 255, 255]);
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || F.seen.has(n) || !n.textContent.trim() || el.closest('script, style, noscript, template')) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rect = [...range.getClientRects()].find((r) => r.width > 0 && r.height > 0);
    if (!rect) continue;
    const x = Math.min(Math.max(rect.left + rect.width / 2, 0), vw - 1), y = rect.top + Math.min(rect.height, 16) / 2;
    if (!inFrame(y) || rect.right <= 0 || rect.left >= vw) continue;
    F.seen.add(n);
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) continue;
    if (el.closest(':disabled, [aria-disabled="true"]')) { F.exempt++; continue; }
    const cs = getComputedStyle(el);
    const svg = el instanceof SVGElement; // SVG text is painted with fill, not color
    const paint = svg ? cs.fill : cs.color;
    if ((svg && !/^(rgb|#|hsl|hwb|lab|lch|oklab|oklch|color)/.test(paint))
        || (!svg && L.rgba(cs.webkitTextFillColor)[3] === 0) || cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') {
      F.unmeasured['gradient or image-filled text'] = (F.unmeasured['gradient or image-filled text'] || 0) + 1;
      continue;
    }
    const fg = L.rgba(paint); fg[3] *= opacity(el) * (svg ? Number(cs.fillOpacity) : 1);
    const size = parseFloat(cs.fontSize), large = size >= 24 || (size >= 18.66 && (Number(cs.fontWeight) || 400) >= 700);
    const node = { min: large ? 3 : 4.5, size, where: where(el), sample: n.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) };
    const bg = background(el, x, y);
    if (bg === 'covered') { F.covered++; continue; }
    if (!bg) {
      const box = [Math.max(rect.left, 0), Math.max(rect.top, 0), Math.min(rect.right, vw), Math.min(rect.bottom, vh)];
      F.pending.push({ ...node, fg, box });
      continue;
    }
    const shown = L.over(fg, bg);
    F.text.push({ ...node, ratio: L.ratio(shown, bg), fg: L.hex(shown), bg: L.hex(bg), via: 'styles' });
  }

  const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [onclick], [tabindex]:not([tabindex="-1"]),'
    + ' [role=button], [role=link], [role=tab], [role=checkbox], [role=radio], [role=switch], [role=menuitem], [role=option]';
  for (const el of document.querySelectorAll(SEL)) {
    if (F.seen.has(el) || el.parentElement?.closest(SEL)) continue; // the outermost control, once
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || !inFrame(r.top + r.height / 2)) continue;
    F.seen.add(el);
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    if (el.matches(':disabled, [aria-disabled="true"]')) continue; // not operable, so not a target
    F.targets.push({
      w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 + scrollY,
      box: [r.left, r.top + scrollY, r.right, r.bottom + scrollY],
      inlineLink: el.tagName === 'A' && getComputedStyle(el).display === 'inline',
      label: (el.innerText || el.value || el.getAttribute('aria-label') || where(el)).trim().replace(/\s+/g, ' ').slice(0, 30),
    });
  }
  for (const img of document.querySelectorAll('img:not([alt])')) {
    const r = img.getBoundingClientRect();
    if (F.seen.has(img) || !r.width || !inFrame(r.top + r.height / 2)) continue;
    F.seen.add(img); F.noAlt++;
  }
  return F.pending.length;
}

// Runs in the page with a capture of the frame taken while all text was transparent: the median pixel under each
// pending text box is its background.
async function resolvePending(png) {
  const F = window.__facts, L = F.lib;
  const img = new Image();
  img.src = `data:image/png;base64,${png}`;
  await img.decode();
  const k = img.width / innerWidth;
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  for (const p of F.pending) {
    const [x0, y0, x1, y1] = p.box.map((v) => Math.floor(v * k));
    const d = cx.getImageData(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)).data;
    const px = [];
    for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
    px.sort((a, b) => L.lum(a) - L.lum(b));
    const bg = px[Math.floor(px.length / 2)];
    const shown = L.over(p.fg, bg);
    F.text.push({ min: p.min, size: p.size, where: p.where, sample: p.sample,
                  ratio: L.ratio(shown, bg), fg: L.hex(shown), bg: L.hex(bg), via: 'pixels' });
  }
  F.pending = [];
}

// WCAG 2.5.8: an undersized target passes if a 24 px circle on its centre meets no other target or other circle.
function targetFacts(targets) {
  const gap = (t, u) => Math.hypot(Math.max(u.box[0] - t.cx, 0, t.cx - u.box[2]), Math.max(u.box[1] - t.cy, 0, t.cy - u.box[3]));
  const small = (t) => t.w < 24 || t.h < 24;
  const pool = targets.filter((t) => !t.inlineLink);
  const under24 = pool.filter((t) => small(t) && pool.some((u) => u !== t
    && (small(u) ? Math.hypot(u.cx - t.cx, u.cy - t.cy) < 24 : gap(t, u) < 12)));
  const fmt = (t) => `${t.label} ${Math.round(t.w)}x${Math.round(t.h)}`;
  const out = { targets_checked: pool.length, targets_under_24: under24.length, targets_under_24_examples: under24.slice(0, 5).map(fmt) };
  if (touch) {
    const underT = pool.filter((t) => t.w < touch || t.h < touch);
    out[`targets_under_${touch}`] = underT.length;
    out[`targets_under_${touch}_examples`] = underT.slice(0, 5).map(fmt);
  }
  return out;
}

function summarise(f) {
  const fails = f.text.filter((t) => t.ratio < t.min).sort((a, b) => a.ratio - b.ratio);
  const describe = (t) => `${t.ratio}:1 (needs ${t.min}) ${t.where} "${t.sample}" ${t.fg} on ${t.bg}, ${t.size}px${t.via === 'pixels' ? ', from pixels' : ''}`;
  const unmeasured = Object.values(f.unmeasured).reduce((a, b) => a + b, 0);
  return {
    text_nodes: f.text.length + unmeasured + f.exempt + f.covered,
    contrast_measured: f.text.length,
    contrast_from_pixels: f.text.filter((t) => t.via === 'pixels').length,
    contrast_failures: fails.length,
    lowest_contrast: f.text.length ? Math.min(...f.text.map((t) => t.ratio)) : null,
    lowest_contrast_where: fails.length ? describe(fails[0]) : null,
    contrast_failure_examples: fails.slice(0, 5).map(describe),
    contrast_unmeasured: unmeasured,
    contrast_unmeasured_reasons: f.unmeasured,
    contrast_exempt_disabled: f.exempt,
    contrast_skipped_covered: f.covered,
    ...targetFacts(f.targets),
    images_missing_alt: f.noAlt,
  };
}

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
for (const it of readManifest(briefPath)) {
  const src = resolve(outDir, it.html);
  const r = { file: it.html, viewport: `${it.width}x${it.height}@${it.dpr}`, status: 'ok', method: 'evals/tools/facts.mjs' };
  results.push(r);
  if (!existsSync(src)) { r.status = 'missing'; continue; }
  let page;
  try {
    let height;
    ({ page, height } = await preparePage(browser, it, src));
    const { count } = frameCount(it, height);
    for (let i = 0; i < count; i++) {
      await scrollTo(page, i * it.height);
      await page.waitForTimeout(250);
      await settle(page);
      if (await page.evaluate(measureFrame)) {
        const hide = await page.addStyleTag({ content: HIDE_TEXT });
        const png = await page.screenshot();
        await hide.evaluate((node) => node.remove());
        await page.evaluate(resolvePending, png.toString('base64'));
      }
    }
    const f = await page.evaluate(() => { const { lib, seen, pending, ...rest } = window.__facts; return rest; });
    Object.assign(r, { frames_measured: count, ...summarise(f),
      horizontal_overflow: await page.evaluate((w) => document.documentElement.scrollWidth > w, it.width) });
  } catch (e) {
    r.status = 'error';
    r.error = String(e.message).split('\n')[0];
  }
  if (page) await page.close();
}
await browser.close();

if (mdLabel) {
  const missing = results.filter((r) => r.status === 'missing').map((r) => r.file);
  const lines = [`${mdLabel}: ${results.length - missing.length} of ${results.length} files present${missing.length ? ` (missing: ${missing.join(', ')})` : ''}.`];
  for (const r of results) {
    if (r.status !== 'ok') { lines.push(`- ${r.file}: ${r.status}${r.error ? ` (${r.error})` : ''}.`); continue; }
    let s = `- ${r.file} (${r.viewport}): text below AA: ${r.contrast_failures} of ${r.contrast_measured} measured text nodes`;
    if (r.contrast_from_pixels) s += ` (${r.contrast_from_pixels} over images or gradients, measured from pixels)`;
    if (r.contrast_failures) s += `, lowest ${r.lowest_contrast_where}`;
    if (r.contrast_unmeasured) s += `; ${r.contrast_unmeasured} not measurable (${Object.keys(r.contrast_unmeasured_reasons).join(', ')})`;
    s += `. Targets under 24 px that fail the spacing exception: ${r.targets_under_24} of ${r.targets_checked}`;
    if (r.targets_under_24) s += ` (${r.targets_under_24_examples.join('; ')})`;
    if (touch) s += `; under ${touch} px: ${r[`targets_under_${touch}`]}`;
    s += `. Images without alt: ${r.images_missing_alt}. Horizontal overflow: ${r.horizontal_overflow ? 'yes' : 'no'}.`;
    lines.push(s);
  }
  lines.push('Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.');
  console.log(lines.join('\n'));
} else {
  console.log(JSON.stringify(results, null, 2));
}
process.exit(results.every((r) => r.status === 'ok') ? 0 : 1);
