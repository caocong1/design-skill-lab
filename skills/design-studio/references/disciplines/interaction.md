---
title: Interaction (effort, keyboard, input methods, component behaviour)
evidence: digest
sources: [nng-heuristics, klm-kieras, wai-aria-apg, ui-events-ime, wcag-22, carbon-notification-tooltip, rauno-interaction-details, emil-kowalski-animation, laws-of-ux]
reviewed: 2026-09-28
review_by: 2026-12-27
---

# Interaction

How a surface behaves in the hand: what the top jobs cost in effort, how it answers the keyboard, the
pointer, the finger and the input method, and what each component does between its drawn states.
"Convenient, fast, comfortable" (方便、快捷、舒心) is made checkable here. Every Operate surface uses
the whole file; a Read or Persuade surface uses sections 2, 4 and 6.

This file owns task cost, the keyboard model, shortcuts, input methods, the component behaviour table,
and the convenience and comfort defaults. Elsewhere:

- States, loading and response timings, the overlay contract, forms, navigation: [product-ui](product-ui.md).
- Whether and how things move (frequency gate, interruption, durations): [motion](motion.md).
- Target sizes, focus appearance, contrast: [accessibility](../fundamentals/accessibility.md). Platform
  modifiers, windows, context menus: [desktop](../platforms/desktop.md). Mobile keyboard and viewport: [web](../platforms/web.md).

## 1. Task cost: count it before you draw it

Interaction cost is every effort between intent and done: finding, deciding, recalling, pointing,
typing, waiting. Write each top job of the surface (from PRODUCT.md or the function map) as a
Keystroke-Level Model string and add it up.

| Op | Means | Time |
| --- | --- | --- |
| `M` | find, decide, recall, check before confirming | 1.2 s |
| `P` | point at a target (a tap counts as `P`) | 1.1 s |
| `BB` | click | 0.2 s |
| `K` | one key (Shift and Ctrl count as keys) | 0.28 s |
| `H` | hand between keyboard and mouse | 0.4 s |
| `W` | a wait the user cannot overlap | measured or budgeted |

An `M` goes where the user starts the job, chooses among options that are not obvious, recalls a
name or value, looks for something whose place is not yet learned, and checks an entry before
confirming. Pointing at something the user must first find costs `M P`.

Worked example, assigning a ticket in a queue (派单):

| Path | String | Estimate |
| --- | --- | --- |
| Today: open the row, find 指派 in the overflow menu, scroll the people list, confirm | `M P BB · P BB · M P BB · M P BB · M P BB` | 4 M + 5 P + 5 BB = 11.3 s |
| Pointer: the likely assignee is offered on the row itself | `M P BB` | 2.5 s |
| Keyboard: `J`/`K` to the row, `A`, two letters of the name, Enter | `M K K K K` (row already focused) | 2.3 s |

- Compare, never promise. The model predicts error-free expert time; use it to compare directions,
  before and after, pointer and keyboard paths. First use adds `M`s: write the novice path as well.
- Cut `M` before `P` and `K`. Most of the time is deciding and looking. Show recent, suggested and
  last-used values; put the next step where the eye already is; never make the user recall what the
  system knows (recognition over recall).
- Cut steps: bring frequent actions to the object ([product-ui](product-ui.md), model table), default
  the likely value, remember the last choice, batch repeated acts.
- Cut `P`: frequent targets large and near where the pointer or thumb already is; edges and corners
  are easy to hit; never make the most frequent target the smallest or farthest (Fitts).
- Cut `W`: optimistic updates and background work the user can leave (timings in [product-ui](product-ui.md)).
- Record the strings in the surface contract's Task cost block; the critic recomputes them from the
  shots.

## 2. Keyboard model

- Tab and Shift+Tab move between components; arrow keys move inside a composite (toolbar, tabs, radio
  group, list, grid, tree, menu), which has exactly one tab stop. Home and End jump; typing a letter
  jumps to the next item starting with it in lists and menus.
- Focus always has a home. After a delete it moves to the next item (the previous one when the last
  was deleted); after an overlay closes, to the control that opened it; after a create, to the new
  item. Never to the top of the page.
- Focus and selection look different. Selection follows focus only when the content it shows is
  instant; when it loads, Enter or Space confirms.
