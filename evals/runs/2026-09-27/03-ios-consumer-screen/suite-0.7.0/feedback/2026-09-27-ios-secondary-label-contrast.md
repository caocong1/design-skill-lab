---
date: 2026-09-27
skill: design-product-ui
project: suite-0.7.0
type: missing
severity: minor
---

## What happened

iOS's default secondaryLabel (60% gray, about 3.4:1 on white) fails WCAG AA for small text. The skill says "use the system colours" and never warns about this, so I darkened it to #636366 after computing the contrast.

## Expected / suggestion

In the iOS section of platforms.md, note which semantic system colours fall below AA, and what to do when a brief requires AA.
