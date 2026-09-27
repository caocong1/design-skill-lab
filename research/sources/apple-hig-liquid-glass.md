# Apple HIG: Liquid Glass (Materials, Color, Layout, Typography) for iOS, iPadOS and macOS 26–27
- id: apple-hig-liquid-glass · url: https://developer.apple.com/design/human-interface-guidelines/materials · fetched: 2026-09-27 · method: json-api + fetch
- review_by: 2026-12-26 · licence note: paraphrased digest, not a mirror
> 中文导语：苹果 2025 年起把 Liquid Glass 定为 iOS/iPadOS/macOS 26 的"功能层"材质，2026 年（27 系列）继续调整：加入透明度滑杆，并且用 27 SDK 构建时不能再关掉新设计。本文汇总 HIG 的 Materials、Color、Layout、Typography、Scroll views、Branding 页面（通过 DocC JSON 读取，每页都带更新日期）以及 WWDC25/26 讲座原文。画 iOS/macOS 稿子、写规格之前先看这份。

Read (all 2026-09-27; HIG pages via `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`):
materials, color, layout, typography, scroll-views, branding, buttons, the-menu-bar; developer docs
`/documentation/technologyoverviews/adopting-liquid-glass`, `/documentation/swiftui/glass`, `/documentation/swiftui/scrolledgeeffectstyle`,
`/documentation/bundleresources/information-property-list/uidesignrequirescompatibility`; WWDC25 219 "Meet Liquid Glass", 356 "Get to know
the new design system"; WWDC26 269 "What's new in SwiftUI", 278 "Modernize your UIKit app", 289 "Modernize your AppKit app" (transcripts on
developer.apple.com/videos/play/…); Apple Newsroom 2026-06-08 (https://www.apple.com/newsroom/2026/06/apple-aids-app-development-with-new-intelligence-frameworks-and-advanced-tools/); HIG "What's new" (https://developer.apple.com/design/whats-new/).

## Key facts
**Materials** (change log: 2025-06-09 added Liquid Glass; 2025-09-09 updated; no 2026 entry as of 2026-09-27)
1. There are two kinds of material. **Liquid Glass** is the *functional layer* for controls and navigation, such as tab bars and sidebars, and it floats above the content layer. **Standard materials** separate elements *within* the content layer. [materials#Liquid-Glass]
2. Rule: "Don't use Liquid Glass in the content layer". Use standard materials there, for example for app backgrounds. The one exception is a transient control in the content layer, such as a slider or toggle, which takes on the glass look *only while someone is using it*. [materials#Liquid-Glass]
3. Use glass sparingly on custom controls and keep it to the most important functional elements. Standard system components adopt glass automatically. [materials#Liquid-Glass]
4. There are two variants. **Regular** blurs the content behind it and adjusts its luminosity. Most system components use regular, and it is the choice when legibility is at risk or the component holds a lot of text (alerts, sidebars, popovers). **Clear** is highly translucent. Use it only over visually rich media such as photos and video. SwiftUI `Glass` has `.regular`, `.clear` and `.identity`, plus `.tint(_:)` and `.interactive(_:)`. [materials#Liquid-Glass; /documentation/swiftui/glass]
5. Dimming for clear glass: over bright content, consider adding a **dark dimming layer at 35% opacity**. You can skip it when the content is already dark enough, or when you use the standard AVKit playback controls, which bring their own dimming. [materials#Liquid-Glass]
6. The appearance of both variants responds to the person's preferred Liquid Glass look (a device setting) and to the Reduce Transparency and Increase Contrast settings. [materials#Liquid-Glass]
7. WWDC25 219 "Meet Liquid Glass" adds the following:
   - Never mix regular and clear.
   - Use clear only when all three conditions hold: it sits over media-rich content, the content layer can take a dimming layer, and the content on top of it is bold and bright.
   - Avoid glass on glass. Elements placed on glass use fills, transparency and vibrancy, not a second layer of glass.
   - Small elements (navigation bars, tab bars) flip between light and dark with the content underneath. Large elements (menus, sidebars) adapt but do not flip.
   - When glass grows to a larger size it renders as a thicker material, with deeper shadows and stronger lensing.
   - At rest (for example at launch), avoid content intersecting glass.
   - Accessibility settings change the material: Reduce Transparency makes it frostier; Increase Contrast makes elements mostly black or white with a contrasting border; Reduce Motion lowers effect intensity and turns off the elastic behaviour.
8. Standard materials on iOS/iPadOS: `ultraThin`, `thin`, `regular` (the default) and `thick`.
   - Vibrant label levels: label, secondaryLabel, tertiaryLabel and quaternaryLabel. Avoid quaternary on thin and ultraThin because the contrast is too low.
   - Fill levels: fill, secondaryFill, tertiaryFill. Separators have a single level.
   - macOS offers purpose-named `NSVisualEffectView.Material`s and two blending modes, behind-window and within-window.
   - Choose a material for its semantic role, never for the colour it seems to give. [materials#iOS-iPadOS, #macOS, #Standard-materials]

**Color** (change log: 2025-06-09 "Updated system color values, and added guidance for Liquid Glass"; 2025-12-16 updated for Liquid Glass)
9. Liquid Glass has no colour of its own; it picks up colour from the content behind it. You can tint it ("stained glass") to emphasise something, and the system's prominent button style works this way. [color#Liquid-Glass-color]
10. On small elements such as toolbars and tab bars, symbols and text are **monochrome by default**: they turn darker over light content and lighter over dark content. Sidebars are more opaque. [color#Liquid-Glass-color]
11. To emphasise a primary action, put colour on the **background**, not on the symbol or text. The system puts the app accent colour on the background of prominent buttons such as Done. Don't colour the backgrounds of several controls: the HIG shows a toolbar where every button is blue as incorrect, and only Done in blue as correct. [color#Liquid-Glass-color]
12. Over a colourful background, keep toolbars and tab bars monochrome, or pick an accent colour that differs clearly from the content. If the content is mostly monochrome, the brand colour works well as the accent. Controls must be legible in the resting state (for example at the top of scrollable content), even if colourful content sometimes scrolls under them. [color#Liquid-Glass-color]
13. Every custom colour needs light and dark variants, plus an increased-contrast option for each. Apps that ship in only one appearance must still provide both light and dark "to support Liquid Glass adaptivity". [color#Best-practices]
14. System colours from 2025 on (sRGB hex; columns are default light / default dark / increased-contrast light / increased-contrast dark). The HIG says not to hard-code them because values can change between releases. [color#Specifications]
```
Red     #FF383C #FF4245 #E9152D #FF6165   Blue    #0088FF #0091FF #1E6EF4 #5CB8FF
Orange  #FF8D28 #FF9230 #C55300 #FFA056   Indigo  #6155F5 #6D7CFF #564ADE #A7AAFF
Yellow  #FFCC00 #FFD600 #A16A00 #FEDF43   Purple  #CB30E0 #DB34F2 #B02FC2 #EA8DFF
Green   #34C759 #30D158 #008932 #4AD968   Pink    #FF2D55 #FF375F #E7124D #FF8AC4
Mint    #00C8B3 #00DAC3 #008575 #54DFCB   Brown   #AC7F5E #B78A66 #956D51 #DBA679
Teal    #00C3D0 #00D2E0 #008198 #3BDDEC   Gray    #8E8E93 #8E8E93 #6C6C70 #AEAEB2
Cyan    #00C0E8 #3CD3FE #007EAE #6DD9FF   Gray6   #F2F2F7 #1C1C1E #EBEBF0 #242426
```
   Converted from the RGB triples on the page. Gray2–5 (light/dark): #AEAEB2/#636366, #C7C7CC/#48484A, #D1D1D6/#3A3A3C, #E5E5EA/#2C2C2E. visionOS uses the default dark values. **The iOS blue is now #0088FF, not the old #007AFF.**
15. iOS has two background sets, *system* and *grouped*, each with primary, secondary and tertiary levels. Foreground colours are label, secondary, tertiary and quaternary label, placeholderText, separator, opaqueSeparator and link. For wide colour, use Display P3 at 16 bits per channel and export PNG. [color#iOS-iPadOS, #Color-management]
16. Branding (2026-09-09, "Refined guidance for using brand color"): use the accent colour sparingly, for primary actions and status indicators such as unread badges or the selected tab icon. To express the brand through colour, move it into the content layer, where it scrolls under the glass controls and they pick it up dynamically. [branding#Best-practices]

**Layout** (change log: 2025-06-09 Liquid Glass; **2026-09-09 "Updated guidance to reflect current best practices"**)
17. Separate controls from content with Liquid Glass. Don't put a solid or semi-opaque background colour under controls; **use a scroll edge effect instead**. Extend full-screen backgrounds under sidebars, toolbars and tab bars to the edge of the screen or window. [layout#Visual-hierarchy]
18. Background extension effect: it flips and blurs an image so that it appears to continue under an adjacent sidebar or inspector. APIs: `backgroundExtensionEffect()`, `UIBackgroundExtensionView`, `NSBackgroundExtensionView`. [layout#Visual-hierarchy; adopting-liquid-glass#Navigation]
19. Base layout on size classes, not on device type or orientation. Keep functionality the same when the size class changes. A larger space can switch a tab bar to a sidebar. **In iOS 27, iPhone apps become fully resizable in resizable environments**: in iPhone Mirroring on macOS 27 and when an iPhone-only app runs on iPad. They keep the phone idiom there and their supported orientations are ignored, so size classes (not idiom or orientation) must drive layout (WWDC26 269, 278). The Layout page points to Xcode's **Device Hub** for testing. [layout#Size-classes, #Adaptability]
20. **The Layout page now has no per-device screen-size tables.** Its old change-log rows for device specifications (for example 2025-09-09, iPhone 17 family) remain, but after the 2026-09-09 rewrite the page has no Specifications section. Other layout numbers still on the page:
    - tvOS safe area: 60 pt top and bottom, 80 pt at the sides.
    - visionOS: button centres at least 60 pt apart.
    - watchOS: at most 3 glyph buttons or 2 text buttons in a row.
    - macOS: don't put controls at the bottom of a window. [layout#Platform-considerations]
21. Scroll edge effects (Scroll views page: 2025-07-28 added, 2026-06-08 updated):
    - They exist on iOS, iPadOS and macOS.
    - Prefer `automatic`. It gives a more opaque separation for top toolbars with many controls, for text outside glass controls, and for pinned table headers.
    - Use one only when a scroll view sits behind floating UI. It is not decoration and does not block or darken like an overlay.
    - Use one per view. In split views, each pane can have its own, but keep them the same height.
    - Styles: `automatic`, `hard` (more opaque, sharp line) and `soft` (subtle blur).
    - WWDC25 356 said soft is the usual style on iOS/iPadOS and hard is mostly for macOS. **In iOS 27, `.automatic` no longer switches between soft and hard; it has its own look.** Revisit any overrides, especially `.soft` (WWDC26 278). [scroll-views#Scroll-edge-effects; /documentation/swiftui/scrolledgeeffectstyle]
22. Concentricity (WWDC25 356; adopting-liquid-glass#Controls):
    - There are three shape types: **fixed** (a constant radius), **capsule** (radius = half the height) and **concentric** (radius = parent radius − padding).
    - On a phone, near the screen edge, use a capsule with extra margin. On iPad and Mac, use a concentric shape that follows the window edge.
    - macOS controls: Mini, Small and Medium stay rounded rectangles; Large becomes a capsule; there is a new X-Large size.
    - APIs: `ConcentricRectangle`, `rect(corners:isUniform:)`, `UICornerConfiguration`, and in AppKit on macOS 27 `.containerConcentric` (WWDC26 289).
23. Other Liquid Glass layout changes (adopting-liquid-glass):
    - Sheets have a larger corner radius. Half sheets are inset from the display edge and become more opaque at full height.
    - Action sheets originate from their source control.
    - Lists, tables and forms have taller rows and more padding. Section headers use title-style capitalisation instead of all caps.
    - The iPad has a menu bar. On macOS the menu bar is 24 pt tall (the-menu-bar#Menu-bar-extras).

**Typography** (change log: 2025-12-16 added emphasized weights; no Liquid Glass–specific change to type)
24. Default / minimum text size: iOS and iPadOS 17 / 11 pt · macOS 13 / 10 · tvOS 29 / 23 · visionOS 17 / 12 · watchOS 16 / 12. Avoid Ultralight, Thin and Light weights. [typography#Ensuring-legibility]
25. iOS Dynamic Type at the default size, Large (size/leading in pt, weight → emphasized weight):
    - Large Title 34/41 Regular→Bold · Title 1 28/34 Regular→Bold · Title 2 22/28 Regular→Bold · Title 3 20/25 Regular→Semibold
    - Headline 17/22 Semibold→Semibold · Body 17/22 Regular→Semibold · Callout 16/21 · Subhead 15/20 · Footnote 13/18 · Caption 1 12/16 · Caption 2 11/13 (all Regular→Semibold)
    - Range: at xSmall, Body is 14/19; at AX5, Body is 53/62 and Large Title 60/70. [typography#Large-default, #AX5]
26. macOS text styles (size/line height; macOS has no Dynamic Type): Large Title 26/32 · Title 1 22/26 · Title 2 17/22 · Title 3 15/20 · Headline 13/16 Bold (emphasized Heavy) · Body 13/16 · Callout 12/15 · Subheadline 11/14 · Footnote 10/13 · Caption 1 10/13 (emphasized Medium) · Caption 2 10/13 Medium. [typography#macOS-built-in-text-styles]
27. SF Pro tracking for mockups (running apps apply it automatically), in pt: 11 +0.06 · 12 0 · 13 −0.08 · 15 −0.23 · 16 −0.31 · 17 −0.43 · 20 −0.45 · 22 −0.26 · 24 +0.07 · 28 +0.38 · **34 +0.40**. Tracking is negative from 13 to 23 pt and *positive* from 24 pt upward (and at 11 pt and below). [typography#SF-Pro]
28. WWDC25 356: system typography is "bolder and left-aligned" in key moments such as alerts and onboarding (from the talk, not the HIG page).

**The 27 releases (2026)**
29. Apple Newsroom (2026-06-08): Liquid Glass improves "legibility, customizability, and consistency", and there is a **new transparency slider in Settings**. WWDC26 269: glass "automatically responds to the new Liquid Glass slider to adjust its tint". Inactive iPad windows dim their icons and text, as on the Mac. Custom glass on macOS can be marked interactive.
30. **You can no longer opt out with the 27 SDKs.** The system *ignores* `UIDesignRequiresCompatibility` when an app is built for iOS, iPadOS, Mac Catalyst, macOS or tvOS 27 or later. [uidesignrequirescompatibility#Discussion] This confirms, from the primary source, the press claim in evidence.md that "Liquid Glass [is] mandatory in iOS 27".
31. macOS 27 (WWDC26 289):
    - Sidebars extend to the window edges, and the selected sidebar item uses semibold text.
    - Bordered toolbar items over the sidebar also become glass.
    - Glass controls can get a new "bounce on click" effect; use it only on controls.
32. Design kits: a 2026-06-23 news post announced iOS, iPadOS and macOS 27 design kits for Figma and Sketch, with Liquid Glass updates, more components and states, naming aligned with code, better resizing, and Dark Mode for macOS. The What's new page then lists "New iOS and iPadOS 27 UI Kit for Figma" and "New macOS 27 UI Kit for Figma" on 2026-09-17 (updated components, system colours, app icons). [design/whats-new; developer.apple.com/news/?id=e2lxw9l1]

## What it changes for the skills
- skills/design-studio/references/fundamentals/materials.md: State the two-layer model (glass = functional layer only; standard materials inside content), regular vs clear, the three conditions for clear, the 35% dimming, no glass on glass, and how glass behaves under the accessibility settings and the iOS 27 slider. Also state that Apple publishes no blur or opacity numbers, so any web or CSS rendering is a labelled approximation.
- skills/design-studio/references/platforms/ios.md: Build the iOS/iPadOS section on facts 1–13, 17–23 and 29–30. State that there is no opt-out with the 27 SDKs, that iPhone apps are resizable in iOS 27, that scroll edge effects replace opaque bars, and that section headers are title case.
- skills/design-studio/references/platforms/desktop.md: macOS 26/27 changes: glass sidebars reaching the window edges, control sizes and shapes (Mini–Medium rounded rectangles, Large capsule, X-Large), a hard-style scroll edge effect where text or table headers pin, menu bar 24 pt, no critical controls at the window bottom, and the macOS type ramp (fact 26).
- skills/design-studio/references/fundamentals/color.md: Replace the old iOS values (#007AFF etc.) with fact 14 and keep the light/dark/increased-contrast structure. Rules: tint only the background of the single primary action; controls monochrome by default; brand colour belongs in the content layer.
- skills/design-studio/references/fundamentals/typography.md: Use the default and minimum size table, the iOS and macOS text-style tables with emphasized weights, and the SF Pro tracking (positive from 24 pt upward).
- skills/design-studio/references/fundamentals/layout-and-spacing.md: The three concentric shape types and their radius rule; backgrounds extend under bars; background extension; one scroll edge effect per view.
- skills/design-studio/assets/mockup-kit/kit.json + kit.css: System colours from fact 14 and the type ramp from fact 25 with tracking from fact 27. The current kit's large title (`skills/design-product-ui/assets/mockup-kit/kit.css:60`) uses `letter-spacing:-0.02em` where the HIG gives +0.40 pt at 34 pt. Draw glass as an annotated material layer (`material: glass.regular | glass.clear + dim 35%`), never as an opaque bar. Take device sizes from somewhere other than HIG Layout (see open items).
- skills/design-studio/references/fundamentals/portable-mockups.md: Annotate materials by name (glass.regular / glass.clear / ultraThin…); don't draw platform glass with `backdrop-filter` as if it were the spec.
- skills/design-studio/references/fundamentals/anti-slop.md: Signs of a dated or wrong iOS/macOS mockup in 2026: glass in the content layer, glass on glass, every toolbar button tinted, opaque full-width bars, all-caps list section headers.
- skills/critique-design/references/heuristics.md: Checks: controls legible in the resting state; only one tinted primary action per bar; glass legible with Reduce Transparency / Increase Contrast.
- skills/implement-design/references/stacks.md: SwiftUI `glassEffect(_:in:)`, `Glass.regular/.clear/.identity`, `GlassEffectContainer`, `.buttonStyle(.glass/.glassProminent)`, `backgroundExtensionEffect()`, `scrollEdgeEffectStyle(_:for:)`, `safeAreaBar`, `ConcentricRectangle`; UIKit `UIGlassEffect`, `UIBackgroundExtensionView`; AppKit `NSGlassEffectView`.
- skills/design-studio/references/disciplines/brand.md: "Express brand colour in the content layer, not on controls" (fact 16).

## Not verified / open
- Apple publishes no blur radius, tint opacity or refraction numbers for Liquid Glass, and the only numeric rule is the 35% dimming layer. Any CSS numbers in the kit must be marked as an approximation.
- The exact range of the iOS 27 transparency slider and its default position are not in the HIG. The only sources are the Newsroom and WWDC26 269, and the HIG Materials page has no 2026 update. A secondary report of an "ultra clear to fully tinted" range remains unverified.
- It is not confirmed whether the HIG's "preferred look for Liquid Glass" setting and the iOS 27 slider are the same control.
- Device point sizes are no longer in the HIG Layout page, and it is not verified where Apple now publishes them. App Store Connect screenshot sizes (for example 6.9" 1320×2868 px) exist but are pixel sizes, not point sizes.
- The Figma and Sketch kit metrics (bar heights, glass insets, corner radii) were not read, because the kits need Figma or Sketch.
- The 2026-09-09 Layout rewrite was compared only against the change log, not against an archived earlier version, so text removed beyond the specification tables was not checked.
- `UIDesignRequiresCompatibility` is ignored "when you build for" the 27 releases. The doc does not say whether an app still built with the 26 SDK keeps compatibility mode when it runs on iOS 27.
