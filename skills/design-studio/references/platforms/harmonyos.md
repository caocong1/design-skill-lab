---
title: HarmonyOS (HarmonyOS 6.x, 沉浸光感, floating tabs)
evidence: digest
sources: [harmonyos-design, cjk-font-licensing]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# HarmonyOS

One design for many devices (phone, foldable, tri-fold, tablet, PC, smart screen, car, watch),
adapted by window, not by device. Since HarmonyOS 6.1 the platform has its own glass layer,
沉浸光感 (Immersive Light), and a floating capsule tab bar. Posture and the cross-platform checklist:
[README](README.md).

Numbers come from Huawei's HarmonyOS design guide and the ArkUI / HDS API references, read
2026-09-27. The guide is a JS app, but every page is served as JSON:
`POST https://svc-drcn.developer.huawei.com/community/servlet/consumer/cn/documentPortal/getDocumentById`
with body `{"objectId":"<doc-id>","catalogName":"design-guides","language":"cn"}`; each response
carries `updatedDate`. Doc ids used here: `immersivelight-0000002612101053`,
`bottomtab-0000001956787789`, `titlebar-0000001929628982`, `design-layout-basics-0000001795579413`,
`typography-0000002622688363`, `ux-guidelines-general-0000001760708152`.

## Changed in the last release

| When | What changed for a designer |
| --- | --- |
| Guide release 2026-06-12 (HDC 2026) | 14 new pages, among them 鸿蒙黑体 (HarmonyOS Sans), 沉浸光感, 圆角参数 (radius), 间隔参数 (spacing). About 22 controls gained 沉浸光感 sections (bottom tabs, sub-tabs, title bar, buttons, toolbar, menus, search box, dialogs, half-modal sheet, sliders, switches, segmented buttons). 字体排印 renamed 文本排印. UX standards added 2.1.3.4 (main scroll area height), 滑动沉浸 and 短视频沉浸; the large-screen standard dropped the 侧边导航栏 (side navigation) requirement |
| HarmonyOS 6.1 | Bottom tabs come in two styles: flat (48 vp) and floating capsule (56 vp) |
| API levels | HDS `hdsMaterial` and floating `HdsTabs` since 6.1.0(23); the MiniBar layout since 6.1.1(24); ArkUI `@ohos.arkui.uiMaterial` since "26.0.0" as printed (which OS release that is was not verified) |

## 沉浸光感 (Immersive Light)

Controls become a light-diffusing medium floating over the content "like mist": content stays
visible through the control layer and the Z-axis separation grows. Use it on the control layer
wherever operable elements overlap content during interaction; the API guidance also names `REGULAR`
for content areas and cards (below; where it takes effect is limited, see "Where the material applies").

- **User strength** (Settings): 强 / **均衡 (default)** / 弱. 弱 is restrained and high-contrast; 强
  adds particle flow and spatial light. Design once; the system maps your material to the user's
  strength. Render the 弱 case for legibility.
- **Five thickness levels** (`ImmersiveStyle`): `ULTRA_THIN`, `THIN`, `REGULAR` (default), `THICK`,
  `ULTRA_THICK`.

| Scene | Level | Edge treatment |
| --- | --- | --- |
| Top floating (title bar) | `ULTRA_THIN` | gradient blur (the title bar carries uncontained text) |
| Bottom floating (tab bar) | `THIN` | gradient colour mask (tab content sits in a container) |
| Transient, can pop anywhere (popups, menus) | `THICK` | - |
| Half-modal sheets, dialogs | `ULTRA_THICK` | - |

  The API adds: `ULTRA_THIN` or `THIN` for floating buttons and light tips; `REGULAR` for content
  areas and cards; `THICK` or `ULTRA_THICK` where the layer must hide the background.
- **Device tier is separate from thickness** (`MaterialLevel`: `EXQUISITE` high compute, `GENTLE` mid,
  `SMOOTH` low; HDS adds `ADAPTIVE`). On low-compute devices the material falls back to background
  colour, border and shadow: draw that fallback as a state and make it look right.
