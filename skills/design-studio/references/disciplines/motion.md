---
title: Motion
evidence: digest
sources: [emil-kowalski-animation, material-3-expressive, material-motion-tokens, web-baseline-2026, wcag-22, apple-hig-liquid-glass, harmonyos-design, fluent-2, impeccable-slop-rules]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Motion

Motion explains a change: that the system heard the user, where something came from and went, what
became what. Decoration is the last and smallest reason to move. This file owns the decision, the
technique, reduced motion, the spec and the demo. Values, springs and platform code:
[motion-tokens](motion-tokens.md). Artefacts go to `.design/motion/`.

## 1. Should it move?

Walk every moment where state changes (open, close, add, remove, navigate, load, succeed, fail) and
stop at the first "no". The moments marked "none" are part of the spec.

**Frequency first.**

| How often the user sees it | Motion |
| --- | --- |
| 100+ times a day, or triggered from the keyboard (shortcuts, command palette, list navigation by keys) | none |
| tens of times a day (hover, tab switch in a tool, row selection) | none, or a colour/opacity change of at most 150 ms |
| occasionally (dialog, sheet, toast, route change, expand) | standard motion from the tokens |
| rarely (onboarding, first item created, success after a long task) | may carry the one delight moment |

**Purpose next.** One of: feedback (the press registered), continuity (this became that),
orientation (it came from there and goes back there), attention (one thing changed), perceived speed
(skeleton, optimistic update), character (rare tier only). "It looks nice" is not a purpose.

**Interruptible?** Anything the user can reverse mid-way (hover, toggle, drag, fast navigation)
retargets from where it is: a transition or a spring, never fixed keyframes.

**Affordable?** Animate `transform` and `opacity`; `clip-path` and a small `filter: blur()` (under
20 px) sparingly. Size and position changes go through FLIP or view transitions, not `width`,
`height`, `top`, `left` or `margin`. The one tolerated exception is a single accordion's height.

## 2. The posture sets the personality

Write the personality in one sentence in DESIGN.md (`## Motion`), for example "calm and exact: short
decelerations, no bounce, nothing loops". Then take the default of the target's posture
([platforms](../platforms/README.md)) unless the brief argues otherwise:

| Posture | Default | Note |
| --- | --- | --- |
| custom web or cross-platform brand | little or no bounce: M3 standard springs or ease-out curves; bounce 0.1-0.3 only for a drag released with momentum or an explicitly playful brand | the suite's brand-neutral default |
| native Android | M3 **expressive** springs for most products, **standard** for utilitarian ones; spatial springs may overshoot, effects springs never | Compose's plain `MaterialTheme` gives standard; expressive needs `MaterialExpressiveTheme` (material3 1.5.0-alpha): flag it in the handoff |
| native iOS, iPadOS, macOS | system springs (`.smooth`, `.snappy`, `.bouncy`) and system transitions; spec only the custom moments | Liquid Glass controls bring their own elastic behaviour; Reduce Motion lowers the effect and turns the elasticity off |
| HarmonyOS | system component motion and HarmonyOS Symbol effects (the selected tab bounces) | [harmonyos](../platforms/harmonyos.md) |
| Windows | Fluent curves and durations (167/250/333 ms), built-in page transitions and connected animation | [desktop](../platforms/desktop.md) |

Never re-specify a transition the platform draws itself (push, sheet presentation, glass effects);
the implementer gets it for free and a custom copy feels wrong on that device.

Before speccing, watch two recordings of products in the category at 0.25x
(`python3 "$S/catalog.py" find --section motion:recordings`, with `S` = `skills/design-studio/scripts`) and note durations, origins and
what does not move.

## 3. Rules that change the output

- **Speed follows screen coverage.** Small component: fast. Partial screen (menu, sheet, rail
  expanding): default. Full screen (page, container transform): slow. Longer travel or larger area:
  longer. Desktop slightly faster than mobile. Numbers in [motion-tokens](motion-tokens.md).
