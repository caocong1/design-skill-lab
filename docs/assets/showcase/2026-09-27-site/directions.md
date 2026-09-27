# Directions plan: Design Skill Lab public site (round 1)

Input: `brief.md` (sha256 below). Method: 0.8.0 divergence engine (rut → opposite → referents from the audience's
world → seeded roll → direction cards → options board). Every direction has to work across all three pages and
all four jobs; none is a strawman.

## 1. Category rut and its predictable opposite

- **The rut: "design resource directory / skill homepage".**
  - Directory: a centred hero ("Discover 700+ curated design resources"), a big search pill, a row of category pill
    filters, then a masonry or uniform grid of screenshot cards with hover zoom. A "Submit a resource" button and a
    newsletter box. Dark mode means near-black plus a gradient.
  - Skill page: the SaaS landing. Gradient headline, an install snippet in a glowing terminal box, three icon
    feature cards, a star badge or logo wall, an FAQ accordion.
  - The rut sells the count and the look. It hides the fields that make a curated catalogue useful:
    how_to_use, licence, caveats, agent access.
- **The predictable opposite:** "anti-design".
  - Either README-core (browser-default serif, blue links, black rules) or the 2026 "editorial broadsheet" cure:
    hairlines, zero radius, mono micro-labels, cream + serif.
  - Both are defaults now. The first is already spent as `/lab/?style=plain`; the second is on the dated tell
    list in `anti-slop.md`.
- **Spent for this round (tried-directions memory).** The 16 `/lab/` referents: swatch book, Swiss poster,
  刻本书目, terminal, blueprint, card catalogue, museum label, control console, sticker wall, plain HTML, admin panel,
  design canvas, agent chat, type specimen, metro map, island game. A referent next to one of these must say how it
  differs (see "lab adjacency" below).
- **Fixed across all directions (not a variable).** The metro-style routing SVG on `/skills/` (BLUEPRINT §5), the
  facet set, keyboard map, URL state and no-JS list. Directions restyle these; they don't remove them.

## 2. Seven referents from the audience's world (≥ 3 material families; here 7)

Order fixed before hashing. Index = roll value.

| # | Referent (concrete) | Material family | What it lends the site | Lab adjacency |
|---|---|---|---|---|
| 0 | **《新华字典》检字体系**: 部首检字表, 音节索引, 书眉 running heads, coloured thumb-index tabs on the fore-edge | Reference print (辞书) | Two lookup routes (domain tree + search), persistent edge tabs as domain nav, 字头 → 释义 → 例句 entry rhythm (name → zh → how_to_use) | card catalogue (both library print; the dictionary is a lookup *system*, not a drawer of cards) |
| 1 | **Parametric parts catalogue**: 立创商城 元器件参数选型 + McMaster-Carr (web and the printed catalogue) | Industrial procurement catalogue | Home = the whole taxonomy on one page; facet columns with counts; a dense spec table; a datasheet per part with test conditions; line pictograms instead of photos | admin panel (no sidebar/KPI cards; index-home and parametric facets instead) |
| 2 | **Herbarium sheet**: 国家植物标本馆 (PE) / 中国数字植物标本馆 (CVH): specimen on a standard sheet, printed label lower right, dated 鉴定签 slips added later, 模式标本 | Scientific collection | Resource = specimen + label (fields as label lines), taxonomy = domain/section, provenance and re-determination dates, an honest "not imaged" state | museum label (a label is one artwork at a time; a herbarium is a dense, systematic, dated collection) |
| 3 | **Composing room**: 印刷厂排字车间 铅字架 (常用字盘 at the centre, 备用字 at the edges), the composing stick, 校样 marked with GB/T 14706 校对符号; California job case | Print-workshop tools | Home = a case whose compartments are sized by count; search = setting a line; results = a galley proof; critique = proof marks | type specimen, 刻本书目 (both typographic; this one is about the *workshop and process*, not a face or a book) |
| 4 | **药品说明书 + 国家基本药物目录**: fixed-order 【适应症】【用法用量】【不良反应】【禁忌】【注意事项】 | Regulated labelling | Every field in a fixed, legally ordered slot (best_for / how_to_use / caveats / "Not for"); the list as a formulary table | none |
| 5 | **Design annual**: GDC《平面设计在中国》作品集, Tokyo TDC Annual: plates at uniform scale, credit lines, section dividers, back-matter index | Design publishing | Thumbnail plates with strict credit captions; divider spreads per domain; A–Z index as the list view | museum label; closest to the rut (gallery grid) |
| 6 | **caniuse.com / MDN compatibility tables** | Developer reference web | Search-box home; resources × attributes matrix with status cells (access, login, agent access, status); numbered notes | admin panel (both tables) |

