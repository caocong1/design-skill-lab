---
title: CJK typography and CJK font licences
evidence: digest
sources: [clreq-chinese-text-layout, chinese-copywriting-guidelines, jlreq, cjk-font-licensing, fluent-2, harmonyos-design, web-baseline-2026]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# CJK typography

Chinese, Japanese and Korean text: body numbers, stacks, line breaking, punctuation, CJK-Latin
spacing, truncation and the font licence matrix. This file owns punctuation widths and CJK-Latin
spacing. Latin and script-neutral rules (scale, pairing, loading, verify) are in
[typography](typography.md); the dense-UI floor of 12 px is in [data-dense-ui](../disciplines/data-dense-ui.md);
Chinese UI wording and format choices are in [product-ui](../disciplines/product-ui.md).

Contents: body text · stacks · glyph traps · line breaking · punctuation · CJK-Latin spacing ·
numbers, truncation · Japanese · Korean · licences · verify.

## Body text (Chinese)

| Property | Rule | Basis |
| --- | --- | --- |
| Size | 15-17 px body on web and mobile; captions 12-13 px; nothing below the 12 px floor | practice |
| Line height | 1.6-1.8 for running text, 1.5 in dense UI; at least 1.5 wherever emphasis dots or proper-name lines sit between lines (they need a gap of half the font size, planned into the base line height, never added to one line) | practice; clreq |
| Measure | 25-40 characters; one character is 1 em, so cap it in `em` (`max-width: 36em`), not `ch` | practice |
| Tracking | 0: Han text is set solid; small text may take +0.02-0.05em; never copy a Latin display tracking onto a Han headline, tighten it by eye | practice; jlreq |
| Paragraphs | one line of space, or a 2 em first-line indent in long-form and literary text, never both | practice |
| Weight | 400-500 body, 600 emphasis; CJK strokes are dense, so no thin weights at body size and no bold body | practice |

- Justified Chinese works better than justified Latin because every character is one em wide.
  For flush lines, make the measure a whole number of ems.
- Large-text size for contrast (WCAG gives no CJK number): [accessibility](accessibility.md).

## Stacks: Latin first, then the Chinese companion

Fonts fall back per character. Put the Latin face first so Latin letters and digits come from it,
then the CJK companion, then the platform defaults, then the generic:

```css
font-family: "<Latin face>", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei UI",
             "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
```

Companions by voice, matching the Latin stacks in [typography](typography.md). Append the defaults
above to each so a missing voice face falls to a known face, not an arbitrary one.

| Voice | Chinese companion |
| --- | --- |
| Neutral grotesque, industrial | `"PingFang SC", "Microsoft YaHei UI"` |
| Native UI | `"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei UI"` |
| Humanist | `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI"` |
| Old-style and transitional serif | `"Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", SimSun` |
| Didone display | `"Songti SC"` at a bold weight |
| Slab / typewriter | `STFangsong, FangSong, "Songti SC"` |
| Monospace | `"Sarasa Mono SC"` (OFL, bundle it), then `"PingFang SC"` |
| Rounded | `"Yuanti SC", YouYuan` |
| Handwritten / brush | `"Kaiti SC", STKaiti, KaiTi` |

- Platform defaults: PingFang SC (Apple), Microsoft YaHei UI (Windows Simplified Chinese UI;
  JhengHei UI for Traditional, Yu Gothic UI for Japanese, Malgun Gothic for Korean; SimSun is
  legacy), HarmonyOS Sans on HarmonyOS, the vendor's system face on Android (name none; end with
  `sans-serif`), the system font in WeChat mini-programs.
- Traditional Chinese swaps the companions (`"PingFang TC"`, `"PingFang HK"`,
  `"Microsoft JhengHei UI"`, `"Noto Sans CJK TC"`).
- Voice faces such as Kaiti SC and Yuanti SC are not on every machine: render and look.
- Set `lang` on the root and on every embedded run (`zh-Hans`, `zh-Hant-TW`, `ja`, `ko`). It picks
  regional glyph forms in pan-CJK fonts (Source Han, Noto CJK) and drives line breaking and the
  generic family.
- Variable CJK faces now exist (HarmonyOS Sans wght 40-900; MiSans; vivo Sans with an opsz axis;
  Source Han Sans 2.005 VF), but a full CJK file runs to tens of megabytes (HarmonyOS Sans SC
  20.6 MB, vivo Sans SC 44 MB). On the web that means the system stack or a sliced face (Licences, below).

