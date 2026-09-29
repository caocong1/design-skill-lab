---
title: Directions, options board and convergence
evidence: digest
sources: [impeccable, anthropic-design-skills, design-md-spec]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Directions

Loop steps 4-5 and the `options` modifier. Owns: the divergence engine (rut, referents, seeded roll),
the direction axes, direction subagents, the options board, direction cards, the thumbnail test,
the recommendation, converge, re-roll and runners-up as themes.
Inputs: brief.md, PRODUCT.md, draft surface contracts, research notes.
Outputs: `.design/directions/<round>/` (referents.txt, content.md, one folder per direction,
index.html) and a row in decisions.md.

A model's first ideas are its most probable ones, and telling it to avoid defaults moves it to a
different fixed default rather than producing variety (anthropic-design-skills). Variety has to come
from procedure: name the rut, list referents from the audience's world, let a seed choose, draw
each direction in isolation, and test that the results really differ.

Contents: 1 Rut · 2 Referents · 3 Roll · 4 Cards on the board · 5 Axes · 6 One subagent per
direction · 7 Board · 8 Thumbnail test · 9 Recommend · 10 Converge · 11 Runners-up as themes ·
12 By effort

## 1. Name the rut

Write three comment lines at the top of `.design/directions/<round>/referents.txt`:

```text
# rut: <the page this category always ships>
# opposite (also the rut): <the predictable "different" answer>
# first idea (spent): <the first look that came to mind for this subject>
```

- The rut is specific: "SaaS analytics: dark sidebar, row of KPI cards, line chart, table".
- The opposite is what a model produces when told to be different: "raw mono brutalism, hard shadows".
- The first idea is spent: warm, bookish or child-facing subjects come out as cream, italic serif
  and lamplight; ops tools come out navy with a cyan glow. Name yours so no direction uses it.
- None of the three becomes a direction. The rut is played straight once, as the canon card (section 4).

## 2. List seven referents

Seven lines below the comments, in the order they come to mind, one per line:

```text
<referent> | <material family> | <quality to take>
```

- From the audience's world: artefacts, systems, rituals, places, instruments, publications. Not
  design galleries, not competitors.
- Span at least three material families; more than three lines in one family means dig further.
  Families: print and publishing, signage and wayfinding, instruments and controls, textiles and
  fashion, architecture and interiors, packaging and retail, transport, craft and tools, nature and
  science, games and toys, ritual and ceremony, software.
- A brief's literal metaphor gets at most one line.
- A referent the user gave is pinned: it takes a board slot without the roll; lower `--pick` by one.

Example for a freight dispatch console (Operate):

```text
# rut: dark sidebar, KPI card row, map with pins, dense table
# opposite (also the rut): rounded pastel cards with illustrations
# first idea (spent): navy + cyan glow "control room"
Railway departure board | signage | one line per job, status by position
Air-traffic flight strips | instruments | one strip per job, moved between bays
Shipping manifest | print | ruled columns, numbered lines, stamps for exceptions
Harbour tide table | print | time as the spine, tabular numerals
Warehouse floor markings | signage | few fixed colour zones painted on the ground
Split-flap clock | instruments | change shown as motion, only where it changed
Dispatcher's magnet whiteboard | craft and tools | drag a magnet between columns
```

## 3. Roll

```sh
S="<directory of the design-studio SKILL.md>/scripts"   # from the host project root
python3 "$S/seed.py" --brief .design/brief.md --round 1 --pick 3 .design/directions/1/referents.txt
```

- The roll hashes the brief text, the round and `--seed` (default 0), so it is reproducible. It
  prints the board (A = lead, then B, C) and ends with a JSON line.
- The lead never comes from the first two lines (`--skip 2`): first ideas are the most probable ones.
- Roll once per round; the first output stands. Copy its "decisions.md Seed column" line into
  decisions.md and the board header.
- `--seed N` is the user's lever for a different roll of the same brief. Never re-roll because you
  prefer another result: taste is not grounds for a re-roll.
- The script warns when there are fewer than seven referents or fewer than three families; fix the
  list rather than ignore it.

## 4. Cards on the board

| Card | Origin (card field) | Count | Recommended? |
| --- | --- | --- | --- |
| Lead | seeded roll, lead | 1, frame A | the default recommendation (section 9) |
| Rolled | seeded roll | 2 | only with a brief-based reason |
| Our pick | agent pick | 0-1 | only with a brief-based reason |
| Canon | canon exit | 1, last frame | never, except in a redesign (section 9); the user may still choose it |

