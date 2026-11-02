# Carbon for AI (IBM): the AI label, explainability popover, light-as-metaphor styling and the AI component variants
- id: carbon-for-ai · url: https://www.carbondesignsystem.com/building-blocks/foundations/carbon-for-ai · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d: rules; the component list is dated) · licence note: paraphrased digest, not a mirror (Carbon documentation; licence not stated on the page; Carbon code is Apache-2.0)
> 中文导语：IBM Carbon 把"标出 AI"做成了 token 化的系统：四条规则（用 AI 标签和样式标出每处 AI 使用；在体验的每一层提供透明度；把可解释性放进工作流、只在需要时展示；AI 样式不作装饰）；以"光"为隐喻的渐变与光晕，AI 颜色 token 在主主题里而不是单独主题；AI 标签（原名 AI slug）既是标识也是可解释性弹层的入口，是"第一层可解释性"；12 个核心组件各有 AI 变体，且"必须内嵌 AI 标签和可解释性弹层"；用户改写 AI 内容后组件去掉 AI 样式并提供"恢复为 AI"。页面"Last updated Aug 12, 2026"。与法规摘要 ai-labelling-law 并列，是一个具体的实现样本。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch): the page at its new path (`/guidelines/carbon-for-ai/` redirects there), "Last updated Aug 12, 2026".

## Key facts
1. Four rules: "Use the AI label and styling to mark any instances of AI usage"; "Provide transparency of AI at each level of the experience"; "Integrate explainability into the overall user workflow" (shown only when needed or requested); "Don't use the Carbon for AI styling as decoration".
2. Style: "light as a metaphor to 'illuminate' AI-generated content" (brightness, glow, gradients); AI colour and style tokens live inside the main themes (`@carbon/themes`), not a separate theme.
3. The **AI label** (formerly "AI slug") is the primary indicator and the trigger for the explainability popover, "the first layer of explainability".
4. **12 core components** with an AI variant: Checkbox, Datatable, Date picker, Dropdown, Form, Modal, Number input, Radio button, Select, Tag, Text input, Tile; each "is required to have an embedded AI label and explainability popover".
5. **Revert**: when a user overrides AI content the component drops the AI style, with a "revert to AI" path.
6. A separate `@carbon/ai-chat` library exists for conversational surfaces.
7. Accessibility: "Light spread is limited for readability"; the AI styles are tested to Carbon's contrast standards.

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the disclosure spec gains a worked pattern: one label element that is both the mark and the explainability entry; AI styling drops when a person edits the content, with a revert path; AI tokens inside the main theme, never a decorative "AI look".
- skills/design-studio/references/process/system.md: AI-state tokens are a mode of the semantic tier (label, glow, gradient), not a separate theme family.
- skills/critique-design/references/heuristics.md: AI styling used as decoration, or an AI field whose label vanishes after the user edits it without a revert path, are findings.

## Not verified / open
- The token names and gradient values were not transcribed; `@carbon/themes` was not opened.
- Whether the AI label meets the EU Code of Practice's "AI" icon rules (`ai-labelling-law`) is not addressed by Carbon.
