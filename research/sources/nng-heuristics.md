# Nielsen Norman Group: 10 usability heuristics, response-time limits, interaction cost, command names and shortcuts
- id: nng-heuristics · url: https://www.nngroup.com/articles/ten-usability-heuristics/ · fetched: 2026-09-28 · method: fetch
- review_by: 2027-09-28 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：NN/g 的四篇基础文章：Nielsen 十条可用性启发式、三个响应时间界限（0.1 / 1 / 10 s）、"交互成本"的定义，以及命令命名与快捷键指南。它们是"方便、快捷、高效"这类要求的一手出处：把"用着顺手"拆成可以数、可以比的东西（反馈多快、步骤多少、要记住什么）。backlog §4 第 2 项登记的就是这份。

Read on 2026-09-28 (static fetch, article text only; linked sub-articles not read):
`/articles/ten-usability-heuristics/` (Jakob Nielsen, 1994-04-24, last reviewed 2024-01-30);
`/articles/response-times-3-important-limits/` (Nielsen, 1993, updated 2014);
`/articles/interaction-cost-definition/` (Raluca Budiu, 2013-08-31, last reviewed 2024-10-14);
`/articles/ui-copy/` (Anna Kaley, 2019-03-03, "UI Copy: UX Guidelines for Command Names and Keyboard Shortcuts").

## Key facts
1. **The ten heuristics** (#1-#10 on the page): visibility of system status; match between system and real world; user control and freedom;
   consistency and standards; error prevention; recognition rather than recall; flexibility and efficiency of use; aesthetic and minimalist
   design; help users recognise, diagnose and recover from errors; help and documentation.
2. **Status** (#1): feedback as quickly as possible, ideally immediately. **Control** (#3): clearly marked exits; support undo and redo.
3. **Error prevention** (#5): prevent high-cost errors first; helpful constraints and good defaults; prefer prevention to messages.
4. **Recognition over recall** (#6): make options, actions and needed information visible or easily retrievable; help in context rather than
   instructions to memorise.
5. **Flexibility and efficiency** (#7): accelerators (keyboard shortcuts, touch gestures) hidden from novices speed up experts, so one design
   serves both; allow personalisation and customisation.
6. **Response-time limits** (response-times article): **0.1 s** feels instantaneous, no special feedback needed beyond showing the result;
   **1.0 s** keeps the flow of thought uninterrupted, the user notices the delay but keeps going; **10 s** is the limit for keeping attention on
   the dialogue. Past 10 s give percent-done feedback and a way to interrupt; for 2-10 s a less conspicuous busy indication is enough.
7. **Interaction cost** (definition article): "the sum of efforts — mental and physical — that users must deploy" to reach a goal: reading,
   scanning, remembering across pages, switching attention, scrolling, clicking or tapping, typing, finding elements, waiting for loads. The
   article frames it as a way to compare design alternatives.
8. **Command names** (ui-copy): 2-4 words; lead with a verb; label the state the command leads to ("Pause" while playing); adjectives for
   appearance commands ("Bold"); the same label for the same command everywhere, disambiguated with a noun ("Delete Folder"); no generic "OK";
   an ellipsis when more input follows; tooltips for icon-only commands; branded terms only in main menus and help.
9. **Keyboard shortcuts** (ui-copy): only for frequent tasks; never override established shortcuts (Ctrl+S and the like); make them
   discoverable in tooltips, menus, help and a printable reference; equivalents on Mac and Windows; let users redefine them; a learnable,
   consistent scheme with meaningful key associations; as few modifiers as possible.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: owns the task-cost method (fact 7, measured with klm-kieras), the shortcut rules
  (fact 9 with wai-aria-apg), accelerators that do not cost novices (fact 5), defaults and recognition (facts 3-4).
- skills/design-studio/references/disciplines/product-ui.md: the loading paragraph states the 0.1 / 1 / 10 s tiers (fact 6) next to the
  existing 150-300 ms show-delay and Doherty 400 ms.
- skills/critique-design/references/heuristics.md: section 2 counts interaction cost per top job, not only steps; section 8 checks
  accelerators and their discoverability.

## Not verified / open
- The response-time article is a 1993 text updated in 2014; the thresholds come from Miller (1968) and Card et al. (1991), which were not
  read. They are perception limits, not performance targets for a given back end.
- The ui-copy article's shortcut list is advice, not measured; "let users redefine shortcuts" is a requirement only for single-character
  shortcuts (WCAG 2.1.4, see wcag-22 #32).
- NN/g's longer reports (e.g. on keyboard shortcuts in web apps) sit behind a paywall and were not read.
