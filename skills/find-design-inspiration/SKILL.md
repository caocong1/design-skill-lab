---
name: find-design-inspiration
description: Research design references the way a senior designer does - choose the right galleries, pattern libraries and archives from the curated catalogue, browse them, deconstruct what makes each reference work, and turn that into applicable moves. Use for inspiration requests, ideas to improve an existing website or app, competitor teardowns, extracting a reference site's style DNA into tokens, moodboards, and trend scans. 找灵感、参考案例、竞品分析、风格提取、这个网站怎么改更好看。
metadata:
  version: 0.1.2
  short-description: Find, deconstruct and apply references
---

# Find Design Inspiration

References are evidence about what works, not templates. The output of this
skill is never a list of links; it is a set of **moves** the user can apply,
each traced to where it was seen.

## Modes

- `explore`: references for something not yet designed.
- `improve`: ideas for an existing site, app or brand (audit first, then map
  references to specific weaknesses).
- `teardown`: compare 3-5 competitors or peers; find table stakes and
  whitespace.
- `style-dna`: extract a reference's visual system into tokens and rules.
- `trend-scan`: what is current, dated and treated as perishable.

## 1. Frame the Question

Pin down the **granularity** before searching; it decides the source:

| Looking for | Source kind |
| --- | --- |
| Overall vibe / art direction of a site | curated site galleries, award sites |
| A section: hero, nav, pricing, footer, CTA | section galleries |
| A component and its states | component galleries, design-system docs |
| A flow: onboarding, checkout, paywall, settings | real-product screen and flow libraries |
| A micro-interaction or transition | motion recordings |
| A logo, identity, guideline structure | logo archives, identity publications, guideline collections |
| A poster, deck, cover, social graphic | graphic archives, deck galleries |
| A typeface or pairing in context | fonts-in-use archives |
| A palette with a mood | palette tools, fine-art and traditional colour references |

Also fix industry, audience, platform and tone from the brief. "Fintech
pricing section, trustworthy, light" is searchable; "cool website" is not.

## 2. Pick Sources

Open `../design-studio/references/resource-map.md`, then only the catalogue
file(s) for the domain. Choose two to four sources of **different kinds**:

1. one curated gallery for taste,
2. one real-product library for what actually ships,
3. one best-in-class peer or adjacent-industry product,
4. one out-of-category source (editorial, print, architecture, game UI,
   packaging) for freshness.

Prefer tier `S`, fall back to `A`. Honour the catalogue's `Access` column.

## 3. Browse

- `static` sources: fetch the deep link given in the catalogue and read.
- `js` sources: use a real browser tool, scroll, and take screenshots.
- `blocked` or `login` sources: do not work around protection. Give the user
  the exact link and what to look for, or pick another source.
- Look at the **reference itself**, not just the gallery thumbnail: open the
  live site, resize it, hover things, watch it load.
- Be a polite guest: a handful of pages, no bulk scraping, no hot-linking or
  redistributing others' images. Keep links and your own notes; screenshots
  are for private analysis, not for shipping inside deliverables.

If no browsing tool is available, say so, reason from well-known references
you can name precisely, and mark the result as unverified.

## 4. Deconstruct

Use the same lens for every reference so they can be compared:

```markdown
### <Name> - <URL> (seen <date>)
- **The one idea**: what makes it memorable in a sentence.
- **Layout grammar**: grid, alignment, section rhythm, density.
- **Type**: families (identify them), scale contrast, weights, measure.
- **Colour**: strategy, roles, where the accent is spent.
- **Shape & depth**: radii, borders, shadows, materials.
- **Imagery**: product UI / photo / illustration / 3D / none; treatment.
- **Motion & interaction**: what moves, when, how fast; hover and focus craft.
- **Content strategy**: headline formula, proof, tone of voice.
- **Would not transfer**: what depends on their brand, budget or content.
```

Identify rather than guess: read `font-family` and colours from computed
styles when a browser tool is available.

## 5. Synthesise

- **Table stakes**: what every strong reference shares. Do these or look
  amateur.
- **Design space**: where they diverge. These are the real choices.
- **Whitespace**: what nobody in the category does. This is the opportunity.
- **Moves**: three to seven principles phrased abstractly, each with its
  source and how it applies here. "Spend the accent colour only on the primary
  action (seen at X, Y) -> your dashboard uses blue for links, tags and
  buttons; reserve it for the primary button."

For `improve`, start with a quick pass of `../critique-design/SKILL.md` on the
existing site, then attach references to specific findings, section by
section, ordered by impact over effort.

For `teardown`, add a comparison table (rows = patterns or criteria, columns =
competitors) and a positioning map on the two axes that matter most.

## Style DNA

Extracting a reference's system is legitimate study; cloning it is not.

1. With a browser tool, read computed styles from representative elements:
   font families / sizes / weights / line-heights, the colour set, spacing
   rhythm, radii, borders, shadows, transitions, breakpoints.
2. Normalise into tokens and rules using
   `../build-design-system/SKILL.md` (an "inspired-by" `DESIGN.md`).
3. Write a **divergence plan**: change at least the typeface or the palette or
   the layout grammar, and everything that is brand-specific. Never reuse
   their logo, illustrations, photography, copy, or a distinctive signature
   element.
4. If the named typeface is commercial, propose an open-licence alternative
   and say what is lost.

## Trend Scan

Trends are perishable. Date every observation, cite the feed or gallery where
it was seen, and separate **fashion** (a look that will date the work) from
**shift** (a change in tools, platforms or user expectations). Recommend
trends only where they serve the brief; note the expected shelf life.

## Bias Warnings

- Galleries over-represent agency, portfolio and SaaS-marketing aesthetics
  made for other designers. Real users of a hospital system or a tax form are
  not that audience. Balance with real-product libraries.
- Award sites reward spectacle; conversion and usability are not judged.
- Concept shots on community sites often ignore real content, states and
  accessibility.
- If every reference comes from one gallery, the result will look like that
  gallery. Mix sources.

## Deliverable

`.design/inspiration/<topic>.md` (or a chat answer for small asks):
the question, sources used and why, deconstructed references with links and
dates, synthesis (table stakes / design space / whitespace), proposed moves
mapped to the user's case, and access problems encountered.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Before the final message of the round, run that file's close-out
retro and end with its `Skill feedback:` line - the retro is part of done.
Log, don't fix: skills are edited only inside the lab.