## 3. Seeded roll (deterministic)

```
$ shasum -a 256 brief.md
fe8d1f732b12a7737561e681dbcafb60a9c37658d16f872a4cee99dad2cd1bd1  brief.md
```

Rule: read the digest bytes in order, index = byte mod 7, skip indices already taken, stop at 3. The lead is the
next byte mod 3, used as a position in the pick order. Round 1, no user seed. (The mod-7 bias on 256 values is under
0.4%, which is negligible.)

| byte | hex | value | mod 7 | result |
|---|---|---|---|---|
| b[0] | fe | 254 | 2 | take → **Herbarium** |
| b[1] | 8d | 141 | 1 | take → **Parametric parts catalogue** |
| b[2] | 1f | 31 | 3 | take → **Composing room** |
| b[3] | 73 | 115 | 115 mod 3 = 1 | lead = pick #1 → **Parametric parts catalogue** |

Picks span three families (procurement catalogue, scientific collection, print workshop).
- **Lead:** B, 选型表 (see §4 for labels).
- **Re-roll** (if the user rejects all three and the axis diagnosis says "wrong referents"):
  `sha256(brief.md bytes + "\nround:2")`, same rule, spent picks excluded. `seed.py` in 0.8.0 generalises this as
  brief + round + user seed.
- **Canon control (not rolled, not a direction card):** the best conventional workbench (search header,
  sidebar facets, list with thumbnails). It is the yardstick column in the board's comparison table and the fallback
  if every direction fails the floor.
- **Record:** write the seed, the digest and the picks to `decisions.md` at convergence.

Board labels are neutral: A = Herbarium, B = Parts catalogue (lead), C = Composing room.

## 4. Direction cards

### B (lead): 选型表 / Selection Table

- **Thesis:** the catalogue as a parts catalogue. The whole taxonomy fits on one page, facets are parameters with
  counts, every resource has a datasheet. Speed is the aesthetic, and nothing is sold.
- **Own-world referent:** 立创商城's 参数选型 grid and McMaster-Carr. Design engineers cite McMaster as the fastest
  catalogue on the web; Chinese hardware-adjacent teams pick parts on 立创 weekly.
- **The one memorable idea:** a set of 23 drawn **kind pictograms** in the single-weight line style of a parts
  catalogue (gallery, tool, font, library, spec, mcp…). They serve as facet keys and as the placeholder for every
  missing or visually useless thumbnail. Plus a highlighter-yellow mark that means only "selected or filtered".
- **Visual axes:**
  - **Type voice:** neutral utilitarian grotesque. CJK in the system stack; Latin **Public Sans** (fontsource,
    verified on jsDelivr), or system-ui if the budget is tight. 14/13 px body, bold names, tabular numerals for every
    count.
  - **Colour strategy:** restrained. White and cool-grey banding, black text, one functional highlighter yellow
    (selection, active facet, current row; black text on it). Domain hues appear only as 8 px keys.
    - Dark theme: graphite rows, and the marker becomes an amber fill with dark text.
  - **Layout grammar:** a strict functional grid.
    - Home: a multi-column index of all 16 domains (5 columns at 1440, 1 at 390), each block showing heading, count
      and sections with counts.
    - Catalogue: facet strip over a table.
  - **Density:** high (cockpit end), kept calm by alignment and banding, not rules.
  - **Shape:** 4 px on controls, square rows. No decorative hairlines: header band plus zebra rows.
  - **Depth:** flat. Only the datasheet drawer casts one edge shadow.
  - **Imagery:** small thumbnails (≤ 120 px) as recognition aids, plus pictograms.
  - **Motion:** nearly none. Counts update instantly; the drawer slides in 160 ms; nothing reveals on scroll.
- **Structural axes:**
  - **Navigation model:** index-first hub. Home is the full taxonomy index with a persistent search bar in the top
    band on every page; breadcrumbs read domain › section.
  - **Catalogue container:**
    - Desktop: a **table** (名称 · 说明 · kind · tier · access · agent · lang · status) with a right-hand
      **datasheet drawer** holding every field.
    - Mobile: stacked spec cards and a full-screen sheet.
    - A grid view exists for visual kinds only.
  - **Thumbnails:** a thumbnail column the user can toggle (72×45) and chips in the home index (the S picks per
    domain). A pictogram placeholder when the thumbnail is missing or the row is a non-visual kind (article, book,
    course, spec, repo).
  - **Skills explained:** each skill as a **datasheet (规格书)**: 用途, 输入, 输出, 模式, 不适用, 版本, 安装.
    - Routing is a 选型指南 selection flowchart ("have a design → implement-design…") beside the mandated metro loop.
    - The eval scoreboard is a datasheet "measured characteristics" table: metric | test condition (brief) |
      no-skill | 0.7.0 | 0.8.0, losses included.
