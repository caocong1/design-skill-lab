# Dogear: notes and assumptions

One line each. The HTML files are the source of truth; `dogear.css` holds the shared tokens and frame.

## Design read
- Branded-native iOS 26 posture: system structure (large titles, floating Liquid Glass tab bar, glass toolbar buttons, inset grouped cards), with the brand carried by one tint, New York serif for book titles and quotations, and cloth-bound cover placeholders.
- One memorable element: the dog-ear fold on every cover (the app's name, and where you stopped reading). Everything else stays quiet.
- Tint "bookcloth green" #1D6B5A was chosen over the usual blue so the app reads as its own thing without fighting system chrome. It stays dark enough for dimmed evening reading.

## Structure decisions
- Tab bar: Today, Library, Stats in the glass capsule. Search is the separate circular button on the right, the iOS 26 search-tab placement.
- Book detail is a push from Today's "Currently reading" list, so the Today tab stays selected and the back button is the iOS 26 chevron-only glass button.
- "More" (…) on book detail holds Mark as finished, Edit goal and Remove from library (destructive, kept out of the main view). The menu is shown closed.
- Today has one primary action: Start session (it continues Middlemarch, the most recent book). Log pages is secondary, next to it.
- The week chart is inside the goal card, so the day's goal, the streak and the week sit in one glance-sized block. Bars at or over 20 min are full tint. The goal line is dashed. Every bar has its value printed, so colour does not carry meaning alone. Today's bar is hatched to show it is still in progress.
- First run: "Add the book you're reading" comes first, with Scan barcode (primary), Search by title (secondary) and Import from a CSV file (plain). The preset 20-minute goal follows, with a stepper. There is no streak, session or highlight UI, only one line saying the streak starts with the first session.
- The "+" toolbar button (Add book) appears on both Today states for consistency. On first run it duplicates the card's actions on purpose.
- Fold priority: the first 874 pt of each screen ends on whole rows above the tab bar. On Today that is goal, streak, week and all three books. On book detail it is identity, actions, progress and all four sessions. The highlights (Today's "A recent highlight" and book detail's two highlights, p. 194 and p. 211) are fully built but sit just below the fold. I judged them lower-priority than the log for a few-seconds-at-a-time visit. Moving highlights above sessions is the obvious alternative if the team prefers.

## Content
- All data comes from the brief. Derived-only values: "8 minutes to go" (20 − 12), "See all 23" (23 sessions), and the chart scale.
- Copy was shortened where needed: "p. 312 of 880" in list rows, and "First published 1871–72 / 880 pages".
- "Thursday" for Walden's last session is kept as written in the brief. The session list uses the brief's "Sat 26 Sep" style dates.

## Platform and fidelity
- Status bar, Dynamic Island and home indicator are drawn for layout review only; the system draws them. Nothing interactive sits in the top 62 pt or the bottom 34 pt. The tab bar's bottom edge is at y = 836.
- The glass tab bar and toolbar buttons show where system components go and what they contain. The implementer uses the system TabView / toolbar and must not re-create Liquid Glass. The CSS blur is only an approximation for the still image.
- A scroll-edge fade under the tab bar (iOS 26 scroll edge effect) keeps tab labels on a near-solid background whatever scrolls beneath.
- Type follows iOS Dynamic Type default sizes (Large Title 34, Title2 22, Title3 20, Body 17, Subhead 15, Footnote 13). The build must use text styles so larger sizes reflow. At accessibility sizes, list rows stack and the Today action pair stacks vertically (not drawn).
- Fonts: SF Pro and New York are the iOS system faces. The render uses the copies installed on the macOS machine (no web fonts). Fallback: Iowan Old Style or Georgia.
- Icons are hand-drawn SVG stand-ins for SF Symbols (calendar, books.vertical, chart.bar, magnifyingglass, play.fill, barcode.viewfinder, flame.fill, ellipsis, chevron.left). The build uses the real symbols.
- Book covers are designed placeholders in HTML/CSS/SVG made for this project. No third-party images or assets are used.
- Only light appearance was drawn, per the brief. Dark mode and the tapped/pressed states were not designed in this pass.

## Contrast (WCAG 2.2 AA, computed with color_tools.py)
- Tint #1D6B5A: on white 6.36:1, on #F2F2F7 5.70:1, on gray button #E9E9EE 5.25:1. White on tint: 6.36:1.
- Secondary text #636366: on white 5.99:1, on #F2F2F7 5.37:1. This is the lightest text colour used; iOS's default secondaryLabel (60% gray, about 3.4:1 on white) was deliberately darkened.
- Text on glass: the labels sit on ≥78% white over the scroll-edge fade, which is effectively #F5F5F7 or lighter, so tint and black labels are above 5:1.

## Process
- Each screen was rendered with Playwright (Chrome, 402 × 874, DPR 2) via `render.mjs` in the working directory, and every PNG was inspected. Layout positions were measured, not estimated: all three Today book rows end at y = 771, the book-detail sessions end at y = 757, and the tab bar starts at y = 774.
- A fresh-eye critique reported no P0s and two P1s. Fixed: content peeking out in the gap beside the Search button on book detail. Disclosed above: highlights below the fold.
