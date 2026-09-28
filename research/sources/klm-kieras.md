# Keystroke-Level Model (Card, Moran and Newell), as taught by David Kieras
- id: klm-kieras · url: https://www.cs.umd.edu/~golbeck/INST631/KSM.pdf · fetched: 2026-09-28 · method: fetch
- review_by: 2027-09-28 (durable +365d) · licence note: paraphrased digest, not a mirror (© David Kieras 1993, course copy)
> 中文导语：KLM（击键层模型）是 HCI 里最老也最实用的效率估算法：把一个任务写成一串基本动作（按键、指点、手在键鼠之间移动、想一下、等系统），每个动作查一个标准时间，加起来就是熟练用户完成任务的估计时间。它不需要原型，只要设计说清楚"怎么操作"就能比较两个方案谁更快。这里读的是 KLM 研究者之一 David Kieras 写的教学版本（基于 Card、Moran、Newell 1980 / 1983），原论文在 ACM 付费墙后没读。

Read on 2026-09-28: David Kieras, "Using the Keystroke-Level Model to Estimate Execution Times" (University of Michigan, 1993), the
whole text (PDF, converted with pdftotext). The primary paper, Card, Moran and Newell, "The keystroke-level model for user performance time
with interactive systems", CACM 23(7), 1980, pp. 396-410 (doi 10.1145/358886.358895), was **not** read; the operator times below are
Kieras's statement of them.

## Key facts
1. **Method** (§ The Method): choose representative task scenarios; specify the design far enough to list keystroke-level actions; take the
   best (or assumed) way to do the task; list physical operators; add waits; insert mental operators; look up and add the times. No
   implementation or mock-up is required.
2. **Operators and times** (§ Operators and Times): **K** keystroke 0.12-1.2 s, **0.28 s** recommended for typical users (Shift and Ctrl
   count as separate keystrokes); **T(n)** typing a chunk = n x K; **P** point with the mouse **1.1 s** average (0.8-1.5 s, Fitts's law
   when precision matters); **B** button press or release 0.1 s, **BB** click 0.2 s; **H** home hands between keyboard and mouse **0.4 s**;
   **M** routine mental act (find something, decide, recall a chunk, verify) **1.2 s** (range 0.6-1.35 s; Card et al. used 1.35 s);
   **W(t)** waiting on the system, only the part the user cannot overlap.
3. **Where an M goes** (§ Specific Suggestions): initiating a task; a strategy decision among non-obvious alternatives; retrieving a chunk
   from memory (a file or command name); finding something on screen whose place is not known from practice; thinking of a task parameter;
   verifying an entry before confirming. Pointing at an object is preceded by an M to locate it. Placing Ms is "the hardest part".
4. **Use** (introduction and examples): KLM predicts error-free expert execution time; it is for comparing designs on the same scenario.
   A wait that is equal across designs can be left out because it changes absolute, not relative, times.
5. **Worked example** (Example 1): deleting a file by dragging to the trash versus a menu command, compared scenario by scenario; the menu
   wins when the trash is covered by a window. The lesson is scenario-specific comparison, not a universal winner.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: the task-cost budget writes each top job as an operator string (M, P, BB, K,
  H, W) with Kieras's times, before and after, per direction or per redesign; M is counted from fact 3, which makes "fewer decisions" and
  "no hunting" visible in the number.
- skills/design-studio/templates/surface-contract.md: a Task cost block per Operate surface.
- skills/critique-design/references/heuristics.md: section 2 recomputes the string from the shots instead of trusting the author's count.

## Not verified / open
- The original paper's touch and gesture operators do not exist (1980); touch KLM extensions (e.g. tap, swipe, zoom operators) were not
  read. For touch, the suite counts taps as P + BB-equivalent and states it as an approximation.
- KLM ignores learning, errors and fatigue; a design that is faster for experts can be slower for first-time users (use the novice path
  and the expert path separately).