- **Home first viewport (1440):**
  - Top band: wordmark text, search, 中/EN, GitHub.
  - One outcome sentence, then the plugin install command on one line with a copy button.
  - The domain index starts above the fold.
  - A "最近的规格书" strip of real artifacts (brief, critique report) with dates.
- **Home first viewport (390):** outcome sentence, install command, search, then the index folded to domain rows
  with counts.
- **Where it will fail:**
  - It reads as procurement software: cold, "undesigned" to visual designers.
  - It can collapse into the canon or the spent admin look if the pictograms and the yellow are cut.
  - Browsing for inspiration (job 4) is its weakest job.
  - The 16-domain index on a phone becomes a long accordion.
  - The yellow marker needs a separate dark-mode token pair to hold contrast.

### A: 标本馆 / Herbarium

- **Thesis:** every resource is a mounted specimen with a printed label. The collection is trustworthy because every
  sheet says who collected it, when, and what was re-determined since.
- **Own-world referent:** 国家植物标本馆 (PE) sheets and the CVH digitised portal. S-tier = **模式标本**, the
  reference specimen of its kind.
- **The one memorable idea:** the **label block**. A fixed-position printed label in the lower right of every card
  (馆藏号 = id, 采集 = origin + added, 鉴定 = tier, 可达 = agent_access + checked date), plus dated **鉴定签**
  slips on the detail sheet: caveats, status changes, re-checks. Missing thumbnails become an honest
  "未成像 / not imaged" sheet.
- **Visual axes:**
  - **Type voice:** a humanist legibility sans for labels and names: Latin **Atkinson Hyperlegible Next**
    (fontsource, verified), CJK in the system sans. No serif, no italic. The specimens are the display.
  - **Colour strategy:** tonal neutral plus the specimens. A cool grey-green cabinet ground, white sheets, black ink,
    and one blue-black stamp ink for tier and determination. Every other colour comes from the thumbnails.
    - Dark theme: a charcoal cabinet and dark-grey sheets, with the specimens unchanged.
  - **Layout grammar:** a uniform grid of portrait sheets (a 16:10 specimen mounted on the upper part, the label
    below) and a dense **登记簿 register** ledger as the second view.
  - **Density:** medium in the grid, high in the register.
  - **Shape:** square sheets. The label has a printed border, the only rule used.
  - **Depth:** paper on cabinet, shown by tone contrast plus a 1 px edge (no soft shadow under every card). The
    sheet you pull out, the detail, lifts.
  - **Imagery:** the thumbnails are the content. Tiny mounting-strip marks at two corners are the only ornament.
  - **Motion:** calm. The sheet pulls out as a drawer in 200 ms; nothing else moves.
