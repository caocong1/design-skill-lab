---
title: Modern CSS as design material
evidence: digest
sources: [web-baseline-2026, wcag-22, clreq-chinese-text-layout, jlreq]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Modern CSS as design material

Recent platform primitives change what a designer can specify and what is cheap to build: a menu
that repositions itself, a select with icons, a colour state derived from one token, a heading
that balances its lines. This file says what each primitive lets you specify, whether it may appear
in a mockup, and how to fall back. Live status (Baseline year, versions, dates) is owned by
[web](../platforms/web.md); re-check it there before relying on a row. Related owners: the motion
technique table in [motion](../disciplines/motion.md) §4, intrinsic layout and size container
queries in [layout-and-spacing](layout-and-spacing.md), colour tokens in [color](color.md) and
[system](../process/system.md), type details in [typography](typography.md), CJK spacing in
[cjk-typography](cjk-typography.md).

## Three classes, three behaviours

| Class | Meaning | In a design |
| --- | --- | --- |
| native | Baseline: in every core browser | specify it directly; the mockup uses it |
| with fallback | the core works everywhere, parts do not | specify the primitive and its fallback; render both |
| enhancement | one or two engines | the design is complete without it; the enhancement is a note in the spec |

The fallback is a designed state, not an accident, and a Chromium capture proves nothing about it.
Gate every non-native primitive so the mockup renders its fallback as its own state
(`?state=fallback` puts `class="no-enhance"` on `<html>`), and capture that state too:

```css
.trigger { anchor-name: --menu-trigger; }       /* its wrapper is position: relative */
.menu { position: absolute; top: calc(100% + 4px); left: 0; }      /* the designed default: below */
@supports (position-try-fallbacks: flip-block) {                     /* the enhancement */
  html:not(.no-enhance) .menu {
    position: fixed; inset: auto; margin: 4px 0;  /* fixed: flip against the viewport, not the wrapper */
    position-anchor: --menu-trigger; position-area: bottom span-right;
    position-try-fallbacks: flip-block, flip-inline;
  }
}
```

Measured in Chromium 147 (2026-09-27): the menu sits 4 px below the trigger and flips above it
when the viewport has no room; left `position: absolute` inside the wrapper, it overlapped the
trigger and never flipped.

## What each primitive lets you specify

**Colour**

| Primitive | Specify | Class | Fallback, trap |
| --- | --- | --- | --- |
| `light-dark()` + `color-scheme` | every colour role as one light/dark pair; both themes from one token file | native | takes colours and images only: shadows and gradients compose colour tokens ([materials](materials.md)) |
| `color-mix(in oklab, …)`, e.g. `color-mix(in oklab, var(--color-accent), var(--color-text) 10%)` | hover and pressed states, tints, subtle backgrounds, state layers, translucent fills, with no new hex per state; which space and which direction: [color](color.md), Derived states | native for two colours | three or more colours: limited; native implementers need resolved values (below) |
| relative colour, `oklch(from var(--color-accent) l c h / 0.12)` | alpha and channel variants of one token | native | a lightness offset needs its sign per mode: `calc(l - 0.06)` darkens in dark too and lowers contrast there ([color](color.md), Derived states); native implementers need resolved values (below) |
| `contrast-color()` | an automatic black or white label on colours you cannot pre-compute: user-picked tag, calendar and avatar colours | native | returns only black or white, the algorithm is up to the browser and only about 3:1 is promised: never trust it for body text; pre-compute label pairs wherever colours are known |
| `@media (color-gamut: p3)` | wide-gamut accents on screens that can show them | native | sRGB value as the default; text and data stay sRGB ([color](color.md)) |
| `@property` | typed custom properties that animate: gradient stops, angles (a conic progress ring), numbers | native | never register mode-switching colour roles ([system](../process/system.md)) |

**Overlays and components**

| Primitive | Specify | Class | Fallback, trap |
| --- | --- | --- | --- |
| `popover` + invoker commands (`command`, `commandfor`) | menus, toggletips, pickers and non-modal panels in the top layer, with light dismiss, Esc and focus return; which button opens what, and auto or manual dismissal | native | hover-triggered popovers (interest invokers) are Chromium only: a hover tooltip still needs script and must meet WCAG 1.4.13 ([accessibility](accessibility.md)) |
| `<dialog>` (modal) + `::backdrop` | a modal with its scrim and contained focus | native | `closedby` (dismiss rules) is limited |
| anchor positioning (`anchor-name`, `position-area`, `position-try-fallbacks`) | tooltips, menus and callouts attached to their trigger, with a named placement and ordered fallbacks ("below-start, else above-start, else end") | with fallback | a fixed placement, as in the example above; animating anchored elements is enhancement |
| customizable select (`appearance: base-select`, `::picker(select)`) | a designed native select: rich options, icons, a custom picker | enhancement (no Firefox) | the classic control, drawn next to the designed one |
| `field-sizing: content` | fields and textareas that grow with their content: a chat composer with minimum and maximum rows | native | a fixed height with scroll |
| container style queries, `@container style(--density: compact)` | component variants switched by a token on the container, not by class plumbing | native (custom properties only) | a class |
| container scroll-state queries, `scroll-state(stuck)` | a header that changes when stuck, a carousel item when snapped | enhancement (Chromium only) | draw both states; a script sets a class |
| `sibling-index()`, `sibling-count()` | index-driven staggers and distributions (delays, hue steps, fans) without script | native | an inline `--i` per item |

