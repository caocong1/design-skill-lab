---
title: App icons and favicons
evidence: digest
sources: [apple-app-icons, harmonyos-design, fluent-2]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# App icons and favicons

One mark, many packages. The mark itself (concept, thumbnail sheet, small, one-colour and crop tests)
is designed in [brand](brand.md); UI icons are in [icons](icons.md). This file turns the mark into what
each platform renders. Artefacts go to `.design/icons/app/`.

Perishable: Apple changes icon rules every June, Android and HarmonyOS with their releases. Rows
marked *checked* were read on the official page on 2026-09-27 but have no lab digest yet; re-check
them before a release export.

## 1. Design for the mask and the material

- **One idea, one focal shape, no words.** Text only when essential (a first-letter mnemonic, not
  "Play" or "New"). Illustration over photos; never a UI screenshot; never Apple hardware.
- **A square, full-bleed master in vector.** The background fills the whole canvas; the mark stays
  centred and inside the safe zone, because masks range from rounded rectangles to circles.
- **Let the system render the material.** Do not bake in the mask, rounded corners, specular
  highlights, drop shadows, bevels, blurs, glows or glass; supply the layers the platform asks for.
- **Shapes survive glass and small sizes**: clearly defined edges with no feathering, few shapes,
  filled and overlapping (semi-transparent overlaps work well), no very thin lines or sharp corners,
  bold line weights so detail survives small sizes. A frontal, flat view beats realistic 3D perspective.
- **Light from above**: lighter top, darker bottom, one gradient direction. Apple: prefer the System
  Light and System Dark gradients to pure white or black. HarmonyOS: no diagonal or dark-top
  gradients, moderate contrast between the gradient's ends, a light edge (光感勾边) on the plate, the
  main shape away from the corners.
- **Design the mono version early**: at least one element white (usually the most recognisable part),
  the rest mapped to greys. Tinted, clear and themed renderings derive from it. Every appearance keeps
  the same core features.
- **Test** at the smallest placements (notification, settings list, a 16 px tab), on busy wallpapers,
  beside real competitor icons, and in every appearance. The crop and mask previews are on
  [brand-test-sheet](../../templates/brand-test-sheet.html); its rounded square is an approximation,
  not Apple's geometry.

## 2. Platforms

| Platform | Deliver | Canvas > mask | Appearances and variants | Basis |
| --- | --- | --- | --- | --- |
| iOS, iPadOS, macOS | a layered `.icon` file from Icon Composer (background + one or more foreground layers, at most four groups) with the SVG layer sources | 1024 x 1024 px square > rounded rectangle | six: default, dark, clear light, clear dark, tinted light, tinted dark; annotate Default, Dark and Mono (clear and tinted derive from Mono); the system generates any you omit | apple-app-icons |
| watchOS | same `.icon` workflow | 1088 x 1088 px (overshoots the rounded rectangle, same grid) > circle | none; no black background (lighten it so it does not merge with the display) | apple-app-icons |
| tvOS | asset-catalog image stack, 2-5 layers, parallax | 800 x 480 px landscape > rounded rectangle | none; keep a safe zone, since focus crops foreground layers more than the background | apple-app-icons |
| visionOS | asset-catalog image stack: background + 1-2 layers, rendered in 3D | 1024 x 1024 px > circle | none; no background shape that reads as a hole or dent | apple-app-icons |
| Android | adaptive icon: foreground + background layers plus a monochrome layer | each layer 108 x 108 dp; the outer 18 dp per side is reserved for masking and effects (parallax, pulsing); logo 48-66 dp inside the central 66 dp safe zone; launchers crop to circle, squircle, rounded square | themed icons use the monochrome layer; from Android 16 QPR 2 the system themes icons of apps that ship none, so ship yours to control the result | *checked*, developer.android.com adaptive icons (updated 2026-09-22) |
| Google Play | store icon | 512 x 512 px, 32-bit PNG, sRGB, at most 1024 KB, full square; Play applies a 30 % corner radius and the shadow | no pre-rounded corners or edge shadows; a full-bleed background unless the logo has a distinct shape | *checked*, Play icon specifications (updated 2026-06-15) |
| HarmonyOS | two layers, foreground + background, PNG | 1024 x 1024 px, square without rounded corners; the system masks per scene | the background layer has no transparent pixels (a rounded crop or transparent padding fails the store check); same spec for phone, foldable, tablet, PC and smart screen; wearables separate | harmonyos-design |
| Windows | ICO for Win32; for packaged apps AppList target sizes 16-256 px in default, light-unplated and dark-unplated forms | design on a 48 x 48 grid: exterior corner radius 2 px, interior 1 px; at most two metaphors | at least half the icon reaches 3:1 on both light and dark themes; without the unplated files the icon sits on a system plate; ICO at least 16, 24, 32, 48 and 256 px | fluent-2; *checked*, Microsoft Learn app-icon construction (2026-07-21) |
| Web | favicon and web-app icons, §4 | square | dark-mode SVG, maskable | *checked*, §4 |
| Mini programs, China app stores | a square avatar per each store's current upload spec | per store | per store | practice: read each store's spec at upload |

