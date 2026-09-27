# Chinese Copywriting Guidelines (中文文案排版指北)
- id: chinese-copywriting-guidelines · url: https://github.com/sparanoid/chinese-copywriting-guidelines · fetched: 2026-09-27 · method: repo@9a5fbeb842f39644352fd79b5d8c6764718105cc
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror (source is MIT)
> 中文导语：sparanoid 维护的《中文文案排版指北》是中文互联网最常被引用的"中英混排空格与标点"约定，规则少、可机械检查（pangu / AutoCorrect）。它是团队约定而非国家标准；排版引擎层面的标准见 `clreq-chinese-text-layout`。

Read on 2026-09-27: `README.zh-Hans.md` and `README.md` (Traditional) on branch `master` at `9a5fbeb` (last commit 2023-08-09; the rules have not changed since). Licence MIT. The original has full right/wrong example pairs; this digest keeps only the rules.

## Key facts
1. **Spacing - CJK and Latin** (§ 空格 / 中英文之间需要增加空格): put a space between Chinese characters and English words.
2. **Spacing - CJK and digits** (§ 中文与数字之间需要增加空格): put a space between Chinese and numerals.
3. **Spacing - number and unit** (§ 数字与单位之间需要增加空格): `10 Gbps`, `20 TB`; exception - no space before degree and percent signs (`90°`, `15%`).
4. **No space around full-width punctuation** (§ 全角标点与其他字符之间不加空格): `买了一部 iPhone，好开心！`, not `iPhone ，` or `， 好`.
5. **Rendering-layer fix is not enough** (§ 用 `text-spacing` 来挽救？): the README cites CSS Text 4 `text-spacing` and IE's `-ms-text-autospace` as automatic CJK-Latin spacing, but says it is not widespread and absent from OS UIs (macOS, iOS, Windows), so keep typing the spaces. (The README predates the property split: today the CSS names are `text-autospace` and `text-spacing-trim`; see fact 11.)
6. **Punctuation - no repeats** (§ 不重复使用标点符号): not `！！`, `？？！！`.
7. **Full-width vs half-width** (§ 全角和半角): use full-width Chinese punctuation in Chinese text (exception: English book or periodical titles inside a Chinese sentence are set in italics, not in 《》); digits are half-width (exception: posters and design comps with very few digits may use full-width digits for alignment); inside a complete English sentence or special name, use half-width punctuation.
8. **Proper nouns** (§ 名词): correct capitalisation (GitHub, not github / GITHUB / Github); when a design needs all caps or all lowercase, keep the correct case in the HTML and apply `text-transform`; no non-idiomatic abbreviations (write TypeScript, HTML5, React, Next.js - not Ts, h5, RJS, nextjs, FED).
9. **Declared as optional** (§ 争议): whether to put spaces around links, and whether Simplified Chinese uses corner quotes 「」『』 instead of “” ‘’ - both are grammatically correct; pick one per product.
10. **Tooling** (§ 工具): pangu (JS, Go, Java, Python, Ruby, PHP, Vim, Vue, IntelliJ) and AutoCorrect (Rust/WASM CLI, Node, Python, Ruby, Java, Go, PHP, VS Code and IntelliJ plugins) apply the spacing rules mechanically.
11. **Browser status of automatic spacing today** (web-features 3.40.0 `data.json`, checked 2026-09-27, not part of this source): `text-autospace` property with `normal` / `no-autospace` is Baseline newly available since 2025-11-11 (Chrome 140, Firefox 145, Safari 18.4); the explicit `ideograph-alpha` / `ideograph-numeric` / `auto` values are Firefox + Safari only; `text-spacing-trim` (punctuation compression) is Chromium-only (123+).

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: state the four spacing rules and the full/half-width rules as the default convention for Chinese UI copy; say explicitly that consistency within one product matters more than which convention (many large Chinese products omit CJK-Latin spaces in UI strings - a team convention, not an error).
- skills/design-studio/references/fundamentals/cjk-typography.md: recommend AutoCorrect/pangu as the mechanical check for copy files; for web rendering, prefer `text-autospace: normal` where supported and do not double up (typed space + autospace gives a double gap).
- skills/design-studio/references/fundamentals/modern-css.md: carry the support status in fact 11 with its date.
- skills/design-studio/scripts/lint.mjs (and skills/critique-design/references/heuristics.md): repeated punctuation, half-width punctuation inside Chinese sentences and missing unit spaces are deterministic checks.

## Not verified / open
- Whether the source text-spacing advice will be revised for `text-autospace` is unknown; the repo has had no commit on `master` since 2023-08-09 (other branches were pushed in 2026-07, contents not inspected).
- The claim that large Chinese products omit CJK-Latin spaces in UI copy is carried over from the 2026-09-20 digest as an observation; no systematic sample was taken today.
