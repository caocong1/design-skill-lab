# W3C WAI-ARIA Authoring Practices Guide: keyboard interface, combobox and menu patterns
- id: wai-aria-apg · url: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ · fetched: 2026-09-28 · method: fetch
- review_by: 2027-09-28 (durable +365d) · licence note: paraphrased digest, not a mirror (W3C Document License)
> 中文导语：APG 是 W3C 给每种交互组件（组合框、菜单、列表框、标签页、网格、树……）写的"键盘怎么操作、焦点去哪儿"的标准做法。设计稿里一个下拉、一个菜单的行为，实现者多半会照它做；设计师不写清楚，就会得到各自发明的键盘行为。本摘要收三页：键盘接口总则、组合框、菜单与菜单栏。

Read on 2026-09-28 (static fetch; page copyright 2026, no per-page date): Practices > "Developing a Keyboard Interface"
(`/practices/keyboard-interface/`), Patterns > Combobox (`/patterns/combobox/`), Patterns > Menu and Menubar (`/patterns/menubar/`). The other
pattern pages (listbox, grid, tabs, tree, toolbar, dialog) were not read for this digest; the catalogue row `aria-apg` links them.

## Key facts
1. **Tab between, arrows within** (#kbd_generalnav): Tab and Shift+Tab move between components; arrow keys move inside a composite widget
   (radio group, menu, listbox, grid, tabs, toolbar, tree). A composite has **one** tab stop.
2. **Two focus techniques** (#kbd_general_within): roving tabindex (the active item `tabindex=0`, the rest `-1`, the browser scrolls it into
   view) or `aria-activedescendant` (focus stays on the container; the author draws the focus indicator and handles scrolling).
3. **Focus is always visible and never lost** (#kbd_focus_discernable_predictable): `document.activeElement` is never null or `body`; no
   initial focus on page load except on single-purpose pages. After deleting an item or closing a dialog, focus moves to a logical place (the
   next item, the invoking button), not the top of the page.
4. **Focus is not selection** (#kbd_focus_vs_selection): the selected state must look different from the focus indicator; in multi-select
   widgets different keys move focus and change selection. **Selection follows focus** only when showing the new content is instant; when it
   needs a network request, the user confirms with Enter or Space (#kbd_selection_follows_focus).
5. **Disabled items** (#kbd_disabled_controls): remove from the tab sequence when their presence is obvious (Previous on page 1); keep focusable
   with `aria-disabled` when they must stay discoverable: menu items, listbox options, tabs, toolbar buttons such as Cut, Copy, Paste.
6. **Shortcuts augment, never replace** (#kbd_shortcuts): every target of a shortcut is also reachable by normal keyboard navigation. Three
   kinds: navigation only (focus moves), activation only (acts on the current context), navigation plus activation. Many shortcuts add
   cognitive load; a well-designed interface rarely needs a large scheme.
7. **Keys to avoid** (#kbd_shortcuts): OS level - modifier + Tab, Enter, Space or Escape; Meta + a single key; Alt + function keys. Assistive
   technology - Caps Lock, Insert or Scroll Lock combinations; macOS Control + Option combinations. Browser - address bar, reload, find,
   bookmarks, history. A deliberate conflict is acceptable only when the app function is frequent, the browser function rare, and the browser
   function stays reachable another way.
8. **Standard shortcuts** (same section): copy, paste, cut, undo with Ctrl (Windows, Linux) or Command (macOS) + C, V, X, Z; redo Ctrl+Y or
   Command+Shift+Z; context menu Shift+F10. `aria-keyshortcuts` exposes a shortcut to assistive technology.
9. **Combobox keyboard** (#keyboard_interaction): Down Arrow moves into the popup (or opens it); Up Arrow optionally to the last item; Enter
   accepts and closes; Escape closes, and optionally clears the field; Alt+Down opens without moving focus, Alt+Up closes and returns;
   printable characters type into an editable combobox. DOM focus stays on the input and `aria-activedescendant` points at the active option
   (dialog popups excepted).
10. **Autocomplete types** (combobox): none (fixed suggestions), list (filtered suggestions, the user picks), both (filtered list plus inline
   completion of the highlighted item), inline. Whether the popup opens on focus, on Down Arrow or after a character threshold is an
   implementation choice the design must state.
11. **Menu and menubar keyboard** (#keyboard_interaction): opening a menu focuses its first item; Down and Up move (optionally wrapping); Right
   opens a submenu, Left closes it and returns to the parent; Enter activates and closes, or opens a submenu; Space optionally toggles a
   checkbox item without closing; Home and End jump; a printable character moves to the next item starting with it (type-ahead); Escape
   closes and returns focus to the invoking button; Tab leaves the menu and closes all submenus.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: owns the keyboard model (facts 1-5), the shortcut rules and the key-conflict
  list (facts 6-8), and names the APG pattern per component in the behaviour table (facts 9-11).
- skills/design-studio/references/process/system.md already says to name the APG pattern for a component; interaction.md says what the design
  must add to that name: autocomplete type, popup trigger, selection-follows-focus, focus after delete.
- skills/critique-design/references/heuristics.md: focus after delete and selection vs focus are checkable from focus-state shots.

## Not verified / open
- The APG pages carry no revision date; content was read as served on 2026-09-28. The APG is a note, not a standard: it is the reference
  behaviour, not a conformance requirement.
- Listbox, grid, tabs, tree, toolbar and dialog patterns were not re-read; the catalogue row carries the link.
- Combobox rows marked optional in the APG (Up Arrow, Alt+arrows, Home/End) are listed as such; which to require is the design's decision.
