---
title: AI experience (interaction patterns, agent control, hosted and generative UI, disclosure)
evidence: digest
sources: [shape-of-ai, ai-labelling-law, mcp-apps, openai-apps-sdk-ui, a2ui, web-baseline-2026]
reviewed: 2026-09-27
review_by: 2026-12-02
---

# AI experience

Owns AI features, chat, copilots, agent runs, background agents, widgets in chat hosts, generative UI
and the disclosure spec, in three layers checked separately: **how people use it** (§1), **how they
stay in control** (§2), **who draws its UI and where** (§3); disclosure (§4) covers all three. Patterns
and host rules change quarterly; the questions behind them do not.

Owned elsewhere, link, don't restate: the base state matrix and loading timing,
[product-ui](product-ui.md); streaming and indicator motion, [motion](motion.md) §3 and
[motion-tokens](motion-tokens.md) §4; host frames, variables and widget limits,
[embedded-hosts](../platforms/embedded-hosts.md); labels on generated images and video,
[image-generation](../process/image-generation.md) §5; contrast, [color](../fundamentals/color.md).

## Procedure

1. Pick the surface (§1.1); answer the seven questions (§1.2), one line each, in the surface contract.
2. If it acts on anything: the control chain and approval card (§2). In a chat host or composing UI
   at runtime: §3.
3. Write the disclosure spec (§4.5). Draw the AI states (§5) under the honesty rules (§6).

## 1. Interaction patterns

### 1.1 Decide the surface first

| Surface | Fits | Risk | Design first |
| --- | --- | --- | --- |
| Inline action on existing content (rewrite, summarise, fill) | the task already has a home in the product | invisible unless placed where the need occurs | the trigger on the content, the preview, accept / undo |
| Side-panel copilot | help beside a complex workspace | competes for width; unclear context | what context is in play, shown and removable |
| Full conversation | open-ended exploration, support, research | blank page; results hard to find again | the first turn, answers you can return to |
| Agent run (plan > act > report) | multi-step work with tools and side effects | trust, control, cost, long waits | the plan, the approval card, the report |
| Agent workspace | several background runs, delegated for minutes to hours | turning into a chat clone | the run inbox, run detail, review surface |
| Ambient / automatic (classify, rank, suggest) | high-volume low-stakes decisions | users cannot tell what is AI or correct it | the marker and the correction path |
| Widget in a chat host (MCP Apps, ChatGPT) | a capability entered mid-conversation | host rules override your brand | §3.2 and embedded-hosts |
| Generative UI (A2UI) | an agent composes screens at runtime from your components | no designer present at runtime | the component catalogue (§3.3) |

- **Chat is not the default.** If the task has known inputs and outputs, a form with an AI-assisted
  step beats a conversation. Keep a path that works without AI where the task allows it.
- **Agent workspace, not a chat clone** (thread list, centred column, bottom composer is the rut): a
  run inbox by status (needs you, running, failed, done), run detail (plan, activity, artefacts, cost),
  a review surface (diff or preview beside the source), an artefact or canvas split view, standing
  permissions (§2.2), visible and editable memory, and for computer-use agents a live view of the agent
  at work (Shape of AI "shared vision").

### 1.2 The six questions, and a seventh

Family names follow Shape of AI (shapeof.ai; CC BY-NC-SA, so paraphrase, never copy its pages).

| Question | Family | The design must show |
| --- | --- | --- |
| How do I start? | wayfinders | example prompts from the user's real context, templates, a visible first action, a follow-up question when the request is unclear; never an empty box alone |
| What can I ask for? | prompt actions | capabilities as actions on content (summarise, expand, restructure, restyle, transform, regenerate, edit a region), not prose instructions |
| How do I steer? | tuners | attachments, sources, filters, modes, parameters, saved styles, voice and tone; the context in play is visible and removable |
| How do I stay in control? | governors | plan before acting, approval at the right grain, visible work, pause / stop / undo, cost estimates, variations and branches, memory control (§2) |
| Why should I believe it? | trust builders | citations that open the exact passage, caveats where they matter (not a permanent footer), data-use controls, a trace from prompt to result |
| What is the AI here? | identifiers | one name, mark, colour and personality, restrained; sparkle icons and violet gradients are the category default ([anti-slop](../fundamentals/anti-slop.md)) |
| What may it do on its own? | (gap in the library) | the delegation level and how it changes (§2.2) |

### 1.3 Conversation mechanics

