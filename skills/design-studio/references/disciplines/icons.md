---
title: UI icons
evidence: digest
sources: [lucide-icon-design-principles, material-3-expressive, apple-hig-bars, harmonyos-design, fluent-2, openai-apps-sdk-ui, wcag-22]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# UI icons

An icon set is a typeface of pictures: its value is consistency. Choosing the right family is usually
the best icon decision; drawing is for what the family lacks and for the product's own concepts.
App icons, favicons and platform icon packages: [app-icons](app-icons.md). Licences:
[licensing](../fundamentals/licensing.md). Artefacts go to `.design/icons/<set>/`.

## 1. Choose one family

Check the host first (truth-files step 1). One family per product; never mix families on a screen.

| Target | Default | What it gives |
| --- | --- | --- |
| iOS, iPadOS, macOS | SF Symbols | weights and scales that follow the text; tab bars prefer filled symbols; standard symbols for common actions (`checkmark`, `xmark`, `ellipsis`, `square.and.arrow.up`, `plus`, `magnifyingglass`, `trash`); toolbar symbols carry no borders or outlined circles |
| Android | Material Symbols (variable font: outlined, rounded, sharp; axes FILL, wght, GRAD, opsz) | Compose Material 3 no longer recommends the old `material-icons` artifacts |
| HarmonyOS | HarmonyOS Symbol | 24 vp, icon size equals font size, symbol effects (the selected tab bounces) |
| Windows | Segoe Fluent Icons; Fluent System Icons (Regular for wayfinding, Filled for selection) | crisp at 16, 20, 24, 32, 40, 48, 64; the Segoe font may be used in designs for other platforms but not shipped there |
| chat hosts (Apps SDK widgets) | system icons, or custom icons that are monochrome and outlined | [embedded-hosts](../platforms/embedded-hosts.md) |
| web and custom brands | an open-source family chosen by the table below | - |

Choose an open family on evidence, not by name recall:

| Criterion | Check |
| --- | --- |
| Coverage | list the ten hardest concepts of the domain (devices, finance, medical, dev tools, Chinese-specific actions such as 扫一扫 or 红包) and find all ten before committing |
| Style fit | stroke, filled or duotone; geometric or humanist; corner and terminal style against the product's type and radii |
| Weights and sizes | a stroke or weight axis, or optical sizes, if the UI uses 16, 20 and 24 |
| Packages | a maintained package for the host stack, tree-shakable; raw SVGs available |
| Licence | MIT, ISC or Apache-2.0 for product use; CC BY needs visible attribution; "free for personal use" does not ship |
| Maintenance | recent releases, versioned, stable names |

Candidates come from the catalogue: `python3 "$S/catalog.py" find --section icons:families --free` (`S` = `skills/design-studio/scripts`),
and `catalog.py recipes icons` lists raw-SVG endpoints an agent can fetch. Render the finalists on the
[icon sheet](../../templates/icon-sheet.html) with the product's real concepts before choosing.

**Sizing with text**: 16 px icons with 13-15 px text, 20 with 15-17, 24 standalone. Inline icons sized
in `em` follow text scaling and large-text settings. Stroke weight tracks the text weight: about
1.5 px at 24 beside regular text, 2 px beside medium or larger. Optical alignment and contrast beside
text: [typography](../fundamentals/typography.md).

## 2. Extend a family

A custom icon must be indistinguishable from the family's own.

1. Read the family's spec if it has one. Otherwise measure three of its icons: canvas, live area,
   stroke width, caps and joins, corner radii, minimum gap, level of detail, optical centring.
2. Reuse its primitives literally (its document, person, arrow, gear shapes); copy the path data,
   do not redraw it.
3. Draw on its grid, then compare beside neighbours on the sheet with the blur test (§4).

Write the rules down as a short `README.md` beside the SVGs, split into **must** (canvas, stroke,
caps, gaps) and **should** (corner radii, curve style, detail) the way Lucide's specification does.
A should-rule may flex to make an icon clearer; a must-rule breaks only by a recorded exception.

## 3. Draw a set

| Rule | Lucide (24 px canvas) | HarmonyOS Symbol (24 vp) | Your set |
| --- | --- | --- | --- |
| Canvas and live area | 24 x 24; strokes at least 1 px from the edge | 24 x 24, live area 22 x 22 | |
| Stroke | 2 px, centred on the path | 1.5 vp (1.3 on complex shapes) | one width |
| Caps and joins | round joins; round caps on open paths | round caps | one style |
| Corners | 90° corners: 2 px radius on elements 8 px or larger, 1 px below; diagonals meeting at 90°: about 2.41 px (1 + √2); sharp where more than two lines meet | outer 3 vp, inner 1.5 vp | outer and inner radius |
| Gaps | at least 2 px between distinct elements; a 2 px circle fits every inner gap | 1.3 vp | at least one stroke width |
| Curves | arcs and quadratic curves; cubic only where needed, control points aligned | - | |
| Diagonals | - | slashes at 45°, top-left to bottom-right | one direction |

