# AntV 设计价值观与色板 (AntV design values and palette spec): trust, ease, insight; six palette types with hex values
- id: antv-design-principles · url: https://antv.antgroup.com/specification/principles/basic · fetched: 2026-11-01 · method: repo@aff864a
- review_by: 2027-01-30 (perishable +90d: the site is being restructured; two documented paths already 404) · licence note: paraphrased digest, not a mirror (site content, no licence stated; the docs repository `antvis/antvis.github.io` is read as source)
> 中文导语：AntV 把可视化设计价值观从"准确、清晰、有效、美"升级为三条：信任感（不歪曲、不误导、不遗漏）、轻松感（格式塔分组、数据墨水比）、意义感（参考线、事件标记）。色板规范给出六类色板的具体色值：分类基础 10 色（#5B8FF9 #61DDAA #65789B #F6BD16 #7262fd #78D3F8 #9661BC #F6903D #008685 #F08BB4）、顺序 12 组单色相 × 9 级、发散 6 组 × 17 级、叠加 4 组 3×3、强调 9/19 色、语义红绿黄 (#F4664A #30BF78 #FAAD14)；单色相顺序色板"人眼可识别的色彩数量 5～7 个"；高亮不超过 8 个序列，其余灰。全部色板声明"通过无障碍测试校验"。这是唯一一份带色值和色觉考量的中文数据可视化规范，与 Ant Design 配套。

Read on 2026-11-01 by the visual verifier: the live pages `/specification/principles/basic` and `/specification/language/palette` (the older paths `/specification/principles` and `/specification/language/color` return 404); content confirmed against the docs repository `antvis/antvis.github.io` files `docs/specification/principles/basic.zh.md` and `docs/specification/language/palette.zh.mdx` at docs HEAD `aff864a` (2026-09-15).

## Key facts
1. Values were upgraded from "准确、清晰、有效、美" to three: 信任感 ("不歪曲，不误导，不遗漏"), 轻松感 (Gestalt grouping, data-ink ratio), 意义感 (reference lines, event marks).
2. Colour mapping: hue ↔ 分类型; saturation ↔ 有序型; brightness ↔ 数值型.
3. "6 大色板类型": 分类 (基础 10 色: `#5B8FF9 #61DDAA #65789B #F6BD16 #7262fd #78D3F8 #9661BC #F6903D #008685 #F08BB4`; 扩展 20 色), 顺序 (12 single-hue ramps × 9 steps; 4 adjacent-hue ramps × 9), 发散 (6 palettes × 17 steps), 叠加 (4 bivariate 3×3 grids, named MYG / MPC / MBG / MOB), 强调 (推荐 9 色, 扩展 19 色), 语义 (`#F4664A` red, `#30BF78` green, `#FAAD14` yellow).
4. "人眼可识别的色彩数量 5 ～ 7 个" for single-hue sequential ramps.
5. Three 20-colour themes: Autumn, Macaron, Contrasting Orange (for 投屏及讲演).
6. "8 条使用建议": highlight at most 8 data series ("不超过 8 个"), the rest grey; one mapping per datum; explain the colours; consistency across a dashboard; no rainbow for ordered data; equal Lab-L steps for sequential ramps; categorical palettes alternate light and dark for colour-vision deficiency; prefer blue–yellow over yellow–green contrasts.
7. "以下所有色板均通过无障碍测试校验".

## What it changes for the skills
- skills/design-studio/references/disciplines/data-dense-ui.md: a Chinese-market default palette family with hex values and a stated CVD strategy; the 5–7 steps per single-hue ramp and the 8-series highlight cap join the Datawrapper rules.
- skills/design-studio/references/fundamentals/color.md: the chart-palette pointer names AntV for Ant Design hosts.
- skills/implement-design/references/stacks.md: G2 / AntV charts in an Ant Design host take these palettes rather than a hand-picked set.

## Not verified / open
- The 12 sequential and 6 diverging ramps' hex lists were not transcribed (only the categorical ten and the semantic three).
- "通过无障碍测试校验" names no test or threshold.
- The live site paths may move again; the repository file paths are the stable reference.