| Part | Rule |
| --- | --- |
| Composer | grows with content (`field-sizing: content`, newly Baseline 2026, with a fallback); Enter sends and Shift+Enter breaks a line (the reverse for long-form tools; decide and show a hint); attachments, paste, drag-drop; send becomes stop while generating; the draft survives a failure; on mobile the field stays above the keyboard with the last message visible |
| Streaming | echo the user's message on send; the working indicator follows product-ui's loading timing and stops when output starts; a stable layout; follow the bottom only while the reader is there, else offer "jump to latest"; Markdown, code and tables render progressively without flicker; motion in [motion](motion.md) §3 |
| Progress text | names the step and the object ("Checking 3 invoices against the bank feed"), never "Thinking…" or "Processing…" |
| Showing work | one compact activity line that expands to tool calls, sources read and durations; finished steps collapse; a reasoning summary only when it helps judge the answer |
| Answers | the answer first; headings and lists only for structured content; copy, retry, edit-and-resend and voluntary, non-blocking feedback on each response; code blocks with language, copy and wrap; citations as numbered inline chips with a sources panel |
| Output controls | edit, undo, retry, adjust next to the output; a visible confirmation when a correction took effect; alternatives only when they genuinely differ |
| Errors and limits | tell apart model refusal, tool failure, network failure, rate limit and context limit; say what happened and what the user can do; keep the conversation and the draft |
| History | searchable, renameable threads; branch or edit an earlier turn without losing the original; show which model and context produced a result |

### 1.4 Streamed text and accessibility

- Streamed text goes to a **polite live region that announces in chunks** (sentence or paragraph),
  never per token; completion is announced once. New messages **never take focus**.
- Stop, retry and "jump to latest" are named, keyboard-reachable buttons; citations and the activity
  line are reachable without hover. Indicators and typing effects follow reduced motion
  ([motion](motion.md) §5). Voice input has a visible listening state and a text alternative.

## 2. Agent control

The chain is **plan > approve > observe > interrupt > undo**, with an audit trail underneath. Draw every
link; a missing one is where trust breaks.

### 2.1 Plan

- **Advisory or contractual** (Shape of AI, Action plan): an advisory plan is shown and the run
  proceeds; a contractual one waits for confirmation. Cheap, reversible, read-only work is advisory;
  spending, sending or changing records is contractual.
