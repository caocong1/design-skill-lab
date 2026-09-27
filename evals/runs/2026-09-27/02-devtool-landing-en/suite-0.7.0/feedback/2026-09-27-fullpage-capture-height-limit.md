---
date: 2026-09-27
skill: design-studio
project: suite-0.7.0
type: missing
severity: major
---

## What happened

A 390 px page at DPR 2 that was 10,356 CSS px tall came out of the full-page capture with the top of the page repeated past about 8,192 CSS px (Chrome's 16,384 device-px limit). render-and-look.md lists capture traps but not this one, and I only caught it by looking at every crop.

## Expected / suggestion

Add to "Known traps": full-page captures taller than 16,384 device px wrap or repeat. Keep height × DPR under that limit, or capture in segments.
