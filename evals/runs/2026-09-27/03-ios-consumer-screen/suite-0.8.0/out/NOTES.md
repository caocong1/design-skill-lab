# Dogear · notes and assumptions

One line each. The HTML files are self-contained (inline CSS and SVG); the only network request is Google Fonts.

## Design read
- Posture: branded-native iOS 26. Native structure (large titles, floating Liquid Glass tab bar with a separate trailing Search tab, glass toolbar buttons, grouped inset lists, capsule buttons); the brand is in colour, the serif and one motif.
- Voice: a quiet evening reading companion, not a gamified tracker. Warm paper grouped background (#F4F1EC), white cards, one accent (a bookbinding red, #A63A1C).
- The one idea: the dog-eared page. It is the folded corner on every cover, the streak glyph, the Today tab symbol and the empty book slot on first run.
- Type: SF Pro (system) for UI in Dynamic Type styles at the Large size with Apple's tracking; New York for book titles and quotations on device.
- Hierarchy per screen: Today → goal progress, then Start Session, then this week and then the books; Book → which book and where you are, then Start Session, then Log Pages / Add Highlight, then sessions and highlights; First run → Add your first book (Scan Barcode first), then the preset goal.

## Assumptions
- Top-level sections are drawn as an iOS 26 tab bar: Today, Library, Stats, with Search as the separate trailing search tab (search role), because the brief lists Search as a section.
- The Today tab symbol is a dog-eared page (custom symbol, or `document.fill` as the closest SF Symbol). Library `books.vertical.fill`, Stats `chart.bar.fill`, Search `magnifyingglass`.
- Book detail is shown pushed from the Library tab (Library selected; the tab bar stays visible on pushed screens). It could equally be pushed from Today.
- Start Session on Today continues the most recent book, so the button reads "Start Session · Middlemarch". Picking another book is a tap on its row.
- "Log" on each Today row opens the Log Pages sheet for that book (for Walden, an e-book, it logs a percentage). It is the fast path for the "open for a few seconds" visit.
- The Mark as Finished, Edit Goal and Remove from Library actions live in the toolbar's More menu (`ellipsis`); Remove from Library takes the destructive role and sits apart in that menu. The menu is not drawn because only the at-rest screen is reviewed.
- "Edit goal" in the book's More menu is read as the reader's daily goal, reachable from any book as well as from Today.
- In the week chart, days at or over the 20-minute goal are a muted red and days under it a pale neutral. Only today's bar (12, in progress) is full accent. A dashed goal line runs through the chart and every day's minutes are printed under its bar, so colour is never the only signal.
- Today's recent highlight (p. 194) follows Currently Reading, below the first screen; at rest the three books take priority.
- Streak shown as "4-day streak · Best: 23 days"; it matches the week (Wed 0 breaks it; Thu–Sun count).
- "~21 h left" and "At your pace" are the brief's "At your pace: about 21 h left", shortened.
- Session dates on Book detail use the brief's short form ("Sat 26 Sep"). "See All" leads to the full list of 23 sessions.
- Book detail reorders the brief: Highlights come before Sessions, so the first quotation is fully on the first screen, the highlights job is visible and the 4-row Sessions list follows below the fold. The progress card carries a "Last session" line (Today · 12 min · pp. 301–312), so a session is still visible at rest.
- First run: the goal stepper changes the goal in 5-minute steps (assumption; the brief says only "adjustable"). The copy says the goal is preset and can be changed any time.
- First-run copy explains what Today will show once a book exists; nothing is shown as data (no zero streak, no empty chart), because nothing exists yet.
- The Library and Stats tabs stay enabled on first run (HIG: never disable a tab); their own empty states explain themselves.
- Buttons use title case ("Start Session", "Log Pages"), as iOS does.
- Only the light, at-rest, default Dynamic Type state is drawn, as the brief asks. Dark mode, AX sizes and the scrolled/minimised tab bar state are not drawn.

## Platform chrome (approximations)
- Status bar, Dynamic Island and home indicator are drawn as placeholders in position; the system draws them.
- Liquid Glass is drawn as an approximation (translucent fill, blur, rim highlight) on the functional layer only: tab bar, search tab and the toolbar's back and More buttons. The platform draws the real material; no blur value is part of the design.
- The bottom scroll-edge effect under the tab bar is drawn as a soft paper-coloured fade; the system draws it.
- Bar heights, tab-bar inset (21 pt) and capsule sizes come from the skill's mockup kit, which marks them as approximations of Apple's UI kit.
- Toolbar back is the standard `chevron.left` symbol with no text; More is `ellipsis`.

## Fonts, images, licences
- SF Pro: the system font on iOS and macOS, used through `-apple-system`; not bundled.
- New York is the on-device serif; Chrome cannot reach it, so the renders use Newsreader (Production Type, SIL Open Font License 1.1) from Google Fonts as a stand-in. Line breaks in serif text will differ slightly on device.
- Book covers are designed placeholders drawn in CSS (colour block, title, rule, author, folded corner); no cover artwork is used.
- Icons are inline SVGs drawn for this mockup to stand in for the named SF Symbols; the build uses the SF Symbols named above.
- The first-run shelf illustration is an inline SVG made for this mockup.
- Quotations are from Middlemarch (public domain) as given in the brief.

## Verification
- Contrast computed with the skill's color_tools.py: accent on white 6.47:1; white on accent 6.47:1; secondary text #6B6660 on paper 5.05:1 and on white 5.68:1; accent on the tinted button fill 5.37:1; at-or-over-goal bars #B97C66 on white 3.42:1 (non-text); below-goal bars are a pale fill #D9CFC4 with a 1 pt #B97C66 outline (3.42:1), so the bar edge meets 3:1 and the minutes are printed in text.
- The skill's lint.mjs floor (contrast, overflow, accessible names) passes on all three files at 402 × 874.
- The Log buttons (32 pt tall) and the stepper halves (36 pt tall) have invisible hit areas extended to 44 pt.

## Process
- A fresh critic subagent reviewed round 1. Its findings are fixed: two Today rows were cut off under the tab bar, the Book Highlights heading was clipped, the dog-ear motif was too faint and red was overused in the chart. In round 2 the critic found no P0 or P1 issues. From its P2s, the first-run illustration now shows three dog-eared covers and the below-goal bars have an outline. Still open: the 4-row Sessions list on Book detail is below the fold (only the "Last session" line shows at rest). No AX Dynamic Type render was made; the ring label and the three-column stats row on Book would stack vertically at AX sizes.

## Not attempted
- Session timer, Log Pages sheet, Add Highlight, Search, Library and Stats screens.
- Dark appearance, Increase Contrast, Reduce Transparency and AX Dynamic Type renders.
