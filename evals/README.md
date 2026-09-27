# Evals

这里是 Design Skill Lab 的评测。核心问题只有一个：装上这套 skill，agent 做出来的设计是不是真的更好？做法是用六个固定的设计任务（brief），让同一个模型在三种条件下各做一遍：不装任何 skill、装 0.7.0、装 0.8.0。然后由看不到来源的评审只凭 brief 和统一渲染出来的 PNG 打分，并两两比较。对比度、点击区域这类能测量的东西由编排方算好，作为事实交给评审。另有触发评测（`triggers.jsonl`），检查 skill 描述能不能把请求路由到对的 skill。每一轮的结果都公开，输了也照样写出来。

The rest of this file is in English: what the output eval measures, how to run a round with subagents, where results
go, what it costs, and the honesty rule. The judging rules live in [judging.md](judging.md), the result format in
[results.schema.json](results.schema.json), the canonical renderer in [render.mjs](render.mjs) and the measured-facts
tool in [tools/facts.mjs](tools/facts.mjs) (both share [tools/page.mjs](tools/page.mjs)). The trigger eval has its own
file, [run_triggers.md](run_triggers.md).

## What the output eval measures

- **Design quality on six fixed briefs**, judged blind from canonical renders: Fit, Hierarchy, Identity, Craft,
  Typography (including CJK) and Platform / Accessibility, 1-5 each, from three judges with different lenses, plus a
  pairwise preference with a one-line reason.
- **Measured facts**: required files present, render errors, text contrast, target sizes, horizontal overflow.
- **Honesty of the rationale**: claims an arm makes about its design, checked against its render.
- **Cost**: wall time, tokens and dollars per run.

## What it does not measure

- Whether a skill triggers from a user's words (that is the trigger eval, below).
- Implementation: no code is built or reviewed, only HTML mockups rendered to PNG.
- Working with a real user: nobody answers questions during a run, so any step where a suite would ask the user to
  choose becomes the agent's own choice.
- Motion, interaction, and viewport sizes other than those in each brief.
- Process files (plans, boards, specs, design-system files). They are kept in the run folder but never judged.
- Variety across runs of the same brief, unless the round uses three or more samples per cell (see Cost).
- Whether real users do better with the result.

## The briefs

| Brief | What | Target |
|---|---|---|
| [01-ops-console-zh](briefs/01-ops-console-zh.md) | 设备运维工单列表 + 详情 + 空 / 加载 / 出错状态 | desktop 1440, Chinese |
| [02-devtool-landing-en](briefs/02-devtool-landing-en.md) | landing page for a local-first database, no invented social proof | desktop 1440 + mobile 390 |
| [03-ios-consumer-screen](briefs/03-ios-consumer-screen.md) | reading-habit app: Today, book detail, first-run empty state | iOS 26, 402 × 874 |
| [04-miniprogram-list-zh](briefs/04-miniprogram-list-zh.md) | 社区上门服务预约：列表 + 筛选 + 空状态 | WeChat mini-program, 375 |
| [05-agent-approvals](briefs/05-agent-approvals.md) | agent run in an accounting app: progress, approval, error, result | desktop 1440 |
| [06-redesign-legacy](briefs/06-redesign-legacy.md) | redesign of a legacy clinic scheduler ([fixture](briefs/assets/06-legacy/index.html)) + rationale | desktop 1280 × 800 |

Every brief is self-contained: context, audience, all content inline (fictional, and marked so), deliverables with
file names and viewports, constraints (including the same presentation rule: the HTML shows the product only, with
no annotations or notes addressed to reviewers), identical working rules (60 minutes, no questions answered, Node +
Playwright available), what "done" means, and a `render-manifest` block that `render.mjs` and `facts.mjs` read. Briefs
name no skill and use no suite vocabulary.

Below the line `<!-- JUDGE NOTES BELOW ...` each brief carries judge notes. **Design agents never see them**: the
orchestrator cuts the file at that line.

Briefs are frozen once a round has used them. A changed brief gets a new name (`01-ops-console-zh-v2`), and results
across versions are not compared.

## Arms

