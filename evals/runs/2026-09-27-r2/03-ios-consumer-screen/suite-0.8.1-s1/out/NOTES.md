# Dogear: notes and assumptions

## Design read
- Calm evening reading companion, not a store or a feed: warm paper background (#F4F1EA), white inset-grouped cards, one accent (bookcloth red #9A3324), book titles and quotations set in a serif (New York on device).
- The idea it keeps: the dog-ear. Every cover placeholder has its top corner folded, and the empty state's "slot for your first book" is a dashed page with a folded corner.
- Hierarchy on Today: 1) minutes left and streak, 2) Start Session / Log Pages, 3) week at a glance, 4) books, 5) highlight (below the fold).

## Assumptions (one line each)
- Tabs are Today, Library, Stats, plus Search as the separate trailing search-role tab (iOS 26 pattern), so no More tab.
- Book detail is pushed from Library, so Library is the selected tab and the tab bar stays visible.
- On book detail, More (ellipsis, top trailing) opens a system menu: Mark as Finished, Edit Goal, and Remove from Library (destructive, set apart). The menu is not drawn.
- "Start Session" on Today starts a session for the most recent book (Middlemarch); choosing another book happens in the session sheet (not drawn).
- The floating tab bar ends 34 pt above the screen bottom, so no control sits in the home-indicator inset (the brief requires this). The real system bar sits slightly lower.
- A streak counts days with at least one session; the week chart shows minutes, not streak days. The dashed line is the 20-minute goal, and today's bar is hatched because the day is still in progress.
- "125 min so far" was dropped from the chart header to avoid adding a derived number; the chart shows the given daily values only.
- The first-run screen is Today (same tab bar). Step one is the prominent Scan Barcode button; Search by Title and Import from a CSV File are the secondary and tertiary ways. The goal card shows the preset of 20 min with a stepper.
- Library and Stats would each explain themselves when empty; they are not hidden or disabled.
- Light appearance only, as briefed. A dark variant (evening reading, dimmed phone) is the obvious next step and was not drawn.
- Text is at the default Dynamic Type size (Large). The layout uses flex rows and wrapping text, so it can grow at larger sizes, but AX sizes were not rendered.

## What the system draws (approximated in the mockup)
- Status bar, Dynamic Island, home indicator: drawn as placeholders in position (9:41, signal, Wi-Fi, battery).
- Tab bar and the back and More buttons are Liquid Glass (regular). The HTML shows them as a translucent fill with backdrop blur, labelled `data-material="glass-regular"`. That is an approximation, not the material; no blur value belongs in a handoff.
- Bottom scroll edge effect (soft): content fades as it scrolls under the tab bar. Labelled `data-material="scroll-edge-soft"`.

## Type and fonts
- UI is SF Pro through `system-ui` (renders SF in Chrome on macOS). Sizes follow the iOS Dynamic Type Large table with Apple tracking.
- Serif: the app would use New York (system font). Chrome cannot select it by name, so the mockup renders Iowan Old Style (bundled with macOS), falling back to Georgia. No web fonts are loaded.

## Images and licences
- No external images. Covers, icons and the empty-state drawing are hand-made CSS/SVG in the files. Icons approximate SF Symbols: sun.max.fill, books.vertical.fill, chart.bar.fill, magnifyingglass, chevron.left, ellipsis, play.fill, plus, highlighter, barcode.viewfinder, square.and.arrow.down, flame. On device they are the real SF Symbols (Apple licence, system use).
- Quotations are from Middlemarch (public domain), as given in the brief.

## Contrast (computed with color_tools.py and lint.mjs on the render)
- Label #1D1B18 on paper 15.2:1. Secondary #6A655D on paper 5.1:1 and on card 5.8:1. Accent #9A3324 on card 7.3:1. White on accent 7.3:1. Accent on tinted button 6.0:1. Foil #E9D7A8 on the cover cloths 5.6 to 6.8:1.
- lint.mjs --platform ios: contrast, overflow, accessible names and 44 pt targets pass on all three screens.
- Glass fill over white or paper keeps label text above 15:1.
- Content faded under the scroll edge is decorative and is not meant to be read at rest.

## Not attempted
- Motion, haptics, the session timer sheet, the Log Pages sheet, the More menu, dark mode, AX type sizes, iPad.
- Radii vary by shape (capsule = height ÷ 2, cards 26 pt, covers 4 pt), so lint reports several distinct radius values.

## Source
- `src/` holds the shared CSS and partials. `node src/build.mjs` inlines them into self-contained `out/*.html`, and `node src/render.mjs` writes `out/png/*.png` (402×874 at 2x).

## Fresh critique (one round) and what changed
- Disposition was "fix". Applied: Highlights moved above Sessions on Book detail; week chart made compact with the goal line tied to the bar scale; "This Week" header moved out of the card like the other section headers; empty state reordered (drawing, headline, buttons); the repeated goal line of text dropped; the ring label raised to 13 pt.
- Left open: Today shows Middlemarch fully and Walden passing under the tab bar; The Pillow Book and the recent highlight are below the fold (the brief allows content to continue). lint reports one contrast and one clipped-text finding on Today and on Book, both on text faded under the scroll edge or below the viewport, not on text meant to be read at rest.
- Not shown: accessibility (AX) Dynamic Type sizes; the critic asked for them, and they were not rendered within the time box.
