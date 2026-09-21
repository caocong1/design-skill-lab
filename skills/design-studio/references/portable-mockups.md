# Portable Mockups: One Design Language for Every Target

A designer's drawing tool is not the product's technology. Human designers
draw every platform in one canvas tool; this suite draws every platform in
**HTML, CSS and SVG**, rendered to PNG. That markup is also the most widely
understood description of an interface there is: any coding agent can read a
clean HTML/CSS mockup and rebuild it in Flutter, SwiftUI, Compose, ArkUI, a
mini-program, or a web framework.

So the design is made **once**, in a frame of the target's size and
conventions. Building it in the target stack is the implementer's job. Precise
per-language guidance (`../../implement-design/references/stacks.md`) makes the
translation better; it is an optimisation, never a precondition for designing.

## What Changes per Target, and What Does Not

| Stays the same | Changes with the target |
| --- | --- |
| brief, direction, hierarchy, tokens, type and colour systems, states, copy | frame size and safe areas |
| the mockup medium (HTML / CSS / SVG -> PNG) | navigation structure and system bars (tab bar, app bar, capsule, title bar, menu bar) |
| the review method (render, look, critique) | platform conventions and gestures (`../../design-product-ui/references/platforms.md`) |
| the handoff contract | default typeface, icon system, minimum target size |
| | density and input mode (touch, pointer, keyboard, remote, viewing distance) |

One product on several targets is **one design language, re-composed** per
target - never a phone layout stretched onto a desktop, and never iOS chrome on
Android.

## Units: Draw at the Logical Size

Draw at the target's logical size and every number reads across one-to-one:

| Target | 1 CSS px in the mockup equals | Typical frame (perishable) |
| --- | --- | --- |
| iOS / iPadOS | 1 pt | 393 x 852 phone; 820 x 1180 tablet |
| Android | 1 dp (text: 1 sp) | 412 x 915 or 360 x 800 phone; 840+ wide for tablets and foldables |
| HarmonyOS | 1 vp (text: 1 fp) | about 360 x 780 phone - verify against the official guideline |
| Flutter | 1 logical pixel | the host platform's frame |
| WeChat and other mini-programs | 2 rpx at the 375-wide design width (750 rpx = screen width) | 375 x 812 |
| Desktop (macOS, Windows, Electron, Tauri) | 1 px / 1 pt at 100% scale | 1200 x 760 window; state the minimum window size |
| Web | 1 CSS px | 390, 768, 1280, 1920 wide |
| Data wall | 1 physical pixel of the wall | the wall's native resolution, scaled uniformly |

Frames, bars and the mini-program capsule keep-out zone are provided by the
mockup kit: `../../design-product-ui/assets/mockup-kit/kit.css`, demonstrated
in `../../design-product-ui/assets/mockup-kit/demo.html`.

## The Portable Subset

Write mockups so that they translate. The test: could an implementer rebuild
this screen from the markup alone, in a toolkit that has rows, columns, stacks,
scroll views, text, images and decorated boxes?

**Do**

- Lay out with **flexbox**: rows and columns with `gap`, `padding`, `flex`,
  alignment. Every native toolkit has the same model.
- Use `position: absolute` only for true overlays (badges, floating buttons,
  sheets): it becomes a stack with a positioned child.
- Keep fixed bars **outside** the scrolling region, as siblings. That is how
  every native scaffold works.
- Express every colour, size, radius, shadow, duration and easing as a **token**
  (CSS custom property) declared once. Tokens are what the implementer maps
  to a theme; raw values are what they have to guess at.
- Name components and states in the markup:
  `data-component="DeviceRow"`, `data-status="warn"`, `data-state="loading"`,
  `aria-current`, `disabled`. These names become widget and variant names.
- Use real text elements with real, realistic content - including the longest
  plausible strings and mixed scripts.
- Use text **styles** from the type scale, a handful of them, by class or token.
- Icons as inline SVG or a named icon from the chosen family
  (`data-icon="server"`), so the implementer can use the platform's package.
- One static HTML file per screen or flow, with states reachable by a query
  parameter or a small switcher, so each state can be rendered and handed over
  as its own PNG.