- **Colour inversion** (`colorInvert`) flips child text and icons only when they use system colour
  resources (`sys.color.font_primary`), never hard-coded colours. Spec text and icons on materials as
  system roles.
- **Where the material applies**: page-wide for dialogs, action sheets, pickers, popups, menus, sheets,
  Slider, Toggle and Select; for anything else only inside the Navigation title bar or a bottom tab
  bar. An app-level switch (`MaterialState` in `module.json5`) turns it on by default for dialogs,
  toasts, chips, menus, toggles, segmented buttons, sliders, Navigation and floating tab bars.
- Draw it as the labelled approximation in [portable-mockups](../fundamentals/portable-mockups.md);
  the cross-platform role mapping and web fallback are in [materials](../fundamentals/materials.md).
  The handoff names the level, never a blur value.

## Bottom tabs

| | Flat (平铺式) | Floating (悬浮式) |
| --- | --- | --- |
| Look | full width, 炫彩透光模糊 blur material; extends into the navigation-indicator area, its hit area separate from the indicator's | capsule over the content, 沉浸光感 |
| Height | 48 vp | 56 vp |
| Separation from content | HDS 背板模糊 (uniform blur, 1 px top divider that fades out when content leaves the bar) or 渐变模糊 (soft edge, taller, less legible, specific scenes only) | gradient colour mask = bar height + 16 vp, light `#CCF1F3F5`, dark `#99000000`, matching the page background |
| Operational tab art | keep 4 vp safe space top and bottom | may bleed 4 vp upward |
| Swipe content to switch tabs | allowed | not supported |

- 3-5 equal, mutually exclusive destinations, generally 4 or fewer; a "4+1" operational tab is
  allowed. Icons 24 × 24 vp, preferably HarmonyOS Symbol; labels 2-4 Chinese characters, or one word
  or phrase in other languages. Inactive tabs at lower opacity or grey.
- Tapping the current tab scrolls to the top. The selected tab gives a small downward bounce
  (`BounceSymbolEffect`); this is system motion, not something to re-specify
  ([motion](../disciplines/motion.md)). The bar may hide on scroll. On wide windows (8 columns and
  up) the floating bar can follow the operating hand (跟手).
- 动态反色: when the content beneath hurts legibility, the bar switches material, icon and text colours
  between the light and dark schemes.

**Floating width** is computed from the breakpoint; never hard-code it.

| Tabs | Window < 600 vp | Window ≥ 600 vp |
| --- | --- | --- |
| 5 or more | max 360 vp | max 360 vp |
| 4 | max 328 vp | max 328 vp |
| 3 | 248 vp | 272 vp |
| 2 | 168 vp | 184 vp |

- Tablets scale the whole bar × 1.15. No bottom tab bar with 2-3 tabs at 1440 vp and wider.
- Side margin 16 / 24 / 32 vp for < 600 / 600-840 / > 840 vp; bottom margin 0.
- The HdsTabs default width formula (76 vp × n + 8 below 600 vp, 80 vp × n + 8 above) gives 236 / 248
  vp for 3 tabs and 160 / 168 vp for 2, not the guide's values. The guide is the design target; tell
  the implementer to set the width from the design.
- **MiniBar** (a companion bar, for example a player): layout A, all centred, at 320-440 vp; B,
  expanded part centred and the other as a circle at the margin, at 440-600 vp and at 600-840 vp when
  height ÷ width < 0.8 (a short or landscape window); C, split to both sides, at 600-840 vp when
  height ÷ width > 0.8 (near-square or tall, e.g. an unfolded foldable) and at 840-1440 vp. The
  guide writes 宽高比; the HdsTabs API uses 高宽比 (height ÷ width, as the height breakpoints
  below), which is followed here; unconfirmed on a device. Same width as the tab bar. In the
  top-bottom layout it sits 8 vp above the bar and shrinks after scrolling to 264 vp (5 tabs) or
  296 vp (4 tabs).
