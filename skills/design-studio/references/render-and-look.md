# Render and Look

A design that was never rendered and looked at is a guess. This is the design
equivalent of running the tests, and it has the same rule: report what was
actually verified.

## Tool Ladder

Probe once per session; use the highest rung available. Tool names and flags
are perishable - check what the host really offers.

1. **A browser automation tool in the host** (a Chrome or Playwright MCP, a
   built-in browser tool). Best: real rendering, scrolling, hover and focus,
   computed styles, console errors, performance traces.
2. **Playwright or Puppeteer from the shell** when the project already has it,
   or `npx playwright screenshot --channel chrome --full-page …` using the
   installed Chrome.
3. **Headless Chrome via `../scripts/shot.sh`** - no dependencies beyond a
   Chromium-family browser:
   `shot.sh page.html out/` (390, 768, 1280, 1920 wide at 2x),
   `--dark`, `--full`, custom `WxH` sizes.
4. **Native stacks**: simulator or emulator screenshots, Flutter golden
   tests, SwiftUI previews, Storybook.
5. **Nothing available**: say so, deliver the artefact marked *unverified*,
   and tell the user exactly what to open and look for.

Then **read the PNG** with an image-capable tool. A screenshot that was not
looked at verifies nothing.

Known traps:

- Headless Chrome inherits the operating system's colour scheme. Force the
  scheme explicitly (the script does), or "light" captures on a dark-mode
  machine are dark.
- A tall window to fake a full-page capture breaks `vh`-based layouts; use a
  true full-page capture.
- Web fonts may not have loaded when the capture fires. Wait for
  `document.fonts.ready` or a time budget, then **confirm in the image that
  the intended face rendered** - a silent fallback ruins a layout.
- Entrance animations can be caught mid-way; wait for them or disable them
  for the capture.
- Lazy-loaded images below the fold need scrolling before a full-page capture.
- Device scale factor 2 is the right default; 1x hides hairline problems,
  while a low-density check matters for Windows audiences.

## What to Capture

| Dimension | Minimum |
| --- | --- |
| Viewports | 390, 768, 1280, 1920 for web; the real device classes for native |
| Themes | every theme claimed (light, dark, high contrast) |
| States | default plus every designed state: empty, loading, error, long content, hover / focus where reachable |
| Content | real or realistic; the longest strings; mixed scripts if shipped |
| Motion | a recording or stepped frames; slow-motion pass; rapid-toggle interruption |

Make states reachable: a query parameter or a small toolbar in prototypes,
stories or fixtures in products.

## How to Look

Look in passes; each pass has one question.

1. **Squint** (view at 25% or blurred): what are the first three things seen?
   Are they the right three? Is there one primary action?
2. **Structure**: alignment lines, grouping by proximity, rhythm of spacing,
   the scan path. Anything aligned with nothing?
3. **Type**: number of sizes and weights actually present, measure, leading,
   heading widows, numerals, did the font load.
4. **Colour**: accent discipline, contrast of the smallest and lightest text
   (compute it), status colours paired with a second cue.
5. **Edges and details**: radius nesting, border and shadow consistency, icon
   size and optical alignment with text, image crops and resolution,
   truncation, scrollbars, clipped focus rings.
6. **Responsiveness**: is the narrow layout re-composed or just squeezed? Is
   the important thing still first? Any horizontal scroll?
7. **States and edge content**: does it survive empty, long, error, loading?
8. **Against the brief**: does it feel like the attributes in the brief? Would
   it be mistaken for a template? (`anti-slop.md`)

With a browser tool, measure instead of guessing: computed font sizes and
families, colour values, target sizes, the count of distinct colours, sizes
and radii in use.

## Compare

- **Before / after** for changes; **design / build** for implementation.
- Same viewport, theme, state and content on both sides.
- Side by side first; overlay or pixel-diff where tools allow. Anti-aliasing
  noise is not a finding; offsets, wrong tokens and missing states are.
- Keep the screenshots with the deliverable: they are the evidence.

## Report Honestly

State what was rendered, at which sizes and states, what was looked at, and
what was **not** verified and why. "Looks good" without a screenshot is not a
result.
