---
title: Heuristics (one ordered checklist)
evidence: practice
sources: [wcag-22, vercel-web-interface-guidelines, impeccable, hobday-visual-design-rules, laws-of-ux, clreq-chinese-text-layout, chinese-copywriting-guidelines, ooux-orca, change-aversion, shape-of-ai, ai-labelling-law, nng-heuristics, klm-kieras, wai-aria-apg, ui-events-ime, carbon-notification-tooltip]
reviewed: 2026-09-28
review_by: 2027-09-27
---

# Heuristics

One ordered checklist, used for the author's self-check, for Track A of a critique, and to justify
rubric scores. Work top-down. Upstream failures make downstream polish irrelevant: when section 2
fails, report it and keep the detail notes short.

How to read an item: `[F3]` means a floor item in the [rubric](rubric.md) settles it mechanically;
`> Fit` names the ceiling dimension it informs. **★ marks the quick self-check**: at quick effort,
run the floor plus the ★ items. A law name (Fitts, Hick, Jakob) goes in a finding as a one-clause
reason, never as decoration. Floor items pass or fail; every other item is a default the brief can
overrule, and a finding that accepts such an exception names the line of the brief that earns it.

Sections: 0 Evidence · 1 Purpose · 2 Structure · 3 Hierarchy and layout · 4 Typography ·
5 Colour · 6 Components · 7 States · 8 Interaction and motion · 9 Content · 10 Accessibility ·
11 Platform fit · 12 Browser surfaces · 13 Identity · 14 Rationale against render · 15 Performance

## 0. Evidence

- ★ Every shot opened; each shows what its name claims (route, state, theme, size, build stamp),
  fully loaded, the intended fonts rendered. `[F1]` If not, stop: `recapture`.
- The declared sizes x themes x states are all present, with sizes taken from the brief's targets,
  not only 390 and 1280.
- Motion, hover, focus and keyboard behaviour cannot be judged from a still. Without a recording,
  a filmstrip or a focus-state shot, mark those findings `needs confirmation`.

## 1. Purpose and fit `> Fit`

- ★ Five-second test on the entry view: what is this, for whom, and what do I do next?
- ★ For each "X, not Y" attribute in the brief, point to the pixels that carry it. An attribute
  you cannot point to is a finding.
- The scene decides density, type size and light or dark: arm's length or desk, glare, session
  length. A design that suits a different scene is wrong even when it is pretty.
- The visitor mode matches the surface: Operate optimises the task, Persuade argues, Read reads,
  Experience immerses. A dashboard styled as a pitch, or a pitch that behaves like a form, is a
  finding.

## 2. Structure and flow `> Fit, Hierarchy`

- Cost the primary task from the shots: write it as a keystroke-level string (decisions `M`, points
  `P`, clicks, keys, waits; [interaction](../../design-studio/references/disciplines/interaction.md)
  section 1) and compare it with the contract's Task cost block. Look for dead ends, redundant steps,
  missing back paths, confirmations nobody needs, re-asked data, and hunting: a target the user must
  search for costs a decision each time.
- Container fits the job: a modal only when the task needs interruption or protected focus;
  otherwise a sheet, panel, inline edit or page.
- Navigation follows frequency (the function map): the most frequent job is at most one step from
  entry; rare jobs do not hold prime positions. First and last positions are remembered best.
- Presentation fits the data: comparing needs a table, triage a status list, planning a board or
  timeline, place a map, trend a chart.
- Redesigns: each structural change names the job it makes cheaper and the learned behaviour it
  spends; nothing on the never-change-silently list moved without a migration. Both rules are in
  [redesign](../../design-studio/references/process/redesign.md) (change cost).

## 3. Hierarchy and layout `> Hierarchy, Craft`

- ★ Squint test (blur the shot, or view it at 25%): what are the first three things seen, and are
  they the right three? One primary action per view.
- Grouping by proximity first, containers second. Cards inside cards are a finding.
- Everything aligns with something. Count the alignment lines; fewer is calmer.
- Spacing comes from one scale; outer padding is at least the inner padding; more space above a
  heading than below it; spacing measured between edges of visible contrast, not bounding boxes.
- At a decision point, more than four equally weighted options needs a reason (Hick; working memory
  holds about four to seven chunks).
- The narrow layout is re-composed in priority order, not shrunk. `[F3]`

## 4. Typography `> Typography`

- ★ The intended face rendered in every shot; at most two families unless the brief earns more.
- Roles are distinct (no near-duplicate sizes side by side); measure, leading, tracking and the
  smallest size sit inside the ranges in [typography](../../design-studio/references/fundamentals/typography.md).
  Measure them in the shot; do not eyeball.
