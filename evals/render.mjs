// Canonical renderer for the output eval. The orchestrator runs this on every arm's out/ folder, so every arm
// is judged from PNGs made the same way, whatever the arm rendered for itself.
//
//   node evals/render.mjs <brief.md> <arm out/ dir> <png dir>
//
// Reads the ```render-manifest block of the brief. Viewport items give one PNG (<png>). Full-page items are cut
// into consecutive viewport-sized frames (<stem>-01.png ... at most MAX_FRAMES), after one scroll through the
// page so scroll-triggered content has appeared; the last frame ends at the page bottom, so it may overlap the one
// before. Scrolling is instant and finite animations are allowed to finish before each capture (tools/page.mjs).
// Writes <png dir>/render.json with per-file facts. Measured facts (contrast, targets): evals/tools/facts.mjs.
// Exit code: 0 all files rendered, 1 some file missing or failed, 2 usage error.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { readManifest, preparePage, scrollTo, settle, frameCount } from './tools/page.mjs';

const [briefPath, outDir, pngDir] = process.argv.slice(2);
if (!briefPath || !outDir || !pngDir) {
  console.error('usage: node evals/render.mjs <brief.md> <arm out/ dir> <png dir>');
  process.exit(2);
}
let items;
try { items = readManifest(briefPath); } catch (e) { console.error(e.message); process.exit(2); }
mkdirSync(pngDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
for (const it of items) {
  const src = resolve(outDir, it.html);
  const r = { html: it.html, viewport: `${it.width}x${it.height}@${it.dpr}`, status: 'ok', frames: [] };
  results.push(r);
  if (!existsSync(src)) { r.status = 'missing'; continue; }
  let page, errors = [];
  try {
    let height;
    ({ page, errors, height } = await preparePage(browser, it, src));
    const stem = it.png.replace(/\.png$/, '');
    const { count, truncated } = frameCount(it, height);
    for (let i = 0; i < count; i++) {
      const name = it.full_page ? `${stem}-${String(i + 1).padStart(2, '0')}.png` : it.png;
      await scrollTo(page, i * it.height);
      await page.waitForTimeout(250);
      await settle(page);
      await page.screenshot({ path: join(pngDir, name) });
      r.frames.push(name);
    }
    Object.assign(r, await page.evaluate((w) => ({
      page_height: document.documentElement.scrollHeight,
      horizontal_overflow: document.documentElement.scrollWidth > w,
    }), it.width));
    r.truncated = truncated;
  } catch (e) {
    r.status = 'error';
    r.error = String(e.message).split('\n')[0];
  }
  r.console_errors = errors;
  if (page) await page.close();
}
await browser.close();
writeFileSync(join(pngDir, 'render.json'), JSON.stringify({ brief: briefPath, rendered: new Date().toISOString(), items: results }, null, 2));
for (const r of results) console.log(`${r.status.padEnd(7)} ${r.html} ${r.frames.join(' ')}`);
process.exit(results.every((r) => r.status === 'ok') ? 0 : 1);
