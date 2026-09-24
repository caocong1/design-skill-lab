---
date: 2026-09-24
skill: design-studio
project: bidops-app
type: bug
severity: major
---

## What happened

截图证据有缺陷，skill 没提醒，只有独立评审发现：三条路由前后都被静默重定向到别的页面，两轮评审都没真正看过；一个窗格截在"加载中…"；同一窗格前后宽度不同（380 vs 480）；"之前"截自已部署服务器、"之后"截自本地开发服务器，出现假回归（开发专用测试账号框、缩略图坏）；全部 1x，且没有 brief 自己写的 1366 宽度。脚本用固定 1200 ms 等待，不校验最终 URL。

## Expected / suggestion

在 `references/render-and-look.md` 的陷阱清单加上：每条路由断言最终 URL 或"就绪"元素而不是固定等待；前后对比用同一构建和环境；视口与倍率写进文件名或清单；尺寸取自 brief 声明的目标宽度。