- Steps are skimmable and expand to detail; a step with a side effect says so ("needs your approval
  before anything is sent"). The plan is editable in place (drop, reorder, change a parameter) without
  regenerating the rest; experienced users can collapse or skip advisory plans.
- **Plan and execution stay faithful**: when the run diverges, the plan updates and says why.

### 2.2 Delegation levels

| Level | The agent does alone | It asks for | Fits |
| --- | --- | --- | --- |
| Suggest | drafts; the user applies | everything | new users, high-stakes domains |
| Act, reversible | reads, drafts, reversible edits in the user's own space | any side effect | the default for a new agent |
| Act within a grant | a class of low-risk actions the user granted ("approve similar this session") | anything outside the grant | repetitive low-risk work |
| Run in the background | whole runs, reporting when done | irreversible and outward-facing actions | long, trusted, well-scoped tasks |

- **Irreversible or outward-facing actions** (send, pay, delete, publish, share outside) **ask at
  every level**. Autonomy grows only by an explicit grant: listed in one place, scoped (actions, data,
  until when) and revocable. The agent may suggest a grant after repeated approvals, never take one.

### 2.3 Approvals

| Rule | Detail |
| --- | --- |
| The user's terms | the diff, preview, recipients, amount, source account, date; the raw tool call sits behind a disclosure for audit, never alone |
| Smallest useful unit | approve, approve part ("without this item"), edit, reject; say what the run does after a rejection |
| Consequences at the item | the reversal window ("cancellable until 17:00 tomorrow") and what follows it; anything unusual (a changed payee account, a first-time recipient) beside that line |
| Who may approve | stated; a viewer without the role routes the request instead of seeing a dead button |
| **Timeout or unavailable approver = not approved** | the run pauses in "waiting for approval", showing who is waiting and since when; nothing executes |
| Host gaps | ChatGPT gives a widget its tool arguments only after the user approves (draw that pending state); in MCP Apps a tool call or message started from a widget may need the host's consent, and a link may be refused |
| After acting | report what was done, with links to the results and an undo where one exists |

### 2.4 Observe, interrupt, run in the background

- **Stop is always visible** while a run is active. Stopping says what was done and what was not,
  and keeps partial results. Expensive runs show a cost or time estimate first and a usage meter during.
- **Background runs**: the user can leave; notify on "needs you", "failed" and "done", not on every
  step; each run has a URL and persists; an interrupted run resumes or says why it cannot. With
  several agents, one status each and a clear mark on the one waiting for the user.

### 2.5 Undo and audit trail

- Prefer reversible actions and put undo in the report; an action that cannot be undone says so on
  the approval card, before the click.
- Every run keeps a read-only, timestamped, exportable **audit trail**: the request, each plan
  version, every tool call (name, summarised inputs, result, duration, retries), every approval (who,
  when, the exact payload approved), errors, the model, the outputs. In finance, legal or health work
  it is a first-class screen, not a debug log.

## 3. Hosted and generative UI

### 3.1 Who draws the UI

Three options: **text only** (always designed, because it is the fallback), **a widget in a chat host**
(MCP Apps; ChatGPT's plugins UI runs on the same bridge: your server owns the look, inside the host's
variables and rules), and **host-rendered generative UI** (A2UI: the host's renderer and design system
own the look). The choice rule, host mechanics and protocol facts are in
[embedded-hosts](../platforms/embedded-hosts.md) §3-4. The options combine (A2UI output from an MCP
server, an MCP App inside an A2UI component, an A2UI renderer inside an MCP App); the design decision
is only who owns the styling.

### 3.2 Widget in a chat host

- Draw a brandless baseline from the host's variables first, then place the brand only where the host
  allows it (embedded-hosts §3).
- A widget can update the model's context silently: any selection that changes later answers must
  also be visible in the widget.
- **Hosted states (the full list)**: loading; streaming input (a skeleton from partial arguments,
  preview only); approval pending (no arguments yet); denied; result; cancelled (by the user, an error
  or a classifier); an action the host refused (a link it would not open, a message it did not post);
  teardown (save state first); no-UI fallback (the text result). Draw each in the host's light and dark
  theme and with host variables missing.

### 3.3 Generative UI: design the catalogue, not the screens

When an agent composes UI at runtime, no designer reviews each composition, so the catalogue carries
all the design intent and must be stricter than a set of fixed screens. Protocol facts (versions,
the Basic catalogue, semantic hints, partial and failure mechanics): embedded-hosts §4.

1. **Inventory** what agents will need to show, from the function map's objects and actions. Cover it
   with the existing design system's components; add a component only when none fits.
2. **Per component**, write: purpose and when not to use it; the semantic variants an agent may pick;
   allowed parents and children and the nesting depth (v1.0 `allowedParents` / `allowedChildren`);
   copy rules with length limits and one good and one bad example (v1.0 carries them in the
   catalogue's `instructions`); validation messages and the disabled-until-valid state; its
   placeholder while data streams in; an accessible name taken from visible text (v1.0 renderers infer
   screen-reader semantics from visible text).
3. **Per surface**: the attribution slot (agent name and icon, verified by the orchestrator), the
   unknown-component fallback, the failed-surface text, and the text-only answer.
4. **Examples**: a few worked compositions per common task, used as few-shot prompts in the
   generate-and-validate loop.
5. **Render the worst cases**: every variant, the longest copy, a partial render, an unknown component,
   a failed surface.

### 3.4 Handoff

Package layout: [handoff](../process/handoff.md); host items (display modes, border, CSP origins, URI
version, variable map): embedded-hosts §3. Add:

- **Hosted widget**: which tools render UI, which return data only, and which are hidden from the
  model (`visibility: ["app"]`); the §3.2 states as shots.
- **Generative UI**: the catalogue as JSON Schema, a visual spec per component and variant, the worked
  example compositions, and the degradation designs.

## 4. Disclosure and labelling (a deliverable)

Shape of AI says AI-native products may not need labels. The law is stricter: the EU exempts only
what is obvious to a reasonably well-informed person, and China requires persistent labels in the
interaction UI of services that may confuse the public. So **every AI product and every generated
medium ships a disclosure and labelling spec**. It is design, not legal advice: record the markets and
the assumed scope in decisions.md.

### 4.1 Dates

| Jurisdiction | Instrument | Applies |
| --- | --- | --- |
| EU | AI Act Art. 50: disclose AI interaction; machine-readable marking of synthetic output; disclose deep fakes and AI text published on public-interest matters | from 2026-08-02. Art. 50(2) marking for generative systems on the market before that date: by 2026-12-02. Fines up to EUR 15 million or 3 % of worldwide turnover |
| EU | Code of Practice on transparency of AI-generated content (voluntary): label design and placement | final 2026-06-10 |
| EU | Commission guidelines on Art. 50 | approved 2026-07-20; apply only after formal adoption (pending on 2026-09-27) |
| China | 人工智能生成合成内容标识办法 + mandatory standard GB 45438-2025: explicit and implicit labels | in force since 2025-09-01; apps were removed from stores for missing labels (2025-11-25) |

### 4.2 Where labels must appear

| Surface | EU | China | A default that satisfies both |
| --- | --- | --- | --- |
| Chat, assistant, agent UI | inform at the latest at the first interaction; persistent badges or icons near the input or output field count; disclose whenever asked; periodic reminders for agents acting for the user, companions, children, older users, and finance, legal or health advice | text containing 人工智能 or AI plus 生成 and/or 合成, persistently near the content and/or persistently at the top, bottom or background of the interface (GB §5.6); the standard's examples: "AI生成" at the foot of a bubble, "以上内容由人工智能生成合成" under the composer | a first-turn statement, a persistent "AI" label by the composer, and an "AI生成" / "AI-generated" footnote on each output |
| Message an agent sends (email, chat to others) | an "AI" label at the top | a text label at the start or end | the label at the top |
| Voice | say so at session start; reminders in long calls; an earcon alone is not enough | a spoken label with both elements, or the rhythm short-long short-short, at start, end or middle; for voice assistants, every round | spoken disclosure at session start and on request |
| Generated images, video, virtual scenes | see [image-generation](../process/image-generation.md) §5 | same | reserve the label slot on the artboard |
| Published text on public-interest matters | a label at the top, near the headline, unless a named person holds editorial responsibility after human review | a text label at start, end or a suitable middle position | label at the top |
| Download, copy, export | the label stays visible when reshared or downloaded | the explicit label stays in the file; the metadata carries an `AIGC` field | label baked in, metadata kept |
| Platforms that publish user content | - | a notice around the item in three grades (confirmed, possible, suspected) and a "declare AI content" control | design all three notices and the control |

### 4.3 What does not count as disclosure (EU guidelines)

Disclosure only in terms, URLs or documentation; an invisible watermark or metadata alone; a vague
word such as "assistant"; a human-like persona that may mislead; a blanket "this site uses AI"; a
technology statement ("uses LLMs"). Banner blindness is a failure too: one prominent notice before the
first interaction plus a small persistent label beats a modal on every turn.

### 4.4 Label design

- **EU**: the main element is a capitalised "AI", letters of equal height; an optional second layer
  says "generated" or "modified" and what changed. EU icons: three forms (AI, AI + GENERATED, AI +
  MODIFIED) in four variants (black, white, black 50 %, white 50 %); icons with a text label did better
  in user tests. No minimum pixel size is set.
- **China**: the text contains 人工智能 or AI plus 生成 and/or 合成; text content may use a corner mark
  containing "AI". The user agreement states the label method and style; unlabelled output only at the
  user's request, with logs kept at least 6 months: an "export without label" setting needs its
  agreement text and a confirmation.
- **Label the action, not only the feature** ("Rewritten with AI"); name the actor on every message
  and keep the identity visible through a handoff to a human; a style reserved for AI content helps.
- Accessible: contrast computed on the real background, alt text or an ARIA name, a second layer
  reachable with assistive technology, timed labels visible long enough to read.

### 4.5 The spec

Paste into the surface contract and the handoff spec, filled in:

```markdown
## Disclosure and labelling
- Markets and assumed scope: <EU / CN / other; why the service is or is not in scope>
- First exposure: <exact text zh/en; where; before or at the first turn>
- Persistent indicator: <element, position, how it looks in every state incl. mobile and collapsed>
- Per-output label: <wording zh/en; position; style reserved for AI content>
- Reminders: <triggers: long session, agent acting for the user, advice contexts>
- On request: <the answer to "are you an AI?">
- Human handoff: <how the change of actor is shown>
- Generated media: <label slots, per image-generation §5>
- Export, copy, download: <label retained; metadata fields>
- Accessibility: <alt / ARIA text; contrast pair and computed ratio>
```

## 5. States to draw

Add these rows to the [product-ui](product-ui.md) state matrix; reach each by `?state=` for capture.

| Layer | States |
| --- | --- |
| Conversation | first use (wayfinders), composing, sent, working, streaming, complete, stopped (partial kept), refusal, tool failure, network failure, rate limit, context limit, regenerated or branched |
| Agent run | plan proposed, plan awaiting confirmation, running step n of m, waiting for approval, approval timed out (not approved), rejected, partly approved, step failed with recovery choices, stopped, completed with report, undone |
| Hosted widget | the list in §3.2, plus host dark theme and missing host variables (the fallback path) |
| Generative UI | partial render, unknown-component fallback, failed surface, disabled until valid |
| Disclosure | first-exposure notice; the persistent label present in every state above |

## 6. Honesty rules

- Never fake latency, typing or "thinking"; never show confidence the system does not have, and show
  uncertainty where it changes what the user should do.
- Never pass the AI off as a person; keep a human reachable where the stakes call for it.
- Mock-up conversations use realistic domain content, including an imperfect answer and an error.

## 7. Traps

A chat clone for a task with known inputs; raw tool-call JSON as the approval, or "approve all" by
default; "Thinking…" as the only progress; auto-scroll that yanks the reader down; a plan the run
silently stopped following; disclosure only in the terms, or a label lost on export; a hosted widget
that rebuilds the host's composer or brands itself against the host's rules; "generative UI needs no
design" (it needs a stricter catalogue).