- **Flat layouts**: phone items share the width, 5 at most; phone landscape uses the horizontal
  layout with labels growing from 10 to 12 vp; in split view the bar follows the first-level column;
  tablet landscape uses bottom tabs below 840 vp and side tabs from 840 vp.

## Title bar and navigation

- Single-line title bar 56 vp; large (emphasised) title bar 112 vp. `NavigationTitleMode`: `Free`
  shrinks while scrolling, `Mini` and `Full` stay fixed.
- Under 沉浸光感 the material goes on the operable buttons and on coupled components (search field,
  segmented button). A gradient-blur layer extends 32 vp below the bar's bottom edge, also while the
  bar hides on scroll, in the page background colour.
- `NavigationMode.Auto` splits at 600 vp and stacks below. Split columns default to 4:6 (or 5:5,
  6:4); side tabs from 840 vp.
- Back: a top-leading back control plus the system back gesture. Atomic services and cards are
  lighter surfaces: one task, no deep navigation.

## Layout

Units (vp, fp) and default frames: [portable-mockups](../fundamentals/portable-mockups.md). Columns
and the 8 vp grid: [layout-and-spacing](../fundamentals/layout-and-spacing.md).

- **Breakpoints by window**, never device. In split screen or a free window use the window's size;
  some devices adjust the thresholds.

| Axis | XS | SM | MD | LG | XL |
| --- | --- | --- | --- | --- | --- |
| Width (vp) | < 320 | 320-< 600 | 600-< 840 | 840-< 1440 | ≥ 1440 |
| Height (height ÷ width) | - | < 0.8 | 0.8-< 1.2 | ≥ 1.2 | - |

- Margin / gutter: 4 columns 16 / 8 (standard) or 16 / 16 (loose); 8 columns 24 / 12; 12 columns
  32 / 16 or 32 / 20. Gutters never exceed margins. Maximum content width 2220 vp; extra space goes
  to the sides.
- Screen-edge margins (sides · top · bottom, vp): phone 16 · 36 · 28; foldable 24 · 36 · 28; tablet
  32 · 36 · 28; smart screen 48 · 27 · 27; wearable 26 · 20 · 20; PC 40 (sides); car 48 (sides).
- Phone spacing: 12 vp between cards; 16 vp between bounded controls, 8 vp between unbounded ones;
  primary to secondary text 2 vp vertical, 8 vp horizontal.
- Radius rises with the layer, siblings share one: 4 vp tags and badges, 8 images and icons, 16
  notification cards and content containers, 20 buttons and menus, 32 half-modal sheets and dialogs.
  Tokens `corner_radius_none … level18` run 0-26 in 2 vp steps, then 32 and 36.
- Frames beyond the defaults (vp): Mate X7 folded 360 × 815; Mate XT tri-fold fully open
  1108 × 776; Pura X (阔折叠) folded 326 × 326, open 440 × 706; round watch 233, square watch
  204 × 240.

## Type

- HarmonyOS Sans (鸿蒙黑体) is the system face: SC, TC, Latin, Greek, Cyrillic, Arabic; 9 weights
  (Thin to Black), Condensed and Italic; variable (`wght` 40-900 in the SC file); `tnum` for figures.
  Its licence forbids modification and stand-alone redistribution: never subset it; on HarmonyOS use
  the system face without bundling; bundling the unmodified file elsewhere needs a "uses HarmonyOS
  Sans" notice in the app ([cjk-typography](../fundamentals/cjk-typography.md)).
- Type tokens (vp; PC is not uniformly smaller):

