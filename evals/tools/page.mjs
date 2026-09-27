// Shared page preparation for evals/render.mjs and evals/tools/facts.mjs, so the frames judges see and the facts
// they are given come from the same page state.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const MAX_FRAMES = 10; // full-page items are judged on at most this many viewport-sized frames

// The ```render-manifest block of a brief: {items: [{html, png, width, height, dpr, full_page}]}.
export function readManifest(briefPath) {
  const block = readFileSync(briefPath, 'utf8').match(/```render-manifest\n([\s\S]*?)```/);
  if (!block) throw new Error(`no render-manifest block in ${briefPath}`);
  return JSON.parse(block[1]).items;
}

// Instant, whatever the page's `scroll-behavior` says: smooth scrolling would still be moving at capture time.
export const scrollTo = (page, top) =>
  page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), top);

// Wait until finite CSS / Web Animations have finished (at most 2 s), so entrance effects are captured in their end
// state however long an arm made them. Infinite animations (spinners, marquees) are left running.
export const settle = (page) => page.evaluate(() => Promise.race([
  Promise.all(document.getAnimations()
    .filter((a) => a.effect && a.effect.getTiming().iterations !== Infinity)
    .map((a) => a.finished.catch(() => {}))),
  new Promise((done) => setTimeout(done, 2000)),
]));

// Open one manifest item and bring it to the state that is captured: loaded, fonts ready, scrolled once through
// (full-page items, so scroll-triggered content has appeared), back at the top, animations settled.
// Returns {page, errors, height}; height is measured after the scroll-through, since lazy content can grow the page.
export async function preparePage(browser, item, src) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: item.dpr });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await page.goto(pathToFileURL(src).href, { waitUntil: 'load', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  if (item.full_page) {
    const first = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < first; y += Math.round(item.height / 2)) {
      await scrollTo(page, y);
      await page.waitForTimeout(120);
    }
  }
  await scrollTo(page, 0);
  await page.waitForTimeout(600);
  await settle(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  return { page, errors, height };
}

// Number of frames a full-page item is judged on, and whether the page was longer than that.
export function frameCount(item, height) {
  if (!item.full_page) return { count: 1, truncated: false };
  const all = Math.max(1, Math.ceil(height / item.height));
  return { count: Math.min(all, MAX_FRAMES), truncated: all > MAX_FRAMES };
}
