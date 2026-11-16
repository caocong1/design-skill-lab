---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: bug
severity: minor
---

## What happened

`scripts/lint.mjs` reported `cjk-synthetic` (faux bold) on a table caption set at weight 700. CDP showed the caption's own glyphs rendered with the Semibold face. The Regular face it reported belongs to a weight-400 `<span>` inside the caption. Both critics had to rule it out by hand.

## Expected / suggestion

Attribute the fonts per text node and its own computed weight, not per element, so the faces used by a child with a different weight are not charged to the parent.
