# Driftless landing: notes and assumptions

One line each.

## Design read
- Mode `piece`, effort `standard` (design-studio 0.8.1): one landing page, Persuade visitor, documentation-led archetype with a comparison and pricing tail. The runner-up was a product tour, rejected because there is no real product UI to show; the code is the product.
- First viewport at both sizes: the headline (brief's message), one line on what it is, the copyable `npm install` command and one primary action ("Get started"). The code sample sits beside the headline on desktop and directly below it on mobile.
- The one memorable element: the per-column merge example (phone and laptop edit the same row offline, both edits are kept). It answers the audience's sharpest objection ("what about conflicts?") visually.
- Colour: light grey-green paper (#F3F4F0), near-black ink, one green (#0A6650) that marks only actions, and a yellow "marker" (#F2C94C) that marks only what changed (highlighted code lines, merged columns). This avoids the dark-mode-plus-acid-green default for dev tools and the cream/serif/terracotta default.
- Type: Schibsted Grotesk (display and body) and JetBrains Mono (code), both from Google Fonts, SIL OFL 1.1.

## Content decisions
- Every number, feature and claim is from the brief. Nothing else was added: no logos, testimonials, quotes or user counts beyond the listed proof (stars, contributors, npm downloads, August 2026).
- The code sample is verbatim. Numbered markers in the gutter point to three notes under it; each note restates a fact from the brief (open + sync with JWT, `db.watch`, local write relayed to matching devices).
- The merge example uses sample data (a row `t_81` with `title` and `done`), labelled "Sample data" on the page. The `hlc …031` labels in the step-2 diagram are illustrative too.
- The comparison table is the brief's table, verbatim. On mobile it becomes two columns under a label row, not a sideways-scrolling table.
- Pricing: the brief's four plans. On desktop every plan has the same rows (Hosting, Synced data, Monthly active devices, Restore, Support, Also included), aligned with CSS subgrid. Where the brief lists no figure the cell shows "—", with a note under the plans: "A dash means the plan lists no figure for that row." On mobile the empty rows are hidden. "Hosting" rewords the brief ("self-hosted sync server", "1 project", "dedicated region"); nothing new is added. No "most popular" badge. Cloud Pro gets the one filled button because it is the only paid plan with a listed price. On mobile the per-plan secondary buttons are hidden to save height; the sticky "Get started" stays.
- "Latest release: 1.4, 19 Aug 2026" comes from the brief's "What's new in 1.4".
- Nav: Docs, Guides, Pricing, Blog, Changelog and GitHub are links; Sign in and "Get started" (primary) sit on the right. Under 1100 px the text links fold into a menu button; "Get started" stays in the sticky header.
- Link targets are in-page anchors (`#docs`, `#pricing`...) because no real URLs were given.
- The FAQ answers are always visible (no accordion), per the brief's no-click constraint. It is titled "The catch, answered" because the audience is sceptical.

## Rendering
- PNGs rendered with Playwright + Chrome to the brief's manifest: desktop 1440 × 900 @1, full page; mobile 390 × 844 @2, full page. Render script: `.work/render.mjs` (outside `out/`).
- The mobile page is kept under about 8,190 CSS px tall (the final render is 8,082 px). At DPR 2, Chrome's full-page capture repeats content past 16,384 device px, which happened in an earlier draft. As a result the whole mobile page falls inside the 10 reviewed screens.
- Fresh critique (critique-design subagent, one round): the disposition was "fix" and the floor passed. Fixed afterwards: the P1 pricing rows now line up; the syntax keywords no longer use the marker yellow; the merge example is larger and laid out three across; the step-2 diagram no longer repeats the merge result; the desktop hero is vertically balanced; the focus ring on dark areas uses the yellow; package names wrap only at `/` or `:`; the pricing lead and release line are back on mobile. A second critique round was not run.
- Lint (design-studio `lint.mjs`, 1440 × 900 and 390 × 844): contrast, overflow, accessible names and the above-the-fold checks (h1, install command, primary action) pass. Font-size vocabulary warnings remain (too many distinct sizes); disclosed, not fixed.

## Not attempted
- There is no dark theme, no working menu drawer (the button is present but does nothing in this static page), no real copy-to-clipboard feedback beyond the button label, and no OG image.
- Images: none are external. The wordmark, diagrams and illustrations are hand-written inline SVG/HTML made for this page.
