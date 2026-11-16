---
date: 2026-11-02
skill: design-studio
project: zh-desktop-ops-tool
type: bug
severity: minor
---

## What happened

scripts/lint.mjs reported no clipped-text warning for table cells visibly truncated with an
ellipsis ("服务器 · Windo…"): `td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }`
in a table with a colgroup of fixed px widths, run at 1440x900 with --no-touch and --scope. The
floor passed and only token-drift and vocabulary findings came back. Reproduced on a copy with the
old widths; the defect was caught by eye in the PNG.

## Expected / suggestion

clipped-text should compare scrollWidth with clientWidth (or measure the text's natural width) for
table cells too, and list the cell text and column. A per-column "need vs width" line would also
help: measuring each column's widest content in the browser fixed the layout in one step.
