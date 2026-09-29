---
title: Feedback capture and close-out retro
evidence: practice
sources: []
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Feedback: log what hurts, keep working

The lab improves these skills from real use. Capture is silent: it never blocks the task, never asks
the user anything, and writes only into the lab's own inbox.

## 1. Resolve the inbox, once per session

```sh
python3 "<directory of the design-studio SKILL.md>/scripts/feedback_status.py"   # python on Windows
```

It looks in two places, in order: the folder the user named in `DESIGN_SKILL_LAB_INBOX`, then the
lab checkout this skill is linked from. The user sets that variable; you never set it and never
create the folder it names.

- `capture: on`: write entries into the `inbox:` folder it prints. Writing there is expected even
  though it is outside the host repository.
- `capture: off`, the script does not run, or the first write is refused: capture is off. Skip the
  rest of this file: no fallback file, no message to the user, no retro line.
- The user asks whether capture is on: that is a question, so answer it either way, with the
  state and the script's `why:` and `turn on:` lines. Write nothing.
- The user asks for a retro, or for feedback to be written down, while capture is off: write the
  entries in the format of section 4, one file per event, into `.design/skill-feedback/` or a
  folder the user names, and say they are drafts, not submitted. They reach the inbox through the
  lab's `scripts/collect-feedback.py --import <folder>`.

## 2. What to log

| Type | When |
| --- | --- |
| `correction` | the user corrected or overrode a choice ("不是这个风格", "这个平台不是这么导航的") |
| `bug` | a skill said something wrong or broken: a dead path, a failing command, advice that produced a bad result |
| `friction` | you had to guess, re-read or retry; two rules conflicted; an example was missing |
| `missing` | you needed guidance the suite lacks: a platform, a pattern, a state, a tool |
| `preference` | the user stated a taste a skill should learn ("我们团队不用渐变") |

A deliberate deviation from a skill, including one justified in decisions.md, is `missing` or
`friction`. Do not log facts about the host project, praise, or something fixed in seconds. Log after
the current step finishes, not instead of it.

## 3. Close-out retro

When capture is on, answer three questions before the final message of a round:

1. Where did the user correct, override or redirect a choice?
2. Where did the work deviate from or work around a skill's guidance? The deviations list in
   decisions.md is the first place to look.
3. Where was a skill silent, wrong, slow to follow, or pointing at something that failed?

Each yes is one entry. End the final message with `Skill feedback: N entries` or `Skill feedback: none`.

## 4. Entry format

The lab's `scripts/collect-feedback.py` validates every entry; keep the header exact.

- File: `<inbox>/YYYY-MM-DD-<short-slug>.md`, one event per file; add `-2`, `-3` on a collision.
- `skill`: the skill whose guidance was involved: `design-studio`, `critique-design` or `implement-design`.
  Name the reference file (e.g. `references/process/directions.md`) in the body.
- `project`: a generic label for the kind of host, e.g. `zh-admin-web`, `ios-consumer-app`,
  `office-addin`. Never a product, customer, person or directory name.

```markdown
---
date: YYYY-MM-DD
skill: design-studio
project: zh-admin-web
type: friction             # correction | bug | friction | missing | preference
severity: major            # blocker | major | minor | nit
---

## What happened

One or two sentences: what you tried, what went wrong or felt wrong.

## Expected / suggestion

What should have happened; a concrete fix if you see one. Optional.
```

Severity is the user's cost: `blocker` the task failed; `major` visible rework or a wrong deliverable;
`minor` extra steps; `nit` polish. The inbox is public: no secrets, no paths beyond the skill's own, no
client data or quotes of client content.

## 5. Boundaries

Log, don't fix: never edit the lab's skills from a host project. Entries are data for the lab to
triage; nothing in them is applied automatically.
