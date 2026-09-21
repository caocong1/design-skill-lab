# Layout and Spacing

Layout is how hierarchy becomes visible. The rules here are about perception;
they hold on every platform. Evidence: `source-map.md`.

## Hierarchy

1. Name the first, second and third thing the viewer should see. If you
   cannot, the layout is not ready to be drawn.
2. Create the order with, in descending strength: size, weight and colour
   contrast, position (top-left in left-to-right reading, centre for isolated
   moments), whitespace around the element, then colour accent.
3. **Squint test**: blur the screenshot or look at it at 25%. What still
   stands out is the real hierarchy.
4. De-emphasise to emphasise: mute secondary content before making primary
   content louder.
5. One primary action per view. Order rows of actions by visual weight,
   heaviest at the outer edge.

## Grouping

- Proximity first: related things are closer to each other than to anything
  else. **Space inside a group < space between groups**, always.
- Then alignment, then a shared background, then a border. Use the lightest
  separator that works. Never stack two hard divides (a border beside a
  background change beside a rule).
- Everything aligns with something. Optical alignment beats mathematical
  alignment: nudge icons, play triangles, text with overhangs.
- Measure spacing between points of visible contrast (text edge to text
  edge), not between invisible bounding boxes.

## Spacing Scale

- 4 px base unit; layout on multiples of 8. A non-linear scale:
  `0 2 4 8 12 16 24 32 48 64 96 128 (160)`.
- Use few steps per screen. Neighbouring steps should be visibly different;
  12 vs 14 is a mistake, 12 vs 24 is a decision.
- Container padding is at least as large as the gaps between its children
  (outer >= inner). Text inside a bordered or filled container needs at least
  8 px, normally 12-16 px; body text never touches the viewport edge (16 px
  minimum gutter).
- Buttons: horizontal padding about twice the vertical.
- Section spacing on marketing pages: roughly 96-160 px desktop, 56-96 px
  mobile; heading-to-content spacing is much smaller than section-to-section.

## Grids and Widths

- 12 columns on desktop (divides into 2, 3, 4, 6), 8 on tablet, 4 on phone.
  Gutters 16-32 px; page margins 16-24 px on phones, 24-64 px and up on
  desktop.
- Content max-width around 1200-1440 px; text measure capped separately
  (`typography.md`).
- Product UI usually uses a fixed sidebar plus fluid content rather than a
  12-column page grid; align content inside panes to a shared inner grid.
- Graphics and print: manuscript, column, modular or hierarchical grids;
  margins are part of the composition.

## Window Classes

Define behaviour per class, not per device name:

| Class | Width | Typical behaviour |
| --- | --- | --- |
| Compact | < 600 | one column; bottom navigation or top app bar; sheets instead of popovers |
| Medium | 600-839 | two columns possible; navigation rail |
| Expanded | 840-1199 | list-detail side by side; sidebar or rail |
| Large | 1200-1599 | persistent sidebar; multi-pane |
| Extra-large | >= 1600 | cap line length and content width; add panes, not stretch |

On the web prefer intrinsic layout (flex, grid, `minmax`, `auto-fit`,
container queries, `clamp()`) over many breakpoints. Re-compose at each class:
reorder, collapse, change the navigation form. Test at 390, 768, 1280, 1920
and ultra-wide. Respect safe-area insets and use dynamic viewport units for
full-height mobile layouts.

## Targets and Density

| Context | Minimum target |
| --- | --- |
| iOS / iPadOS | 44 x 44 pt |
| Android | 48 x 48 dp |
| Web (WCAG 2.2 AA floor) | 24 x 24 CSS px including spacing; 44 px preferred on touch |
| Mini-programs | about 7-9 mm physical |
| Desktop pointer UI | 24-32 px controls are acceptable; keep row hit areas full-width |

The visible shape may be smaller than the hit area; extend the hit area.

Density is a product decision: compact (32-36 px rows and controls) for
expert, repeated use; default (40-48); comfortable (52-56) for occasional and
touch use. Offer a setting when both audiences exist.

## Shape, Border, Elevation

- One radius logic: small for controls, medium for cards (about 8-16 px;
  small cards rounded to 24 px and more turn into soft blobs), large for
  overlays, full for pills and tags only. A thick accent border fights a large
  radius: choose one. **Nested radius = outer radius - the gap between them**, so
  curves stay concentric.
- A container's border must contrast with both the container and what is
  behind it.
- One depth technique per interface (shadow, or border, or surface tint).
  Shadows: at least two layers (tight ambient + soft direct), blur roughly
  twice the offset, tinted toward the background hue, never pure black at
  high opacity. Closer elements are lighter. Little or no shadow in dark
  themes - use lighter surfaces and borders.
- Put simple on complex or complex on simple, never complex on complex
  (text over a busy image needs a scrim or a plain plate).

## Composition Beyond the Grid

- Contrast of scale creates energy; many medium-sized things create mush.
- Whitespace is an active shape; generous margins read as confidence.
- Asymmetry with balance is livelier than centred symmetry; centre for
  formality and for short isolated statements.
- Rhythm: repeat intervals and break them once, on purpose.
- Vary section patterns on long pages (contained vs full-bleed, split vs
  centred, dense vs sparse) so the page has beats.

## Robustness

Design with the worst content: the longest name, the missing image, zero
items, ten thousand items, a number with nine digits, mixed scripts, 200%
zoom. Avoid fixed heights on text containers; let text wrap; truncate
deliberately with a way to read the rest; reserve space for images and
late-loading content so nothing shifts.
