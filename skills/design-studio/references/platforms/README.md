---
title: Platforms (posture, what a target changes, cross-platform checklist)
evidence: digest
sources: [apple-hig-liquid-glass, apple-hig-bars, apple-macos-touch, material-3-expressive, harmonyos-design, harmonyos-motion-curves, wechat-miniprogram-design-guidelines, alipay-miniprogram-design, web-baseline-2026, mcp-apps, openai-apps-sdk-ui, embedded-host-guidelines]
reviewed: 2026-11-01
review_by: 2027-01-30
---

# Platforms

Users bring habits from their platform: back behaviour, swipe gestures, system fonts, sheet
behaviour, menu bars, context menus, the mini-program capsule. Honouring them is cheaper than
teaching new ones; deviate only with a reason the user benefits from.

This folder owns each target's chrome, navigation, components and numbers. Read this file, then the
one target file the surface needs. How the design is drawn (frames, units, the portable subset) is in
[portable-mockups](../fundamentals/portable-mockups.md); how it is coded is the implementer's concern
([stacks](../../../implement-design/references/stacks.md)), never a limit on what can be designed.

| File | Target | Digests |
| --- | --- | --- |
| [ios](ios.md) | iOS, iPadOS 26-27 (Liquid Glass), iPhone Duo | apple-hig-liquid-glass, apple-hig-bars |
| [android](android.md) | Android 16-17, Material 3 Expressive | material-3-expressive |
| [harmonyos](harmonyos.md) | HarmonyOS 6.x-7 (沉浸光感, floating tabs, motion), phone to PC | harmonyos-design, harmonyos-motion-curves |
| [mini-programs](mini-programs.md) | WeChat, Alipay, Douyin, Kuaishou, Baidu mini-programs | wechat-miniprogram-design-guidelines, alipay-miniprogram-design |
| [desktop](desktop.md) | Windows 11 (Fluent 2), macOS 26-27 incl. touch Macs, Electron and Tauri | fluent-2, apple-hig-liquid-glass, apple-hig-bars, apple-macos-touch |
| [web](web.md) | web apps and sites, PWA, Baseline capability table | web-baseline-2026 |
| [embedded-hosts](embedded-hosts.md) | Office and WPS add-ins, extension panels, IDE panels, chat-host widgets | mcp-apps, openai-apps-sdk-ui, embedded-host-guidelines |

## Perishable numbers

Platform numbers and component names change with OS releases. Each file carries `review_by` in its
frontmatter, and the numbers come from dated digests in the lab (`research/sources/<id>.md`, same
ids as in `sources:`; the mobile, web and host digests are due for review on 2026-12-26, fluent-2 on 2027-09-27).

1. Before a number goes into a spec, check the file's `review_by`. Past it, or for any number the file
   does not give, open the official page: `python3 "$S/catalog.py" find --section app-ui:platform-guidelines` (`S` = `skills/design-studio/scripts`).
2. Apple HIG, Material 3 and the HarmonyOS guide are JS apps: use a browser tool, or the JSON routes
   given at the top of [ios](ios.md), [android](android.md) and [harmonyos](harmonyos.md).
3. Never quote a platform number from memory. A value from a UI kit the lab has not read (Apple's
   Figma bar heights, for example) is labelled "approximation" in the mockup and stays out of the
   handoff; the handoff names the system component instead.
4. Facts marked † in a platform file were checked on the official developer docs but are not yet in
   a digest.

## Decide the posture first

| Posture | Means | When |
| --- | --- | --- |
| Native | platform controls, navigation, typography, gestures, materials, motion | utilities, OS-integrated apps, anything that should feel like part of the device |
| Branded-native | native structure and behaviour; brand colour, type and illustration | most consumer apps |
| Cross-platform custom | one custom system on every platform | content and brand products, games; still obey back behaviour, safe areas, text scaling and accessibility APIs |

Write the posture in the brief. It sets the motion default ([motion](../disciplines/motion.md)), the
type ([typography](../fundamentals/typography.md), native targets) and the materials
([materials](../fundamentals/materials.md)).

**Do not mix idioms inside one app**: no iOS back chevron with a "Back" label on Android screens that
answer system back differently; no Material FAB on an otherwise native iOS screen; no HarmonyOS
floating capsule tab bar on Android; no custom mini-program navigation that imitates the capsule. A
cross-platform custom system still re-composes per target: the primary action moves to where each
platform puts it.

## What a target changes

A target changes the frame, the conventions and the constraints, never the method or the bar. What
stays and what changes is listed in [portable-mockups](../fundamentals/portable-mockups.md); where
each changing thing is specified:

| Changes | Owner |
| --- | --- |
| Frame, logical units, safe areas, floating vs opaque bars in the drawing | [portable-mockups](../fundamentals/portable-mockups.md) |
| Navigation, bars, back, search placement, primary action, gestures, system components, platform type scale and colours | the target file |
| Breakpoints, grids, minimum target sizes | [layout-and-spacing](../fundamentals/layout-and-spacing.md) |
| Contrast minima | [color](../fundamentals/color.md) |
| Glass, 沉浸光感, Mica, tonal surfaces as roles | [materials](../fundamentals/materials.md) |
| Motion defaults and springs | [motion](../disciplines/motion.md), [motion-tokens](../disciplines/motion-tokens.md) |
| UI icons; app icons | [icons](../disciplines/icons.md), [app-icons](../disciplines/app-icons.md) |
| State matrix, forms, navigation structure by job | [product-ui](../disciplines/product-ui.md) |

