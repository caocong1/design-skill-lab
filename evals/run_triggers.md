# Trigger eval — proxy method

## 中文摘要

- **测什么：** 只给模型“已安装 skill 的名字 + 描述”和一句用户请求，看它会选哪个 skill（或不选）。它衡量的是**描述之间能不能分清**，以及“不该触发时能不能不触发”。
- **不测什么：** 宿主（Claude Code、Codex）里的真实触发率。真实宿主还能看到上下文、文件和其他 skill，而且常常干脆不调用 skill；代理方法是强制选择，所以会**高估触发率、看不到漏触发**。引用数字时必须注明“代理方法”。
- **怎么跑：** 0.7.0 和 0.8.0 两组，每组 3 轮，每轮用 `tools/descriptions.py --shuffle <轮次>` 生成列表，每条请求在一个全新上下文里判一次。结果写成 `{"id","run","answer"}`，用 `tools/score_triggers.py` 打分。
- **看哪几个数：** 角色视图准确率（两组可比，是主指标）、各类 precision/recall、混淆矩阵、误触发率（不该触发时触发了）、漏触发率，以及已知冲突行（`"collision": true`：整体 UI 优化、切图/标注、“怎么改更好看” 对 “哪里不好看”、“按这个设计稿实现”、前端 bug 修复等）的多数票结果，脚本会单独列表。
- **注意：** 0.8.0 的描述是在这套题已经存在之后、在同一个仓库里写的，可能受过它影响，所以 0.8.0 的分数只能当上限看；要声称“路由变好了”，先按下文补一套盲写的留出集（held-out）。
- **无 skill 基线：** 触发评测里没有意义（什么都没装，答案永远是 none）。`none` 行本身就是误触发的对照组。

## What this measures, and what it does not

The host decides whether to load a skill from its name and description. The proxy keeps only that input: a fresh model gets
the list of installed skills (name + description, read from each `SKILL.md` frontmatter) and one user message, then names the
skill it would load, or `none`.

It measures **whether the descriptions are distinguishable**: which skill wins when one is chosen, and whether "none" wins when
no skill fits. It does **not** measure host triggering. The differences, in order of how much they matter:

1. **Forced choice versus propensity.** Host models often just answer without loading any skill, especially for short or simple
   requests. The proxy is asked to choose, so it overstates trigger rates, and under-triggering does not show up at all.
2. **No context.** The proxy sees no conversation, working directory, files, CLAUDE.md or AGENTS.md. A host would also see, for
   example, that the Figma link sits next to an existing handoff folder.
3. **Competing skills.** Real hosts list other installed skills (frontend, dataviz, pptx, ...). The proxy lists only the arm's
   skills unless you pass extra directories to `descriptions.py`. Answers that name a skill outside the arm are scored as `none`
   and reported as "foreign".
4. **Listing format and limits.** Hosts may shorten long descriptions (Claude Code documents a 1536-character cap on
   description + `when_to_use`). `descriptions.py` warns past that limit but does not truncate. Codex and other hosts select
   skills by their own rules.
5. **Model-specific.** Results hold only for the model and date recorded. Rerun when the model changes.
6. **Single turn.** Routing drift over a multi-turn session is not covered.
7. **Regression set, not a tuning set.** Scores become optimistic if descriptions are tuned against these rows. To tune a
   description, write a separate set and choose the description by its held-out score (the skill-creator method: 60/40 split,
   3 runs per query).

Always report results as "trigger eval (proxy)". Never call them trigger rates.

## The set: `triggers.jsonl`

One JSON object per line:

| field | meaning |
| --- | --- |
| `id` | `t001` ... (`h001` ... in a held-out set); ids are permanent: never renumber, only append (results files reference them) |
| `prompt` | what a user might actually type: short, messy, mixed zh/en, file paths, URLs |
| `lang` | `zh` or `en` (primary language of a mixed prompt) |
| `expect` | the 0.8.0 skill that should load: `design-studio`, `critique-design`, `implement-design`, or `none` |
| `expect_07` | the 0.7.0 skill whose description owns the intent, or `none` |
| `kind` | `positive`, `near-miss` or `negative`, relative to `expect` (below) |
| `note` | why the label is what it is; collision rows cite the audit |
| `collision` | optional, `true` on rows that test a description collision found by the skills audit (§3.2); scored normally, and also reported as their own slice and table |
| `ambiguous` | optional, `true` on rows whose label is genuinely arguable; reported with their answers, left out of every metric |

**Kinds.** `positive`: the request plainly belongs to `expect`. `near-miss`: the surface points at a different outcome than
`expect`. Either design or UI words appear where no design skill should load (bugs, CSS refactors, copywriting, notebook charts,
"design" in the engineering sense), or the wording belongs to a skill that does not own the job (the known collisions).
`negative`: `expect` is `none` and the request has little overlap with design (git, tests, infrastructure). Negatives are the
control for blanket over-triggering.

