# Render and Look

A design that was never rendered and looked at is a guess. This is the design
equivalent of running the tests, and it has the same rule: report what was
actually verified.

Two different acts share this file; do not confuse them.

- **Looking at the design.** The mockup is HTML / CSS / SVG for every target -
  web, mobile, HarmonyOS, mini-program, desktop, data wall - so one renderer
  (a browser) is all the designer ever needs. Draw inside the target's frame
  at its logical size (`portable-mockups.md`).
- **Accepting the build.** Comparing the implementation with the design needs
  screenshots of the running product, from whatever stack it was built in.
  Producing them is the implementer's job (simulator, device, golden test, a
  screenshot the user pastes). The designer only needs the images.

## Tool Ladder (looking at the design)

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
4. **Nothing available**: say so, deliver the artefact marked *unverified*,
   and tell the user exactly what to open and look for.

Then **read the PNG** with an image-capable tool. A screenshot that was not
looked at verifies nothing.

Known traps:

- Headless Chrome inherits the operating system's colour scheme. Force the
  scheme explicitly (the script does), or "light" captures on a dark-mode
  machine are dark.
- Headless Chrome will not make a window narrower than 500 px: asking for a
  390 px window lays the page out at 500 px and crops the image, which looks
  like a broken mobile layout. Render narrow viewports inside an exactly sized
  iframe (the script does), or use a tool with real device emulation.
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
| Sizes | 390, 768, 1280, 1920 for web; for other targets the platform frame at its logical size, plus the second size class the product must serve (tablet, wide window) |
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

## Compare (accepting the build)

- Ask the implementer (or the user) for screenshots at the same logical size,
  theme, state and content as the acceptance shots. Any source will do; if
  none can be produced, say that acceptance has not happened.
- **Before / after** for changes; **design / build** for implementation.
- Same viewport, theme, state and content on both sides.
- Side by side first; overlay or pixel-diff where tools allow. Anti-aliasing
  noise is not a finding; offsets, wrong tokens and missing states are.
- Keep the screenshots with the deliverable: they are the evidence.

## Report Honestly

State what was rendered, at which sizes and states, what was looked at, and
what was **not** verified and why. "Looks good" without a screenshot is not a
result.
