---
title: Web apps and sites (browser platform, Baseline capabilities)
evidence: digest
sources: [web-baseline-2026, clreq-chinese-text-layout, vercel-web-interface-guidelines, emil-kowalski-skills, wcag-22, accessibility-law]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Web

The browser is the platform. Its conventions (links, Back, the URL, zoom, text selection, the user's
preferences) are what users bring; a web design that breaks them is broken, however it looks.

This file owns the browser-platform rules, mobile-web viewport and keyboard handling, installed web
apps (PWA), and the **Baseline capability table** (section 4): the only place a web feature's
support status, Baseline year or date is written. Other files state the design or build
implication and link here. Elsewhere:

- Target posture and the cross-platform checklist: [platforms](README.md). Breakpoints, grids and
  target sizes: [layout-and-spacing](../fundamentals/layout-and-spacing.md).
- Overlay contract, forms, state matrix: [product-ui](../disciplines/product-ui.md). Page archetypes:
  [marketing-sites](../disciplines/marketing-sites.md). Motion technique per need:
  [motion](../disciplines/motion.md) §4. CSS as design material: [modern-css](../fundamentals/modern-css.md).
- Web inside another app (Office pane, side panel, chat widget): [embedded-hosts](embedded-hosts.md).
  Desktop shells (Electron, Tauri): [desktop](desktop.md).
- How to build it: [implement-design stacks](../../../implement-design/references/stacks.md).

## 1. The browser is the platform

- **URL as state.** Which view state belongs in the URL is set in [product-ui](../disciplines/product-ui.md)
  (navigation). The web deliverable is the URL schema per surface: the path names the object, the
  query holds view state, nothing secret or personal appears, and Back and Forward restore state and
  scroll position. Every designed state is reachable by URL, which is also how the capture round
  shoots it ([render-and-look](../process/render-and-look.md)).
- **Links are links.** Navigation is `<a>`, never a button or a clickable `div`, so open-in-new-tab,
  copy link and middle-click work. Actions are buttons.
- **Zoom is never disabled.** No `user-scalable=no`, no `maximum-scale=1` (lint flags both). Content
  survives 200 % text and reflows at 320 CSS px, which is 1280 px at 400 % zoom, with no
  two-dimensional scrolling ([accessibility](../fundamentals/accessibility.md) owns the criteria).
- **Text is selectable** in content. `user-select: none` belongs only on the chrome of app-like UIs
  ([desktop](desktop.md)).
- **Native controls** unless there is a reason. A dark theme sets `background-color` and `color` on
  native `<select>`, or its popup renders light on Windows.
- **Focus**: `:focus-visible` on everything interactive; sticky headers, footers and banners never
  cover the focused element (WCAG 2.4.11).
- **Hover is an extra.** Every hover reveal has a touch and a keyboard path. Switch hover-only
  affordances with `@media (hover: hover)` and `(pointer: fine)`, never with user-agent sniffing.
- **Language** comes from `Accept-Language` / `navigator.languages`, never from IP or location; offer a
  visible switch. Brand names and code tokens carry `translate="no"`.
- **Width range**: design from 320 px to ultra-wide. Check ultra-wide by zooming the browser out to
  50 %; check for accidental scrollbars with macOS "Show scroll bars: Always".

## 2. Mobile web: viewport, keyboard, input

- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`, plus an
  `interactive-widget` choice (below).
- `env(safe-area-inset-*)` is 0 unless `viewport-fit=cover` is set. Anything that touches a screen
  edge (bottom bar, full-bleed header, floating button) pads by the inset.
- Heights: `100dvh` for app shells, `100svh` for heroes (with `dvh` a hero jumps as the URL bar
  collapses). Never `100vh` on mobile.
- **The on-screen keyboard.** By default iOS Safari and Android Chrome (since Chrome 108) resize only
  the visual viewport, so the layout does not shrink when the keyboard opens.
  `interactive-widget=resizes-content` makes Android Chrome shrink the layout viewport too, so `dvh`
  layouts and bottom-pinned inputs follow the keyboard there. It does **not** give iOS parity.
  The VirtualKeyboard API (`navigator.virtualKeyboard.overlaysContent`, `env(keyboard-inset-*)`) is
  Chromium only: enhancement.
- **Design duty:** draw the keyboard-open state of every screen with a bottom-pinned input or action
  (chat composer, checkout bar, comment box, sign-in): what stays above the keyboard, where the
  primary action goes, and the focused field fully visible.
- Inputs at **16 px or more** on mobile, or iOS Safari zooms on focus. Fix it with the font size,
  never with the viewport meta.
- Per field: `type`, `inputmode` and `autocomplete`; spellcheck off for emails, codes and usernames;
  paste allowed; password-manager and one-time-code friendly. Field rules: [product-ui](../disciplines/product-ui.md).
- `touch-action: manipulation` on controls; a deliberate `-webkit-tap-highlight-color`;
  `overscroll-behavior: contain` in modals and drawers so the page behind does not scroll.
- `color-scheme` on `html` and a `theme-color` that matches the page background, per scheme: the
  browser's own chrome is part of the design.
- Chinese elder-friendly (适老化) mobile web has its own floor, such as at least one font size of
  18 dp/pt or more: [accessibility](../fundamentals/accessibility.md).

## 3. Installed web apps (PWA)

- Icons: an install-worthy set, maskable included ([app-icons](../disciplines/app-icons.md)).
- **Standalone window**: there is no browser Back button and no URL bar. Deep screens get their own
  back affordance; where people shared the URL, add a share or copy-link action. `theme-color` tints
  the window's title bar.
- **Offline is a designed state** (the offline row of the [state matrix](../disciplines/product-ui.md)):
  what stays readable from cache and is marked stale, what is queued with a pending marker, how sync
  progress and conflicts show, and how the user retries. Never the browser's error page.
- **Window Controls Overlay** (desktop, Chromium only): with `display_override:
  ["window-controls-overlay"]` the app draws into the title-bar area inside `env(titlebar-area-x | y |
  width | height)`. Keep a drag region, keep the caption buttons' area clear, and draw the standard
  title-bar layout as the fallback. Title-bar conventions per OS: [desktop](desktop.md).

## 4. Baseline capability table

Status from web-features 3.40.0 (2026-09-24). **Baseline YYYY** = newly available that year: in
every core browser (Chrome desktop and Android, Edge, Firefox desktop and Android, Safari macOS and
iOS), but not yet in every user's hands. **Widely** = 30 months after that date. **Limited** = one
or more core engines missing (named). Before relying on a Baseline 2025-2026 row, read the host's
browser matrix (browserslist, old in-app WebViews, embedded hosts) and treat the row as needing a
fallback there.

How to use a row: "none needed" = specify it natively; a fallback = draw or specify that fallback
too; "enhancement" = the design must be complete without it.

**Overlays and positioning**

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| `popover` (`auto` / `manual`) | Baseline 2025 (Jan) | menus, toggletips, pickers, non-modal panels are native popovers: top layer, light dismiss for `auto`, Esc, focus return; the spec says auto or manual per overlay | none needed |
| `popover="hint"`; interest invokers (hover-triggered) | limited: `hint` no Safari; interest invokers Chrome only | hover tooltips are not native yet | a scripted tooltip that meets WCAG 1.4.13: dismissible, hoverable, persistent |
| Invoker commands (`command` + `commandfor`) | Baseline 2025 (Dec; Safari 26.2) | a button opens or closes a dialog or popover declaratively; the spec names the command (`show-modal`, `close`, `request-close`, `toggle-popover`) | a click handler |
| `<dialog>` modal; `inert` | widely | modals are `<dialog>`; everything behind is inert | none needed |
| `<dialog closedby>` | limited: no Safari | light dismiss for dialogs is not portable | a visible close button and Esc on every dialog |
| Anchor positioning (`anchor()`, `position-area`, `position-try-fallbacks`) | core properties Baseline 2026 (Jan); `position-visibility` Safari 27 only | tooltips, menus, coach marks declare placement plus a fallback order: draw the primary and the flipped placement | a scripted positioner; animating anchored elements is enhancement |
| Exclusive accordion `<details name>`; `::details-content` | Baseline 2024 (Sep); Baseline 2025 (Sep) | native accordions, styleable and animatable open state | none needed |
| `hidden="until-found"` | limited: no Safari | find-in-page into collapsed sections | content that matters stays open or reachable by the app's search |

**Motion** (technique per need: [motion](../disciplines/motion.md) §4)

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| Same-document view transitions; `view-transition-class` | Baseline 2025 (Oct) | state changes and shared-element transitions within a page are standard web motion | plain state change; cross-fade or none under reduced motion |
| Element-scoped view transitions | limited: Chrome only | enhancement | a page-level transition |
| Cross-document view transitions (`@view-transition`) | limited: no Firefox | MPA page transitions are enhancement | plain navigation |
| Scroll-driven animation (`animation-timeline: scroll()` / `view()`) | limited: no Firefox | scroll-linked effects are enhancement, never load-bearing | the static layout |
| `@starting-style` + `transition-behavior: allow-discrete` | Baseline 2024 (Aug) | entry animations out of `display: none` (dialog, popover, new node) work everywhere | none needed |
| Exit to `display: none`; the `overlay` property | limited: no Firefox; `overlay` Chrome only | exits are not interoperable | design every exit to degrade to an instant hide |
| `interpolate-size` / `calc-size()` (to `height: auto`) | limited: Chrome only | enhancement | the grid-rows or `::details-content` route in motion §4 |
| `linear()` easing | widely (2026-06) | spring-shaped easing from the motion tokens in plain CSS | none needed |
| `sibling-index()` / `sibling-count()` | Baseline 2026 (Aug) | CSS-only staggers and distributions | an inline `--i` index, or no stagger |
| `@property` | Baseline 2024 (Jul) | gradients and custom properties become animatable | a static gradient |

**Colour and theming** (roles and contrast: [color](../fundamentals/color.md))

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| `color-scheme`; `light-dark()` | `color-scheme` widely; `light-dark()` Baseline 2024 (May), widely 2026-11-13 (projected) | one declaration per light/dark token pair; scrollbars and form controls follow the scheme | none needed |
| `light-dark()` with image values | Baseline 2026 (Sep) | theme-specific images and logos in CSS | `<picture>` sources per `prefers-color-scheme` |
| Relative colour (`oklch(from var(--c) ...)`) | Baseline 2024 (Sep) | alpha and chroma variants of one token; hover and pressed use `color-mix(in oklab, …)` toward the text colour, not a fixed lightness shift ([color](../fundamentals/color.md#derived-states)) | precomputed steps in the token file |
| `color-mix()`; OKLab / OKLCH | widely (2025-11); mixing three or more colours limited (no Chrome) | safe for new work | none needed (two-colour mixes) |
| `contrast-color()` | Baseline 2026 (Apr) | black or white only, UA-defined, promises about 3:1 | not a substitute for computed pairs: body text needs 4.5:1, computed per [color](../fundamentals/color.md) |
| `backdrop-filter` | Baseline 2024 (Sep) | glass approximations render in every engine | a legible solid or tinted surface ([materials](../fundamentals/materials.md)) |
| `accent-color` | limited: no Chrome Android in the data | native checkbox, radio and range take the brand accent | the default control colour must still fit |

**Layout and components**

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| Size container queries | widely | components respond to their container, not the page ([layout-and-spacing](../fundamentals/layout-and-spacing.md)) | none needed |
| Container style queries (`@container style(--x: y)`) | Baseline 2026 (May) | a component switches variant on a custom property | class-based variants |
| Container scroll-state queries (`stuck`, `snapped`, `scrollable`) | limited: Chrome only | "header looks different when stuck" is enhancement | one style that works stuck or not |
| `@scope` | Baseline 2026 (Mar) | component-scoped styles without naming schemes | the host's existing scoping |
| `:has()` | widely (2026-06) | parent state from children: a field group with an error, a row with a checked box | none needed |
| Small / large / dynamic viewport units | widely | see section 2 | none needed |
| Scroll snap | widely | galleries and carousels snap to items | none needed |
| `::scroll-marker`, `::scroll-button` | limited: Chrome only | CSS-generated carousel dots and arrows are not portable | real buttons, drawn and built |
| `scrollbar-gutter` | Baseline 2024 (Dec) | reserve the gutter so content does not jump when a scrollbar appears | none needed |
| Grid lanes (masonry) | limited: Safari 26.4 only | masonry is not native | CSS columns, a regular grid, or a scripted layout |
| `reading-flow` | limited: Chrome only | visual reordering still breaks keyboard and reading order | DOM order = visual order |
| `corner-shape` (squircles) | limited: Chrome only | enhancement | plain `border-radius` |
| CSS `if()`, `@function` | limited: Chrome only | keep out of production specs | - |

**Type** ([typography](../fundamentals/typography.md), [cjk-typography](../fundamentals/cjk-typography.md))

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| `text-wrap: balance` | Baseline 2024 (May) | balanced headings | none needed |
| `text-wrap: pretty` | limited: Chrome, Safari 26; no Firefox | enhancement | the default rag |
| `text-box` / `text-box-trim` | properties Baseline 2026 (Aug); edge value types lack Firefox data | optical centring of text in buttons, badges, pills | check the render in Firefox; padding that looks right untrimmed |
| `font-size-adjust` | Baseline 2024 (Jul) | fallback fonts keep the x-height of the intended face | none needed |
| `lh` unit; `rcap` unit | `lh` widely; `rcap` Baseline 2026 (Jan) | spacing tied to line height or cap height | none needed |
| `text-autospace: normal` / `no-autospace` | Baseline 2025 (Nov; Chrome 140, Firefox 145, Safari 18.4) | the renderer adds the CJK-Latin gap: specify it natively; the typed-space convention and how the two combine are in [cjk-typography](../fundamentals/cjk-typography.md) | older engines show no gap: the product's written spacing convention |
| `text-autospace` finer values (`auto`, `ideograph-alpha`, `ideograph-numeric`, `insert`) | limited: Firefox and Safari only (`insert` needs Safari 27) | enhancement; these keep the feature as a whole "limited" | `normal` |
| `text-spacing-trim` | limited: Chrome only | CJK punctuation trimming is enhancement | full-width punctuation |

**Forms**

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| `field-sizing: content` | Baseline 2026 (Jun) | auto-growing chat composers and textareas, capped by `max-height` | scripted autosize |
| Customizable `<select>` (`appearance: base-select`, `::picker(select)`) | limited: no Firefox | a designed select (icons, rich options) is progressive enhancement | draw the classic control too; it must look right |

**Preferences and installed apps**

| Feature | Status | Design implication | Fallback |
| --- | --- | --- | --- |
| `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` | widely | each is a designed variant: [motion](../disciplines/motion.md) §5; dark, increased contrast and forced colours in [color](../fundamentals/color.md) | none needed |
| `prefers-reduced-transparency` | limited: Chrome only | glass needs a legible default, not a media-query opt-out | - |
| VirtualKeyboard API, `env(keyboard-inset-*)` | limited: Chromium only | keyboard-overlay layouts are enhancement | `interactive-widget`, or a layout that works with the visual viewport |
| Window Controls Overlay, `env(titlebar-area-*)` | limited: Chromium desktop only | an installed app may draw into the title bar | the standard title bar |

Recheck triggers: each web-features release; `light-dark()` turns widely available on 2026-11-13.

## 5. Verify

- Capture at the sizes in [render-and-look](../process/render-and-look.md) plus 320 px, light and dark,
  with emulated `forced-colors: active` and `prefers-reduced-motion: reduce`, and at 200 % text.
- Mobile: the keyboard-open state of every screen with a bottom-pinned input, drawn as its own state.
- `capture.mjs` renders in Chromium, which has most of the "limited" rows. A Chromium render proves
  nothing about a fallback: draw each fallback the design relies on as its own state (for example
  `?state=fallback`, or a class that disables the enhancement) and capture it.
- Mark checks that need a real iOS or Android browser (keyboard behaviour, safe areas, installed
  mode) as unverified unless a device was used.
