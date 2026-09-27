# Design brief: Design Skill Lab public site (round 1)

2026-09-27 · site stream · effort `deep` (full: brief → directions → board → pick → system → build).
Sources: `audit/page.md` (verdicts, measurements, IA, acceptance), `BLUEPRINT.md` §5/§12, `docs/catalog*.js`, `docs/content.js`.
`[A]` = assumption, not yet verified.

## Design read

Reading this as a **bilingual reference desk for working designers and design engineers**: answer-first, dense
but calm, search reachable from every page, proof instead of pitch, light by default with a real dark theme.
Convention in the mechanics (search, facets, lists, keyboard); distinctiveness spent on one idea only.

## What this is

1. **A curated catalogue of design resources.** 601 rows in `catalog/resources.jsonl` today, plus up to 144 verified
   candidates in review, so about 700. The page never types this number; it reads it from data. Every row is hand-tagged:
   domain/section (16 domains), kind (23), tier S/A/B, access, login, licence, status, lang/region, a zh one-liner,
   en `best_for`, `how_to_use` (怎么直达), caveats, entry points. It also carries machine-observed `agent_access` and a
   thumbnail (`screenshot | og | github`, or none, in which case the page draws a placeholder).
2. **A 3-skill agent suite** that makes coding agents (Claude Code, Codex) work like a senior designer.
   `design-studio` is the entry skill: truth files → research → seeded divergent directions → system → screens →
   render-and-look → fresh critique → handoff. `critique-design` is a reviewer that runs in a fresh subagent.
   `implement-design` is the builder. Install: Claude Code plugin (two commands) or a symlink loop.
3. **`/lab/`**: the preserved 16-direction experiment. It is a gallery entry, not the product.

## Who (ranked)

1. **Chinese-speaking product/UI designers and design engineers (设计师 · 设计工程/前端).** They work in
   Figma / MasterGo / 即时设计 plus an IDE, and increasingly run Claude Code / Codex / Cursor. They arrive from a link
   in a WeChat group, 即刻, 小红书, GitHub or search. `[A]` They come back weekly, using the site as a lookup tool.
2. **International designers and developers.** They arrive from GitHub / HN / X, read the English UI, and
   `[A]` mostly visit once, to evaluate the suite.
3. **AI agents.** They read `llms.txt`, `catalog.json` and the static no-JS list. They never see the pixels; they judge
   the structure.

## Jobs (ranked) and what "done" means

1. **Find the right resource fast.** Golden queries: `配色` → palette tools, `动效曲线` → easing tools, `font` → type,
   `figma` → Figma MCP. From any page: `/`, type, `Enter` opens the detail, `o` opens the site. The detail shows
   how_to_use, licence, caveats and agent access.
2. **Understand and install the suite.** The first viewport of `/` and `/skills/` says what the suite does in one
   sentence and who it is for, with one copyable install command. The symlink route is one click away.
3. **Trust it (proof).** Real artifacts from real runs: brief, direction board, critique report, handoff spec, eval
   scores including losses, all dated. A proof piece that does not exist yet gets no slot; there is never a mock.
4. **Browse for inspiration.** A thumbnail grid of the visual kinds, by domain, plus the S-tier picks. It is
   secondary and must not slow down job 1.

## Content inventory (real; every count comes from data at build time)

- **Text lengths (measured on the current 601 rows).** zh one-liner: median 44 characters (≈ 44 em), max 97.
  en `best_for`: median 65 characters (≈ 33 em), max 278. `how_to_use`: median 47, max 220. Names: median 13, max 52
  (e.g. "The Elements of Typographic Style Applied to the Web"). So zh lines are wider at the median and English
  has the long tail, and a row layout must survive both.
- **Thumbnails.** About 700 WebP files at 800×500, some rows without one. The current 539 screenshots are mostly light
  pages: 83% have mean luma ≥ 128, the median is 228/255, and 13.5% are dark (< 100). They are busy, and their text is
  illegible below about 320 px. The new captures come from the same sites, so the same distribution is expected.
- **Suite.** 3 SKILL.md files, 8 modes (`full piece options inspire critique redesign handoff implement`), a 3-step
  effort ladder, the 12-step loop, and the reference tree (source for the routing map).
- **Proof on hand.** This site's own `.design` round is the first real artifact: this brief, the direction cards, the
  options board and the critique of the built site. The lab-page dogfooding case study
  (`research/field/2026-09-lab-page-dogfooding.md`) is another. `evals/runs/<date>/` is `[A]` expected before ship
  and not guaranteed.
- **Gaps.** There are no eval scores yet, no wordmark or logo, and no photography (none is needed).

## One specific referent sentence

"A reference desk, not a shop window: like asking the senior designer who keeps the team's good bookmarks. She
answers in one line, points to the exact page, says what is paywalled, login-walled or dead, and shows what she
made with it."

## Physical scene → light / dark

- **Scene A (primary).** A weekday in office daylight, on a 1440–1920 px monitor. The site is one tab beside Figma
  and an IDE, opened mid-task for a 30-second visit. Canvas tools default to light, and the thumbnails are mostly
  light pages.
