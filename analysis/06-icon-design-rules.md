# 图标设计规则：Lucide 设计原则

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 来源：Lucide《Icon design principles》（持续更新，抓取 2026-09-21）｜ 快照：raw/docs/lucide-icon-design-principles.md

Lucide 是目前使用最广的开源线性图标家族之一，它公开了一份几乎每条都带数字的设计规范。对一个用代码画 SVG 的 agent 来说，这是最理想的教材：规则可以直接对着坐标检查。

## 核心观点

- **图标集是"图画的字体"，价值在一致性。** 规范里没有一条是关于"画得好看"的，全部是关于"画得像一家人"的：同一画布、同一描边、同一圆角逻辑、同一最小间隙、相近的视觉重量。
- **视觉重量不能靠包围盒判断。** 规范给了两个可操作的测试：把新图标和家族里的圆、方并排**模糊**后比较明暗；在目标尺寸下模糊，看哪里发黑（细节过密）。这两个测试 agent 可以在渲染出的预览图上真实执行。
- **几何构造 + 光学修正。** 对称图标保持几何居中，不对称图标允许微调；坐标、圆心、子元素尽量落在整像素上，保证低密度屏幕上锐利。

## 关键规则与数值

24 × 24 px 画布；四周至少 1 px 安全区；描边 2 px 且不混用；圆头（round cap）圆接（round join）；描边居中；直角圆角 2 px（元素宽或高 ≥ 8 px）或 1 px（更小的元素）；成直角相交的斜线通常需要约 2.41 px（1+√2）圆角以贴合网格；多于两条线相交处保持尖角；不同元素之间、形状内部的空隙至少 2 px（用一个 2 px 的圆能否塞进去来检验）；曲线优先用圆弧与二次曲线，控制点尽量少；一切对齐像素网格。

## 易腐与耐久

全部耐久——只有 URL 会变：原 `/guide/design/icon-design-guide` 已 404，现为 `/contribute/icons/design-principles`（由 2026-09-21 验链发现）。

## 对设计 agent 的启发

- **先选再画**：大多数产品需要的不是新图标，而是选对一个家族并且不混用；要画，也是按家族规则补缺。
- 为任何自绘图标集先写一页同样格式的规则（画布、安全区、描边、端点、圆角、最小间隙、细节密度），再开始画。
- 预览页必须把新图标与家族邻居并排，在 16/20/24/32/48 px、明暗两种背景下渲染出来看。

## 注意

- Material Symbols 的关键线形状（圆约 20、方约 18、竖矩形 16×20、横矩形 20×16）与可变轴（FILL/wght/GRAD/opsz），以及 Apple 的分层应用图标规则，来自通识；m3.material.io 与 developer.apple.com 为 JS 站点，本轮未能抓取正文核验，因此 `app-icons-and-favicons.md` 明确标注为易腐并要求导出前对照官方页面。

## 对最终 skill 的影响

- `skills/design-icons/SKILL.md`：Extend a Family 的测量清单、Grid and keylines、Craft rules、SVG hygiene 模板（`viewBox` 24、`stroke-width="2"`、round cap/join、`currentColor`）、预览页工作流与模糊测试。
- `skills/design-studio/references/resources/icons.md`（生成）：Lucide 指南条目的新 URL，各家族的原始 SVG 直链。
