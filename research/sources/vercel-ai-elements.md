# Vercel AI Elements: the agent-surface component vocabulary, and its move to shadcn/ui
- id: vercel-ai-elements · url: https://elements.ai-sdk.dev/ · fetched: 2026-11-16 · method: fetch + repo@ca8be600bfd01b3131f9bf6134b51602a71f4374
- review_by: 2027-02-14 (perishable +90d: the site announces deprecation at the end of November 2026) · licence note: paraphrased digest, not a mirror (repository LICENSE Apache-2.0; shadcn/ui MIT)
> 中文导语：AI Elements 是目前最完整的 agent 界面组件词汇：49 个组件分五组，聊天组（Attachments、Chain of Thought、Checkpoint、Confirmation、Context、Conversation、Inline Citation、Message、Model Selector、Plan、Prompt Input、Question、Queue、Reasoning、Shimmer、Sources、Suggestion、Task、Tool）、代码组（Agent、Artifact、Code Block、Commit、Environment Variables、File Tree、JSX Preview、Package Info、Sandbox、Schema Display、Snippet、Stack Trace、Terminal、Test Results、Web Preview）、语音 6、工作流 7（Canvas、Connection、Controls、Edge、Node、Panel、Toolbar）、工具 2。基于 shadcn/ui，WCAG 2.1 AA 基线，"UI adapts to pending, streaming, and complete states"。站点宣布 2026 年 11 月底弃用、迁入 ui.shadcn.com/docs/ai-elements（"没有包可装"）。引用时指向 shadcn 的新址。

Read on 2026-11-01 by the AI-ecosystem verifier (fetch of the site, whose banner carries the deprecation notice; the digest URL `ai-sdk.dev/elements/overview` redirects there; GitHub `vercel/ai-elements` release `ai-elements@1.9.1` 2026-10-14; `ui.shadcn.com/docs/ai-elements`).

## Key facts
1. Banner: "AI Elements is moving to shadcn/ui. This project will be deprecated at the end of November 2026" → `ui.shadcn.com/docs/ai-elements` ("patterns for building agentic interfaces… There is no package to install").
2. **49 components** in five groups: Chatbot (19: Attachments, Chain of Thought, Checkpoint, Confirmation, Context, Conversation, Inline Citation, Message, Model Selector, Plan, Prompt Input, Question, Queue, Reasoning, Shimmer, Sources, Suggestion, Task, Tool); Code (15: Agent, Artifact, Code Block, Commit, Environment Variables, File Tree, JSX Preview, Package Info, Sandbox, Schema Display, Snippet, Stack Trace, Terminal, Test Results, Web Preview); Voice (6); Workflow (7: Canvas, Connection, Controls, Edge, Node, Panel, Toolbar); Utilities (Image, Open In Chat).
3. Built on shadcn/ui: "WCAG 2.1 AA accessibility baseline", CSS variables, dark mode; "Status awareness - UI adapts to pending, streaming, and complete states".
4. Ships an agent skill (`npx skills add vercel/ai-elements`); latest release `ai-elements@1.9.1` (2026-10-14).

Re-checked 2026-11-16 (AI-tools verifier): the banner on `elements.ai-sdk.dev` (unchanged: deprecated "at the end of November 2026") and the full text of `https://ui.shadcn.com/docs/ai-elements`, including its migration section; `vercel/ai-elements` has no commit since the pin.
5. **The destination is live and smaller.** shadcn/ui now presents "Patterns for agentic interfaces, built from shadcn/ui components", copied into the project ("There is no package to install"). A Chat is a list of Message turns inside a **Message Scroller**; the steps of a turn (Reasoning, Tool, Plan) are built on **Trace** "so every step has the same shape". 21 patterns are listed: Chain of Thought, Chat, Checkpoint, Confirmation, Context, File Tree, Inline Citation, Message, Model Selector, Plan, Prompt Input, Queue, Reasoning, Sources, Stack Trace, Subagent, Suggestion, Task, Terminal, Test Results, Tool; new primitives Message Scroller, Trace, Attachment and Code Block.
6. **Not carried over** ("the numbers are low"): Artifact, Audio Player, the React Flow set (Canvas, Connection, Controls, Edge, Node, Panel, Toolbar), Environment Variables, Image, JSX Preview, Mic Selector and the voice items; build them from plain shadcn/ui. A mapping table maps old files to new patterns (for example `agent.tsx` → Subagent, `conversation.tsx` → Chat); existing projects "do not need to migrate".

## What it changes for the skills
- skills/design-studio/references/disciplines/ai-experience.md: the agent-run view's state matrix (plan, task, tool, confirmation, checkpoint, queue, context budget, sources, reasoning) uses these names so a build maps one to one; every such part has pending, streaming and complete states.
- skills/implement-design/references/stacks.md (React / Next with shadcn): start agent surfaces from the shadcn AI Elements patterns, not the deprecated package.

## Not verified / open
- Correction vs the previous version (2026-11-16): fact 2's 49 components shrink to 21 patterns plus four primitives at the new home (facts 5–6); the open question "does the shadcn copy keep all 49?" is answered: no. Whether the old site and repository are archived after 2026-11-30 is still to be seen.
- Per-component props and the Voice group's six names were not transcribed.
- Whether the shadcn copy keeps all 49 components after the move was not checked.