## 3. Apple: the Icon Composer procedure

Steps 3-5 run in Icon Composer and Xcode, GUI apps an agent cannot operate: the agent makes the
files in §5 and a person or the implementer finishes from them.

1. Canvas and grid: the App Icon Template on Apple Design Resources (Figma, Sketch, Photoshop and
   Illustrator). Without those tools, draw on the bare 1024 x 1024 px square (1088 for watchOS),
   keep the mark centred and inside the safe zone, and judge masks on the review sheet (§1).
2. Draw the foreground layers flat. Export **SVG** (PNG only for mesh gradients, raster art or SVG
   features Icon Composer cannot read); convert text to outlines; number layer names from back to
   front. Strip blurs, shadows, specular, opacity and translucency settings, and background colours
   and gradients. Export **square, unmasked** layers; never export the mask (pre-masked layers weaken
   the highlight and jag the edges).
3. In Icon Composer (a person, from the settings table in §5): set the background (a solid colour
   or gradient; an imported background must be full-bleed and opaque); organise layers into **at
   most four groups** (the groups are the depth layers); per group choose glass mode Individual or
   Combined, specular (Off, Automatic, Inside, Outside), blur, refraction, translucency and shadow
   (neutral by default; chromatic spills the artwork colour onto the background). Annotate Default,
   Dark and Mono.
4. Preview across OS versions: before 27, Inside and Outside only switch the highlight on and
   refraction has no visible effect.
5. Save the `.icon` file; in Xcode set the target's App Icon name to the file name without extension.
   It replaces the `AppIcon` asset catalogue and Xcode generates look-alikes for older OS releases;
   keep the catalogue only to ship a different legacy icon. Export the flattened marketing icon from
   Icon Composer.

- **macOS 26**: the canvas shape is the mask; free-form icons are gone. An irregular icon loses its
  drop shadow and is scaled down onto a system-supplied background inside the rounded rectangle.
  Redraw to use the full canvas. Take the corner geometry from Apple's template; never invent a
  superellipse formula.
- **Tooling** (unverified which build each link serves): the Icon Composer page says it requires
  macOS Tahoe 26.4 or later; Icon Composer 2 was announced as a beta on 2026-06-08.
- **Legacy asset catalogue**: one 1024 x 1024 image can generate the iOS, iPadOS and watchOS sizes;
  macOS needs each size. Appearances there are Any, Dark and Tinted: tinted as greyscale, dark with a
  transparent background.
- Alternate icons (iOS, iPadOS) each need their own dark, clear and tinted variants and pass App
  Review. Colour spaces: sRGB, Gray Gamma 2.2 or Display P3 (P3 everywhere except visionOS).

## 4. Favicon and web-app icons (*checked*)

