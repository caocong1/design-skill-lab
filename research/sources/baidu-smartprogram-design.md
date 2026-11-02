# 百度智能小程序体验指南 (Baidu smart mini-program design guide), incl. the 适老化 whitebook page
- id: baidu-smartprogram-design · url: https://smartprogram.baidu.com/docs/design/overview/introduction/ · fetched: 2026-11-01 · method: browser
- review_by: 2027-11-01 (durable +365d: the guide's last 更新记录 entry is 2023-07-03) · licence note: paraphrased digest, not a mirror (page licence "创作共用-署名-禁止演绎")
> 中文导语：百度智能小程序的体验指南（最近更新 2023-07-03）：750 px 基准、左右边距至少 34 px（17 pt）、阅读文本 17 pt 及以上、可点击文本按钮 12 pt 及以上、每个模块不超过 3 种字号、文字色 #000/#333/#999/#CCC、导航标题不超过 8 个中文字符；2021-09-24 加入的适老化页给出字号 18–30 pt、对比度"至少为 3:1"（原文如此）、减少紫蓝饱和度（"叠加 30% 黄色"）、音频 +10% 与 0.75 倍慢速、触控"44pt 左右"。陈旧但仍是该宿主的现行规范。

Read on 2026-11-01 by the Chinese-ecosystem verifier (headless render; the static HTML is a 1.3 KB shell): `/docs/design/overview/introduction/`, `/foundation/layout/`, `/foundation/typography/`, `/component/topnav/`, `/whitebook/how_to_improve_barrier_free_experience/`. 更新记录 last entry 2023-07-03; the accessibility page was added 2021-09-24.

## Key facts
1. Canvas 750 px; "至少留出左右边距 34px（17pt）".
2. Type: "阅读文本使用17pt及以上，可点击文本按钮使用12pt及以上"; at most three sizes per module.
3. Text colours `#000000` / `#333333` / `#999999` / `#CCCCCC`.
4. Navigation title "不超过 8 个中文字符"; safe-area formula = status bar + 框架控制功能区 (+ home indicator on iPhone).
5. **适老化** (whitebook): "字号在 18pt-30pt"; contrast "至少为 3:1" (as written); reduce purple and blue saturation ("叠加30%黄色"); audio "+10%" volume and "0.75 倍慢速"; touch "44pt左右"; a 自检表.

## What it changes for the skills
- skills/design-studio/references/platforms/mini-programs.md: a Baidu column (34 px margins, 17 pt reading text, 12 pt tappable text, ≤ 3 sizes, 8-character titles) and its elder-mode numbers, flagged as 2021–2023 and weaker than GB/T and MIIT on contrast (3:1 vs 4.5:1).

## Not verified / open
- The page is a JavaScript app; an agent needs a headless browser to read it.
- Whether Baidu enforces any of this at review is not stated.
