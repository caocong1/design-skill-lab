---
name: critique-design
description: Review an existing design or implementation like a senior design lead - website, app screen, component library, brand, deck or graphic - through purpose fit, information architecture, hierarchy, typography, colour and contrast, spacing and consistency, states, interaction and motion, content, accessibility, platform fit and craft; produce an evidence-backed findings table with severity, a prioritised fix plan, and optionally a redesign brief. Also used as the fresh-eye quality gate for the suite's own output and for design QA of a build against its design. 设计评审、走查、UI 审查、体验走查、设计验收、视觉还原检查、这个页面哪里不好看。
metadata:
  version: 0.1.2
  short-description: Evidence-backed design review and QA
---

# Critique Design

Findings lead; praise and summary follow. A critique is useful when every
finding says what is wrong, where, why it matters to the user or the business,
and what to do - with evidence someone else can check.

Rubric: `../design-studio/references/quality-rubric.md`. Look-first protocol:
`../design-studio/references/render-and-look.md`.

## Modes

- `review`: audit an existing product, site, brand or artefact.
- `self-check`: the gate before presenting the suite's own work. Run it from
  a fresh context when the host supports subagents: give the critic only the
  brief and the rendered output, not the author's reasoning.
- `qa`: compare a build against its design or spec.
- `redesign-brief`: turn findings into a brief and direction input.

## 1. Get Eyes on It

Never review from code alone, and never from one screenshot alone.

- Capture the target at its real viewports (for web: about 390, 768, 1280,
  1920), in each theme, and walk the primary task end to end.
- Trigger states: hover, focus (tab through), error, empty, loading, long
  content, zoom to 200%, reduced motion, keyboard-only.
- When a browser tool is available, **measure** instead of guessing: computed
  font sizes and families, colours (then `color_tools.py contrast`), target
  sizes, spacing values in use, number of distinct colours / sizes / radii.
- For code-only access, read tokens, theme and components to explain *why* an
  inconsistency exists; cite `file:line`.

## 2. Establish the Yardstick

State the design read you are judging against: audience, job, brand
attributes, platform, constraints. If there is a brief, use it. Taste without
a yardstick is opinion. Note what the product does well - the fix plan must
not destroy it.

## 3. Assessment Order

Work top-down; upstream problems make downstream polish irrelevant.

1. **Purpose fit**: is it clear what this is, for whom, and what to do next?
   (five-second test on the entry screen).
2. **Structure and flow**: information architecture, navigation model, steps
   in the primary task, dead ends, redundant steps.
3. **Layout and hierarchy**: squint test - what are the first three things
   seen, and are they the right three? One primary action? Grouping by
   proximity? Alignment to a grid? Scanning path?
4. **Typography**: number of families and sizes, scale logic, measure,
   line-height, weight use, numeric alignment, mixed-script handling, widows
   in headings.
5. **Colour and contrast**: role discipline, accent spending, computed
   contrast against the declared level, colour-only meaning, dark mode
   integrity.
6. **Spacing and consistency**: one spacing scale or many? radius, border,
   shadow and icon consistency; component variants that should be one.
7. **Components and states**: the state matrix from
   `../design-product-ui/SKILL.md` - which states are missing or improvised?
8. **Interaction and motion**: feedback latency, affordance, modality,
   undo vs confirm, motion purpose and speed, interruption, reduced motion.
   If the page has several full views, scroll down and switch: the new view
   must start at the top, not in the middle of the previous one. An entrance
   that seems to play twice needs a frame-by-frame look at the animated
   property, not a count of `animationstart`.
9. **Content**: headlines that say something, labels as verbs, error quality,
   empty states, terminology consistency, localisation quality.
10. **Accessibility**: keyboard path and focus visibility, names and roles,
    headings and landmarks, target size, contrast, zoom and reflow, motion
    and flashing, forms and errors, media alternatives. Test against WCAG 2.2
    AA as the default bar and say which checks were automated, manual or not
    performed.
11. **Platform and responsive fit**: native conventions honoured; re-composed
    rather than shrunk; touch vs pointer.