## Glyph and weight traps

**A Japanese face ahead of the Chinese companion.** Any face with CJK coverage that sits before
the companion takes over the Han characters it has and leaks only the rest. `"Hiragino Maru Gothic
ProN"` in a rounded stack is the usual offender: most characters render in Japanese glyph forms and
its single weight gets synthetic bold, while simplified-only characters it lacks (设、认、这…) drop to
Yuanti or PingFang with real weights and another baseline. One line, two shapes, two weights, two
baselines. Keep Japanese faces out of a `zh` stack, or after the companion, unless the text is
Japanese. Same for `"Hiragino Sans"` and `"Yu Gothic"` in humanist or neutral stacks.
`$S/lint.mjs` (`S` = `skills/design-studio/scripts`) warns on this (`cjk-font`).

- **Single-weight faces** (Smiley Sans 得意黑, many display faces): `font-synthesis-weight: none`,
  or the browser fakes bold and one line looks like mixed weights.
- **No italics.** Chinese has no italic; `em`, `i`, `cite` and `var` are italic by default in the
  browser, which slants CJK into faux oblique. Set `font-synthesis-style: none` and restyle `em`
  (`font-style: normal`). Emphasise with weight, colour or emphasis dots.
- **Emphasis dots (着重号)**: Chinese puts them under horizontal text, Japanese above. CSS
  defaults to above, so Chinese needs `text-emphasis: dot; text-emphasis-position: under right;`.
  Browsers also dot punctuation, so wrap the words only.

## Line breaking (禁则)

