# Quality Rubric

A scorable rubric turns "does this look good?" into something a reviewer can
answer the same way twice. Use it for the self-check before presenting work,
in `critique-design` reports, and to compare before and after.

Score what is **rendered**, against the **brief**. When the host supports
subagents, the scorer should be a fresh context that sees only the brief and
the screenshots - not the author's reasoning. Authors reliably over-rate
their own work.

## Scale

| Score | Meaning |
| --- | --- |
| 0 | Broken or absent |
| 1 | Weak: obvious problems a non-designer would notice |
| 2 | Acceptable: works, unremarkable, several fixable issues |
| 3 | Good: a professional would ship it; minor refinements only |
| 4 | Excellent: nothing to add, nothing to remove, clearly intentional |

Most competent first passes are a 2. Reserve 4. A dimension that does not
apply is marked n/a, not scored.

## Dimensions and Anchors

| Dimension | 1 looks like | 3 looks like |
| --- | --- | --- |
| **Fit to brief** | could belong to any product; tone contradicts the audience | recognisably for this audience and job; attributes from the brief are visible |
| **Hierarchy** | several things compete; no clear primary action; squint test shows noise | first, second, third are unmistakable and correct |
| **Layout & spacing** | arbitrary gaps; things aligned to nothing; inner spacing larger than outer | one spacing scale, consistent alignment lines, clear grouping, deliberate rhythm |
| **Typography** | many sizes and weights; long lines; tight or loose leading; fallback font rendered | a small scale used consistently; comfortable measure and leading; details (numerals, punctuation) handled |
| **Colour & contrast** | accent everywhere; failing contrast; colour-only status | roles are clear; accent is spent on action; every pair computed and passing |
| **Consistency** | several radii, shadows, icon styles, button styles for one purpose | one logic per property; tokens evidently in use |
| **States & robustness** | only the happy path exists; long content breaks layout | empty, loading, error, long and mixed-script content are designed |
| **Interaction & motion** | no feedback, or motion everywhere and slow | immediate feedback; motion has a job, is fast, interruptible, reduced-motion aware |
| **Content & copy** | lorem ipsum, vague labels, fabricated proof | real or realistic content; verbs on buttons; errors that help; placeholders labelled |
| **Accessibility** | keyboard traps, invisible focus, tiny targets | keyboard path, visible focus, targets, semantics, zoom and reduced motion handled |
| **Platform / responsive fit** | desktop squeezed onto a phone; foreign platform idioms | re-composed per window class; native conventions respected |
| **Identity** | the statistical default, or novelty that hurts use | one memorable, appropriate idea; restraint elsewhere |
| **Craft** | misaligned icons, clipped shadows, mismatched nested radii, blurry images | optical alignment, clean edges, nothing accidental |

## Use

- Give each score a one-line reason with evidence (screenshot region,
  selector, measured value).
- P0 and P1 findings outrank the average: a 3.4 average with a failing
  primary flow is not shippable.
- For the suite's own work, fix or disclose everything scoring below 2 and
  any accessibility failure before presenting.
- Calibrate: when a reviewer's scores disagree with the user's reaction, read
  the disagreement, adjust the anchors or the brief, and note it in
  `decisions.md`. Scores are for tracking change, not for grading people.
