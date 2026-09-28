# Notes / assumptions

- Code sample: same statements as the brief, but I re-wrapped long lines (the `open()` options object and the SQL inside the template literals) so it stays readable at 390 px without horizontal scrolling. Semantics are unchanged.
- The two captions under the code ("no network on the write path", "render() re-runs when matching rows change") restate brief facts (all reads/writes are local; `db.watch` re-runs on matching changes).
- Hero install shows the npm command only; the Swift Package Manager and Gradle coordinates are in the Install section, linked from the hero.
- Pricing: "Contact us" for Enterprise is shown as a "Custom" price plus a "Contact us" button. No plan is labelled "popular"; Pro just gets a heavier border.
- Platform list in the diagram (Web app / Mobile app on iOS) is illustrative; both are platforms listed in the brief.
- Proof strip uses only the allowed figures (18.4k stars, 236 contributors, 1.2M npm downloads/month, Aug 2026) plus the Apache-2.0 licence from the pricing table.
- "Changelog", "Docs", "see methodology" etc. are placeholder `#` links (no real URLs given).
- On mobile, two feature tiles ("Offline is the default", "Self-host or managed") are hidden because the same facts appear in the comparison table, steps and FAQ; this keeps the mobile page within 10 screens.
- The nav collapses into a `<details>` menu on mobile; "Get started" stays visible.
- Fonts: Geist and Geist Mono from Google Fonts (SIL OFL). All graphics (logo, contour lines, diagram, icons) are hand-made inline SVG/CSS.
- Wordmark "driftless" and logo mark (two contour lines) are my own design.
