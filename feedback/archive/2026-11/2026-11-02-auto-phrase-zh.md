---
date: 2026-11-02
skill: design-studio
project: zh-docs-static-site
type: friction
severity: minor
---

## What happened

`references/fundamentals/cjk-typography.md` (Line breaking) suggests `word-break: auto-phrase` so headings keep phrases whole. On a `lang="zh-Hans"` h1 with `text-wrap: balance`, Chrome still broke 「合同审查（五步完整流程）」 inside 「五步」 at 390 after adding it (rendered with `capture.mjs`, 2026-11-02). The fresh critic raised the split as a finding.

## Expected / suggestion

Say that auto-phrase only segments Japanese in Chromium today and give a Chinese recipe: keep short trailing parentheticals in a `white-space: nowrap` span, move a long one to its own line under 600 px, or insert `<wbr>` only at phrase boundaries the author controls.
