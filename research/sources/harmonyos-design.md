# HarmonyOS Design Guide (鸿蒙设计指南): 沉浸光感, bottom tabs, layout grid, typography, HarmonyOS Sans, app icons
- id: harmonyos-design · url: https://developer.huawei.com/consumer/cn/doc/design-guides/immersivelight-0000002612101053 · fetched: 2026-09-27 · method: json-api
- review_by: 2026-12-26 (perishable +90d) · licence note: paraphrased digest, not a mirror
> 中文导语：华为官方《HarmonyOS 设计》指南及对应 ArkUI/HDS 接口文档的要点：沉浸光感材质（三档用户强度、五级材质厚度、按场景选档）、平铺式 48 vp 与悬浮式 56 vp 底部页签及宽度规则、断点与 4/8/12 栅格、文本排版 token、鸿蒙黑体可变字体、双层应用图标。画鸿蒙界面稿或写鸿蒙规格前先读这份；具体数字都带出处页面和更新日期。

How it was read (2026-09-27): the design guide is a JS app, but every page is served as JSON by
`POST https://svc-drcn.developer.huawei.com/community/servlet/consumer/cn/documentPortal/getDocumentById`
with body `{"objectId":"<doc-id>","catalogName":"design-guides","language":"cn"}` (API reference pages: `catalogName` `harmonyos-references`;
developer guides: `harmonyos-guides`). The catalogue comes from `.../getCatalogTree`. Each response carries `updatedDate` (quoted below as "upd").
Public page URL = `https://developer.huawei.com/consumer/cn/doc/design-guides/<doc-id>`. The HarmonyOS Sans zip linked from the font page was also
downloaded and its font tables and licence were inspected locally.

Pages read (doc-id, upd): immersivelight-0000002612101053 (2026-06-12, V1) · bottomtab-0000001956787789 (2026-09-20, V15) · titlebar-0000001929628982
(2026-06-12) · design-layout-basics-0000001795579413 (2026-08-24, V15) · design-responsive-layout-structure-0000001748539684 (2025-06-20) ·
typography-0000002622688363 (2026-07-29) · font-0000001828772001 (2026-07-28) · application-icon-0000001953444009 (2026-07-28) ·
system-icons-0000001929854962 (2026-07-14) · corner-radius-parameter-0000002556468705 (2026-08-12) · interval-parameter-0000002562577161 (2026-07-10) ·
color-0000001776857164 (2026-07-20) · ux-guidelines-general-0000001760708152 (2026-07-21, V30) · whats-new-0000002189266636 (2026-06-24).
API references: ui-design-hdstabs (2026-09-23), ui-design-hdsmaterial (2026-09-23), arkts-apis-uimaterial (2026-09-23), ts-appendix-enums (2026-09-23),
ts-container-gridrow (2026-09-23); guide ui-design-hds-component-material (2026-09-23).

## Key facts
**Release context** [whats-new]
1. The guide's HDC release of **2026-06-12** added 14 pages, among them 鸿蒙黑体, 沉浸光感, 圆角参数 and 间隔参数. The same release added 沉浸光感 sections to 22 controls: bottom tabs, sub-tabs, title bar, buttons, toolbar, menus, search box, dialogs, half-modal sheet, sliders, switches, segmented buttons and others. "字体排印" was renamed "文本排印".
2. That release also changed the UX standards. It added 2.1.3.4 (scrollable control height), 2.2.4.3 画中画适配, 2.2.7.1 滑动沉浸 and 2.2.7.2 短视频沉浸. The large-screen standard **deleted 3.2.2.2 侧边导航栏** as a requirement (and reused the number for a new 3.2.2.2 信息聚合).

