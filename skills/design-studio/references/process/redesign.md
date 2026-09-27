---
title: Redesign from the function map
evidence: digest
sources: [ooux-orca, change-aversion, taste-skill, impeccable]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Redesign

The `redesign` mode ([SKILL.md](../../SKILL.md) decides when a request is one). Owns: the order of
work, the function map (OOUX / ORCA), structural directions in a redesign, the detail baseline, the
equity audit, the change-cost counter-rule and the migration plan.

The current UI is the strongest anchor in the room: studied first, it becomes the answer. It is
evidence of what users have learned, not authority over what the product should be. Brand, platform
and the host's system of record stay constraints; page structure, navigation, task containers and
data presentation are what is being questioned.

Contents: 1 Order · 2 Function map · 3 Structural directions · 4 Look at the current product ·
5 Detail baseline · 6 Equity audit · 7 Change cost · 8 Migration plan · 9 Traps

## 1. Order

The SKILL.md loop, re-ordered so the current screens come after the directions are fixed (loop
steps in brackets):

1. Inspect code and assets, not screens ([truth-files](truth-files.md)) [1].
2. Build the function map from sources (section 2); write PRODUCT.md [2].
3. Answer each top job from first principles (section 2, step 7).
4. Research references ([research](research.md)) [3].
5. Rut, referents, roll, coordinates, theses; no drawing yet ([directions](directions.md)
   sections 1-5) [4a].
6. Only now capture the current product (section 4); run critique-design in mode `redesign-brief`
   for the Baseline (section 5); audit equity (section 6).
7. Spawn one subagent per direction with the Baseline in its packet, plus the canon; board,
   recommend ([directions](directions.md) sections 6-9) [4b].
8. Converge [5]; write the migration plan for the chosen direction (section 8).
9. Loop steps 6-12 as in SKILL.md: system, draw, render + floor, fresh critique, elevate, handoff,
   retro.

## 2. Function map

Fill [function-map.md](../../templates/function-map.md). Sources, most trusted first: data models and
API schema; routes and permissions; analytics and logs (frequency); help docs and support tickets;
the user's words. Not screenshots.

When front-end markup is the only artefact (static HTML, templates), harvest its text without
rendering it: navigation labels, table headers, form labels, status values, button verbs (for
example `rg -o '<th[^>]*>[^<]+' legacy/`). That is noun and attribute evidence, not a screen. Mark
every frequency "assumed" and ask for the one that matters most within the question budget
([truth-files](truth-files.md) section 7). Render the pages only at section 4.

1. **Forage nouns.** Highlight the nouns in those sources. Nouns that recur are candidate objects.
   Drop abstract nouns that name a hoped-for outcome ("efficiency", "visibility").
2. **Test each object.** An object has its own instances and attributes and the user acts on it (a
   Bid, a Supplier). A noun without attributes of its own is an attribute of another object (status,
   deadline).
