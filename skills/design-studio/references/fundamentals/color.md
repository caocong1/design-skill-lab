---
title: Colour
evidence: digest
sources: [radix-colors-scale, hobday-visual-design-rules, wcag-22, web-baseline-2026, impeccable, apple-hig-liquid-glass]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Colour

A palette becomes a system when every colour has a role and every foreground/background pair that
can occur has a computed contrast. Compute with `$S/color_tools.py` (`S` = `skills/design-studio/scripts`; run `--help` first; it
lists the subcommands your copy has). Never estimate a ratio and never hand-pick a ramp.

Contents: strategy · build the ramps · steps to roles · derived states · contrast · colour vision ·
dark and high-contrast modes · gradients and gamut · conventions.

## Strategy first

Pick the stance before any hue. The `bolder` and `quieter` operators move one rung.

| Rung | Looks like | Default for |
| --- | --- | --- |
| Restrained | neutrals carry everything; one accent marks actions and the one thing that must be seen | Operate and Read surfaces: tools, admin, docs, anything used daily |
| Committed | one saturated colour covers 30-60 % of the surface | a brand with one ownable colour, campaign pages |
| Full palette | three or four named hues, each with a rule for what it marks and where it may appear | consumer, playful and category-coded products |
| Drenched | colour is the ground; type and UI are tints of it | posters, launches, Experience surfaces |

- Light or dark is a decision, not a default. Write one sentence of physical scene (who, where,
  what light: "dispatchers at night in a dim control room") and let it decide.
- Hues come from the subject's world ([anti-slop](anti-slop.md)); status hues are conventions.
- If everything is accented, nothing is.
- The brand colour is not automatically the UI accent. When the brand hue fails contrast or
  collides with danger, use a passing step of its ramp for actions and keep the pure hue for brand
  moments. On Apple platforms the brand lives in the content layer and controls stay monochrome
  except one prominent action ([ios](../platforms/ios.md)).

## Build the ramps

1. Work in OKLCH: L 0-1, C 0 to about 0.37, H in degrees. Equal L steps look equal (HSL cannot
   promise that), and similar L gives similar contrast across hues. The script gamut-maps
   out-of-range values; tokens keep a hex fallback.
2. Generate, do not pick:

   ```sh
   python3 "$S/color_tools.py" scale "<seed>" --name accent            # 11 steps, 50-950
   python3 "$S/color_tools.py" scale "<seed>" --name neutral --neutral  # tinted neutral
   python3 "$S/color_tools.py" scale "<seed>" --name accent --dark      # dark-surface ramp
   ```

   The seed is pinned to its nearest step (`--no-anchor` turns that off); note which step it
   landed on, because that decides the solid role below.
3. Read the table before using it. L must fall step by step and chroma rise to one peak and fall.
   Background steps must stay quiet: the script caps light steps lighter than the seed at C 0.02,
   0.05, 0.085 and 0.12 (50, 100, 200, 300): `scale "#16a34a"` gives 200 = `#b2e9bb`, not the
   neon `#61fd8b` the gamut edge allows there. A ramp from elsewhere (brand book, another tool) with neon
   backgrounds takes them from a mix, `color-mix(in oklab, var(--green-500) 12%, var(--neutral-50))`,
   or from a second ramp seeded at lower chroma (`"oklch(0.63 0.08 149)"`). Mix in `oklab`: `in oklch`
   drags the hue when one side is a grey written with hue 0 ([token-formats](../process/token-formats.md)).
4. Tint neutrals toward the brand hue, warm or cool, never both, and keep them faint (under about
   5 % HSB saturation; `--neutral` does this). Near-black and near-white for large areas, not
   `#000` and `#fff`.
5. Palette colours differ in lightness, not only in hue, so they survive greyscale and colour-vision
   deficiency.

## Steps to roles

A step is a role contract. Whatever generates the ramp, map positions to roles, then let the
contrast matrix confirm or move each one. Role names follow [tokens.css](../../templates/tokens.css).

