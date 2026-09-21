# Lucide icon design principles

> Source: https://lucide.dev/contribute/icons/design-principles (the older URL `/guide/design/icon-design-guide` now returns 404) ｜ Publisher: Lucide contributors ｜ Published: living document ｜ Fetched: 2026-09-21 ｜ Method: curl + text extraction
> This file is a **paraphrased structured digest**, not a verbatim copy. The original shows a do/don't figure for every rule.

## Key rules / claims

1. Canvas is 24 x 24 px, square.
2. Keep at least 1 px of padding between strokes and the canvas edge.
3. Strokes are 2 px wide; never mix widths.
4. Round line joins. (Round joins do not replace corner rounding.)
5. Round line caps on open paths.
6. Strokes are centred on their paths; inside or outside strokes create sharp inner corners.
7. Almost every sharp corner is rounded: radius 2 px for shapes at least 8 px wide or tall, 1 px for smaller shapes. Diagonals meeting at a right angle usually need about 2.41 px (1 + sqrt 2) to stay on the grid. Very sharp corners still get a little rounding. Where more than two lines meet, keep the corner sharp so the icon scales well.
8. At least 2 px of visual space between distinct elements, including gaps inside shapes and where elements meet or intersect. Test: a 2 px circle must fit in the gap.
9. Consistent visual weight: compare with the family's `circle` and `square` icons; blur both - the new icon should not look lighter or darker.
10. Optical balance: icons should look centred; symmetrical icons stay geometrically centred, asymmetrical ones may need a nudge.
11. Low density: simplify subjects to their recognisable features; dense areas read as heavier. Blur at the intended size to find crowded regions.
12. Smooth, simple curves: prefer arcs and quadratic curves; align Bezier handles; avoid extra control points.
13. Design for the pixel grid: align coordinates, arc centres, sub-elements and, where possible, diagonals to whole pixels so icons stay sharp on low-density displays.

## What is perishable vs durable

Durable: the method (fixed canvas, padding, one stroke, corner logic, minimum gaps, visual-weight and blur tests, pixel-grid alignment). Perishable: nothing here depends on a version; only the URL moved.

## Notes for the skill

This is the best template for writing the rules of any custom stroke icon set. The blur test and the 2 px-circle gap test are mechanical checks an agent can perform on a rendered sheet.