The minimum set (Evil Martians, "How to Favicon in 2026"):

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180 x 180, opaque, own padding -->
<link rel="manifest" href="/manifest.webmanifest">
```

```json
{ "icons": [
  { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
  { "src": "/icon-mask.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" },
  { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
] }
```

- `sizes="32x32"` on the ICO works around a Chrome bug that picks the ICO over the SVG. `icon.svg`
  may adapt to dark mode with an embedded `@media (prefers-color-scheme: dark)` style.
- The Apple touch icon is opaque with its own padding and background colour (the article suggests
  about 20 px of padding).
- **Maskable safe zone** (W3C Web Application Manifest, Working Draft 2026-08-13): a centred circle
  with a radius of 40 % of the icon size (409 px across on a 512 canvas); pixels outside may be
  masked away. Let the background bleed to the edges. `purpose` takes `any` (default), `maskable` or
  `monochrome`.
- The 16 px favicon is a simplified redraw of the mark, not the logo shrunk.
- Also design `theme-color`, the installed-app name and the Open Graph image
  ([graphics](graphics.md)).

## 5. What the agent makes, and what it hands on

The agent makes the files below. The `.icon` file, Xcode setup and Android adaptive-icon resources
are steps for a person or the implementer, as is any PNG or ICO the host has no tool for: list them
in the delivery note and never claim them.

| Output | How |
| --- | --- |
| SVG layers | one square, unmasked SVG per layer, prepared as in §3 step 2 (text outlined, numbered back to front, no effects); Android foreground, background and monochrome on a 108-unit viewBox with the §2 safe zone; the 16 px favicon as its own redrawn SVG |
| Icon Composer settings | `icon-composer.md`: the background (colour or gradient stops); one table row per group: its layers, glass mode, specular, blur, refraction, translucency, shadow; per layer the Default, Dark and Mono colours |
| Opaque PNGs (store, touch, web-app, HarmonyOS background) | an HTML artboard with `<meta name="viewport" content="width=device-width, initial-scale=1">` and the SVG at `100vw` x `100vh`, rendered with `node "$S/capture.mjs" icon.html --viewports 1024x1024,512x512,192x192,180x180,32x32 --dpr 1 --out .design/icons/app/png` (`$S`: [render-and-look](../process/render-and-look.md) §1); the 16 px favicon and the maskable icon (§4 safe zone) from their own artboards. Rename the outputs (`icon-default-180x180-light.png` > `apple-touch-icon.png`) |
| Transparent PNGs (HarmonyOS foreground, Windows unplated) | not from `capture.mjs`: it fills transparent areas white. Use a local converter when the host has one (`rsvg-convert -w 1024 -h 1024 fg.svg -o fg.png`); otherwise it is an implementer step |
| ICO | pack the rendered sizes it needs (favicon §4, Windows §2) when the host has ImageMagick (`magick icon-16.png icon-32.png favicon.ico`); otherwise an implementer step |

- Without the viewport meta, widths under 600 are emulated as a phone and the artboard lays out
  wider than the viewport, so the icon renders cropped and off-centre (measured).
- A background layer that is only a colour or a gradient fails the blank-frame check (exit 1,
  measured). Look at it, then render that one artboard again with `--no-qa`.
- `capture.mjs` writes 24-bit RGB PNGs and the Play icon must be 32-bit: convert it when the host
  has ImageMagick (`magick icon-512.png PNG32:play-icon.png`, measured), else hand it on.

## 6. Export checklist

- Master vector source kept, layers named (numbered back to front for Icon Composer).
- Every size generated from vector, never upscaled; small sizes reviewed one by one, strokes
  thickened where needed.
- Every appearance previewed: Apple Default, Dark and Mono as artboards (the system's clear and
  tinted renderings only in Icon Composer); Android monochrome (themed); Windows light and dark
  unplated; the dark-mode SVG favicon.
- Every mask previewed: rounded rectangle, circle (watchOS, visionOS, Android), squircle and rounded
  square (Android), the maskable safe circle. The watch canvas checked separately at 1088 px with the
  content centred.
- HarmonyOS background layer has no transparent pixel and no rounded crop; the Play icon has no
  pre-applied corners or edge shadow.
- Filenames and manifest entries match what the platform expects. After the build, the implementer
  or a person looks at the real icon on a home screen, dock, taskbar and browser tab; until then
  the on-device result is unverified.
- Fonts in the mark are outlined and their licences recorded ([licensing](../fundamentals/licensing.md)).

Deliver the master source, the files of §5 that were actually produced (SVG layers per platform,
the Icon Composer settings table, the PNG and ICO sets), a rendered review sheet (every size,
appearance and mask), the licence record, and a delivery note listing each step left to a person
or the implementer (the `.icon` file and Xcode setup, Android resources, any missing PNG or ICO,
the on-device check). Package layout: [handoff](../process/handoff.md).

## 7. Anti-patterns

- The full wordmark, a photo or a UI screenshot as the app icon.
- Pre-rounded corners, a baked mask, baked glass, highlights or drop shadows; feathered edges.
- A mark touching the mask edge or leaving the safe zone.
- Pure white or pure black backgrounds on Apple; black on watchOS; transparent pixels in the
  HarmonyOS background layer; a free-form macOS icon (it gets shrunk onto a system background).
- An outlined ring or hairlines as the main shape.
- Only the light variant designed, leaving dark, mono and themed renderings to the system's guess.
- A 16 px favicon that is the full logo scaled down.
