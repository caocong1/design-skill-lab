# Google PAIR People + AI Guidebook: chapters, automation vs augmentation, patterns
- id: pair-guidebook · url: https://pair.withgoogle.com/guidebook/ · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (licence not stated on the pages read)
> 中文导语：Google PAIR 的《People + AI Guidebook》是 AI 产品设计方法里最常被引用的一手文本：六章（用户需求与成功定义、数据收集与评估、心智模型、可解释性与信任、反馈与控制、错误与优雅失败），加模式库、案例、工作坊和术语表。核心判断是"自动化 vs 增强"：自动化那些困难、不愉快的任务，增强人们喜欢做、带有社会资本的任务；并给出"AI 可能更好 / 可能不更好"的清单（可预测性重要、人们不想被自动化时别用）。本仓库 ai-experience 的"第七问：它能自己做多少"此前没有一手来源。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch): the chapter pages (`/chapter/user-needs/` and siblings render as static HTML); `/guidebook/` and `/guidebook/patterns` are a client-rendered app, so the pattern list below was extracted from its JavaScript bundle (`assets/main-SMD7SNZ6.js`) and is partial.

## Key facts
1. Six chapters: User Needs + Defining Success; Data Collection + Evaluation; Mental Models; Explainability + Trust; Feedback + Control; Errors + Graceful Failure; plus Patterns, Case Studies, Workshop and Glossary sections.
2. The User Needs chapter's three considerations: "Find the intersection of user needs & AI strengths"; "Assess automation vs. augmentation" ("Automate tasks that are difficult, unpleasant… Augment tasks that people enjoy doing, that carry social capital"); "Design & evaluate the reward function".
3. "When AI is probably better / not better" lists; the not-better side includes "Maintaining predictability is important" and "People don't want a task automated".
4. Pattern cards with imagery found in the bundle (14): automate-in-phases, automate-more-when-risk-is-low, be-accountable-for-errors, design-for-your-data-labelers, determine-if-ai-adds-value, explain-for-understanding, explain-the-benefit, give-control-back-to-the-user, good-data-practices, learn-from-label-disagreements, let-users-give-feedback, let-users-supervise-automation, precision-and-recall-tradeoffs, set-the-right-expectations. Further pattern titles in the bundle: "Explain for understanding, not completeness", "Explain the benefit, not the technology", "Determine how to show model confidence, if at all", "Make it safe to explore", "Anchor on familiarity".
5. Six "How do I…" entry questions: get started; responsibly build my dataset; onboard users; explain my AI system; calibrate trust; support when something goes wrong.
6. Pattern cards are "Aim for / Avoid" pairs with example apps (Run, Plant Pal, Owl).

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the delegation question ("how much may it do by itself") gets the automation-vs-augmentation test and the phased-automation / more-when-risk-is-low patterns; expectation setting and "explain the benefit, not the technology" become brief prompts.
- skills/design-studio/references/process/truth-files.md (PRODUCT.md for AI features): record which tasks are automated and which augmented, and the reward function the feature is judged by.

## Not verified / open
- The total pattern count is not confirmed (single-page app); only image-backed slugs and titles in the bundle were read.
- No licence is stated on the pages read; the guidebook is treated as citable documentation, not reusable text.