- **Our pick**: the referent you would choose, with one sentence on why it serves the brief. Your
  taste gets one card, not the board. Skip it when the roll already drew it.
- **Canon**: the category's standard page, the rut line, played straight: same content, same
  fidelity, drawn in good faith, never a strawman. It lets the user choose familiarity on purpose.
  In a redesign the canon is the current structure with the detail baseline ([redesign](redesign.md)).
- By default the board holds four or five frames. Every direction must be one you would ship.
- **A count the user names is the number of directions.** Roll `--pick N` (minus pinned
  referents) and drop Our pick. Drop the canon too, except in a redesign: there the canon is an extra
  frame labelled "Canon (current structure + baseline)" that does not count toward N.

## 5. Axes

A direction is a coherent position on every axis, with an evocative name and a one-sentence thesis
that later decisions are tested against ("would *Departure Board* use a drop shadow here?"). Derive
the coordinates from the referent's qualities: a departure board gives one line per item, status
by position, tabular numerals, no cards.

| Axis | Poles |
| --- | --- |
| Navigation model | sidebar tree / top tabs / bottom tabs / workspace home / search- or command-first / hub and spoke |
| Task container | full page / list + detail split / drawer / modal / inline / command palette |
| Data presentation | table / list / cards / board / timeline / tree / map / canvas |
| Flow shape | wizard / single form / inline edit / conversational / batch |
| Type voice | neutral grotesque / humanist sans / serif or editorial / mono or technical / expressive display |
| Colour strategy | restrained (neutrals + one accent) / committed (one colour on 30-60% of the surface) / full palette (3-4 named roles) / drenched |
| Layout grammar | strict grid / editorial asymmetry / modules / full-bleed / single column |
| Density | airy gallery ... compact cockpit |
| Shape and depth | sharp / soft / pill / organic; flat / hairline / layered / material |
| Imagery | product UI / photography / illustration / 3D / type only / data as image |
| Motion personality | still / calm / snappy / playful / cinematic |

- Product UI: directions differ on at least two of the first four (structural) axes. Visual axes
  alone give the same product in different clothes.
- Brand, graphics and marketing: replace the structural axes with the medium's own, such as
  composition, mark construction, story order and page archetype.
- Fill one table of coordinates for all directions before anything is drawn. If two rows match on
  the axes that matter for this brief, move one.
- A host design system constrains tokens; directions then differ on structure and composition.

## 6. One subagent per direction

Draw each direction in its own isolated subagent, so the directions do not share one context's taste.
The subagent receives only this packet:

```text
Direction <A>: "<name>". Thesis: <one sentence>.
Referent: <the line from referents.txt>
Axis coordinates: <the direction's row>
References: <2-4, each with what to take and what not to take>
Brief: .design/brief.md and .design/PRODUCT.md. Content: .design/directions/<round>/content.md.
Spent, do not use: <the three # lines of referents.txt: rut, opposite, first idea>.
Rules, read before drawing: <skill>/references/fundamentals/portable-mockups.md,
<skill>/references/platforms/<target>.md, <skill>/assets/mockup-kit/kit.css for platform chrome;
the floor: <skill>/../critique-design/references/rubric.md section 1.
Redesign only: apply in every frame the Baseline in .design/function-map.md; top jobs and
first-principles answers are in the same file.
Frames: <target sizes>, as .screen elements with data-w and data-h (templates/options-board.html);
light and dark if the brief needs both.
Output: .design/directions/<round>/<a>/frame.html, a page that renders on its own with every rule
scoped under [data-direction="a"] and its own tokens; card.md from templates/direction-card.md.
Render and lint at the frame sizes (<skill>/scripts; <skill>/references/process/render-and-look.md
section 5) and look before returning.
Do not: read other directions, reuse template placeholder values, invent or add content.
```

- Never pass another direction's work, your reasoning, or an opinion about which should win.
  Isolation hides other directions and your reasoning, never the rules or the spent list. Give
  absolute paths (`<skill>` is the design-studio folder), including to the templates.
- Write content.md once, before any subagent starts: real or plausible copy and data that exercise
  the primary task. Product: the key screen, one form or table, one state, with every status the
  view distinguishes mixed in its data ([product-ui](../disciplines/product-ui.md), state matrix).
  Marketing: the first viewport, one section, the call to action. Brand: the mark, palette, type
  and one application.
- A UI generator (for example Stitch) may draw from the same packet; its output meets the same
  board rules. Image comps may stand in for visual-only directions when the host has an image model
  ([image-generation](image-generation.md)); structural directions need HTML frames.
