---
title: Materials, elevation and shadow
evidence: digest
sources: [apple-hig-liquid-glass, apple-hig-bars, harmonyos-design, fluent-2, material-3-expressive, hobday-visual-design-rules, vercel-web-interface-guidelines, impeccable-slop-rules, web-baseline-2026, wcag-22]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Materials, elevation and shadow

A material is a semantic role, not a blur value. The designer names the role; each platform draws
it (Liquid Glass, 沉浸光感, Mica, a tonal surface), and the web gets a fallback that stays legible
without the effect. Apple publishes no blur, tint or refraction numbers (its one number is the
35 % dimming layer), so every CSS rendering of a platform material is a labelled approximation.

Contents: roles · rules · web fallback · drawing it in a mockup · contrast on glass · elevation
and shadow.

## Roles and their platform realisations

A mockup marks each surface with `data-material="<role>"`, using the six roles the mockup kit draws
([kit.css](../../assets/mockup-kit/kit.css), sourced in kit.json), and names the platform
realisation in `data-material-spec`. DESIGN.md and the handoff use the same pair. Transient and
modal surfaces take the role their platform gives them, as the table says.

| Role | For | iOS, iPadOS, macOS | HarmonyOS | Windows (Fluent 2) | Android (M3) | Web |
| --- | --- | --- | --- | --- | --- | --- |
| `base` | the window or app background | system or grouped background colours, opaque | background colour tokens | Mica, applied once per window (Mica Alt under a tabbed title bar) | `surface` | opaque background token |
| `surface` | cards, groups, panels inside content | standard materials (`ultraThin`, `thin`, `regular`, `thick`) or secondary backgrounds; never glass | opaque cards, or `REGULAR` (the API's level for content areas and cards; the lab keeps it for cards over imagery) | layer fill over Mica, one contiguous area or cards; Solid | `surface-container` tiers (tonal) | opaque surface steps |
| `surface-raised` | opaque surfaces with elevation: raised cards, menus and dialogs where the platform has no glass | not a platform role: use `surface` | the low-compute fallback of any material (background, border, shadow) | Solid dialogs (8 px radius) and cards, stroke plus shadow | menus, dialogs, modal rail (`surface-container`, level 2), floating toolbar (level 3) | opaque fill with an elevation token |
| `glass-regular` | the functional layer: bars, toolbars, sidebars, floating buttons; popovers and menus where the platform draws them in a material | Liquid Glass **regular** (system bars, popovers, menus); a scroll edge effect instead of an opaque backing; sheets are system glass, more opaque at full height | top: `ULTRA_THIN` + gradient blur; bottom floating: `THIN` + gradient colour mask; popovers anywhere: `THICK`; half-modal sheets and dialogs: `ULTRA_THICK` | background (desktop) acrylic for flyouts, context menus, light-dismiss panes; in-app acrylic for panes over content | none: app bars fill with `surface-container` on scroll, toolbars `surface-container` or `primary-container` | the recipe below |
| `glass-clear` | the functional layer over photos or video | Liquid Glass **clear**, with a 35 % dark dim layer over bright content | the same levels; 动态反色 when content hurts legibility | as `glass-regular` | as `glass-regular` | the recipe plus a dim layer |
| `scrim` | dimming behind a modal, or under clear glass | the 35 % dim layer for clear glass; modal dimming comes with the system presentation | the system presentation | Smoke: translucent black, the same in both themes | per component | `::backdrop` |

Platform files own the bars and their metrics: [ios](../platforms/ios.md),
[harmonyos](../platforms/harmonyos.md), [desktop](../platforms/desktop.md),
[android](../platforms/android.md), [web](../platforms/web.md).

## Rules that change the output

Apple's version of rules 1-5 (its exceptions, the conditions for clear glass, colour on glass) is
owned by [ios](../platforms/ios.md), The two layers. What follows holds on every target.

1. **Glass is for the functional layer only**: bars, toolbars, sidebars, floating buttons and
   transient surfaces, never cards, list rows or content backgrounds (HarmonyOS's API gives `REGULAR`
   to content areas and cards; the lab's practice is to use it only on cards over imagery). Frosted cards in content are a tell ([anti-slop](anti-slop.md)).
2. **No glass on glass**: whatever sits on a material uses fills, not a second material. Windows:
   one backdrop material per window, no stacked acrylic, no acrylic panes edge to edge (visible seam).
3. **`glass-regular` by default**; `glass-clear` only over photos or video, with a dim layer, when
   Apple's three conditions hold. HarmonyOS picks the level by scene ([harmonyos](../platforms/harmonyos.md)).
4. **Colour on glass follows the target**: Apple per ios (Colour on glass); Windows: no
   accent-coloured text or links on acrylic; HarmonyOS: system colour resources, or colour
   inversion cannot reach them ([harmonyos](../platforms/harmonyos.md)).
5. **Legible at rest**: controls read in the resting state (launch, top of the content) before
   anything colourful scrolls under them.
6. **The solid state is designed first.** Every platform drops its material: Reduce Transparency
   makes Liquid Glass frostier and Increase Contrast makes it mostly black or white with a border;
   Windows falls back to solid colour when transparency is off, the window is inactive, in high
   contrast, over Remote Desktop and (acrylic) under Battery Saver; HarmonyOS low-compute devices
   get background colour, border and shadow; M3 has no glass at all. The material is an upgrade on
   a solid design that already works.
7. **Users tune it.** iOS 27 adds a transparency slider; HarmonyOS has three strengths. Render the
   default, then check legibility at the most transparent setting you can emulate.
8. **Floating chrome covers content.** Pad the end of the content and set `scroll-padding` so no
   row and no focused element stays under the bar ([portable-mockups](portable-mockups.md),
   [accessibility](accessibility.md)).

## Web fallback

`backdrop-filter` renders in every engine; `prefers-reduced-transparency` does not (status:
[web](../platforms/web.md) §4). So the translucent state must pass contrast on its own, and the
preference query is a courtesy, not the safety net:

```css
.bar { background: var(--color-surface); }                 /* 1. the legible default */
@supports (backdrop-filter: blur(1px)) {
  .bar {                                                    /* 2. the material, where it renders */
    background: color-mix(in oklab, var(--color-surface) 78%, transparent);
    backdrop-filter: blur(16px) saturate(1.3);
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .bar { background: var(--color-surface); backdrop-filter: none;
         border-bottom: 1px solid var(--color-border-strong); }   /* 3. user asked for solid */
}
```

- The 78 %, 16 px and 1.3 are placeholders tuned by eye on the render. They are never handed over as
  a platform spec: the handoff names the role and the platform material.
- A web product must not present its approximation as Liquid Glass. On web targets glass is a
  direction choice with the same rules (functional layer only, legible at rest).
- Forced colours drop backgrounds and filters entirely; boundaries and states survive only through
  borders ([color](color.md), Dark and high-contrast modes).
- A scroll-edge separation (a gradient or hairline that appears once content passes under the bar)
  can replace translucency where the effect is not worth the risk.

## Drawing a material in a mockup

```html
<nav class="tabbar" data-material="glass-regular" data-material-spec="ios: Liquid Glass regular; harmonyos: THIN + gradient colour">
  …
  <span class="material-caption">Liquid Glass (regular), drawn by the platform. Approximation.</span>
</nav>
```

- `data-material` takes a role from the table (the kit styles it); `data-material-spec` names the
  realisation per target, so a popover can say `harmonyos: THICK; windows: desktop acrylic`.
- `<html data-annotate>` makes the kit outline every material and print its role; keep a visible
  caption in review renders either way. Outside the kit, use the recipe above.
- Render at rest and scrolled with busy content under the bar ([portable-mockups](portable-mockups.md)).
  Refraction, specular highlights, light response and Mica's wallpaper tint cannot be judged from
  a still: say the device will differ.

## Text contrast on glass

A token matrix cannot know what scrolls under the glass. Measure on the rendered backdrop:

1. Expose the worst case as the scrolled state (`?state=scrolled`, the kit's
   `data-state="scrolled"`): under the bar, the lightest content, the most saturated brand block and
   a photo, in each theme.
2. Run `node "$S/lint.mjs" "<file>?state=scrolled"` (`S` = `skills/design-studio/scripts`; add `--dark`). It hides the text, samples the
   pixels under each line and fails the line unless 90 % of them meet the minimum.
3. Over photos and video, also take the extremes: capture with the bar's text set to
   `color: transparent`, read the lightest and darkest pixel inside each label's box, and run
   `python3 "$S/color_tools.py" contrast "<text>" "<lightest>" "<text>" "<darkest>"`. Both must
   meet the minima in [color](color.md) (text, and 3:1 for icons).
4. When a pair fails, change the material, not the glyph: regular instead of clear, a thicker
   level, a dim layer, or a scroll-edge separation. Record the case in DESIGN.md.

## Elevation and shadow

- **One depth technique per interface**: shadow, border or tonal surface. A faint edge that crisps a
  shadowed element belongs to the shadow technique (Windows pairs every elevation with a 1 px
  stroke); a hairline border plus a wide soft shadow on every card is a tell ([anti-slop](anti-slop.md)).
- **Three to five levels, each with a job.** A tested ramp (Fluent; token n = blur in px):

  | n | Jobs |
  | --- | --- |
  | 2 | edgeless cards, pressed floating buttons |
  | 4 | cards, grid and list items |
  | 8 | raised cards, app and command bars, tooltips, floating buttons |
  | 16 | callouts, hover cards |
  | 28 | bottom sheets, side navigation |
  | 64 | dialogs, panels |

- **Recipe**: two layers, an ambient shadow with no offset and a key shadow offset downward; the key
  blur is twice its offset (`0 n/2 n`). Fluent's opacities: 14 % ambient and 14 % key up to n = 16;
  from n = 28 an 8 px ambient at 24 % and the key at 20 %. Tint the shadow colour toward the
  background hue, never pure black at high opacity.
- **Tokens**: `light-dark()` takes colours (and images), not shadows: `box-shadow: light-dark(<a>,
  <b>)` is invalid and computes to `none` (measured, Chromium 147). Switch the shadow's colour
  tokens and compose the shadow from them:

  ```css
  :root {
    --shadow-ambient: light-dark(oklch(0.3 0.02 250 / 0.14), oklch(0 0 0 / 0.28));
    --shadow-key:     light-dark(oklch(0.3 0.02 250 / 0.14), oklch(0 0 0 / 0.14));
    --elevation-4:  0 0 2px var(--shadow-ambient), 0 2px 4px var(--shadow-key);
    --elevation-16: 0 0 2px var(--shadow-ambient), 0 8px 16px var(--shadow-key);
  }
  /* the hue 250 and chroma are placeholders: take them from your tinted neutral */
  ```

- **Dark themes raise with lightness.** Closer surfaces are lighter, in light and dark alike, so a
  raised surface in dark is a lighter step, not a shadow; the brightness steps between layers are
  in [color](color.md). Default to no shadows in dark: they vanish or look loud. Where a platform
  keeps them (Fluent), the ambient needs about double its light opacity (28 % vs 14 %) to register.
  Borders on dark: [layout-and-spacing](layout-and-spacing.md), Shape and radius.
- **Platforms draw their own depth.** Windows outlines objects with strokes rather than key shadows
  (window and dialog 128, flyout 32, tooltip 16, card 8, control 2, 1 when pressed). M3 separates by
  tonal surface and fills app bars on scroll without a shadow. Liquid Glass grows thicker, with
  deeper shadows, as it gets larger. HarmonyOS materials apply their shadow by default. Mockups
  show the platform's depth, not the web ramp.
