# Driftless landing: notes

## Design read
- Mode `piece`, effort `standard`. Persuade page for sceptical developers. Colour rung Restrained: paper ground, ink, and one green accent used for actions and the "Driftless" side of every comparison.
- Archetype: documentation-led. The first screen has the one-line definition, the install command and the real code sample. Pricing and comparison follow. Runner-up: long argument.
- The one idea: per-column merging shown as data. Two offline edits to one row merge column by column. A compact strip sits beside the desktop headline, and the full diagram is in "How it works". It shows the thing server + cache developers fear, and doesn't just claim it.
- Type: IBM Plex Sans for text, IBM Plex Mono for code, numbers and labels. Two families, both SIL OFL 1.1, loaded from Google Fonts.

## Assumptions (one per line)
- The code sample is verbatim. It soft-wraps with a hanging indent and line numbers on narrow screens, so it stays readable without sideways scrolling.
- The merge example (table `tasks`, row `t_42`, owner `u_17`, "Ship 1.4 notes") is illustrative. It is labelled "sample data" in both places it appears.
- Enterprise price is shown as "Custom", and "Contact us" is the button. The brief lists the price as "Contact us"; I didn't want the button label repeated as a price.
- Plan buttons ("Install", "Start free", "Choose Pro", "Contact us") and all links are `#` placeholders; no URLs were invented.
- "The write returns without waiting for the network" paraphrases the brief's "reads and writes never wait for the network".
- The mobile nav collapses into a Menu button. Get started stays in the sticky header at every width.
- Section order on mobile is tuned so the full page is about 8,000 CSS px (9.5 screens). At dpr 2, Chrome's full-page capture repeats tiles above 8,192 px, which the first draft hit.
- Proof used: only 18.4k stars, 236 contributors and 1.2M npm downloads/month (Aug 2026). No logos, quotes or customer names.

## Assets and licences
- Fonts: IBM Plex Sans and IBM Plex Mono, SIL OFL 1.1, from fonts.googleapis.com.
- Wordmark glyph (three aligned bars, the middle one green: copies without drift) and the diagrams are hand-made HTML/CSS/SVG. No external images.

## Verification
- Rendered with Playwright + Chrome to `png/desktop.png` (1440×900 @1, full page, 5,884 px) and `png/mobile.png` (390×844 @2, full page, 8,017 px).
- The design-studio lint floor passes at 1440×900 and 390×844: contrast, no horizontal overflow, accessible names, and h1 + install + Get started above the fold.
- A fresh critic subagent found no P0 or P1. Its P2s were fixed: code no longer wraps at 1440, Enterprise price no longer duplicates the button, proof line dated, prose captions set in sans, the unsupported adjective "small" removed, and the merge idea brought into the first desktop screen.
- Not fixed: the critic's suggestion of a compact plan-summary table above the cards on mobile. The cards list the limits first and each shows its price in the header row.
- Not verified: keyboard focus order (a focus ring style is defined), the copy-button success state, and the open mobile menu. Those depend on interaction, and the review uses static renders.

## What this page does not try to do
- No hero animation or scroll effects: the page is static by design.
- No dark theme.
- No invented benchmarks for the server + cache side; that side is described only in the brief's words.
