# 视觉基础：排版数值与色阶的角色契约

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：Butterick《Practical Typography》要点、Radix Colors《Understanding the scale》、Hobday 视觉规则（与 `analysis/03-web-interface-craft.md` 共用）｜ 版本见 `analysis/SOURCE_INDEX.md`

排版与色彩是所有子学科共用的地基。这一篇只提炼两件事：正文排版的三个数，以及"色阶的每一级都是一份角色契约"这个想法。摘要见 `raw/docs/practical-typography-key-rules.md`、`raw/docs/radix-colors-scale.md`。

## 核心观点

- **正文由四个因素决定：字号、行距、行长、字体本身。** 改善一个页面最快的办法通常是：把行长收进合理范围、把行距调到字号的 120–145%、换掉默认字体。装饰性的改动排在这之后。
- **"避免免费字体"这条建议需要按年代重读。** Butterick 写作时开源字体质量普遍一般；今天 Fontshare、Google Fonts 里已有大量专业水准的开源字体。这条建议在今天的准确读法是："避开所有人都见过的默认字体"。
- **色阶的价值不在颜色，在分工。** Radix 的 12 级色阶为每一级规定了用途：1–2 背景、3–5 组件背景（常态/悬停/按下或选中）、6–8 边框（弱/交互/强与焦点环）、9–10 实心填充（常态/悬停）、11–12 文字（低对比/高对比）。一旦"级"变成"角色"，暗色模式与品牌换肤就只是重新映射，而不是重新设计。

## 关键规则与数值

- 字号：印刷 10–12 pt；网页 15–25 px。行距：字号的 120–145%。行长：45–90 字符（含空格）。
- 全大写与小型大写字母：不超过一行，并加 5–12% 字距。
- 首行缩进（字号的 1–4 倍）与段间距（4–10 pt）二选一，不并用。
- 粗体与斜体少用、不叠用；下划线只给链接；居中少用；两端对齐必须开断词。
- 真引号、真破折号、真省略号；字偶距始终开启。
- 色阶角色：见上；11、12 级保证在同色阶第 2 级背景上的可读对比（Radix 以 APCA 为目标）。浅色主题常用纯白做应用背景，深色主题用灰阶或带色灰阶的 1–2 级，并通过别名切换。

## 易腐与耐久

- 耐久：上述全部。排版数值来自几百年的阅读经验，色阶分工来自界面元素的稳定分类。
- 易腐：具体的色值；"哪些字体算默认"——这个集合每隔几年换一批。

## 对设计 agent 的启发

- 中文正文不能套用拉丁数值：行高要到 1.6–1.8，行长按 25–40 个汉字计，没有斜体，强调靠字重与颜色。这一部分的依据见 `analysis/08-chinese-typography-and-platforms.md`。
- 色阶不要手挑：用感知均匀的色彩空间按曲线生成，再把"级"映射为"角色"，最后对每一对文字/背景**计算**对比度。这正是 `color_tools.py` 存在的原因——色彩算术是模型最不可靠、脚本最可靠的地方。

## 注意

- Evil Martians 的 OKLCH 文章已抓取原文但未单独写摘要；`color.md` 中关于 OKLCH 的表述（L/C/H 的含义、等 L 即等对比、超色域需映射）属于通识并经脚本实测（sRGB `#3b82f6` 实测为 `oklch(0.623 0.188 259.8)`）。
- Refactoring UI 的公开文章托管在 Medium，抓取被 403 拦截，未做摘要；目录中保留条目。

## 对最终 skill 的影响

- `skills/design-studio/references/typography.md`：Body Text Numbers 表（拉丁列）、Scale and Hierarchy、Details That Read as Craft。
- `skills/design-studio/references/color.md`：Building the System 的"级 → 角色"映射表与角色命名、对比度要求表。
- `skills/design-studio/scripts/color_tools.py`：`scale`（OKLCH 11 级色阶，种子色钉在最近一级，含中性色与暗色镜像）、`contrast` / `matrix`（WCAG 比值 + APCA Lc）。
- `skills/build-design-system/SKILL.md`：Token Architecture 三层、"组件永不引用原始值"、Dark Mode 重新映射而非反相。
