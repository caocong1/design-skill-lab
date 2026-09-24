---
name: design-product-ui
description: Design product interfaces - screens, components, flows and all their states - for web apps, mobile apps (iOS, Android, HarmonyOS, mini-programs), desktop apps (Electron, Tauri, native), enterprise admin systems, dashboards and big-screen data walls, and AI product UI. Use when designing or redesigning an app screen, a component, a form, a table, navigation, an onboarding or checkout flow, empty / loading / error states, responsive or adaptive behaviour, or platform-appropriate UI. 页面设计、组件设计、后台管理、表单、表格、数据大屏、App 界面、小程序、桌面端。
metadata:
  version: 0.2.2
  short-description: Screens, components, flows and states
---

# Design Product UI

Product UI is used repeatedly by people trying to get something done. Clarity,
speed and predictability outrank expression. Personality lives in typography,
colour discipline, motion and microcopy - not in reinventing controls.

Shared fundamentals: `../design-studio/references/typography.md`,
`../design-studio/references/color.md`,
`../design-studio/references/layout-and-spacing.md`.
Drawing for a target (frame sizes, units, the portable subset):
`../design-studio/references/portable-mockups.md` and the mockup kit in
`assets/mockup-kit/kit.css` (demo: `assets/mockup-kit/demo.html`).
Load on demand: `references/platforms.md` (iOS, Android, HarmonyOS,
mini-programs, desktop, web app conventions), `references/data-dense-ui.md`
(forms, tables, admin, dashboards, big-screen), `references/ai-ux.md`
(chat, copilot and agent interfaces).

## Workflow

0. **Name the targets.** Platform and logical size for each (a phone app may
   also need a tablet or a desktop composition). The stack the product is
   built in is irrelevant to the drawing: a Flutter, ArkUI or mini-program
   screen is drawn in the same HTML/CSS, inside that platform's frame.
1. **Model before pixels.** List the objects the user cares about (order,
   device, case, document), their attributes, the actions on them and how they
   relate. Navigation and screens fall out of this model; skipping it produces
   screens that look fine and do not connect.
2. **Pick the archetype** for each screen: list-detail, table-centric CRUD,
   dashboard, feed, form or wizard, canvas / editor, settings, conversation.
   Use the platform's standard structure for that archetype before inventing.
3. **Choose navigation by platform and breadth** (`references/platforms.md`):
   three to five top-level destinations; depth through push / drill-in; tools
   and filters local to the screen; a command palette for power users on
   desktop web.
4. **Set hierarchy per screen**: one primary action, one focal region. Decide
   what the eye hits first, second, third; demote the rest with size, weight
   and colour before reaching for borders and boxes.
5. **Compose from the system.** Use the host's tokens and components. Missing
   pieces are added to the system (`../build-design-system/SKILL.md`), not
   styled ad hoc.
6. **Design every state** (matrix below) and the edge content.
7. **Make it adaptive**: define behaviour at each window class, not just
   "mobile and desktop". Reflow, collapse, re-prioritise; do not merely shrink.
8. **Write the words.** Labels, helper text, errors, empty states and
   confirmations are design. Use the product's real vocabulary.
9. **Render, look, critique** (`../design-studio/references/render-and-look.md`,
   `../critique-design/SKILL.md`).
10. **Hand off** with `../handoff-design/SKILL.md` when someone else builds.

## State Matrix

Every screen and component is designed across:

| Dimension | Cases |
| --- | --- |
| Data | first-use empty, no results, one item, typical, many (pagination / virtualisation), extreme values, stale |
| Async | loading (skeleton shaped like the result), refreshing, partial failure, error with recovery, offline, success |
| Interaction | default, hover, focus-visible, pressed, selected, dragging, disabled (with reason), read-only, busy |
| Validation | pristine, invalid (specific message + how to fix), valid, server-rejected |
| Permissions | not signed in, no access, read-only role, paywalled |
| Content | long strings, no image, mixed CJK / Latin, large numbers, long names, RTL if shipped, 200% text zoom |
| Environment | each window class, light / dark, reduced motion, high contrast, touch vs pointer vs keyboard |

Three different empty states are three different designs: **first use**
(explain the value, offer the first action), **no results** (say what was
searched, offer to broaden), **error** (say what failed, offer retry).

## Rules That Carry Most of the Weight

- **One primary action per view.** Secondary actions are visually quieter;
  destructive actions are separated and never the default focus.
- **Group by proximity first**, then alignment, then a shared background, then
  a border. The lightest separator that works wins. Space inside a group is
  smaller than space between groups.
