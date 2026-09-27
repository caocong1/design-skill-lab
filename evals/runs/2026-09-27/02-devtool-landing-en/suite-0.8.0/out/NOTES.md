# Driftless landing: notes

Mode: design-studio `piece`, standard effort. Single page, one direction (no options board requested). Fresh critique ran in a separate subagent.

## Design read
- Visitor mode: Persuade, but the audience evaluates by reading code, so the archetype is documentation-led (runner-up: long argument). The first viewport shows what it is, the install command and the code sample.
- Category rut: dark page, one green accent, mono everywhere, mesh-gradient hero. Opposite taken: light paper page, ink type, colour used only to mean something.
- One idea, "carbon copies": each copy of the data gets its own tint, like the sheets of a carbonless form (canary = laptop/browser, pink = phone, blue = sync server). The tints appear in the logo (three stacked sheets), the per-column merge diagram (each merged cell is tinted by the device it came from) and the code's syntax colours. Everything else stays quiet.
- Type: Archivo (variable width axis; wider cut for display, normal for body) and JetBrains Mono for code. Both are OFL fonts, loaded from Google Fonts.

## Assumptions (one line each)
- I reflowed the code sample's line breaks (SQL split over lines, `open()` options on separate lines) so it stays legible at 390 px without wrapping or sideways scrolling. Tokens and statements are unchanged.
- The merge diagram uses a sample `tasks` table (id 42, "Write docs" / "Ship 1.4 docs", todo/done) that is labelled "Sample data". It shows the brief's per-column merge claim and adds no new product fact.
- The platform labels "Laptop: browser, OPFS" and "Phone: iOS, was offline" are illustrative placements of platforms that the brief lists.
- "Before you adopt it" only restates limits from the brief (690 KB bundle, no file-format extensions, browser storage limits). It is there because the audience looks for the catch.
- The benchmark link, docs, sign-in and plan buttons point to `#`: the brief gives no URLs apart from the GitHub org implied by the Swift package path (github.com/driftless-db).
- Plan CTA labels ("Start free", "Choose Pro", "Talk to us", "View on GitHub") are my wording. Plan contents are the brief's, with nothing added.
- The 1.4 announcement sits in a slim top bar and in a "What's new in 1.4" block next to the install commands; the nav's Changelog link points there.
- The copy buttons use the Clipboard API. All content is visible without interaction. On mobile the nav collapses into a `<details>` menu.
- Social proof is limited to the three allowed figures plus the Apache-2.0 licence (which the brief gives as a fact).

## Assets and licences
- Logo mark, diagram and arrows: drawn in inline SVG/CSS for this page.
- Fonts: Archivo (SIL OFL 1.1), JetBrains Mono (SIL OFL 1.1), via fonts.googleapis.com.
- No raster images, no third-party illustrations.

## Verification
- Rendered with Playwright + Chrome at 1440×900 @1x and 390×844 @2x, full page (`render.mjs` in the working dir).
- lint.mjs floor passes at both sizes: contrast, no horizontal overflow, accessible names. Remaining warnings: font-size vocabulary is above the linter's budget because `clamp()` produces intermediate sizes. I left this as it is.
- Palette contrast was computed with color_tools.py (lowest text pair: #5A5F69 on #F2F3EF at 5.75:1).
- Mobile full-page height is kept under 8,192 CSS px (now about 7,770). At dpr 2, Chrome's roughly 16k px capture limit otherwise repeats the page top inside the render, which the fresh critic caught. To fit, the mobile layout drops the step detail lines, the code caption and the relay chips, and uses compact pricing rows with one shared CTA pair.
- Fresh critique (subagent) disposition: fix. Fixed: the mobile capture overflow (P1); canary is now reserved for the laptop copy, not general UI accents; the sync server shows the relayed changes (desktop); the headline is two lines so the code rises in the first desktop screen; I cut an unsupported phrase about the benchmark page's contents. There was no second critique round because of the time limit.

## What the design does not try to do
- There are no dark theme, animations or interactive demo. Motion is limited to the colour change on the copy buttons.