**Motion** (technique choice and reduced motion: [motion](../disciplines/motion.md))

| Primitive | Specify | Class | Fallback, trap |
| --- | --- | --- | --- |
| same-document view transitions, `view-transition-name`, `view-transition-class` | state changes and shared-element morphs; name the paired elements in the motion spec | native | cross-document (page to page) transitions are limited: plain navigation |
| `@starting-style` + `transition-behavior: allow-discrete` | entry animations out of `display: none` for dialogs, popovers and new rows | native for entry | exit into `display: none` and top-layer exit are not interoperable: design exits that degrade to an instant hide |
| scroll-driven animations, `animation-timeline: scroll()` / `view()` | progress, reveals and parallax bound to scroll | enhancement (no Firefox) | the static state is the design |
| `interpolate-size: allow-keywords`, `calc-size()` | animating to `height: auto` | enhancement (Chromium only) | `grid-template-rows: 0fr` to `1fr`; `::details-content` for accordions |

**Type** (rules: [typography](typography.md), [cjk-typography](cjk-typography.md))

| Primitive | Specify | Class | Fallback, trap |
| --- | --- | --- | --- |
| `text-box: trim-both cap alphabetic` | optical centring: padding measured from cap height to baseline in buttons, badges and tags | with fallback (edge values: [web](../platforms/web.md) §4) | padding that also looks right untrimmed; check the render in Firefox |
| `text-wrap: balance` | balanced headings with no one-word last line | native | - |
| `text-wrap: pretty` | fewer short last lines in body text | enhancement | check key paragraphs by eye |
| `text-autospace: normal` | the CJK-Latin gap from the renderer | native for `normal` and `no-autospace` | finer values are enhancement ([web](../platforms/web.md) §4) |
| `text-spacing-trim` | compressed CJK punctuation runs | enhancement (Chromium only) | full-width punctuation elsewhere |

Out of production specs for now: `if()`, `@function` and scroll-state queries as load-bearing
behaviour (single engine).

## The mockup-safe subset

- **Mockups for native targets** (iOS, Android, HarmonyOS, desktop, mini-programs): tokens as custom
  properties are fine, including `light-dark()`, relative colour and `color-mix()`, because tokens
  map to themes. Overlays, anchoring and transitions are web behaviours: draw the result and
  describe the behaviour in the spec. The portable subset itself is owned by
  [portable-mockups](portable-mockups.md).
- **Mockups for web targets**: native primitives may appear directly. With-fallback and
  enhancement primitives appear only when the fallback is rendered too (`?state=fallback`).
- **Handoff**: list resolved values next to every formula token, per theme. A custom property
  returns its unresolved text (`getPropertyValue('--color-accent-hover')` gives
  `color-mix(in oklab, #2563eb, light-dark(#111827, #f3f4f6) 10%)`), so read a property that uses
  it: the computed `background-color` of an element with `background: var(--color-accent-hover)`
  gives `oklab(0.512525 -0.0242829 -0.195345)` in light and `oklab(0.588212 -0.0240114 -0.192467)`
  in dark (measured, Chromium 147, 2026-09-27). Convert each with
  `python3 "$S/color_tools.py" convert "<value>"` (`S` = `skills/design-studio/scripts`; here `#245bd5` and `#3a74ee`).

## Design moves these unlock

- One token file, both themes, derived states: a palette decision now costs one line per role.
- Menus, pickers and toggletips can be specified as native popovers; the spec says auto or manual
  dismissal and where focus returns ([product-ui](../disciplines/product-ui.md)).
- Tooltips declare their fallback placements instead of hoping the viewport is big enough.
- A select can carry icons and descriptions without a custom listbox, as long as the classic
  control is also acceptable.
- Chat composers and comment boxes grow with their text natively.
- Staggers, stuck-header styling and entry animations need no script; exits still degrade.
- Buttons and badges can be centred optically instead of by line box.
