---
title: Graphics (posters, social and OG, decks, print, generative)
evidence: practice
sources: [anthropic-design-skills, cjk-font-licensing]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Graphics

Graphic design is composition under a fixed frame: one message, one focal point, a reading order.
Play to the medium. HTML, CSS and SVG are excellent at type, grids, vector shape, pattern and data,
and poor at photography and painterly illustration. Those come from the user's assets, licensed
sources or the [image lane](../process/image-generation.md), never from CSS imitating a photo.
Artefacts go to `.design/graphics/<name>/`. Type, colour and layout fundamentals are in
[typography](../fundamentals/typography.md), [color](../fundamentals/color.md) and
[layout-and-spacing](../fundamentals/layout-and-spacing.md). Generic moves to avoid are in
[anti-slop](../fundamentals/anti-slop.md).

| Request | Effort | Sections | Start from |
| --- | --- | --- | --- |
| one poster, cover, banner, OG image | quick or standard | 1, 2, 3 or 4, 9 | [artboard](../../templates/artboard.html) |
| a social series, event kit, store screenshots | standard | 1, 2, 4, 9 | artboard, one per format |
| a deck, 汇报 PPT, pitch | standard; `options` for the style | 1, 5, 9 | [deck](../../templates/deck.html) |
| print (flyer, card, poster to press) | standard | 1, 2, 6, 9 | artboard with a print preset |
| infographic, data graphic | standard | 1, 7, 9 | artboard |
| generative background or artwork | standard | 1, 8, 9 | artboard |

## 1. Message and frame first

1. **One message.** Write the headline, one supporting line and the call or credit before anything
   else. If it needs more, it is a document, not a poster.
2. **Fix the frame**: exact pixel or physical size, where it is seen, its smallest real rendering (a
   300 px wide link preview, a 160 px thumbnail, an A3 across a corridor) and the platform's safe
   zones.
3. **Two artefacts, in order.** For standard work, fill the thesis, own-world and finish line of a
   [surface contract](../../templates/surface-contract.md) (message, referent, the one visual move,
   the smallest view it must survive), then draw the canvas. A poster or artwork carries the idea
   with about 90% image and 10% text; on an OG card or a slide title the words are the image.
4. **Options** for a style (a deck, a campaign): three previews at the frame's real size, not three
   descriptions ([directions](../process/directions.md)). For a deck, each preview is the same three
   slides: title, chart and statement.

## 2. Compose

Moves that change a graphic, beyond the fundamentals:

- **The focal element dominates**, far more than feels safe. Scale contrast of 1:6 or more between
  the largest and smallest type creates energy; many medium-sized things create mush.
- **Type as image** is the agent's strongest move. Set it huge, crop it at the edge, stack it, run a
  line off the frame, rotate one block, use one weight at two extreme sizes, knock an image out of
  the letters. Choose the face by rendering candidates in the headline
  ([typography](../fundamentals/typography.md)), with a licence that covers the use.
- **One grid, meant.** Manuscript, column, modular or hierarchical. Align everything, then break it
  once, on purpose. Generous margins read as confidence.
- **Two or three colours, one dominant.** Check the composition in greyscale: without value contrast
  the hierarchy disappears.
- **Texture without photographs**: grain (`feTurbulence`), halftone and line fields (`<pattern>`),
  gradients interpolated in OKLCH, overprint-like `mix-blend-mode: multiply`, masks and cut shapes.
- **Containment floor.** Nothing overlaps by accident, nothing is clipped by the frame unless it
  bleeds on purpose, and every text block sits inside the margins.
- **Refine, don't add.** After the first render, make one pass that only removes or strengthens:
  cut an element, enlarge the focal one, tighten the alignments. Never add a new element in it.

## 3. Posters and typographic work

- **Three distances.** Across the room: the one idea. Arm's length: headline, date, place. Up close:
  the details. For comfortable reading, cap height is about 1/120 of the viewing distance (25 mm at
  3 m; a sign-industry rule of thumb).