- **Left-align for scanning.** Centre alignment is for short, isolated
  moments. Numbers right-align with tabular figures.
- **Feedback within 100 ms** for every input. Under a second needs no spinner;
  over a second shows a skeleton or progress; over ten seconds shows progress,
  lets the user leave, and notifies on completion.
- **Prefer undo to confirmation.** Reserve blocking dialogs for irreversible,
  high-cost actions, and name the consequence on the button ("Delete 3
  files"), not "OK".
- **Least modal first**: inline edit -> popover -> side drawer -> dialog ->
  full page. On phones, sheets replace popovers and drawers.
- **Forms**: one column; labels above fields; group and order by the user's
  mental sequence; validate on blur, re-validate on input once an error is
  shown; keep what the user typed; size fields to the expected answer; choose
  input types and autocomplete tokens deliberately; say why a button is
  disabled or keep it enabled and explain on submit.
- **Tables**: text left, numbers right, headers aligned with their column;
  sticky header; row height by density (compact 32-36, default 40-48,
  comfortable 52-56); dividers *or* zebra, not both; two to three inline
  actions then an overflow menu; bulk actions appear on selection; column
  priority defined for narrow widths.
- **Targets**: at least 44 x 44 pt on iOS, 48 x 48 dp on Android, 24 x 24 CSS
  px as the WCAG 2.2 floor on web with larger preferred; spacing counts toward
  the target.
- **Focus is visible and logical** everywhere a pointer can go; every pointer
  interaction has a keyboard path on web and desktop.
- **Colour never carries meaning alone.** Pair status colours with an icon,
  label or shape.
- **Icons need labels** unless universally understood in that platform
  context (close, search, back). A tooltip is not a label on touch.
- **Density is a feature.** Expert, repeated-use tools deserve compact layouts
  and keyboard shortcuts; occasional consumer tasks deserve air and guidance.
  Offer a density setting when both audiences exist.
- **Respect the platform.** Users bring habits from the OS: back behaviour,
  swipe gestures, system fonts, sheet behaviour, menu bars, context menus,
  the mini-program capsule. Deviate only with a reason the user benefits from.

## Microcopy

- Buttons say what happens: verb + object ("Create project", "保存修改").
- Errors say what happened, why if known, and what to do. Never blame, never
  show raw codes without a human sentence.
- Sentence case in English UI. In Chinese UI: full-width punctuation inside
  Chinese sentences, consistent terms (登录 not 登陆, 账号 vs 帐号 chosen once),
  one convention for spacing between CJK and Latin / digits across the
  product, native date and number formats (2026-09-20, 1.2 万, ¥1,280.00).
- Placeholder text is not a label and disappears when needed most.
- Numbers, dates and units are formatted for the locale and aligned.

## Adaptive Behaviour

Define window classes once (see `layout-and-spacing.md`) and specify for each:
navigation form (bar -> rail -> sidebar), column count, what collapses into a
menu, what becomes a sheet, table -> card-list transformation, touch vs
pointer target sizes. Desktop apps also define minimum window size, resize
behaviour of panes, and multi-window rules.

## Output

- `piece`: `.design/screens/<name>.html` - a self-contained mockup using the
  system tokens, drawn inside the target's frame from the mockup kit, written
  in the portable subset, with a state switcher (query string or toolbar) so
  every designed state can be rendered and screenshotted; plus the PNG shots
  per target, theme and state. When the same design serves several targets,
  put the frames side by side in one file: one design language, re-composed
  per target.
- Each screen ships with: purpose and primary action, the state matrix
  coverage, adaptive rules, content rules, accessibility notes, and open
  questions.

## Anti-Patterns

- A dashboard of equally weighted cards with no question being answered.
- A modal on a modal; a confirmation for every click.
- Disabled submit buttons with no explanation.
- Placeholder-only labels; icon-only navigation on unfamiliar products.
- Desktop tables squeezed onto phones instead of re-thought as lists.
- iOS patterns shipped on Android (or the reverse), web hover affordances on
  touch, custom back buttons fighting the system gesture.
- Treating a non-web target as out of reach, or drifting into the
  implementer's build and test tooling instead of finishing the design.
- A re-drawn native tab bar or navigation bar handed over as a custom
  component; the frame shows where system components go, the platform draws
  them.
- Skeletons that do not match the loaded layout; spinners for whole pages.
- Designing only the populated, error-free, English, light-mode screen.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Before the final message of the round, run that file's close-out
retro and end with its `Skill feedback:` line - the retro is part of done.
Log, don't fix: skills are edited only inside the lab.
