# Requirements for Japanese Text Layout (JLReq, 日本語組版処理の要件): the rules that matter for UI and web
- id: jlreq · url: https://www.w3.org/TR/jlreq/ · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：W3C《日本語組版処理の要件》（JLReq）是日文排版的规范性参考，内容来自 JIS X 4051 与出版业实践。本摘要只收界面和网页排版用得上的条目：禁则四级、标点半角加空、和欧间四分空、行长与行距、ruby 与着重点、段首缩进、行调整优先级，以及对应的 CSS 支持现状。中文排版请看 clreq 摘要；这里不重复。

Read on 2026-09-27:
- The published W3C Working Group Note "Requirements for Japanese Text Layout", **11 August 2020** (`https://www.w3.org/TR/2020/NOTE-jlreq-20200811/`; previous version 2012-04-03). It is bilingual English/Japanese; section fragments are cited below.
- The editor's draft at `https://w3c.github.io/jlreq/`.
- The w3c/jlreq repository (last push 2026-09-18). Recent work is in `docs/` (e.g. `spacing_property`), not in the Note text.
- Related documents:
  - "Rules for Simple Placement of Japanese Ruby" (Note, 2020-06-09).
  - "Japanese Script Resources" (`/TR/jpan-lreq/`, 2026-03-20).
  - "Japanese Gap Analysis" (`/TR/jpan-gap/`, 2025-05-31).
  - "Requirements for Japanese Digital Text Layout" (jlreq-d), still a GitHub draft (repo pushed 2026-09-18; no /TR/ page — 404).
- CSS status from the `web-features` package v3.40.0 (jsDelivr) and the CSS Text 3 editor's draft (14 August 2026).

