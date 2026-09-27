# Decisions: Design Skill Lab public site, round 1

2026-09-27 · site stream · inputs: `brief.md`, `directions-plan.md`, prototypes `dir-1/`, `dir-2/`, `dir-3/` and their
screenshots, two blind judge reports (scored with the critique rubric, 1–5).

## Seed and roll (recorded at convergence)

- `sha256(brief.md) = fe8d1f732b12a7737561e681dbcafb60a9c37658d16f872a4cee99dad2cd1bd1`, round 1, no user seed.
- Rule: digest byte mod 7 over the seven referents, skip taken, stop at three; lead = next byte mod 3.
- Bytes fe, 8d, 1f gave 2 (Herbarium), 1 (Parametric parts catalogue), 3 (Composing room); byte 73 gave the lead,
  B (parts catalogue). Board labels: A = Herbarium (dir-1), B = Selection table (dir-2), C = Composing room (dir-3).
- Re-roll recipe (not used): `sha256(brief.md + "\nround:2")`, same rule, spent picks excluded.

## Scores (two judges, each 1–5)

| direction | fit | hierarchy | identity | craft | typography | usability |
|---|---|---|---|---|---|---|
| 1 Herbarium (judge 1) | 3 | 3 | 3 | 3 | 3 | 4 |
| 2 Selection table (judge 1) | 3 | 4 | 1 | 3 | 3 | 5 |
| 3 Composing room (judge 1) | 4 | 4 | 5 | 4 | 4 | 4 |

Judge 2 also picked 3. Its report was cut off in the hand-over, so only its graft list survives, not its score table.
The lead from the roll (B) lost. It had the best mechanics, but its identity scored 1: it read as any admin
directory. It also spent a whole band on four empty proof tiles, which breaks "no slot for proof that doesn't exist".

## Winner: 3, 字架 / Composing room

This is the only direction whose identity comes from the product itself rather than from its vocabulary:
- the directory is a type case, with compartments sized by entry count;
- search hits carry the proofreader's red underline;
- the proof slot is a 校样 cell.

That fits a design-resource desk paired with a critique suite, and nothing else. At 1440 its first viewport already
held the outcome sentence, search, install and real resources, with no count in the hero.

## Grafts taken (and how the conflicts between judges were settled)

From dir-2 (mechanics):
1. **Search in the global header on every page**, styled as the composing stick: a metal knee, a paper well and a `/` key.
   At 390 it gets a full-width row in the header on every page.
   - On `/catalog/`, the header field IS the workbench query, so a page never has two search fields.
   - The home page drops its in-page stick for the same reason.
   - Conflict: judge 2 wanted the count in the placeholder, but judge 1 marked dir-2 down for exactly that ("sells the
     count"). **Settled: no count in the placeholder.** It gives example queries instead. The count lives in the case
     caption, derived from data.
2. **Detail pane (校样批注)**: `k 上一条 / j 下一条`, `复制链接`, `打开网站 o`, `收起 Esc` with key caps, and a position
   counter `第 n / N 条` (from dir-1). On mobile it opens as a sheet with the same controls, not an inline accordion.
   - Conflict: judge 1 asked for "mobile expanded row", judge 2 for a sheet. **Settled: the sheet**, because it keeps
     the list position, and the density target (4+ rows per screen) rules out a row that pushes the list down.
3. **Removable 已选 chips + 清除全部** above the result count. The count sits in a live region. Facet counts stay
   visible and go grey at zero. No facet box scrolls internally.
4. **Agent-access glyphs** `● 静态可读 / ◐ 需执行 JS / × 被拦截 / ○ 未检测`, used both as a facet and in every row's
   meta line. They carry status without relying on colour.
5. **A dense table view** (登记) beside the list and the grid, for the catalogue builder.
6. **When a row has no screenshot**, the thumbnail slot shows a kind mark and a domain-hue tick, so rows stay aligned.

From dir-1 (honesty details):
7. **A dated provenance log in the detail pane**: 日期 + 成像 / 可达核验 / 鉴定, printed as proof marks.
8. **An accession ledger (入藏记录)**, computed from data, in the 校样 cell. It sits next to this round's own dated
   brief and options board, which are real artifacts. The cell no longer reads only 待补.
9. **The 1a/1b/2a/2b key for choosing a skill**, restyled as a proofreader's routing table in the 排字/打样/校对/付印
   section.
10. **The compact mobile result row**: thumbnail or placeholder on the left, name, two lines of zh, domain path. The en
    line and 怎么直达 wait for the sheet. 4 or more rows per 390 screen.
11. **One line under install with an example first prompt.**

Fixes to dir-3:
- Drop the 001/002 row numbers.
- Keep the metaphor out of the mechanics:
  - the search button becomes 搜索 / Search (an icon in the header), not 排版 / Set;
  - the views are 列表 / 图版 / 登记, not 排样 / 打样页;
  - the count is 共 N 条.
  - The names 字盘, 常用字盘, 校样 and 校样批注 stay.
- **The caption no longer claims exact proportionality.** With 15 domains and one of only 5 entries, an exact
  area-proportional case is impossible at any legible size. The caption now says compartments are sized by count,
  small ones have a minimum width, and 常用字盘 and 校样 are not sized by count.
- EN case cells get minimum widths and a single-line, truncating section list, so names and counts never wrap.
- The install column is top-aligned with the hero and stays inside the grid.
- Grey sub-labels move up a step: every text token is at least 4.5:1 on every surface in both themes (measured, see
  `site.css` header).

## System decisions (for the builders)

- Tokens use `light-dark()` with `color-scheme`, a manual toggle (`data-theme`), and an `@supports` fallback for
  browsers without `light-dark()`.
- **Fonts: one webfont, Source Serif 4 Variable, Latin subset only**, from jsDelivr, pinned at `@fontsource-variable`
  5.3.0. That is one woff2 of 50,824 bytes. CJK display uses system Songti / Noto Serif CJK, and Windows falls back
  to YaHei (see the table in `site.css`). CJK body uses the system sans.
- The home page renders from a **summary shape** (domains, section counts, picks, ledger). Today that shape is computed
  client-side from `CATALOG_V2`. If the build emits it directly, one `<script>` tag changes (open issue: the full
  catalog.js is 117 KB gzip).

## What would change this decision

- **User testing shows the case fails as navigation.** That means people don't read compartments as clickable
  domains, or 390 users skip the ranked list. Fall back to dir-2's index (B) with the composing-stick header, keeping
  the grafts.
- **The CJK serif looks broken on the commonest real reader** (Windows + WeChat in-app browser without Songti or Noto
  Serif CJK) and no ≤ 60 KB display subset exists. Then the display face goes sans, and the direction has to prove
  its identity through the case and the proof marks alone.
- **Proof-red reads as "error" in testing.** Red is kept for marks only. If it still misleads, the marks switch to
  an ink underline with a red caret.
- **The catalogue grows past about 1,000 rows or 20 domains.** The case gets too fine and needs a second level (sections as
  sub-cases), or it gives way to the index.
