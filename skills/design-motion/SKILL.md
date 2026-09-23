---
name: design-motion
description: Design interface motion - micro-interactions, state transitions, enter and exit animations, page and view transitions, scroll-driven and gesture-driven motion, loading and skeleton behaviour, and a product's motion system - then specify and prototype it in code for web (CSS, WAAPI, Motion, GSAP), Flutter, SwiftUI and Compose. Use when the user asks for animation, 动效, transitions, a hover or press effect, a loading animation, scroll effects, a motion spec, or wants an interface to feel smoother or more alive. 动效、过渡动画、微交互、缓动、弹簧动画、加载动画。
metadata:
  version: 0.1.2
  short-description: Purposeful motion, specified and prototyped
---

# Design Motion

Motion is a functional layer: it explains what changed, where things went, and
that the system heard the user. Decoration is the last and smallest reason to
animate. Values and code per platform: `references/motion-tokens.md`.

## Decide Whether to Animate

Ask in order; stop at the first "no".

1. **Does it have a job?** Feedback (the press registered), continuity (this
   became that), orientation (the panel came from the right, so it goes back
   there), attention (one thing changed; look here), perceived speed
   (skeleton, optimistic update), or brand character (rare, at key moments).
2. **How often will the user see it?** The more frequent the interaction, the
   shorter and subtler the motion. Actions repeated hundreds of times a day,
   and anything triggered by keyboard, get little or none.
3. **Can it be interrupted?** If the user can change their mind mid-way
   (drag, hover, toggle, fast navigation), the motion must retarget smoothly
   from its current state - use springs or transitions, not fixed keyframes.
4. **Can the device afford it?** Animate `transform` and `opacity`; anything
   that triggers layout or paint on many elements needs a different technique.

## Core Rules

- **Fast.** Most UI motion lives between 150 and 300 ms. Small things are
  faster than big things; exits are faster than entrances; desktop is faster
  than mobile. Above roughly 500 ms is reserved for orchestrated moments the
  user chose to watch.
- **Ease-out for things that respond to the user** (enter, open, expand): fast
  start reads as responsive. **Ease-in-out for things moving across the
  screen.** **Ease-in only for things leaving for good.** **Linear only for
  constant processes** (spinners, progress, marquees) and sometimes opacity.
  The default `ease` and built-in curves are weak; define custom curves.
- **Springs for anything gesture-driven or interruptible.** Default to little
  or no bounce; add bounce only when the gesture carried momentum or the brand
  is explicitly playful.
- **Never animate from nothing.** Enter from `scale(0.9-0.97)` plus opacity,
  not from `scale(0)`. Move short distances (4-24 px); long travel reads slow.
- **Origin-aware.** Popovers, menus and dialogs grow from their trigger;
  sheets come from the edge they belong to; a thing exits the way it entered.
- **One focal motion at a time.** Stagger groups by 20-50 ms per item and cap
  the total; do not animate a whole page in.
- **Consistent semantics**: forward / deeper is one direction, back is its
  reverse, everywhere in the product.
- **Hover is not available on touch**, and hover effects should not move
  layout. Pressed states respond instantly (within a frame) and may be the
  only motion a control needs.
- **Loading**: nothing under ~1 s except a subtle state; skeletons shaped like
  the content after that; determinate progress when the duration is known;
  avoid full-page spinners and avoid flashing a loader for fast responses
  (delay its appearance).
- **Tooltips and menus**: delay the first tooltip, show subsequent ones
  immediately while the pointer moves along the group; menus open instantly.
- **Sound and haptics** are part of motion on devices that have them: pair a
  light haptic with selection changes and success / warning / error results;
  never haptics without a visible change.

## Accessibility

- Honour `prefers-reduced-motion` (and platform equivalents): replace
  movement, scaling, parallax and zoom with a short fade or an instant state
  change. Reduced is not none - keep feedback and state clarity.
- Large-area movement, parallax, zooming backgrounds and spinning are
  vestibular triggers even for users without the setting; use them sparingly.
- Anything that moves, blinks or auto-updates for more than five seconds
  alongside other content needs a pause / stop control. Nothing flashes more
  than three times per second.
- Auto-playing hero video or carousels: muted, pausable, and never the only
  carrier of the message.

## Motion System

For a product, define tokens once (in the design system) instead of per
animation:

- **Durations**: `instant`, `fast`, `base`, `slow`, `deliberate`.
- **Easings**: `out` (enter / respond), `in-out` (move), `in` (leave),
  `linear`; optionally an `emphasized` curve for hero transitions.
- **Springs**: `snappy`, `smooth`, `bouncy` with platform-specific parameters.
- **Patterns**: fade, fade-through, scale-fade (popover), slide-over (sheet /
  drawer), shared-element / container transform, collapse / expand, list
  insert / remove / reorder, skeleton -> content, number roll, toast in / out.
