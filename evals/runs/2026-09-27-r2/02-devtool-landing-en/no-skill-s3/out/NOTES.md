# Notes and assumptions

- Visual direction: warm "paper" background with faint contour lines (a nod to the Driftless name / unglaciated terrain), near-black ink, one deep green accent and a lime highlight used only on dark surfaces. Type is Geist + Geist Mono from Google Fonts (OFL); system fonts are the fallback.
- The Driftless wordmark/logo (two wave strokes in a rounded square) is my own inline SVG. All icons are hand-written inline SVG. No external images.
- Code sample: the tokens are unchanged, but I re-wrapped the long lines (the `open()` options object, the CREATE TABLE / SELECT / INSERT template strings) so the longest line is about 43 characters. That lets the same sample be read at 390 px without horizontal scrolling or soft-wrapping. Whitespace inside the SQL template strings is not significant.
- The first screen at both sizes shows: what it is (headline and one-line definition), the `npm install` command with a copy button, and Get started / Docs. On desktop the code sample is in the first screen too; on mobile it comes right after.
- Social proof is limited to the allowed stats (18.4k stars, 236 contributors, 1.2M npm downloads/month). The GitHub star count also appears next to the GitHub nav link.
- "How it works" diagrams are illustrative. The per-column merge example (a note's title/body/done columns edited on a phone and a laptop) and the device names in the relay step are example data, not product claims.
- Benchmarks are shown as three numbers with the stated setup (M3 MacBook Air, Chrome 140, OPFS), attributed to "the project's published benchmark page". I did not add bars or comparisons against other databases.
- Comparison-table wording is the brief's. I added "pending changes survive restarts" to the offline-writes row because that is also stated in the brief.
- Pricing: Cloud Pro is visually emphasised as the middle managed option. This is a layout choice, not a "most popular" claim, so there is no badge. CTA labels (View on GitHub, Start free, Start with Pro, Contact sales) are my wording.
- The 1.4 release pill says "30% smaller bundle" on mobile (the shorter pill); the "What's new in 1.4" block states the facts in full, including 19 Aug 2026.
- Links are placeholders (`#`) because no real URLs were given. Nav "Pricing" links to the on-page pricing section.
- To keep all content within the reviewed 10 screens, and under Chrome's 16,384 px capture limit at DPR 2, the mobile layout is compacted: the "how it works" intro paragraph, the benchmark intro paragraph, the first step's mini-diagram, the feature icons and the closing CTA band are hidden below 760 px. The install command stays in the hero and in the Install section.
- No hover- or click-dependent content: all FAQ answers are shown open, and the three install methods are shown side by side, not in tabs.
- Rendered with Playwright + Chrome (render.mjs in the working directory), scrolling through once before full-page capture.
