# Emil Kowalski on UI animation

> Sources: https://emilkowal.ski/ui/great-animations and https://emilkowal.ski/ui/7-practical-animation-tips ｜ Author: Emil Kowalski ｜ Published: undated on page ｜ Fetched: 2026-09-21 ｜ Method: WebFetch
> This file is a **paraphrased structured digest**, not a verbatim copy. Read the originals for exact wording and the interactive demos.

## Summary

Two short essays that compress practical web-animation craft into rules a developer can apply immediately. The through-line: motion should feel natural, be fast, have a purpose, run on the compositor, survive interruption, and respect accessibility.

## Key rules / claims

**Great Animations**
1. Natural motion: prefer movement that resembles physics; springs are recommended for a natural feel.
2. Speed: UI animations should generally stay under 300 ms; `ease-out` (fast start, slow end) reads as responsive.
3. Purpose: place animation where it adds information. Never animate keyboard-initiated actions, and avoid long (500 ms+) animations on anything triggered many times a day.
4. Performance: animate `transform` and `opacity`; prefer CSS or the Web Animations API so motion stays smooth when the main thread is busy.
5. Interruptibility: the user must be able to redirect an animation mid-way; CSS transitions and spring libraries retarget, fixed keyframes do not.
6. Accessibility: honour `prefers-reduced-motion`.
7. Cohesion: timing and easing should match the product's personality; review with fresh eyes and iterate.

**7 Practical Animation Tips**
1. Scale buttons on press: `scale(0.97)` on `:active`.
2. Do not animate from `scale(0)`; start from about `0.9` or higher (example `0.93`) with opacity.
3. Tooltips: delay the first one, then show neighbours instantly (`transition-duration: 0ms` while a group is open).
4. Use `ease-out` for entering and exiting elements; avoid `ease-in` for UI; custom curves beat the built-in keywords.
5. Make popovers origin-aware: set `transform-origin` to the trigger (component libraries expose a CSS variable for it) instead of the default centre.
6. Keep it fast: for example 180 ms for a select rather than 400 ms; remove animation from things seen hundreds of times a day.
7. As a last resort, a small `filter: blur(2px)` during the transition can mask an awkward crossfade.

## What is perishable vs durable

Durable: every rule above is about perception and frequency, not about a library. Perishable: the specific library (the text mentions Framer Motion, now published as Motion) and component-library variable names.

## Notes for the skill

These numbers anchor `design-motion`: under 300 ms, press scale 0.97, enter scale from 0.9+, ease-out by default, origin-aware popovers, no animation on keyboard or high-frequency actions.
