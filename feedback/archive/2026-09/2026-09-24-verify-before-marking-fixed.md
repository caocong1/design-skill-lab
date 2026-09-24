---
date: 2026-09-24
skill: implement-design
project: bidops-app
type: bug
severity: major
---

## What happened

头号问题（预览原文被裁切）在修复前就把评审报告里那一行改成了"已修复"，独立评审发现三个主题下都仍存在。同时出现回归：页面级 CSS 用 `background:` 简写把新加的全局下拉箭头冲掉；某表格列数字一字一行换行；一个窗格仍用 emoji 当图标。之后另起一次提交专门修这些。

## Expected / suggestion

P0/P1 问题标记为已修之前，必须在同样尺寸下重拍它的证据截图，确认后再改评审报告。给原生控件加全局样式时，先搜索覆盖同一属性的局部 CSS（尤其是简写属性）。
