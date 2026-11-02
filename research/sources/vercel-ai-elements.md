# Vercel AI Elements: the agent-surface component vocabulary, and its move to shadcn/ui
- id: vercel-ai-elements · url: https://elements.ai-sdk.dev/ · fetched: 2026-11-01 · method: fetch + repo@ca8be600bfd01b3131f9bf6134b51602a71f4374
- review_by: 2027-01-30 (perishable +90d: the site announces deprecation at the end of November 2026) · licence note: paraphrased digest, not a mirror (repository LICENSE Apache-2.0; shadcn/ui MIT)
> 中文导语：AI Elements 是目前最完整的 agent 界面组件词汇：49 个组件分五组，聊天组（Attachments、Chain of Thought、Checkpoint、Confirmation、Context、Conversation、Inline Citation、Message、Model Selector、Plan、Prompt Input、Question、Queue、Reasoning、Shimmer、Sources、Suggestion、Task、Tool）、代码组（Agent、Artifact、Code Block、Commit、Environment Variables、File Tree、JSX Preview、Package Info、Sandbox、Schema Display、Snippet、Stack Trace、Terminal、Test Results、Web Preview）、语音 6、工作流 7（Canvas、Connection、Controls、Edge、Node、Panel、Toolbar）、工具 2。基于 shadcn/ui，WCAG 2.1 AA 基线，"UI adapts to pending, streaming, and complete states"。站点宣布 2026 年 11 月底弃用、迁入 ui.shadcn.com/docs/ai-elements（"没有包可装"）。引用时指向 shadcn 的新址。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch of the site, whose banner carries the deprecation notice; the digest URL `ai-sdk.dev/elements/overview` redirects there; GitHub `vercel/ai-elements` release `ai-elements@1.9.1` 2026-10-14; `ui.shadcn.com/docs/ai-elements`).

## Key facts
1. Banner: "AI Elements is moving to shadcn/ui. This project will be deprecated at the end of November 2026" → `ui.shadcn.com/docs/ai-elements` ("patterns for building agentic interfaces… There is no package to install").
2. **49 components** in five groups: Chatbot (19: Attachments, Chain of Thought, Checkpoint, Confirmation, Context, Conversation, Inline Citation, Message, Model Selector, Plan, Prompt Input, Question, Queue, Reasoning, Shimmer, Sources, Suggestion, Task, Tool); Code (15: Agent, Artifact, Code Block, Commit, Environment Variables, File Tree, JSX Preview, Package Info, Sandbox, Schema Display, Snippet, Stack Trace, Terminal, Test Results, Web Preview); Voice (6); Workflow (7: Canvas, Connection, Controls, Edge, Node, Panel, Toolbar); Utilities (Image, Open In Chat).
3. Built on shadcn/ui: "WCAG 2.1 AA accessibility baseline", CSS variables, dark mode; "Status awareness - UI adapts to pending, streaming, and complete states".
4. Ships an agent skill (`npx skills add vercel/ai-elements`); latest release `ai-elements@1.9.1` (2026-10-14).

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the agent-run view's state matrix (plan, task, tool, confirmation, checkpoint, queue, context budget, sources, reasoning) uses these names so a build maps one to one; every such part has pending, streaming and complete states.
- skills/implement-design/references/stacks.md (React / Next with shadcn): start agent surfaces from the shadcn AI Elements patterns, not the deprecated package.

## Not verified / open
- Per-component props and the Voice group's six names were not transcribed.
- Whether the shadcn copy keeps all 49 components after the move was not checked.
