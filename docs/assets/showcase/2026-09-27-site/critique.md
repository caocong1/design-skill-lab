# Critique: Design Skill Lab public site (round 1 build)

2026-09-27 · fresh critic · scored against `brief.md` + `skills/critique-design/references/rubric.md`.
Evidence folder: `crit-shots/` (next to this file). Server: `python3 -m http.server` on `docs/`, Playwright Chromium.

**Verdict: `fix`, not `rebuild`.** The structure matches the brief: answer-first home, search in every header,
a real type-case idea, honest data-driven counts, a detail note that carries how_to_use, licence, caveats and
agent access. It fails the gate on five P1s: the home weight budget, the blank no-JS pages, the /skills/ first
viewport, the keypress count from home, and the 320 px reflow. Craft, typography and accessibility sit at 2.

> Timing note: `docs/data/thumbs.js` was rebuilt at 17:56, while this critique was running. The first capture
> pass had 41/812 thumbnails wired (built 16:40, before the 17:48 manifest), so it showed 771 grey kind-cards.
> Every page was captured again against the rebuilt data (796 thumbnails, 16 cards), and the thumbnail findings
> below are about that second pass.

## Findings (most severe first)

### P1: gate blockers

1. **The home page loads the whole catalogue, so it weighs about 1.6x its budget.** `index.html` pulls in
   `data/catalog.js`, which is 216.6 KB gzip (812 rows with every field). Home total: html 4.6 + site.css 9.8 +
   home.css 1.7 + site.js 6.0 + home.js 7.1 + catalog.js 216.6 ≈ **246 KB gzip**, plus the 50.8 KB Source Serif 4
   woff2. The budget is ≤ 150 KB before images. home.js only needs counts, picks, the ledger and each domain's
   section list.
   *Fix:* have `build-catalog.py` write a `data/home.js` summary (about 3–5 KB) holding counts, reach, thumbs, one
   S pick per domain, each domain's sections with their counts, and the dated proof items. Drop `catalog.js` from
   `index.html`. That also frees budget for finding 11.

2. **Without JS, the pages are empty of resources, and the home noscript note is false.** Evidence:
   `crit-shots/nojs-home.png` and `crit-shots/nojs-catalog.png`.
   - Home without JS shows no case and no picks. The proof list is JS-rendered, so the only proof left is the
     "评测进行中" line.
   - The catalogue shows only a sentence and links to llms.txt/catalog.json (143 characters of main text). That
     sentence is squeezed into the 232 px rail column.
   - Home's noscript says "资源目录另有不需要脚本的纯文本列表", which is untrue.
   - The brief requires "the pages carry a static no-JS list" and bans "a page that is blank without JS" and "zero
     resources on the home view".

   *Fix:* the build writes the static markup, and JS enhances it.
   - Home: the case (domains, sections, counts), the picks and the dated proofs as plain HTML.
   - Catalogue: an `<ol>` of all 812 rows (name link, zh line, host), grouped by domain, which JS replaces.
   - Hide the EN and 暗色 buttons unless `html.js` is set.

3. **The first viewport of /skills/ has no install command and names no audience.** Evidence:
   `crit-shots/skills-d-light-fold.png` and `crit-shots/skills-m-light-full-part0.png`. The install block is the
   last section, at about y 5,500 on desktop and y 10,500 on mobile (`skills-m-light-full-part7.png`). The
   lede describes the three skills but not who they are for. The brief says the first viewport "of / and /skills/
   says what the suite does in one sentence and who it is for, with one copyable install command".
   *Fix:* put the home's two-line install component under the lede, or beside it at 1440. Start the lede with
   "给设计师和设计工程师". Keep the bottom section for the Codex symlink and the 0.7.x upgrade notes.