- **Chinese display type.** Vertical titles with `writing-mode: vertical-rl`; one- or two-digit
  numbers upright with `text-combine-upright: all`; punctuation needs the font's vertical
  alternates (Source Han and Noto CJK have them). Tighten large Han headlines by eye, not by a
  Latin tracking value. Details: [cjk-typography](../fundamentals/cjk-typography.md).
- **Display craft.** At display sizes, space pairs optically and hang punctuation outside the text
  edge. Headline text that is the artwork (a title treatment, a logo-like lockup) is converted to
  outlines ([brand](brand.md) §5).
- **A series is a system**: a fixed grid, type styles and one varying element (colour rotation,
  image, number). Render the whole series on one contact sheet.

## 4. Social, OG and store graphics

Sizes are perishable: before a launch, re-check the row in the platform's own help page; rows marked
practice were never confirmed there (`python3 "$S/catalog.py" find --section graphic:social-og`, with `S` = `skills/design-studio/scripts`,
lists a maintained tracker).

| Use | Size (px) | Checked | Notes |
| --- | --- | --- | --- |
| Open Graph / link preview | 1200 x 630 (1.91:1) | 2026-09-27, Meta sharing docs | at least 200 x 200, at most 8 MB; shown as small as about 300 px wide; X and LinkedIn crop differently, so keep text central (a rule of thumb, not a platform rule) |
| X in-feed image | 1600 x 900 | 2026-05, Sprout Social | a link card uses the OG image |
| LinkedIn | link 1200 x 627; post 1080 x 1080 or 1920 x 1080 | 2026-05, Sprout Social | |
| Instagram feed | 1080 x 1350 (4:5) or 1080 x 1080 | 2026-05, Sprout Social | the profile grid crops to the centre: keep the subject central |
| Stories, Reels, TikTok | 1080 x 1920 (9:16) | 2026-05, Sprout Social | keep text clear of about the top 250 px and bottom 340 px (app UI; varies) |
| YouTube thumbnail | 1280 x 720 | 2026-05, Sprout Social | readable at 160 px wide; the duration badge covers the bottom right |
| Pinterest pin | 2:3 (735 x 1102 or larger) | 2026-05, Sprout Social | |
| WeChat 公众号 cover | 900 x 383 (2.35:1) | practice, 2026-09 | shares and secondary slots show a 1:1 centre crop: the centre square must work alone; confirm in the 公众号 backend |
| WeChat mini-program share card | 5:4 (for example 500 x 400) | WeChat docs, not re-fetched | [mini-programs](../platforms/mini-programs.md) |
| 小红书 note | 3:4 (1080 x 1440 up to 1242 x 1660) | practice, 2026-09 | the cover carries the title in large type |
| GitHub social preview | 1280 x 640 (at least 640 x 320) | 2026-09-27, GitHub docs | PNG, JPG or GIF under 1 MB; seen on light and dark pages |
| App Store, iPhone | 6.9": 1320 x 2868, 1290 x 2796 or 1260 x 2736; else 6.5": 1284 x 2778 or 1242 x 2688 | 2026-09-27, App Store Connect | one of 6.9" or 6.5" is required; iPad 13": 2064 x 2752 |
| Google Play | feature graphic 1024 x 500; screenshots 9:16 at least 1080 x 1920 | 2026-09-27, Play Console Help | JPEG or 24-bit PNG, no alpha |
| Slides | 1920 x 1080 (16:9) | - | 4:3 only on request |

- **Survive the thumbnail.** Compute the scale of the smallest rendering (300 / 1200 = 0.25 for OG)
  and make the headline at least 12 px after scaling (a 48 px headline on the 1200 card). Few words,
  large type, strong contrast, the brand small but present.
- **Many cards from one template** (per article, per product): a JSX-to-image renderer such as Satori
  (to SVG, then rasterised) or Takumi, with font files passed in; Satori lays out with a flexbox
  subset (no CSS grid).
- **Export** PNG for type and flat colour, JPEG or WebP for photographs, under about 1 MB for feeds,
  at the exact pixel size (DPR 1).

