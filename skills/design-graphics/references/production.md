# Production: Sizes, Print and the Render Pipeline

**Sizes are perishable.** Platforms change them without notice. Use this table
to start, then confirm in the platform's own help pages or the size tracker in
`../../design-studio/references/resources/graphic.md` > Social cards and
platform sizes. Last reviewed: 2026-09.

## Screen Formats

| Use | Size (px) | Notes |
| --- | --- | --- |
| Open Graph / link preview | 1200 x 630 | keep text inside the central 1000 x 500; shown as small as 300 px wide |
| X / Twitter in-feed image | 1600 x 900 (16:9) | large-summary cards use the OG image |
| LinkedIn post image | 1200 x 627 | |
| Instagram feed | 1080 x 1350 (4:5) or 1080 x 1080 | the grid crops to a centre portion; keep the subject central |
| Instagram / TikTok / Reels / Stories | 1080 x 1920 (9:16) | keep clear of roughly the top 250 px and bottom 340 px where UI overlays sit |
| YouTube thumbnail | 1280 x 720 | readable at 160 px wide; bottom-right is covered by the duration badge |
| WeChat article cover | 900 x 383 (2.35:1) for the lead; a 1:1 crop is used in shares and secondary slots | design so the centre square still works |
| Xiaohongshu (RED) note | 1242 x 1660 (3:4) | the cover carries the title; large type |
| GitHub README banner / social preview | 1280 x 640 | works on light and dark page backgrounds |
| Slides | 1920 x 1080 (16:9) | 4:3 only on request |
| App Store screenshots | per device class; portrait phones are roughly 1290 x 2796 and up | exact sizes change with each device generation - always confirm in the store console |
| Google Play feature graphic | 1024 x 500 | |

Export at the listed pixel size (it already assumes high density) as PNG for
flat graphics and type, JPEG or WebP for photographic images; keep file size
reasonable for feeds (under about 1 MB).

## Print Basics

| Item | Rule |
| --- | --- |
| Units | design in mm at final size |
| Bleed | 3 mm (0.125 in) beyond the trim on every side; backgrounds and images extend into it |
| Safe margin | keep text and marks at least 3-5 mm inside the trim; more for bound edges |
| Resolution | raster images 300 ppi at final size; line art 600-1200 ppi; vector wherever possible |
| Colour | screens are RGB, presses are CMYK: bright RGB greens, oranges and blues will dull. Conversion needs a proper profile and a proof |
| Black | small text pure K (C0 M0 Y0 K100); large solid black areas may use a rich black (for example C60 M40 Y40 K100) - ask the printer |
| Type | 6-7 pt minimum for body in print; thin reversed-out type fills in |
| Spot colours, foils, varnish | specify by name with the printer; an agent cannot verify them |
| Common sizes | A-series (A4 210 x 297, A3 297 x 420, A2 420 x 594 mm); US Letter 8.5 x 11 in; business cards 90 x 54 mm (CN), 85 x 55 mm (EU), 3.5 x 2 in (US); posters A2 / A1 / 18 x 24 in / 24 x 36 in |
| Large format | viewed from a distance: 100-150 ppi at final size is normal |

Hand over with a plain list of what the printer must confirm: colour
conversion and profile, bleed and trim, paper, finishing, proof approval.

## Render Pipeline

| Goal | Route |
| --- | --- |
| HTML / CSS artboard -> PNG | fixed-size page, headless Chromium screenshot at the exact size (`../../design-studio/scripts/shot.sh page.html out 1200x630`); device scale factor 2 doubles the pixels - set the window to half the target or downsample |
| Many images from a template (OG cards, certificates) | an HTML-to-SVG engine plus an SVG rasteriser (fonts supplied as files); or a loop over a browser screenshot |
| SVG -> PNG | a dedicated SVG rasteriser, or the browser; check text: convert to outlines or ensure the font is available |
| HTML -> PDF (screen documents, decks) | browser print-to-PDF with `@page { size: …; margin: 0 }` and `print-color-adjust: exact` |
| HTML -> print-ready PDF with bleed and crop marks | a CSS paged-media engine (`@page { size: A3; bleed: 3mm; marks: crop cross; }`) - supported by paged-media polyfills and dedicated typesetting engines, not by plain browser printing |
| Long-form, reports, CJK books | a typesetting system (markup-to-PDF) or a CSS typesetting engine with strong CJK support |
| Slides from code | HTML slide frameworks exported to PDF; a PPTX generator when the recipient must edit |
| Motion graphics / video | a programmatic video framework; check its licence terms for company use |
| Raster processing | an image library for resize, format conversion, compositing; AVIF / WebP for the web |

Tools for each route are listed in
`../../design-studio/references/resources/code.md` > Rendering, export,
typesetting and fonts.

## Fonts in the Pipeline

- Headless renderers do not have your design fonts. Bundle font files with the
  source, reference them with `@font-face` by relative path, and wait for
  `document.fonts.ready` (or a time budget) before capture.
- HTML-to-SVG engines need font **files** passed in; they cannot use system
  fonts or remote CSS.
- CJK: bundle an open-licence CJK font; for display headlines, subset to the
  characters used to keep the repository small.
- Always confirm in the output image that the intended typeface rendered.

## Final Checks

View the export at 100% and at thumbnail size; greyscale it to check value
contrast; check edges, bleed and safe zones; spell-check headlines letter by
letter; confirm image resolution; confirm file size and format for the
destination.
