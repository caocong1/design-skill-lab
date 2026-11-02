# Financial Times Visual Vocabulary: nine relationship categories and when each chart type fits
- id: ft-visual-vocabulary · url: https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary · fetched: 2026-11-01 · method: repo@befb9cb
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (the README states "Copyright © The Financial Times Limited, all rights reserved" for the content; the repository root LICENSE is MIT © 2016 FT Interactive News and applies to code)
> 中文导语：FT 视觉词汇表是"先问数据关系、再选图表"的标准参照：九类关系（偏差、相关、排名、分布、随时间变化、部分与整体、量级、空间、流向），每类列出适用图表并附一句什么时候用、什么时候别用（柱状图必须从 0 开始、等值区域图只画比率不画总量、饼图难以比较扇区、象形图只能表示整数）。有简体中文海报版。本仓库 data-dense-ui 此前没有图表选择的分类依据。

Read on 2026-11-01 by the visual verifier: `visual-vocabulary/README.md` via the GitHub API at repo HEAD `befb9cb` (2024-03-12); the README is undated. Poster PDFs (en, JP, cn-simplified, cn-traditional, de, es, fr) were not opened.

## Key facts
1. Nine relationship categories, chart entries counted from the README: Deviation 4, Correlation 5, Ranking 6, Distribution 8, Change over Time 12, Part-to-whole 10, Magnitude 10, Spatial 8, Flow 4 = 67 entries (some chart types repeat across categories).
2. Deviation: "variations (+/-) from a fixed reference point… zero… a target or a long-term average".
3. Correlation warning: "many readers will assume the relationships you show them to be causal".
4. Ranking: use "where an item's position in an ordered list is more important than its absolute or relative value".
5. Magnitude: a column chart "Must always start at 0 on the axis"; a lollipop "does not HAVE to start at zero (but preferable)".
6. Spatial: "Used only when precise locations or geographical patterns in data are more important to the reader than anything else"; a choropleth "should always be rates rather than totals".
7. Isotype: "use only with whole numbers (do not slice off an arm to represent a decimal)".
8. Cautions kept as data: pie "difficult to accurately compare the size of the segments"; stacked column "difficult to read with more than a few components"; area "seeing change in components can be very difficult".
9. "Todo" sections for Uncertainty, Animation, Interactivity, Map projections and Colour are unwritten.

## What it changes for the skills
- skills/design-studio/references/disciplines/data-dense-ui.md: a chart-choice step ("which relationship: deviation, correlation, ranking, distribution, change over time, part-to-whole, magnitude, spatial, flow") before any chart is drawn, with the zero-baseline, rates-not-totals and whole-number rules as checks.
- skills/critique-design/references/heuristics.md: a column chart whose axis does not start at zero, a choropleth of totals, or a pie asked to compare near-equal segments are findings.
- catalogue: candidate row for `dataviz` with the cn-simplified poster as the Chinese entry point.

## Not verified / open
- Counts were taken from the README text, not the posters; the posters may group differently.
- The content licence (all rights reserved) permits reference, not mirroring; this digest paraphrases.