4. **Opening a resource from home takes 5 keypresses; the target is 3.** On home, `/` focuses the field and
   `Enter` goes to `catalog/?q=配色` with nothing selected (`crit-shots/kbd-after-enter-d.png`). Then `j`,
   `Enter` opens the detail and `o` opens the site. On `/catalog/` itself, `/`, `Enter` opens the first hit
   (id=figma), so that page meets the target. The brief says "From any page: `/`, type, `Enter` opens the detail".
   *Fix:* on non-catalogue pages, submit the header form with a flag (`&open=1`) that makes the catalogue open the
   top hit. Alternatively, give the header a small top-3 suggestion list where `Enter` opens the top hit.

5. **The page does not reflow at 320 px, and the Copy button is cut off (floor F3).** At 320 CSS px, `/` and
   `/skills/` have `scrollWidth` 342. The install `<li>` is 326 px wide because `.cmds code span { white-space:
   nowrap }` keeps `design-skill-lab@design-skill-lab` on one line, which pushes the Copy button 22 px off-screen
   (`crit-shots/w320-home-fold.png`, right edge of the install block). At 390 px the page is clean.
   *Fix:* add `<wbr>` after `@` in the package token (or `overflow-wrap: anywhere` below 360 px) and `min-width: 0`
   on `.cmds li`, or stack Copy under the command below 360 px.

### P2: fix this round

6. **List-view thumbnails are illegible, and they cut density in half.** With 796 thumbnails wired, every list row
   gets a 120 px screenshot (`crit-shots/catalog-d-light-fold.png`, left column of the list). By the brief's own
   measurement, their text is illegible below about 320 px. Rows are at least 205 px tall, so about 3.5 rows fit
   in a 900 px viewport. In dark mode the column is a stack of bright slabs (`catalog-d-dark-fold.png`). Direction
   C specified a type-only galley, with thumbnails only in the 图版 grid and the detail.
   *Fix:* in list view, drop the image column and put a hue tick plus the kind in the meta line. Keep thumbnails
   in the grid (about 220–320 px) and in the detail (312 px). Rows drop to about 120 px, so about 6 fit per screen.

7. **While a thumbnail loads, it is a white box, which glares in dark mode.** The rule
   `.shot img { background: #fff }` paints the slot pure white until the image arrives. On a throttled connection
   in dark mode (scene B), the list and grid show blank white slabs (`crit-shots/list-d-dark-loading-slow.png`,
   first two rows; `icons-grid-d-dark-full.png`, the lower two-thirds). This is the brief's "blank thumbnail",
   caught in a real state.
   *Fix:* give the slot `background: var(--paper-2)`, or lay the image over the placeholder card so that the card
   shows until load. Add an optional fade-in on load, turned off under reduced motion.

8. **Some slots hold proof that does not exist yet, and one of them claims more than the repo shows.**
   - The home 校样 box and the /skills/ 评测 section both show a red "评测进行中" line (`home-board-dark-crop.png`).
   - The implement-design card shows "待补" (`skills-d-light-full-part2.png`, right card).
   - `evals/runs/` does not exist, and `CHANGELOG.md` has no 0.8.0 entry, yet the page names a "0.8.0" arm and
     "0.8.0 新增" markers.
   - The brief says "a proof piece that does not exist yet gets no slot".

   *Fix:* remove the eval line from home and the 待补 line from the card. In the /skills/ 评测 section, keep one
   plain line, "评测方案已定：6 个固定 brief、盲评规则；尚未开跑", linked to `evals/`, with no proof-red. Ship
   the 0.8.0 bump and changelog entry together with the site.

9. **The proof links would 404 today.** The three proof items link to
   `github.com/caocong1/design-skill-lab/blob/main/docs/assets/showcase/...`, but `docs/assets/showcase/` is
   untracked on `overhaul` and does not exist on `main`. A proof link that 404s is worse than having no proof.
   *Fix:* commit the showcase folder with the site. Link relatively (Pages serves the .md and .webp), per the
   brief's "every URL is relative", or make `check-links.py` verify these links after the merge.

