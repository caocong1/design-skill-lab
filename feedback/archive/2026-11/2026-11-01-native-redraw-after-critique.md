---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: friction
severity: minor
---

## What happened

Round-1 critiques of a native app produced token, wording and state changes (lamp colours, words
instead of codes, an off-network state, minimum-window re-composition). `references/process/handoff.md`
section 1 lets only browser-rendered builds design a family in the build; for native builds the rule
is to redraw first. Redrawing the HTML mockups for every critique fix would have doubled the round,
so the fixes went into DESIGN.md and the build, and the drawings were declared stale for those parts
(recorded as a deviation).

## Expected / suggestion

Allow a bounded native exception: after a critique round, token, copy and state fixes may land in
the system file and the build, with the re-captured build shots standing in as the reference until
the next design round, provided the fresh critic re-checks them in round 2.