| Arm | What the design agent gets |
|---|---|
| `no-skill` | the brief only |
| `suite-0.7.0` | the brief + the 0.7.0 design skills, read from a copy of `skills/` at commit `05b1244` (without `iterate-design-lab`, the lab's maintainer skill) |
| `suite-0.8.0` | the brief + the 0.8.0 skills (`design-studio`, `critique-design`, `implement-design`) at the commit under test |

Everything else is identical: model, host and version, tools (Node, Playwright with Chrome, web access), the 60-minute
limit, the working rules, and isolation (no other skills, plugins, CLAUDE.md or memory visible to any arm).

## Running a round

A round is 6 briefs × 3 arms = 18 design runs, then 18 judge sessions and the rationale checks. `<repo>` is this
repository; `$EVAL_TMP` is a scratch folder **outside** the repository.

### 0. Prepare

```sh
EVAL_TMP=/tmp/dsl-eval-2026-10-01          # anywhere outside the repo
mkdir -p $EVAL_TMP/suites/0.7.0 $EVAL_TMP/suites/0.8.0
git -C <repo> archive 05b1244 skills | tar -x -C $EVAL_TMP/suites/0.7.0 --exclude 'skills/iterate-design-lab'
git -C <repo> archive <commit-under-test> skills | tar -x -C $EVAL_TMP/suites/0.8.0
(cd $EVAL_TMP && npm init -y >/dev/null && npm install playwright@1.59.1)   # same Playwright for every arm
(cd <repo> && npm ci)                  # the harness's own Playwright: render.mjs and facts.mjs resolve it from <repo>
```

Pin the harness too: note the commit of `evals/render.mjs` and `evals/tools/facts.mjs` (judging.md section 4).

### 1. Make one working directory per brief and arm

```sh
W=$EVAL_TMP/work/<brief>/<arm>; mkdir -p $W/out
sed '/^<!-- JUDGE NOTES BELOW/,$d' <repo>/evals/briefs/<brief>.md > $W/BRIEF.md
grep -c 'JUDGE NOTES' $W/BRIEF.md                                  # must print 0
# brief 06 only:
mkdir -p $W/legacy && cp <repo>/evals/briefs/assets/06-legacy/* $W/legacy/
```

### 2. Run the design agents

The three prompts differ only in the first sentence. Replace `<W>` and `<SKILLS>`.

**no-skill**

```
Your working directory is <W>. Read <W>/BRIEF.md and deliver what it asks. Work only inside <W>.
Nobody will answer questions during this run: where you would ask, decide, and write the assumption in
<W>/out/NOTES.md. You have 60 minutes.
```

**suite-0.7.0 and suite-0.8.0**

```
Design skills are installed for this task at <SKILLS>; follow them, starting from the SKILL.md whose description fits
the task. Your working directory is <W>. Read <W>/BRIEF.md and deliver what it asks. Work only inside <W> and <SKILLS>.
Nobody will answer questions during this run: where you would ask, decide, and write the assumption in
<W>/out/NOTES.md. You have 60 minutes.
```

`<SKILLS>` is `$EVAL_TMP/suites/0.7.0/skills` or `$EVAL_TMP/suites/0.8.0/skills`. Start the three arms of one brief at
the same time so they share network and service conditions; stop any run at 60 minutes and take `out/` as it is.

**With subagents** (the usual way). Start the orchestrating session from `$EVAL_TMP` with customisations off
(`claude --safe-mode` in Claude Code 2.1.283 disables CLAUDE.md, installed skills, plugins, hooks and MCP servers) so no
arm inherits them. Before the round, spawn one probe subagent with "List every skill, plugin and instruction file
available to you, then stop." and record its answer in `results.json` (`round.isolation`); it should list none. Then
spawn one design subagent per arm with the prompt above; they may spawn their own subagents, and every arm may.

**Headless** (stronger isolation, one process per run):

```sh
cd $W && timeout 3600 claude -p --safe-mode --model <model> --permission-mode bypassPermissions \
  [--add-dir <SKILLS>] --output-format stream-json --verbose "<prompt>" > ../<arm>.transcript.jsonl
```

`timeout` is GNU coreutils (`gtimeout` on macOS with Homebrew). Use `bypassPermissions` only in these throwaway
directories. If you set `--max-budget-usd`, set the same cap for every arm; a run stopped by the cap is a result, like a
timeout.

**Isolation check** after the runs: search each `no-skill` transcript for `SKILL.md` and `suites/`, and each suite
transcript for the other suite's path. A hit is an isolation breach: rerun that arm (judging.md section 8) and record it.

### 3. Collect

Copy `$W/out` to `evals/runs/<date>/<brief>/<arm>/out/`, and write `run.json` next to it (start, end, wall seconds,
tokens, dollars, subagents spawned, how the run ended). Suite arms may also write feedback entries next to their skills
copy: keep them under `<arm>/feedback/` as evidence; they are eval artefacts, not lab inbox entries.

### 4. Render and measure

```sh
node <repo>/evals/render.mjs <repo>/evals/briefs/<brief>.md runs/<date>/<brief>/<arm>/out runs/<date>/<brief>/<arm>/render
```

This writes the canonical frames and `render.json` (exit code 1 if a file is missing or failed). Then measure the
facts with the same manifest (add `--touch 44` for briefs 03 and 04; judging.md section 4):

```sh
node <repo>/evals/tools/facts.mjs <repo>/evals/briefs/<brief>.md runs/<date>/<brief>/<arm>/out > runs/<date>/<brief>/<arm>/facts.json
```

### 5. Judge

Follow [judging.md](judging.md): random mapping to A/B/C per brief (`runs/<date>/mapping.json`), packets built in
`$EVAL_TMP/judge/<brief>/`, three fresh judge subagents per brief, replies saved verbatim to
`runs/<date>/<brief>/judging/J1.json` etc., then the rationale-vs-render check per arm.

### 6. Aggregate and report

De-anonymise, aggregate (judging.md section 9) into `runs/<date>/results.json`, validate it against
`results.schema.json`, and write `runs/<date>/report.md`:

1. Headline: the claims the claim rule allows, losses and "no clear difference" as prominent as wins.
2. Scoreboard: arm × dimension means, overall, brief wins.
3. Pairwise wins, losses and ties per pair of arms.
4. Per brief: winner or why there is none, means, each judge's pairwise reasons, first frames side by side, facts,
   rationale check, identity leaks.
5. Failures and reruns.
6. Cost per arm.
7. Caveats (judging.md section 11 plus anything specific to the round).
8. What changes in the skills because of this round, losses first.

Then summarise the round in `research/field/evals-<date>.md` (Chinese) and update the eval scoreboard on the suite page
from `results.json`.

## Run folder

```
evals/runs/<date>/
  mapping.json          A/B/C mapping, seeds and pair orders (written before judging)
  results.json          validated against evals/results.schema.json
  report.md
  <brief>/
    <arm>/              no-skill | suite-0.7.0 | suite-0.8.0
      out/              what the agent left in out/: HTML, its own png/, NOTES.md, rationale.md
      render/           canonical frames + render.json
      facts.json        measured facts as given to judges
      rationale-check.json
      run.json          timing, tokens, dollars, how the run ended, reruns
      feedback/         suite arms only, if they wrote any
    judging/
      facts.md          the facts sheet the judges saw
      J1.json  J2.json  J3.json
```

PNGs are not committed (`.gitignore`): the canonical frames are regenerated from `out/` with `render.mjs`, and a first frame per arm is kept as WebP under `docs/assets/showcase/<date>-evals/`. Transcripts can be large. Keep them next to `run.json` when small; otherwise store them outside git and record their
path and sha256 in `run.json`.

## Cost

- Design runs dominate. Suite arms read more instructions and may spawn their own subagents, so they will usually cost
  more than `no-skill`. That is part of the result: report quality next to cost, never quality alone.
- Judge sessions are image-heavy: brief 01 is 5 files × 1-3 frames × 3 arms per judge, and there are three judges.
- One sample per cell (18 design runs) is enough to see direction and failures, not to claim a difference with
  confidence. Before a release claim, or to test whether a suite produces the same design every time, run three or
  more samples per cell and report the spread (how to judge and count them: judging.md section 9).
- To test a new suite version later (0.8.1), keep model, host, harness and briefs unchanged, rerun only that arm, and
  judge it together with the stored outputs of the other two arms so judges always see three.

## Honesty rule

- Publish every round, including losses and embarrassing failures. A brief where no-skill wins is reported in the
  headline, not in a footnote.
- No cherry-picking. Reruns follow judging.md section 8 only. Never re-judge because a result was disappointing; if a
  protocol error is found, re-judge all arms of that brief and record why.
- Do not edit a brief or its judge notes after seeing a round's outputs and then re-score that round.
- The suite's own falsifiability condition applies: if independent judges do not score the suite above no suite, the
  suite is what changes, not the eval. Say so in the CHANGELOG and the README.

## Trigger eval

Routing is measured separately, with a proxy method: [run_triggers.md](run_triggers.md) (what it measures, how to run and
score it), [triggers.jsonl](triggers.jsonl) (the prompts, including near-miss negatives) and `tools/` (listing and scoring
scripts). It compares 0.7.0 and 0.8.0 descriptions; a no-skill arm has no meaning there.