## Key facts
**Base model** [#principles_of_arrangement_of_kanji_and_kana_characters, #considerations_in_designing_the_kihonhanmen]
1. Kanji, hiragana and katakana sit in square em frames and are set **solid**, with no extra spacing. Tracking (tsumegumi) is for large display sizes. Fixed inter-character spacing is for short headings, running heads and captions, to balance them against longer ones; even spacing (stretching a line to a set length) is for table headings and lists of names.
2. Body size: generally **9 pt** in books, minimum **8 pt** except in dictionaries. Latin text is usually set larger (10–12 pt) because the scripts are designed differently.
3. Line length should be a **multiple of the character size**, so that lines end flush without adjustment. Keep lines to about **40 characters** in horizontal writing and about 52 in vertical; beyond that, use columns.
4. **Line gap = half-em to one em** of the character size, which is CSS `line-height` ≈ 1.5–2.0. Use half-em only for short lines, and about one em once lines exceed **35 characters**. Keep the line gap constant: ruby and emphasis dots live inside it and do not change it, so size the gap to hold them.

**Punctuation widths and spacing** [#positioning_of_punctuation_marks, #positioning_of_consecutive_opening_brackets_closing_brackets_comma_full_stops_and_middle_dots]
5. Commas 、, full stops 。, brackets 「」（） and middle dots ・ have a **half-em** advance plus spacing, so that they read as full-width:
   - half-em after 、 and 。;
   - half-em before opening brackets and after closing brackets;
   - **quarter-em** on each side of ・.
   All of this spacing may be removed during line adjustment, **except** the half-em after 。 in mid-line, which marks the sentence boundary.
6. Consecutive punctuation collapses. Examples:
   - 。」 → the 。 is set solid, then half-em after 」.
   - 」「 → a half-em gap between them.
   - 「「 → set solid, with half-em before the first.
   - 」」 → set solid, with half-em after the last.
   Fonts may implement brackets as full-width glyphs and use a negative half-em to get the same result.
7. At line end, 」, 、 and 。 have either half-em spacing or none; intermediate values such as quarter-em must not be used. JIS X 4051 keeps the half-em after 。 even at line end, and removes it after 、 and 」. [#positioning_of_closing_brackets_full_stops_commas_and_middle_dots_at_line_end]
8. An opening bracket at a paragraph start has three accepted patterns:
   - ① Indent 1 em, then the next line starts flush (tentsuki). This is the JIS X 4051 default.
   - ② Indent 1.5 em, then 0.5 em.
   - ③ Indent 0.5 em, then flush. Literary publishers such as Kodansha and Shinchosha use this.
   Pick one per product. [#positioning_of_opening_brackets_at_line_head]
9. Paragraph first-line indent = **1 em**, applied to all paragraphs in nearly all books. A line continuing a quotation, such as "」と言った", starts flush. Quotations on separate lines are commonly indented 2 em. [#line_head_indent_at_the_beginning_of_paragraphs, #line_head_indent_and_line_end_indent]

**Line breaking (kinsoku, 禁則)** [#characters_not_starting_a_line, #characters_not_ending_a_line, #unbreakable_character_sequences, #addendum_a3]
10. **Not at line start**:
    - closing brackets (cl-02), hyphens (cl-03), ?! (cl-04), middle dots (cl-05), 。 (cl-06), 、 (cl-07);
    - iteration marks 々ゝヽ (cl-09), prolonged sound mark ー (cl-10), small kana ぁっゃ… (cl-11);
    - warichu closing brackets (cl-29).
    **Not at line end**: opening brackets (cl-01) and warichu opening brackets (cl-28).
11. **Unbreakable** sequences:
    - double em dash ——, and runs of …… or ‥‥;
    - a European number, including its decimal point and thousands separator;
    - ¥, $ or ¢ plus the number that follows;
    - a number plus the %, ‰ that follows (some houses allow a break before %);
    - a Western word, except at hyphenation points.
    A break between a number and a Latin unit ("4 km") **is** allowed, and the quarter-em disappears at the break.
12. Four strictness levels (all forbid breaking after an opening bracket, or before a closing bracket, 。 or 、):
    - **Very loose** (newspapers): allows breaks around hyphens, ?!, ・, runs of the same inseparable character (cl-08: ——, ……, ‥‥), iteration marks, ー, small kana and pre/postfix abbreviations.
    - **Loose** (magazines): allows breaks around hyphens, ・, between two …… or ‥‥, 々, ー, small kana and %.
    - **Strict** (the default for general publications): allows only 々, ー and small kana to start a line.
    - **Very strict** (also general publications): no exceptions.
    Very strict gives the best line heads but needs more spacing adjustment; strict avoids adjustment.
13. CSS `line-break` (CSS Text 3 ED, 2026-08-14):
    - `strict` and `normal` both **forbid** breaks before small kana, ー and iteration marks, and inside …/‥.
    - `loose` allows them, and also allows breaks before ・：；！？ and around full-width prefixes and suffixes.
    - `normal` and `loose` allow breaks before 〜 and ゠.
    So JLReq's default "strict" level (small kana and ー may start a line) has no exact keyword. `line-break: loose` goes further than that level, while CSS `strict` or `normal` behave like "very strict" for these classes. `line-break` is Baseline widely available (low 2020-07-28).

**Japanese–Western mixed text** [#mixed_text_composition_in_horizontal_writing_mode, #handling_of_western_text_in_japanese_text_using_proportional_western_fonts]
14. In horizontal text:
    - Use **proportional** Latin, with half-width or proportional digits (half-width numerals are recommended for line adjustment).
    - **Full-width Latin letters are not recommended**.
    - A Western word space is **1/3 em**, and is set solid at line start and end.
15. Put a **quarter-em** gap between kana/kanji and Latin letters or digits. There is no gap at line start or end, or next to 、。「」 (those get their own half-em or solid rule). During justification the quarter-em may shrink to one-eighth em or widen to half-em (or 1/3 em), or be kept fixed.
16. Vertical writing (縦書き): three treatments.
    - Single letters and digits: upright, one by one, usually full-width.
    - Words and sentences: rotated 90° clockwise, proportional.
    - Two-digit numbers and 2–3 letter acronyms: **tate-chu-yoko** (縦中横), set solid and centred in the line.
    Around tate-chu-yoko, spacing follows the normal bracket and punctuation rules. [#mixed_text_composition_in_vertical_writing_mode, #handling_of_tatechuyoko]

**Ruby and emphasis dots** [#choice_of_size_for_ruby_characters … #composition_of_emphasis_dots]
17. Ruby is **half the base size** and sits **above** in horizontal writing, to the right in vertical. Headings of 12 pt or more may use smaller ruby.
    - Below about **7 pt** base size, ruby becomes illegible: give the reading in parentheses instead.
    - Avoid small kana in ruby, except where an exact reading matters (e.g. proper nouns).
    - A single mono-ruby character is centred on its base character (nakatsuki). Top alignment (katatsuki) is an option only in vertical text, never horizontal.
    - Group ruby (§3.3.6) and jukugo ruby (§3.3.7, Appendix F) have their own distribution rules; see also the simple-ruby Note.
18. Emphasis dots (圏点 / 傍点) are **half the base size** and centred on each character: to the right in vertical text, above in horizontal.
    - Use sesame ﹅ in vertical text and bullet • in horizontal.
    - Never put dots on 、。 or on brackets.
    - A different typeface (e.g. gothic instead of Mincho) and 「」 brackets are the generally used ways to emphasise; colour and side lines (bousen) are other options. Emphasis dots are "not very common".

**Justification priorities** [#procedures_for_intercharacter_space_reduction, #procedures_for_intercharacter_space_expansion]
19. **Reduce**, in this order:
    - Western word spaces, down to a quarter-em minimum.
    - The half-em after line-end 」、。.
    - The quarter-ems around line-end ・, then around mid-line ・.
    - The half-ems around brackets and after 、 in mid-line (some houses stop at quarter-em).
    - The Japanese–Latin quarter-em, down to one-eighth em.
    - Never the mid-line half-em after 。 (it separates sentences).
    **Expand**, in this order (the JIS X 4051 order):
    - Western word spaces, up to half-em.
    - The Japanese–Latin quarter-em, up to half-em.
    - Other allowed gaps, up to quarter-em.
    - Then even inter-character spacing.

**Web support and gaps** (web-features 3.40.0; JLReq gap analysis 2025-05-31)
20. What is safe:
    - `text-emphasis` (Baseline widely available, high 2024-09-03).
    - `writing-mode`, `text-orientation` and `text-combine-upright` (tate-chu-yoko): all widely available.
    - `<ruby>`: widely available. `ruby-align` and `ruby-position`: newly available 2024-12-11.
    - `font-size-adjust`: newly available 2024-07-25; useful for matching Latin x-height to kana.
21. Not Baseline (as of 2026-09-27):
    - `text-spacing-trim` (collapses the half-em of adjacent brackets and punctuation): Chrome and Edge **123** only.
    - `text-autospace` (the quarter-em ideograph–Latin gap): the feature is Firefox **145** and Safari **27** only. By key, `normal` and
      `no-autospace` are Baseline newly available since 2025-11-11 (Chrome **140**, Firefox **145**, Safari **18.4**); `auto`,
      `ideograph-alpha` and `ideograph-numeric` are Firefox 145 and Safari 18.4 only; `insert` is Firefox 145 and Safari 27 only.
    - `word-break: auto-phrase` (phrase-aware wrapping for headings): Chrome **119** only.
    - `hanging-punctuation`: Safari **26.5** only.
    - `text-wrap: pretty`: Chrome 117 and Safari 26.
22. Open gaps in the gap analysis:
    - #312: no reliable extra spacing between Japanese and Western text.
    - #265: `letter-spacing` adds stray spaces.
    - #181 and #182: consecutive-punctuation and line-head bracket positioning.
    - #457: emphasis marks are not skipped on punctuation by default; #338: other aspects of boten handling.
    - #167: poor vertical form controls (still open; the "Fixed" note beside it belongs to #168, upright text orientation).
    - #318: no warichu.
    - #177, #176, #175: ruby alignment, double-sided ruby and tabular ruby markup.

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: add a Japanese subsection (link clreq for Chinese instead of repeating it). It should cover:
  - body `line-height` 1.5–2.0 (half-em to one-em gap), with the gap fixed and big enough for ruby;
  - line length ≤ about 40 characters horizontal, as a multiple of the font size;
  - 1 em paragraph indent and one chosen bracket-at-line-start pattern;
  - proportional Latin and half-width digits, never full-width Latin in running text;
  - a quarter-em JP–Latin gap (via `text-autospace` where supported, otherwise a manual thin space or accept its absence — never a full space);
  - the kinsoku classes and a note on which CSS `line-break` level matches;
  - ruby at half size (paren reading below 7 pt);
  - emphasis via `text-emphasis` (sesame vertical, dot horizontal), not on punctuation.
- skills/design-studio/references/fundamentals/modern-css.md: support rows for `text-spacing-trim`, `text-autospace`, `word-break: auto-phrase`, `hanging-punctuation`, `ruby-align` and `text-emphasis`, with the versions above. Treat them as progressive enhancement.
- skills/critique-design/references/heuristics.md: JP checks: no line starting with 。、」ー or small kana in headings and buttons; no full-width Latin; no mid-sentence double spaces; ruby legible at its size.
- skills/implement-design/references/stacks.md (web): `lang="ja"` on the element (line breaking and glyph choice depend on it), `line-break: strict` for UI copy, `word-break: auto-phrase` for headings where available, `text-spacing-trim: normal`.

## Not verified / open
- The Note is from 2020; the editor's draft and the repo `docs/` (spacing_property, line-composition, simple-ruby) may contain newer guidance that was not read line by line.
- jlreq-d (digital text layout, most relevant to UI) has no published Note; its GitHub wiki ToC was not read.
- Browser behaviour of `line-break: normal` for Japanese in each engine was not tested; the CSS rules above are the specification's minimums, and UAs may add distinctions.
- Tables B–E (full spacing, breaking and adjustment matrices per character class) were not transcribed.
