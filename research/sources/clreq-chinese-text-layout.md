# Requirements for Chinese Text Layout (clreq, 中文排版需求)
- id: clreq-chinese-text-layout · url: https://www.w3.org/TR/clreq/ · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：W3C 国际化兴趣组中文布局任务组编写的《中文排版需求》是中文排版的规范性参考（禁则分级、标点挤压、中西间距、行间标点）。本摘要只取与界面和网页排版直接相关的条目；竖排、注音等章节未展开。浏览器实现状态单列，因为那部分易腐。

Read on 2026-09-27: the latest published version, "W3C Group Note Draft 01 September 2026" (`https://www.w3.org/TR/2026/DNOTE-clreq-20260901/`), editors Fuqiao XUE and Richard Ishida. The TR is trilingual (English, Simplified, Traditional). Note: `www.w3.org` answered a bot challenge to a plain client; a request with browser-like headers returned the full document. The note is republished roughly monthly (per earlier research: 2025-10-08 … 2026-08-04, 2026-09-01).

## Key facts
1. **Line-start / line-end prohibition levels** (§6.1.1 行首行尾禁则, https://www.w3.org/TR/clreq/#prohibition_rules_for_line_start_end): four levels - *none* 不处理 (common in Taiwan/Hong Kong newspapers); *basic* 基本处理 - pause marks (、，。：；！？), closing quotes, closing brackets, closing book-title marks (乙式), connector marks, interpuncts and solidi never start a line; opening quotes, brackets and book-title marks never end a line - **"the most recommended"**; *GB-style* GB法 - basic plus the solidus (分隔号) may not end a line; *strict* 严格处理 - GB-style plus dashes and ellipses may not start a line.
2. **One level per document** (§6.1.1): the level should be uniform within a document; locally dropping to "none" for a run of three closing marks (e.g. 。』」) is a remedy, not a recommendation. User agents may choose or customise looser or stricter rules.
3. **Order of operations** (§6.1.1): apply punctuation compression first; prohibition follows "push in first, then push out" (先挤进，后推出) - try to squeeze the mark onto the previous line; only then move the previous line's last character down; distribute leftover space by priority, and only as a last resort widen character spacing evenly.
4. **Unbreakable marks** (§6.1.2 符号分离禁则, https://www.w3.org/TR/clreq/#prohibition_rules_for_unbreakable_marks): the two-em dash (破折号) and the ellipsis (省略号/删节号) each occupy two character widths and must not be split across lines (a run of several may break). Digits stay together; %, ‰, °, ℃, ℉ stay with the preceding number; +, −, ± stay with the following number; currency symbols stay with their amount (prefix ¥ or suffix ₫); superscripts, subscripts and note marks stay with the text they mark.
5. **Dash and ellipsis glyphs** (§5.1 短语与章节边界): dash = a centred line two ideographs wide, recommended U+2E3A TWO-EM DASH or two U+2014; ellipsis = six centred dots two ideographs wide, normally two U+2026.
6. **Horizontal CJK-Latin spacing** (§6.3.3 横排的中、西文混排配置, https://www.w3.org/TR/clreq/#mixed_text_composition_in_horizontal_writing_mode): Latin in proportional fonts; numerals proportional or monospace; tracking or space between a Han character and Latin/numerals of **up to 1/4 em**, none at line start or end; no added space next to Chinese pause/stop marks or just inside Chinese brackets. Alternative: a normal U+0020 word space (width depends on the font).
7. **Line adjustment ranges** (§6.2 行内调整, https://www.w3.org/TR/clreq/#line_adjustment; limits in §6.2.2.3 and the matching stretch section): CJK-Latin spacing may compress to 1/8 em and stretch to at most 1/2 em (many styles cap at 1/3 em); some styles fix it at the default (e.g. 1/4 em) and exclude it from adjustment; Western word spaces may compress to 1/4 em; interpuncts compress symmetrically down to half width.
8. **Grid alignment variant** (§6.2.4, https://www.w3.org/TR/clreq/#handling_of_grid_alignment_in_chinese_and_western_mixed_text_composition): in 纵横对齐 layouts, use an elastic gap > 0 and ≤ 1/2 em so that the Latin run occupies a whole number of ideograph widths.
9. **Mixed-text punctuation** (§4.1 字符与编码, mixed-text note): in Chinese body text use Chinese punctuation; formula-heavy technical books may use the Western full stop U+002E and ellipsis U+2026 with Western spacing.
10. **Interpunct** (§5.1, 间隔号): U+00B7; half an ideograph wide in mainland China, a full ideograph in Hong Kong/Taiwan; do not use Japanese U+30FB; after a one-letter abbreviated Western name use a Western period (e.g. "Ｂ．盖茨").
11. **Emphasis marks** (§5.3.1 着重号, https://www.w3.org/TR/clreq/#h_emphasis): dots (U+25CF or U+2022) under the text in horizontal writing (right side in vertical); normally not placed under punctuation; Chinese-dominant text keeps them below even when Japanese is embedded (Japanese puts them above).
12. **Interlinear marks and leading** (§5.6.1 行间标点的处理, https://www.w3.org/TR/clreq/#handling_interlinear_punctuation): with proper-name lines, wavy book-title lines or emphasis dots, single-sided setting needs line gap ≥ 1/2 of the font size, double-sided ≥ 5/8; set it in the base grid from the start, never enlarge single lines locally. Horizontal text uses single-sided setting; line before dots when both occur ("先线后点").

## Browser implementation (perishable; web-features 3.40.0 `data.json`, checked 2026-09-27)
- `text-autospace`: property with `normal` / `no-autospace` Baseline newly available 2025-11-11 (Chrome 140, Firefox 145, Safari 18.4); keyword values `ideograph-alpha`, `ideograph-numeric`, `auto` Firefox 145 + Safari 18.4 only; `insert` Firefox 145 + Safari 27.
- `text-spacing-trim` (punctuation compression): Chromium 123+ only.
- `hanging-punctuation`: Safari 26.5 only. `word-break: auto-phrase`: Chromium 119+ only.
- `text-emphasis` (着重号): Baseline widely available since 2024-09-03.

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: default prohibition level "basic"; compression before prohibition; never break ⸺ or ……, number+unit, sign+number, currency+amount (use `white-space: nowrap` or `&nbsp;`/U+2060 where the engine does not know the rule); CJK-Latin gap ≈ 1/4 em from the renderer, not a typed full-width space; interlinear marks need leading planned into the base grid.
- skills/design-studio/references/fundamentals/modern-css.md: carry the support table above with its date and the web-features version.
- skills/design-studio/scripts/lint.mjs: forbidden line-start punctuation in rendered text, split ⸺/…… and typed full-width spaces between CJK and Latin are detectable on a rendered page.

## Not verified / open
- The "no space next to Chinese pause marks" rule in §6.3.3 may interact with `text-autospace` implementations differently per browser; not tested.
- All fragment IDs above were checked against the 2026-09-01 HTML; section numbers can shift between monthly republications, fragment IDs are the stable reference.
- The previous digest (2026-09-20) quoted the 1/4-em rule from the vertical-writing section §2.1.3; the same limit is stated for horizontal text in §6.3.3, which is now the cited location.
