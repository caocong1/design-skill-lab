# W3C WAI-ARIA Authoring Practices Guide: keyboard interface, combobox, menu, listbox, grid, tabs and tree view patterns
- id: wai-aria-apg · url: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (W3C Document License)
> 中文导语：APG 是 W3C 给每种交互组件（组合框、菜单、列表框、标签页、网格、树……）写的"键盘怎么操作、焦点去哪儿"的标准做法。设计稿里一个下拉、一个菜单的行为，实现者多半会照它做；设计师不写清楚，就会得到各自发明的键盘行为。本摘要收七页：键盘接口总则、组合框、菜单与菜单栏（2026-09-28 读），以及列表框、网格、标签页、树视图（2026-11-01 补读，补上 interaction.md 组件表里此前没有一手依据的几行）。

Read on 2026-09-28 (static fetch; page copyright 2026, no per-page date): Practices > "Developing a Keyboard Interface"
(`/practices/keyboard-interface/`), Patterns > Combobox (`/patterns/combobox/`), Patterns > Menu and Menubar (`/patterns/menubar/`). The other
pattern pages (listbox, grid, tabs, tree, toolbar, dialog) were not read for this digest; the catalogue row `aria-apg` links them.

Re-read on 2026-11-01: repo `w3c/aria-practices` at `0f765e4` (2026-09-30, the only commit since the first read: an `ariaNotify` progressive enhancement in the Quantity Spin Button example; last release still `apg-1.2r1`, 2021-11-16); the patterns index (30 patterns, no new/updated/deprecated markers); the Listbox, Grid, Tabs and Tree View pattern pages (facts 12–22). ARIA 1.3 is a Working Draft of 4 June 2026. The keyboard-interface, combobox and menubar pages are untouched in the repo since the first read.

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

Listbox, grid, tabs, tree view (read 2026-11-01)
12. **Listbox focus on entry** (`/patterns/listbox/`): single-select → the first option, or the selected one; multi-select → the first selected option, selection unchanged.
13. **Listbox thresholds**: Home/End optional but "strongly recommended for lists with more than five options"; type-ahead recommended, especially above seven options. (Tree View uses the same seven-root-node threshold for type-ahead.)
14. **Multi-select models**: recommended model needs no modifier: Space toggles; optional Shift+Up/Down (move and toggle), Shift+Space (contiguous range), Ctrl+Shift+Home/End, Ctrl+A. Alternative model: unmodified movement unselects the others; Ctrl+Up/Down moves without changing selection; Ctrl+Space toggles.
15. **Selection semantics**: `aria-selected` or `aria-checked`, never both; recommended `aria-selected` for single-select and `aria-checked` for multi-select, consistent site-wide; dynamic lists set `aria-setsize` / `aria-posinset`; selection-follows-focus "can help some users and severely hinder others"; separate "Select All" / "Unselect All" buttons advised.
16. **Grid navigation** (`/patterns/grid/`): arrows move one cell and stop at the edge ("If focus is on the right-most cell in the row, focus does not move"); Page Up/Down by an author-defined row count; Home/End = row ends; Ctrl+Home/End = grid corners; a grid is one tab stop; wrapping "would be disorienting" in a data grid, optional in layout grids.
17. **Grid editing**: Enter or F2 disables grid navigation and enters the cell; F2 again (or Enter for single-line fields) restores it; Escape restores navigation and may undo; Tab/Shift+Tab then move between widgets inside the cell.
18. **Grid selection**: Ctrl+Space column, Shift+Space row, Ctrl+A all, Shift+Arrow extends by one cell.
19. **Tabs** (`/patterns/tabs/`): Tab lands on the active tab, the next Tab goes to the panel unless its first meaningful content is focusable; Left/Right wrap; Up/Down only with `aria-orientation="vertical"`; Space/Enter activate under manual activation; Home/End optional; Shift+F10 for a popup menu; Delete optional for closable tabs (focus moves to the following tab, else the preceding).
20. **Tab activation**: automatic activation only when panels show "without noticeable delay" (preloaded content); otherwise manual activation.
21. **Tree View** (`/patterns/treeview/`): Right on a closed node opens it without moving focus, on an open node moves to the first child; Left closes an open node, else moves to the parent; Up/Down never open or close; Enter = default action; "*" optionally expands all siblings; multi-select models mirror Listbox; `aria-expanded` only on parents; dynamic trees need `aria-level`, `aria-setsize`, `aria-posinset`.
22. Horizontal variants swap Up/Down with Left/Right (`aria-orientation="horizontal"`); none of these pages says anything about RTL mirroring.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md §5: the listbox, grid, tabs and tree rows get their APG keys plus the decisions the pattern leaves open: type-ahead and Home/End above five to seven items, selection-follows-focus or not, automatic vs manual tab activation (manual when a panel loads), grid cell editing with Enter/F2/Escape and whether Escape undoes (facts 12–22).
- skills/design-studio/references/disciplines/interaction.md: owns the keyboard model (facts 1-5), the shortcut rules and the key-conflict
  list (facts 6-8), and names the APG pattern per component in the behaviour table (facts 9-11).
- skills/design-studio/references/process/system.md already says to name the APG pattern for a component; interaction.md says what the design
  must add to that name: autocomplete type, popup trigger, selection-follows-focus, focus after delete.
- skills/critique-design/references/heuristics.md: focus after delete and selection vs focus are checkable from focus-state shots.

## Not verified / open
- The APG pages carry no revision date; content was read as served on 2026-09-28. The APG is a note, not a standard: it is the reference
  behaviour, not a conformance requirement.
- Toolbar and dialog patterns remain unread; listbox, grid, tabs and tree view were read on 2026-11-01 (facts 12–22).
- Correction vs the previous version (2026-11-01): facts 1–11 unchanged; 12–22 added; the title now names the seven pages.
- Combobox rows marked optional in the APG (Up Arrow, Alt+arrows, Home/End) are listed as such; which to require is the design's decision.
