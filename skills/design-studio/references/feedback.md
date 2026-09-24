# Feedback: Log What Hurts, Keep Working

Every skill in this suite is iteratively improved from real usage. Two
moments produce entries:

1. **During the work** - log friction when it happens, after the current step
   finishes, not instead of it. Useful, but easy to forget mid-task.
2. **At close-out - required.** Before the final message of a round (the
   step that writes `decisions.md`, or the last reply of a `piece`), run the
   retro below. This is the step that must not be skipped: a round that used
   the suite and logged nothing loses its lessons.

## Close-out retro

Answer three questions from memory of this round:

1. Where did the user correct, override or redirect a choice you made?
2. Where did you deviate from, work around, or quietly ignore a skill's
   guidance because it did not fit? A deviation you justified in
   `decisions.md` is still an entry: the skill did not cover the case.
3. Where was a skill silent, wrong, slow to follow, or pointing at something
   that failed (a path, a command, a tool)?

Each "yes" is one entry. Then end the final message with one line:
`Skill feedback: N entries -> <lab>/feedback/inbox/` or
`Skill feedback: none`. The line keeps the step visible to the user.

## When to log

Log an entry whenever one of these happens:

- **correction** - the user corrected or overrode your output ("不是这个风格",
  "这个平台不是这么导航的").
- **bug** - the skill told you to do something that was wrong or broke: dead
  reference path, a command that fails, advice that produced a bad result.
- **friction** - you had to guess, re-read, retry, or do work the skill should
  have made unnecessary (ambiguous instruction, missing example, two rules
  that conflict).
- **missing** - you needed guidance the suite does not have (a platform, a
  pattern, a state, a tool).
- **preference** - the user expressed a taste the skill should learn
  ("我们团队不用渐变").

A deliberate deviation from a skill's guidance is logged as `missing` (the
skill lacked the case) or `friction` (the guidance was too costly here).

Do not log: one-off facts about the host project, praise, or things you fixed
locally in a second. When in doubt, log it - triage is the lab's job.

## Where to write

Resolve the lab root from this file's real location. It works whether the
user pointed you at the lab by path ("用 ~/Workspace/design-skill-lab 做…")
or the skills are symlinked into `~/.claude/skills` / `~/.codex/skills`:

```sh
LAB=$(cd "$(dirname "$(readlink -f "<path to any SKILL.md you loaded>")")/.." && pwd)
# inbox: $LAB/feedback/inbox/
```

- If that resolves, write one file per event to `feedback/inbox/` in the lab:
  `YYYY-MM-DD-<short-slug>.md` (append `-2`, `-3` on collision).
- If the skill files are copies (no symlink, lab not found), write the same
  file to `.design/skill-feedback/` in the host project instead, and mention
  once to the user that feedback is parked locally for import.

Writing into the lab's `feedback/inbox/` from a host project is expected,
even though it is outside the host repository. Never edit the lab's skills
from a host project. Log, don't fix.

## Entry format

Keep the header exact; the body is free text, Chinese or English. Two or
three sentences beat an essay.

```markdown
---
date: YYYY-MM-DD
skill: design-product-ui   # directory name of the skill in use
project: my-app            # host project directory name, nothing more
type: friction             # correction | bug | friction | missing | preference
severity: major            # blocker | major | minor | nit
---

## What happened

One or two sentences: what you tried, what went wrong or felt wrong.

## Expected / suggestion

What should have happened; a concrete fix if you see one. Optional.
```

Rules:

- One event per file. Log immediately, then return to the task.
- Severity is about the *user's* cost: blocker = task failed; major = visible
  rework or wrong deliverable; minor = extra steps; nit = polish.
- No secrets, no absolute paths beyond the project directory name, no client
  data. The inbox is committed to a public repo.

## What happens next

`scripts/collect-feedback.py` aggregates the inbox into `feedback/report.md`.
The `evolve` mode of `iterate-design-lab` triages entries, applies small
fixes directly and queues structural changes in `feedback/proposals.md`.
Processed entries move to `feedback/archive/`.
