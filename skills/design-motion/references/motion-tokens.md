# Motion Tokens and Platform Code

Default values to start from, then tune by eye. Library and platform APIs are
**perishable**: check the installed version. Evidence for the numbers is in
the lab (`raw/docs/emil-kowalski-animation.md`,
`raw/docs/material-motion-tokens.md`).

## Duration

| Token | Value | For |
| --- | --- | --- |
| `instant` | 0-50 ms | pressed state, selection highlight |
| `fast` | 100-150 ms | hover, toggle, small fades, tooltip |
| `base` | 180-250 ms | popover, menu, dropdown, toast, small expand |
| `slow` | 300-400 ms | dialog, drawer, sheet, page-level element |
| `deliberate` | 450-700 ms | full-screen or hero transitions the user chose to watch |

Rules of thumb: most UI motion under 300 ms; exits about 70-80% of the
entrance; larger distance or area -> longer; desktop faster than mobile;
anything seen hundreds of times a day -> shorter or none; keyboard-initiated
actions -> none. A complete reference scale (50 ms steps from 50 to 600, then
700-1000) is a reasonable token set when more granularity is needed.

## Easing

```css
:root {
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);   /* enter, open, respond: strong deceleration */
  --ease-out-soft: cubic-bezier(0.2, 0, 0, 1);      /* standard on-screen change */
  --ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);  /* move from A to B on screen */
  --ease-in:       cubic-bezier(0.3, 0, 1, 1);      /* leaving for good */
  --ease-decel:    cubic-bezier(0.05, 0.7, 0.1, 1); /* emphasised enter */
  --ease-accel:    cubic-bezier(0.3, 0, 0.8, 0.15); /* emphasised exit */
}
```

- Respond to the user with `ease-out`. Avoid `ease-in` for UI that the user is
  waiting on. Avoid the keyword curves (`ease`, `ease-in-out`): they are weak.
- `linear` for constant processes only (spinners, progress, marquee), and for
  opacity when paired with an eased transform.
- Springs and bounces in pure CSS: generate a `linear()` function with the
  tools in `../../design-studio/references/resources/motion.md`.

## Springs

Describe springs by **perceived duration and bounce**, then translate:

| Token | Feel | Use |
| --- | --- | --- |
| `snappy` | quick, no overshoot (bounce 0) | toggles, small controls, most UI |
| `smooth` | relaxed, no overshoot | sheets, drawers, layout changes |
| `bouncy` | visible overshoot (bounce 0.2-0.3) | drag release with momentum, playful brands only |

Reference parameters (damping ratio, stiffness) from Material's scheme:
spatial fast 0.9 / 1400, default 0.9 / 700, slow 0.9 / 300; effects (colour,
opacity) fast 1 / 3800, default 1 / 1600, slow 1 / 800. Choose speed by how
much of the screen moves; animate position and size with a spatial spring and
colour / opacity with a critically damped effects spring so they never
overshoot.

## Patterns

| Pattern | Spec |
| --- | --- |
| Press | `scale(0.97)` on active, `instant`-`fast`, ease-out |
| Popover / menu / tooltip enter | opacity 0 -> 1 and scale 0.95-0.97 -> 1, `transform-origin` at the trigger, `fast`-`base`, ease-out; exit faster, no scale overshoot |
| Tooltip group | first tooltip delayed; neighbours instant while the group is active |
| Dialog | scrim fade `base`; panel opacity + scale 0.96 -> 1 or 8-16 px rise, `slow`, ease-out |
| Sheet / drawer | translate from its edge, `slow` or `smooth` spring; draggable ones must be interruptible |
| Toast | slide 8-16 px + fade, `base`; stack reflow animated; auto-dismiss 4-6 s, pause on hover / focus |
| Collapse / expand | animate a grid row or a measured height with `base`, content fades slightly later |
| List insert / remove / reorder | FLIP / layout animation `base`; stagger 20-50 ms capped at about 300 ms total |
| Skeleton -> content | cross-fade `fast`; skeleton shimmer slow and subtle or none |
| Page / view | fade-through or shared-axis 8-24 px, `slow`; shared-element for continuity of one object |
| Number change | roll or cross-fade digits, `base`; tabular figures |
| Loading | delay the indicator about 150-300 ms and keep it at least 300-500 ms once shown |

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

That blunt reset is a floor, not a design. Better: keep opacity and colour
transitions, remove translation, scale, parallax and auto-play; keep every
state change visible.

## Web

```css
.menu {
  transform-origin: var(--transform-origin, top left);
  transition: opacity 150ms var(--ease-out), transform 150ms var(--ease-out);
}
.menu[data-state="closed"] { opacity: 0; transform: scale(0.96); }

/* enter from display:none without JavaScript, where supported */
.dialog { transition: opacity 200ms, transform 200ms var(--ease-out), display 200ms allow-discrete, overlay 200ms allow-discrete; }
@starting-style { .dialog[open] { opacity: 0; transform: translateY(8px) scale(0.98); } }
```

- Never `transition: all`. Animate `transform`, `opacity`, and cheap paint
  properties; use FLIP or a layout-animation library for size and position.
- Scroll-driven: `animation-timeline: view()` / `scroll()` with
  `animation-range`; provide a static fallback. View transitions:
  `document.startViewTransition()` and `view-transition-name`; keep the
  fallback a plain state change.
- A motion library earns its place for springs, gestures, layout and exit
  animations; import from the package's current entry point for the installed
  major.
- SVG: transform a `<g>` with `transform-box: fill-box; transform-origin:
  center`.

## Flutter

```dart
// implicit first
AnimatedContainer(duration: const Duration(milliseconds: 200), curve: Curves.easeOutCubic, ...);
AnimatedSwitcher(duration: const Duration(milliseconds: 180), child: ...);
// springs for gestures
final sim = SpringSimulation(const SpringDescription(mass: 1, stiffness: 500, damping: 40), from, to, velocity);
```

Prefer implicit widgets (`AnimatedOpacity`, `AnimatedAlign`,
`TweenAnimationBuilder`), `Hero` for shared elements, a declarative effects
package for chains. Check `MediaQuery.disableAnimationsOf(context)`. Keep
durations and curves in a `ThemeExtension`. Verify with golden tests at fixed
animation progress.

## SwiftUI

```swift
withAnimation(.snappy(duration: 0.25)) { isOpen.toggle() }      // also .smooth, .bouncy
.animation(.spring(duration: 0.35, bounce: 0.0), value: offset)
.transition(.opacity.combined(with: .scale(scale: 0.96, anchor: .topLeading)))
```

Springs are the default and are interruptible. Respect
`@Environment(\.accessibilityReduceMotion)`. Use `matchedGeometryEffect` or
navigation zoom transitions for continuity; pair state changes with
`sensoryFeedback`.

## Jetpack Compose

```kotlin
val scale by animateFloatAsState(if (pressed) 0.97f else 1f, spring(dampingRatio = 1f, stiffness = Spring.StiffnessMedium))
AnimatedVisibility(visible, enter = fadeIn() + scaleIn(initialScale = 0.96f), exit = fadeOut())
```

`animate*AsState` for single values, `updateTransition` for coordinated ones,
`AnimatedContent` and shared-element APIs for screen changes. Use the theme's
motion scheme where the design system provides one.

## Spec Row Template

`element | trigger | properties | from -> to | duration token | easing / spring token | delay / stagger | interruptible | reduced-motion behaviour`