Use the **basic** level (clreq's "most recommended"), one level per document:

- never at line start: 、，。：；！？, closing quotes, closing brackets, closing book-title marks,
  connector marks, interpuncts, solidi;
- never at line end: opening quotes, brackets and book-title marks;
- never split: the dash ⸺ and the ellipsis ……, a number and its %, ‰, °, ℃; a sign and its
  number (+5, −3); a currency sign and its amount (¥1,280); a note mark and the text it marks.

Browsers apply most of this by default; set `lang` and `line-break: strict` for UI copy. Anything
that measures text itself does not: canvas and chart labels, SVG text, custom truncation, native
text-measuring code, generated images. There, or when the engine misses a pair, glue it with `&nbsp;`, U+2060
(word joiner) or `white-space: nowrap`. Headings may use `word-break: auto-phrase` (Chromium only;
enhancement) so phrases stay whole.

## Punctuation

- Full-width punctuation inside Chinese sentences; half-width punctuation inside a complete English
  sentence or name; half-width digits. No space before or after full-width punctuation
  (`买了一部 iPhone，好开心！`). No repeated marks (`！！`, `？？！！`).
- Dash ⸺: U+2E3A, or two U+2014, two ideographs wide. Ellipsis ……: two U+2026. Interpunct in names:
  U+00B7 (half width in mainland China, full width in Hong Kong and Taiwan), never Japanese U+30FB.
- Quotes: “ ” and ‘ ’, or corner quotes 「 」『 』 (the usual choice in Traditional Chinese). Both
  are correct; pick one per product. English book titles inside a Chinese sentence are italic Latin,
  not 《》.
- **Compression.** Adjacent full-width marks (`。”`, `：“`, `）、`) should squeeze to avoid a
  double gap. `text-spacing-trim` does it in Chromium only, and there its initial value `normal`
  already compresses: a sample line was one em shorter than with `space-all` (measured, Chromium
  147, 2026-09-27). Safari and Firefox set every mark full width, so the same paragraph is wider
  and breaks differently: never design a line break around one engine.
- Hanging punctuation at line end (`hanging-punctuation`) is Safari only: enhancement.

## CJK-Latin spacing

The typographic norm is a gap of up to 1/4 em between Han characters and Latin letters or digits,
none at line start or end, none next to full-width punctuation or just inside Chinese brackets.
Two layers decide what the reader sees:

| Layer | Decide | How |
| --- | --- | --- |
| Source copy you write | one convention per product: spaces between Chinese and Latin or digits (the copywriting-guideline convention), or none (common in large Chinese consumer products). Never mix | lint copy files with AutoCorrect or pangu (`catalog.py show autocorrect`); number and unit spaced (`10 Gbps`, `20 TB`), except `90°` and `15%` |
| Web rendering | `text-autospace: normal` on text you do not control (CMS, user content, unspaced legacy copy) | measured, Chromium 147: the initial value is `no-autospace`; `normal` adds 1/8 em per boundary, and adds nothing where a space is already typed or next to full-width punctuation, so it is safe over spaced copy |
| Native text engines | the copywriting guideline reports no automatic gap in OS UIs (macOS, iOS, Windows) | assume the gap exists only if the copy has it |

- Sizes of the gap, at 16 px in PingFang SC (measured, Chromium 147): a typed space is about 1/3 em,
  `text-autospace` 1/8 em; clreq's norm is up to 1/4 em and may flex from 1/8 to 1/2 em in
  justified lines. Pick by eye in the render, then keep it.
- Specify `text-autospace: normal` / `no-autospace` natively; treat the finer values
  (`ideograph-alpha`, `ideograph-numeric`, `auto`, `insert`) as enhancement. Status:
  [web](../platforms/web.md) §4.
- Never make the gap with U+3000 (the full-width ideographic space) or two spaces: U+3000 is a whole
  em wide, and both survive into search, copied text and screen readers.
- Proper nouns keep their real case in the source (GitHub, TypeScript, iOS, not github, Ts, IOS);
  all caps or lowercase is `text-transform`. No invented abbreviations.
- Mixed lines: Latin in a proportional face, digits half width. Full-width Latin letters never;
  full-width digits only in a poster with a few digits that must align to the Han grid. When the
  Latin face looks small next to Han characters, match x-heights with `font-size-adjust`
  (Baseline) rather than scaling by eye, and check the shared baseline in the render.

## Numbers, dates, truncation

- Formats (万 and 亿, ¥, date, time, relative time) are chosen per context in
  [product-ui](../disciplines/product-ui.md). Setting them: keep every quantity unbreakable
  (`1.2&nbsp;万`, `¥1,280.00`, `2026年9月27日` with `nowrap` where it must stay on one line);
  tabular numerals wherever figures align or change in place.
- Budget width in ems: a Han character is 1 em, so a 12-character Chinese label at 14 px needs
  168 px plus padding. The longest shipped locale sets the budget, not Chinese, which is usually
  the shortest ([product-ui](../disciplines/product-ui.md)): measure that string in the render.
- Truncate by characters with the UI ellipsis `…` (one U+2026, what `text-overflow` draws), never
  inside a number, a unit or a name; multi-line clamps end on a whole character. The full text is
  reachable (tooltip on pointer, expand on touch; tables: [data-dense-ui](../disciplines/data-dense-ui.md)).

## Japanese (differences from Chinese)

- Body `line-height` 1.5-2.0 (a line gap of half to one em; about one em once lines pass 35
  characters), fixed across the page and large enough to hold ruby. Measure about 40 characters
  horizontal, a whole number of ems.
- Paragraph indent 1 em. An opening bracket at a paragraph start: pick one of the three accepted
  patterns per product (1 em indent then flush is the JIS default).
- Punctuation (、。「」（）・) has a half-em advance plus spacing; consecutive marks collapse
  (`。」` sets 。 solid). At line end the space after 」、。 is half em or none, never a quarter.
- Kinsoku: never at line start closing brackets, hyphens, ?!, ・, 。、, 々, ー, small kana
  (ぁっゃ…); never at line end opening brackets; never split ——, ……, a number, ¥/$ and its number.
  JLReq's default "strict" level lets 々, ー and small kana start a line; CSS `line-break: strict`
  and `normal` forbid it (stricter), `loose` goes further than JLReq. Use `strict` for UI copy.
- Japanese-Latin gap: a quarter em by the norm, none next to 、。「」 (`text-autospace` as above);
  proportional Latin, half-width digits, never full-width Latin letters.
- Ruby at half the base size, above in horizontal text; below about 7 pt base give the reading in
  parentheses. Emphasis dots above in horizontal text (sesame in vertical), never on punctuation;
  bold gothic, colour or 「」 are the more common emphasis.
- Faces: Hiragino Sans (Apple), Yu Gothic UI (Windows), Noto Sans CJK JP; `lang="ja"` always.

## Korean (no digest yet)

Korean separates words with spaces, but the default `word-break: normal` still breaks Hangul
between any two syllables (measured, Chromium 147: a seven-syllable word split mid-word in a narrow
column). Set `word-break: keep-all` so words stay whole, and give narrow containers room for the
longest word. Faces: Apple SD Gothic Neo (Apple), Malgun Gothic (Windows), Noto Sans CJK KR;
`lang="ko"`.

## Licences: the CJK font matrix

Read the current licence at the source before anything ships; this is not legal advice.
Generic licence rules are in [licensing](licensing.md); logo use of CJK faces in
[brand](../disciplines/brand.md).

| Tier | Fonts | Commercial use | Subset / convert (slice) | Self-host on web | Bundle in app | Obligations |
| --- | --- | --- | --- | --- | --- | --- |
| OFL, no reserved name | Noto Sans / Serif CJK | yes | yes, name may stay | yes | yes | ship the OFL text |
| OFL with a reserved font name | Source Han Sans / Serif, Smiley Sans 得意黑, Sarasa Gothic 更纱黑体, 猫啃什锦黑, 猫啃网扛重族 | yes | yes, but the modified file needs a new internal family name | yes | yes | ship the OFL; rename subsets (Adobe's official region subsets are originals and keep the name) |
| OFL plus a web permission | LXGW WenKai 霞鹜文楷 | yes | yes for web delivery, name may stay | yes | yes | not as an installable desktop font |
| Other open licence | LXGW Neo XiHei 霞鹜新晰黑 (IPA Font License, not OFL) | yes, for output | read its derived-program rules | read them | read them | per licence |
| Free-proprietary ("免费商用") | HarmonyOS Sans, MiSans, OPPO Sans, vivo Sans, HONOR Sans | yes | **no**: no modification, so never slice or convert them | unmodified file only, and unsettled (OPPO forbids other download channels; MiSans ships its own WOFF2) | yes, unmodified | a visible "uses X font" notice in the software; keep the licence |
| Free-proprietary, narrow grant | Alibaba PuHuiTi 阿里巴巴普惠体 | yes | **no** (no 转换 or 拆分) | not granted | not granted | keep the legal notice |
| Commercial | FounderType 方正, Hanyi 汉仪 | only with a purchased licence per use | no | no, without a licence | no, without an embedded licence | buy per use: website, app embedding, logo, packaging are separate |

- **Default for the web**: the system stack, or an OFL face sliced into `unicode-range` chunks with
  cn-font-split (`catalog.py show chinese-webfont`) and self-hosted, renamed if the family has a
  reserved name. Slice only fonts whose licence allows modification: never a vendor face, never a
  FounderType or Hanyi face without a licence that names embedding.
- **Vendor faces**: use them as the system font on their own platform (HarmonyOS Sans on HarmonyOS
  needs no bundling), or bundle the vendor's unmodified files in an app with the required notice.
  "免费商用" is not open source: rights the text does not grant are reserved.
- **FounderType and Hanyi**: the default licence is personal, non-commercial, one computer; a company
  website, app embedding, logo, packaging or advertising needs written permission.
  FounderType's five fonts free for 发布使用 (visual use in a design: 方正黑体, 书宋, 仿宋, 楷体,
  甲骨文) do not cover embedding the file. List prices on 2026-09-27: FounderType 0.3 万元 per font
  per year for one official website (basic tier); Hanyi lists 0.3 万元 for a company website.
- **Red flags**: a "free" face named 迷你… or 经典… is almost certainly a renamed commercial face;
  both foundries have issued public statements that they pursue these. A font directory listing
  (maoken.com lists 846 "free" fonts and keeps a 存疑 section) is not a licence: read each font's own
  terms. Read each OFL family's licence header for a reserved font name before shipping a subset.
- Handoff line per font: name, licence, allowed delivery (system / bundled unmodified / subset
  webfont), and the notice text when one is required ([handoff](../process/handoff.md)).

## Verify

Render with the real `lang` and real mixed copy, then check in the screenshot:

- glyph forms match the language (no Japanese forms in Chinese text) and no line mixes two faces;
- no 、，。 or closing mark at a line start, no split ⸺, ……, number and unit, sign and number;
- punctuation runs are compressed where the engine supports it and not doubled anywhere;
- the CJK-Latin gap follows the one convention, with no U+3000 or double spaces;
- single-weight faces are not faux-bold and nothing is slanted;
- the font actually loaded ([typography](typography.md), Verify) and its licence tier allows the
  delivery used.
