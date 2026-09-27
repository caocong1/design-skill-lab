---
title: Layout and spacing
evidence: digest
sources: [hobday-visual-design-rules, impeccable, material-3-expressive, harmonyos-design, apple-hig-liquid-glass, wcag-22, fluent-2, wechat-miniprogram-design-guidelines, web-baseline-2026, accessibility-law]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Layout and spacing

Layout is how hierarchy becomes visible. The perception rules hold on every target; the numbers
that change per platform are marked and the platform files own the rest.

Contents: hierarchy and grouping · optical adjustments · spacing scale · grids and widths ·
breakpoints · targets and density · shape and radius · composition · robustness.

## Hierarchy and grouping

1. Name the first, second and third thing the viewer should see. If you cannot, the layout is not
   ready to draw. Build the order with size, weight and contrast first, then position, space and
   accent colour; mute secondary content before making the primary louder.
2. Squint test on the render: blur it or view it at 25 %. What still stands out is the hierarchy.
3. One primary action per view. In a row of actions, order by visual weight (two buttons, then links).
4. Space inside a group is always smaller than space between groups. Then alignment, then a shared
   background, then a border: the lightest separator that works, never two hard divides side by side
   (a border next to a background change next to a rule).
5. Everything aligns with something, by a logic you can name.
6. Measure spacing between points of visible contrast (text edge to band edge), not between
   invisible boxes. `text-box` trimming makes a spacing token measure from cap height to baseline
   ([typography](typography.md) has the support note).

## Optical adjustments

Mathematically centred often looks wrong. Correct by eye on the render, then keep the nudge as a
named token or a commented value so the implementer does not "fix" it back.

- Round and pointed shapes look smaller than a square of the same box: let circles, triangles and
  diamonds overshoot it by about 2-5 % (icon keylines build this in).
- A play triangle centred by its box looks pushed toward the flat side. Its centroid sits a third
  in from that side: shift it toward the point, up to 1/6 of its width.
- Text in a button or badge centred by its line box looks low (descender space below, none above
  the caps): centre on cap height ([typography](typography.md), text-box trim).
- Display type shows its left side-bearing: pull a large headline left by a few hundredths of an
  em so its stems line up with the body text below. Opening quotes and bullets hang outside the
  text edge for the same reason.
- Icons of uneven weight in one row balance by visible mass, not by box size; a heavy glyph gets a
  slightly smaller box.

## Spacing scale

- 4 px base unit; layout on multiples of 8. A non-linear scale: `0 2 4 8 12 16 24 32 48 64 96 128`
  (160 for marketing). Native targets use their platform ramp: HarmonyOS 8 vp (4 vp for small
  items), Fluent 4 px with 2, 6 and 10 for icon alignment ([platforms](../platforms/README.md)).
- Few steps per screen, and neighbouring steps visibly different: 12 vs 14 is a mistake, 12 vs 24
  is a decision. One value used everywhere is a tell ([anti-slop](anti-slop.md)).
- Container padding is at least the gap between its children (outer ≥ inner).
- Text inside a filled or bordered container needs padding of at least 8 px, normally 12-16. The
  lint floor: vertical padding under max(4 px, 0.3 × font size) or horizontal under max(8 px,
  0.5 × font size) is cramped.
- Running text never touches the viewport edge: 16 px minimum gutter on phones.
- Buttons: horizontal padding about twice the vertical.
- A heading sits closer to its own content than to the section above. Section rhythm on marketing
  pages: [marketing-sites](../disciplines/marketing-sites.md).

## Grids and widths

- Columns: 12 on desktop (divides into 1, 2, 3, 4, 6), 8 on tablet, 4 on phone. HarmonyOS uses the
  same 4 / 8 / 12 at < 600 / 600-839 / ≥ 840 vp.
- Gutters 16-32 px. Page margins 16-24 px on phones, 24-64 px and up on desktop.
- Content max width around 1200-1440 px; the text measure is capped separately
  ([typography](typography.md)).
- Product UI is usually a fixed sidebar plus fluid content, not a 12-column page. Align content
  inside panes to one shared inner grid; subgrid lines up card internals across a row.
- Poster, deck and print grids: [graphics](../disciplines/graphics.md).

## Breakpoints

Define behaviour per width class, never per device name: in iOS 27 iPhone apps resize (iPhone
Mirroring, iPhone apps on iPad), HarmonyOS windows split and float, and foldables change class
mid-task.