**Avoid** (each of these costs the implementer a guess)

- CSS Grid with implicit placement, spanning tracks or `auto-fit` magic for
  app screens - say it with nested rows and columns. (Grid is fine for web
  targets.)
- Content or meaning in pseudo-elements, `::before` text, CSS counters.
- Layout that only works through selector tricks: `:has()`, sibling
  combinators that restyle distant elements, `:nth-child` patterns carrying
  meaning.
- Floats, negative margins, `calc()` chains, percentage heights that depend on
  an unstated parent.
- Effects with no cheap native equivalent as load-bearing parts of the design:
  `mix-blend-mode`, `backdrop-filter` on large areas, complex `clip-path`,
  CSS filters, text gradients. If the design needs one, say so in the handoff
  and give the fallback.
- Hover-only affordances on touch targets.
- Magic numbers. If a value is not on the scale, either it should be, or it
  needs a sentence of explanation.
- Web fonts the target cannot ship. State the platform face, or the licensed
  brand face and its files.

## How Concepts Map

The implementer chooses the API; the designer only has to stay inside concepts
that exist everywhere.

| Mockup | Flutter | SwiftUI | Compose | ArkUI | Mini-program |
| --- | --- | --- | --- | --- | --- |
| flex row / column + `gap` | `Row` / `Column` + spacing | `HStack` / `VStack(spacing:)` | `Row` / `Column` + `Arrangement.spacedBy` | `Row` / `Column` + `space` | `view` with `display:flex` |
| `flex: 1` | `Expanded` | `frame(maxWidth: .infinity)` / `Spacer` | `Modifier.weight(1f)` | `layoutWeight(1)` | `flex: 1` |
| `position: absolute` in a relative box | `Stack` + `Positioned` | `ZStack` / `overlay` | `Box` + `align` / `offset` | `Stack` / `overlay` | `position: absolute` |
| scrolling region | `ListView` / `SingleChildScrollView` | `ScrollView` / `List` | `LazyColumn` | `List` / `Scroll` | `scroll-view` |
| decorated box (fill, border, radius, shadow) | `DecoratedBox` / `Container` | `background` + `clipShape` + `shadow` | `Modifier.background / border / clip / shadow` | `backgroundColor / border / borderRadius / shadow` | WXSS |
| text style token | `TextTheme` entry | `Font` / text style | `Typography` entry | font size + weight resources | WXSS class |
| colour token | `ColorScheme` / `ThemeExtension` | asset-catalogue colour | `ColorScheme` / `CompositionLocal` | `resources/.../color.json` via `$r()` | CSS variable on `page` |
| `data-state` variants | widget parameters / states | view state | state hoisting | `@State` / `stateStyles` | `data` + `wx:if` |
| transition token (duration + easing or spring) | `AnimatedFoo`, curves, `SpringSimulation` | `withAnimation`, `.spring` | `animate*AsState`, `spring()` | `animateTo`, curves | `wx.createAnimation` / CSS transition |
| system bars in the frame | `Scaffold`, `NavigationBar`, `SafeArea` | `NavigationStack`, `TabView` | `Scaffold`, `NavigationBar` | `Navigation`, `Tabs` | `app.json` window and tabBar, custom nav + capsule rect |

Where the platform has a **system component** for something (navigation bar,
tab bar, sheet, date picker, switch, alert), the mockup shows its position and
content and the handoff says "use the system component" - do not hand over a
custom re-drawing of native chrome.

## Fidelity Limits to State Honestly

- Text renders with the fonts of the machine that produced the PNG. A mockup
  of an Android screen drawn on a Mac shows a different face from the device.
  Spacing and hierarchy survive; exact line breaks do not. Say which face the
  target will really use.
- Native controls in a mockup are approximations of the platform's own look.
  The frame says *which* control goes *where*; the platform decides how it is
  drawn.
- Materials, haptics, scroll physics and gesture feel cannot be judged from a
  still. Prototype motion separately (`../../design-motion/SKILL.md`) and tune
  on a device.
- If a UI generation service or an image model is available in the host, its
  output can serve as a faster sketch, but the handoff still needs the token
  and structure discipline above.
