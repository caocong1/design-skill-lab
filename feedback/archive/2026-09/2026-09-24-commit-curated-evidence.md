---
date: 2026-09-24
skill: critique-design
project: bidops-app
type: friction
severity: nit
---

## What happened

评审报告要引用截图，但 agent 把 `.design/shots/` 整个加进了 `.gitignore`（批量 PNG），于是提交进仓库的评审指向不存在的证据。

## Expected / suggestion

写明提交什么：少量精选证据（每个问题的裁图或关键前后对比）入库，批量扫图忽略。
