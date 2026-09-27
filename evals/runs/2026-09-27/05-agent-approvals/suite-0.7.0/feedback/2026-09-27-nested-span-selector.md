---
date: 2026-09-27
skill: design-studio
project: suite-0.7.0
type: friction
severity: nit
---

## What happened

The first render showed a common mockup bug: a descendant selector (`.x span{display:block}`) broke inline tabular-number spans onto their own lines. It was only caught by looking at the PNG.

## Expected / suggestion

render-and-look.md "Edges and details" could list "inline numbers broken onto separate lines" as a thing to scan for in data-heavy mockups.
