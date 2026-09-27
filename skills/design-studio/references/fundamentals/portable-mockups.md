---
title: Portable mockups (one design language for every target)
evidence: practice
sources: [apple-hig-liquid-glass, apple-hig-bars, material-3-expressive, harmonyos-design, wechat-miniprogram-design-guidelines, fluent-2, wcag-22]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Portable mockups

A designer's drawing tool is not the product's technology. Human designers draw every platform in
one canvas tool; this suite draws every platform in HTML, CSS and SVG, rendered to PNG. That markup
is also the most widely understood description of an interface: any coding agent can read a clean
HTML/CSS mockup and rebuild it in Flutter, SwiftUI, Compose, ArkUI, a mini-program or a web
framework.

So the design is made once, in a frame of the target's size and conventions. Building it in the
target stack is the implementer's job. Per-stack guidance
([stacks](../../../implement-design/references/stacks.md)) makes the translation better; it is an
optimisation, never a precondition for designing.

## What changes per target, and what does not

| Stays the same | Changes with the target |
| --- | --- |
| brief, direction, hierarchy, tokens, type and colour systems, states, copy | frame size and safe areas |
| the medium (HTML / CSS / SVG to PNG) | navigation structure and bars (tab bar, toolbar, app bar, capsule, title bar, menu bar), and whether they float |
| the review method (render, look, critique) | platform conventions and gestures ([platforms](../platforms/README.md)) |
| the handoff contract | default typeface, icon system, minimum target size, system materials |
| | density and input mode (touch, pointer, keyboard, remote, viewing distance) |

One product on several targets is one design language, re-composed per target: the primary action
moves to where each platform puts it, a list becomes a table with a toolbar on desktop. Never a
phone layout stretched onto a desktop, never iOS chrome on Android, never the same content stamped
into four frames with only the bars swapped.

## Units: draw at the logical size

Draw at the target's logical size and every number reads across one to one. Frames are perishable;
exact frame and bar metrics, with sources, are in [kit.json](../../assets/mockup-kit/kit.json).

| Target | 1 CSS px in the mockup equals | Default frame |
| --- | --- | --- |
| iOS, iPadOS | 1 pt | 402 × 874 phone (iPhone 17 and 17 Pro), 420 × 912 (iPhone Air), 820 × 1180 tablet; Apple no longer publishes device tables, so design by width class and check a narrow phone too |
| Android | 1 dp (text: 1 sp) | 412 × 915 or 360 × 800 phone; 840 and wider for tablets and open foldables |
| HarmonyOS | 1 vp (text: 1 fp) | 366 × 809 (Mate 80) or 359 × 789 (Pura 80) phone; 737 × 805 open foldable |
| Flutter | 1 logical pixel | the host platform's frame |
| WeChat and other mini-programs | 2 rpx at the 375-wide design width (750 rpx = screen width) | 375 × 812 for a fixed layout that scales; 390 wide when the page adapts per size |
| Desktop (macOS, Windows, Electron, Tauri) | 1 pt or 1 px at 100 % scale | 1200 × 760 window; state the minimum window size |
| Web | 1 CSS px | the capture sizes in [render-and-look](../process/render-and-look.md) |
| Embedded pane, chat-host widget | 1 CSS px | the host's container width ([embedded-hosts](../platforms/embedded-hosts.md)) |
| Data wall | 1 physical pixel of the wall | the wall's native resolution, scaled uniformly |

Frames, bars, the mini-program capsule keep-out zone and a labelled glass approximation come from
the mockup kit: [kit.css](../../assets/mockup-kit/kit.css), demonstrated in
[demo.html](../../assets/mockup-kit/demo.html).

## The portable subset

Write mockups so that they translate. The test: could an implementer rebuild this screen from the
markup alone, in a toolkit that has rows, columns, stacks, scroll views, text, images and decorated
boxes?

**Do**

- Lay out with flexbox: rows and columns with `gap`, `padding`, `flex` and alignment. Every native
  toolkit has the same model.
- Use `position: absolute` only for true overlays (badges, floating buttons, sheets): it becomes a
  stack with a positioned child.
- Structure every screen as a scaffold: the content region and the bars are siblings, and no bar
  lives inside the scrolling content. That is how every native scaffold is built.
- Where the target's bars float (the iOS 26 tab bar and toolbars, HarmonyOS 6.1 floating tabs, M3
  Expressive floating toolbars), let the content region run the full height beneath them:
  - render the screen twice: at rest (top of content, the state Apple requires to stay legible)
    and scrolled (content visibly passing under the bar);
  - pad the end of the content by the bar's height plus its margin so the last row scrolls clear,
    and set `scroll-padding` to match so a focused element is never hidden
    ([accessibility](accessibility.md));
  - show the separation the platform draws (the iOS scroll-edge effect, the HarmonyOS gradient mask
    about 16 vp above the bar) as part of the labelled material.
  Where a bar is opaque (the mini-program native tab bar, the M3 navigation bar, a Windows title
  bar), the content region stops at it. System bars (status bar, gesture bar, home indicator) are
  neither: backgrounds run under them and content is padded by the safe-area insets.
- Draw glass and other system materials as a labelled approximation: the kit's glass style (a
  translucent fill with a modest blur), the role named in the markup
  (`data-material="<role>"`, roles in [materials](materials.md)), and a visible caption in review
  renders saying the platform draws it. The handoff names the role and the platform material
  (regular or clear Liquid Glass, a 沉浸光感 level, Mica or Acrylic), never a blur radius.
- Express every colour, size, radius, shadow, duration and easing as a token (a CSS custom property)
  declared once. Tokens are what the implementer maps to a theme; raw values are what they guess at.