10. **On /skills/, two metaphors compete.** The page uses the composing-room names (排字 / 校对 / 付印) beside a
    stock subway map (线路图, 换乘站, 站表, black lines, square stations; `skills-d-light-full-part0.png` and
    `part1.png`). The loop topology is mandated by BLUEPRINT §5, but direction C promised "the metro loop drawn as
    the job ticket's route through the shop", and the build draws a generic metro map. Identity carries through
    home but not through the page that explains the suite.
    *Fix:* keep the topology and draw it as a 工单 / job ticket: stations as ticket stubs, the 3 px case rule as
    the main line, proof-red only on the 校对 interchange. Rename 站表 to 工序 and 换乘 to 转交.

11. **The CJK display face exists only on Apple devices.** `--f-cjk` starts with Songti SC / STSong, leaves out
    SimSun, and then falls to Microsoft YaHei. On Windows, and on Android without Noto Serif CJK, every 字架,
    排字 and h1 heading turns into a sans. Direction C made typography the hero with a Source Han Serif CN
    display face. `not verified` on Windows; the conclusion comes from reading the stack.
    *Fix:* once finding 1 has freed the budget, load a build-time subset (only the heading glyphs, from the UI
    string table plus the domain and section names) of Source Han Serif / Noto Serif SC through
    `@chinese-fonts` or `@fontsource`, for headings only.

12. **The type scale has near-duplicate sizes, and the CJK ledes run too long.**
    - Neighbouring sizes 12.5 / 13.5 / 15 / 17 px are only 1.08–1.13x apart; the rubric asks for at least 1.25x.
    - The home lede measures 46 em (17 px, 782 px wide) and the /skills/ lede 50 em (850 px). The CJK range is
      25–40 em.

    *Fix:* cap the ledes at `max-width: 36em`. Consolidate the scale to 12.5 / 15 / 19 / 26 / 38, and let weight
    or face separate meta from labels.

13. **On mobile, chrome pushes the first result low, and search scrolls away.**
    - With `?q=配色` at 390 px, the first result starts at y ≈ 365 of 844 (`crit-shots/catalog-m-peise.png`).
    - Above it sit the H1 资源目录, the 筛选 bar, the count/sort/view row, and a "搜索 配色 ×" chip that repeats
      the field.
    - The header is `position: relative`. After scrolling the icons results (search at top −2,902 px,
      `catalog-m-scrolled.png`), refining the query means scrolling all the way back up.

    *Fix:* when a query is active, visually hide the H1, merge 筛选, sort and view into one 44 px row, and drop the
    chip (the field shows the query; give it a clear ×). At ≤ 720 px, make a compact search bar sticky on
    `/catalog/`.

14. **The home ledger uses glyphs with no legend.** "agent 核验 ● 628 ◐ 121 × 60 ○ 3"
    (`crit-shots/home-ledger-crop.png`) is labelled only in `.vh` text and `title` attributes, so sighted touch
    users cannot decode it.
    *Fix:* print short labels: 静态可读 628 / 需 JS 121 / 被拦截 60 / 未知 3. Or link each count to its facet.

15. **The /skills/ three-card row leaves dead space.** The columns are forced to equal height, so the critique and
    implement cards carry about 250 px of empty space above "读 SKILL.md"
    (`skills-d-light-full-part3.png`, top).
    *Fix:* use `align-items: start`, or move 真实产物 into one shared row under the cards.

### P3: polish

16. **Grid placeholders print the name twice.** The kind-card shows the name, and the caption repeats it straight
    after (`crit-shots/icons-grid-m-light-fold.png`). The mobile grid card also drops the kind, which the brief
    lists. *Fix:* in the card, show host, zh line, kind and hue, with the name only in the caption.
17. **Search matches are marked with a red underline on text that is already a link** (`kbd-after-enter-d.png`,
    `table-d-light.png`). It reads as a link or a spelling mark. *Fix:* use a tinted background `<mark>`.
