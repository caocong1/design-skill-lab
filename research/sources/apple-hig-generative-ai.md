# Apple HIG: Generative AI (and the Machine learning companion page)
- id: apple-hig-generative-ai · url: https://developer.apple.com/design/human-interface-guidelines/generative-ai · fetched: 2026-11-01 · method: json-api
- review_by: 2027-01-30 (perishable +90d: the page changed on 2026-06-08 and ties to Apple Intelligence releases) · licence note: paraphrased digest, not a mirror (Apple developer documentation; quotations kept short)
> 中文导语：Apple HIG 的 Generative AI 页是目前唯一一份平台方写的生成式 AI 界面规范：让人保持控制（可撤销、可重试、可调整）、明确披露 AI、不冒充人类、按地区法规披露、给非 AI 的替代路径、幻觉提示、不自动执行删除和购买这类难以撤销的动作、具体的进度文案、志愿式反馈。2026-06-08 的修订加了"让人改进结果、在生成过程中反馈"的指引。本仓库 ai-experience.md 的输出侧规则此前只引用主题综合，现在有了一手摘要。

Read on 2026-11-01 by the platform verifier (DocC JSON `generative-ai.json` and `machine-learning.json`; change log on the page: "June 9, 2025 New page", "June 8, 2026 Added guidance for letting people refine results and providing feedback during content generation, and updated guidance for choosing a model type"). Section anchors are given in brackets.

## Key facts
1. **Control**: "Keep people in control… Give them the ability to dismiss new content they don't want, and revert or retry content transformations… Clearly identify when and where you use AI." [#Best-practices]
2. **Disclosure**: "Never trick someone into thinking they're interacting with or viewing content authored by a human if they're actually interacting with AI. Ensure your approach to disclosure aligns with any regulations in the regions where you offer your app." [#Transparency]
3. **Expectations**: "Set clear expectations about what your AI-powered feature can and can't do… For open-ended features like a search bar or generation prompt, consider offering curated suggestions". [#Transparency]
4. **Model choice**: "On-device models keep people's information on their device, respond quickly, and work offline. When a feature needs more processing power or a larger context size, server-based models are worth considering… making sure people know their information may be sent to a server, showing them what's shared". The FoundationModels framework "requires a compatible device with Apple Intelligence turned on." [#Privacy; #Models-and-datasets]
5. **Permission and data**: "Ask permission before using personal information and usage data… use the minimum data you need and always offer a clear way to opt out… If you need sensitive data for model improvement or storage, get explicit permission". [#Privacy]
6. **Fallback**: "When possible, consider offering a non-AI fallback." (examples: Genmoji next to regular emoji; notification summaries). [#Best-practices]
7. **Hallucination**: "clearly communicate that AI-generated content may contain errors… Avoid requesting factual information unless you're confident the model has access to verified and up-to-date information… Avoid using AI-generated content in situations where a possible hallucination could misinform and harm someone." [#Inputs]
8. **Irreversible actions**: "Avoid automating destructive actions, like deleting photos, and actions that are hard to undo, like making a purchase on a person's behalf. Generally, ask for confirmation before performing a significant action on someone's behalf." [#Inputs]
9. **Outputs (2026-06-08 addition)**: surface "controls like Edit, Undo, Retry, or Adjust near generated content… provide a clear signal that their action had an effect". Blocked results coach the person (Image Playground: "Unable to use that description."). [#Outputs]
10. **Latency copy**: "design a loading experience or generate in the background"; "instead of 'Processing…', say 'Finding substitutions for ingredients' or 'Summarizing key themes from your notes.'" [#Outputs]
11. **Alternatives**: "Consider offering alternate versions of results." The Machine learning page adds "avoid providing too many options… List the most likely option first". [#Outputs; machine-learning#Multiple-options]
12. **Copyright**: "Strive to avoid replicating copyrighted content… let people choose from a set of pre-approved prompts… explicitly tell the model to avoid mimicking certain content or styles." [#Outputs]
13. **Feedback**: "Always make providing feedback voluntary… a feedback affordance in a clear location that doesn't interrupt the experience… simple thumbs-up and thumbs-down buttons"; "separate your model from your user experience so you can swap out the model". [#Continuous-improvement]
14. **Companion page Machine learning** (change log 2026-06-08 "minor updates"): sections Limitations, Explicit and Implicit feedback, Corrections ("use guided corrections instead of freeform"), Confidence ("translate confidence values into concepts that people already understand"), Multiple options. Related HIG pages revised the same day: Siri ("Revised for Siri AI") and Snippets (new page). Resources named: FoundationModels, CoreAI, "acceptable-use-requirements-for-the-foundation-models-framework".

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the output-side rules (Edit / Undo / Retry / Adjust next to generated content, specific progress copy, alternate versions, non-AI fallback, voluntary feedback) and the input-side rules (no automated destructive or hard-to-undo actions; confirm significant actions) now cite a platform owner. The disclosure rule matches `ai-labelling-law`: never pass AI off as human, and disclose per the regions served.
- skills/design-studio/references/platforms/ios.md: Apple Intelligence features follow this page; a non-AI path and a hallucination notice are platform expectations, not extras.
- skills/critique-design/references/heuristics.md: AI surfaces are checked for undo/retry affordances near the output, a disclosure at first exposure, and a confirmation step before purchases or deletions.

## Not verified / open
- The page gives no sizes, delays or copy lengths; everything here is behavioural.
- Whether App Review enforces any of it (beyond the Foundation Models acceptable-use requirements) was not checked.
- The lead did not re-fetch the page; quotations are as extracted from the DocC JSON by the verifier on 2026-11-01.
