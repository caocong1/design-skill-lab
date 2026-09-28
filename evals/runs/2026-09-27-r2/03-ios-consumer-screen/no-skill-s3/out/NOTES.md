# Dogear: assumptions and notes

- Type is the system font stack (`-apple-system`/`system-ui`), so Chrome on macOS renders it in SF Pro. The book covers and quotations use Iowan Old Style or Palatino, with Georgia as the fallback. No web fonts load.
- iOS 26 conventions used: a floating Liquid Glass tab bar with Search as a separate circle on the trailing side; round glass toolbar buttons (back, more, add); large titles; inset grouped cards with large corner radii; a capsule segmented control and a stepper.
- Tabs are Today, Library, Stats and Search, and Today is selected on all three screens. I assumed the book detail was opened from Today's "Currently Reading" list, so it's pushed inside the Today tab and the back button returns to Today.
- The tab bar sits at y 774–836, fully above the 34 pt home-indicator zone. Content scrolls under it, and a scroll-edge fade keeps the glass over a plain background so its labels keep their contrast.
- Accent colour is a terracotta `#B03A0B` (6.1:1 on white, 5.4:1 on the #F2F2F7 background and the tinted fills; white text on it is 6.1:1). I didn't use system blue because #007AFF is only 4.0:1 on white.
- Secondary text is `#636366`, which is iOS's higher-contrast grey (6.0:1 on white). I didn't use the default 60% grey because it's about 3.4:1, which fails AA and matters for users who read with a dimmed screen.
- Today: I followed the App Store Today header pattern, with the date as an overline and the large title sharing a row with the Add Book button, to save vertical space.
- Today: the "Recent Highlight" card is placed after "Currently Reading" and starts below the first screen, behind the tab bar. I put the reading list first because the brief's users open the app to start a session, log pages and check the streak. The same highlight is available in Middlemarch's Highlights (2) tab.
- Today: "8 min to go" is worked out from 12 of 20 minutes. The chart's dashed line marks the 20-minute goal. Sunday's bar is hatched because the day is still in progress, and Wednesday (0 min) shows as a flat grey stub, which explains why the streak is 4 days.
- Today: the Start Session caption ("Middlemarch · continue from page 312") assumes the timer defaults to the book read most recently.
- Book detail: the "More" (…) button holds Mark as Finished, Edit Goal and Remove from Library. The same three actions are repeated as a list at the end of the page, below the first screen.
- Book detail: the Sessions/Highlights segmented control shows the four sessions and shows that two highlights exist. The highlights themselves sit in the second segment.
- Book detail: "Edit Goal" is taken to mean the reader's daily goal, as the brief lists it among this book's actions. It's shown in the menu with no extra detail.
- First run: "Scan Barcode" is the single filled primary button. Search by Title and Import from CSV File are grey secondary buttons. "Step 1 of 2" frames adding a book as the first step and starting a session as the second.
- First run: the daily goal shows as a 20-minute value with a −/+ stepper, labelled "Preset for you". No streak, sessions, stats or highlights are shown, only one line saying they will appear later.
- All images are drawn by me in HTML/CSS/SVG: the book-cover placeholders, the open-book illustration with a dog-eared corner, and every icon (drawn to look like SF Symbols, not the real glyphs). No external images are used.
- The status bar (9:41, signal, Wi-Fi, battery), the Dynamic Island shape and the home indicator are drawn in the page to show the layout around them. They aren't interactive.
- `build.mjs` and `render.mjs` in the working directory generate the HTML and PNGs. The HTML files in `out/` are self-contained and open directly from file://.
