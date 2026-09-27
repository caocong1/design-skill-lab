---
title: Image generation lane - comps, raster assets, provenance, labelling
evidence: digest
sources: [impeccable, taste-skill, ai-labelling-law]
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Image generation

An optional lane, open only when the host has an image model: a built-in image tool (Codex has
one), an image MCP, or a tool the user provides. Probe once; never assume. HTML stays the contract
medium: a generated image is either a mood picture of a direction or a raster asset inside an HTML
design, never the design itself.

No image model: use the user's real assets, licensed stock ([licensing](../fundamentals/licensing.md))
or a labelled placeholder slot. Never fake photography or product screenshots with divs and
gradients.

## 1. What it is for

| Use it for | Never for |
| --- | --- |
| direction comps: one picture per direction to judge atmosphere at a glance (step 4) | UI text or anything with words: models garble text, CJK worst; text is HTML |
| photographic plates: hero and editorial imagery, product-in-context scenes that are clearly illustrative | icons (vector, [icons](../disciplines/icons.md)); logos and marks (drawn as vector, [brand](../disciplines/brand.md)) |
| textures, grain, backgrounds, abstract fields | platform chrome and components: use the system component or the mockup kit |
| illustration in a declared style | charts or data (invented numbers) |
| | real people, real products, trademarks, a living artist's or another brand's recognisable style |
| | anything presented as a photo of the real product, place, team or customer |

## 2. Comps for directions

- Each direction subagent may add one comp beside its HTML frame. Use the same content brief and
  aspect ratio for every direction, and label each comp on the board "AI comp, not a build".
- Prompt from the direction card: the referent, the palette as hex values, the type voice described
  in words (never font names: the model cannot render a real face), the layout grammar, material,
  light and the physical scene. Draw text areas as blank bars instead of words.
- A comp invents things: copy, controls, impossible layouts, faces that do not exist. It is mood
  evidence, never a spec. Values come from the direction card and the system, not the picture.

**Building to an approved comp** (comp-led path; a frontier-model job, so quick effort and smaller
models take the code-led path, where the direction card and surface contract carry the ambition):

1. Map regions: text, controls and chrome are HTML; image and texture regions are plates.
2. Type: measure cap height, x-height, weight and width from the pixels, then pick a real, licensed
   face that matches on a rendered specimen. "The comp's font" does not exist.
3. Colour: sample the comp, snap to the system's ramps (`color_tools.py scale`), recompute contrast.
4. Plates: regenerate every raster region as its own image at plate size (section 3). A crop of
   the comp is a reference, never a shipping pixel.
5. Compare the render with the comp region by region
   ([render-and-look](render-and-look.md) section 8). Models believe their HTML recreation of an
   image succeeded when it did not: the hero region must have nothing missing or contradicted
   before any other section is built.

## 3. Raster assets

- Size: at least the slot's CSS size x 2 (DPR 2), measured at its widest breakpoint. Never upscale
  a plate to fit.
- A series shares one prompt skeleton (style, light, lens, palette, grain) and varies only the
  subject; record the seed when the model exposes one.
- Check each plate in its slot at rendered size, in every theme (a bright photo in dark mode), with
  the contrast of text over it computed on the worst region under the text; add a scrim when it
  fails.
- Keep the master PNG; ship WebP or AVIF. Version filenames (`hero-v3.png`) and never overwrite an
  earlier version.
- Input images you give the model (references, the user's photos) must be licensed for that use.

## 4. Provenance (every generated raster)

- Write a sidecar `<file>.provenance.json` next to the asset, and the same data in the handoff.json
  asset row (`generated`):

  ```json
  { "generated": true, "model": "<model and version>", "provider": "<who runs it>",
    "prompt": "<full prompt>", "params": { "seed": null, "size": "1536x1024" },
    "inputs": [{ "file": "<reference>", "licence": "<licence>" }], "edits": ["cropped to 3:2"],
    "date": "YYYY-MM-DD", "terms_url": "<provider terms>", "label": "AI生成 / AI-generated" }
  ```

- Embed a short line in the file where the format keeps it:
  `magick in.png -set comment "AI-generated; model=<m>; date=<d>; see hero-v3.provenance.json" out.png`,
  checked with `magick identify -format '%c' out.png`. PNG and JPEG keep the comment; WebP drops it
  (measured, ImageMagick 7), so the sidecar is the record.
- Keep the provenance the model embedded (signed metadata, a watermark): no `-strip`, and check it
  survives each conversion.

## 5. Labelling law

Ownership and permitted use of generated output come from the provider's terms: record them.
Labelling duties depend on where the audience is. When unsure, label: a visible credit costs little.
Record the decision in decisions.md.

**China**, in force since 2025-09-01 (labelling measures and mandatory standard GB 45438-2025):

- The label text contains 人工智能 or AI plus 生成 and/or 合成 (for example "AI生成"). It sits at an
  edge or corner of an image, with text height at least 5% of the image's shortest side.
- Video: on the opening frame for at least 2 s.
- Downloads, copies and exports keep the explicit label.
- The file metadata carries an implicit label, in a field whose name contains `AIGC`.
- Distribution platforms check that metadata and add their own notice.

**EU**, Article 50 of the AI Act applies from 2026-08-02:

- Realistic images of people, places, objects or events that could pass as authentic (deep fakes)
  must be disclosed.
- The Code of Practice label is a capitalised "AI", optionally with "generated" or "modified".
  Place it where nothing overlaps (for example the top-right corner), visible at first exposure and
  still visible after download or resharing.
- The label needs alt text or an ARIA name and legible contrast.
- Machine-readable marking is the model provider's duty; do not remove it.

In a design, reserve the label slot on the artboard (corner, clear background, at the minimum
size) rather than stamping it on later. Label your own comps as generated. AI features inside a
product (chat, agents, generated content in the UI) are specified in
[ai-experience](../disciplines/ai-experience.md).