12. **Performance as experience**: load sequence, layout shift, jank during
    interaction, heavy media.
13. **Identity**: is it recognisably *theirs*, or the category's default
    template? Check against `../design-studio/references/anti-slop.md`. Also
    flag the opposite: novelty that hurts usability.
14. **Craft**: optical alignment, icon sizing and baseline, radius nesting,
    image quality and cropping, border and shadow stacking, truncation.
    On a diagram, a glance is not enough: compare each mark's centre to the
    stroke and to the first line of its label. A mark buried in the
    paragraph, or a last row eaten by a scrollbar, is a finding.

Heuristic frames to cross-check: the ten usability heuristics, the core
perception laws (proximity, similarity, common region, Fitts, Hick, Jakob,
Miller, peak-end, aesthetic-usability), and research-backed e-commerce and
form guidance from the catalogue when relevant.

## 4. Severity

| Level | Meaning |
| --- | --- |
| `P0` | Blocks the primary task, excludes users (accessibility failure on a core path), legal exposure (unlicensed assets, fabricated claims), or data-loss risk |
| `P1` | Major comprehension, trust or conversion damage; systemic inconsistency; missing core states |
| `P2` | Noticeable polish and consistency problems; minor usability friction |
| `P3` | Nits and opportunities |

Also tag **effort** (`S` / `M` / `L`) and **type**: `quick win`, `systemic`
(fix in tokens or components once), `structural` (needs redesign).

## 5. Report

Write in the user's language. Be direct and specific; describe the effect on
the user, not the designer's failure. Distinguish evidence ("当前页面显示…",
measured values) from inference ("这可能导致…"). Template (Chinese, the lab
owner's default):

```markdown
## 评审结论
两三句话：整体判断、最大的三个问题、值得保留的部分。

## 评分（0-4）
| 维度 | 分数 | 依据 |
| --- | --- | --- |

## 问题明细
| id | 维度 | 问题 | 级别 | 证据 | 对用户的影响 | 建议 | 改动量 | 类型 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | 层级 | 首屏有三个同等权重的主按钮 | P1 | 截图 01 / `Hero.vue:42` | 用户无法判断下一步 | 保留一个主按钮，其余降为次级/文字按钮 | S | quick win |

## 立即可做
- [ ] D1 …

## 系统性修复（在 token / 组件层一次解决）
- [ ] D4 …

## 需要重新设计
- [ ] D7 … （附方向建议或转 `explore-design-directions`）

## 未检查 / 无法验证
```

## Design QA (`qa`)

1. Put the acceptance shot and a screenshot of the build side by side, at the
   same logical size, theme, state and content. The build screenshot can come
   from anywhere - browser, simulator, device, golden test, or an image the
   user pastes; the stack it was built in does not matter.
2. Compare side by side, then overlay or pixel-diff where tools allow; small
   anti-aliasing differences are noise, offsets and wrong tokens are not.
3. Check in order: layout and spacing, type (family, size, weight,
   line-height, tracking), colour tokens, radii / borders / shadows, icons and
   images, states, responsive behaviour, motion timing and easing, content
   fidelity, accessibility semantics the design implied.
4. Report deviations as `expected -> actual` with the screen and component
   name (and selector or `file:line` when the code is at hand). Classify each:
   **build bug**, **spec gap** (fix the handoff), or **platform difference**
   (a system component or font rendering differently - usually accept).

## Conduct

- Critique the work against the goal, never the person.
- Prefer the smallest change that fixes the problem; recommend redesign only
  when structure is the problem.
- Do not pad. Ten findings that matter beat forty that do not; group repeats
  into one systemic finding.
- If asked for a second opinion on a direction, say clearly which option you
  would ship and why.
- Scores are for tracking before / after, not for grading people. Anchor them
  to the rubric descriptors and show the evidence.

## Deliverables

`.design/critique/<date>-<target>.md` with screenshots referenced, scores,
findings, grouped plan and the list of unchecked areas; for `qa`, the
deviation list; for `redesign-brief`, a brief ready for
`../explore-design-directions/SKILL.md` including the equity to preserve.
