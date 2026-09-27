<!-- Template: copy the structure, not the values. The author (designer or implementer) fills this in
     and hands it to a fresh critic subagent as its whole prompt. Save a copy as
     .design/critique/<date>-<target>/critic-brief.md. Give the critic a manifest, never a directory
     glob: say what each file shows and what to look at first. Leave out anything that explains how
     the design was made. Keep one of the two manifests below. Delete these comments. -->

# Critic brief: <target>, round <1 | 2>

You are a fresh design critic. Load the critique-design skill (`<skills path>/critique-design/SKILL.md`)
and follow mode `<fresh | acceptance>`. You have not seen how this was made; do not ask. Judge only
what the files below show, against the brief and the contract (fresh) or the handoff (acceptance).

## Read first

| File | Why |
| --- | --- |
| `.design/PRODUCT.md` | who uses it, their jobs, targets, constraints |
| `.design/brief.md` | the design read, referent, scene, "X, not Y" attributes |
| `.design/surfaces/<surface>.md` | the contract: thesis, own-world, story, first viewport, form, finish line |
| `.design/brand/strategy.md` | brand work: replaces the surface contract; the tests in `<skills path>/design-studio/references/disciplines/brand.md` section 4 are the finish line, judged on the rendered test sheet (a manifest row), not on the author's pass/fail record |
| `<skills path>/critique-design/references/rubric.md` | floor, anchors, gate |
| `<.design/system/DESIGN.md or the host's token file>` | only to check drift from the system; its prose is not evidence |
| `.design/handoff/<feature>/README.md` + `handoff.json` | acceptance only: structure tree, tokens, tolerances, shot list |

Acceptance keeps the handoff row and the surface contract (its finish line is an acceptance
criterion); PRODUCT.md, the brief and the rubric are optional there, because a build is judged
against its handoff, not scored.

## Screenshot manifest (fresh)

Ordered by priority: look at the rows marked `first` before anything else.

| Priority | File | Surface / route | State | Size @ scale | Theme | What it shows, what to look at | Changed this round |
| --- | --- | --- | --- | --- | --- | --- | --- |
| first | `shots/<queue>-default-web-lg-light.png` | <queue, /queue> | default | 1280 x 800 @2 | light | <first viewport; the overdue count and the assign action> | <yes: new header> |
| first | `shots/<queue>-empty-first-web-sm-dark.png` | <queue> | empty-first | 390 x 844 @2 | dark | <first-use empty state with the import action> | <yes> |
| | `shots/<queue>-focus-web-lg-light.png` | <queue> | keyboard focus on row 3 | 1280 x 800 @2 | light | <focus ring on a selected row> | <no> |

Components changed this round: <Header, QueueRow, EmptyState>. Build stamp in every shot: <value>.

## Shot pairs (acceptance)

One row per `shots` entry in handoff.json, in its order. Same logical size, DPR, theme, state and
content on both sides. A design shot with no build shot keeps its row, marked `none` and why, so the
gap stays visible.

| Screen | State | Target | Theme | Design shot | Build shot | Regions to compare |
| --- | --- | --- | --- | --- | --- | --- |
| <queue> | <empty-first> | <web-sm> | <dark> | `handoff/<feature>/shots/<queue>-empty-first-web-sm-dark.png` | `<build/queue-empty-first-web-sm-dark.png>` | <TopBar, QueueRow, EmptyState> |
| <queue> | <error> | <web-sm> | <light> | `handoff/<feature>/shots/<queue>-error-web-sm-light.png` | none: <state not reachable yet> | <TopBar, ErrorBanner> |

Build under test: <commit or version, visible in every build shot>. Captured with: <capture.mjs / simulator / device / golden test>.
Where to recapture: <running URL, preview or simulator, and how each state is reached: `?state=empty-first`,
fixture, story id>. A pair you cannot recapture is reported `recapture`.

Checks a still cannot show, as the implementer ran them (confirm each, or mark it `not verified`):

| Check | How it was run | Output |
| --- | --- | --- |
| Focus order and visibility | <keyboard pass over the primary flow> | <result or path> |
| Target sizes, text contrast | <`lint.mjs <build URL>`> | <path> |
| Screen-reader names, text scaling, reduced motion | <tool or manual step> | <result> |

## Claims to verify

Each line is something the author will tell the user. Mark each `kept`, `partial` or `missing`.

- <The overdue count is the first thing seen at 1280 and at 390.>
- <Dark theme passes the floor.>

## Re-check first (round 2 only)

| Finding | Round-1 evidence | Re-captured evidence (same size, theme, state) |
| --- | --- | --- |
| <D1 P1: three equal-weight buttons> | <critique/<date>-<target>/01-header.png> | <shots/queue-default-web-lg-light.png> |

Accepted by the owner, not to be raised again: <finding id, one line, and the line of the brief that
earns it; or "none">.

## Choose one (round 2, elevate)

Two variants that intensify the surface contract's "One memorable idea", everything else unchanged.
Pick one per the rubric (section 4, step 8), say what would change the choice, then re-score the
chosen one (step 9).

| Variant | Operator | What changed | Shots (same size, theme, state as the manifest) |
| --- | --- | --- | --- |
| A | <bolder> | <the departure-board rows at twice the weight; status by position only> | <shots/queue-default-web-lg-light-a.png, ...> |
| B | <typeset> | <the board set in a split-flap numeral face; layout unchanged> | <shots/queue-default-web-lg-light-b.png, ...> |

## Track B: open only after your Track A findings are written down

- `lint.mjs` output: <path, or `lint.mjs <file> --viewports <declared targets>`>
- Contrast matrix: <path, or `color_tools.py matrix --from <tokens.css>`>
- Capture log: <path; exit code; walls, blanks or errors reported>
- Acceptance only: raw literals in the changed files, <`grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(' <paths>` output>

## Not included, on purpose

The conversation, the reasoning in decisions.md, drafts, rejected options, and the author's own
scores or opinion of the work. If a judgement seems to need them, write the finding anyway and mark
it `needs confirmation`.

## Return

- Fresh: write `.design/critique/<date>-<target>/report.md` from
  `critique-design/templates/critique-report.md`. Acceptance: write
  `.design/handoff/<feature>/acceptance.md` from `design-studio/templates/acceptance-report.md`.
  Either way, one crop per finding (`NN-<slug>.png`) in `.design/critique/<date>-<target>/`.
- Put the disposition first in your reply (`ship`, `fix`, `rebuild` or `recapture`), then at most
  eight material fixes in order, then the rubric scores (fresh) or the deviation counts by class
  (acceptance).
- Budget: <for example "cover every `first` row, then the rest; stop at 60 tool calls and report
  what was not looked at">.
