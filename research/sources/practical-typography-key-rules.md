# Butterick's Practical Typography: summary of key rules
- id: practical-typography-key-rules · url: https://practicaltypography.com/summary-of-key-rules.html · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Matthew Butterick《实用排版》的"关键规则摘要"：正文四要素（字号、行距、行长、字体）的三个数字区间，以及引号、强调、全大写、段落间距、连字等 26 条西文排版基本功。中文排版数值不同，见 `clreq-chinese-text-layout`。

Read on 2026-09-27 (web book, continuously revised; page undated). The page has **26** numbered rules; the 2026-09-21 digest merged them into 15 and slightly misstated two (see "Not verified / open").

## Key facts
1. The four most important body-text decisions: **point size, line spacing, line length, font** (rule 1).
2. **Point size**: 10-12 pt in print, **15-25 px on the web** (rule 2).
3. **Line spacing**: **120-145 %** of the point size (rule 3).
4. **Line length**: average **45-90 characters** including spaces (rule 4).
5. A professional font is the easiest, most visible improvement (rule 5); avoid goofy fonts, monospaced fonts, most free fonts and system fonts - especially Times New Roman and Arial (rule 6).
6. Curly quotes, not straight (rule 7); apostrophes point downward (rule 25); foot and inch marks are straight, not curly (rule 26).
7. Bold or italic as little as possible, and not together (rule 8); never underline, except perhaps web links (rule 9).
8. All caps are fine for less than one line (rule 10); **5-12 % extra letterspacing** with all caps and small caps (rule 15); no fake small caps - use real ones or none (rule 14).
9. Centred text sparingly (rule 11).
10. One space between sentences (rule 12); no runs of word spaces or other white-space characters (rule 13).
11. Kerning always on (rule 16).
12. First-line indents of **1-4× the point size**, or **4-10 pt** of space between paragraphs - never both (rule 17).
13. Always hyphenate justified text (rule 18).
14. Don't confuse hyphens and dashes; no multiple hyphens as a dash (rule 19); the ellipsis character, not periods and spaces (rule 24).
15. Ampersands sparingly unless part of a proper name (rule 20); real ™ and © symbols, not alphabetic approximations (rule 21); a non-breaking space after ¶ and § (rule 23).
16. In a document longer than **three pages**, one exclamation point is plenty (rule 22).

## What it changes for the skills
- skills/design-studio/references/fundamentals/typography.md: use the three body-text ranges (15-25 px, 120-145 % leading, 45-90 characters) as the Latin baseline, alongside our tighter UI defaults; mark them Latin-only - CJK body text needs its own values (see `clreq-chinese-text-layout`, `wechat-miniprogram-design-guidelines`).
- skills/design-studio/references/fundamentals/typography.md: all-caps tracking 5-12 %, never bold+italic, indent-or-space (not both), hyphenate justified text - all checkable.
- skills/critique-design/references/heuristics.md: straight quotes, fake ellipses, double hyphens, tight all-caps and justified text without hyphenation are mechanical findings (overlaps Vercel's content rules).

## Not verified / open
- "Avoid most free fonts" predates today's high-quality open-licence families; read it as "avoid the defaults everyone has seen", and see `cjk-font-licensing` for licence questions.
- Corrections vs the 2026-09-21 digest: the exclamation-mark rule is "a document longer than three pages", not "a long document"; the page has 26 rules (it listed 15), including "apostrophes point downward" and "foot and inch marks are straight", which it folded into one line.
