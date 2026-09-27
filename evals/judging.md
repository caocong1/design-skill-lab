# Judging protocol (output eval)

How rendered outputs from the three arms are scored. The orchestrator follows this file step by step; judges receive
only what section 2 lists. Decide nothing about the rules after seeing outputs: if a rule turns out to be wrong, finish
the round under it, report that, and change the rule for the next round.

## 1. Principles

- **Blind.** Judges never learn which arm produced what. Arms appear as A, B and C, mapped at random per brief.
- **Same pictures for everyone.** Judges see canonical renders made by `evals/render.mjs` from each arm's HTML, not
  the PNGs an arm made for itself (those are used only as a fallback, section 8).
- **Facts are measured, not guessed.** Contrast, target sizes, overflow and render errors are computed by the
  orchestrator and handed to judges as facts.
- **Nothing is dropped.** An arm that produced nothing scores 0 and appears in every table.
- **The brief is the standard.** Judges score how well each output answers its brief, using the anchors below and
  the brief's judge notes. Process files (notes, plans, boards, specs) are never shown to judges.

## 2. What a judge receives

One packet per brief, built **outside** the runs tree so a judge cannot see arm folders or other judges' files:

```
<scratch>/judge/<brief>/
  brief.md        the full brief, including its judge notes
  facts.md        measured facts per label (section 4)
  A/  B/  C/      canonical PNG frames for each label, same file names in each folder
  before.png      brief 06 only: the legacy screen (evals/briefs/assets/06-legacy/legacy-1280x800.png)
```

Plus the judge prompt (section 5), which carries this file's scale (section 6) and the pair order for that judge.
Not given: arm names, the mapping, any transcript, rationale or notes, run time, cost, other judges' scores.

## 3. Anonymisation

- Per brief, draw a random permutation of the three arms onto A, B, C. Pick a nonce once per round, then:

  ```sh
  python3 -c "import random,sys; a=['no-skill','suite-0.7.0','suite-0.8.0']; random.Random(sys.argv[1]).shuffle(a); print(dict(zip('ABC', a)))" '<date>-<brief>-<nonce>'
  ```

  Record the result and the seed string in `runs/<date>/mapping.json`. Judges never see this file.
- Per judge, randomise the order of the three pairs and which side of each pair is shown first; record it in the
  same file.
- Copy renders into the packet under neutral names (`A/list-01.png`). PNGs written by Playwright carry no path or
  author metadata.
- Before judging, look at every render for text that names a skill, a suite or its vocabulary (for example a visible
  heading that labels the page as a direction or a contract). Do not edit the render; record `identity_leak: true`
  with a note in `results.json` and judge it as it is.
- Also note any text on a render that addresses the reviewer instead of the product's user: annotations, callouts,
  captions describing the design, "meets WCAG AA" badges, rationale panels. Every brief forbids them. Record them in
  the arm's `notes`; judges are told to give them no credit (section 5).

## 4. Facts the orchestrator computes

For each arm and each file in the brief's render manifest:

1. **Render facts** from `render.json` (written by `evals/render.mjs`): status (ok / missing / error), frames, page
   height, whether frames were truncated at 10 screens, horizontal overflow at the manifest width, console errors.
2. **Measured facts** from `evals/tools/facts.mjs`, the harness's own tool, run the same way on every arm (record
   its commit). No arm's tools are used: the 0.8.0 suite ships its own linter, and facts from it would score that
   arm by the checker it may have designed against.

   ```sh
   node <repo>/evals/tools/facts.mjs <repo>/evals/briefs/<brief>.md <arm>/out [--touch 44] > <arm>/facts.json
   node <repo>/evals/tools/facts.mjs <repo>/evals/briefs/<brief>.md <arm>/out [--touch 44] --md <label>   # facts.md lines
   ```

   `--touch 44` for briefs 03 and 04. It measures exactly the judged area (first screen of viewport items, the judged
   frames of full-page items): text contrast against WCAG 2.2 AA (4.5:1, large text 3:1) from computed colours, and
   from pixels where text sits on an image or gradient; targets under 24 × 24 CSS px that fail the WCAG 2.5.8 spacing
   exception (and, with `--touch`, every target under 44 × 44); images without alt; horizontal overflow. Targets are
   found only where marked up as interactive, so target counts are a lower bound, and `facts.md` says so. What the
   tool reports as not measurable stays unmeasured: never fill it with an estimate.
3. **Completeness**: required files present / expected, from the manifest.

`facts.md` lists these per label in the same order for every label, in plain sentences: the render facts, then the
`--md` output, for example:
"A: 5 of 5 files present. 0 console errors. - list.html (1440x900@1): text below AA: 2 of 412 measured text nodes,
lowest 3.9:1 (needs 4.5) td.time "09-27 09:12" #8a8f98 on #ffffff, 13px. Targets under 24 px that fail the spacing
exception: 15 of 80 (checkbox 16x16; ...). Method: evals/tools/facts.mjs @ <commit>."

## 5. Judges

Three judges per brief, each a fresh subagent with no other context, each with a distinct lens. Every judge scores
**all six dimensions for every arm**; the lens decides where they look first and what their pairwise reasons weigh.