| Role | 12-step ramp (Radix) | 11-step ramp (script) | Must reach (script ramp, measured) |
| --- | --- | --- | --- |
| app background, subtle background | 1, 2 | 50, 100 | - |
| component background: rest, hover, pressed or selected | 3, 4, 5 | 100, 200, 300 | - |
| border-subtle, border | 6, 7 | 200, 300 | decorative only |
| border-strong, focus ring | 8 | 600 | 3:1 on its background when it is the only boundary: 600 gives 3.3-5.3:1 on 50-200; 500 only 2.2-3.7 |
| solid fill, solid hover | 9, 10 | 600, 700 with a white label; or 300-400 with a 950 label | label 4.5:1: white on 600 4.6-5.7, on 700 6.0-7.1; 950 on 300-400 5.5-8.4 |
| text-muted, text | 11, 12 | 800, 950 | 4.5:1 on every background it sits on: 800 gives 5.9-8.6 on 50-200; 700 only 4.4-6.7 |

Measured with `color_tools.py` (light-step chroma cap included) on 2026-09-27 on six seeds:
`#16a34a`, `#2563eb`, `#ea580c`, `#7c3aed`, `#d97706`, `#e11d48`. Re-measure when the script
changes. What the numbers decide:

- Step 500 is a dead zone for labels: neither white (3.2-4.0:1) nor 950 (3.7-4.6:1) reliably
  reaches 4.5:1. Mid-ramp brand seeds (`#16a34a`, `#ea580c`, `#d97706`) pin exactly there. Keep the
  pure seed for brand moments and large display type; put the action fill on 600, or on 300-400
  with a dark label. The matrix decides, not habit.
- Light solids (yellow, lime, amber, mint, sky) take dark labels.
- Each status (danger, warning, success, info) needs subtle-background, border, solid and text roles
  from its own ramp, and always pairs with an icon or a word.
- Dark mode: the `--dark` ramp runs from dark (50) to light (950), so background, border and text
  steps keep their names and roles (950 on 50-200 gives 7.6-14:1, 800 gives 5.9-10.5, 600 as
  border-strong 3.3-6.2). Solids flip: white on dark 600 is 2.3-2.7:1, so use dark 400 with a white
  label (4.6-5.7) or dark 600 with a dark-50 label (5.5-6.2). Dark 500 is the same dead zone.

## Derived states

- Hover, pressed and subtle variants come from the ramp (one or two steps). When a state must be
  derived, mix toward the text colour, which moves away from the background in both modes:
  `color-mix(in oklab, var(--color-accent), var(--color-text) 10%)`. Mixing with `black` or
  `oklch(from ... calc(l - 0.06) c h)` darkens in both modes and lowers contrast on dark. Mechanics
  and platform exceptions: [token-formats](../process/token-formats.md). No new hex per state.
- Interaction states move toward more contrast than the rest state, never less.
- On a tinted background, tint borders, shadows and muted text toward the same hue. Grey text on a
  coloured background looks dirty and usually fails: use a darker tint of that hue, or light text.

## Contrast: computed, never estimated

```sh
python3 "$S/color_tools.py" contrast "<fg>" "<bg>" ["<fg>" "<bg>" ...]   # WCAG ratio + APCA Lc; exit 1 below --min (4.5)
python3 "$S/color_tools.py" contrast "<border>" "<bg>" --min 3           # UI boundaries, icons, large text
python3 "$S/color_tools.py" matrix --fg "<t1>,<t2>" --bg "<b1>,<b2>" --apca
python3 "$S/color_tools.py" matrix --from tokens.css --mode both          # every role pair, both modes
```

`matrix --from` classifies roles by token name (text, ui, on-X, decor, fill, surface) and applies
4.5 or 3 accordingly; force a role it misreads with `--text`, `--ui` or `--surface` globs. Record
the matrix in DESIGN.md. `$S/lint.mjs` measures contrast on the rendered page, which catches
pairs the tokens never declared: text on images, translucent layers, hover states.

| Pair (WCAG 2.2) | AA minimum |
| --- | --- |
| body text, placeholder text | 4.5:1 |
| large text: 24 px, or 18.67 px bold | 3:1 |
| an input border that is the control's only boundary, icons, focus rings, chart marks (against adjacent colours) | 3:1 |
| body text at AAA | 7:1 |

- Thresholds are not rounded: 4.499:1 fails. Test a gradient at the object's central colour.
  Disabled controls are exempt but must stay findable. Large-text size for CJK:
  [accessibility](accessibility.md).
- Composite a translucent colour over every surface it can land on (the script accepts
  `rgb(r g b / a)` and composites). Measure glass on the rendered backdrop ([materials](materials.md)).
