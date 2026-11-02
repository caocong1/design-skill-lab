# Chartability (POUR-CAF): a 50-heuristic accessibility audit for data experiences, 14 critical
- id: chartability · url: https://chartability.github.io/POUR-CAF/ · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (CC BY-SA 3.0 per the page)
> 中文导语：Chartability（Frank Elavsky）是数据可视化无障碍的清点式审计：七条原则（可感知、可操作、可理解、健壮、妥协、辅助、灵活），50 条启发式，其中 14 条为"关键"（对比度低、信息只靠视觉、文字太小、闪烁致癫痫风险、只有一种输入方式、没有交互提示、覆盖辅助技术控制、没有说明用途和读法、没有标题/摘要/说明、阅读难度不当、没有数据表、数据密度不当、导航繁琐、不尊重用户样式设置）。给 critique-design 一个可数的数据图表无障碍地板。

Read on 2026-11-01 by the visual verifier (fetch): the workbook page ("Chartability_Worksheet_V2", undated); repository `Chartability/POUR-CAF` HEAD `1eec6bb` (2025-03-29). Home: chartability.fizz.studio.

## Key facts
1. Chartability is "a lightweight, high-level audit for catching data experience design failures related to accessibility".
2. Seven principles: Perceivable, Operable, Understandable, Robust, Compromising, Assistive, Flexible (definitions on the page).
3. 50 heuristics, of which **14 are critical**: Low contrast; Content is only visual; Small text size; Visual presents seizure risk; Interaction modality only has one input type; No interaction cues or instructions; Controls override assistive-technology controls; No explanation for purpose or for how to read; No title, summary or caption; Reading level inappropriate; No table; Data density inappropriate; Navigation and interaction is tedious; User style change not respected.
4. The worksheet is distributed as `Chartability_Worksheet_V2.docx`.

## What it changes for the skills
- skills/critique-design/references/heuristics.md and rubric.md: the 14 critical items become the data-view accessibility floor (one table or text alternative per chart; a title and summary; no hue-only encoding; keyboard reachability; respect for user styles).
- skills/design-studio/references/disciplines/data-dense-ui.md: every chart ships with a table or summary and a purpose line; density is a decision to state, not an accident.

## Not verified / open
- The 36 non-critical heuristics were not transcribed.
- The worksheet .docx was not opened; whether V2 adds items beyond the page list is unknown.
