---
title: Stack notes for the implementer
evidence: digest
sources: [web-baseline-2026, apple-hig-liquid-glass, apple-hig-bars, material-3-expressive, material-motion-tokens, harmonyos-design, wechat-miniprogram-design-guidelines, fluent-2, dtcg-2025-10, mcp-apps, openai-apps-sdk-ui, vercel-web-interface-guidelines, emil-kowalski-animation, anthropic-design-skills, cjk-font-licensing, jlreq]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Stack notes

How a finished design lands in each stack. Versions, APIs and support data are perishable, dated
2026-09-27: confirm them against the host's installed versions (lockfile first). Kit and tooling picks
without a source id are practice. Design side: [platforms](../../design-studio/references/platforms/README.md),
[materials](../../design-studio/references/fundamentals/materials.md); layout and bars per toolkit:
[portable-mockups](../../design-studio/references/fundamentals/portable-mockups.md). Libraries: `design-studio/scripts/catalog.py find <stack> --domain code`.

## Every stack: where things land

| Stack | Tokens live in | Modes | Units | Screenshot and regression tooling |
| --- | --- | --- | --- | --- |
| Web | CSS custom properties on `:root` | `[data-theme]` + `prefers-color-scheme`, `color-scheme` | px, rem | Playwright `toHaveScreenshot`; Storybook + a snapshot service |
| Tailwind v4 | `@theme` in CSS | `@custom-variant dark` | as web | as web |
| Flutter | `ThemeData` + `ThemeExtension` | `theme`, `darkTheme`, `highContrastTheme` | logical px | `matchesGoldenFile` goldens |
| SwiftUI / UIKit | asset-catalogue colours, text styles | Any / Dark + High Contrast variants | pt | Xcode previews, `xcrun simctl io booted screenshot`, snapshot tests if present |
| Compose | `MaterialTheme` (colour, type, shapes, motion) + `CompositionLocal` | light / dark schemes, dynamic colour optional | dp, sp | Compose Preview Screenshot Testing, Paparazzi, Roborazzi |
| ArkUI | `resources/base/element/*.json` + qualifier folders, `$r()` | `dark/` qualifier | vp, fp | DevEco previewer per breakpoint, device screenshots |
| Mini-program | CSS variables on `page` | `"darkmode": true` + `theme.json` | rpx (750 = width), px hairlines | real devices; `miniprogram-automator` screenshots |
| WinUI | `ThemeDictionaries` resources | Light / Dark / HighContrast | epx | the app's UI tests; no standard snapshot tool |
| Electron / Tauri | CSS custom properties | follow the OS appearance | px | Playwright against the web layer |

## System components by stack

Parts the spec marks SYSTEM. Bars, tab bars and navigation containers are in portable-mockups;
web overlays and form controls are in the web primitives table below.

| The spec says | SwiftUI | Compose | Flutter | ArkUI | WeChat mini-program |
| --- | --- | --- | --- | --- | --- |
| sheet | `.sheet` + `.presentationDetents` | `ModalBottomSheet` | `showModalBottomSheet` | `bindSheet` | kit popup (`van-popup`, `t-popup`); `wx.showActionSheet` for a plain list |
| dialog, alert | `.alert`, `.confirmationDialog` | `AlertDialog` | `showDialog` + `AlertDialog.adaptive` | `promptAction.showDialog`, `@CustomDialog` | `wx.showModal` |
| toast, snackbar | none on iOS: build the overlay the design draws | `SnackbarHost` + `Snackbar` | `ScaffoldMessenger.showSnackBar` | `promptAction.showToast` | `wx.showToast` (1.5 s; never for errors) |
| menu, select | `Menu`, `Picker` | `DropdownMenu`, `ExposedDropdownMenuBox` | `MenuAnchor`, `DropdownMenu` | `bindMenu`, `Select` | `picker` |
| switch | `Toggle` | `Switch` | `Switch.adaptive` | `Toggle({ type: ToggleType.Switch })` | `switch` |
| segmented control | `Picker` + `.pickerStyle(.segmented)` | connected `ButtonGroup` (1.5 alpha); M3 Expressive retires `SegmentedButton` | `SegmentedButton`, `CupertinoSlidingSegmentedControl` | `SegmentButton` | kit tabs (`van-tabs`, `t-tabs`) |
| search | `.searchable`; `Tab(role: .search)` | `SearchBar`, `DockedSearchBar` | `SearchAnchor` | `Search` | kit search (`van-search`, `t-search`) |
| date, time | `DatePicker` | `DatePicker`, `TimePicker` | `showDatePicker`, `CupertinoDatePicker` | `DatePicker`, `TimePicker` | `picker mode="date"` / `"time"` |