- **Personality statement**: one sentence ("calm and exact: short ease-outs,
  no bounce, nothing loops").

## Technique Selection (web)

| Need | Reach for |
| --- | --- |
| Hover, press, simple state change | CSS `transition` on `transform` / `opacity` / colour |
| Enter / exit of conditionally rendered elements | CSS `@starting-style` + `transition-behavior: allow-discrete` where supported, or the framework's presence utility |
| Layout changes (reorder, expand, shared element) | FLIP via a motion library's layout animation, or the View Transitions API |
| Page / route transitions | View Transitions API (same-document, and cross-document where supported), with a no-transition fallback |
| Scroll-linked progress, reveal, parallax | CSS scroll-driven animations (`animation-timeline: scroll() / view()`), with a static fallback; JS only when logic is needed |
| Gesture-driven, interruptible, spring physics | a motion library with springs (Motion, or the platform's spring API) |
| Complex sequenced timelines, SVG morphing, text splitting | GSAP-style timeline tooling |
| Designer-authored vector animation | Lottie / dotLottie playback; interactive state machines -> Rive |
| Canvas / WebGL backgrounds | a shader or particle layer, paused when off-screen and under reduced motion |
| Motion along a path (a marker travelling a route, a chart cursor) | CSS `offset-path` and `offset-distance`. The object must already be on the path at the first painted frame |

Check the installed version and the browser support table before relying on a
newer API; give every progressive feature a fallback. Native stacks (Flutter
implicit / explicit animations, SwiftUI `withAnimation` and springs, Compose
`animate*AsState` / transitions) are covered in `references/motion-tokens.md`.

## Workflow

1. Inventory moments that change state; mark each with its job (or "none").
2. Study references: `../design-studio/references/resources/motion.md`
   (recordings of real products are the best teacher; watch at 0.25x).
3. Set or reuse motion tokens; write the personality sentence.
4. Spec each animation (table below).
5. Prototype in `.design/motion/<name>.html`: real components, a replay
   control, a slow-motion toggle (`--speed` multiplier), a reduced-motion
   toggle, and interruption testable by rapid clicking.
6. **Look at it**: record or step through frames with the browser tool when
   available; check for dropped frames, layout shift, overshoot, flicker at
   start, and behaviour under rapid toggling. If it cannot be observed, say so.
7. Hand off with the spec and the code.

### Spec format

| Element | Trigger | Property | From -> To | Duration | Easing / spring | Delay / stagger | Interruptible | Reduced-motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menu | open | opacity, scale | 0, 0.96 -> 1, 1 (origin: trigger) | fast | out | - | yes | fade only |

## Anti-Patterns

- Animating everything on scroll; fade-up on every block.
- 400-600 ms defaults that make the product feel slow; `transition: all`.
- Bounce on non-gestural UI; infinite loops that draw the eye from content.
- Animating `width` / `height` / `top` / `left` / `box-shadow` on many nodes.
- Fixed keyframes on hover targets that snap when interrupted.
- Keyframes that leave an animated property out of the last frame. The
  browser interpolates it back to the element's underlying value - typically
  the `opacity: 0` of a "waiting" class - so the element fades out again
  before the script removes the class, and the entrance reads as playing
  twice. Write every animated property in every keyframe, and prefer
  `animation-fill-mode: both` so the end frame holds until cleanup.
- Rotating inside `transform` on an element that also sets the `rotate`
  property (or translating on top of `translate`): the two compose, so the
  final frame lands at twice the intended tilt and snaps when the animation
  ends. Animate the same property you rest on.
- A second class that replaces the `animation` shorthand (a hover wiggle)
  while an entrance is still running: it cancels the entrance, and removing
  the class later restarts it from zero. Skip the secondary animation while
  the first is active, or put them on different elements.
- SVG `animateMotion` as the only way to ride a path. Until the animation
  begins, the object sits at the SVG origin, so a visible dot piles up in the
  corner — and in some browsers the motion never attaches, so it stays there.
  Use `offset-path`, and keep the resting position on the path.
- Replacing a view (a direction, a route, a full-page tab) without moving
  scroll back to the start. A view that sets `overflow: hidden` on the body
  hides the scrollbar but keeps `scrollY`, so the next view opens in the
  middle. The View Transitions API can also write the old scroll position
  back when the transition finishes: set scroll to the start inside the
  update, and again when `finished` resolves.
- Motion as the only indicator of a state change.
- Ignoring reduced motion, or removing all feedback under it.
- A loader that flashes for 80 ms.

## Deliverables

Motion tokens (in the system), per-animation spec table, a runnable demo page
with replay / slow-motion / reduced-motion controls, production code in the
host stack when asked, and notes on performance and fallbacks.