| Judge | Lens | Looks first at |
|---|---|---|
| J1 | Product and task: a senior product designer who has shipped this kind of product | whether the job gets done: content, states, task flow, hierarchy for the real user |
| J2 | Visual and typographic: an art director with strong typography, including CJK | identity, composition, craft, type scale and setting |
| J3 | Platform and accessibility: a specialist in the brief's target platform and in accessibility | platform conventions, legibility, the measured facts, targets, status without colour |

Use one model for all judges in a round and record it. If a model family other than the design agents' is available,
prefer it (it lowers self-preference); if not, record that judges and designers share a model.

### Judge prompt template

```
You are judge <J1|J2|J3> for a design review. Your lens: <lens text from the table>.
Read only these files: <packet>/brief.md, <packet>/facts.md, every PNG in <packet>/A, <packet>/B, <packet>/C
<, and <packet>/before.png>. Do not open any other file or folder.

1. Read the brief, including its judging notes.
2. Look at every PNG of every label.
3. Score each label on the six dimensions with the anchors below (integers 1-5). <Brief 06: also score before.png as R.>
   Use facts.md for contrast, targets, overflow and missing files; do not re-estimate contrast by eye.
   Judge the interface a user would see. Text on a render that speaks to reviewers instead of users (annotations,
   callouts, captions about the design, compliance badges, rationale) earns no credit; where it covers or crowds
   the interface, count that against Craft.
   Any score of 1, 2 or 5 needs one line of evidence naming the PNG and where.
4. For each pair, in this order, say which you prefer overall as the answer to the brief: <pair list with left/right>.
   Answer left, right or tie. Tie only if you cannot name a difference that matters to the brief.
   Give one line (at most 30 words) naming the visible difference that decided it.
5. Reply with the JSON object below and nothing else.

<section 6 anchors>
<section 7 JSON shape>
```

## 6. Scale

Integers 1-5 per dimension; 0 is reserved for an arm with no output (section 8). 2 and 4 sit between the anchors.

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **Fit**: does it do this brief's job for this audience with this content? | wrong job, or required content and states missing or distorted | all required content and states present and workable, but generic | shaped around this audience's real task; choices that only make sense for this brief |
| **Hierarchy**: can you tell what matters and where to act? | flat or chaotic, no clear entry point | clear primary element and action; groups make sense | effortless reading order across the whole screen; density suits the task |
| **Identity**: a fitting character of its own | template or default look that could belong to any product, or a style that fights the job | coherent and appropriate but interchangeable | memorable and specific to this product, and still serves use |
| **Craft**: execution | broken: overlaps, clipped text, misalignment, inconsistent components | clean and consistent with few defects | precise everywhere, including states and edge content |
| **Typography** (including CJK) | illegible, fallback glyphs or tofu, clipped or cramped text | legible, consistent scale, sensible line length and leading | type carries hierarchy and character; numerals, CJK setting and mixed scripts handled well |
| **Platform / Accessibility** | ignores the target platform, or primary text fails AA | platform conventions mostly honoured; body text passes AA; minor issues | idiomatic for the platform; all measured text passes; adequate targets; status never by colour alone |

Rules that apply to every brief:

- **Identity, name-swap test**: if the product name could be swapped for another and nothing would look wrong,
  Identity is at most 3. For work tools (briefs 01, 04, 06) identity means a coherent character that fits the work;
  restraint is not penalised.
- **Missing deliverables cap Fit**: one required file missing, Fit at most 3; more than one, Fit at most 2.
- **Invented facts** the brief forbids (third-party logos, testimonials, data, people, features): Fit at most 2. A
  wordmark or logo for the brief's own product, placeholder artwork (book covers, photos drawn as placeholders) and
  interface labels a screen needs are design, not invented facts.
- **Platform / Accessibility uses the facts**: measured failures on primary text keep this dimension at 2 or below;
  a clean fact sheet does not by itself earn a 5.

## 7. Judge output

```json
{
  "brief": "01-ops-console-zh",
  "judge": "J2",
  "scores": {
    "A": {"fit": 4, "hierarchy": 3, "identity": 3, "craft": 4, "typography": 4, "platform_a11y": 3,
          "evidence": ["A/list-01.png: SLA column right-aligned, overdue rows marked with icon and text"]},
    "B": {"fit": 2, "hierarchy": 2, "identity": 3, "craft": 3, "typography": 3, "platform_a11y": 2,
          "evidence": ["B/list-01.png: only 6 rows above the fold, KPI cards take half the first screen"]},
    "C": {"fit": 4, "hierarchy": 4, "identity": 4, "craft": 4, "typography": 5, "platform_a11y": 4,
          "evidence": ["C/detail-01.png: tabular figures, threshold line labelled 55 °C"]}
  },
  "pairs": [
    {"left": "C", "right": "A", "prefer": "left", "reason": "C's detail puts SLA and actions in the header; A buries them under the readings."},
    {"left": "A", "right": "B", "prefer": "left", "reason": "A shows 12 rows above the fold with clear filters; B shows 6 under KPI cards."},
    {"left": "B", "right": "C", "prefer": "right", "reason": "C handles all three states with next steps; B's error is a bare toast."}
  ],
  "notes": "optional, at most 80 words"
}
```

