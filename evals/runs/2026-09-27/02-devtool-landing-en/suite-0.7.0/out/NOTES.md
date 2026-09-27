# Driftless landing page: notes and assumptions

- Message: kept the brief's line as the H1 ("Your app's data lives on the device first."); the rest of it is in the lede.
- Hero: full-width headline, then the text column (install command, Get started, proof) next to the brief's code sample. On mobile the install command and CTAs are in the first screen and the code follows.
- Code sample: desktop shows the brief's formatting exactly. At 390 px the same code is re-wrapped (whitespace and line breaks only, including inside the SQL template strings) so it reads without horizontal scrolling or clipping.
- How it works: the brief's three steps, illustrated with a `tasks` table (row `t_19`, titles "Launch post draft"/"Launch post, final", teams 7 and 3). This is illustrative sample data, not a claim; it shows per-column merge and shapes as the brief describes them.
- Benchmarks appear twice on desktop (the two p50 numbers under the hero code, and all three with setup under the comparison). On mobile the hero copy is hidden to save height.
- "The catch": the brief's four FAQ answers, plus two answers built only from brief facts (690 KB gzipped bundle, 30% smaller in 1.4; JWT + row-level rules + shapes).
- Pricing: no plan is labelled "recommended" or "popular", since that would be an unsupported claim. Cloud Pro gets visual emphasis only. Plan subtitles ("for side projects", "for production apps", "compliance, residency and uptime commitments") are positioning copy derived from each plan's contents.
- Pricing CTA labels (View on GitHub, Start free, Start with Pro, Contact sales) and all link targets are placeholders (#anchors).
- Mobile trims: to keep the full page within the 10 reviewed screens (about 8,035 px against the 8,440 limit, and under Chrome's 16,384 device-px capture limit at DPR 2), mobile hides 6 of the 8 feature items (each one also appears in the steps, FAQ or platform strip), the legend, one panel note, the benchmark row under the hero code, plan subtitles and the final section's paragraph. No required content (install, code, pricing) is hidden.
- Nav on mobile: links collapse behind a menu button (no menu opens in the static prototype); "Get started" stays visible.
- Social proof: only the brief's numbers (18.4k stars, 236 contributors, 1.2M npm downloads/month, August 2026). No logos or testimonials.
- Wordmark: two overlapping squares (one local copy, one synced copy), drawn in inline SVG for this page.
- Fonts: Schibsted Grotesk (display/text) and IBM Plex Mono (code), both SIL Open Font License, loaded from Google Fonts. No external images; all diagrams are HTML/CSS.
- Colour: blue (#2B45D8) is used for actions and for edits made on this device; amber (#A34A06 on #FBEBDD) marks edits arriving from another device. Text pairs were checked with a contrast script and all pass WCAG AA.
- Renders: Playwright + Chrome, fonts confirmed loaded, page scrolled once before capture; no element extends past 390 px.