- Headings balanced, no one-word last lines; numbers that are compared use tabular numerals and
  align right.
- Text is sized by what it tells the user, not by where it sits: a status the primary task depends
  on is never caption-sized because its region is secondary.
- CJK: glyph forms match the language, line-start and line-end rules hold (no 。，at a line start),
  Han-Latin spacing is consistent, single-weight faces are not synthesised bold. Rules:
  [cjk-typography](../../design-studio/references/fundamentals/cjk-typography.md).

## 5. Colour and contrast `> Accessibility, Identity, Craft`

- ★ Contrast computed for every text and UI pair in every theme, smallest and lightest text first.
  `[F2]`
- Roles are clear: the accent marks action and selection, not decoration; one accent spent in few
  places.
- Colour is never the only signal: status pairs colour with an icon, text or shape (WCAG 1.4.1).
- Charts and status sets checked under colour-vision deficiency (`color_tools.py cvd`).
- Neutrals, dark-mode remapping, palette lightness steps and container-to-background brightness
  follow [color](../../design-studio/references/fundamentals/color.md). Pure `#000` on `#fff`, grey
  text on a coloured surface, and an inverted (not remapped) dark mode are the usual findings.

## 6. Components and consistency `> Craft`

- One logic per property: radius, border, shadow, icon family, button style per purpose. Count the
  distinct values (`lint.mjs`); several values for one purpose is a systemic finding.
- One depth technique and one light direction; nested radii concentric; button padding and icon
  plus label alignment per [layout-and-spacing](../../design-studio/references/fundamentals/layout-and-spacing.md).
  Check them in 2x crops.
- Variants that should be one component; values that drift from DESIGN.md or the tokens.
- Across screens, controls with one role (primary button, select, search field, row action) share
  height, radius, type size and density: put one crop per screen side by side. In a row of controls
  heights and baselines match; in a list the action column keeps its place on every row, whatever
  the title length, at the narrowest target too. A control is as heavy as its role: touch minimums
  are met by the hit area, not by a bigger drawing.
- Where the target has a system component (tab bar, sheet, picker, switch), it is used, not
  redrawn.
- Diagrams, timelines and maps: compare each mark with its line and its label, not only the whole
  picture; known traps are in the [casebook](../../design-studio/references/casebook.md).
- Typographic quotes and apostrophes (“ ” ‘ ’; 「」 in Chinese) in every heading and paragraph, never
  typewriter `"` or `'`; `lint.mjs` warns on them (`straight-quotes`).
- Inline code renders as code: monospace, one unbroken token (no wrap mid-token, no raw backticks),
  code blocks not cut off; `lint.mjs` warns on wrapped and clipped code (`label-wrap`, `clipped-text`).

## 7. States and robustness `> Fit, Craft`

- ★ Every state the contract lists is drawn and captured. `[F6]` Walk the state matrix in
  [product-ui](../../design-studio/references/disciplines/product-ui.md).
- The minimum on almost every product surface: the three empty states (first use, no results,
  error), loading, long and mixed-script content, disabled with a reason, focus. Missing ones are
  `[F6]` failures, not polish.
- Stress: 0, 1 and 1,000 items; every status mixed in one view, then all done; the longest name;
  large numbers; 200% text; no image. A set that shows only the tidy default proves nothing.

## 8. Interaction and motion `> Accessibility, Craft`

- Every input gets visible feedback at once, and a result or progress within about 400 ms
  (Doherty). Spinners never flash (timing in product-ui).
- Undo instead of confirm for reversible actions; destructive actions confirm or offer an undo
  window.
- Hover and focus popups can be dismissed with Esc, hovered without closing, and persist (WCAG
  1.4.13). Nothing is reachable only by hover on touch targets.
- Every drag has a single-pointer alternative (WCAG 2.5.7).
- Keyboard: Tab between components, arrows within; after a delete or a close, focus lands on the next
  item or the opener, never the page top; selection looks different from focus. A job done many times
  a day has a shortcut shown in menus and tooltips; no standard key is rebound; single-letter
  shortcuts never fire inside a field (WCAG 2.1.4).
- Text inputs that act on Enter or search as the user types state the input-method rule (Enter commits
  the candidate, never sends); without a test by hand with a real IME, `needs confirmation`.
- No error lives only in a timed toast; a toast with an action stays until closed; a tooltip holds a
  name or brief context, never instructions or links. Nothing moves under the pointer: arriving
  content does not push the row being acted on.
- Motion has a job (cause and effect, orientation, continuity), is quick, can be interrupted and
  has a reduced-motion variant. Nothing flashes more than 3 times per second; autoplay longer than
  5 s beside content can be paused.
