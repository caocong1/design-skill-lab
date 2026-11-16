---
date: 2026-11-01
skill: critique-design
project: zh-macos-native-app
type: friction
severity: minor
---

## What happened

Round 2 of an acceptance re-checked 37 findings and also received ten states captured for the first
time from the build (no drawing). The skill allows "at most three regressions" in round 2 but says
nothing about states round 1 never saw. A P1 sat in one of those new states; it went in as one of the
three, and smaller issues went to a "below the bar" list.

## Expected / suggestion

Say how round 2 treats states first captured in that round: a fresh pass with its own cap, or inside
the three. Name the "below the bar" list as allowed, or forbid it.
