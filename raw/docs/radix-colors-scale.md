# Radix Colors: understanding the scale

> Source: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale ｜ Publisher: WorkOS / Radix ｜ Published: living document ｜ Fetched: 2026-09-21 ｜ Method: WebFetch
> This file is a **paraphrased structured digest**, not a verbatim copy.

## Key rules / claims

Every Radix scale has twelve steps, and each step has a job:

| Step | Use |
| --- | --- |
| 1 | App background |
| 2 | Subtle background (striped rows, code blocks, cards, sidebars) |
| 3 | Component background, normal |
| 4 | Component background, hover |
| 5 | Component background, pressed or selected |
| 6 | Subtle borders and separators on non-interactive elements |
| 7 | Borders of interactive components; subtle focus rings |
| 8 | Stronger borders of interactive components; focus rings |
| 9 | Solid backgrounds - the purest, highest-chroma step |
| 10 | Hovered solid backgrounds |
| 11 | Low-contrast text |
| 12 | High-contrast text |

Steps 11 and 12 are designed to keep accessible contrast (the project targets APCA) on a step-2 background of the same scale. In light themes a plain white app background is common; in dark themes use step 1 or 2 of a grey or tinted scale, mapped through aliases so themes can swap.

## What is perishable vs durable

Durable: the idea that a scale step is a role contract (background / interactive background / border / solid / text), which lets dark mode and brand themes be re-mappings. Perishable: the exact colour values.

## Notes for the skill

Adopt the step-to-role mapping as the default semantic layer in `build-design-system`, whatever generates the primitives.