- **No subagents**: write every thesis and coordinate row first and freeze them; draw each direction
  from its own packet in one pass without reopening earlier frames; apply the thumbnail test with
  extra suspicion; write "single-context run" in the board footer and in decisions.md.

## 7. Board

Assemble `.design/directions/<round>/index.html` from [options-board.html](../../templates/options-board.html).

- Paste each direction's scoped styles and markup into its own `<article>`, replacing the
  template's placeholder frames and tokens. Same content, same jobs, same fidelity, same frame
  sizes; the DOM may differ, because structure is an axis.
- A one-DOM live token switcher only when every variant shares one structure: palette or density
  variants of a chosen direction, never the first board.
- Each card: thesis; referent and family; structure; visual (background and accent values, typefaces,
  radius, density); good at; where it will fail; origin with the seed key. Full cards from
  [direction-card](../../templates/direction-card.md) sit in each direction's folder.
- "Where it will fail" is required: who it slows down, which content breaks it, what it costs to
  build or migrate. A direction with no failure is a strawman or unexamined.
- Fill the comparison table; its first row is the cost of the primary task (steps, context switches,
  what stays visible while acting).
- Render at 1440 and 390 and look before showing ([render-and-look](render-and-look.md)). If two
  directions would be described with the same adjectives, they are one direction
  ([anti-slop](../fundamentals/anti-slop.md)).

## 8. Thumbnail test

The board builds a greyscale strip at thumbnail size. If two thumbnails are hard to tell apart,
they are one direction: merge them, or move one on a structural axis and redraw. Each card finishes
the sentence "In greyscale at thumbnail size it differs from <other> in <structure, type or density>".
A difference only in colour fails by construction. Passing the test shows that the directions
differ, never that one of them is good enough to ship (section 4).

## 9. Recommend

- Recommend the lead by default. Recommend another card only for a reason from the comparison table
  (primary-task cost, fit, available content, build or migration cost), and name the row. Never
  recommend the canon, with one exception: in a redesign of a daily-use tool where
  [redesign](redesign.md) §7 finds no blocking structure, recommending the canon card is correct.
- Say what would change your mind: a fact that, if true, makes another direction better.
- Name which traits mix cleanly and which conflict.
- Presenting options without a recommendation delegates the design; hiding the recommended
  direction's failure mode is selling, not designing.

## 10. Converge

- **Show, then ask.** A question that asks the user to choose carries the rendered board: the path
  or URL of `index.html` to open, and one PNG per direction (same content, same frame size)
  attached or listed by path. A file written into the project has not been shown; names, palettes
  and layouts described in words are not a board. At any effort, asking the user to choose between
  looks is `options`: draw and render them first. In a 2026-09 host round three directions were
  drawn and captured, no board was assembled, and the user was asked to pick from descriptions.
- The user picks, mixes or rejects. When mixing ("A's type with C's colour"), name what conflicts
  and resolve it (a playful palette on a severe type system); never average.
- Record in decisions.md: chosen, rejected and why (so later rounds do not circle back), the seed
  line, what would change the decision, and who chose. "The user picked A", "the user kept A, B
  and C as themes" and "A is on by default, the user has not picked" are three different rows.
- Complete the surface contracts (own-world, form + seed; [truth-files](truth-files.md)), then build
  the system ([system](system.md)) before more screens.
- Autonomous run with no one to choose: build the recommendation and say that the user did not pick.
- **"None of these"**: ask which axis feels wrong (structure, type voice, colour, density) before
  drawing more. New values on the same axes earn the same rejection.
- **Re-roll** on request, in a register: *safer* (referents nearer the category, never the rut) or
  *bolder* (referents further from it). Rewrite referents.txt for the register and roll with the next
  `--round`. After two re-rolls in a row, stop and ask what quality is missing.

## 11. Runners-up as themes

When the user wants runners-up kept as switchable themes, list per theme the traits it must keep
at declared variant points: shell and navigation, collection presentation (table, list, cards),
detail container (page, drawer, split), density. A version that keeps only the colours is labelled
"palette variant", not the direction: in the 2026-09 host rounds, colour-only themes lost the
table style, density and header treatment that made their directions.
Mechanics: theme families in [system](system.md).

## 12. By effort

| Effort | Divergence |
| --- | --- |
| `quick` | none; name the rut and your first idea to yourself and avoid both |
| `standard` | no board unless asked; write the three rut lines, then draw one direction that avoids them |
| `deep` or `options` | sections 1-10, subagents when available |
