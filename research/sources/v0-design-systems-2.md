# v0 Design Systems 2.0: import sources, v0.json and the source-verification rule
- id: v0-design-systems-2 · url: https://v0.app/docs/design-systems-2 · fetched: 2026-11-01 · method: fetch
- review_by: 2027-01-30 (perishable +90d) · licence note: paraphrased digest, not a mirror (Vercel documentation)
> 中文导语：v0 的"设计系统 2.0"把一套设计系统存成 `v0.json`（schema 版本 1，最多三个参考来源）加一个 `SKILL.md`。来源可以是 GitHub 仓库、Figma 帧、Storybook/文档链接和附件；规则是"组件、属性、token 无法从来源核实就不用"。全文不提 DESIGN.md。本仓库主题 02 从 2026-09-27 起直接引用这页，现在补成正式摘要。

Read on 2026-11-01: the docs page (frontmatter `lastUpdated: 2026-10-31`). First read by a verifying subagent, then re-fetched for the quotes below.

## Key facts
1. Import sources: "GitHub repositories for the design system source or apps that consume it"; "Figma frames or nodes for visual reference"; "Links such as Storybook, docs sites, or design guidelines"; "Attachments such as screenshots, ZIPs, exported packages, or `.tgz` package archives".
2. "During import, v0 stores the reusable setup in `v0.json`", the source of truth for what gets applied when the skill is used; `version: 1` is the schema version.
3. "A `v0.json` can include up to three reference sources."
4. "If a component, prop, or token cannot be verified from the sources, v0 should not use it."
5. Figma frames, links and attachments are import inputs distilled into the saved skill's instructions and references, not long-lived `v0.json` sources; for Figma, v0 "imports a screenshot and extracted frame context".
6. The result is saved as a skill with a `SKILL.md`; a logo "up to 4 MB" is stored as `logo.png` beside it.
7. DESIGN.md / design.md: not mentioned anywhere on the page.

## What it changes for the skills
- skills/design-studio/references/process/system.md section 8: the v0 row becomes verified; its "cannot verify from source, do not use" rule is the same as our "never use a token the host cannot show in its source".
- research/topics/02: conclusion 9 now rests on a digest instead of a bare URL.

## Not verified / open
- The 2026-09-27 reading (topic 02) also noted a starter app and a pause for human review before saving; this read did not re-check those two points.
