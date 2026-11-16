---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: friction
severity: minor
---

## What happened

In `implement` mode (`references/process/handoff.md` section 1) no handoff package is required, but
the acceptance critic brief (`critique-design/templates/critic-brief.md`) reads
`handoff/<feature>/README.md` and `handoff.json`. A minimal README and a shot index had to be written
just to brief the critic.

## Expected / suggestion

Give implement mode a minimal acceptance index template (pairs of design shot and build shot, the
contracts, the build stamp) and point the critic brief at it.
