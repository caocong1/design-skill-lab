# Output eval, round 2026-09-27-r2

Six fixed briefs, two arms (no skill, suite 0.8.1), **three samples per cell**: 36 design outputs in 18 judged sets, each set judged blind by three model judges. Protocol: [judging.md](../../judging.md). Data: [results.json](results.json) (validates against [results.schema.json](../../results.schema.json)), anonymisation in [mapping.json](mapping.json), isolation check in [isolation.json](isolation.json), identity-leak scan in [leaks.json](leaks.json). Every number below is computed by [`evals/tools/aggregate.py`](../../tools/aggregate.py) from the judges' verbatim replies. Round 1 is [here](../2026-09-27/report.md); the Chinese field record is [research/field/evals-2026-09-28.md](../../../research/field/evals-2026-09-28.md).

## 1. Headline

**No claim passes the pre-registered rule, again, and this time only the margin fails.** The rule (judging.md section 9) allows "X is better than Y" only if X wins at least 5 of the 6 briefs *and* its mean overall is at least 0.5 higher.

| Comparison | Briefs (wins-losses-ties) | Judged sets | Judge votes | Mean overall | Difference | Rule result |
|---|---|---|---|---|---|---|
| suite-0.8.1 vs no-skill | **6-0-0** | 17-1-0 | 49-5-0 | 4.11 vs 3.83 | +0.28 | no clear difference |

- **Preference is one-sided.** suite-0.8.1 won all six briefs (a brief is won by the majority of its three samples), 17 of 18 judged sets and 49 of 54 judge votes. 14 of the 18 sets were unanimous. An exact sign-flip test on the six per-brief mean differences gives a two-sided p of 0.031, the smallest value six briefs can give.
- **The margin is not met.** The mean overall is 0.28 higher, a little over half of the 0.5 the rule asks for. The rule was fixed before round 1 and is not changed after the fact, so the result is reported as "no clear difference", with the numbers beside it.
- **Why the two halves of the rule disagree.** The judges used 4 for 478 of 648 scores (74%), 3 for 94 and 5 for 76, and never differed by more than 1 point on any dimension. On a scale that compressed, a 0.5 gap in the mean would need about half of all scores to move a full point. The pairwise preference is the more sensitive instrument; the score scale, as anchored today, is not. Section 8 proposes a fix to the instrument for the *next* round.
- **Where the difference is.** Fit (+0.68) and Identity (+0.53) carry it. Hierarchy is equal (4.07 both), Craft +0.09, Typography +0.13, Platform / Accessibility +0.22.
- **The one lost set**: brief 05, sample 2. suite-0.8.1 made "approve the whole batch" the primary button although one payee was flagged; two of three judges preferred no-skill, which made the safer choice primary. It is also the only one of the 18 suite runs that skipped the fresh critic (no subagent, the cheapest suite run at $1.61). One run is not evidence of cause; it is recorded because it bears on section 8, item 4.
- **Cost.** suite-0.8.1 cost 2.0 times the dollars of no-skill ($3.17 vs $1.55 per run) and took 2.0 times the wall time (14.3 vs 7.2 minutes). Section 6.
- **The harness had a bug, found in this round and fixed** (section 5). It produced one false fact, against the suite arm. The affected set was judged again; the first judging is kept and not counted.
- **What cannot be said.** This round does not compare 0.8.1 with 0.8.0 or 0.7.0: they were never in the same judged set, and scores do not carry across rounds (round 2 judges scored the very same six no-skill outputs of round 1 at 3.87 on average, round 1 judges at 4.00).

## 2. Scoreboard

Means over six briefs of the per-brief means (three samples, three judges each), 1-5.

| Arm | Fit | Hierarchy | Identity | Craft | Typography | Platform / A11y | Overall | Brief wins | $ per run | Minutes per run |
|---|---|---|---|---|---|---|---|---|---|---|
| no-skill | 4.15 | 4.07 | 3.06 | 3.91 | 3.94 | 3.87 | **3.83** | 0 | 1.55 | 7.2 |
| suite-0.8.1 | 4.83 | 4.07 | 3.59 | 4.00 | 4.07 | 4.09 | **4.11** | 6 | 3.17 | 14.3 |

Per brief: sets won, and the overall mean with each sample's value in brackets.

