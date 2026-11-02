# OKLCH in CSS (Evil Martians): why OKLCH, its ranges, gamut mapping and the migration recipe
- id: evil-martians-oklch · url: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d for the colour-model facts; the tool list and the browser-support sentence are dated observations) · licence note: paraphrased digest, not a mirror (the posts are all-rights-reserved blog articles; Harmonizer's repository root lists no LICENSE file)
> 中文导语：Evil Martians（PostCSS、Autoprefixer 的作者团队）解释为什么用 OKLCH 取代 RGB/HSL：L 是感知明度，同 L 的颜色对比度相近，蓝色段没有 LCH 的色相漂移；也给出 C 的实际上限（sRGB 与 P3 都低于 0.37）、浏览器超出色域时的裁切行为、"sRGB 值打底 + `@media (color-gamut: p3)` 叠加 P3 值"的做法，以及迁移步骤和工具清单。本仓库 color.md 里 OKLCH 的取值范围和色域规则以此为一手依据。

Read on 2026-11-01: the article (page metadata date 2025-09-17, Andrey Sitnik and Travis Turner; the body says "at the time of this writing in 2024" and its changelog ends 2024-07-18); "Exploring the OKLCH ecosystem and its tools" (2025-05-28, Irina Nazarova, Arthur Objartel, Travis Turner); the Harmonizer README (github.com/evilmartians/harmonizer, created 2024-12-28, last push 2026-10-02). First read by a verifying subagent, then the main article re-fetched for the quotes below.

## Key facts
1. **`L` is *perceived* lightness, `0` (black) to `1` (white)**. Percentages 0–100% are accepted too, but the changelog records moving the examples from `%` to floats because `%` does not work inside `calc()` and relative colours.
2. **`C` (chroma) runs "from `0` (gray) to infinity"; "For both P3 and sRGB the value will be always below `0.37`."**
3. **`H` is a hue angle 0–360**: red near 20, yellow 90, green 140, blue 220, purple 320; `none` is allowed for achromatic colours.
4. Gamut claims as the article states them (no source cited): sRGB "can render only 35% of these human-visible colors"; P3 screens "add 30% more new colors".
5. **Why not LCH**: "an unexpected hue shift on chroma and lightness changes in blue colors" between hues 270 and 330; OKLCH "keeps a constant hue as expected" (the article's figure).
6. **Out of gamut**: "browsers will render the closest possible color"; the CSS spec asks for an OKLCH-based gamut-mapping method, but "right now, Chrome and Safari use the fast, but inaccurate, clipping method". Recommended: manual gamut mapping, the sRGB value as the base and the P3 value inside `@media (color-gamut: p3)`, enforced by the `stylelint-gamut` plugin.
7. Support sentence, dated in the text: "as of August September 2025 [sic], `oklch()` is available in all the latest devices and browser versions" (attributed to MDN); "Right now, all browsers support `oklch()`".
8. **Migration recipe**: convert existing hex, `rgb()` and `hsl()` to `oklch()` (oklch.com, the `convert-to-oklch` script, the OkColor Figma plugin); move colours into a palette of custom properties so components reference variables and themes change only the variables; Stylelint rules that forbid legacy notations and require P3 colours to sit inside a `color-gamut` query, run on CI; then add P3 variants for accents and use OKLCH in SVG and relative colours.
9. Tools named across the two articles: oklch.com, Huetone, convert-to-oklch, OkColor, stylelint-gamut, Color.js, culori, Chris Lilley's gamut-mapping comparison; the ecosystem article adds Harmonizer, apcach, Polychrom, and a Figma caveat (as of 2025-05-28, pasting an `oklch()` value into Figma's HEX input is broken when the file has a P3 profile).
10. **Harmonizer** (README): "Using the OKLCH color model and APCA contrast formula", levels "(e.g., 100–900) as lightness steps", contrast "per level (calculated against your background)", APCA by default or WCAG, P3 or sRGB (taken from the Figma document), exports Tailwind, CSS variables and JSON; built on apcach.

## What it changes for the skills
- skills/design-studio/references/fundamentals/color.md: the OKLCH ranges (L 0–1, C below 0.37 in sRGB and P3, H in degrees), the browsers' clipping behaviour and the sRGB-base + `@media (color-gamut: p3)` rule now have a primary source; describe `color_tools.py`'s behaviour as mapping, distinct from the browser's clipping.
- skills/design-studio/references/process/token-formats.md: the wide-gamut snippet is fact 6's recipe; cite it.
- catalogue: Harmonizer and the ecosystem article are candidates for the `color` domain.

## Not verified / open
- The 35% / 30% figures are the article's own and uncited; the skills do not need them.
- Browser clipping behaviour is as the article states for 2024; whether Chrome or Safari now implement the spec's gamut mapping was not re-tested here.
- Harmonizer's licence: no LICENSE file in the repository root, GitHub reports none; treat as all rights reserved until one appears.
