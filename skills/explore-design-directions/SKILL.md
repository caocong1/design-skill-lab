---
name: explore-design-directions
description: Turn a fuzzy request into a design brief, then produce two to four genuinely different design directions, present them fairly as a rendered options board, recommend one, and converge with the user. Use when the user asks for several schemes or options, a complete design from requirements, a new look and feel, a concept or moodboard, or when the right aesthetic is not yet decided. 出几套方案、多个风格、设计方向、概念稿、需求梳理。
metadata:
  version: 0.2.1
  short-description: Brief, diverge, present options, converge
---

# Explore Design Directions

The most expensive design mistake is polishing the wrong direction. This skill
front-loads the decision: a brief short enough to be read, directions far
enough apart to be a real choice, and a fair way to compare them.

## 1. Brief

Infer first. Read the repository, the product, existing brand assets, the
user's words and any links they gave. Then write the brief with assumptions
marked, and ask **at most three** questions - only ones whose answers would
change the direction (audience, the feeling, a hard constraint). If the brief
can be inferred with confidence, do not ask; state it and proceed.

```markdown
# Design brief: <project>
- **One-liner**: what this is and what it is for.
- **Audience & context of use**: who, on what device, in what situation, how often.
- **Jobs**: the user's top tasks; the business outcome the design serves.
- **Brand attributes**: 3-5 adjectives as "X, not Y" pairs (confident, not loud).
- **Tone sliders** (1-5): playful-serious | minimal-rich | classic-modern |
  warm-cool | quiet-loud | airy-dense.
- **Content inventory**: real copy, data, screenshots, photos, logo available. Gaps.
- **Constraints**: platforms, stack, existing system, accessibility level,
  languages / scripts, performance, legal, deadline.
- **References**: liked, disliked, and *why* for each; competitors.
- **Success looks like**: observable outcome, not "looks modern".
- **Deliverables & fidelity**: what files, how finished.
- **Assumptions / open questions**.
```

A design read is the one-line version and is always stated out loud:
"Reading this as a B2B ops console for on-call engineers: calm, dense,
keyboard-first, dark-capable; convention over novelty."

Translate vague taste words before designing. "高级感 / premium" usually means
restraint: fewer colours, more whitespace, finer type, slower motion.
"科技感 / techy" is not neon blue by default - ask what the audience trusts.
"Clean" means hierarchy and alignment, not emptiness.

## 2. Choose the Axes

Directions must differ on axes that matter for *this* brief. Pick three or four
axes, then place directions far apart in that space:

| Axis | Poles |
| --- | --- |
| Typographic voice | neutral grotesque / humanist sans / serif or editorial / mono or technical / expressive display |
| Colour strategy | monochrome + one accent / tonal single-hue / duotone / vivid multi-hue / dark-first |
| Layout grammar | strict grid / editorial asymmetry / bento modules / full-bleed cinematic / single column |
| Density & rhythm | airy gallery ... compact cockpit |
| Shape language | sharp / softly rounded / pill / organic |
| Depth model | flat / hairline-outlined / layered shadow / translucent material |
| Imagery strategy | product UI / photography / illustration / 3D / type only / data as art |
| Motion personality | still / calm / snappy / playful / cinematic |

A direction is a **coherent position on all axes**, summed up by an evocative
name and a one-sentence concept. The name is a tool: every later decision can
be tested against it ("would *Swiss Ledger* use a drop shadow here?").

Range heuristic for three options: **evolution** (closest to what the audience
already expects), **confident modern** (the recommendation in most cases),
**bold bet** (a defensible risk). For two: conservative vs. progressive. A
fourth is a wildcard from outside the category (editorial, architecture,
print, game UI). Never more than four. Every direction must be one you would
be willing to ship: no strawmen.

Ground each direction in references: two to four per direction, found through
`../find-design-inspiration/SKILL.md`, cited with what is being taken from each.

## 3. Build the Options Board

One self-contained HTML file: `.design/directions/<round>/index.html`.

- **Same content in every direction.** Use the real or realistic copy and data
  from the brief. A representative slice, not a full product: for a marketing
  site the hero + one content section + a CTA; for a product the key screen +
  one form or table + one card; for a brand the mark + palette + type + one
  application.
- **Same fidelity and same viewport** for each. Polish disparity biases the
  choice.
- Each direction carries a card: name, concept sentence, why it fits the
  brief, **where it will fail**, palette with roles, type families and scale,
  shape / depth / imagery / motion notes, references.
- Neutral labels (A / B / C) beside the names; a switcher or side-by-side
  layout; light and dark if the brief needs both.
- Tokens per direction live in a scoped block (`[data-direction="a"] { --… }`)
  so the chosen one can be lifted straight into `system/tokens.css`.
- When the deliverable is itself a page, the strongest board is **the page
  with a live switcher**: one DOM, and each direction re-maps the tokens and
  re-composes the layout under its own `[data-direction]` scope. Layout
  grammar can change a great deal with CSS alone (grid re-arrangement,
  `order`, `writing-mode`, list versus card grid).
- Same **content and same jobs**, not necessarily the same DOM. A direction
  whose metaphor is a different instrument — a data table, a route map, a
  chat thread, a spatial scene — may mount its own view, as long as it reads
  the same content model and still does the jobs (find, filter, open). Say
  that on the failure card. Different markup that also changes what is said
  is still not allowed.
- Switching directions returns the reader to the **top** of the new view.
  Do not hard-code "ten": digit keys only cover the first ten, and a label
  that prints `n % 10` lies as soon as there is an eleventh.
- **Thumbnail test**: shrink the rendered directions to about 600 px wide and
  put them side by side. If two thumbnails are hard to tell apart, they are
  one direction - the difference was only colour.
- Render and inspect the board (`../design-studio/references/render-and-look.md`)
  before showing it. Check each direction against
  `../design-studio/references/anti-slop.md` - if two directions would be
  described with the same adjectives, they are one direction.

End with a comparison and a recommendation:

| Criterion (from the brief) | A | B | C |
| --- | --- | --- | --- |
| Fits the audience's expectations | | | |
| Distinctive among competitors | | | |
| Works with the available content / imagery | | | |
| Implementation cost in the host stack | | | |
| Accessibility and longevity risk | | | |

Recommend one, say why, and say what would change your mind. A designer who
presents options without a point of view is delegating the design.

## 4. Converge

- Let the user pick, reject or mix. When mixing ("A's typography with C's
  colour"), check the hybrid for coherence: name what conflicts (a playful
  palette on a severe type system) and resolve it rather than averaging.
- When the reaction is "none of these", find out which axis is wrong before
  producing more. Changing values on the same axes yields the same rejection.
- Record the outcome in `.design/decisions.md`: chosen direction, rejected
  ones and why (so later rounds do not circle back), open questions.
- Lift the chosen direction into a system with
  `../build-design-system/SKILL.md` before designing more screens.

## Anti-Patterns

- Palette-swap options: same layout, same type, different accent colour.
- One real option and two strawmen.
- Different content or different fidelity per option.
- Lorem ipsum, fake logos, fake metrics.
- Describing directions in prose instead of rendering them.
- Presenting without a recommendation, or hiding the trade-offs of the
  recommended one.
- Skipping the brief because the request "is just a landing page".
- Asking the user ten questions before showing anything. Show, then ask.
- Treating "one DOM" as permanent after a direction's metaphor has become a
  different instrument, or baking the count of directions into keys and labels.

## Deliverables

- `.design/brief.md` with assumptions marked.
- `.design/directions/<round>/index.html` options board, rendered and checked.
- Comparison table, recommendation and the decision recorded in
  `.design/decisions.md`.