18. **The designer's rationale shows up as UI copy:** "格子按条目数分大小，小格有最小宽度…数字都从目录数据算出",
    "条的长短与条目数成正比", "这一页只是地图". *Fix:* cut them, or reduce to "812 条 · 15 个域".
19. **The empty 校样批注 pane takes 390 px (27 %) at 1440 before anything is selected,** which holds the grid to
    3 columns (`icons-grid-d-light-fold.png`). *Fix:* collapse it to a key-hint strip until a row is chosen; the
    grid then goes 4-up.
20. **/lab/ sits in the primary nav with the same weight as the catalogue and the skills.** The brief calls it "a
    gallery entry, not the product". *Fix:* move it to the footer and keep the home lab line.
21. **The tier badge moves to the far right when a name wraps** (`catalog-m-light-full-part1.png`, Apple HIG and
    WeChat rows). *Fix:* keep it inline after the name.
22. **The 打开网站 button in the mobile sheet shows an `o` keycap on touch devices.** *Fix:* hide `kbd` under
    `(hover: none)`.
23. **In the table view, the Name column (about 160 px) wraps long names onto 4 lines while the Domain column
    (about 470 px) sits mostly empty** (`table-d-light.png`). *Fix:* rebalance the column widths.
24. **The build shipped stale thumbnail data.** At 16:40, 41 of 812 rows were wired while the manifest (17:48)
    had 795 QA-passed; it was fixed by the 17:56 rebuild. *Fix:* make `build-catalog.py` or `check-links.py` fail
    when `assets/thumbs/manifest.json` is newer than `data/thumbs.js`.
25. **Middle-dot meta strings** ("812 条 · 15 个域 · 83 个小节", "llms.txt · catalog.json") are on the brief's
    template-chrome list. They are minor, and a list or table form would remove them.

## The three questions

**Does the home prove what the suite does without fabricating?** It does not fabricate.
- Every number I checked comes from data: 812 rows, 15 domains, 83 sections, 796 thumbnails plus 16 cards, and
  agent reach that sums to 812.
- The proof items are dated, and one records a loss ("B … 只得 1 分，出局").
- There are no KPIs, stars or logos.

The proof is thin as a demonstration, though:
- Three markdown links and a 312 px copy of a 1896 px board image, which is texture at that size.
- The strongest proof, that this site is the output of the run, is stated only in a caption.
- The one line that claims activity ("评测进行中") is ahead of the repo (finding 8), and the links 404 until merge
  (finding 9).

*Make it prove more:* show one proof at a readable size, such as a cropped detail of the board, or a real
critique finding with its before/after screenshot once this report exists. Link "this page is the result" to
decisions.md.

