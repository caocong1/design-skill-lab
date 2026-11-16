---
date: 2026-10-27
skill: critique-design
project: zh-static-docs-site
type: missing
severity: minor
---

## What happened

Round 1 found CSS border triangles (arrowheads) turning into small boxes in forced colours. The suggested fix of colouring the borders `CanvasText` and making the other sides transparent was applied, and round 2 found a regression: down and up arrows lost their triangle or gained a flag, because which side is coloured differs per arrow. The fix that held was remapping the ink and paper tokens to `CanvasText` and `Canvas` inside `@media (forced-colors: active)` and setting `forced-color-adjust: none` on the triangle elements, so their transparent sides stay transparent.

## Expected / suggestion

In `references/heuristics.md` or the rubric's accessibility notes, give the robust pattern for border-drawn shapes in forced colours: remap tokens to system colours and opt the shape out with `forced-color-adjust: none`. Do not recolour individual sides.