3. **Relationships.** Record the cardinality and where the user crosses it ("from a Bid to its
   Supplier's history"). Note which objects appear nested inside another's list or detail.
4. **Actions (CTAs).** Per object and role: the verb, how often, where it starts, and what must stay
   visible while doing it. Frequency drives every later decision.
5. **Attributes.** Mark which are scanned in lists, filtered or sorted, or only needed in the detail.
   Rank them in a single column first; priority before layout.
6. **Top jobs as flows.** Count today's steps, decisions, waits and context switches from the routes
   and API, not from memory.
7. **First-principles answers.** Per top job, as if no screen existed: entry point, container,
   presentation, flow shape.

Signs in the map that the current structure is wrong:

- a daily action sits two or more levels deep, or behind a menu;
- a 1 : n relationship is crossed by leaving the page, losing the context the user needs;
- navigation mirrors the org chart or the database tables instead of the user's objects;
- one object the user thinks of as a whole is split across menus, or two are merged into one screen;
- a list omits the attributes users scan, so they open every item;
- a modal holds a task that needs the context behind it; a wizard serves experts who do it 30 times a day.

## 3. Structural directions

Axes, roll and board mechanics live in [directions](directions.md). A redesign adds:

- At least two directions re-architect: each differs from the current UI on two or more structural
  axes (navigation, container, presentation, flow). One may be a completely different page organisation.
- Refining the current structure is not a direction; it is the detail baseline every direction
  inherits (section 5). An evolution direction is optional, and at most one.
- The canon card is the current structure with the detail baseline applied: the honest "keep the
  structure" option, drawn at the same fidelity, never recommended by default.
- Each structural move names the job it makes cheaper and by how much, in the function map's units
  (steps, context switches, what stays visible).

## 4. Look at the current product

After the directions' coordinates are fixed, capture every route of the current product at the
target sizes: `node "$S/capture.mjs"` with a route manifest and saved login (flags per `--help`;
traps in [render-and-look](render-and-look.md)). Use the captures for three things only:

1. the detail baseline (section 5);
2. the equity audit (section 6);
3. the migration plan (section 8).

Do not move a direction's coordinates toward the current layout. The one exception: the equity audit
finds a relied-on asset that a direction breaks; then keep the asset in that direction or record its
cost on the card.

## 5. Detail baseline

Run [critique-design](../../../critique-design/SKILL.md) in mode `redesign-brief` on the current
screens: contrast, states, alignment, copy, accessibility, overflow. Its detail fixes become one
list, written in function-map.md > Baseline:

- every direction, the canon included, is drawn with them applied (the list goes in each direction
  packet);
- the board states the list once ("Baseline applied to every direction: ...");
- decisions.md gets one row pointing to it. It is never offered as a direction of its own.

Its structural findings are evidence for the function map's signs (section 2) and the equity audit;
they never move a direction's coordinates (section 4).

## 6. Equity audit

Equity is what users rely on, with evidence. It is not the current layout. Write it in the function
map's Equity table; items that must never change silently also go to PRODUCT.md > Equity.

| Kind | Examples | Evidence |
| --- | --- | --- |
| Addresses | URLs and slugs, deep links, bookmarks, query parameters in shared links, anchor ids | analytics, logs, links in docs, email and chat |
| Names | navigation labels, object, field and status names | support tickets, training material, reports that quote them |
| Muscle memory | keyboard shortcuts, learned locations of daily actions, tab order in data entry | usage frequency, power users' words |
| Outputs | exports, print layouts, report formats, analytics event names, notification wording that other systems parse | integrations, downstream consumers, analysts |
| Trust marks | wordmark, legal and consent copy, colour in regulated places | legal, brand owner |
| What they scan | the columns of the main lists and their order | the user's words, sort and filter usage |
| Search presence (public sites) | titles, slugs, headings of ranking pages | search console, SEO baseline |

Cost if it moves = affected users x frequency x whether a workaround exists; rate it low, medium or
high with the reason. Where the sidebar sits or how cards look is not equity unless evidence shows
users rely on it.

## 7. Change cost (daily-use tools)

Structural divergence is the default; this rule prices it. It applies when the primary role uses the
product daily (PRODUCT.md > Who uses it): consoles, admin systems, internal tools, IDEs, point of sale.

- **Never change silently**: URLs (redirect every old one), navigation labels, object and field
  names and order, keyboard shortcuts, the wordmark, legal copy. A change to any of them is a row in
  decisions.md with its migration.
- **Every structural change pays for itself**: beside its job gain (section 3) it lists the equity
  rows it spends. A change whose only gain is visual does not justify relearning: keep that
  structure and apply the baseline.
- **Price relearning on the board**: in the comparison table, the migration row counts the moved
  items and their frequency for the daily role.
- **Expect change aversion**: a familiar tool replaced by an unfamiliar one draws complaints even
  when the new one is better, and the discomfort ends as users acclimate. Judge a structural change
  on task measures after an adaptation period, not on day-one sentiment. A complaint that persists,
  or that task data backs, is a finding, not aversion: Figma reattached UI3's floating panels during
  its open beta after feedback.
- **Recommend on evidence**: the board still shows re-architected directions, but for a daily tool
  recommend a structural change only where section 2's signs show the structure blocks a job, and
  phase it (section 8). Boredom with the current look is not such a sign.

## 8. Migration plan

Write it after converge as `## Migration` at the end of function-map.md, and carry it into the
handoff spec ([handoff](handoff.md)).

| Change | Who (role, frequency) | Old > new | Mitigation | Phase | Signal to proceed |
| --- | --- | --- | --- | --- | --- |
| Supplier history moves from a menu page to a panel in the Bid view | officers, 40 a day | menu page > side panel | "what moved" tip; the old URL redirects to the panel | 1 | task time on "check a supplier" no worse after one bid cycle |

Mitigations, following Google Drive's launch (Sedley and Müller, CHI 2013): plan the stages; assess
the impact before launch; tell users in advance; explain the benefit; give transition guidance in
the product (a "what moved" map, old labels still found by search); let users switch between old and
new for a period; monitor; take feedback in the product; fix issues fast; tell users what improved.

Default phases for a daily tool:

1. Opt-in preview with a way back and a feedback channel.
2. On by default, the way back still available; announce when the old UI goes.
3. Old UI removed; redirects and label aliases stay.

Each phase lasts at least one full work cycle of the heaviest user (a month-end close, a bid
season), taken from PRODUCT.md, not a fixed number of days. Signals: task time and errors on the top
jobs, switch-back rate and reasons, support tickets about moved items. A low-frequency or public
site may need only redirects and a release note.

## 9. Traps

- Opening the current screens "just to understand the product" before the map exists.
- Every direction keeps the current page structure; decisions.md opens with "structure unchanged,
  lowest risk". Both happened in the first host rounds (2026-09) and led to 0.7.0.
- Treating the current layout as equity, or treating equity as a veto on all structure.
- Re-architecting a daily tool without pricing relearning, or migrating silently: renamed fields,
  dropped shortcuts, dead URLs.