## Token files (DTCG 2025.10)

- Sources are `*.tokens.json` plus a `*.resolver.json` whose modifiers carry theme, contrast and
  density. Which tool reads what, and how each builds the permutations: design-studio's
  [token-formats](../../design-studio/references/process/token-formats.md) section 6.
- DTCG has no spring type. Springs arrive in `$extensions` or as paired numbers; map them to the
  platform's spring API, and to a curve only where the platform has no springs.
- A DTCG `px` means pt on iOS, dp on Android, vp on HarmonyOS; `rem` becomes 16 sp where there is no rem.
  Generated files are build output: edit the source, regenerate. Design side: [system](../../design-studio/references/process/system.md).

## Web

### Native primitives to prefer

Status for each row, dated, and what "Baseline YYYY" means for your users: design-studio's
[web](../../design-studio/references/platforms/web.md) section 4. Read the host's browser matrix
(browserslist, in-app WebViews) and gate recent rows with `@supports` or a feature check.

| Need | Use | Fallback and traps |
| --- | --- | --- |
| Menu, toggletip, picker, non-modal panel | `popover` (`auto` light-dismiss or `manual`) | top layer, Esc and focus return come free. `popover="hint"` and hover interest invokers are limited: hover tooltips still need JS and must meet WCAG 1.4.13 |
| A button opens or closes a dialog or popover | `command` + `commandfor` | a click handler for older engines |
| Modal | `<dialog>` + `showModal()` | `closedby` is limited (no Safari): keep a close button and Esc |
| Tooltip, menu, coach-mark placement | anchor positioning + `position-try-fallbacks` | spec and test the fallback order; `position-visibility: anchor-valid / anchor-visible` is Safari 27 only; animating anchored elements is enhancement; older engines get a JS positioner behind `@supports (anchor-name: --a)` |
| State and shared-element transitions | same-document view transitions | skip under reduced motion; cross-document (MPA) and element-scoped transitions are limited: enhancement only |
| Enter from `display: none` | `@starting-style` + `transition-behavior: allow-discrete` | exits out of `display: none` and the `overlay` property are limited: exits degrade to an instant hide |
| Auto-growing textarea, chat composer | `field-sizing: content` + `max-height` | JS autosize for older engines |
| Light and dark tokens | `color-scheme` + `light-dark()` | - |
| Hover, pressed, subtle derivatives | relative colour `oklch(from var(--c) ...)`, `color-mix()` | OKLCH is safe everywhere |
| Text colour on a fill | `contrast-color()` | black or white only, and the spec promises about 3:1: compute 4.5:1 body pairs yourself |
| Component-scoped styles | `@scope` | if the host already scopes (CSS modules, Vue `scoped`), keep that |
| A component responds to its container | size container queries; style queries `@container style(--x: y)` | scroll-state queries are Chrome only |
| Staggers and distributions | `sibling-index()`, `sibling-count()` | static delays, or none |
| Optical centring in buttons and badges | `text-box: trim-both cap alphabetic` | edge values lack Firefox data: check the render |
| A designed native select | `appearance: base-select`, `::picker(select)` | the classic control must still look right; always set `background-color` and `color` on `<select>` (Windows dark mode) |
| Animated accordion | `::details-content`, exclusive `<details name>` | - |

Keep out of production: `if()`, `@function`, `interpolate-size` / `calc-size()`, `corner-shape`,
scroll-state queries, `::scroll-marker` carousels, masonry, and scroll-driven animation as load-bearing
motion. Design-side capability table: [web](../../design-studio/references/platforms/web.md).

### Implementation rules

- `color-scheme` on `html` (scrollbars, form controls); `theme-color` matches the page background.
  Layout traps: `min-width: 0` on flex children that truncate; `scrollbar-gutter: stable`;
  `env(safe-area-inset-*)` is 0 without `viewport-fit=cover`; `100dvh` for app shells, `100svh` for heroes.
- Type: `text-wrap: balance` on headings (`pretty` is enhancement); `font-variant-numeric: tabular-nums`
  in tables; metric-matched fallback fonts; mobile inputs at 16 px or more, or iOS zooms.
