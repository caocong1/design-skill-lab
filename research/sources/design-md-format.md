# DESIGN.md format (Google Labs) - README-level digest
- id: design-md-format · url: https://github.com/google-labs-code/design.md · fetched: 2026-09-27 · method: repo@9bf8eae67128b6cc55ad9bf86665767deb4c11cd
- review_by: 2026-12-26 (perishable +90d) · licence note: paraphrased digest, not a mirror (source is Apache-2.0)
- superseded_by: design-md-spec (full spec 0.4 digest, including PHILOSOPHY.md); keep this file only as the short README-level summary and for old citations
> 中文导语：DESIGN.md 是 Google Labs 开源的"给编码 agent 读的视觉身份文件"格式：YAML front matter 放 token（规范性），Markdown 正文放理由；配套 CLI 可 lint、diff、导出到 DTCG / Tailwind。本文件是 README 层面的摘要，已被 `design-md-spec` 取代；新引用请指向后者。

Read on 2026-09-27: `README.md` at tag commit `9bf8eae` ("release: 0.4.0 (#161)", 2026-07-27; repo created 2026-04-10, last push 2026-09-14). npm `@google/design.md` latest = 0.4.0 (published 2026-07-27). The Stitch-hosted spec page https://stitch.withgoogle.com/docs/design-md/specification answered HTTP 200 but is a JS app and was not read; `docs/spec.md` in the repo is covered by `design-md-spec`.

## Key facts
1. **Two layers** (README § File Structure): YAML front matter (machine-readable tokens, normative) + Markdown body (`##` sections with rationale). "The tokens are the normative values. The prose provides context for how to apply them."
2. **Front-matter schema** (§ Token Schema): `version` (optional, current `"alpha"`), `name`, `description` (optional), `omitted` (optional; list of sections intentionally left out, strings or objects), `colors`, `typography`, `rounded` (scale → Dimension), `spacing` (scale → Dimension or number), `components`.
3. **Token types** (§ Token Types): Color = any CSS colour (hex, `rgb()`, `oklch()`, named); Dimension = number + `px` / `em` / `rem`; Token reference `{path.to.token}`; Typography = object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation`.
4. **Components** (§ Component Tokens): name → properties `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`; variants (hover, active, pressed) are separate entries with a related key (`button-primary-hover`).
5. **Section order** (§ Section Order): Overview (alias Brand & Style), Colors, Typography, Layout (alias Layout & Spacing), Elevation & Depth (alias Elevation), Shapes, Components, Do's and Don'ts. Sections may be omitted; those present keep this order.
6. **Consumer behaviour** (§ Consumer Behavior for Unknown Content): unknown section heading → preserve, no error; unknown colour / typography token name → accept if valid; unknown component property → accept with warning; duplicate section heading → error, reject the file.
7. **CLI** (§ CLI Reference): `npx @google/design.md lint DESIGN.md` (also `--format json`, stdin `-`; exit 1 on errors); `diff A B` detects token-level and prose regressions (exit 1 when the "after" file has more errors or warnings); `export --format json-tailwind | css-tailwind | dtcg` (Tailwind v3 `theme.extend` JSON, Tailwind v4 `@theme` CSS, DTCG `tokens.json`; `tailwind` is an alias of `json-tailwind`); `spec --rules` prints the rule table; binary alias `designmd`.
8. **Eleven lint rules** (§ Linting Rules): `broken-ref` (error); `missing-primary`, `contrast-ratio` (component bg/text pairs below WCAG AA 4.5:1), `orphaned-tokens`, `missing-typography`, `section-order`, `unknown-key`, `token-like-ignored` (warnings); `token-summary`, `missing-sections`, `omitted-rules` (info).
9. **Status** (§ Status): format version `alpha`; "spec, token schema, and CLI are under active development. Expect changes."
10. **What the schema still cannot express** (by absence in the README schema): motion/duration tokens, state matrices beyond named variants, modes (dark / high-contrast), elevation values as tokens.

## What it changes for the skills
- skills/design-studio/references/process/system.md: cite `design-md-spec` for the format; this file only backs the older claim "tokens normative, prose explains; unknown sections preserved", which remains true in 0.4.0.
- skills/design-studio/templates/DESIGN.md: keep the eight standard sections in order; put modes, motion tokens, state rules and non-goals in extra `##` sections after the standard ones (consumers preserve unknown sections); lint with `npx @google/design.md lint` when the host allows npm.

## Not verified / open
- The Stitch-hosted specification page was not rendered; differences between it and `docs/spec.md` are not checked here (see `design-md-spec`).
- Correction vs the 2026-09-21 digest: it read the same 0.4.0-era README but omitted `export` (DTCG / Tailwind), the eleven lint rules, the `diff` exit semantics and the `Elevation` alias.
