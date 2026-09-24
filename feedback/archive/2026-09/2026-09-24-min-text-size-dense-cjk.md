---
date: 2026-09-24
skill: critique-design
project: bidops-app
type: friction
severity: minor
---

## What happened

`references/typography.md` 写"任何文字不低于 12"，评审建议最小 12px；实现时用了 11px 最小字号，agent 事后把评审报告里的建议改成 11px，且没写进 `decisions.md`。独立评审随后把该条判为未修复。

## Expected / suggestion

`data-dense-ui.md` 明确桌面端高密度中文界面的最小字号和是否允许例外；critique-design 禁止事后改写已发出的建议，偏离要进 `decisions.md`。