- CJK: set `lang` on the element (`zh-Hans`, `ja`): line breaking and glyph choice depend on it.
  `line-break: strict` for UI copy. `text-spacing-trim` is Chromium only and `text-autospace` Firefox
  and Safari only: enhancement both. Rules: [cjk-typography](../../design-studio/references/fundamentals/cjk-typography.md).
- Locale through `Intl.*`, never hand-formatted. SSR: output that depends on time, locale or randomness
  matches between server and client; inputs keep focus and value through hydration.
- Images: `width` / `height` or `aspect-ratio`, `srcset` / `sizes`, lazy below the fold. A muted,
  looping, `playsinline` `<video>` instead of a GIF.
- Motion ladder: CSS transition > `@starting-style` (entry) > CSS animation > WAAPI > a library such as
  Motion (springs, layout, exit, gestures). Motion's `x` / `y` / `scale` shorthands are not
  hardware-accelerated: pass a full `transform`. Never drive children through a CSS variable on the parent.
- Screenshot tests: fixed viewport and DPR, `document.fonts.ready`, animations off, dynamic regions masked.

### Tailwind CSS v4

- Tokens in CSS: `@theme { --color-surface: ...; --radius-card: ...; }` generates `bg-surface` and
  `rounded-card`. For modes, keep semantic variables on `:root` and `[data-theme=dark]`, and map them
  with `@theme inline { --color-surface: var(--surface); }`.
- Once tokens exist, remove the raw palette (`--color-*: initial;` in `@theme`) and ban arbitrary values
  (`p-[13px]`, `text-[#1a1a1a]`). Attribute dark mode:
  `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.
- Check the major first. v4 targets Safari 16.4+, Chrome 111+, Firefox 128+; hosts serving older engines
  or old in-app WebViews stay on v3.4 (`tailwind.config.js`). v4 loads a JS config through `@config`.

### React, Vue and enterprise kits

Behaviour from the kit or a headless layer; the look from tokens through the kit's theme API, mapped once.

| Kit | Theme API | Notes |
| --- | --- | --- |
| shadcn/ui, shadcn-vue | CSS variables in the global stylesheet | copy-in code: retheme every variable; the stock neutral theme is itself a default, never ship it; keep local edits consistent across components |
| Radix, Base UI, React Aria, Ark UI, Reka UI | none (headless) | behaviour and accessibility; all styling from tokens |
| MUI | `createTheme` + `ThemeProvider`, CSS variables, `colorSchemes` | component overrides in the theme's `components`, not `sx` everywhere |
| Ant Design, Ant Design Vue | `ConfigProvider theme`: seed and map `token`, `components`, `algorithm` (dark, compact) | locale through `ConfigProvider` |
| Element Plus | `--el-*` variables; SCSS `@forward ... with (...)` for the palette; dark via `html.dark` + its dark variables | |
| TDesign, Semi, Arco | their CSS variables (`--td-*`, `--semi-*`) or theme tools | TDesign spans Vue, React, mini-program and Flutter |
| Naive UI | `n-config-provider` `theme-overrides`, `darkTheme` | |
| Nuxt UI | `app.config` colours + Tailwind v4 `@theme` | |
| Fluent UI React v9 | `FluentProvider` with a brand-ramp theme; `tokens.*` in styles | Office add-ins and M365 hosts; code tokens differ from the Fluent site (radius Large 6 px in code, 8 on the site): the code ships |
| Vant, Vant Weapp | `--van-*` variables, `ConfigProvider` | mobile H5 and mini-program |

- A component the kit cannot express: wrap or build that one on primitives, and say so. Kit components
  keep their behaviour (validation, virtual scroll, fixed columns); density, spacing and locale go
  through the kit's tokens and locale provider (check date, number and pagination strings).
- React: continuously changing values (pointer, scroll) in motion values or CSS, not in state. Vue:
  `<Transition>` / `<TransitionGroup>` driven by the motion tokens.

### Agent hosts and artifacts

- MCP Apps widgets (Claude, ChatGPT, VS Code, M365 Copilot and others): build on the MCP Apps bridge
  (`@modelcontextprotocol/ext-apps`: `App`, `applyHostStyleVariables`, `applyHostFonts`). ChatGPT's
  `window.openai` is only for its extras, behind feature detection.
- Ship a fallback for every host variable you use (hosts send any subset, often as `light-dark()`);
  spacing stays yours; set `prefersBorder` explicitly; pad by `safeAreaInsets`; handle `inline`,
  `fullscreen` and `pip`, including a mode you did not request; fullscreen drops the outer radius.
- The default CSP blocks remote fonts, images and scripts unless `_meta.ui.csp` declares their origins.
  Tool arguments can arrive only after the user approves: build that pending state. The resource URI
  is a cache key (ChatGPT may serve a cached widget for up to an hour): a breaking UI change gets a new URI.
- Single-file artifact hosts: build with Vite or Parcel, then inline everything into one HTML file.
  Design side: [embedded-hosts](../../design-studio/references/platforms/embedded-hosts.md).

## Flutter

- `ThemeData(colorScheme:, textTheme:, ...)` with component themes (`FilledButtonThemeData`,
  `InputDecorationTheme`...) and a `ThemeExtension` for custom roles (status colours, spacing, motion).
  No literal colours or paddings in widgets.
- Adaptive: `LayoutBuilder` / `MediaQuery.sizeOf`; name Material's breakpoints (compact < 600, medium
  600-839, expanded 840-1199, large 1200-1599, extra-large >= 1600 dp); `SafeArea`; `NavigationBar` >
  `NavigationRail` (extended) by width. M3 Expressive no longer recommends the navigation drawer.
- M3 Expressive: Material lists Flutter as unavailable for physics motion. Toolbars, button groups, split
  button, FAB menu: use them only if the installed Material library has them; otherwise build from
  primitives with the tokens, drive springs with `SpringSimulation` from the token values, report the gap.
- Liquid Glass: Flutter paints its own widgets, Cupertino included, so OS glass is not inherited. Read the
  installed release's Cupertino notes, then pick and record one: Cupertino as it ships, native bars via
  platform views (costly), or the handoff's fallback. Never `BackdropFilter` spread around as fake glass.
- Test the largest `MediaQuery.textScalerOf`; honour `MediaQuery.disableAnimationsOf`. Bundle fonts with
  their licence and set `fontFamilyFallback` for CJK, or Chinese glyphs fall to an arbitrary system face.
- Goldens per component and screen at fixed sizes, themes and text scales. Load the real fonts in the
  test setup, or text renders as placeholder boxes. One icon family: its package or `flutter_svg`.

## SwiftUI and UIKit (iOS, iPadOS, macOS 26-27)

- Colours in the asset catalogue with light, dark and increased-contrast variants; never hard-code
  system colour values (they change: the iOS blue is now `#0088FF`). Text styles, or custom fonts with
  `relativeTo:` for Dynamic Type; SF Symbols at the text's weight; `symbolEffect` for state changes.
