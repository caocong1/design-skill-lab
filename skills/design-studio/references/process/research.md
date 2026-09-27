---
title: Reference research that sees
evidence: practice
sources: []
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Reference research

Loop step 3 and the `inspire` mode. Owns: framing a reference question, harvesting from the
catalogue, capturing and looking, deconstruction, synthesis into moves, competitor teardowns, style
DNA, trend scans, and what to do without a browser. Output: `.design/inspiration/<topic>/`.

The result is never a list of links. It is a set of moves the user can apply, each traced to a
reference that was looked at. Reading a gallery's HTML is not looking: it yields names, not evidence.

Contents: 1 Frame · 2 Harvest · 3 Capture · 4 Look at the sheet · 5 Deconstruct · 6 Synthesise ·
7 Request shapes · 8 No browser · 9 Bias · 10 Conduct · 11 Deliverable

## 1. Frame the question

Fix the granularity first; it decides the source. Also fix industry, audience, platform and tone from
the brief: "fintech pricing section, trustworthy, light" is searchable; "cool website" is not.

| Looking for | Source kind | Catalogue section |
| --- | --- | --- |
| Overall art direction of a site | curated site galleries, award sites | `web:site-galleries`, `web:awards` |
| A section: hero, nav, pricing, footer | section galleries | `web:section-galleries` |
| A component and its states | component galleries, design-system docs | `app-ui:components`, `app-ui:design-systems` |
| A flow: onboarding, checkout, settings | real-product screen and flow libraries | `app-ui:screens-flows` |
| A dashboard or data wall | dashboard exemplars, data journalism | `dataviz:dashboards-bigscreen`, `dataviz:exemplars-journalism` |
| A micro-interaction or transition | motion recordings | `motion:recordings`, `motion:showcases` |
| A logo, identity, guideline structure | logo archives, identity reviews, guideline collections | `brand:logo-archives`, `brand:identity-publications`, `brand:guidelines-collections` |
| A poster, deck, cover, social graphic | graphic archives, deck galleries | `graphic:posters-type`, `graphic:decks`, `graphic:covers-packaging` |
| A typeface or pairing in context | fonts-in-use archives | `type:in-use` |
| A palette with a mood | palette tools, traditional colour references | `color:palettes` |

Section ids change rarely; if one is unknown, `catalog.py route` finds the current one.

## 2. Harvest

Choose two to four sources of different kinds:

1. one curated gallery, for taste;
2. one real-product library, for what actually ships;
3. one best-in-class peer or adjacent-industry product;
4. one out-of-category source (editorial, print, architecture, signage, game UI, packaging), for freshness.

```sh
S="<directory of the design-studio SKILL.md>/scripts"
python3 "$S/catalog.py" route "<the framed question>"                  # best sections + top rows
python3 "$S/catalog.py" find <keywords> --section <domain:section> --reach static,js --limit 8
python3 "$S/catalog.py" show <id>                                       # entry points, how to use, caveats
```

- Prefer rows an agent can reach (`static`, `js`); prefer tier S, then A. A `blocked` or login row:
  give the user the link and what to look for, and pick another source. Never work around a wall.
- Use `show` for entry points: validated deep links and mirrors beat the home page.
- From galleries, collect the reference sites' own URLs; the gallery page is only a pointer.
  Harvest 6-12 candidates from at least two sources, so no single gallery's house style dominates.
- If the host has a reference MCP server (real shipped screens or extracted styles), query it too;
  the images it returns count as looked at.

## 3. Capture

Capture every candidate before judging any of it. Run `node "$S/capture.mjs" --help` first; then
capture the candidates at 1280 x 800 and 390 x 844, first viewport and full page, with `--sheet` to
get a contact sheet. Save into `.design/inspiration/<topic>/captures/`.

- A non-zero exit or a flagged capture (bot wall, login redirect, blank, error page), or a consent
  overlay still in the image (`--consent auto` removes most), is not a reference: replace the
  candidate, do not deconstruct it.
- For an app flow, capture the same journey in every product (entry > first task > result).
- No Playwright: `bash "$S/shot.sh"` per URL, then view the files side by side. It skips sizes under
  500 px on sites that refuse framing (exit 3) and detects no walls: check every image. Capture
  traps and the tool ladder: [render-and-look](render-and-look.md).

## 4. Look at the contact sheet first

Open the sheet image and look before reading any code or text:

1. **Squint.** Which three stand out, and why, in one phrase each. Which look alike: that cluster is
   either the category's table stakes or one gallery's house style.
2. **Discard** walls, loading states, covered pages and near-duplicates. Keep 3-6 to deconstruct:
   the ones that differ most from each other, plus the strongest real-product reference.
