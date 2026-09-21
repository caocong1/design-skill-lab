# AI Product UI: Chat, Copilots and Agents

This field moves quarterly; treat concrete patterns as **perishable** and the
questions behind them as durable. Pattern libraries and vendor guidance:
`../../design-studio/references/resources/app-ui.md` > AI product UX. The six
families below follow the Shape of AI taxonomy (digest in the lab:
`raw/docs/shape-of-ai.md`).

## Decide the Surface First

| Surface | Fits | Risk |
| --- | --- | --- |
| Inline action on existing content (rewrite, summarise, fill) | the task already has a home in the product | invisible if not placed where the need occurs |
| Side panel copilot | help alongside a complex workspace | competes for width; context must be obvious |
| Full conversation | open-ended exploration, support, research | blank-page problem; hard to return to results |
| Agent run (plan -> act -> report) | multi-step work with tools and side effects | trust, control, cost and long waits |
| Ambient / automatic | classification, ranking, suggestions | users cannot tell what is AI or correct it |

Chat is not the default. If the task has known inputs and outputs, a form with
an AI-assisted step beats a conversation.

## The Six Questions

1. **How do I start?** (wayfinders) Example prompts tied to the user's real
   context, templates, a visible first action, follow-up questions when the
   request is unclear. Never an empty box with a blinking cursor alone.
2. **What can I ask for?** (prompt actions) Make capabilities discoverable as
   actions on content: summarise, expand, restructure, restyle, transform,
   regenerate, edit a region. Inline actions beat describing the same thing in
   prose.
3. **How do I steer?** (tuners) Attachments and references, scope and source
   filters, modes, parameters, saved styles, voice and tone. Show what context
   is in play and let users remove it.
4. **How do I stay in control?** (governors) For anything with side effects:
   show the plan before acting, require approval at the right granularity,
   show progress and the work (tool calls, sources read), allow pause, stop
   and undo, show cost or time estimates for expensive runs, keep variations
   and branches reachable, let users manage memory.
5. **Why should I believe it?** (trust builders) Citations that open the exact
   source passage, honest caveats placed where they matter (not a permanent
   footer nobody reads), disclosure of AI-generated content, data-use and
   privacy controls, a traceable path from prompt to result.
6. **What is the AI here?** (identifiers) A consistent name, mark, colour and
   personality - restrained. Sparkle icons and violet gradients are the
   category default; choose deliberately.

## Conversation Mechanics

- **Input**: a multi-line field that grows; Enter sends and Shift+Enter breaks
  (or the reverse for long-form tools - decide and show a hint); attachments,
  paste and drag-drop; the send button becomes stop while generating; keep the
  draft on failure; on mobile keep the field above the keyboard and the last
  message visible.
- **Streaming**: echo the user's message instantly; show activity within
  about 100 ms and first content as early as possible; stream into a stable
  layout (no jumping scroll - stick to the bottom only while the user is at
  the bottom, and offer "jump to latest"); render Markdown, code and tables
  progressively without flicker; never animate every token.
- **Showing work**: a compact, collapsible activity line ("Searching 3
  sources…", "Running tests…") that expands to details; finished steps
  collapse. Show reasoning summaries when they help the user judge the answer.
- **Long runs**: a progress view with steps, elapsed time, what is happening
  now, and a way to leave and be notified. Results persist and are
  addressable.
- **Answers**: start with the answer; structure with headings and lists only
  when the content is structured; copy, retry, edit-and-resend, and feedback
  on each response; code blocks with language, copy and wrap controls;
  citations inline as numbered chips with a sources panel.
- **Errors and limits**: distinguish model refusal, tool failure, network
  failure, rate limit and context limit; say what happened and what the user
  can do; preserve the conversation.
- **History**: searchable, renameable threads; branching or editing earlier
  turns without losing the original; clear indication of which model and
  context produced a result.

## Approvals for Agent Actions

- Show **what** will happen in the user's terms (a diff, a preview, the
  recipients, the amount), not the raw tool call alone.
- Approve at the smallest useful unit; offer "approve similar actions this
  session" only for low-risk classes.
- Irreversible or outward-facing actions always ask. A timeout or an
  unavailable approver means **not approved**.
- After acting, report what was done with links to the results and an undo
  where one exists.

## Accessibility

Streamed text needs a polite live region that announces in chunks, not per
token; focus must not be stolen by new messages; stop and retry are keyboard
reachable; motion of typing indicators respects reduced motion; voice input
has visible state and a text alternative.

## Honesty Rules

- Label generated content where a reader could mistake it for human or
  authoritative content.
- Do not fake latency, typing or "thinking" for effect.
- Do not present confidence the system does not have; show uncertainty when it
  changes what the user should do.
- Placeholder conversations in mock-ups use realistic, domain-specific content
  including an imperfect answer and an error.