- Disabled items in menus, tabs, listboxes and toolbars stay focusable (`aria-disabled`) and say why;
  a disabled Previous on page 1 may leave the tab order.
- Enter runs the default action; Esc closes or cancels the innermost layer only, one layer per press.
- Every pointer-only act has a keyboard path: drag has "move to", hover content opens on focus, a
  context menu opens with the Menu key or Shift+F10.
- Draw it: a keyboard map per surface (key, scope, action) and focus-state shots in the capture round.

## 3. Shortcuts and accelerators

Accelerators speed up experts without costing novices: the visible path stays, and shortcuts, the
command palette, bulk actions, saved views and "repeat last" sit on top of it.

- Shortcuts go to frequent jobs from the function map. Everything a shortcut reaches is also reachable
  by normal navigation.
- Standard keys keep their meaning: copy, cut, paste, undo, redo, select all, save, find, print. Redo
  is Ctrl+Y on Windows and ⌘⇧Z on macOS. Show the platform's modifier ([desktop](../platforms/desktop.md)).
- Avoid keys others own: modifier + Tab, Enter, Space or Esc and Meta + one key (OS); Caps Lock, Insert,
  Scroll Lock and Control+Option combinations (screen readers); the browser's address bar, reload,
  find, bookmarks and history. Take one only when the job is frequent, the owner's function rare and
  still reachable. For Chinese users also leave the input-method toggles (Shift alone, Ctrl+Space,
  Ctrl+Shift) and the common chat-app screenshot keys alone (practice).
- Single-character shortcuts (`J`/`K`, `E`, `/`, `?`) never fire while focus is in a text field or
  during composition, and can be turned off or remapped, or work only when their component has focus
  (WCAG 2.1.4).
- Discoverable: in menus and tooltips after the label ("归档 E"), in command-palette results, on a `?`
  sheet, and exposed with `aria-keyshortcuts`. As few modifiers as possible; let power users remap.
- Command palette: recent commands first, each result shows its shortcut; Chinese labels also match
  by pinyin and pinyin initials (practice).

## 4. Text input and input methods (IME)

Chinese, Japanese and Korean text is composed: letters go into a candidate window and Enter or Space
commits them. Everything that reacts to keys or text must wait for the commit.

- Enter while composing commits the candidate. It never sends a message, submits a form, creates a
  tag or moves to the next field. This applies to every "Enter sends" composer
  ([ai-experience](ai-experience.md)).
- Search-as-you-type, filters, autocomplete, inline validation, character counts and "unsaved"
  markers react to committed text, never to the pinyin letters in between.
- The handoff names the guard: on `keydown`, ignore the event when `event.isComposing` or
  `event.keyCode === 229`. Safari 10.1-26.6 reports `isComposing` false on the committing Enter, so
  the second check stays for as long as those versions are in use.
- A character limit says how it counts (a Han character as one or two) and the counter shows it
  (practice).
- Headless capture cannot compose. Mark IME behaviour `needs confirmation` until someone types with a
  real input method (Microsoft Pinyin, Sogou, macOS Pinyin, iOS and Android keyboards).
- Paste, autofill, dictation and password managers are input too: accept them ([product-ui](product-ui.md), Forms).

## 5. Component behaviour

Name the ARIA Authoring Practices pattern ([system](../process/system.md)), then decide what the name
leaves open. The last column is what the design must state or draw.