- Name components and states in the markup: `data-component="DeviceRow"`, `data-status="warn"`,
  `data-state="loading"`, `aria-current`, `disabled`. These names become widget and variant names.
- Use real text elements with realistic content, including the longest plausible strings and mixed
  scripts, set in a handful of text styles from the type scale.
- Icons as inline SVG or a named icon from the chosen family (`data-icon="server"`), so the
  implementer can use the platform's package.
- One static HTML file per screen or flow, with states and themes reachable by query parameter
  (`?state=empty-first&theme=dark`) or a small switcher, so each renders and hands over as its own PNG.

**Avoid** (each costs the implementer a guess)

- CSS Grid with implicit placement, spanning tracks or `auto-fit` magic on app screens: say it with
  nested rows and columns. Grid is fine for web targets.
- Content or meaning in pseudo-elements, `::before` text or CSS counters.
- Layout that only works through selector tricks: `:has()`, sibling combinators that restyle distant
  elements, `:nth-child` patterns that carry meaning.
- Floats, negative margins, `calc()` chains, percentage heights that depend on an unstated parent.
- Load-bearing effects with no cheap native equivalent: `mix-blend-mode`, complex `clip-path`, CSS
  filters, text gradients. If the design needs one, say so in the handoff and give the fallback.
  Blur and glass are not on this list: they are system materials, drawn as above.
- Hover-only affordances on touch targets.
- Magic numbers. A value off the scale either belongs on it or needs a sentence of explanation.
- Web fonts the target cannot ship. State the platform face, or the licensed brand face and its
  files ([typography](typography.md)).

## How concepts map

The implementer chooses the API; the designer only has to stay inside concepts that exist
everywhere.

| Mockup | Flutter | SwiftUI | Compose | ArkUI | Mini-program |
| --- | --- | --- | --- | --- | --- |
| flex row / column + `gap` | `Row` / `Column` + spacing | `HStack` / `VStack(spacing:)` | `Row` / `Column` + `Arrangement.spacedBy` | `Row` / `Column` + `space` | `view` with `display: flex` |
| `flex: 1` | `Expanded` | `frame(maxWidth: .infinity)` / `Spacer` | `Modifier.weight(1f)` | `layoutWeight(1)` | `flex: 1` |
| `position: absolute` in a relative box | `Stack` + `Positioned` | `ZStack` / `overlay` | `Box` + `align` / `offset` | `Stack` / `overlay` | `position: absolute` |
| scrolling region | `ListView` / `SingleChildScrollView` | `ScrollView` / `List` | `LazyColumn` | `List` / `Scroll` | `scroll-view` |
| decorated box (fill, border, radius, shadow) | `DecoratedBox` / `Container` | `background` + `clipShape` + `shadow` | `Modifier.background / border / clip / shadow` | `backgroundColor / border / borderRadius / shadow` | WXSS |
| text style token | `TextTheme` entry | `Font` / text style | `Typography` entry | font size and weight resources | WXSS class |
| colour token | `ColorScheme` / `ThemeExtension` | asset-catalogue colour | `ColorScheme` / `CompositionLocal` | `resources/.../color.json` via `$r()` | CSS variable on `page` |
| `data-state` variants | widget parameters / states | view state | state hoisting | `@State` / `stateStyles` | `data` + `wx:if` |
| transition token (duration and easing, or spring) | `AnimatedFoo`, curves, `SpringSimulation` | `withAnimation`, `.spring` | `animate*AsState`, `spring()` | `animateTo`, curves | `wx.createAnimation` / CSS transition |
| bars in the frame | `Scaffold`, `NavigationBar`, `SafeArea` | `NavigationStack`, `TabView` | `Scaffold`, `NavigationBar`, `NavigationRail` | `Navigation`, `Tabs` / `HdsTabs` | `app.json` window and tabBar; custom nav placed with `wx.getMenuButtonBoundingClientRect()` |
| content under a floating bar | `Scaffold(extendBody: true)` | system `TabView` (floats and minimises itself), `.safeAreaInset(edge:)` | `Scaffold` inner padding, `HorizontalFloatingToolbar` (material3 1.5 alpha) | `HdsTabs` floating style, `barOverlap(true)`, `expandSafeArea` | custom tabBar with `position: fixed` and bottom padding |
| system material role | `BackdropFilter` (an approximation; no platform glass) | `.glassEffect()` on the functional layer, `.regularMaterial` in the content layer | tonal `surfaceContainer*` roles | `systemMaterial` / `hdsMaterial` levels | an opaque fill |

Where the platform has a system component (navigation bar, tab bar, sheet, date picker, switch,
alert), the mockup shows its position and content, and the handoff says "use the system component".
Never hand over a custom redrawing of native chrome.

## Fidelity limits to state honestly

- Text renders with the fonts of the machine that produced the PNG. An Android screen drawn on a Mac
  shows a different face from the device: spacing and hierarchy survive, exact line breaks do not.
  Say which face the target really uses.
- Native controls in a mockup approximate the platform's own look. The frame says which control goes
  where; the platform decides how it is drawn.
- Materials (glass refraction, 沉浸光感 light response, Mica tint), haptics, scroll physics and
  gesture feel cannot be judged from a still. The glass approximation shows layering and legibility
  risk, not the material: check text contrast on the rendered backdrop and say that the device will
  differ. Prototype motion separately ([motion](../disciplines/motion.md)) and tune on a device.
- A UI generator or an image model can produce a faster sketch
  ([image-generation](../process/image-generation.md)), but the handoff still needs the token and
  structure discipline above.
