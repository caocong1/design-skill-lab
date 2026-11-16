---
date: 2026-10-23
skill: design-studio
project: zh-architecture-doc-html
type: missing
severity: minor
---

## What happened

The redesign centred on a dozen architecture diagrams (layered boxes, flows across a boundary). references/disciplines/graphics.md §7 has three bullets on diagrams and nothing on: the rendered-text floor for a scaled SVG (font-size × rendered width / viewBox width ≥ 12 px, which the source failed on 10 of 12 figures), a single flow vocabulary with a legend (colour + line style + arrow + label, consistent across figures; the source contradicted itself between figures), colours as classes / custom properties instead of hex attributes, and a print end state for animated figures. I wrote these into the round's baseline by hand.

## Expected / suggestion

A short "technical and architecture diagrams" section (or discipline file) with those four rules and a measuring snippet for the rendered SVG text size.