**Labelling rules (0.8.0 roles).**
- `design-studio`: every design intent. That covers new designs, alternatives to choose from, inspiration and references,
  product UI, marketing pages, systems and themes, motion, icons, brand, graphics, redesign (including whole-product "UI
  optimisation / polish"), and designer handoff (切图, 标注, specs for developers). It also covers "design and then build" when
  no design exists yet.
- `critique-design`: review, audit or acceptance of something that exists, where the output is a report (including checking a
  build against its design).
- `implement-design`: a design, mockup, Figma frame or handoff already exists, and the ask is to build it, or to fix the code
  until it matches.
- `none`: engineering work (bugs, performance, CSS refactors with no visual change, one-line property edits), content only
  (copy, outlines), data analysis charts, non-visual "design" (schemas, system design, design patterns), and lab maintenance.
  In 0.8.0 the maintainer skill is repo-local and hosts do not auto-invoke it.

**Labelling rules (0.7.0).** `expect_07` names the most specific 0.7.0 skill whose own description claims the intent. It is
`design-studio` where the 0.7.0 router owns the mode itself: full design, redesign and whole-product polish, design-then-build,
and generic colour direction. The validator requires each `expect_07` to map (via `ROLE_07` in `score_triggers.py`) to that
row's `expect`, so the two labels cannot drift apart.

**Known collisions** (skills-core audit §3.2) all have rows, marked `"collision": true`:
- 整体 UI 优化 / whole-app or whole-page "UI polish" goes to `design-studio`, not `implement-design` (t040-t043).
- 切图 / 标注 go to `design-studio` (handoff), not `implement-design` (t044, t045).
- "这个网站怎么改更好看" is the one ambiguous row (t038, reported but not scored): it fits a redesign and a review
  equally. Its unambiguous twins are scored: asking for ideas goes to `design-studio` (t039), "这个页面哪里不好看"
  goes to `critique-design` (t049), and "哪里不好看, then redesign it" goes to `design-studio` (t048).
- A complete design from requirements, which 0.7.0's router and its explore skill both claimed (t001), and design
  followed by build (t047), go to `design-studio`.
- "按这个设计稿实现" goes to `implement-design` (t059).
- Front-end bug fixes, where the 0.7.0 router had no "not for" clause, go to `none` (t073-t075). Pure CSS refactors,
  copy without design and notebook charts also go to `none` (near-miss rows, not tagged).

On collision rows 0.7.0's own descriptions claimed both sides, and the labels follow the 0.8.0 role decisions. A
0.7.0 "error" there is the collision the audit found, not a misreading by the proxy model; say so when reporting, and
compare the arms on the "other rows" slice as well.

**Fairness.**
- The prompts were written without seeing the 0.8.0 descriptions.
- They avoid suite vocabulary: mode names, options board, direction card, function map, surface contract, `.design/` paths.
- Whole trigger phrases from a description ("这个网站怎么改更好看", "这个页面哪里不好看", "设计稿还原") appear only in
  rows that exist to test them. Everyday terms that also occur in descriptions (落地页, 作品集, 小程序, 后台管理,
  设计规范, 加载动画) appear elsewhere because users say them.
- The role view scores both suites on the same four labels, so 0.7.0 is not penalised for having more skills.
- **Provenance caveat.** The reverse direction is not controlled: the 0.8.0 descriptions were written during the same
  overhaul, after this set existed, in a repository where it could be read, and the skills audit recommended tuning
  descriptions with a trigger eval. Several 0.8.0 description phrases sit close to prompts here (静态稿接入项目 and
  t066, 定稿 and t061, "single property edits" and t078). Until a held-out set exists, treat the 0.8.0 score as an
  upper bound and say so in the report. To build one: give a fresh subagent only the labelling rules above and this
  file's kinds (never either suite's descriptions or this set), ask for at least 60 rows with the same shape targets,
  save it as `evals/triggers-holdout.jsonl` with ids `h001`..., and score it with `--triggers`. Once used in a
  round, it is frozen like this set.

Check the set with `python3 evals/tools/score_triggers.py --validate`. It enforces the schema, the label mapping, at least 60
rows, at least 40% near-miss or negative, a zh share between 45% and 65%, at least 8 rows per 0.8.0 label, and at least 2 per
0.7.0 skill. The lab gate can call it as is.

## Arms

| arm | skills directory | expected list |
| --- | --- | --- |
| 0.8.0 | `skills/` at the commit under test | exactly `design-studio`, `critique-design`, `implement-design` |
| 0.7.0 | extracted read-only from commit `05b1244`: `mkdir -p "$S/suite-0.7.0" && git archive 05b1244 skills \| tar -x -C "$S/suite-0.7.0"` (`$S` is a scratch dir), then use `"$S/suite-0.7.0/skills"` | the 14 skills of 0.7.0 |

