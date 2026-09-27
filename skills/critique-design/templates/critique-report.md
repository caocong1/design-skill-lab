<!-- Template: copy the structure, not the values. Save as .design/critique/<date>-<target>/report.md,
     with one crop per finding beside it (NN-<slug>.png, committed). Write in the user's language:
     each heading is given as 中文 / English, keep one. Omit sections that do not apply (round 2 only).
     Build acceptance uses design-studio's templates/acceptance-report.md instead. Delete these comments. -->

# 设计评审 / Critique: <target>, <YYYY-MM-DD>

Method: <fresh subagent | single-context (reason)> · Mode: <review | fresh | self-check | redesign-brief> ·
Round: <1 | 2> of 2
Judged against: <.design/brief.md, surfaces/<surface>.md | inferred design read, stated below>
Evidence: <manifest or capture log; sizes x themes x states captured; build stamp>
Baseline: <last report on this target, or none>

## 结论 / Verdict

**Disposition: <ship | fix | rebuild | recapture>.** <Two or three sentences: overall judgement, the
three biggest problems, what must be kept.>

## 评分 / Scores

Floor: <pass | fail: F2, F5 | not verified: F4 (no tool)>

<!-- Round 2, or with a baseline: write the change, e.g. 3 > 4. -->

| 维度 / Dimension | 分 / Score | 依据 / Evidence |
| --- | --- | --- |
| Fit | <3> | <01-first-viewport.png: the queue count reads first; "calm, not sleepy" not visible> |
| Hierarchy | <> | <> |
| Identity | <> | <> |
| Craft | <> | <> |
| Typography | <> | <> |
| Accessibility | <> | <> |

Gate: <holds | misses: Identity 3 < 4; P1 open (D2)>

## 问题明细 / Findings

Ordered by severity, then leverage. Basis: `verified` · `needs confirmation` (say what would confirm) · `human-required`.

| # | 位置 / Where | 现状 / Before | 改为 / After | 原因 / Why | Sev | Basis | Effort · Type | Crop |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | <Queue > header, 1280> | <three equal-weight filled buttons> | <one filled "Assign"; "Export" and "Archive" as text buttons> | <a first-timer cannot tell the next step (Hick)> | <P1> | <verified> | <S · quick win> | <01-header.png> |

## 人物走查 / Persona red flags

- <First-timer 首次使用者>: <what broke, naming the element>
- <AT user 读屏/键盘用户>: <...>

## 说到做到 / Rationale against render

| Contract block or claim | Shot and region | Verdict |
| --- | --- | --- |
| <Finish line: overdue count readable at arm's length> | <02-queue-1280.png, top left> | <kept / partial / missing> |

## 机械证据 / Mechanical evidence

<lint.mjs: n findings, of which m not in Track A; k false positives (why). Contrast: the failing
pairs with ratios. Capture: exit code, walls or blanks. Tools not run, and why.>

## 修复计划 / Fix plan

- 立即可做 / Quick wins: <D1, D3>
- 系统性 / Systemic (tokens or components, once): <D4>
- 结构性 / Structural (to design-studio `redesign`): <D7, with the equity to keep>

## 复查 / Round-2 re-check

| Finding | Resolved / partial / unresolved | Re-captured shot |
| --- | --- | --- |
| <D1> | <resolved> | <01-header-r2.png> |

Regressions (at most three): <...>

## 保留 / Keep

- <what works and must survive the fixes>

## 未检查 / Not checked

- <area, and why: no tool, not captured, needs a person>

## 已排除 / Rejected candidates

- <candidate: why it is not a finding (false positive, by design per the brief, out of scope)>

## 待确认 / Questions

<At most three, only ones whose answer changes the fix plan. None is a valid answer.>