- **Keylines for equal optical weight**: at 24, a circle about 20 across, a square about 18, a
  portrait rectangle 16 x 20, a landscape one 20 x 16. A circle and a square of the same size do not
  look the same size.
- **Metaphor first**: the most conventional picture for the concept wins; novelty costs recognition.
  Objects over abstractions; no text inside icons; no culture-bound symbols (mailbox, piggy bank)
  where the audience does not share them.
- **Same angle, same detail, same fill logic** across the set. Outline and filled pairs mean
  unselected and selected, with identical silhouettes.
- **Optical, not mathematical**: nudge a play triangle right, let round and pointed shapes overshoot,
  balance by eye against the family's circle and square.
- **16 px is a redraw**, not a scale-down: fewer details, the same stroke. Decide whether strokes
  scale with the icon or stay fixed (`vector-effect: non-scaling-stroke`).
- **Pixel grid**: 2 px strokes on whole coordinates, 1 px strokes on half coordinates (x.5), arc
  centres on whole pixels, unless that breaks the shape.
- **Names say what it depicts** (`arrow-up-right`, `file-text`), not what it does in one product
  (`export`), with a fixed modifier order.

### Writing path data you can trust

Models write unreliable Bézier strings. Build icons the way a careful drafter would:

1. Plan in a comment first: each shape with its coordinates on the grid ("body: rect 5,3 14x18 r2;
   fold: polyline 14,3 14,8 19,8").
2. Compose from `rect`, `circle`, `line`, `polyline`, and `path` with only M, L, H, V, A and Q
   commands, on whole or half coordinates.
3. Render at 16, 20, 24 and magnified with the pixel grid (the sheet does both), fix, render again.
4. Never ship a traced bitmap or a path with hundreds of nodes.

## 4. SVG hygiene

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="5" y="3" width="14" height="18" rx="2"/>
  <polyline points="14 3 14 8 19 8"/>
</svg>
```

- `viewBox` always; colour only through `currentColor` (`fill="currentColor"` for filled icons).
- Nothing left over: no `transform` on groups (bake it into the coordinates), no `fill="#000"` on
  stroke paths, no `style`, `class` or `id`, no editor metadata, no clip or mask for simple shapes, at
  most two decimals.
- Decorative icons are `aria-hidden="true"`; an icon-only control takes its accessible name from the
  control (`aria-label`), not from a `<title>` inside the SVG. Icons that identify a control meet 3:1
  against adjacent colours (WCAG 1.4.11).
- Optimise with SVGO and confirm the config keeps `viewBox` (older presets removed it) and does not
  merge paths in ways that break stroke joins.
- A quick audit of a folder: `grep -L viewBox *.svg` (missing viewBox) and
  `grep -lE 'transform=|style=|class=| id=|fill="#|stroke="#' *.svg` (leftovers).
- Deliver individual SVG files plus what the stack consumes (sprite, components). No icon fonts for
  new work, except the platform's own symbol fonts.

## 5. Review on the icon sheet

Copy [icon-sheet](../../templates/icon-sheet.html) to `.design/icons/<set>/sheet.html` and paste the
set in. It shows every icon at 16, 20 and 24 on light and dark, the real 16 px rasterisation
magnified, the family's circle and square as weight references, a blur toggle, a hide-labels toggle
and an in-context row. Render it (render-and-look) and check, in this order:

1. **Recognition**: hide the labels and name every icon. Any you cannot name gets a new metaphor.
2. **Weight**: turn on blur; no icon reads clearly darker or lighter than the circle and square
   references. Stroke count and proximity make an icon heavier at the same stroke width.
3. **Density**: under blur, areas that go solid dark hold too much detail; remove it.
4. **Balance**: each icon looks centred beside the references, not just by bounding box.
5. **Gaps and snapping**: in the magnified 16 px view, no gap closes up and no 1 px line smears
   across two pixels.
6. **Consistency**: one stroke width, one cap and join, one corner logic across the whole sheet.
7. **Context and dark**: the in-context row and the dark panel read as clearly as the light one.

Deliver the clean, named SVGs, the set's `README.md` rules, the rendered sheet, the packages the stack
consumes, and the licence record.

Anti-patterns: emoji as product icons; icons from two families on one screen; a 24 px icon scaled to
12 with its detail; multicolour gradients in UI icons that must work at 16 px in one colour; an icon
pack shipped without checking its licence.
