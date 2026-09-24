---
name: design-icons
description: Choose, extend or draw icons - select an existing open-source icon family that fits the product, design custom icons that match a family's grid and stroke rules, draw a coherent custom icon set as clean SVG, and design app icons, favicons and adaptive / maskable icons for iOS, Android, HarmonyOS, macOS, Windows and the web. Use when the user needs an icon, an icon set, a logo-like app icon, a favicon package, SVG cleanup, or consistency fixes across mixed icons. 图标、图标集、应用图标、App Icon、favicon、SVG。
metadata:
  version: 0.1.1
  short-description: Icon families, custom SVG icons, app icons
---

# Design Icons

An icon set is a typeface of pictures: its value is consistency. Picking the
right existing family is usually the best design decision; drawing is for what
the family lacks and for the brand's own marks.

Sources and tools: `../design-studio/references/resources/icons.md`. Platform
sizes and packaging (perishable): `references/app-icons-and-favicons.md`.
Licences: `../design-studio/references/licensing.md`.

## 1. Choose Before You Draw

Check what the host already uses; **never mix families** in one product.
Select by:

| Criterion | Question |
| --- | --- |
| Style fit | stroke vs filled vs duotone; geometric vs humanist; corner and terminal style vs the product's type and radii |
| Coverage | does it have the domain concepts needed (devices, finance, medical, dev)? |
| Weights / sizes | multiple stroke weights or optical sizes, if the UI needs 16, 20 and 24 |
| Platform packages | a maintained package for the host stack (React, Vue, Flutter, SwiftUI, font, sprite) and tree-shaking |
| Licence | permissive and attribution-free for product use |
| Maintenance | recent releases, versioned, stable names |

Native apps should prefer the platform symbol system where the platform
provides one; it aligns with system type, weights and accessibility settings.
Match icon weight to text weight and keep icon size in step with adjacent
text (16 px icons with 13-15 px text, 20 with 15-17, 24 standalone).

## 2. Extend a Family

Custom icons must be indistinguishable from the family's own:

1. Read the family's design guide if it has one; otherwise measure three
   existing icons: canvas, live area / padding, stroke width, cap and join,
   corner radius, gap between elements, typical level of detail, whether
   shapes are centred optically or mathematically.
2. Reuse the family's existing primitives (its "document", "user", "arrow",
   "gear" shapes) rather than redrawing them.
3. Draw on the pixel grid; keep coordinates on whole or half units.
4. Compare side by side with neighbours at 16, 24 and 48 px on light and dark.

## 3. Draw a Set

### Grid and keylines

- Canvas 24 x 24 (also common: 16, 20, 32). Live area inset 1-2 px; nothing
  touches the edge.
- Keyline shapes give equal optical weight: circle about 20 px diameter,
  square about 18, tall rectangle about 16 x 20, wide rectangle about 20 x 16.
  A circle and a square of equal size do not look equal; the square is drawn
  smaller.
- One stroke width (2 px at 24 is the common default; 1.5 px reads lighter and
  needs half-pixel alignment). One cap and join style. One corner radius for
  outer corners, a smaller one for inner corners.
- Minimum gap between strokes about one stroke width; details thinner than
  the stroke vanish at small sizes.

### Craft rules

- **Metaphor first**: the most conventional picture for the concept wins;
  novelty costs recognition. Test by showing the icon without its label.
  Prefer objects over abstractions, avoid culture-specific symbols, avoid text
  inside icons.
- **Same viewing angle** (front-on, flat), same level of detail, same
  fill logic across the set.
- **Optical, not mathematical**: nudge play triangles right, let round and
  pointed shapes overshoot, balance visual weight rather than bounding boxes.
- **Simplify as it shrinks**: a 16 px icon is a redraw, not a scale-down.
  Stroke icons scale their stroke with size unless
  `vector-effect: non-scaling-stroke` is set - decide which is intended.
- **Outline / filled pairs** mean unselected / selected; keep silhouettes
  identical between the pair.
- **Name by what it depicts** (`arrow-up-right`, `file-text`), not by what it
  does in one product (`export`), with a consistent modifier order.

### SVG hygiene

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="…"/>
</svg>
```

- `viewBox` always present; colour via `currentColor`; no inline fills on
  stroke icons, no `style` blocks, no ids that can collide, no editor
  metadata, no transforms left on groups, no clipping masks for simple shapes.
- Round coordinates to at most two or three decimals; prefer simple commands
  and primitives (`rect`, `circle`, `line`) where the family does.
- Decorative icons are `aria-hidden`; meaningful standalone icons get an
  accessible name from the control (`aria-label`), not from a `<title>` alone.
- Optimise with SVGO-class tooling configured to **keep `viewBox`** and not to
  merge paths in ways that break stroke joins.
- Deliver as individual SVG files plus whatever the stack consumes (sprite,
  components). Avoid icon fonts for new work.

## 4. App Icons and Favicons

The mark must survive 16-60 px and a crowded home screen.

- **One idea, one focal shape, no words.** A distinct silhouette and a limited
  palette beat detail. Test beside real competitor icons, on light and dark
  wallpapers, and at notification size.
- **Design for the platform's material, do not fake it.** Do not bake rounded
  corners, gloss or platform masks into the artwork: platforms apply their own
  shape and, increasingly, their own layered / translucent / tinted rendering.
  Supply the layers the platform asks for (foreground / background, and a
  monochrome layer where themed icons exist).
- **Safe zones matter**: adaptive and maskable icons are cropped to circles,
  squircles and rounded squares; keep the mark inside the documented safe area
  and let the background bleed to the full canvas.
- **Favicon package**: an SVG icon (may adapt to dark mode), an ICO fallback,
  an Apple touch icon, and web-manifest icons including a maskable one.
  Simplify the mark for 16 px rather than shrinking the full logo.
- Exact canvas sizes, safe zones and file lists change with OS releases: use
  `references/app-icons-and-favicons.md`, and verify against the platform's
  current documentation before final export.

## Workflow

1. Inventory what is needed (names, sizes, states, platforms).
2. Decide: use family / extend family / draw set; record the licence.
3. For drawn work, write the set's rules first (canvas, stroke, radius, gaps,
   style) in a short `README.md` beside the SVGs.
4. Draw; then build `.design/icons/<set>/sheet.html` - every icon at 16, 20,
   24, 32 and 48 px, on light and dark, in a row with family neighbours, and
   one in-context mock (toolbar, tab bar, list).
5. **Render the sheet and look.** Check optical weight, alignment, pixel
   snapping at 16 px, stroke consistency, recognisability without labels.
6. Optimise, name, export, and document usage (sizes, colour, do / don't).

## Anti-Patterns

- Emoji as product icons. Icons from three families on one screen.
- Scaling a 24 px stroke icon to 12 px and keeping the detail.
- Mathematical centring that looks off-centre; unequal visual weight.
- Multicolour gradients in UI icons that must work at 16 px and in one colour.
- A traced bitmap with hundreds of nodes shipped as "SVG".
- App icon made of the full wordmark; a photo; pre-rounded corners; a mark
  that touches the mask edge.
- Shipping an icon pack without checking its licence or attribution terms.

## Deliverables

SVG files (clean, named), the set rules, a rendered preview sheet with
screenshots, platform export packages when requested, usage notes and the
licence record.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Log, don't fix: skills are edited only inside the lab.