**Is finding a resource fast on mobile?** It is moderately fast.
- Search is at the top of every page.
- The golden queries rank well:

  | Query | Top hits |
  | --- | --- |
  | 配色 | Realtime Colors, Sanzo Wada, Adobe Color |
  | 动效曲线 | cubic-bezier.com, Easing Wizard |
  | font | Modern Font Stacks, Bunny Fonts |
  | figma | Figma, then Figma Make, then the Figma MCP server (#3; the brief's golden query points to the MCP) |

- The detail opens as a proper sheet (`role=dialog`, `aria-modal`) with previous/next controls and every field.
- It is slowed by the 365 px of chrome before the first result, a header that scrolls away, and 205 px list rows
  (findings 6 and 13).
- There is no fast path from home into the detail (finding 4).

**Do thumbnails and placeholders look deliberate?**
- In the 图版 grid and in the detail, yes. The 16:10 top-cropped frames at about 220 px read as a proof sheet, and
  the 16 type-set cards (name, zh line, host, hue, kind) are the best expression of the idea.
- In the list view, no. At 120 px the screenshots are illegible noise, and they look like default card-list
  chrome (finding 6).
- The loading state is not deliberate: white slabs in dark mode (finding 7).
- When 771 rows used the mini kind-card (first pass), the list read as a wall of empty skeletons. Now that only 16
  rows use it, that is no longer visible, but the mini card is still the weakest placeholder (finding 16).

## Floor

| # | Result | Evidence |
| --- | --- | --- |
| F1 renders | pass | 28 captures (5 pages + 2 detail ids, 2 sizes, 2 themes): no HTTP ≥ 400, 0 console errors (3 `ERR_CONNECTION_RESET` from the single-threaded python server on one run, a tooling artifact); Source Serif 4 loaded |
| F2 contrast | pass (automated) | axe-core 4.10 (wcag2a/aa, 21aa, 22aa): 0 violations on all 20 page × size × theme runs; muted pairs computed: meta 6.82:1 light / 7.41:1 dark, en line 9.19 / 10.45. Focus-ring and boundary 3:1 checked by eye only |
| F3 no overflow | **fail** | 390: `scrollWidth` 390 everywhere. 320: `/` and `/skills/` 342 (finding 5). 200 % zoom (720 CSS px): clean |
| F4 targets | pass | ≥ 24 px, or spaced; header tools 40 × 40 (under 44 touch, see Accessibility) |
| F5 focus | pass (sampled) | search: 3 px ink outline (`focus-tab3-d.png`); EN: 2 px box (`focus-tab9-d.png`); not every control tabbed |
| F6 states | not verified | no state matrix supplied. Captured: zero results (good, with suggestion queries), loading (white slab, finding 7), no-JS (finding 2) |
| F7 no placeholder | pass | gaps are marked, nothing is invented; but slots contradict the brief (finding 8) |
| F8 licences | not verified | Source Serif 4 is OFL; third-party screenshots used as thumbnails need a recorded basis (`human-required`) |

## Ceiling scores

| Dimension | Score | Evidence (the capping shot) |
| --- | --- | --- |
| Fit | 3 | Primary task obvious at 1440/390 on home (`home-d-light-fold.png`, `home-m-light-fold.png`: outcome, search, install, dated proof all above the fold); capped by /skills/ first viewport (finding 3), weight (1), no-JS (2), home keypresses (4) |
| Hierarchy | 3 | Home reads h1 → install → case; 390 is re-composed, not shrunk (case → ranked bars); capped by mobile catalogue chrome (`catalog-m-peise.png`) and /skills/ spending its first screen on the role diagram |
| Identity | 3 | One idea (字架 / 常用字盘 / 校样 / 排字-打样-校对-付印) in the first viewport at 1440, and at 600 px it stands apart from the masonry rut; capped by the stock metro map on /skills/ (finding 10) and an Apple-only CJK display face (11) |
| Craft | 2 | One logic per property (3 px case rule, 1 px hairlines, zero radius except 3 px keycaps); accidents in captured states: white loading slabs in dark (`list-d-dark-loading-slow.png`), no-JS catalogue collapsed into the rail (`nojs-catalog.png`), dead space in the /skills/ cards, duplicate names on grid cards |
| Typography | 2 | Neighbouring sizes 1.08–1.13x apart; ledes 46–50 em against the 25–40 em CJK measure; good: phrase-level h1 breaks, CJK–Latin spacing kept from the data, no tracked CJK, nav `nowrap` holds |
| Accessibility | 2 | Strong basics (skip link, one `<main>`, live count, dialog semantics, `/ j k Enter o Esc`, reduced motion zeroed globally, 200 % survives), but 1.4.10 reflow fails at 320 on the two install pages |

Checks: automated (axe, contrast pairs, overflow at 390/320/720, font load, image `width`/`height`/lazy, `<main>`
count), manual (keyboard path, focus samples, throttled loading, no-JS), not done (screen reader, forced colours,
Windows font rendering, real WeChat in-app browser).

**Gate: not met.** The floor fails (F3), Craft, Typography and Accessibility are below 3, Fit, Hierarchy and
Identity are below 4, and 5 P1s are open. The next round should fix P1 1–5 and P2 6–8 first. Re-score Fit,
Craft and Accessibility after that.