| Brief | Sets (suite - no-skill - tie) | Brief result | suite-0.8.1 overall | no-skill overall |
|---|---|---|---|---|
| 01-ops-console-zh | 3-0-0 | suite-0.8.1 | 4.06 (4.06, 4.11, 4.00) | 3.81 (3.83, 3.78, 3.83) |
| 02-devtool-landing-en | 3-0-0 | suite-0.8.1 | 4.11 (4.06, 4.11, 4.17) | 3.83 (4.00, 3.83, 3.67) |
| 03-ios-consumer-screen | 3-0-0 | suite-0.8.1 | 4.15 (4.11, 4.11, 4.22) | 3.83 (3.83, 3.83, 3.83) |
| 04-miniprogram-list-zh | 3-0-0 | suite-0.8.1 | 4.13 (4.17, 4.00, 4.22) | 3.74 (3.72, 3.83, 3.67) |
| 05-agent-approvals | 2-1-0 | suite-0.8.1 | 4.15 (4.39, 4.06, 4.00) | 3.89 (3.83, 4.00, 3.83) |
| 06-redesign-legacy | 3-0-0 | suite-0.8.1 | 4.07 (4.11, 3.94, 4.17) | 3.89 (4.00, 3.72, 3.94) |

The spread between samples of one arm on one brief is at most 0.39 (suite, brief 05). In all 18 sets the suite sample scored higher overall than its paired no-skill sample, including 05 s2, the set it lost on preference (4.06 vs 4.00): preference and scores can disagree, which is why both are reported. The legacy screen of brief 06 scored 2.39 (2.33, 2.44, 2.39).

Measured facts, summed over all judged files (harness tool, the same for both arms, after the fix in section 5):

| Arm | Text nodes below AA | Targets under 24 px failing the spacing exception | Targets under 44 px (briefs 03, 04) | Pages with sideways scroll | Console errors |
|---|---|---|---|---|---|
| no-skill | 20 | 0 | 8 | 0 | 0 |
| suite-0.8.1 | 1 | 0 | 0 | 0 | 0 |

## 3. Pairwise results

An arm wins a judged set when at least 2 of its 3 judges prefer it. No judge answered "tie".

| Judge lens | Votes for suite-0.8.1 | Votes for no-skill |
|---|---|---|
| J1 product and task | 17 | 1 |
| J2 visual and typographic | 16 | 2 |
| J3 platform and accessibility | 16 | 2 |

The five votes for no-skill:

| Set | Judge | Reason given |
|---|---|---|
| 02 s1 | J2 | no-skill "has its own character (contour motif, wave mark, mono eyebrows, dark benchmark band)"; the suite sample "reads like a generic blue-on-white template" |
| 05 s2 | J1, J3 | no-skill "makes the safer 'Approve without Oakridge' the primary button"; the suite's "primary button approves all 7" |
| 06 s1 | J2 | no-skill's grid "is calmer: type written in words"; the suite's "stacks type codes, coloured bars and a legend on cramped cells" |
| 06 s2 | J3 | no-skill "puts search in the header and a full-width Check In beside the alerts"; the suite's panel "leads with Collect Copay" |

## 4. Per brief

What decided each brief, in the judges' words (shortened; full replies in `<brief>/judging/s<k>/`).