Brief 06 adds `"R"` (the legacy screen) to `scores`, with the same fields; R never appears in `pairs`.

Save each judge's reply verbatim as `runs/<date>/<brief>/judging/<J1|J2|J3>.json` before anything is de-anonymised.
If a reply is not valid JSON, or misses a label, a dimension or a pair, send that judge one follow-up in the same
session asking only for the missing or malformed part in the required shape; keep both replies and note it. Never ask
a judge to reconsider a score or a preference.

## 8. Failures, partial output, ties and reruns

- **Empty arm** (no required file renders and no own PNG exists: timeout before writing, crash, refusal, files
  written elsewhere): the arm is not shown to judges. It scores 0 on every dimension for every judge, loses every pair
  against a non-empty arm, and ties with another empty arm. `status: "empty"` with the cause. It stays in every table.
- **Partial arm**: judges see what exists; `facts.md` lists the missing files; the Fit cap in section 6 applies.
- **Canonical render failed but the arm made its own PNG**: judge the arm's PNG, and record `source: "arm-png"` for that
  file in the facts and in `results.json`.
- **Pair result**: an arm wins a pair when at least 2 of the 3 judges prefer it; anything else is a tie.
- **Brief winner**: the arm that wins both of its pairs. Otherwise there is no winner, reported as `cycle`
  (A beats B, B beats C, C beats A) or `ties`. Scores never break a tie in the preference result; they are reported
  beside it.
- **Reruns**: only for infrastructure failure (API outage, harness or sandbox crash, isolation breach found in the
  transcript check), decided from logs **before** anyone looks at the outputs, and recorded in `results.json`
  notes. A timeout, a weak result or a refusal is a result, not a reason to rerun.

## 9. Aggregation

Per brief and arm:

- Dimension mean = mean of the three judges' scores (two decimals in `results.json`, one in `report.md`).
- Overall = unweighted mean of the six dimension means.
- Spread = max minus min across judges per dimension; a spread of 3 or more is flagged as disagreement in the report.

Across the six briefs:

- Per pair of arms: wins, losses and ties over briefs.
- Per arm: mean overall, mean per dimension, number of brief wins.
- Claim rule, fixed in advance: say "X is better than Y" only if X wins at least 5 of the 6 briefs against Y and its
  mean overall is at least 0.5 higher. Otherwise say "no clear difference" and show the numbers. With one sample per
  cell, a 6–0 split has a two-sided sign-test p of about 0.03 and 5–1 about 0.22; say so next to the claim.

With more than one sample per cell, sample k of each arm forms its own judged set: its own mapping, packets and
three judges, exactly as above. Pairs and winners are counted per brief and sample. A brief's pair result is the arm
that wins the majority of its samples (otherwise a tie), so the claim rule above still counts 6 briefs; report every
sample's result and the spread of overall means beside it.

## 10. Rationale-vs-render check

For every arm that wrote rationale: `out/rationale.md` (required in brief 06) and any design claims in `out/NOTES.md`.

- Run by a separate checker subagent after the three judges have finished; it sees one arm at a time: that arm's
  rationale text, its renders and its facts. It does not score or compare arms.
- The checker lists up to 12 concrete, checkable claims (for example "Check In is the primary action", "status uses
  icon and text", "all text passes AA", "the 14 tabs are grouped into 5") and marks each **verified** (the render or
  the facts show it), **contradicted** (they show otherwise) or **not checkable** (intent, process, behaviour a static
  render cannot show), quoting the claim and citing the PNG or fact.
- Brief 06: the checker also walks the brief's function list and marks each function **on screen**, **accounted for**
  (the rationale says where it went) or **missing**.
- Reported beside the scores (`claims: 8 verified, 1 contradicted, 3 not checkable`; `functions: 41 on screen, 6
  accounted for, 1 missing`). It does not change the six scores; a contradicted claim is named in the report.

## 11. Known biases and limits

- Judges are models. Their taste is a proxy for expert review, not a replacement; a human spot check of a few briefs
  per round is worth doing and should be reported as such.
- The dimension names match those in the critique-design skill's rubric. The anchors above were written for this eval
  and judges never receive suite files, but an arm that self-critiques on similar dimensions may still be favoured.
- The Identity rule's name-swap test and the generic-look lists in some judge notes are also taught by both suites'
  anti-generic guidance (both call it the "regardless of subject" test). They judge the output, which any arm can
  get right, but the alignment favours the suite arms and the report should say so.
- The 0.8.0 arm ships its own linter and may run it during design. Facts come from the harness's `facts.mjs`, not
  from that linter, but both measure WCAG contrast and target size, so an arm that lints its work will tend to have
  cleaner facts. That is a real quality difference, not a bias, but say where it decided a Platform / Accessibility
  score.
- Static renders at fixed sizes: motion, interaction and other viewport sizes are not judged.
- No user answers questions during a run, so any step where a suite would ask the user to choose becomes the agent's
  own choice. This is the same for every arm.