## 5. Decks

**Argument first.** Write every slide title as an assertion, a full sentence that states the point
("Churn fell 40% after onboarding changed"), not a label ("Churn"). Read the titles alone in order:
if they tell the story, the deck works. Open with the situation and the tension, end with the ask or
the decision needed. For an investor deck, `catalog.py show sequoia-business-plan` is the default
spine.

**Presented or read?** A deck projected with a speaker carries little text. A deck sent to be read
(most 汇报 PPT) may be denser, but keeps assertion titles and one idea per slide. Ask which, or state
the assumption.

**Slide system.** Layouts: title, section divider, statement, big number, two-up comparison,
full-bleed image, chart, quote, process or timeline, table (rare), closing and ask. One grid (for
example 12 columns inside a 112 px margin, as in the template), one type scale, the title in the
same position on every slide, a source line and page number in the footer.

**Sizes.** A 1920 x 1080 canvas maps to PowerPoint's 13.33 x 7.5 in slide at 2 px per pt. Projected:
body at least 24 pt (48 px). Read on screens: at least 18 pt (36 px). Footnotes and source lines at
least 12 pt (24 px). Detail goes to an appendix or a leave-behind document.

**Charts.** One message per chart, stated in its title; highlight the series that matters and mute
the rest; label directly instead of a legend. Chart choice and data colour:
[data-dense-ui](data-dense-ui.md).

**Routes.**

| The recipient must | Route | Fonts |
| --- | --- | --- |
| view or present | HTML slides ([deck](../../templates/deck.html), Slidev, Marp) to PDF: Playwright `page.pdf({ width: "1920px", height: "1080px", printBackground: true })` or Chrome print with `@page { size: 1920px 1080px; margin: 0 }` | subset-embedded in the PDF; the licence must allow document embedding (OFL does) |
| edit in PowerPoint, WPS or Keynote | PPTX from code (python-pptx, PptxGenJS): real text boxes, native charts from the data, never screenshots of slides | fonts the recipient has, or embedded |
| both | build the PPTX; render it to PDF (`soffice --headless --convert-to pdf deck.pptx`) and look at every page | as above |

**Fonts the recipient has.**

- Office's Latin default is Aptos in Microsoft 365, which older Office versions lack; Calibri and
  Arial are safe. Chinese: 微软雅黑 on Windows, PingFang SC on macOS. A missing font falls back
  (often to 宋体 or Songti) and every text box reflows.
- Or embed. PowerPoint embeds a font only as far as its `OS/2.fsType` bit flags allow: 0
  (installable) and 8 (editable) embed editable, 4 opens read-only where the font is missing, 2
  forbids embedding, +256 forbids subsetting. Read it with
  `python3 -c "from fontTools.ttLib import TTFont; print(TTFont('F.ttf')['OS/2'].fsType)"`.
- A full CJK font adds megabytes: choose "embed only the characters used" when nobody will add text.
  Keynote does not embed fonts.
- Vendor "免费商用" fonts forbid stand-alone redistribution: read the embedding clause first (licence
  matrix in [cjk-typography](../fundamentals/cjk-typography.md)).
- Always send the PDF beside an editable file, as the reference for how it should look.

## 6. Print

The agent cannot proof print. Deliver an honest file and a list of what the printer must confirm.

| Item | Rule |
| --- | --- |
| Units | design in mm at final size |
| Bleed | 3 mm (0.125 in) beyond the trim on every side; backgrounds and images extend into it |
| Safe margin | text and marks at least 3-5 mm inside the trim; more on a bound edge |
| Resolution | raster 300 ppi at final size; line art 600-1200 ppi; vector wherever possible; large format viewed from afar: 100-150 ppi |
| Colour | screens are RGB, presses are CMYK: saturated RGB greens, oranges and blues dull. Conversion needs the printer's profile and a proof |
| Black | small text pure K (C0 M0 Y0 K100); large solids may use a rich black (for example C60 M40 Y40 K100): ask the printer |
| Type | body at least 6-7 pt; thin reversed-out type fills in |
| Spot, foil, varnish | specify by name with the printer; the agent cannot verify them |
| Sizes | A4 210 x 297, A3 297 x 420, A2 420 x 594 mm; US Letter 8.5 x 11 in; business cards 90 x 54 mm (CN), 85 x 55 mm (EU), 3.5 x 2 in (US); posters A2, A1, 18 x 24 in, 24 x 36 in |

