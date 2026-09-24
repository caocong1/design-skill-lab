---
date: 2026-09-24
skill: design-product-ui
project: bidops-app
type: missing
severity: major
---

## What happened

用户明确要求覆盖 Office/WPS 加载项任务窗格，套件对这类嵌入宿主的窗格没有任何指引。agent 自己摸索出：窗格宽 320-480 px；应跟随宿主浅色外观，不用深色或高饱和页头；与 Web 不同源、存储不共享，主题选择带不过去；由内嵌 Chromium 渲染；Mac 上无法在真实宿主里验证；需要测试保证窗格与 Web 的 token 一致。

## Expected / suggestion

在 `references/platforms.md` 加"嵌入宿主的窗格"一节（Office/WPS 加载项、浏览器扩展侧栏、IDE 面板），覆盖以上约束。
