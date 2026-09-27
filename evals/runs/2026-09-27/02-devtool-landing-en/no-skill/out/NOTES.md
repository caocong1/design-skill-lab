# Notes and assumptions

- Headline uses the brief's message nearly verbatim ("Your app's data lives on the device first."); the lede adds what it is (open-source, local-first SQL database) so the first screen answers "what is it" and "how do I start" (npm install + Get started).
- Code sample: same statements, identifiers and SQL as the brief, but line breaks and indentation inside the tagged SQL templates are rewrapped (max ~41 chars per line) so it stays legible at 390 px with no horizontal scroll and no clipping. Whitespace inside SQL is insignificant, so behaviour is unchanged.
- Swift and Gradle install lines live in the "Get started" block near the end; the hero shows only the npm command (most of the audience is web) with a pointer to the others.
- Step 2 and step 3 illustrations (a "title"/"done" row merged per column; a shape `WHERE team_id = ?` relaying to two of three devices) are illustrative examples of the described behaviour, not product data.
- The 0.8 ms figure shown under step 1 is the published local write p50 benchmark.
- "Works offline" card says changes "sync when the network returns" — a restatement of background sync plus survive-restart; no new claim intended.
- "690 KB in the browser" card: says storage is OPFS (from the brief) and that data persists between sessions (what OPFS persistence + "pending changes survive restarts" imply).
- Pricing: Cloud Pro is visually outlined because it is the paid self-serve plan; no "most popular" or similar claim is made. Plan rows are ordered so synced data / devices / support line up between Hobby and Pro.
- On mobile the plans are titled "Cloud Hobby / Cloud Pro / Cloud Enterprise" (the brief's names) instead of a separate "Driftless Cloud" label, to save height.
- Nav on mobile collapses to logo + Get started + a menu button (simple JS toggle); all page content is visible without interaction.
- Mobile page was kept under ~8,100 CSS px so that the full-page 2x capture stays within Chrome's single-capture limit and the whole page fits in the 10 reviewed screens.
- All links are in-page placeholders (#docs, #github, ...) since no real URLs were given.
- Fonts: Geist and Geist Mono from Google Fonts (SIL OFL). All graphics (logo mark, contour-line background, icons, diagrams) are hand-made inline SVG/HTML; the GitHub mark is the standard Octicon path (MIT).
- Social proof used is only the listed 18.4k stars, 236 contributors and 1.2M npm downloads/month (Aug 2026).
- Renders produced with Playwright + Chrome (render.mjs in the working directory, outside out/).