Check each list before running: `python3 evals/tools/descriptions.py <dir>`. Skills with `disable-model-invocation: true` are
left out, as hosts leave them out. There is no no-skill arm for triggers: with nothing installed, every answer is `none`.

## Procedure

1. For each arm and each run `r` in 1, 2, 3:
   `python3 evals/tools/descriptions.py <dir> --shuffle r > list-<arm>-r<r>.txt`
   Shuffling uses the same seed for both arms, which washes out position bias.
2. For every row, open a **fresh context** (a new subagent or API call with no tools, no repo access and no prior messages).
   Send the template below, filled with that run's list and the row's `prompt`. Take the first line of the reply as the answer.
3. Append `{"id": "<row id>", "run": r, "answer": "<first line>"}` to `evals/runs/<YYYY-MM-DD>/triggers-<arm>.jsonl`. Extra keys
   such as `reason` or `model` are allowed and ignored.
4. Use the same model and sampling settings for both arms (host defaults; the 3 runs measure variability). Record in the run
   report: the model id, the date, the commit of each skills directory, and whether you used the batch variant.
5. Score both arms:
   ```
   python3 evals/tools/score_triggers.py evals/runs/<date>/triggers-0.8.0.jsonl --suite 0.8.0 > evals/runs/<date>/triggers-0.8.0.md
   python3 evals/tools/score_triggers.py evals/runs/<date>/triggers-0.7.0.jsonl --suite 0.7.0 > evals/runs/<date>/triggers-0.7.0.md
   ```
   Add `--json` for a machine-readable summary (for the site scoreboard).

**Template** (send verbatim, filling the two slots):

```
You are the skill selector of an AI coding assistant that works inside the user's software project.
Before it responds, the assistant may load at most one of the installed skills below. It loads a skill
only when that skill's description covers what the user is asking for; otherwise it responds without one.

Installed skills:
{list}

User message:
<message>
{prompt}
</message>

Which skill would the assistant load for this message? Reply with the skill name exactly as listed, or none.
First line: the answer only. Second line (optional): a reason in at most 15 words.
```

**Batch variant (cheaper, weaker).** You may put up to 10 rows in one context, in a shuffled order that differs per run, and ask
for one answer per row. Rows shown together influence each other, so disclose the variant in the report, and never compare a
batched arm with an unbatched one.

## Scoring

`score_triggers.py` prints a Markdown report:

- **Role view (headline, comparable across arms).** 0.8.0 answers are scored as given. 0.7.0 answers are first mapped to the
  0.8.0 skill that now owns their job: `design-studio` and the 10 skills it absorbed (including `handoff-design`) map to `design-studio`,
  `critique-design` and `implement-design` keep their names, and `iterate-design-lab` maps to `none`. The view reports:
  - accuracy over all samples (rows × runs), majority-vote accuracy per row, and the share of rows answered the same way in all
    3 runs (stability);
  - false-trigger rate on `none` rows, miss rate on skill rows, and wrong-skill rate;
  - precision and recall per class, with support;
  - accuracy by `kind` and by `lang`;
  - a 4×4 confusion matrix, and every misrouted row with its answers.
- **Exact view (0.7.0 only).** Scores against `expect_07` over the 14 names, which shows child-level precision. When the router
  (`design-studio`) answers a child's intent, it is counted separately as "router fallback". The 0.7.0 router was designed to
  catch any design request, so those answers are misses of the specific child, not misroutes of the role.

**Answer normalisation.** Case, backticks, quotes, a leading `/` and trailing punctuation are ignored. A plugin prefix
(`design-skill-lab:design-studio`) is stripped. Empty, `none` or `no skill` counts as `none`. A reply that contains exactly one
listed name counts as that name. Anything else is "foreign" and scored as `none`.

**Reading the numbers.**
- The collision rows and the false-trigger rate matter more than overall accuracy. A design skill that loads for "首页加载太慢了，优化一下"
  costs the user more than one lost positive.
- With 100 rows × 3 runs, one row wrong in every run moves accuracy by 1 point. Compare arms row by row, using the misrouted
  lists: which rows 0.8.0 fixes and which it breaks. A small change in overall accuracy is noise.
- Report losses as plainly as wins. The run summary goes to `evals/runs/<date>/report.md` and then to `research/field/`.

## Optional: host spot-check (not yet run)

To see whether the proxy's answers match real behaviour, run a subset (for example, every collision row) through the host
itself. Record the results separately, and never merge them with proxy numbers. A recipe for Claude Code, to verify on your
version first (the flags below exist in 2.1.283):

- Put only the arm's skill folders under `<scratch>/.claude/skills/` in an empty scratch project. Make sure no user-level
  skills or plugins are loaded; check which skills the session lists.
- Run `claude -p "<prompt>" --output-format stream-json --verbose` in that project.
- Look for a `tool_use` named `Skill` and its `skill` input. No such call means "none" for that sample. The host will also
  start doing the task, so run in a throwaway directory.

This measures real propensity, including under-triggering, which the proxy cannot see.