- **Scene B.** An evening commute. The link is tapped inside WeChat's in-app browser on a 390 px phone, one-handed,
  on patchy 4G, `[A]` with system dark mode often on. The reader looks at the home page and one skill page, and
  installs later at the desk.
- **Scene C.** An agent fetching `llms.txt` or the static list: no pixels, only structure and text.
- **Decision.** Light is the designed default (Scene A plus the thumbnail luminance). A full dark palette is required,
  not optional (Scene B): it follows `prefers-color-scheme` and has a toggle. In dark mode the thumbnails keep their
  colours, because they are evidence; a frame stops light screenshots from glaring. Neither theme may pass contrast
  only barely.

## Constraints

- **Hosting.** GitHub Pages on a project subpath (`caocong1.github.io/design-skill-lab/`), so every URL is relative.
  Pages: `/`, `/catalog/`, `/skills/`, `/lab/`. The legacy `/?style=` redirects to `/lab/`.
- **Stack.** The Python build (`scripts/build-catalog.py`) writes the data, and the pages carry a static no-JS list.
  Vanilla JS and CSS only: no framework, no bundler, no runtime npm dependencies.
- **Weight.** The home page is ≤ 150 KB gzip before images. No page loads another page's CSS. Images load lazily and
  carry `width`/`height`.
- **Fonts.** Load from jsDelivr (`@fontsource*`, `@chinese-fonts/*`) or use system fonts only, because of reachability
  from mainland China. CJK body text uses system stacks: PingFang SC, HarmonyOS Sans SC, Microsoft YaHei,
  Noto Sans CJK SC.
  - Measured today: the `@font-face` index CSS of a sliced CJK webfont costs 31–72 KB gzip before a single glyph
    loads (Noto Sans SC 31 KB, Source Han Serif CN 58 KB, LXGW WenKai 72 KB).
  - So a CJK webfont is at most one display face, and it must justify 20–50% of the home budget.
  - Latin: at most one `@fontsource` family per page. Faces on the worn list (Inter, Geist, Space Grotesk,
    Instrument Serif) need a subject-specific reason.
- **Typography.** Every row mixes a Latin name with CJK text.
  - The CJK–Latin spaces are in the data; do not rely on CSS autospace.
  - Never letter-space CJK body text.
  - Navigation labels are short and `nowrap`, so they never break one character per line.
- **Thumbnails.**
  - Shown at 320 px wide or less, never enlarged past the source.
  - Never the landing page's only content, never a hover zoom.
  - A missing image gets a designed placeholder: name, host, domain hue and kind. Never a broken box.
- **Accessibility.**
  - WCAG 2.2 AA; axe reports 0 serious or critical issues.
  - A skip link and one `<main>`; a live region for result counts.
  - Keyboard: `/ j k Enter o Esc`. Honour reduced motion.
  - No content is hidden until scroll, and there is no horizontal overflow at 390 px.
- **Bilingual.** zh is the default. English comes from a toggle, `?lang=` or `navigator.language`. `lang` attributes
  go on every run, and the UI strings live in one table.
- **Honesty.**
  - Every number comes from data.
  - No fake KPIs, testimonials, star counts or "trusted by" strips.
  - Every proof piece carries a date, and losses are shown.

## Must avoid

- **The audit's findings.** Specifically:
  - a hero that sells counts;
  - zero resources on the home view;
  - a direction card and style switcher filling the first screen;
  - hand-typed counts that go stale ("十种");
  - wall or blank thumbnails, above all enlarged ones;
  - 2.7 MB font payloads;
  - scroll-reveal that hides content;
  - switchers with hidden scrollbars;
  - a fake KPI ("截图覆盖 90%");
  - CJK nav wrapping one character per line;
  - a duplicate `<main>`;
  - a page that is blank without JS.
- **The category rut** (named in `directions-plan.md`). A screenshot-card masonry under a centred hero search with
  pill filters. For the suite: the SaaS landing with a centred gradient hero, a glowing terminal snippet, three
  icon feature cards, a logo wall or star badge, an FAQ accordion and "Supercharge your agent".
- **2025–26 model defaults.**
  - Warm cream + high-contrast serif + terracotta; near-black + one acid accent.
  - The dev-tool look: dark + green + mono everywhere.
  - "Broadsheet" hairlines + zero radius worn as a costume.
  - Template chrome: tracked-caps eyebrows, 01/02/03 section numbers, mono micro-labels, an arrow on every link,
    middle-dot meta strings.
  - Gradient blobs, mesh gradients, glass, sparkle or violet "AI" cues, hover-zoom thumbnails.
- **A 17th costume of `/lab/`.** The lab's 16 referents are spent for this round.

## Success looks like (observable)

- The golden queries rank correctly, and `/` → result → open takes ≤ 3 keypresses.
- At both 1440 and 390 px, the home page's first viewport shows the outcome sentence, a search field, the install
  command and at least one real artifact.
- Every row has a validated image or a designed placeholder. No wall or blank thumbnail is visible anywhere.
- Thumbnail test: at 600 px, the three direction boards differ in structure, not only in colour.

## Deliverables (this round)

`brief.md` (this file) and `directions-plan.md` (rut, referents, seeded roll, three direction cards). Next come the
options board (same content in every direction; slices of home, catalogue and skills), the pick, `decisions.md`, the
system and the build.
