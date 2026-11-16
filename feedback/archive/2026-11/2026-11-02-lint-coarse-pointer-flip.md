---
date: 2026-11-02
skill: design-studio
project: zh-docs-static-site
type: bug
severity: minor
---

## What happened

`scripts/lint.mjs` reported a contrast floor failure (1.00:1, text colour on text colour) on the current nav link at 390 that is not on screen. The link is 44 px tall only under `@media (pointer: coarse)`; lint collects the text rects in that layout, but the full-page, text-hidden screenshot it samples is taken after Playwright's full-page capture has dropped touch emulation (`matchMedia('(pointer: coarse)')` reads false after the shot), so the page is re-laid out without the coarse rules and the link's 2 px bottom border lands inside the sampled text rect. Hiding that border made the finding disappear; making the same rules also apply at `max-width: 599px` removed it for real.

## Expected / suggestion

Sample in the layout the rects came from: check `matchMedia('(pointer: coarse)')` (and the viewport size) before and after the shot and re-collect the rects if either changed, or take a viewport-height screenshot per scroll position instead of `fullPage` when touch is emulated. A note in `references/process/render-and-look.md` section 3 would help authors who hit it first.
