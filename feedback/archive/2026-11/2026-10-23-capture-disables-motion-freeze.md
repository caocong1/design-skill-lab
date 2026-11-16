---
date: 2026-10-23
skill: design-studio
project: zh-architecture-doc-html
type: friction
severity: minor
---

## What happened

references/disciplines/motion.md §7 says to verify motion by capturing `?t=<ms>` freeze frames with scripts/capture.mjs. capture.mjs screenshots with Playwright's `animations: 'disabled'`, which fast-forwards finite CSS / WAAPI animations to their end and cancels infinite ones, so a page that only pauses its animations at t comes out showing the final frame. All five direction subagents in one options round hit this independently and each worked around it by baking the frozen frame into inline styles (`commitStyles()` + `cancel()`) or painting the frame directly.

## Expected / suggestion

Either a capture.mjs flag that keeps animations as the page left them (e.g. `--keep-animations`), or a line in motion.md §7 / render-and-look telling the page to bake the `?t` frame into static styles, with the 3-line snippet.
