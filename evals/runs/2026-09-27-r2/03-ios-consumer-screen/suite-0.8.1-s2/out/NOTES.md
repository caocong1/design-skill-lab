# Dogear: notes and assumptions

## Design read
- Mode `piece`, effort `standard`: three iPhone screens, light, 402 × 874 pt, iOS 26. One CSS px = 1 pt.
- Thesis: a calm evening companion opened for a few seconds. First seen: today's minutes against the goal and the streak; second: Start Session; third: the week and the books.
- The one idea (own-world): the dogear. The card that holds your place has a folded top-trailing corner; warm paper background, bookcloth-green accent, book titles and quotations in a book serif.

## Assumptions (one line each)
- Book detail is pushed from Today (tapping Middlemarch), so the Today tab stays selected and the back button returns to Today.
- The tab bar keeps the four sections from the brief: Today, Library, Stats in one glass capsule, Search as the separate trailing search tab (iOS 26 search role).
- The floating tab bar sits with its bottom edge 38 pt above the screen edge, higher than the system position (about 21 pt), so nothing interactive sits in the 34-pt home-indicator inset, as the brief requires. On device use the system tab bar and its own position.
- "Log Pages" on Today is a text item in the top toolbar (it asks which book); a bare `plus` would read as "add a book". On the book screen it is a secondary button.
- Start Session on Today resumes the most recently read book (Middlemarch, from page 312); the caption under the button says so.
- The dogear also marks the book you left off in: Middlemarch's cover has a folded corner on Today and on its detail screen.
- The More menu (ellipsis, toolbar trailing) holds Mark as Finished, Edit Goal and Remove from Library (destructive role, last, separated). It is a system menu, closed in the render.
- The week chart counts a day as met at 20 min or more (Mon, Thu, Sat); under-goal days are a lighter green (#6E9A86, 3.2:1 on white) and today is hatched as in progress; a "Met goal" key sits next to the goal-line key. Values are always printed, so colour is never the only cue.
- Streak 4 days = Thu to Sun (Wed had no session), consistent with the brief's week data.
- "about 21 h left at your pace" is the brief's figure, not a computation.
- Buttons and section headers use title case, as iOS 26 does ("Start Session", "Currently Reading").
- Only light appearance is drawn, as the brief asks. Custom colours still need dark and increased-contrast variants for the build: paper #F5F2EB → #1A1917, surface #FFFFFF → #262421, accent #2E6B55 → #6FBF9C (dark), label-2 #6B665E → #A8A298.
- Content that does not fit the first screen continues below it: the recent highlight on Today, the highlights on Book detail, the "after your first session" preview on the empty state.
- First-run screen: no toolbar `plus` (there is nothing to log yet); the tabs stay visible and enabled, since the HIG says never to hide or disable a tab (each empty section explains itself).

## Platform fit and fidelity limits
- Type: SF Pro via `-apple-system`, sizes from the Dynamic Type Large table (34 large title, 22/20 titles, 17 body, 15 subhead, 13 footnote, 12 caption; 10 pt only for the system tab labels). The build uses text styles, not fixed sizes.
- Serif: the app uses New York (Apple's system serif) for book titles and quotations. Chrome cannot load New York by name, so the mockup falls back to Newsreader (Google Fonts, SIL Open Font License 1.1) and then Georgia.
- Glass: the tab bar and toolbar buttons are a labelled approximation of Liquid Glass regular (translucent fill + blur). Apple publishes no values; the device material will differ. The fade at the bottom approximates the system scroll-edge effect.
- Symbols are hand-drawn SVG stand-ins for SF Symbols: book.fill, books.vertical.fill, chart.bar.fill, magnifyingglass, plus, chevron.left, ellipsis, flame.fill, play.fill, barcode.viewfinder, tray.and.arrow.down, highlighter, doc.text, quote.opening, minus, chevron.right. The build uses the real symbols.
- Status bar, Dynamic Island and home indicator are drawn placeholders; the system draws them.

## Images and licences
- Book covers are designed placeholders drawn in CSS (cloth colour, spine crease, serif initial); no external images.
- Newsreader font: Google Fonts CDN, SIL OFL 1.1. No other external assets.
- Quotations are from Middlemarch (public domain), as given in the brief.

## Accessibility
- Contrast computed (color_tools.py): label 17.2:1 on white, 15.4:1 on paper; secondary label #6B665E 5.7:1 on white, 5.1:1 on paper; accent #2E6B55 6.3:1 on white, 5.6:1 on paper; white on accent 6.3:1; streak flame #B4480F 5.2:1.
- lint.mjs --platform ios: no overflow, unnamed-control or touch-target failures. Its remaining contrast flags are content scrolled beneath the tab bar or below the 874-pt fold (measured against the off-screen area). Visible text above the tab bar measures at or above AA.
- The scroll-edge fade was shortened to the tab bar's height after a fresh critique measured faded text above the bar at 1.6–3.5:1. The fade is now fully opaque from 34 pt below its top edge, so text above the bar keeps its full contrast.
- A fresh critique (one round) returned `fix`. Addressed: the fade contrast (P1), the under-goal bar contrast and missing key (P2), the ambiguous `plus` (P2), Start Session placed second on Today, uneven stat columns and the duplicate "23", and the widowed word in the first-run copy (P3). The glass is lighter now (62 % fill, brighter rim). Not addressed: radius and line-height drift (25, 26 and 27 pt are concentric by design; the line heights are iOS's own text styles).
- Not drawn: AX text sizes, dark appearance, the running-session state. At AX sizes the week chart would stack values under bars and the book rows would wrap the last-session text under the title.

## What the design does not try to do
- No social features, store, recommendations or badges; no invented data beyond the brief.