- System containers first (`NavigationStack`, `TabView`, toolbars, sheets, `List`): built with the 26+
  SDK they adopt Liquid Glass; with the 27 SDKs `UIDesignRequiresCompatibility` is ignored (no opt-out).
  iOS 27 makes iPhone apps resizable (iPhone Mirroring, iPhone apps on iPad): lay out by size class,
  never by device or orientation; test in Xcode's Device Hub.

| The design says | SwiftUI | UIKit / AppKit |
| --- | --- | --- |
| glass on a custom control (functional layer only) | `.glassEffect(_:in:)` with `Glass.regular`, `.clear`, `.identity`, `.tint(_:)`, `.interactive()` | `UIGlassEffect`, `NSGlassEffectView` |
| neighbouring glass shapes that merge | `GlassEffectContainer` | - |
| glass buttons, one prominent action | `.buttonStyle(.glass)`, `.buttonStyle(.glassProminent)` | bar button item `.prominent` style |
| toolbar groups (at most three) | `ToolbarItemGroup`, `ToolbarSpacer(.fixed)`; 27: `visibilityPriority`, `ToolbarOverflowMenu`, `topBarPinnedTrailing` | `fixedSpace(_:)` |
| tab bar minimises on scroll, with an accessory | `.tabBarMinimizeBehavior(.onScrollDown)`, `.tabViewBottomAccessory` | - |
| search tab at the trailing end; prominent tab (27) | `Tab(role: .search)`; `TabRole.prominent` | `UISearchTab`; `prominentTabIdentifier` |
| iPad tab bar that becomes a sidebar | `.tabViewStyle(.sidebarAdaptable)` | - |
| navigation bar hides on scroll (27) | `.toolbarMinimizationBehavior(.onScrollDown, for: .navigationBar)` | `navigationItem.navigationBarMinimization` |
| edge between floating bars and content | `.scrollEdgeEffectStyle(_:for:)`; custom bars via `safeAreaBar` | - |
| image continues under the sidebar | `.backgroundExtensionEffect()` | `UIBackgroundExtensionView`, `NSBackgroundExtensionView` |
| concentric corners | `ConcentricRectangle`, `rect(corners:isUniform:)` | `UICornerConfiguration`; AppKit 27 `.containerConcentric` |

