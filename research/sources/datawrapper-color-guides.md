# Datawrapper colour guides (Lisa Charlotte Muth): colours in data vis, which scale to use, colours for style guides; Academy accessibility
- id: datawrapper-color-guides · url: https://www.datawrapper.de/blog/colors · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (Datawrapper blog and Academy; no licence stated)
> 中文导语：Datawrapper 的三篇配色文章是数据可视化配色里最常被引用的可操作规则：一张图超过 7 种颜色就该换图表或合并类别；灰色是最重要的颜色；渐变靠明度而不是色相（黑白打印也要成立）、同一明度下不超过两种色相；发散色阶中点用浅灰不用白；分类色板和渐变色板不能互换。2022 年的风格指南调查给出各家的数字（起始色板 3–10 色、NZZ 七色分类、The Times 六色、每图三到四色）。Academy 无障碍页说明三种色觉缺陷检查、方向键导航和 alt 文本后图表主体 `aria-hidden`。本仓库 color.md 与 data-dense-ui 的这些规则此前写作经验。

Read on 2026-11-01 by the visual verifier (fetch): "What to consider when choosing colors for data visualization" (2018-05-29), "Which color scale to use when visualizing data" (2021-03-16, part 1 of 4), "Colors for data vis style guides" (2022-03-30; read to character 100,000 of 141,399), and the Academy article "How we make sure our charts, maps and tables are accessible" ("Last updated on October 8th, 2026"). The Academy itself is organised per chart type and has no chart-chooser or colour article, which is why the blog posts are the source.

## Key facts
1. "If you need more than seven colors in a chart, consider using another chart type or to group categories together."
2. "Consider the color grey as the most important color in Data Vis."
3. "Use light colors for low values and dark colors for high values"; "Use lightness to build gradients, not just hue": a gradient must work in black and white.
4. "Don't place more than two hues with the same lightness in your gradient"; the centre of a diverging scale "should ideally be a light grey, not white".
5. "Don't use a gradient color palette for categories and the other way round."
6. Scale choice (2021): hues for unordered categories; sequential for low → high; diverging for two directions from a midpoint; classed vs unclassed is deferred to part 4 of the series.
7. Style-guide survey numbers (2022): starter palettes of 3–10 colours; NZZ seven categorical colours; The Times six hues with three to four per chart; Datawrapper's sequential gradients average 69 lightness points; WCAG 3:1 for graphics and 4.5:1 for text are cited and called "often overcompensating for data vis"; about 8 % of men and 0.5 % of women are colour-blind.
8. Academy accessibility: the colour-blind check covers "three main types of color vision deficiency"; arrow-key navigation between data points; with alt text present the chart body becomes `aria-hidden`; the screen reader announces e.g. "Line chart with 7 lines"; relative font units scale with browser defaults.

## What it changes for the skills
- skills/design-studio/references/disciplines/data-dense-ui.md: the categorical cap (seven), grey as the base, lightness-driven gradients, the light-grey diverging centre and "never a gradient for categories" cite this source instead of experience.
- skills/design-studio/references/fundamentals/color.md: the chart-palette pointer gains the same rules; the CVD check in `color_tools.py cvd` maps to the three deficiency types named here.
- skills/critique-design/references/heuristics.md: a categorical palette above seven, a hue-only gradient, or a white diverging centre are findings on data views.

## Not verified / open
- Parts 2–4 of the 2021 series (sequential, diverging, classed vs unclassed) were not read.
- The 2022 article was read to character 100,000; the remaining 41,000 characters may hold further numbers.
- Datawrapper's own default palettes (hex values) were not transcribed.
