---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: missing
severity: minor
---

## What happened

Checking the forced-colours fixes needed a hand-written Playwright script (`page.emulateMedia({ forcedColors: 'active' })`). `scripts/capture.mjs` has `--themes` and `--reduced-motion` but no forced-colours emulation, so the shots could not join the frozen capture set or its report.

## Expected / suggestion

Add `--forced-colors` (and maybe `--contrast more`) to `capture.mjs`, with the state named in the file name (e.g. `-fc`), so the rubric's forced-colours check can cite a frozen shot.
