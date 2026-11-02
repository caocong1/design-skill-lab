# Microsoft HAX Toolkit: the 18 Guidelines for Human-AI Interaction, by phase
- id: hax-toolkit · url: https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/ · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (licence not stated on the pages read; the guidelines come from a 2019 CHI paper)
> 中文导语：微软 HAX 工具包的 18 条人机交互指南按四个阶段编号：初始（G1 说明系统能做什么、G2 说明它做得多好）、交互中（G3 按情境把握时机、G4 显示情境相关信息、G5 符合社会规范、G6 减少社会偏见）、出错时（G7 高效调用、G8 高效忽略、G9 高效纠正、G10 不确定时收窄服务、G11 说明为什么这样做）、长期（G12 记住近期交互、G13 从用户行为学习、G14 谨慎更新、G15 鼓励细粒度反馈、G16 说明用户操作的后果、G17 提供全局控制、G18 通知变化）。编号可引用，适合做评审的 AI 控制与信任族。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch): the AI guidelines page and the 18 guideline cards at `/haxtoolkit/library/`; the site is undated and describes the set as "evidence-based best practices… a synthesis of more than 20 years' research".

## Key facts
1. **Initially**: G1 "Make clear what the system can do"; G2 "Make clear how well the system can do what it can do".
2. **During interaction**: G3 "Time services based on context"; G4 "Show contextually relevant information"; G5 "Match relevant social norms"; G6 "Mitigate social biases".
3. **When wrong**: G7 "Support efficient invocation"; G8 "Support efficient dismissal"; G9 "Support efficient correction"; G10 "Scope services when in doubt"; G11 "Make clear why the system did what it did".
4. **Over time**: G12 "Remember recent interactions"; G13 "Learn from user behavior"; G14 "Update and adapt cautiously"; G15 "Encourage granular feedback"; G16 "Convey the consequences of user actions"; G17 "Provide global controls"; G18 "Notify users about changes".
5. Toolkit parts: Design Library (examples and design patterns per guideline), Workbook, Playbook.

## What it changes for the skills
- skills/critique-design/references/heuristics.md: the AI section cites G-numbers (G2 calibrated capability, G8 dismissal, G9 correction, G11 explanation, G16 consequences, G17 global controls) so findings on AI surfaces are traceable.
- skills/design-studio/references/disciplines/ai-experience.md: the control chain (plan, approve, observe, interrupt, undo) maps to G7–G11 and G16–G17; G14 and G18 govern model or behaviour changes between releases.

## Not verified / open
- The Design Library's per-guideline patterns were not read; only the guideline titles and phases.
- No licence is stated; the guideline titles are quoted as short phrases.
