---
name: design-graphics
description: Design static and print-style graphics produced from code - posters, covers, social media graphics, Open Graph and README banners, app-store screenshots, presentation and pitch decks, one-pagers, infographics, business cards, and generative backgrounds (gradients, grain, patterns, shaders) - with real typographic composition and a render pipeline to PNG, SVG or PDF. Use when the user asks for a poster, banner, cover, slide deck, PPT, social post image, OG image, infographic, print piece or background artwork. 海报、平面设计、封面、社媒配图、PPT、演示文稿、信息图、背景图。
metadata:
  version: 0.1.0
  short-description: Posters, social, decks, print from code
---

# Design Graphics

Graphic design is composition under a fixed frame: one message, one focal
point, a deliberate reading order. The agent's tools are HTML / CSS, SVG and
typesetting engines - which are excellent at type, grids and vector shape, and
poor at photography and painterly illustration. Play to the medium.

Fundamentals: `../design-studio/references/typography.md`,
`../design-studio/references/color.md`,
`../design-studio/references/layout-and-spacing.md`. References:
`../design-studio/references/resources/graphic.md`. Sizes, print and the
render pipeline: `references/production.md`.

## 1. Message and Format

- **One message.** Write the headline, the single supporting line, and the
  call or credit. If it needs more, it is a document, not a poster.
- **Fix the frame first**: exact pixel or physical size, orientation, where it
  will be seen (feed thumbnail, projected wall, printed A3, phone story) and
  the platform's safe zones. Sizes are perishable - check
  `references/production.md`, then confirm against the platform.
- **Viewing distance sets type size.** Design a poster to read at three
  distances: across the room (the one idea), at arm's length (the headline
  and date), up close (details). Design a social graphic to survive as a
  thumbnail.

## 2. Compose

- **Choose a grid and mean it**: manuscript (one block), column, modular, or
  hierarchical. Margins are part of the design - generous margins read as
  confidence. Align everything to the grid, then break it once, on purpose.
- **Make the focal element dominant**: usually it should occupy far more of
  the frame than feels safe. Scale contrast (very large against very small)
  creates energy; many medium things create mush.
- **Hierarchy in three levels** at most: primary, secondary, detail.
- **Whitespace is a shape.** Look at the negative space as its own form.
- **Asymmetry with balance** is more alive than centred symmetry; centred
  layouts suit formality and ceremony.
- **Type as image**: for an agent this is the strongest move. Crop it, stack
  it, run it off the edge, set it huge, rotate a block, use a single weight at
  two extreme sizes. Choose a typeface with a voice and an open licence.
- **Colour**: two or three colours, one dominant. Check the palette in
  greyscale for value contrast.
- **Texture and depth** without imagery: grain (SVG `feTurbulence`), halftone
  and line patterns (`<pattern>`), layered gradients interpolated in a
  perceptual space, blurred shapes, overprint-style blend modes, cut-out
  shapes and masks.
- **Imagery**: use the user's assets or properly licensed sources. Treat
  photos consistently (duotone, crop, grain). Do not imitate photography with
  CSS, and do not present generated imagery as real.

## 3. Formats

### Social, OG, banners, store screenshots

Thumbnail legibility rules: few words, large type, strong contrast, the brand
mark small but present. Keep critical content inside the platform's safe zone.
For series, build a template system (grid, type styles, colour rotation) so
every piece is recognisably related. Open Graph and README banners: the title
is the image; design for both light and dark surroundings.

### Decks

- One idea per slide. The title is an **assertion** in a sentence ("Churn
  fell 40% after onboarding changed"), not a label ("Churn").
- Build the argument first as a list of those sentences; if the sequence
  reads as a story, the deck works. Open with the situation and the tension,
  end with the ask.
- A slide system: title, section divider, statement, big number, two-up
  compare, image full-bleed, chart, quote, timeline / process, table (rare),
  closing. One grid, one type scale, consistent margins.
- Type large enough for the back of the room (body text rarely under 24 pt on
  a 1920 x 1080 canvas); far fewer words than feels comfortable; detail goes
  to an appendix or a leave-behind document.
- Charts: one message per chart, stated in the title; highlight the series
  that matters and mute the rest; label directly instead of using a legend.
- Build as HTML slides rendered to PDF, or as `.pptx` with a generator when
  the user must edit in PowerPoint / Keynote (then use only fonts the
  recipient has, or embed / substitute explicitly).

### Print

Print is unforgiving and the agent cannot proof it. Set physical size, bleed
and safe margins; use vector and 300 ppi raster at final size; keep small
text pure black; and hand over with a plain list of what a printer must still
check: colour conversion and profiles, spot colours, paper, finishing.
Typesetting engines that support paged media (crop marks, bleed, CMYK output)
are listed in `references/production.md`.

### Infographics and data graphics

Start from the question the graphic answers. Choose the chart by the
comparison being made, not by novelty. Annotate the insight on the graphic.
Use a colour-blind-safe palette. Cite the data source on the piece.

### Generative backgrounds

Gradients, meshes, grain, patterns and shaders are legitimate code-native
artwork. Interpolate gradients in OKLCH / OKLab to avoid grey dead zones; add
fine noise to prevent banding; keep text contrast over the busiest region;
export stills at the target pixel size, and for live shaders provide a static
fallback and pause when off-screen or under reduced motion.

## 4. Render and Look

1. Build at exact size: a fixed-size artboard in HTML (or an SVG / typesetting
   source) under `.design/graphics/<name>/`.
2. **Fonts are the classic failure**: load them from local files or a
   reliable source and wait for them before capture; verify in the screenshot
   that the intended face rendered (fallback fonts silently ruin the layout).
3. Export with the pipeline in `references/production.md` at 2x or the
   platform's required pixel size; PDF for print and decks.
4. Inspect the actual output file: edges, safe zones, thumbnail size
   legibility (view it at 25%), greyscale value check, spelling, widows,
   alignment, image resolution.
5. For a set, review the pieces side by side.

## Anti-Patterns

- Centred everything; timid scale; five typefaces; a rainbow palette.
- Filling every corner; decoration competing with the message.
- Tiny text on a social graphic; ignoring safe zones; important content under
  platform UI overlays.
- Slides that are documents; bullet-point walls; chart junk; labels as titles.
- CSS imitations of photographs; stock 3D blobs as the concept.
- Sending print work with RGB-only assumptions, no bleed, or unlicensed fonts.
- Exporting without checking that fonts loaded.

## Deliverables

Source (HTML / SVG / typesetting file), exported PNG / SVG / PDF at the right
size, a contact sheet for series, asset and font licences, and for print a
list of what remains to be verified with the printer.
