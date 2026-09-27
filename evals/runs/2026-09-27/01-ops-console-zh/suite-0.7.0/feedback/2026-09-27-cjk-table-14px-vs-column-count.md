---
date: 2026-09-27
skill: design-product-ui
project: suite-0.7.0
type: missing
severity: minor
---

## What happened

data-dense-ui.md sets Chinese table cells at 14 px, but a 12-column work-order table at 1440 wide with a 184 px sidebar only fits (with ≥10 rows above the fold) at 13 px plus two-line cells for device/status. I deviated to 13 px.

## Expected / suggestion

Give a column-budget recipe for wide CJK tables: which columns to stack into two lines (code + name), when 13 px is acceptable, and a width table for common cell types (ID, datetime, badge, person name).
