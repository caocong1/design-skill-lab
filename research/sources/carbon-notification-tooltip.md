# IBM Carbon: notification and tooltip usage guidance
- id: carbon-notification-tooltip · url: https://carbondesignsystem.com/components/notification/usage/ · fetched: 2026-09-28 · method: repo@d8783ad2ae3b5e59c58f58311491f8a2c4e62631
- review_by: 2026-12-27 (perishable +90d) · licence note: paraphrased digest, not a mirror (carbon-website is Apache-2.0)
> 中文导语：IBM Carbon 设计系统对"通知（toast、行内、可操作、callout）"和"tooltip / toggletip"写得最具体的一份公开规范：toast 什么时候自动消失、带操作的通知为什么不能自动消失、tooltip 里为什么不能放按钮。网站页面太大抓不全，读的是 carbon-website 仓库里的源文件。

Read on 2026-09-28 at `carbon-design-system/carbon-website@d8783ad`: `src/pages/components/notification/usage.mdx` (last changed
2025-06-30) and `src/pages/components/tooltip/usage.mdx` (last changed 2025-02-11), prose only (images and live demos skipped).

## Key facts
1. **Four notification variants** (notification § Variants): inline (in the task flow, top of the content area or above a form's submit
   row), toast (non-modal, time-based, top right, stacked newest first), actionable (inline or toast with one action), callout (loads with
   the page, contextual, not dismissible).
2. **Inline dismissal** (§ Inline > Dismissal): never auto-dismisses; stays until the user closes it or resolves the cause.
3. **Toast dismissal** (§ Toast > Dismissal): persists by default and may be set to dismiss after **five seconds**; always easy to close;
   because it can vanish, what it said must be reachable elsewhere later (a notification centre or the object itself).
4. **Actionable notifications** (§ Actionable): exactly one action; they persist until dismissed (a toast with an action never times
   out); the action's destination needs another route, since the toast can be closed; they take focus and so interrupt screen-reader and
   keyboard users, which is their cost.
5. **Length** (§ Content): toast and inline text at most two lines; longer messages become an actionable notification with a short text and
   a "View details" style action. Error messages must include the user action that resolves them.
6. **Tooltip scope** (tooltip § When to use / When not to use): names of icon-only controls and brief, non-essential context; never
   information needed to complete the task (use visible helper text); never interactive content (buttons, links, images): use a toggletip,
   opened by click or Enter, following the disclosure pattern.
7. **Tooltip behaviour** (tooltip § Behaviors): opens on hover or keyboard focus; stays while the pointer is over the trigger or the
   container; Esc dismisses; disappears when focus leaves. Placement auto-flips to stay in view and must not cover content the task needs.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: the toast, inline notification and tooltip rows of the component behaviour
  table (facts 2-7).
- skills/critique-design/references/heuristics.md: section 8 checks that no error lives only in a timed toast and no tooltip holds
  essential or interactive content.

## Not verified / open
- Carbon's live React components may differ from the usage prose (for example the default toast timeout); only the prose was read.
- No tooltip show-delay is given by Carbon or by NN/g's tooltip guidelines (2019, read as a check the same day); the delay rule in
  interaction.md comes from emil-kowalski-animation #2.