- **01 ops console (zh), 3-0, 9 votes to 0.** The suite samples made overdue SLAs impossible to miss (filled red chips, tinted rows, closed P1s muted) and gave the detail chart a headline that states the anomaly ("2 小时内升高 22.3 °C，08:50 起超过上限") with the alarm and mitigation events marked. no-skill was "equally clean but less specific"; one no-skill sample had 5 text nodes below AA.
- **02 developer-tool landing page (en), 3-0, 8 votes to 1.** This is the brief 0.8.0 lost 0-3 in round 1. The suite samples *showed the mechanism*: annotated code, a worked offline-merge example, pricing as an aligned row matrix, a Copy button on every install line, a menu kept on mobile. The one dissenting judge found a suite sample generic next to a no-skill page with a motif of its own. Set s3 is the one judged twice (section 5).
- **03 iOS consumer screens, 3-0, 9 votes to 0.** Identity decided it: dog-eared covers, a serif reading face, the highlight set as reading text, a week chart with labelled values. no-skill was "tidy but default grouped-gray iOS". All three no-skill samples had targets under 44 pt (2-4 each); no suite sample did, which is the touch-target check added in 0.8.1 doing its job. One suite sample has a text node below AA (the only measured failure of the suite arm in the round).
- **04 WeChat mini-program list (zh), 3-0, 9 votes to 0.** The suite samples led every card with the next bookable time and put the real relaxation counts inside the filter panel, "so users see the fix before tapping". Two no-skill samples have contrast failures (3 and 6 nodes) and one hides a sort option.
- **05 agent approvals, 2-1, 7 votes to 2.** In s1 and s3 the suite put the whole decision (payees, warning, each choice and its consequence, the undo window) on the first screen; no-skill's approve and reject buttons needed a scroll. That is the "decision first" rule added in 0.8.1. In s2 the suite made full-batch approval primary despite a flagged payee and lost 1-2.
- **06 legacy redesign, 3-0, 7 votes to 2.** The suite samples turned check-in into a checklist with one primary action and kept appointment type as text in the grid (the "text partner" rule added in 0.8.1 after round 1's 0-3 loss to 0.7.0 on colour-only types). The two dissenting votes found one suite grid cramped and one panel ordered by payment before check-in.

Rationale-vs-render check (a separate session per arm-sample, no scoring): both arms made 216 claims about their own designs.

| Arm | Verified | Contradicted | Not checkable |
|---|---|---|---|
| no-skill | 204 | 5 | 7 |
| suite-0.8.1 | 206 | 10 | 0 |

The suite still contradicts itself more often than no-skill (10 vs 5), although less than 0.8.0 did per run (0.6 vs 1.2). Three of the ten are in one sample (03 s3: wording and a goal line that the render does not show). Brief 06 function coverage: the suite missed 2 of 88-90 legacy functions in one sample (two counters), no-skill 1 in one sample.

## 5. Failures, reruns and one harness bug

- No empty or partial arm: 36 of 36 arm-samples delivered every file in the manifest; every file rendered with no console error, no truncation and no sideways scroll.
- **Reruns (infrastructure only, decided from logs before any output was opened):** the three 06-redesign-legacy suite-0.8.1 runs failed twice. Attempt 1 stopped at the account's weekly API limit (HTTP 429) after 8-11 minutes; attempt 2 lost the network when the machine slept (ENOTFOUND). Attempt 3 completed and is the one judged. The failed attempts, their cost (about $7.8) and transcript hashes are recorded in each `run.json`; their outputs were never rendered or judged. `run_round.sh` now keeps the machine awake.
- **A bug in the facts tool, found after the first judging.** The facts sheet of set 02 s3 said the suite sample had a text node at 1.12:1, the install command "#f4f2ea on #ffffff". The render shows that command as light text on a dark band (`02-devtool-landing-en/suite-0.8.1-s3/render/desktop-07.png`); it measures 16:1. Cause: `evals/tools/facts.mjs` sampled the node in the last pixel row of a frame (y = 899.55 of 900), where the browser's hit test returns an empty stack, and composited the text onto the default white.
  - Fixed in 396df58: the sample point moves one row up, and a hit test that misses the text counts as "not measured", never as a guess. `evals/tools/selftest.mjs` runs a fixture that fails on the old tool and passes on the new one; CI runs it.
  - **Scope.** All 54 arm outputs of both rounds were measured again with the fixed tool. Exactly one reported fact changed, this one. Every other contrast failure in both rounds is real. Round 1's results are not affected.
  - **Consequence, handled by the rule for protocol errors** (evals/README.md, honesty rule): set 02 s3 was judged again by three fresh judges with the corrected sheet, and the sample's rationale check was repeated. First judging, not counted: suite preferred 2-1, with J3 preferring no-skill for "a measured install-command contrast failure" and scoring the suite's Platform / Accessibility 2. Second judging, counted: suite preferred 3-0. The set was a suite win both times; the correction moved one vote, the suite's mean overall by 0.02 and its contradicted claims from 11 to 10. The superseded sheet and replies are in `02-devtool-landing-en/judging/s3/superseded-facts-bug/`.
  - The suite's own `lint.mjs` had measured this text correctly. A first draft of this report blamed the suite for shipping a failure "its floor should have caught"; that was wrong, and it was caught by opening the render before writing a rule from it.
- The rationale checks of brief 06 were run twice: the first packets had lost the function list with the judge notes, so the checkers counted the wrong items. The judges were not involved. Each file carries a `rerun_note`.
- 10 judge replies had a one-line preamble before a complete JSON object; none needed a follow-up.
- Identity leaks: 0. Reviewer-addressed text: 0.

## 6. Cost

| Brief | no-skill: $ / minutes per run | suite-0.8.1: $ / minutes per run | $ ratio |
|---|---|---|---|
| 01-ops-console-zh | 1.76 / 7.7 | 3.55 / 14.1 | 2.0 |
| 02-devtool-landing-en | 1.54 / 7.1 | 3.54 / 18.4 | 2.3 |
| 03-ios-consumer-screen | 1.64 / 7.7 | 3.46 / 12.1 | 2.1 |
| 04-miniprogram-list-zh | 0.98 / 4.6 | 3.16 / 13.1 | 3.2 |
| 05-agent-approvals | 1.36 / 5.9 | 2.29 / 9.6 | 1.7 |
| 06-redesign-legacy | 2.05 / 9.9 | 2.99 / 18.6 | 1.5 |
| **All** | **1.55 / 7.2** | **3.17 / 14.3** | **2.0** |

- Tokens per run (input including cache reads and writes / output): no-skill 0.99 M / 41 k, suite-0.8.1 3.44 M / 65 k. 17 of 18 suite runs spawned one subagent (the fresh critic); the one that did not is 05 s2, the lost set. No no-skill run spawned any.
- Against round 1's 0.8.0 ($3.62, 11.8 minutes per run on one sample per cell): dollars fell by about 12%, wall time rose. The reading-path and fix-loop changes of 0.8.1 cut spend less than the transcript analysis projected; the suite is still twice the price of no skill.
- Judge and rationale-check sessions were not metered.

## 7. Caveats

- **Judges are models, and the same model as the designers** (claude-opus-5-5 for both). A model may prefer work that follows conventions it also follows. No human looked at these pairs as a judge.
- **Three samples per cell, six briefs.** Samples of one brief are not independent observations of "design tasks in general"; the unit of the claim rule is the brief, and there are six.
- **The briefs were written in this repository** by the same project that wrote the suite, before 0.8.0's text existed but with knowledge of what the suite values (states, real content, platform fit). The 0.8.1 changes were derived from round 1's losses on these same briefs. They are general rules (measure the fold, text partner for colour, decision first, touch minimums), but this round re-tests them on the briefs that motivated them. A held-out brief set is the missing control.
- **no-skill sample 1 is round 1's output**, produced a day earlier under the same harness and model; samples 2 and 3 are new. All were rendered and judged in this round.
- **Isolation was not perfectly clean**, as in round 1: `--safe-mode` still lists the host's bundled skills to every arm. The bundled `dataviz` skill was invoked by five no-skill runs (01 s1-s3, 03 s1-s2) and by no suite run. If it had an effect, it helped no-skill.
- **The harness is software and had a bug.** It was found because a number looked wrong next to a picture. Facts are checked by a self-test now, but a judge who is told a false fact will use it; the facts sheet deserves the same suspicion as the designs.
- **Scale compression**: see the headline. Means understate differences that pairwise judgments show consistently.

## 8. What changes because of this round

Losses and open defects first. By the lab's own rule, an observation becomes a skill rule only after two independent occurrences; single occurrences go to proposals.

1. **When a risk is flagged, the safe choice is the primary action (05 s2, first occurrence).** Logged in `feedback/proposals.md`, not yet a rule.
2. **Dense grids (06 s1 and 06 s2: a cramped cell, a panel ordered against the task; two occurrences).** Proposed for the next patch in `data-dense-ui.md`: when a cell carries more than two encodings (code, colour bar, status), drop one or give the cell more room; order a task panel by the task's steps.
3. **Contradicted rationale claims: 10 vs 5.** The close-out re-check added in 0.8.1 halved the rate per run but did not reach no-skill's level. Proposed: the re-check runs as a script over NOTES.md (positions and colours against the final render), not as an instruction.
4. **Cost is still 2.0x.** The reading path is not the lever that was hoped for. Next step: measure the 0.8.1 transcripts the same way as round 1's and cut what the fix loop re-reads. Do not cut the fresh critic to save money without testing it: the only suite run that skipped it is the only set the suite lost. That is one observation, so the test is an ablation arm (suite without critic) in round 3, not a rule.
5. **Keep, with evidence.** The 0.8.1 rules aimed at round 1's losses held: measured first viewport and shown mechanism (02: 0.8.0 lost this pair 0-3 on votes in round 1; 0.8.1 won all three sets, 8 votes to 1), decision first (05: two of three samples), text partner for kept colours (06: every suite sample kept type as text and all three sets were won), touch minimums (03: 0 targets under 44 pt against 8 for no-skill), measured contrast (1 node below AA in 18 runs against 20). Fit and Identity are where the suite earns its cost.

Changes to the eval itself, for round 3 (this round stays under the rules it ran with):

- **Re-anchor the scale before the next round, in writing, before any run**: worked examples at 2, 3, 4 and 5 per dimension, and half-points allowed, so that the mean can move. The claim rule's 0.5 margin is then re-stated for the new scale and registered in `judging.md` before the round.
- **A held-out brief set** written by someone who has not read the skills, and at least one human judge on two briefs.
- **Judges from another model family**, if one is available to the host.
- **Facts are opened next to the frame they describe** before they go to judges: every reported failure is looked at once.
- **Meter the judge sessions**, so a round's full cost is known.