- **Structural axes:**
  - **Navigation model:** a taxonomy tree. A left rail reads 柜 › 屉 (domain › section) with counts; search sits on
    top. Home is the collection overview: 16 cabinets with counts, recent accessions (by `added`), and the 模式标本
    picks.
  - **Catalogue container:** a **grid of sheets** by default while browsing a domain. It switches to the
    **register table** as soon as a query is typed, because finding beats browsing. A **sheet drawer** holds the
    full label and the 鉴定签 history.
  - **Thumbnails:** central, on every card, mounted at one size. This is the most thumbnail-dependent direction, so
    the placeholder sheet is a designed first-class state, not an error.
  - **Skills explained:** routing as a **检索表** (a dichotomous key: "1a 已有设计稿，需要落地 → implement-design;
    1b → 2 …"), the one place this direction adds to the mandated metro loop.
    - Real artifacts appear as specimen sheets with labels (collector = skill, date, run id).
    - The eval scoreboard is a 鉴定记录 table.
- **Home first viewport (1440):**
  - Rail on the left; the outcome sentence and install command over a row of 模式标本 sheets.
  - One artifact sheet: this site's brief, labelled and dated.
  - Search is always in the top band.
- **Home first viewport (390):** outcome sentence, install command, search, then two sheet columns (≈ 170 px each).
- **Where it will fail:**
  - The grid is slower than a table for job 1, so it needs two views (more UI, more states).
  - Any thumbnail QA miss gets framed and exhibited.
  - The natural-history metaphor can slide into nostalgic costume (next to the spent label and card catalogue).
  - "Specimen" collides with "type specimen" in English, and the metaphor is unfamiliar to international developers.
  - Portrait sheets waste width at 1920.

### C: 字架 / Composing Room

- **Thesis:** the catalogue as a type case.
  - Compartments are sized by how much they hold, and the most-used sorts sit at the centre.
  - Searching is setting a line; results come out as a galley proof.
  - Critique is proofreading with the standard marks.
- **Own-world referent:** a 印刷厂排字车间 (铅字架 with the 常用字盘 in arm's reach), 校样 marked in GB/T 14706
  校对符号. The California job case is the Latin twin.
- **The one memorable idea:** the **case**. Home is one composition of 16 compartments whose area is proportional to
  each domain's count (computed from data at build time), with sections listed inside and the S picks in the central
  常用字盘. Search matches are marked the way a proofreader underlines, and a real critique report is shown as a
  marked proof on `/skills/`.
- **Visual axes:**
  - **Type voice:** typography is the hero here.
    - CJK display: **Source Han Serif CN** (`@chinese-fonts/syst`, verified; 58 KB gzip CSS index), for headings
      and compartment labels only.
    - Body: the system 黑体 stack.
    - Latin display: **Source Serif 4** (fontsource, verified), roman only, never italic, no display-size sentence.
  - **Colour strategy:** ink on cool white paper, type-metal greys for the case, and proof-red reserved for marks
    (search matches, critique marks, errors). No cream, no terracotta, never red as decoration.
    - Dark theme: type-metal dark with bone-white ink; the red stays marks-only.
  - **Layout grammar:**
    - Home: an unequal compartment grid (a case, not a card grid).
    - Catalogue: a single-column galley with a wide left margin for line numbers and marks, and facets set as case
      labels on the left.
  - **Density:** high in the case, medium-low in the galley (a reading measure of about 40 CJK characters).
  - **Shape:** thick 3 px case dividers, the one heavy line. Nothing else is outlined or rounded.
  - **Depth:** flat; compartments read through their dividers.
  - **Imagery:** type only on home and in the galley. Thumbnails appear only in the grid view ("打样页", a proof
    sheet of the visual kinds) and in the detail.
  - **Motion:** still. The single choreographed moment is the proof marks drawing onto the critique sample on
    `/skills/` (once, off under reduced motion).
- **Structural axes:**
  - **Navigation model:** a spatial map. The case is the home navigator, a compact case minimap is the domain facet
    on the catalogue page, and the composing-stick search sits in the top band.
  - **Catalogue container:** a **galley list** (typeset entries: name, zh, en, how_to_use, badges).
    - Desktop: the detail opens in the **right margin as a non-modal drawer**, like a proof note.
    - Mobile: inline expansion.
  - **Thumbnails:** off by default and on demand (the proof-sheet grid). This makes it the least dependent on
    thumbnail QA, and the lightest page.
  - **Skills explained:** the shop's workflow mapped onto the loop: 排字 design-studio draws → 打样
    render-and-look → 校对 critique-design in a fresh subagent → 付印 implement-design / handoff.
    - A real critique report is shown as a proof page with 删除 / 对调 / 增补 marks.
    - The eval scoreboard is a 校样记录 table per version.
    - The metro loop is drawn as the job ticket's route through the shop.
- **Home first viewport (1440):** outcome sentence and install command set as the first line of the case's lid, then
  the case filling the viewport. One real proof (the critique sample) sits in the corner compartment.
- **Home first viewport (390):** the case collapses to a ranked list of domains, each with a bar proportional to its
  count and a row of section links. It must not become a squashed treemap.
- **Where it will fail:**
  - It sits closest to the cream + serif tell, so it depends on cool paper, grey metal and marks-only red to stay
    clear of it.
  - The CJK webfont is the biggest line in the 150 KB budget (the index CSS alone is about 58 KB gzip, plus
    slices).
  - The galley scans slower than a table.
  - Most readers under 40 have never seen a composing room, so the metaphor must work without being understood.
  - Proof-red can read as "error" everywhere if it leaks.
  - Area ∝ count makes small domains (a11y, dataviz while they are new) tiny.

## 5. Thumbnail test (planned, checked on the board)

At 600 px, the structural silhouettes differ: B = a multi-column index plus banded table, A = a uniform portrait-card
grid with a left rail, C = unequal compartments plus a single-column galley. If any two read alike once rendered, one
of them is re-drawn before the board is shown.

## 6. Next

The options board (`site-design/board/index.html`) shows the same real data slice in A / B / C: the home first
viewport, a catalogue query (`配色`) with the detail open, and the skills routing. It uses the same fidelity at 1440
and 390, light and dark, with scoped tokens per direction. It ends with the comparison table plus the canon
column → recommendation (lead B unless the board shows otherwise) → the user's pick → `decisions.md`.