| Component | Opens | Keys | Closes, focus goes | Decide and draw |
| --- | --- | --- | --- | --- |
| Menu, dropdown menu | click; Enter, Space or Down on the button | arrows, Home/End, type-ahead; Enter activates; Space toggles a check item | Esc or a choice > the button; Tab leaves and closes every level | check and radio items; disabled items with a reason; submenus stay open while the pointer travels diagonally towards them (practice) |
| Combobox, autocomplete | focus, typing or Down (say which) | Down/Up move; Enter accepts; Esc closes, a second Esc clears; focus stays in the input | accept > the field | list or list-with-inline completion; minimum characters; what an empty query shows (recent, suggested); the matched part highlighted; a no-results row with a next step; the IME rule |
| Page search | a visible field; `/` or ⌘/Ctrl+K (2.1.4 rule) | Enter opens full results; Esc clears, then leaves | query kept on Back | scope shown; query echoed in results; recent searches; results update when typing pauses, never on uncommitted IME text |
| Tooltip | hover or focus; the first after a short delay, neighbours at once | Esc closes | stays while the trigger or tip is hovered | only a control's name or brief non-essential context; essential text becomes visible helper text, links or buttons a toggletip; touch has no hover, so label the control |
| Toggletip, popover | click or Enter | Tab through its content | Esc or outside click > the trigger | light dismiss or explicit ([product-ui](product-ui.md), overlay contract) |
| Toast | after an action; polite live region; never takes focus | - | info and success after at least 5 s, paused while hovered or focused; one with an action or an error stays until closed | two lines at most; its action is a shortcut, never the only path; what it said can be found later; blocking errors go inline; stacked newest first |
| Inline edit | click the value; Enter or F2 on a focused cell | Enter commits a single line; Esc restores; Tab commits and moves on | the cell | saved and failed marks in place; what happens if someone else changed it |
| Selection and bulk | click or Space; Shift range; ⌘/Ctrl toggle | ⌘/Ctrl+A inside the list | Esc clears | the count and scope ([data-dense-ui](data-dense-ui.md)); whether selection survives paging and filters, said on screen |
| Reorder, move | drag; Space picks up, arrows move, Space drops, Esc cancels (practice) | - | the moved item | a "move to" alternative (WCAG 2.5.7); drop preview; edge autoscroll; undo |
| Tabs | click; arrows between tabs | Home/End | - | selection follows focus only when the panel is instant |
| Slider, stepper | drag, click on the track, arrows | Page Up/Down large steps, Home/End | - | a typed field beside it for exact values |
| File upload | click, drop or paste | - | - | limits stated before choosing; per-file progress, retry and remove |
| Copy button | click | - | - | the label changes to "已复制" in place for a moment, then back; no toast (practice) |

## 6. Convenience and comfort

- **Remember.** Last-used values, sort, filters, view, density and pane sizes, per user and per
  object; Back restores scroll, selection and query ([product-ui](product-ui.md), URL is state).
- **Default well.** Pre-select the most common safe value. Never pre-select consent, a paid option or
  a destructive choice.
- **Use what is known.** Locale, time zone, the active scope, the last project, a code in the
  clipboard offered (never pasted silently): each skips a step.
- **Keep things still.** Nothing moves under the pointer: new items that arrive while the user works
  collect behind an "N 条新内容" marker instead of pushing rows; buttons keep their place across states;
  loading reserves its space.
- **Forgive.** Undo over confirmation; drafts survive navigation, reloads and crashes; leaving a
  half-done task saves or asks ([product-ui](product-ui.md)).
- **Stay predictable.** One action has one name and one place on every surface; the same gesture
  means the same thing everywhere.
- **Instant for the frequent.** Menus, palettes and key-driven navigation open without animation
  ([motion](motion.md), frequency first).
- **Gestures.** The effect follows the finger from the first pixel and can be reversed mid-way; a
  reversible action may fire during the gesture, a destructive one only on release and with undo;
  every gesture has a visible control (WCAG 2.5.1, 2.5.7).

## 7. Deliverable

For each Operate surface, in the surface note or [handoff-spec](../../templates/handoff-spec.md):

- Task cost: each top job's string and estimate, before and after (or per direction), pointer and
  keyboard paths, and the novice path when first use matters.
- Keyboard map: keys, scope, action; shortcuts with platform modifiers, conflicts checked, the
  single-key rule.
- Component behaviour: per non-trivial component, its APG pattern and section 5's last column.
- An IME line for every text input that reacts to Enter or searches as the user types.
- Evidence: focus-state shots and a keyboard walk of the primary job. Timed behaviour (toasts,
  tooltips, typing pauses) and IME are `needs confirmation` unless recorded or tested by hand.

## Traps

- Counting clicks, not decisions: fewer clicks with more hunting is slower, because `M` dominates.
- A shortcut with no visible path; or a job done a hundred times a day with no shortcut.
- A standard key (⌘/Ctrl+S, F, P, Z) rebound to something else.
- "Enter sends" that sends pinyin; a search box that queries "zh", "zho", "zhon".
- An error that lives only in a timed toast; a tooltip that holds the instructions or a link.
- Focus dropped to the top of the page after a delete or a close.
- A single-letter shortcut firing while the user types in a field.
