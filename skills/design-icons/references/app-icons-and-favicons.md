# App Icons and Favicons: Packaging

**Perishable.** Canvas sizes, layer rules and file lists change with OS
releases; several platforms moved to layered, system-rendered icons recently.
Treat this file as orientation, then verify against the official page
(`../../design-studio/references/resources/icons.md` > Icon design guidance;
App icons and favicons) before export. Last reviewed: 2026-09.

## Principles That Do Not Change

- Draw a square master as vector; keep the mark well inside the safe zone and
  let the background fill the whole canvas.
- Do not bake in platform corner shapes, gloss, shadows or glass: the system
  applies its mask and material.
- Supply the layers the platform asks for instead of a flattened image.
- Provide the variants the platform can show: light, dark, tinted or
  monochrome.
- Test at the smallest rendered size (notification, settings list, 16 px tab)
  and against busy wallpapers.

## Platforms

| Platform | What to deliver | Notes |
| --- | --- | --- |
| iOS, iPadOS, macOS, watchOS (current) | a layered icon built in Apple's Icon Composer from flat SVG / PNG layers; a 1024 x 1024 master | the system renders the material and the default, dark, clear and tinted appearances; older Xcode asset catalogues take a 1024 px opaque PNG with optional dark and tinted variants; no transparency in the legacy master; no pre-rounded corners |
| Android | adaptive icon: foreground + background layers on a 108 x 108 dp canvas; mark inside the central 66 dp safe zone (72 dp is the masked viewport); a monochrome layer for themed icons; a 512 x 512 Play Store icon | launchers crop to circle, squircle, rounded square; the outer 18 dp per side is for parallax and masking |
| HarmonyOS | layered icon (foreground + background) at the size the current guideline specifies | verify layer sizes and safe area in the official resource pack |
| Windows | multi-size assets from 16 to 256 px (plus scale factors) or an `.ico` containing 16, 24, 32, 48, 256; plated and unplated variants for some surfaces | simplify at 16 and 24 px; test on light and dark taskbars |
| Web | see the favicon set below | |
| Mini programs and app stores in China | a square avatar per store requirement; store listings each have their own sizes and corner treatment | check each store's current upload spec |

## Favicon Set (modern minimum)

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180 x 180, opaque, own padding -->
<link rel="manifest" href="/site.webmanifest">
```

```json
{ "icons": [
  { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
  { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
  { "src": "/icon-mask.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
] }
```

- `icon.svg` can adapt to dark mode with an embedded
  `@media (prefers-color-scheme: dark)` style.
- The maskable icon keeps the mark inside the central circle of 80% of the
  canvas width (a 40% radius safe zone) with the background bleeding to the
  edges.
- The 16 px favicon is a simplified redraw of the mark, not the full logo.
- Also design: `theme-color`, the Open Graph image, and the pinned or
  installed-app name.

## Export Checklist

- Master vector source kept with named layers.
- Every required size generated from vector, not upscaled.
- Small sizes reviewed individually for legibility; strokes thickened where
  needed.
- Light, dark and tinted / monochrome previews checked.
- Masks previewed (circle, squircle, rounded square) with a maskable preview
  tool.
- Filenames and manifest entries match the platform's expectations; build or
  install once to confirm the icon actually appears.
