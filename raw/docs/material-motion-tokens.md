# Material 3 motion tokens (curves and M3 Expressive springs)

> Source: https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md (the design guidance lives at https://m3.material.io/styles/motion/overview, a JavaScript app that a plain fetch cannot read) ｜ Publisher: Google ｜ Published: living document ｜ Fetched: 2026-09-21 ｜ Method: curl of the raw Markdown
> This file is a **paraphrased structured digest**, not a verbatim copy. Values are copied as data.

## Summary

Material defines two motion systems. The older **curve system** pairs easing curves with a duration scale. The newer **spring (physics) system**, introduced with M3 Expressive, defines six springs by speed (fast, default, slow) and by what they animate (spatial movement versus effects such as colour and opacity).

## Checklists / tables

**Easing**

| Token | Value | Use |
| --- | --- | --- |
| standard | `cubic-bezier(0.2, 0, 0, 1)` | utility motion that begins and ends on screen |
| standard decelerate | `cubic-bezier(0, 0, 0, 1)` | utility motion entering the screen |
| standard accelerate | `cubic-bezier(0.3, 0, 1, 1)` | utility motion leaving the screen |
| emphasized | path `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1` | characteristic M3 motion that begins and ends on screen |
| emphasized decelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` | M3-styled motion entering |
| emphasized accelerate | `cubic-bezier(0.3, 0, 0.8, 0.15)` | M3-styled motion leaving |
| linear | `cubic-bezier(0, 0, 1, 1)` | simple, non-stylised motion |

**Duration scale**: short 50 / 100 / 150 / 200 ms; medium 250 / 300 / 350 / 400 ms; long 450 / 500 / 550 / 600 ms; extra long 700 / 800 / 900 / 1000 ms.

**Springs (damping ratio, stiffness)**

| Spring | Spatial (position, size, shape) | Effects (colour, opacity) | For |
| --- | --- | --- | --- |
| fast | 0.9, 1400 | 1, 3800 | small components such as switches and buttons |
| default | 0.9, 700 | 1, 1600 | elements that partially cover the screen (bottom sheet, drawer) |
| slow | 0.9, 300 | 1, 800 | full-screen transitions |

Spatial springs are slightly under-damped (0.9) so movement overshoots a little; effects springs are critically damped (1) so colour and opacity never overshoot. A pressed button uses two springs at once: fast-spatial for shape and size, fast-effects for colour.

Transition patterns documented: container transform, shared axis, fade through, fade.

## What is perishable vs durable

Durable: choosing speed by how much of the screen moves; separating spatial from effects animation; exits faster than entrances; decelerate in, accelerate out. Perishable: the exact numbers and attribute names, which change between Material releases.

## Notes for the skill

Use the speed-by-coverage idea and the spatial/effects split in any motion system, including on the web. The duration scale is a good default token set.