| Class (M3 names) | Width (dp or CSS px) | Typical behaviour |
| --- | --- | --- |
| Compact | < 600 | one pane; navigation bar or modal rail; sheets instead of popovers |
| Medium | 600-839 | one pane recommended, two possible; navigation bar with horizontal items, or a rail |
| Expanded | 840-1199 | list and detail side by side; standard rail or sidebar |
| Large | 1200-1599 | persistent sidebar; two panes |
| Extra-large | ≥ 1600 | up to three panes; cap line length and content width; add panes, do not stretch |

- HarmonyOS breaks on width and on aspect ratio (a tall narrow window and a wide short one differ).
- On the web prefer intrinsic layout (flex, grid with `minmax()` and `auto-fit`, `clamp()`), and use
  size container queries as the responsive unit for components; page breakpoints only for the
  frame. Re-compose at each class: reorder, collapse, change the navigation form.
- Check every class at the capture sizes in [render-and-look](../process/render-and-look.md), plus
  320 CSS px for reflow (no two-dimensional scrolling; [accessibility](accessibility.md)).
- Full-height mobile layouts use dynamic viewport units (`100dvh`), never `100vh`, and respect
  `env(safe-area-inset-*)`.

## Targets and density

| Context | Minimum target |
| --- | --- |
| iOS, iPadOS | 44 × 44 pt (visionOS 60 × 60) |
| Android | 48 × 48 dp |
| HarmonyOS phone, tablet, foldable | 48 × 48 vp recommended, 40 × 40 vp required (store review); watch 46 / 40; PC 5 mm with a mouse, 7 mm on touch |
| Web, WCAG 2.2 AA | 24 × 24 CSS px, or a smaller target whose 24 px circle clears every neighbour; 44 × 44 is the AAA size and the touch default |
| Mini-programs | about 7-9 mm physical; in 适老化 mode add 12 pt of hit area around icons and links, 40 × 40 pt minimum |
| Desktop pointer UI | 24-32 px controls; row hit areas run the full width |
| China apps, MIIT 适老化 (elder mode) | main components 60 × 60 dp/pt, other pages 44 × 44; a standalone elder app's home screen 48 × 48 |

- The visible shape may be smaller than the hit area; extend the hit area with padding or an
  overlay, not with a bigger drawing.
- Density is a product decision: compact (32-36 px rows and controls) for expert, repeated use;
  default (40-48); comfortable (52-56) for occasional and touch use. Offer a setting when both
  audiences exist. iOS 26 lists, tables and forms are taller and more padded than before; do not
  carry pre-2025 iOS row heights into a new mockup.

## Shape and radius

- One radius logic per product. Radius rises with the element's layer (tag < control < card <
  sheet or dialog), and siblings share one radius.
- Three shape types: fixed (a constant radius), capsule (radius = half the height), concentric
  (radius = parent radius − padding). Concentric is the rule for anything nested:
  a 16 px card with 8 px padding gives its inner element 8 px. When the padding is at least the
  outer radius, clamp to your smallest radius token instead of going sharp.
- Near a phone's screen edge a capsule with extra margin sits better than a concentric shape; on
  iPad and Mac, concentric shapes follow the window corner.
- Full radius is for pills, tags and buttons that the direction chose to be capsules. Small cards
  rounded to 24 px and more turn into soft blobs. A thick accent border fights a large radius:
  choose one. Squircle corners (`corner-shape`) are a Chromium-only enhancement.
- A container's border contrasts with both the container and what is behind it; on a dark card
  over a darker page that border is lighter than both.
- Depth (shadows, elevation, glass, tonal surfaces): [materials](materials.md).

## Composition

- Scale contrast creates energy; many medium-sized things create mush.
- Balanced asymmetry is livelier than centred symmetry; centre only for formality and short,
  isolated statements. Generous margins read as confidence.
- Rhythm: repeat an interval, then break it once, on purpose. Long pages need beats: vary contained
  and full-bleed, split and centred, dense and sparse.
- Simple on complex or complex on simple, never complex on complex: text over a busy image needs a
  scrim or a plain plate.
- Bars that float over scrolling content (iOS 26, HarmonyOS 6.1, M3 Expressive toolbars) change the
  bottom of every screen: [portable-mockups](portable-mockups.md) says how to draw them.

## Robustness

Design with the worst content: the longest name, a missing image, zero items, ten thousand items, a
nine-digit number, mixed scripts, 200 % zoom. No fixed heights on text containers; let text wrap;
truncate deliberately and give a way to read the rest; reserve space for images and late content
(`aspect-ratio`, skeletons at final size) so nothing shifts. This is the `harden` operator's
checklist for layout.