- **Asymmetric enter and exit.** Exits run about 20-30% shorter than entrances. Enter with a
  deceleration (ease-out or a spring). Exit with ease-out too, or an accelerating curve only for an
  element leaving for good that nothing waits on. No `ease-in` on anything the user waits for. Slow
  where the user decides (hold-to-confirm: 2 s, linear), fast where the system answers (release:
  about 200 ms).
- **Origin-aware.** Menus, popovers and tooltips scale from their trigger (`transform-origin` on the
  trigger's side; component libraries expose it as a variable). Sheets come from their edge, toasts
  enter and leave by the same edge, and a thing leaves the way it came. Modal dialogs are exempt:
  they stay centred. Forward and back are mirror images everywhere in the product.
- **Never from nothing.** Enter from `scale(0.9-0.97)` plus opacity 0, never `scale(0)`. In-place
  travel 4-24 px. Press feedback `scale(0.97)` (0.95-0.98) over 100-160 ms.
- **Menus and tooltips never delay input.** A menu is usable on the frame it appears; its opacity and
  scale finish within 150 ms. The first tooltip waits for a hover delay; neighbours then open at once,
  with no animation, while the pointer moves along the group.
- **One focal motion at a time.** Stagger siblings by 30-50 ms, cap the whole group near 300 ms, and
  never block interaction while it runs. Never fade up every block on scroll.
- **Hover motion only for fine pointers**: `@media (hover: hover) and (pointer: fine)`. Hover never
  moves layout.
- **Motion never carries a state alone**: the end state is readable without having seen the motion.
- **Loops**: nothing decorative loops. A spinner, a progress bar or a marquee moves at constant
  speed (`linear`). No pulsing status dots or blinking cursors as decoration.
- **Loading timing** (show delay, minimum visible time, skeleton shape) is owned by
  [product-ui](product-ui.md); motion decides only how the indicator moves and how the skeleton
  hands over (a fast cross-fade).
- **AI output**: stream by line or chunk with an opacity fade, never per-token movement; keep the
  reading position anchored while text grows; the "working" indicator is quiet and stops the moment
  output starts. Surfaces and states: [ai-experience](ai-experience.md).
- **Haptics and sound** belong to motion on devices that have them: a light haptic with selection
  changes and with success, warning and error results; never a haptic without a visible change.
- **A component, not an animation.** A toast stack, drawer or command menu comes from the host's
  library or a trusted one; do not specify a hand-rolled physics system for it.

## 4. Technique (web)

Class = how to design with it (native: specify it; fallback: design the degraded state; enhancement:
the design is complete without it). Status and dates are owned by [web](../platforms/web.md) §4.

| Need | Technique | Class | Fallback |
| --- | --- | --- | --- |
| hover, press, state you control | CSS `transition` | native | - |
| enter from `display: none` (dialog, popover, new node) | `@starting-style` + `transition-behavior: allow-discrete` | native | - |
| exit to `display: none`; keep a closing popover in the top layer (`overlay`) | same, animating `display` | fallback | design the exit to degrade to an instant hide |
| a set sequence that must stay smooth under load (one-shot entrance, loader) | CSS `@keyframes` | native | never on rapidly retriggered elements |
| play, reverse, seek or await from script | Web Animations API (`element.animate`) | native | - |
| state change or shared element within one page | same-document View Transitions, `view-transition-class` | native | plain state change |
| page-to-page transition across documents | `@view-transition` (cross-document) | enhancement | plain navigation |
| scroll-linked progress, reveal, parallax | `animation-timeline: scroll()` / `view()` | enhancement | static layout; IntersectionObserver when logic is needed |
| expand to `height: auto` | `interpolate-size` / `calc-size()` | enhancement | `grid-template-rows: 0fr > 1fr`; `::details-content` for accordions |
| stagger without JS | `sibling-index()` | native (new: check the host's browser matrix) | an inline `--i` custom property |
| spring feel without JS, not gesture-driven | `linear()` samples from the tokens | native | - |
| drag, momentum, interruption that keeps velocity, layout (FLIP), exit presence | a spring library (Motion) or the platform's spring API | - | - |
| sequenced timelines, SVG morphing, text splitting | a timeline library (GSAP class) | - | check the licence |
| designer-authored vector animation; interactive state machines | Lottie or dotLottie; Rive | - | a still frame |
| canvas or WebGL background | shader or particle layer | - | paused off-screen and under reduced motion; a still |
| an object riding a path | `offset-path` + `offset-distance`, resting on the path at the first frame | - | the object at its end point |

Native stacks (SwiftUI, Compose, Flutter, ArkUI, WinUI): [motion-tokens](motion-tokens.md) §5 and
[implement-design stacks](../../../implement-design/references/stacks.md).

## 5. Reduced motion is a design

`prefers-reduced-motion` (iOS Reduce Motion, Android "Remove animations", Windows "Animation
effects" off) means fewer and gentler animations, not none. Design the reduced column for every
spec row:

| Full motion | Reduced |
| --- | --- |
| slide, scale, shared-element or container transform | cross-fade of at most 150 ms, or an instant change with a clear end state |
| parallax, zooming background, scroll-linked movement | static |
| auto-playing loop, marquee, background video | paused on a poster frame, with a play control |
| spring with overshoot | no overshoot (effects spring or ease-out) |
| press, selection, validation feedback | kept, as colour or opacity |
| progress and spinners | kept; shimmer on skeletons becomes a static skeleton |

- Large-area movement, parallax, zoom and spin are vestibular triggers even without the setting:
  use them rarely, small and short.
- WCAG 2.2: anything that moves, blinks or scrolls on its own for more than 5 s beside other content
  needs pause, stop or hide (2.2.2, A); nothing flashes more than 3 times a second (2.3.1, A); motion
  triggered by interaction can be turned off (2.3.3, AAA, met by the reduced column).
- The global `*{animation-duration: .01ms !important}` reset is the implementer's floor for code
  nobody designed, not the design.

## 6. Spec

One row per moment, "none" rows included. Copy the header; values name tokens, not raw numbers.

```text
| Element | Trigger | Job | Property: from > to | Origin | Duration / spring | Easing | Delay / stagger | Interruptible | Reduced |
| Menu | click trigger | continuity | opacity 0 > 1, scale .96 > 1 | trigger | spatial-fast / effects-fast | spring | - | yes: reverses | fade 100 ms |
| Row hover | hover | feedback | background | - | none | - | - | - | same |
| Command palette | Cmd-K | - | none (keyboard, 100+/day) | - | - | - | - | - | - |
```

Hand over the spec, the tokens, the demo and its frame sheet; production code only when asked.

## 7. Demo you can slow down

Build `.design/motion/<name>.html` from [motion-demo](../../templates/motion-demo.html): the real
components with real content, one trigger per moment, replay, a speed control (1x, 0.5x, 0.25x,
0.1x), a reduced-motion toggle and a motion-scheme switch. The speed control sets `playbackRate` on
`document.getAnimations()`, so it covers CSS transitions, keyframes and WAAPI without changing the
component CSS.

Look at it, do not trust it:

1. Play each moment at 0.25x and 0.1x. Check the start frame (no flash, nothing appears from nowhere),
   the origin, overshoot, the end frame (it holds; nothing snaps or plays twice) and layout shift.
2. Click a trigger rapidly: it must reverse from where it is.
3. Capture frames: `motion-demo.html?moment=<id>&t=<ms>` starts the moment and freezes every
   animation at `t`. Capture one URL per frame (t = 0, 40, 80, 120, 160, 240, 320, end) with
   `$S/capture.mjs` and build a contact sheet with its `--sheet`, or loop `$S/shot.sh`.
   Look at the sheet. A render you did not look at is unverified: say so.
4. Turn on reduced motion and repeat step 1.

A render that is wrong in a way no rule explains (it plays twice, snaps at the end, a dot sits in a
corner): [casebook](../casebook.md), Motion.

Anti-patterns: fade-up on every block; 400-600 ms defaults that make a tool feel slow;
`transition: all`; bounce on UI nobody threw; fixed keyframes on hover targets that snap when
interrupted; decorative loops beside content.