- No decorative motion on actions repeated all day.
- AI output and agent runs: stop or pause mid-stream, edit, undo and retry sit next to the result;
  an agent's plan matches what it then does; irreversible actions (send, pay, delete) wait for
  approval; progress text names the step ("Checking 3 invoices"), not "Thinking…". Patterns:
  [ai-experience](../../design-studio/references/disciplines/ai-experience.md).

## 9. Content and copy `> Fit`

- ★ No placeholder text, fabricated proof or unmarked gap. `[F7]`
- Headlines say something specific; buttons name the result ("Save API key", "保存密钥", not
  "Continue", "确定"); items that open a follow-up end with an ellipsis ("Rename…").
- Errors name the problem and the recovery, next to the field. Empty states say what is missing and
  offer the next action.
- One term per concept, in the product's own vocabulary; dates, numbers and units in locale format.
- Chinese copy: full-width punctuation, no repeated marks (！！), proper nouns in their correct case
  (GitHub, not github), spacing per cjk-typography.
- AI-generated content and AI features carry the labels the law requires; see
  [ai-experience](../../design-studio/references/disciplines/ai-experience.md).

## 10. Accessibility `> Accessibility`

- ★ Keyboard: every action reachable in a logical order; focus visible `[F5]` and never hidden under
  sticky headers, floating tab bars or cookie banners (WCAG 2.4.11).
- Names and roles: icon-only controls named, inputs labelled, images given alt text or marked
  decorative, headings and landmarks in order.
- Targets meet `[F4]`; two undersized neighbours have centres at least 24 px apart.
- Reflow at 320 CSS px; 200% text resize; the WCAG 1.4.12 text-spacing overrides do not clip text.
- Forms do not ask again for what the user already entered (3.3.7); sign-in allows paste and
  password managers (3.3.8).
- Glass and translucent surfaces stay legible with reduced transparency or increased contrast;
  forced-colours mode keeps states visible.
- Report which checks were automated, which manual and which not done. Legal references per market
  are in [accessibility](../../design-studio/references/fundamentals/accessibility.md).

## 11. Platform and responsive fit `> Fit, Hierarchy`

- Re-composed per window class, not scaled: the most important thing is still first at the
  narrowest size.
- The target's conventions hold: back behaviour, safe areas, the mini-program capsule keep-out
  zone, floating bars that cover neither content nor focus, system type where native feel is asked.
- Each target is judged in its own frame: an iOS shot is not the reference for Android or HarmonyOS.
- Touch, pointer and keyboard each work; no hover-only affordance on touch.
- Posture and per-target rules: [platforms](../../design-studio/references/platforms/README.md).

## 12. Browser surfaces and details `> Craft`

Web targets. The parts nobody drew still ship, with browser defaults that belong to no design
system. Themed browser surfaces are the cheapest sign that a page was built, not assembled.

- Text selection (`::selection`) uses palette colours and stays legible.
- The caret (`caret-color`) is visible on every input background.
- Scrollbars are themed (`scrollbar-color`, `scrollbar-width`), none appear by accident (check with
  "always show scroll bars"), and no bar covers the last row of content.
- Focus rings are designed (colour, offset, radius that follows the element), consistent, and not
  clipped by an `overflow` ancestor.
- Links set `text-underline-offset` and thickness; underlines clear descenders and CJK glyphs.
- Tables, prices, timers and counters use `font-variant-numeric: tabular-nums`.
- `color-scheme` matches the theme, so native controls and scrollbars follow dark mode; a native
  `<select>` sets both background and text colour; `accent-color` themes checkboxes, radios and
  progress; `theme-color` matches the page background.

## 13. Identity `> Identity`

- ★ The subject test on palette, type, layout, hero, icons and motion: would this choice have
  appeared whatever the product was? See
  [anti-slop](../../design-studio/references/fundamentals/anti-slop.md).
- The contract's "One memorable idea" (Own-world), visible in the first viewport and carried into
  states and components.
- Every remaining default is justified by the brief. Novelty that costs usability is a finding too.
- Decoration encodes something or goes: for each eyebrow, ordinal, rule, frame and shadow, name
  what it tells the user. On a surface people come to for its content, ornament that outweighs the
  content is a finding (the strip test in anti-slop).
- Thumbnail test: at thumbnail size, is it distinguishable from the category's usual page?

## 14. Rationale against render `> Fit, Identity`

- ★ Each contract block and each claim in the critic brief is `kept`, `partial` or `missing`, with
  the shot that shows it. Procedure in [SKILL.md](../SKILL.md).

## 15. Performance as experience

- Nothing shifts after load: images and embeds reserve their size; fonts swap without reflowing the
  first viewport.
- No heavy media above the fold without a reason; no jank during scroll or interaction (a trace, or
  `needs confirmation`).
