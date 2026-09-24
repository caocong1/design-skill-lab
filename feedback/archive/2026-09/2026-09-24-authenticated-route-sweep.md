---
date: 2026-09-24
skill: design-studio
project: bidops-app
type: missing
severity: minor
---

## What happened

要给一个需要登录的运行中应用逐路由截图（约 40 条路由，带种子 ID），`scripts/shot.sh` 只接受单个 URL 或文件、没有登录和批量能力。agent 手写了登录辅助、路由表、截图脚本，并自行设置 zh-CN 语言和 Asia/Shanghai 时区。

## Expected / suggestion

在 `references/render-and-look.md` 给出"登录后逐路由截图"的做法或脚本：登录一次、路由表带 ID、语言/时区/视口参数、对共享服务器只读、每条路由一张 PNG。