- Report APCA (the `Lc` in the output) beside the WCAG ratio, never instead of it: it is not a
  conformance measure (status in [accessibility](accessibility.md)). ARC Bronze rough guide: body
  text Lc 75 minimum (90 preferred), other content text 60, large text over 36 px 45.
- `contrast-color()` returns only black or white, and its spec promises about 3:1: verify body text
  yourself.
- Which law requires which WCAG version in which market: [accessibility](accessibility.md).

## Colour vision

- Simulate every set whose members must be told apart (status colours, categorical series, map
  legends, selected vs unselected), labelled so the report names them:
  `python3 "$S/color_tools.py" cvd up=#e5484d down=#30a46c warn=#f5a524`. It exits 1 on a
  confusable pair. That example fails: up and down collapse under deuteranopia (OKLab distance
  0.053, equal lightness). Pairs that collapse need a lightness gap, a shape, an icon or a label.
- Page-level check: capture once with `filter: grayscale(1)` on the root. Whatever relied on hue
  alone disappears.
- A red/green status pair always carries an icon or text. Chart palettes (categorical, sequential,
  diverging): [data-dense-ui](../disciplines/data-dense-ui.md).

## Dark and high-contrast modes

Re-map roles; never invert.

- Token mechanics (`light-dark()`, `color-scheme`, theme families): [system](../process/system.md).
- Surfaces are near-black with a little hue, not `#000`, unless the brief is OLED-first. Higher
  surfaces are lighter; elevation and shadows on dark are in [materials](materials.md).
- Keep container-to-background brightness differences small: about 12 % (HSB brightness) in dark
  UIs, 7 % in light ones, so layers feel related.
- Lower the chroma of large coloured areas; saturated colour vibrates on dark.
- Re-pick accent steps: solid fills keep 4.5:1 with their labels, and accent-coloured text uses a
  lighter step than in light mode. Soften pure-white body text to a near-white step.
- Re-run the matrix on the dark mapping. A light-mode pass proves nothing about dark.
- Logos, illustrations, chart images and screenshots need dark variants (a reversed lockup, a
  re-tinted illustration). A white-boxed image on a dark surface is a finding.
- Increased contrast: Apple platforms expect an increased-contrast variant of every custom colour,
  light and dark; on the web, honour `prefers-contrast: more` with the strong steps.
- Forced colours (Windows contrast themes) replace backgrounds, shadows and gradients with system
  colours. Give every control a border (`1px solid transparent` is enough; forced colours paint it)
  so boundaries survive, and never carry state in background colour alone.

## Gradients, transparency, gamut

- Interpolate gradients in OKLab or OKLCH (`linear-gradient(in oklab, ...)`) to avoid grey dead
  zones; name `shorter hue` or `longer hue` for hue sweeps; add fine noise against banding on large
  areas.
- Semi-transparent borders and overlays change with what is beneath them: check each surface.
- Display P3: put accents that exceed sRGB behind `@media (color-gamut: p3)`, with the sRGB value as
  the default. Keep text and data colours in sRGB so they read the same on every screen.
- Gradient text on headings is a dated tell ([anti-slop](anti-slop.md)) and fails contrast at its
  light end.

## Conventions

- Chinese markets: red means up and green means down on stock, fund and trading screens (红涨绿跌),
  the reverse of Western finance UI. Next to price changes, red cannot also be the only signal for
  "error": give errors an icon and words, and give deltas a sign or arrow (the pair fails colour
  vision, above). A product that serves both conventions offers a setting (红涨绿跌 / 绿涨红跌) and
  applies it to charts too. Other markets differ (Hong Kong apps often follow the Western order):
  check the audience before colouring any delta.
- Chinese consumer and commerce UI: red and red-orange mark price, discount and promotion (¥ in
  red), so there red reads as "price" before "error". Festive and gifting work (春节, 红包) uses red
  and gold; a black-and-white scheme reads as mourning (白事) in that context.
- Platform system colours change between releases (iOS blue moved to #0088FF in 2025). Reference the
  platform's semantic colours, never hard-coded values ([platforms](../platforms/README.md)).
- Brand and print: specify sRGB hex and OKLCH; CMYK and spot values are proofed by the printer
  ([graphics](../disciplines/graphics.md)).