3. **Compare 1280 with 390** for each keeper: what reorganises and what merely stacks.
4. **Write first impressions now**, before inspecting anything. They are what a user sees; the
   deconstruction explains them, it does not replace them.

Then open each keeper's captures at full size.

## 5. Deconstruct

Use one lens for every reference so they can be compared:

```markdown
### <Name> - <URL> (seen <date>, <sizes>)
- The one idea: what makes it memorable, in one sentence.
- Layout grammar: grid, alignment, section rhythm, density.
- Type: families (identified), scale contrast, weights, measure.
- Colour: strategy, roles, where the accent is spent.
- Shape and depth: radii, borders, shadows, materials.
- Imagery: product UI / photo / illustration / 3D / none; treatment.
- Motion and interaction: what moves, when, how fast; hover and focus craft.
- Content: headline formula, proof, voice.
- Would not transfer: what depends on their brand, budget, content or audience.
```

Identify rather than guess: with a browser tool, read `font-family`, colours, radii and spacing from
computed styles of representative elements.

## 6. Synthesise

- **Table stakes**: what every strong reference shares. Do these or look amateur.
- **Design space**: where they diverge. These are the real choices.
- **Whitespace**: what nobody in the category does. This is the opportunity.
- **Moves**: three to seven principles, each with its sources and how it applies here.
  "Spend the accent only on the primary action (seen at X, Y) > your dashboard uses blue for links,
  tags and buttons; reserve it for the primary button."

Moves feed the directions: each direction card lists the references it takes from, what it takes
and what it does not ([directions](directions.md)).

## 7. Request shapes

- **Explore** (nothing designed yet): sections 1-6.
- **Improve** an existing site or app: run [critique-design](../../../critique-design/SKILL.md) in
  mode `review` first, then attach references to specific findings, section by section, ordered by
  impact over effort. Whole-product change is `redesign`, whose baseline comes from mode
  `redesign-brief` ([redesign](redesign.md) section 5).
- **Competitor teardown**: 3-5 products, the same journey at the same sizes. Add a comparison table
  (rows = patterns or criteria, columns = products) and a positioning map on the two axes that
  matter most. Capture logged-in areas only with the user's own account and saved login state;
  never ask for shared credentials.
- **Style DNA** (study a reference's system; cloning it is not allowed):
  1. read computed styles: families, sizes, weights, line heights, colour set, spacing rhythm, radii,
     borders, shadows, transitions, breakpoints;
  2. normalise into an "inspired-by" DESIGN.md and tokens ([system](system.md));
  3. write a divergence plan: change at least the typeface, the palette or the layout grammar, plus
     everything brand-specific; never reuse their logo, illustration, photography, copy or a
     signature element;
  4. for a commercial typeface, propose an open-licence alternative and say what is lost
     ([licensing](../fundamentals/licensing.md)).
- **Trend scan**: date every observation and cite where it was seen. Separate **fashion** (a look
  that will date the work) from **shift** (a change in tools, platforms or expectations, such as a
  new OS material or a new web primitive). Check each fashion against the dated tells in
  [anti-slop](../fundamentals/anti-slop.md) before recommending it; give each an expected shelf life.

## 8. No browser

When neither `capture.mjs`, `shot.sh` nor a browser tool works:

- Say so in the notes and in the reply: "references not seen; confidence lower".
- Ask the user for screenshots or for links they have looked at. A user's screenshot is a seen reference.
- Download what can be viewed without a browser (a page's `og:image`, a gallery's thumbnail image)
  and open it as an image. A thumbnail seen beats a description read.
- Name references precisely (product, screen, year), mark each "from memory, not seen", and weight
  structural moves over visual ones. Never present the model's priors as research.

## 9. Bias warnings

- Galleries over-represent agency, portfolio and SaaS-marketing work made for other designers. A
  hospital system's or a tax form's users are not that audience; balance with real-product libraries.
- Award sites reward spectacle; conversion and usability are not judged.
- Concept shots on community sites ignore real content, states and accessibility.
- References from one gallery produce a design that looks like that gallery. Mix sources.

## 10. Conduct

- Be a polite guest: a handful of pages per site, one request at a time per host, no bulk scraping.
- Captures are private analysis. Never ship them in a deliverable or hot-link them; in a public host
  repository, keep `inspiration/*/captures/` out of git.
- Reference, never clone: take principles, not pixels ([SKILL.md](../../SKILL.md) core rules).

## 11. Deliverable

`.design/inspiration/<topic>/notes.md` beside `captures/` and the contact sheet, or a chat answer
for a small ask. The notes hold: the framed question; sources used, with catalogue ids and why; first
impressions from the sheet; deconstructions with links, dates and sizes; synthesis (table stakes,
design space, whitespace); moves mapped to this product; access problems; confidence (seen, or from
memory).
