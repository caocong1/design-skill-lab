---
date: 2026-09-24
skill: design-studio
project: bidops-app
type: friction
severity: minor
---

## What happened

`implement` / `redesign` 模式规定先 handoff、有灵感步骤、在 `.design/system/` 另建一套设计系统。同一 agent 既设计又实现，宿主已有自己的 `DESIGN.md`；它跳过了 handoff（没读）和灵感步骤，token 直接落到产品源码和已有 `DESIGN.md`。skill 没说这些步骤何时可省，照字面执行会把设计系统分叉。

## Expected / suggestion

写明：已有代码库自带 `DESIGN.md` 或 token 文件时，它们就是唯一的系统记录；同一 agent 实现时 handoff 缩减为验收截图清单；保守的、保留资产的重设计可以不做灵感步骤。
