# Driftless landing page: notes

## Design read
- Mode: design-studio `piece`, standard effort. Persuade page, documentation-led archetype with a pricing tail: the audience reads code before copy.
- One idea: "drift" means copies that diverge. The page's signature is a worked per-column merge (one row edited on two offline devices, and both edits survive), which answers the "what about conflicts?" objection visually.
- Deliberately avoided: the dev-tool default (dark mode, one green accent, mono everywhere), the cream/serif/terracotta look, logo strips, three-card feature rows and a hero-metric block.
- Colour: white "survey sheet" ground; water blue #0759A8 is used only for actions and "Driftless" highlights; contour brown #9A4A12 for annotations; wood green #2F6B2A for merged results. Every text pair was computed with color_tools.py (≥ 4.5:1), and lint.mjs passes contrast at both sizes.
- Type: Archivo (variable, width axis; expanded widths for display) + JetBrains Mono for code. Both OFL, loaded from Google Fonts.

## Assumptions (one line each)
- The "1.4" link line in the hero is the release announcement the brief asks to feature. It is a text link, not a pill badge.
- The code sample appears twice in the HTML: the brief's exact formatting at ≥ 641 px, and a line-broken copy under 640 px so it stays legible at 390 without sideways scrolling. The tokens are identical; only whitespace differs, and the narrow copy is aria-hidden.
- The per-column merge figure uses invented **example data** (table `tasks`, row `t_42`, HLC times). It is labelled "example data" on the page and illustrates the documented behaviour; it makes no claim.
- The merge-rule wording on the page stays at the brief's level ("merges by hybrid logical clock"). I don't claim last-writer-wins.
- Pricing table: where the brief gives no value for a plan, the cell reads "—" (Enterprise limits read "Contact us"). Open-source limits read "Your infrastructure" because it is self-hosted. No number was invented.
- The Enterprise price reads "Custom / Contact us", from the brief's "Contact us".
- The "Know the limits" note (file-format extensions unsupported; browser storage limits) comes from the brief's FAQ, placed where sceptics look for the catch.
- I dropped two features from the grid because they repeat other sections: custom merge functions (covered in How it works and the FAQ) and SQLite compatibility (covered in the platform strip and the FAQ).
- The social proof is only the three numbers from the brief (18.4k stars, 236 contributors, 1.2M npm downloads/month, August 2026).
- All links are in-page anchors or placeholders (`#docs`, `#github`...), because no real URLs exist for this fictional product.
- The mobile nav collapses into a `<details>` menu. Get started stays visible in the sticky header.
- The copy button uses the Clipboard API; the command is fully visible without it.

## Assets and licences
- Fonts: Archivo and JetBrains Mono (SIL OFL 1.1) via fonts.googleapis.com.
- The GitHub mark is the Octicons "mark-github" path (MIT, GitHub), used to label the GitHub link.
- The Driftless logo (three bars, two blue and one ink) and every diagram are HTML/CSS/SVG drawn for this page. No raster images.

## What this page does not try to do
- No live playground, no dark theme, no usage calculator (pricing is flat per plan).

## Verification
- Rendered with Playwright + Chrome at 1440×900 @1 and 390×844 @2, full page. lint.mjs floor passes at both sizes (contrast, overflow, accessible names, above-the-fold for h1, the install command and Get started).
- A fresh critic subagent reviewed round 1. The fixes applied:
  - The mobile full-page PNG was wrapping because Chrome caps full-page captures at 16,384 device px. I brought the mobile page to about 8,100 CSS px (16,202 device px) by hiding content that repeats elsewhere, at ≤ 640 px only:
    - the code-panel notes and the How-it-works lede;
    - the server note and the "before" row table;
    - the limits small print;
    - the section ledes;
    - a secondary button.
  - Mobile plan cards now share one row set, which matches the desktop table.
  - Enterprise cells read "Contact us" instead of "—".
  - The Swift and Gradle strings wrap instead of clipping.
  - The header Get started is an outline button on mobile, so only one filled primary shows per view.
- Open and disclosed:
  - The merge signature is not in the first viewport; it starts on screen 2.
  - The type and spacing scale has drifted (about 23 font sizes); it wants a token pass.
  - Footer and inline text links are under 44 px tall on touch, though they meet WCAG 2.5.8 via spacing.
  - The mobile page sits close to the capture limit: adding content at 390 px would wrap the PNG again.
