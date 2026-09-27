# Lucide icon design language and specification
- id: lucide-icon-design-principles · url: https://lucide.dev/contribute/icons/design-principles · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Lucide 图标库的设计语言与规格：24×24 画布、2 px 居中描边、圆角规则、元素间最少 2 px、用 circle/square 对比视觉重量、模糊测试。今天的版本比上次多了一条"复用已有形状"，并新增了一页用 must/should 分级的正式规格。自绘描边图标时照这套写规则最省事。

Read on 2026-09-27: the design-language page (14 principles; the site also serves an LLM-friendly Markdown copy at `/contribute/icons/design-principles.md`) and the new specification page https://lucide.dev/contribute/icons/specification (`.md` copy read). The older URL `/guide/design/icon-design-guide` was already a 404 on 2026-09-21. Each principle on the page has do/don't figures.

## Key facts
1. **Requirement levels** (specification § Requirement levels): **must / must not** = required; **should / should not** = may flex to make a better icon; any exception must be intentional. Must-rules can be broken only by an explicit project exception; when should-rules conflict, choose clarity and consistency with Lucide (§ Priority of requirements).
2. **Canvas** (principles 1-2; spec § Canvas): 24 × 24 px, square (must); strokes at least **1 px** from the canvas edge (must).
3. **Strokes** (principles 3-6; spec § Strokes): **2 px** wide; round line joins; round caps on open paths; strokes centred on their paths (all must). Round joins do not replace corner rounding.
4. **Corners** (principle 7; spec § Corners): sharp corners should be rounded; for 90° corners, **2 px radius** on elements ≥ 8 px wide or tall, **1 px** on smaller elements; diagonals meeting at 90° use a grid-preserving radius, typically **≈ 2.41 px (1 + √2)**; acute corners get geometry-appropriate rounding; keep corners **sharp where more than two lines meet** so the icon scales consistently.
5. **Spacing** (principle 8; spec § Spacing): distinct elements **≥ 2 px** apart (must), gaps never < 2 px (must); inner gaps should be ≥ 2 px (test: a 2 px circle fits); spacing stays consistent where elements connect or intersect; no abrupt cut where another element visually continues.
6. **Visual weight** (principle 9): match the `circle` and `square` icons; place side by side and **blur both** - the new icon should not look much lighter or darker; stroke count and proximity make an icon heavier even at the same stroke width.
7. **Balance** (principle 10): look centred; symmetrical icons geometrically centred, asymmetrical ones may be nudged; compare with circle/square side by side and stacked.
8. **Density** (principle 11): similar level of detail to other Lucide icons; blur at intended size - areas that turn dark have too much detail; drop details not needed for recognition.
9. **Curves** (principle 12): smooth, as simple as the shape allows; prefer arcs and quadratic Béziers; cubic only where needed with aligned control points; no unnecessary control points.
10. **Pixel grid** (principle 13): align coordinates and arc centres to whole pixels where possible so icons stay sharp on low-density screens - but never at the cost of recognisable shape, smooth curves or balance.
11. **Reuse established shapes** (principle 14, new since the 2026-09-21 digest; spec § Shared geometry): variants keep the base icon's geometry, placement and orientation; shared elements and modifiers look the same across related icons; consistency never overrides clarity.

## What it changes for the skills
- skills/design-studio/references/disciplines/icons.md: use these rules as the template for any custom stroke icon set (canvas, safe zone, one stroke width, corner radii by size, 2 px minimum gaps, shared geometry for variants) and adopt the must/should split when writing a project's own icon spec.
- skills/design-studio/references/disciplines/icons.md: the blur test against a reference icon and the "2 px circle fits in every gap" test are mechanical checks an agent can run on a rendered icon sheet; a hand-drawn icon that fails them is not shipped.
- skills/critique-design/references/heuristics.md: mixed stroke widths, sub-2 px gaps and icons visibly heavier than their neighbours are review findings.

## Not verified / open
- The do/don't figures (SVG images) were not inspected; the numeric rules are all stated in text.
- Correction vs the 2026-09-21 digest: it listed 13 principles; the page now has 14 (shared geometry) and a separate normative specification.