Routes: Chrome print ignores `bleed` and `marks`, so for a PDF with bleed set the `@page` size to
trim plus bleed (the artboard's print presets do) and state the trim size. For crop marks use a
paged-media engine (Paged.js, WeasyPrint) with `@page { size: A3; bleed: 3mm; marks: crop cross }`.
Long CJK documents: Typst or a CSS typesetting engine. The output is an RGB PDF: CMYK conversion,
PDF/X and spot separations are prepress work; say so in the hand-over.

Hand-over list: colour conversion and profile, bleed and trim, paper, finishing, fonts embedded,
proof approval.

## 7. Infographics and diagrams

- Start from the question the graphic answers; choose the chart by the comparison it makes
  ([data-dense-ui](data-dense-ui.md)), not by novelty.
- Write the insight on the graphic as an annotation, and the data source and date on the piece.
- Draw marks after strokes and align each mark with the label it names. A diagram that renders
  wrong in a way no rule explains: [casebook](../casebook.md), "Diagrams and marks on a line".

## 8. Generative backgrounds and artwork

- **Gradients** in a perceptual space (`linear-gradient(in oklch, ...)`) to avoid a grey middle; add
  fine grain at low opacity against banding.
- **Text over it**: compute contrast on the busiest region under the text
  (`$S/color_tools.py`); add a scrim or move the text when it fails.
- **Seeded and reproducible**: parameters are quantities with ranges (count, scale, angle,
  probability, threshold); the same seed always gives the same image. Render 12-24 seeds on one sheet,
  choose, and record the seed. A viewer with fixed chrome and seed navigation makes the choice fast.
  Identities built this way: [brand](brand.md) §8.
- **Live shaders**: ship a still fallback, pause off-screen and under reduced motion
  ([motion](motion.md) §5), cap the frame rate and pixel ratio, and export stills at the target size.
  Shader libraries: `catalog.py find shader gradient --domain assets`.
- **Video and motion graphics** from code: a programmatic video framework such as Remotion
  (`catalog.py show remotion`). Its licence is free for individuals and small teams only; check the
  company threshold before client or commercial work.

## 9. Render and check

1. Build at the exact size: one fixed artboard per format from [artboard](../../templates/artboard.html)
   (`?preset=` or `?w=&h=`), or an SVG. A deck from [deck](../../templates/deck.html).
2. Fonts: bundle the files, load them with `@font-face` by relative path, and confirm in the image
   that the intended face rendered ([render-and-look](../process/render-and-look.md) §3).
3. Export at the exact pixels: `bash "$S/shot.sh" page.html out 1200x630 --dpr 1`, or
   `$S/capture.mjs`; a PDF for print and decks (routes above).
4. Look at the exported file at 100%, then at the artboard's review views: the smallest real size
   (`?thumb=1`), greyscale (`?gray=1`), edges, bleed and safe zones (`?guides=1`). Check image
   resolution at final size, read every headline character by character (CJK typos pass every spell
   check), and leave no single character alone on a CJK line.
5. A series or a deck: all pieces on one contact sheet (`capture.mjs --sheet`), checked side by side.

Deliver the source, the exports at size, the contact sheet for a series, font and asset licences
([licensing](../fundamentals/licensing.md)), provenance for generated rasters, and for print the
printer's list.

Anti-patterns: everything centred; timid scale; five typefaces; decoration competing with the
message; tiny text on a social card; content under platform overlays; slides that are documents and
titles that are labels; screenshots of charts in an editable deck; print files without bleed or with
unlicensed fonts; exporting without checking that the fonts loaded.