**The same job on each mobile target** (names only; rules and numbers are in the target file):

| Job | iOS, iPadOS | Android | HarmonyOS | WeChat mini-program |
| --- | --- | --- | --- | --- |
| Top-level destinations, phone | floating glass tab bar | flexible navigation bar | bottom tabs, floating capsule or flat | native tab bar, home page only |
| Wide window | tab bar that becomes a sidebar | expanded navigation rail | side tabs; Navigation split | large-screen sub-guide (not read) |
| Back | back symbol, no label; edge swipe | system back with predictive animation | back control, system back | top-left back; iOS swipe, Android back key |
| The screen's primary action | one prominent (tinted) toolbar item, trailing | FAB, or a FAB menu of 2-6 | not fixed by the guide; place it in the layout | in the page, clear of the capsule |
| Other screen actions | toolbar groups | app bar actions, docked or floating toolbar | title-bar buttons, toolbar | in the page |
| Search | search tab, bottom or top toolbar, or inline | search app bar | search box | in the page |
| Floating chrome material | Liquid Glass | none: tonal surfaces | 沉浸光感 levels | opaque |
| System face, text unit | SF Pro, Dynamic Type | Roboto, sp | HarmonyOS Sans, fp | system font |
| System icons | SF Symbols | Material Symbols | HarmonyOS Symbol | your family |

## Changed in the last release

As of 2026-11-01; each file's own box has the detail.

| Target | Headline |
| --- | --- |
| [iOS, iPadOS](ios.md) | 26: Liquid Glass functional layer, floating tab bar that minimises, trailing search tab, toolbar groups with one prominent action. 27: no opt-out with the 27 SDKs, transparency slider, iPhone apps resizable (size classes, not devices), prominent tab, iPhone sidebars, iPhone Duo side bars. The HIG no longer lists device sizes |
| [Android](android.md) | M3 Expressive: 64 dp flexible navigation bar, expanded rail replaces the drawer, docked and floating toolbars replace the bottom app bar, button groups, split button, FAB menu, springs. Target SDK 36: no edge-to-edge opt-out, predictive back animations on †. Android 17: no large-screen orientation opt-out. Compose material3 1.5.0 (beta) carries the Expressive parts; Views are in maintenance |
| [HarmonyOS](harmonyos.md) | Guide release 2026-06-12: 沉浸光感 material with user strength and five levels; HarmonyOS 6.1 floating 56 vp capsule tabs beside the flat 48 vp bar; large-screen standard no longer requires side navigation. HarmonyOS 7 = API 26 (uiMaterial); transition floors of 200 / 250 / 300 ms by screen size are required |
| [Mini-programs](mini-programs.md) | 375 px canvas = fixed and scaled, 390 px = responsive; 适老化 reads `wx.getAppBaseInfo`, care mode × 1.4 |
| [Desktop](desktop.md) | macOS 27: sidebars reach the window edges, the selected sidebar item is semibold, bordered toolbar items over the sidebar become glass; touch Macs (2026-11): same density, larger hit areas, no hover-only controls |
| [Web](web.md) | The capability table (section 4) was re-read against web-features 3.44.0; `light-dark()` needs a fallback block until the host's browsers all support it; status, dates and fallbacks are kept there only |
| [Embedded hosts](embedded-hosts.md) | MCP Apps is a stable MCP extension (spec 2026-01-26), now in 12 hosts plus Gemini Enterprise; OpenAI's UI guidelines sit under "Plugins" and run on MCP Apps; Office, VS Code and Chrome pane rules come from the hosts' own docs |

## Cross-platform checklist

Run it for every target in the brief; each target gets its own screenshots and is judged in its own
frame.

- **Back**: the system back (gesture, key, predictive preview) does the obvious thing everywhere; no
  custom back control fights it.
- **Safe areas and floating bars**: backgrounds run under system bars; content is inset; floating
  bars let content pass beneath and the last row scrolls clear; the mini-program capsule is kept
  clear.
- **Navigation form per window class**: bar, rail or sidebar; actions never in the tab bar; one tab
  bar per screen.
- **Search**: placed where that platform puts it (table above).
- **Text scaling**: Dynamic Type, font scale, fp, 适老化 steps; one large-text render per key screen.
- **Appearance**: light, dark, increased contrast; Reduce Transparency and the 沉浸光感 弱 strength
  where materials are used; reduced motion.
- **Targets** per platform ([layout-and-spacing](../fundamentals/layout-and-spacing.md)); pointer
  and keyboard on tablets and desktops; no hover-only affordance on touch, touch Macs included.
- **System services**: the platform's share sheet, pickers, permission prompts and keyboard types,
  not look-alikes.
- **Right-to-left** if it ships; in iPhone Duo split view each app keeps its bars on its outer edge in RTL too.
- **Screen readers**: every icon-only control has a label, and icon-only toolbar items also a title.
- **Store and review rules for UI**: HarmonyOS UX standards, WeChat capsule and tab rules, Apple
  and Google guidelines; flag any rule the design bends.
- **Code availability**: a design that uses components the stable toolkit lacks says so in the
  handoff (M3 Expressive: [android](android.md)).