**沉浸光感 (Immersive Light)** [immersivelight; arkts-apis-uimaterial]
3. Concept: controls become a light-diffusing, light-transmitting medium that floats over content "like mist". Content stays visible through the control layer, which adds Z-axis separation between content and controls. Recommended wherever operable elements can overlap content during interaction. [#section197341916142318, #section361125363517]
4. **Three user strengths**: 强 / **均衡 (default)** / 弱. They tune transparency, 反色率 (inversion rate), refraction strength and environment interaction.
   - 弱 = restrained and high-contrast.
   - 强 adds particle flow and spatial light effects.
   - The user picks the strength in the system Settings app (the uiMaterial reference names "系统设置应用中沉浸光感配置项"). Developers define the effect once and the system maps it to the user's strength. [#section11153104616255, #section91711926192713; arkts-apis-uimaterial]
5. **Five material levels** (ArkUI `uiMaterial.ImmersiveStyle`): `ULTRA_THIN`=0, `THIN`=1, `REGULAR`=2 (default), `THICK`=3, `ULTRA_THICK`=4.
   - API guidance: ULTRA_THIN or THIN for floating buttons and light tips; REGULAR for content areas and cards; THICK or ULTRA_THICK where the layer must separate or hide the background.
   - The design guide calls these "Ultra_Thin … Ultra_Thick, 5 个层级枚举值" and does not name the middle level; the API does (REGULAR). [arkts-apis-uimaterial#ImmersiveStyle]
6. Scene rules (design guide):
   - **Top floating** → `ULTRA_THIN` + gradient blur.
   - **Bottom floating** → `THIN` + gradient colour mask.
   - **Non-resident, can pop anywhere** → `THICK`.
   - **Half-modal sheets and dialogs** → `ULTRA_THICK`. [#section361125363517]
   Why the two ends differ: the title bar carries uncontained text, so it uses gradient *blur*. The bottom tab's content sits in a container, so it uses a gradient *colour*. [bottomtab#section5979811544]
7. **Device tiers are separate from thickness**: `MaterialLevel` `EXQUISITE`=0 (high compute), `GENTLE`=1 (mid), `SMOOTH`=2 (low); HDS adds `ADAPTIVE`=10.
   - On low-compute devices the material falls back to background colour, border colour, border width and shadow. On devices without immersive-material support it can be set but has no effect (`isImmersiveMaterialSupported()`).
   - On high- and mid-compute devices, once `systemMaterial` takes effect, the component's own `backgroundColor` resets to transparent and `borderWidth` to none (the effect is drawn with `materialFilter` + shadow).
   - HDS guidance: the recommended default is `ADAPTIVE`. If not using it, use EXQUISITE or GENTLE only if `getSystemMaterialTypes()` reports IMMERSIVE; otherwise use SMOOTH. [ui-design-hdsmaterial; arkts-apis-uimaterial]
8. `ImmersiveOptions` defaults: `{style: REGULAR, materialColor: undefined, colorInvert: false, applyShadow: true, interactive: false, lightEffect: undefined}`.
   - `interactive` = deformation feedback while the user interacts (the bottom-tab guide describes the container deforming towards the finger position).
   - `lightEffect.color` defaults to white; `null` explicitly disables the light feedback.
   - `colorInvert` flips child text and icon colours only when they use system resources such as `sys.color.font_primary`, not hard-coded colours, and only on high/mid-compute devices. [arkts-apis-uimaterial#ImmersiveOptions; bottomtab#section5979811544]
9. Where the ArkUI material takes effect:
   - Page-wide for dialogs, action sheets, pickers, popups, menus, sheets, Slider, Toggle and Select.
   - For other components, only inside the Navigation/NavDestination title bar or a bottom TabBar (`barPosition: End`).
   - App-level switch `MaterialState`: `DEFAULT` / `ENABLE` / `DISABLE`, set in module.json5 metadata. Under ENABLE, dialogs, toasts, chips, Select, menus, Toggle, SegmentButton, Slider and Navigation get the material by default, and so do floating Tabs bars. [arkts-apis-uimaterial#MaterialState]
10. API versions: `HdsTabs` itself since 6.0.0(20); HDS `hdsMaterial` and HdsTabs `barFloatingStyle` (floating bar) since **6.1.0(23)**; HdsTabs MiniBar layout mode (HORIZONTAL/VERTICAL) since 6.1.1(24); ArkUI `@ohos.arkui.uiMaterial` since "**26.0.0**" (as printed on the reference page).

**Bottom tabs (底部页签)** [bottomtab; ui-design-hdstabs]
11. "HarmonyOS 6.1 版本之后" there are two styles:
    - **平铺式 (flat)**: full width, 炫彩透光模糊 blur material, default height **48 vp**.
    - **悬浮式 (floating)**: a capsule over content with 沉浸光感, default height **56 vp**.
    - The flat bar extends into the navigation-indicator area, but its hit area stays separate from the indicator's.
    - HdsTabs `barHeight` default is 48 vp, or 56 vp in floating style. [#section5724133641117; hdstabs#barHeight]
12. Count and labels:
    - 3–5 equal, mutually exclusive destinations, generally 4 or fewer. A "4+1" operational tab is allowed.
    - Icons are **24×24 vp**, preferably HarmonyOS Symbol. Labels are 2–4 Chinese characters, or one word or phrase in other languages.
    - Operational art: in the floating bar it may bleed **4 vp** upward; in the flat bar keep 4 vp top and bottom safe space.
    - Show inactive tabs with lower opacity or grey. [#section5724133641117]
13. Behaviour:
    - Tapping the current tab scrolls to the top.
    - The selected state gets a small bounce (`BounceSymbolEffect`, direction DOWN).
    - The floating bar does **not** support switching tabs by swiping content.
    - Wide screens (≥8 columns) can follow the operating hand (跟手). The bar can hide on scroll. [#section75161636846, #section2122181713117]
14. Floating width:
    - Computed from breakpoints; do not hard-code it.
    - Maximum **360 vp** for ≥5 tabs and **328 vp** for 4 tabs.
    - 2–3 tabs use fixed widths: 3 tabs **248 vp** (window <600 vp) or **272 vp** (≥600); 2 tabs **168 vp** or **184 vp**.
    - Tablets: scale the whole bar ×**1.15**.
    - Don't use a bottom tab bar with 2–3 tabs at ≥1440 vp. [#section2122181713117]
    ⚠ The HdsTabs API reference gives a different default: `76vp × n + 8vp` below 600 vp and `80vp × n + 8vp` at ≥600 vp (for ≤3 tabs). That is 236/248 vp for 3 tabs and 160/168 vp for 2 tabs, where the guide says 248/272 and 168/184. The API also caps the bar at **328 vp for ≥4 tabs** (no 360 vp tier for 5 tabs). See Not verified.
15. MiniBar companion (layouts: centred, left-right, top-bottom). In left-right layout, the expanded bar collapses the other one into a circular button.
    - Layout A (all centred) at 320–440 vp.
    - B (expanded part centred, circle at the margin) at 440–600 vp, and at 600–840 vp when the aspect ratio is **below 0.8**.
    - C (split to both sides) at 600–840 vp with the ratio above 0.8, and at 840–1440 vp.
    - The guide writes the ratio as 宽高比; the matching HdsTabs `HdsBarWidthRangeOptions` (small <440 vp; medium 440–600 vp or 600–840 vp with ratio <0.8; large >840 vp or 600–840 vp with ratio >0.8) defines it as **高宽比 (height ÷ width)**, the same ratio as `HeightBreakpoint`. Read that way, B is the short/landscape 600–840 vp window and C the near-square or tall one (e.g. an unfolded foldable).
    - MiniBar width = TabsBar width.
    - Top-bottom layout (320–440 vp): MiniBar sits **8 vp** above the bar; after scrolling its max width is **264 vp** (5 tabs) or **296 vp** (4 tabs). [#section2122181713117]
16. HdsTabs floating defaults:
    - `barSideMargin` 16 / 24 / 32 vp for <600 / 600–840 / >840 vp.
    - `barBottomMargin` 0 vp.
    - `gradientMask` height = bar height + **16 vp**, colour light `#CCF1F3F5`, dark `#99000000`.
    - `lightColor` dark `#33E5E5E5`, light printed as `#33fffffff` (nine hex digits, evidently `#33FFFFFF`).
    - `barOpacity` 1.
    - The guide adds: the gradient colour layer should rise **16 vp** above the top edge of the bottom content and match the page background. [hdstabs#HdsTabsFloatingStyle; bottomtab#section5979811544]
17. Flat-style blur:
    - ArkUI: `barOverlap(true)` + `barBackgroundBlurStyle` (overlap switches the default to `BlurStyle.COMPONENT_THICK`) + a semi-transparent `barBackgroundColor`.
    - HDS offers 背板模糊 (uniform blur, with a **1 px** top divider that fades out when content leaves the bar) and 渐变模糊 (soft edge; taller, less legible, only for specific scenes). HdsTabs `barBackgroundStyle` gradient-blur defaults: light `#CCFFFFFF`, dark `#CC000000`, height = TabBar height + **32 vp**. [hdstabs#barBackgroundStyle]
    - 动态反色 switches the bar's material, icon and text colours between the light and dark schemes when the content beneath hurts legibility. [blur: #section742274325411; 动态反色 is in the 沉浸光感 section #section5979811544]
18. Flat layouts:
    - Phone: items share the width equally, maximum 5.
    - Phone landscape: `LayoutMode.HORIZONTAL`, with label text growing from **10 vp to 12 vp**.
    - In split view the tab bar follows the first-level column.
    - Tablet landscape: bottom tabs below **840 vp**, side tabs at ≥840 vp.
    - The responsive-architecture page: side tab at **≥840 vp**; split columns at **≥600 vp** (default ratio **4:6**, optionally 5:5 or 6:4). [#section080115474114; design-responsive-layout-structure]

**Title bar** [titlebar]
19. Default single-line title bar is **56 vp**; the emphasised (large) title bar is **112 vp**. `NavigationTitleMode` has three values:
    - `Free`: shrinks while scrolling.
    - `Mini` and `Full`: fixed.
    Under 沉浸光感, the material goes on the operable buttons and on coupled components (search field, segmented button). The gradient-blur layer extends **32 vp** below the bar's bottom edge, including when the bar hides on scroll, and its colour matches the page background. With `NavigationMode.Auto` the layout is Split at ≥600 vp and Stack below.

**Layout** [design-layout-basics; ts-appendix-enums; ts-container-gridrow]
20. Units:
    - vp is density-independent.
    - fp = vp × the user's font scale (1 fp = 1 vp by default).
    - **8 vp grid**; small items such as icons may align to 4 vp. [#section197873139478, #section1964738154814, #section139691336184817]
21. Breakpoints are set by **window width** (horizontal) and **aspect ratio** (vertical). In split screen or a free window, use the window's own size.
    - Width (`WidthBreakpoint`): XS <320, SM 320–<600, MD 600–<840, LG 840–<1440, XL ≥1440 vp.
    - Height (`HeightBreakpoint`, by height/width ratio): SM <0.8, MD 0.8–<1.2, LG ≥1.2.
    - Some devices may adjust the thresholds.
    - The guide's own breakpoint figure is an image; the enum page is the text source. [ts-appendix-enums#WidthBreakpoint]
22. Window grid: **4 columns** at 0–<600 vp, **8** at 600–<840, **12** at ≥840. Margin / gutter pairs:
    - 4 columns: 16/8 (standard) or 16/16 (loose).
    - 8 columns: 24/12.
    - 12 columns: 32/16 or 32/20.
    - Gutters should not exceed margins.
    - **Maximum content width 2220 vp**; beyond that the extra space goes to the sides.
    - `GridRow` default breakpoints are `["320vp","600vp","840vp"]` on window size, up to 6 breakpoints (xs…xxl). [#section6466124105013]
23. Screen-edge margins by device (left/right · top · bottom, from 间隔参数): phone **16 · 36 · 28 vp**; foldable **24 · 36 · 28**; tablet **32 · 36 · 28**; smart screen **48 · 27 · 27**; wearable **26 · 20 · 20**; PC **40 vp** (sides only); car cockpit **48 vp** (sides only).
24. Phone spacings:
    - Between cards: **12 vp**.
    - Between controls, large (bounded elements): **16 vp**. Normal (unbounded): **8 vp**.
    - Between primary and secondary text: 2 vp vertical, 8 vp horizontal.
    - Tokens `Padding_level0…36` cover 0–72 vp in 2 vp steps (some levels skipped). [interval-parameter]
25. Corner radius:
    - Common values: **4 vp** (tags, badges), **8** (images, icons), **16** (notification cards, content containers), **20** (buttons, menus), **32** (half-modal sheets, dialogs).
    - Rule: radius rises with the element's layer, and siblings share one radius.
    - Tokens `corner_radius_none … level18`: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, then 32 (level16) and 36 (level18). [corner-radius-parameter]
26. The device screen table (px → vp) is useful for mockup frames:
    - Phones: Mate 80 / 80 Pro 1280×2832 → **366×809 vp**; Pura 80 1256×2760 → **359×789**; Mate 70 Pro → 376×810; Pura 90 Pro Max → 374×823.
    - Foldables: Mate X7 folded 360×815 and unfolded **737×805**; Mate XT tri-fold fully open **1108×776**.
    - Pura X (阔折叠): 326×326 folded, 440×706 open.
    - Tablets (vp): MatePad Mini 1078×674; MatePad 1280×800; MatePad Pro 1440×960.
    - Watches: round 466 px → 233 vp; square 204×240 vp. [#section10294182005515]

**Typography (文本排版)** [typography#section189305569313]
27. Type tokens (weight · phone / PC / watch, vp):

    | Token | Weight | Phone | PC | Watch |
    |---|---|---|---|---|
    | Display_L | Light | 56 | 54 | 56 |
    | Display_M | Light | 48 | 46 | 48 |
    | Display_S | Light | 38 | 36 | 38 |
    | Title_L | Bold | 30 | 28 | 30 |
    | Title_M | Bold | 24 | 22 | 24 |
    | Title_S | Bold | 20 | 18 | 20 |
    | Subtitle_L | Medium | 18 | 16 | 18 |
    | Subtitle_M | Medium | 16 | 14 | 16 |
    | Subtitle_S | Medium | 14 | 12 | 14 |
    | Body_L | Medium | 16 | 14 | 16 |
    | Body_M | Regular | 14 | 14 | 14 |
    | Body_S | Regular | 12 | 14 | 12 |
    | Caption_L | Medium | 12 | 12 | 12 |
    | Caption_M | Medium | 10 | 9 | 10 |
    | Caption_S | Medium | – | – | 8 (watch only) |

    PC is not uniformly 2 vp smaller: Body_M stays at 14 and Body_S becomes 14.
28. The page lists typesetting rules as do/don't images: line-start punctuation indent and prohibition, line-end hanging punctuation, punctuation runs, spacing in mixed CJK/Latin text, avoiding orphans, line-length indent (行长缩进), CJK justification, balanced English, hyphenation only for dense long text, and line height for other scripts. Values appear only in images, except the hyphenation text: at least 3 characters left at line end and 2 carried to the next line. [#section16609165945]
29. UX standard minimum text size [ux-guidelines-general]:
    - Phone, foldable and tablet: ≥12 vp recommended, **≥8 vp** required.
    - PC: ≥14 recommended, ≥10 required.
    - Smart screen: ≥16 recommended, ≥14 required; body text 22–26.
    - Watch: ≥13 recommended, ≥10 required.
    - Icons (phone): ≥12 recommended, ≥8 vp required.
    - Contrast: icons and titles **>3:1**, body text **>4.5:1**.
    - Touch targets (phone, tablet, foldable): **48×48 vp** recommended, **≥40×40 vp** required; watch 46 recommended, 40 required; PC ≥5 mm with mouse, ≥7 mm on touch.
    - The main scrollable control must be at least **20%** of screen height (2.1.3.4, required; applies to phones and foldables).

**HarmonyOS Sans (鸿蒙黑体)** [font; downloaded zip]
30. HarmonyOS Sans is the default system font. It covers SC and TC, Latin, Greek, Cyrillic and Arabic.
    - Weights: Thin, UltraLight, Light, Regular, Medium, SemiBold, Bold, Heavy, Black.
    - Styles: Condensed and Italic.
    - Variable font; the page advertises the variable axis.
    - OpenType features: sups, subs, sinf, numr, dnom, **tnum**, pnum, case, frac, ordn, liga, fwid, hwid, vert. [#section17997771311]
31. Verified in the official zip (dated 2026-06-26):
    - `HarmonyOS_Sans_SC.ttf` v2.040, 20.6 MB, one **wght axis 40–900 (default 400)**.
    - Latin v2.040, Italic v2.06 and Condensed / Condensed Italic v1.5 have the same axis; Naskh Arabic (UI) v1.401 has wght 100–900.
    - TC v2.00. All have `fsType`=8 (editable embedding).
    - Licence terms are in the `cjk-font-licensing` digest.

**App icon (应用图标)** [application-icon]
32. Asset spec:
    - **Layered, two layers (foreground + background)**; **1024×1024 px**; square with no rounded corners (the system applies the mask per scene); **PNG**.
    - The **background layer must have no transparent pixels**. A rounded crop or transparent padding counts as a failure.
    - The same spec applies to phone, foldable, tablet, PC and smart screen; wearables have their own spec.
    - A wrong asset fails the store listing check. [#section634668113212, #section357075123214]
33. Style:
    - Light from the top: lighter top, darker bottom.
    - Keep one gradient direction; no diagonal or dark-top gradients; moderate contrast between the gradient's two ends.
    - Add 光感勾边 (a light edge) to the plate.
    - Choose from **9 recommended colour directions** (shown in an image).
    - Keep the main shape centred and away from the corners.
    - PC dock hover casts dynamic layer shadows; the smart-screen launcher animates the layers. [#section42711912152719, #section203961622133512]
34. HarmonyOS Symbol (system icons):
    - Size is **24×24 vp**, with the live area **22×22 vp**.
    - Stroke **1.5 vp** (1.3 vp on complex shapes), round caps, gaps 1.3 vp, outer corner radius 3 vp, inner 1.5 vp; slashes run at 45°, top-left to bottom-right.
    - Export as SVG with the frame.
    - Rendering: `SINGLE` (one colour), `MULTIPLE_OPACITY` (one colour; layer 1 at 100%, layer 2 at 50%) or `MULTIPLE_COLOR` (up to two colours, in layer order).
    - The page lists 9 effect strategies (appear, disappear, bounce, scale, replace, quick replace, pulse, variable colour, disable) but also says "7 种动态效果". Icon size equals font size. [system-icons]

**Colour tokens** [color#section17672143841113 (系统基础与语义 Token 全量表); arkts-apis-uimaterial Table 1]
35. System colours, light / dark (ARGB). (#section8205174119302 on the same page is the separate **wearable** table, where e.g. dark `brand` is #FF1F71FF.)
    - `brand` #FF0A59F7 / #FF317AF7.
    - `warning` #FFE84026 / #FFD94838; `alert` #FFED6F21 / #FFDB6B42; `confirm` #FF64BB5C / #FF5BA854.
    - Text: `font_primary` #E5000000 / #E5FFFFFF (90%), `font_secondary` 99 (60%), `font_tertiary` 66 (40%), `font_fourth` 33 (20%).
    - Backgrounds: `background_secondary` #FFF1F3F5 / #FF191A1C; `comp_divider` #33000000 / #33FFFFFF.
    - `interactive_hover` #0C000000 / #0CFFFFFF and `interactive_pressed` #19000000 / #19FFFFFF on the color page. ⚠ The uiMaterial Table 1 prints different dark values: hover #19FFFFFF, pressed #26FFFFFF (and `comp_background_tertiary` dark #19FFFFFF vs #0CFFFFFF on the color page).
    - Default system colours guarantee a minimum **3:1** contrast (color, "如何分层构建色彩").

## What it changes for the skills
- skills/design-studio/references/platforms/harmonyos.md: replace the 13-line practice section with:
  - 沉浸光感: 3 strengths, 5 thickness levels and the scene → level table; device tiers are separate from thickness.
  - Flat 48 vp vs floating 56 vp tabs, the width rules, MiniBar layouts and no swipe-switching.
  - Title bar 56/112 vp and the 32 vp gradient blur.
  - Width and aspect-ratio breakpoints, the 4/8/12 grid with margins and 2220 vp maximum.
  - Device margins and radius tokens.
  - Type tokens and UX minimums (48/40 vp targets, 8/12 vp text).
  Delete every "verify the current values" hedge that these facts now answer. Keep the guide-vs-API width conflict (fact 14) visible.
- skills/design-studio/references/fundamentals/materials.md: map 沉浸光感 levels to semantic roles (top chrome = ULTRA_THIN + gradient blur; bottom chrome = THIN + gradient colour; transient popovers = THICK; sheets and dialogs = ULTRA_THICK). Give a labelled web approximation, and note the low-compute fallback (solid background, border, shadow).
- skills/design-studio/references/disciplines/app-icons.md: HarmonyOS row with two layers, 1024 px PNG, square with no mask, opaque background, top-down light, one gradient direction.
- skills/design-studio/references/disciplines/icons.md: HarmonyOS Symbol drawing spec (24/22 vp, 1.5 vp stroke, radii, 45° slash).
- skills/design-studio/references/fundamentals/typography.md and cjk-typography.md: HarmonyOS Sans is variable (wght 40–900), 9 named weights, Condensed and Italic, `tnum`. The type-token table is a concrete CJK UI scale.
- skills/design-studio/references/fundamentals/layout-and-spacing.md: HarmonyOS breakpoint pair (width + aspect ratio) as a worked example of window-based breakpoints.
- skills/design-studio/assets/mockup-kit/kit.css + kit.json: Harmony frame 366×809 or 359×789 vp. Flat tab 48 vp; floating capsule 56 vp, 328/360 vp maximum, 16 vp side margin, gradient mask +16 vp. Title bar 56 vp. Radii 16/20/32. Glass drawn as an annotated material layer, not a blur.
- skills/implement-design/references/stacks.md (ArkUI): `uiMaterial.ImmersiveMaterial` + `systemMaterial()`, `ImmersiveStyle`, `hdsMaterial` ADAPTIVE, `HdsTabs.barFloatingStyle`, `barOverlap` + `barBackgroundBlurStyle`, `expandSafeArea`, `BounceSymbolEffect`, `getWindowWidthBreakpoint`/`HeightBreakpoint`, `GridRow` breakpoints.

## Not verified / open
- Floating tab width for 2–3 tabs: the design guide (248/272 and 168/184 vp) and the HdsTabs API default formula (76 or 80 vp × n + 8 vp → 236/248 and 160/168 vp) disagree. The guide matches an 80/88 vp per-tab formula. The maximum also differs: guide 360 vp (≥5 tabs) / 328 vp (4 tabs), API 328 vp for all ≥4. Treat the guide as the design target and say that the component default may differ.
- MiniBar layout B vs C at 600–840 vp: the guide's "宽高比 < 0.8" is ambiguous; the HdsTabs API uses 高宽比 (height ÷ width) for the same thresholds. Not confirmed on a device which reading the guide intends.
- Colour token dark values for `interactive_hover`, `interactive_pressed` and `comp_background_tertiary` differ between the color page and the uiMaterial Table 1 (see fact 35); which is current was not settled.
- The breakpoint figure on 布局基础, the 5-level material illustration, the 9 icon colour directions, the typesetting do/don't images and the three strength previews are images only; their pixel values were not read.
- Which HarmonyOS release "API 26.0.0" (uiMaterial) corresponds to is not stated on the page; the whats-new page confirms an HDC release on 2026-06-12; the claim that the HarmonyOS 7 developer beta opened there (huawei.com news) was not re-checked in the fact-check pass, and no primary page tied it to API 26.
- The color page lists `background_primary` dark as #FFE5E5E5, which looks like a documentation slip: the same page's prose says both primary and secondary backgrounds are black in dark mode. Not confirmed either way (`comp_background_gray` dark #FFE5E5EA looks similar).
- Wearable, car-cockpit and smart-screen specifics were only skimmed (margins and minimums above); atomic services and cards were not read.
