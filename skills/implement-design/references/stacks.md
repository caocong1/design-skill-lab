# Stack Notes

How design decisions land in common stacks, for the implementer. None of this
is needed to *design* for these targets - the mockup and the handoff are the
same for all of them; these notes only make the translation more faithful.
APIs are **perishable**: confirm against the version installed in the host
project before writing code.
Libraries: `../../design-studio/references/resources/code.md`.

## Web (any framework)

- **Tokens**: CSS custom properties on `:root`, modes under
  `[data-theme]` plus `prefers-color-scheme`; set `color-scheme`.
- **Layout**: flex / grid with `gap`; `minmax()` and `auto-fit` for responsive
  grids; container queries for components that live in different widths;
  logical properties (`margin-inline`, `padding-block`) so RTL works;
  `clamp()` for fluid type and space; `dvh` / `svh` for full-height mobile;
  `env(safe-area-inset-*)`; `scrollbar-gutter: stable` to stop layout jumps.
- **Type**: `text-wrap: balance` / `pretty`; `font-variant-numeric`;
  `font-display`; fallback metric overrides; 16 px minimum on mobile inputs.
- **States**: `:focus-visible`, `:disabled`, `[aria-invalid]`,
  `[aria-busy]`, `[data-state]` - style from semantics, not from ad hoc
  classes.
- **Images**: `width` and `height` attributes or `aspect-ratio`; `srcset` /
  `sizes`; AVIF or WebP; `loading="lazy"` below the fold; `alt` always.
- **Verification**: browser screenshot assertions in the project's test
  runner; component stories for states.

## Tailwind CSS

- Put the design tokens in the theme (v4: `@theme` with CSS variables; v3:
  `tailwind.config`), then use semantic utility names (`bg-surface`,
  `text-muted`) rather than raw palette steps in components.
- Ban arbitrary values (`p-[13px]`, `text-[#1a1a1a]`) once tokens exist; they
  are magic numbers in disguise.
- Extract repeated class clusters into components, not `@apply` soup.
- Check the major version: configuration, PostCSS / Vite integration and the
  default palette differ between v3 and v4.

## React / Next.js

- Behaviour from a headless primitive library; styling from tokens.
- Server components render layout; interactive and animated leaves are client
  components.
- shadcn-style copy-in components: retheme through the CSS variables, never
  ship the default look, and keep local edits consistent across components.
- Avoid storing continuously changing values (pointer position, scroll
  progress) in React state; use motion values or CSS.

## Vue / Nuxt

- Same token approach; scoped styles read the global variables.
- Headless: Reka UI or Ark UI; kits: shadcn-vue, Nuxt UI, Naive UI.
- `<Transition>` / `<TransitionGroup>` for enter, leave and list moves, driven
  by the motion tokens.

## Ant Design, Element Plus, Arco, TDesign (enterprise kits)

- **Theme through the official API first**: Ant Design's `ConfigProvider`
  theme (seed tokens, map tokens, component tokens, algorithms for dark and
  compact); Element Plus CSS variables and SCSS variable overrides; Arco and
  TDesign theme variables and their theme tools. Map the project's semantic
  tokens onto these once.
- Do not fight the library with deep selectors and `!important`; if a design
  needs a component the kit cannot express, wrap or build that one component
  on primitives.
- Use the kit's layout, form and table components for their behaviour
  (validation, virtual scroll, fixed columns) and adjust density and spacing
  through tokens.
- Localisation: set the kit's locale provider; check date, number and
  pagination strings.

## Flutter

- `ThemeData` with a full `ColorScheme`, `TextTheme`, component themes
  (`FilledButtonThemeData`, `InputDecorationTheme`…), and a `ThemeExtension`
  for custom roles (status colours, spacing, motion). No literal colours or
  paddings in widgets.
- Adaptive layout with `LayoutBuilder` / `MediaQuery.sizeOf`; window classes as
  named breakpoints; `SafeArea`; `NavigationBar` -> `NavigationRail` ->
  drawer by width.
- Respect `MediaQuery.textScalerOf` (test at large scales) and
  `disableAnimations`.
- Fonts: bundle font files with their licence; declare CJK fallbacks
  (`fontFamilyFallback`) so Chinese glyphs do not fall to an arbitrary system
  face; on HarmonyOS builds use the platform font.
- Platform feel: decide native-per-platform vs one custom system; use
  adaptive constructors only where behaviour should differ.
- Verification: golden tests per component and screen at fixed sizes, themes
  and text scales; integration screenshots on a simulator.
- Icons: a Flutter package of the chosen family or `flutter_svg`; keep one
  family.

## SwiftUI

- Colours in the asset catalogue with light, dark and high-contrast variants;
  semantic names; system materials instead of custom blur.
- Text through text styles (`.body`, `.headline`) or custom fonts scaled with
  `relativeTo:` so Dynamic Type works.
- Use system navigation, sheets, toolbars and tab views to inherit current
  platform behaviour and materials; custom chrome ages badly across OS
  releases.
- SF Symbols with matching weights; `symbolEffect` for state changes.
- Previews for every state, size class, colour scheme and Dynamic Type size;
  snapshot tests where the project has them.

## Jetpack Compose

- `MaterialTheme` with a colour scheme, typography and shapes from the
  tokens; extra roles through `CompositionLocal`.
- `WindowSizeClass` for adaptive layouts; edge-to-edge with inset handling;
  predictive back.
- Sizes in dp, text in sp; test font scale 2.0.
- Screenshot tests with the project's tooling (Paparazzi, Roborazzi or the
  official screenshot testing).

## HarmonyOS (ArkUI)

- Resources with qualifiers (dark, device type); vp and fp units; the
  breakpoint system and adaptive layout capabilities for multi-device.
- HarmonyOS Sans and HarmonyOS Symbol; layered app icon.

## WeChat and Other Mini Programs

- rpx for layout (750 rpx = screen width), px for hairlines; read the capsule
  button rectangle and the status-bar height at runtime for custom navigation.
- CSS variables on `page`; dark mode via the platform's theme mechanism.
- Use the platform component library (WeUI, Vant Weapp, TDesign mini-program)
  for behaviour.
- Package-size limits shape asset decisions: compress images, host large
  media remotely, avoid bundling fonts.
- Preview on real devices of both OS families; simulator rendering differs.

## Electron and Tauri

- System font stack; tokens as CSS variables; follow the OS appearance and
  accent colour.
- Custom title bar: `-webkit-app-region: drag` on the bar, `no-drag` on
  controls; leave room for traffic lights on macOS and the caption buttons on
  Windows; handle full-screen and maximise states.
- Native menus, context menus, shortcuts with platform modifiers; remember
  window bounds; minimum window size.
- Remove web tells: no text selection on chrome, default cursor on
  non-link controls, no rubber-band scroll on fixed regions, no page-style
  navigation flashes.
- Test on each OS at 100%, 125% and 150% display scaling.

## Handoff of Assets

SVG for icons and marks (`currentColor`, clean `viewBox`); raster at 1x / 2x /
3x only where vector is impossible; AVIF or WebP for photos; Lottie or Rive
files with their player version; fonts with their licence file; a single
manifest listing every asset, its source and licence.