| Token | Weight | Phone | PC | Watch |
| --- | --- | --- | --- | --- |
| Display_L / M / S | Light | 56 / 48 / 38 | 54 / 46 / 36 | 56 / 48 / 38 |
| Title_L / M / S | Bold | 30 / 24 / 20 | 28 / 22 / 18 | 30 / 24 / 20 |
| Subtitle_L / M / S | Medium | 18 / 16 / 14 | 16 / 14 / 12 | 18 / 16 / 14 |
| Body_L | Medium | 16 | 14 | 16 |
| Body_M / Body_S | Regular | 14 / 12 | 14 / 14 | 14 / 12 |
| Caption_L / M | Medium | 12 / 10 | 12 / 9 | 12 / 10 |

- Text is in fp, so it follows the user's font scale: render one screen at a large scale.

## Icons and colour

- **HarmonyOS Symbol**: 24 × 24 vp, live area 22 × 22; stroke 1.5 vp (1.3 on complex shapes), round
  caps, gaps 1.3 vp, outer corner radius 3 vp, inner 1.5; slashes at 45°, top-left to bottom-right;
  export SVG with the frame. Rendering `MULTIPLE_OPACITY` (second layer at 50 %) or `MULTIPLE_COLOR`.
  Icon size equals font size. Symbol effects are system motion: appear, disappear, bounce, scale,
  replace, quick replace, pulse, variable colour, disable (the page lists nine and also says "7 种");
  name the effect, do not animate it by hand. Drawing method: [icons](../disciplines/icons.md).
- **App icon**: two layers (foreground, background), square, system-masked, top-down light; full
  spec in [app-icons](../disciplines/app-icons.md).
- **System colours** (light / dark): brand `#0A59F7` / `#317AF7`; warning `#E84026` / `#D94838`; alert
  `#ED6F21` / `#DB6B42`; confirm `#64BB5C` / `#5BA854`; secondary background `#F1F3F5` / `#191A1C`.
  Text is black or white at 90 / 60 / 40 / 20 % (`font_primary` … `font_fourth`); dividers at 20 %.
  Reference the resource names so `colorInvert` and dark mode work.

## UX standard minimums (store review)

- Text: phone, foldable and tablet 12 vp recommended, 8 vp required; PC 14 / 10; smart screen 16 / 14
  (body 22-26); watch 13 / 10. Phone icons 12 recommended, 8 required.
- Touch targets (phone, tablet, foldable, watch, PC): the HarmonyOS row in
  [layout-and-spacing](../fundamentals/layout-and-spacing.md#targets-and-density).
- Contrast: icons and titles above 3:1, body text above 4.5:1; default system colours guarantee 3:1.
  Computation and general minima: [color](../fundamentals/color.md).
- The main scrollable control is at least 20 % of the screen height (2.1.3.4, required).

## Handoff names

Design term → ArkUI / HDS name the implementer searches for (code: [stacks](../../../implement-design/references/stacks.md)).

| Design | Name |
| --- | --- |
| floating or flat bottom tabs | `HdsTabs` (`barFloatingStyle`, `barHeight`, `barSideMargin`, `gradientMask`); plain `Tabs` with `barOverlap(true)` + `barBackgroundBlurStyle` |
| title bar, split or stack | `Navigation` / `NavDestination`, `NavigationTitleMode`, `NavigationMode.Auto` |
| 沉浸光感 level | `uiMaterial.ImmersiveStyle` via `systemMaterial`; HDS `hdsMaterial`; device tier `MaterialLevel` |
| breakpoints, grid | `WidthBreakpoint`, `HeightBreakpoint`, `GridRow` |
| selected-tab bounce | `BounceSymbolEffect` on a HarmonyOS Symbol |
| colours, spacing, radius | `sys.color.*`, `Padding_level*`, `corner_radius_*` resources |

## Traps

- iOS or Android chrome on a HarmonyOS screen; the old flat bar drawn where the design wants the
  floating capsule, or the reverse without a reason.
- Hard-coded floating tab widths; swipe-to-switch in a floating bar.
- Hard-coded text colours on a material (inversion cannot flip them).
- No low-compute fallback state; no 弱-strength check.
- Breakpoints keyed to device names; a side navigation added only because an old standard asked
  for it.
