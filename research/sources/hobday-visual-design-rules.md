# Visual design rules you can safely follow every time (Anthony Hobday)
- id: hobday-visual-design-rules · url: https://anthonyhobday.com/sideprojects/saferules/ · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Anthony Hobday 的一页"安全规则"：28 条视觉基本功（近黑近白、中性色微饱和、阴影模糊约为偏移两倍、嵌套圆角、容器亮度差上限等），作者明言"有理由就可以打破"。其中多条是数字，能直接变成评审或 lint 检查项。

Read on 2026-09-27 (page undated). The page opens: you do not have to follow these every time; break any of them for a good reason; they are safe defaults. The page has 28 rules (28 `<h2>` headings), each with an illustrated right/wrong example; the numbering below follows the page.

## Key facts
1. Near-black and near-white instead of pure black and white (pure black is uncomfortably contrasty, pure white too bright); all later "black/white" mean near-black/near-white.
2. **Saturate neutrals** with the interface's colour: "less than 5% saturation" in HSB.
3. High contrast for important elements (buttons, content); structural elements and shadows can use very little contrast.
4. Everything is deliberate - whitespace, alignment, size, spacing, colour, shadow; you should be able to explain any point someone picks.
5. Optical alignment often beats mathematical alignment (odd shapes have a visual centre different from the geometric one).
6. Larger text → lower letter-spacing and line-height; smaller text → raise both.
7. **Container borders contrast with both** the container and the background behind it (on a dark card over a darker page, a 1 px border is lighter than both, not in between).
8. Everything aligns with something else, by some logic.
9. Palette colours have distinct brightness values, so they differ in lightness, not only hue.
10. If you saturate neutrals, use warm **or** cool, never both.
11. Measurements are mathematically related (a scale; the example uses multiples of 8).
12. Order elements by visual weight - heaviest first, lightest last, like a triangle (e.g. two buttons then three links).
13. A horizontal grid uses 12 columns (divisible into 1, 2, 3, 4 columns).
14. Measure spacing between points of high contrast, not bounding boxes (with a dark band behind one paragraph, measure to the band's edge).
15. Closer elements are lighter, in light and dark UIs alike.
16. **Shadow blur = 2 × offset** (4 px Y offset → 8 px blur); lower the shadow opacity as the element comes "closer".
17. Simple on complex or complex on simple; complex on complex should be avoided (simple on simple works but tends to look plain).
18. **Container-to-background brightness difference ≤ 12 % in dark UIs and ≤ 7 % in light UIs** (HSB brightness), based on the author's check of about 100 well-designed websites.
19. Outer padding ≥ inner padding in containers.
20. Body text ≥ 16 px (browser default); larger is easier.
21. Line length around 70 characters (60-80 is fine).
22. **Button horizontal padding ≈ 2 × vertical padding** (example 30 px / 60 px).
23. Two typefaces at most.
24. **Nested corners: inner radius = outer radius − gap** (example 30 px outer, 20 px gap → 10 px inner).
25. Never two hard divides next to each other (background change, container edge, divider line).
26. No shadows in dark interfaces (hard to see, or too loud if made visible).
27. One depth technique per interface (don't mix soft, hard and no shadows).
28. Lower the contrast of an icon paired with text - icons look heavier (opacity or a lighter/darker colour).

## What it changes for the skills
- skills/design-studio/references/fundamentals/layout-and-spacing.md: scale-related measurements, outer ≥ inner padding, spacing between points of contrast, 12-column option, button padding ratio, nested-radius formula.
- skills/design-studio/references/fundamentals/color.md: near-black/near-white, neutrals saturated < 5 % in one temperature, distinct lightness per palette step, container brightness limits (12 % dark / 7 % light), border contrasts with both surfaces.
- skills/design-studio/references/fundamentals/materials.md: closer = lighter in both themes; one depth technique; no shadows in dark UIs as the default (dark elevation by lightness).
- skills/critique-design/references/heuristics.md: rules 7, 16, 18, 22 and 24 (page numbering) are numeric and checkable in a review.
- skills/design-studio/scripts/lint.mjs: shadow blur/offset ratio, nested radius vs padding, container/background brightness delta and button padding ratio can be computed from styles.

## Not verified / open
- The page is undated; the 100-site study behind rule 18 is described but not published.
- Correction vs the 2026-09-21 digest: it counted 27 rules (it merged the warm-or-cool rule into rule 2; the page has 28) and omitted the < 5 % HSB saturation figure, the HSB basis and 100-site origin of the brightness limits, and the "lower shadow opacity as elements come closer" detail.