- iOS 27 API names changed between the WWDC26 talks and the docs: take them from the installed SDK.
- No glass in the content layer, none on glass, no custom blur as glass; tint only the single primary
  action. iOS 27 `.automatic` scroll edges have their own look: revisit `.soft` / `.hard` overrides. Give
  every non-text toolbar item a title too: overflow menus and iPhone Duo's vertical bars show it.
- Check with Reduce Transparency, Increase Contrast and the iOS 27 transparency slider changed. Previews
  for every state, size class, colour scheme and Dynamic Type size.

## Jetpack Compose (Android 16, Material 3 Expressive)

- `MaterialTheme` or `MaterialExpressiveTheme` with colour scheme, typography, shapes and motion scheme
  from the tokens; extra roles through `CompositionLocal`. Decide dynamic colour from the brief.
- Plain `MaterialTheme` gives the standard spring scheme; expressive motion needs
  `MaterialExpressiveTheme` / `MotionScheme.expressive()`. Read springs from `MaterialTheme.motionScheme`
  (`defaultSpatialSpec()`, `fastEffectsSpec()`...), never hand-written `spring(...)`.
  `LocalMotionScheme` was removed in 1.5.0-alpha27.

| material3, as of 2026-09-27 | stable 1.4.0 (2025-09-24) | 1.5.0-alpha29 (2026-09-23) |
| --- | --- | --- |
| 64 dp flexible nav bar `ShortNavigationBar`; rails `WideNavigationRail`, `ModalWideNavigationRail` | yes | yes |
| `MotionScheme.expressive()`, `MaterialExpressiveTheme`, emphasized type styles | internal | yes |
| `HorizontalFloatingToolbar`, `FlexibleBottomAppBar` (docked), `ButtonGroup`, `SplitButtonLayout`, `FloatingActionButtonMenu`, flexible top app bars | no | graduated in alpha19-23 |
| `MaterialShapes`, `LoadingIndicator` | no | still experimental |

- On stable 1.4.0 with alpha-only parts in the design: adopt the alpha deliberately and record it, or build
  those parts from primitives and report the gap. Never swap in a retired pattern (drawer, bottom app bar).
- Views: MDC-Android 1.14.0 has the Material3Expressive themes; `MotionUtils.resolveThemeSpringForce`
  reads theme springs (standard values); the FAB menu is unavailable.
- Icons: Material Symbols vector drawables (fonts.google.com/icons), not `material-icons`. Adaptive: the
  Material breakpoints listed under Flutter, `currentWindowAdaptiveInfo()`, edge-to-edge with insets,
  predictive back; dp for sizes, sp for text; test font scale 2.0.

## HarmonyOS (ArkUI, ArkTS)

