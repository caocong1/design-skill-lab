# Feedback: Log What Hurts, Keep Working

Every skill in this suite is iteratively improved from real usage. While you
work in a host project, log friction the moment it happens - cheaply, without
breaking flow. Logging takes under a minute; do it *after* the current step
finishes, not instead of it.

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

Do not log: one-off facts about the host project, praise, or things you fixed
locally in a second. When in doubt, log it - triage is the lab's job.

## Where to write

Resolve the lab root from this file's real location (skills are usually
symlinked into `~/.claude/skills` / `~/.codex/skills`):

```sh
LAB=$(cd "$(dirname "$(readlink -f "<path to any SKILL.md you loaded>")")/.." && pwd)
# inbox: $LAB/feedback/inbox/
```

- If that resolves, write one file per event to `feedback/inbox/` in the lab:
  `YYYY-MM-DD-<short-slug>.md` (append `-2`, `-3` on collision).
- If the skill files are copies (no symlink, lab not found), write the same
  file to `.design/skill-feedback/` in the host project instead, and mention
  once to the user that feedback is parked locally for import.

Never edit the lab's skills from a host project. Log, don't fix.

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
