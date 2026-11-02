# Ant Design X: the RICH design paradigm and the AI component set (`@ant-design/x` 2.10.0)
- id: ant-design-x · url: https://x.ant.design/docs/spec/introduce · fetched: 2026-11-01 · method: fetch + repo@da08db16714b608d7f5db248c2b2fcc30a756660
- review_by: 2027-01-30 (perishable +90d) · licence note: paraphrased digest, not a mirror (code MIT; docs on x.ant.design)
> 中文导语：Ant Design X 是唯一一份中文优先、带已发布组件词汇的 AI 交互规范："RICH"范式（Role 角色、Intention 意图、Conversation 会话、Hybrid UI 混合界面）作为 AI 时代对 WIMP 的替代；规范章节覆盖角色（真实一致 / 流畅自然 / 有人情味）、意图（明确意图类型 / 提供意图预期 / 引导意图表达）、会话（开始 / 追问 / 提示 / 确认 / 错误 / 结束）、混合界面（唤醒｜AI 标识、唤醒｜欢迎提示、表达｜用户输入、表达｜用户发送、确认｜生成过程、反馈｜结果应用、反馈｜结果展示）；18 个组件分六组（Bubble、Conversations、ThoughtChain、Sender、Attachments、Sources 等）。2.10.0（2026-10-29）给 XMarkdown 加了流式预设与打字机配置。对本仓库的中文 AI 产品工作，它和 ai-experience 的七个承载面互补。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch of `/docs/spec/introduce` served in Chinese as "RICH 设计范式简介", the sibling spec pages and `/components/overview`; GitHub API for the monorepo; npm) and by the Chinese-ecosystem verifier (`/changelog-cn`, the 2.10.0 release). Release 2.10.0 is dated 2026-10-29 (2.9.0 2026-07-23, 2.8.0 2026-06-08); 4,831 stars.

## Key facts
1. **RICH** = Role, Intention, Conversation, Hybrid UI, proposed as the AI-era counterpart of WIMP.
2. Spec chapters: Role (真实一致 / 流畅自然 / 有人情味); Intention (明确意图类型 / 提供意图预期 / 引导意图表达); Conversation (开始 / 追问 / 提示 / 确认 / 错误 / 结束); Hybrid UI (唤醒｜AI 标识, 唤醒｜欢迎提示, 表达｜用户输入, 表达｜用户发送, 确认｜生成过程, 反馈｜结果应用, 反馈｜结果展示). Spec pages carry no version or date.
3. **Components** (18, six groups): Common — Bubble, Conversations, Notification; Confirmation — Think, ThoughtChain; Wake — Welcome, Prompts; Express — Attachments, Sender, Suggestion; Feedback — Actions, CodeHighlighter, FileCard, Folder, File Tree, Mermaid, Sources; Others — XProvider.
4. Monorepo packages: `x`, `x-markdown`, `x-sdk`, `x-card`, `x-skill`.
5. **2.10.0 (2026-10-29)**: XMarkdown "`streaming` 支持布尔预设", `streaming.incremental` (re-parse only the growing heading section), `streaming.incompleteMarkdown: 'complete'`, `streaming.typewriter` with `animationConfig.splitBy` (char or sentence), `componentsProps`; Prompts keyboard accessibility (Tab / Enter / Space); Mermaid zoom and export fixes. No agent, MCP or multimodal items in 2.8–2.10.

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the Chinese vocabulary for the conversation lifecycle (开始 / 追问 / 提示 / 确认 / 错误 / 结束) and the Hybrid-UI slots (AI 标识, 欢迎提示, 生成过程, 结果应用 / 展示) become the names used in Chinese briefs and contracts; the component list is the default vocabulary for Ant Design hosts.
- skills/implement-design/references/stacks.md: an Ant Design host building a chat or agent surface starts from `@ant-design/x` (Bubble, Sender, ThoughtChain, Sources) rather than hand-rolled parts; the streaming Markdown presets exist.
- skills/design-studio/references/platforms/embedded-hosts.md: no change (X is a web library, not a host).

## Not verified / open
- The spec pages' prose rules (beyond chapter and slot names) were not transcribed.
- Whether `x-skill` is an agent skill package or a UI component was not checked.