- Colours and sizes in `resources/base/element/*.json` with qualifier folders (`dark/`, device type),
  referenced as `$r('app.color.surface')`. Use system resources (`$r('sys.color.font_primary')`) where the
  design uses system roles; material `colorInvert` only flips those. vp for layout, fp for text (fp
  follows the user's font scale).
- Breakpoints by window, not device: `getWindowWidthBreakpoint()` (XS < 320, SM < 600, MD < 840,
  LG < 1440, XL >= 1440 vp) and `getWindowHeightBreakpoint()` (aspect ratio < 0.8, < 1.2, >= 1.2);
  `GridRow` defaults 320 / 600 / 840 vp; 4 / 8 / 12 columns.
- 沉浸光感 (Immersive Light), from the design's material role:

| Role in the design | `uiMaterial.ImmersiveStyle` |
| --- | --- |
| top floating bar | `ULTRA_THIN` + gradient blur |
| bottom floating bar | `THIN` + gradient colour mask |
| transient pop-up | `THICK` |
| half-modal sheet, dialog | `ULTRA_THICK` |

- Apply with `uiMaterial.ImmersiveMaterial` + `systemMaterial()`, or HDS `hdsMaterial` (`ADAPTIVE`). Device
  tier (`MaterialLevel` EXQUISITE / GENTLE / SMOOTH) is separate from thickness: check `getSystemMaterialTypes()`.
  Low-compute devices fall back to background, border and shadow: that fallback must look right. App switch:
  `MaterialState` in `module.json5` metadata. `hdsMaterial`, floating `HdsTabs`: 6.1.0(23); MiniBar 6.1.1(24).
- Bottom tabs: `HdsTabs` floating (56 vp capsule) or flat (48 vp); plain `Tabs` blurs with
  `barOverlap(true)` + `barBackgroundBlurStyle` + a translucent `barBackgroundColor`. The guide's
  floating widths for 2-3 tabs (168 / 184, 248 / 272 vp) differ from the HdsTabs default formula: set
  the width from the design.
- Immersive pages: `expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])`.
  Title bar 56 vp, large 112 vp.
- Icons: HarmonyOS Symbol (`SymbolGlyph`); the selected tab bounces with `BounceSymbolEffect`. HarmonyOS
  Sans is the system face: use it, never bundle a modified copy.

## WeChat and other mini-programs

- Layout in rpx (750 rpx = screen width), px for hairlines. Custom navigation: the capsule rectangle
  from `wx.getMenuButtonBoundingClientRect()`, status bar and safe area from `wx.getWindowInfo()`;
  `wx.getSystemInfo` is no longer maintained.
- Tokens as CSS variables on `page`; dark mode through `"darkmode": true` in `app.json`, a `theme.json`,
  and `@media (prefers-color-scheme: dark)` in WXSS.
- 适老化: read `fontSizeScaleFactor` / `fontSizeSetting` from `wx.getAppBaseInfo()`. Care mode scales
  type, graphics and buttons 1.4x with spacing fixed. Custom navigation bars (x1.18 above standard) and
  custom tab bars must be adapted by hand. Icon hit areas +12 pt; floor 40 x 40 pt.
- Kits (WeUI, Vant Weapp, TDesign) themed through their CSS variables; uni-app and Taro: check how they
  convert rpx and px. Package-size limits: compress images, host large media, don't bundle CJK fonts.
  Skyline renderer: check each CSS feature. Preview on real iOS and Android devices. Alipay (`my.`)
  and Douyin (`tt.`) share the structure; look up their capsule and safe-area APIs.

## Desktop

- Electron and Tauri: system font stack; tokens follow the OS appearance and accent. Custom title bar:
  drag region on the bar (`-webkit-app-region: drag`, Tauri `data-tauri-drag-region`), `no-drag` on its
  controls, room for traffic lights and caption buttons, full-screen and maximised states. Native menus,
  remembered bounds, a minimum window size, no text selection on chrome; test at 100/125/150% scaling.
- WinUI ("WinUI 3" is now "WinUI"; Windows App SDK 2.4 stable): `Window.SystemBackdrop = new MicaBackdrop()`
  (`BaseAlt` for tabbed title bars) once, as the base layer, transparent layers above; `DesktopAcrylicBackdrop`
  or a `SystemBackdrop` on flyouts for transient surfaces; `SystemBackdropElement` for one panel. Radii from
  `ControlCornerRadius` (4) and `OverlayCornerRadius` (8). Title bar 32 px, 48 px with search or a person
  picture; `TitleBar` has custom drag regions. Agent plugin: `/plugin install winui@awesome-copilot`.

## Assets and fonts

- Assets come from the handoff's manifest (`handoff.json` `assets`) in the formats, scales and player
  versions it names; never re-export, substitute or drop a provenance record.
- Fonts ship with their licence file. OFL families (Source Han / Noto CJK, LXGW WenKai, Smiley Sans,
  Sarasa) may be subset for the web; rename the subset when the family has a Reserved Font Name (LXGW
  WenKai's extra permission lets web-only subsets keep it). Free-to-use vendor fonts (HarmonyOS Sans,
  MiSans, OPPO Sans, Alibaba PuHuiTi) forbid modification: never subset or convert them; use the system
  install or the vendor's unmodified files. HarmonyOS Sans, MiSans and OPPO Sans also require a
  "uses <font>" notice in the app. Details: [licensing](../../design-studio/references/fundamentals/licensing.md).
