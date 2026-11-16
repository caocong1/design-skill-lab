---
date: 2026-11-01
skill: design-studio
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

The product shows device status for many customers' networks, of which only one is reachable at a
time. The brief, contracts and drawings handled "last known vs live" only after the first build, and
missed entirely what happens when the open project's network is unreachable: every probe fails and
every device would turn red. The fresh critic found it (a P1); the fix was a rule plus a new state.

## Expected / suggestion

In `references/disciplines/product-ui.md`, under states: for any status that comes from probing or
syncing, require the contract to say how fresh each number is (live, last known with its age,
never), and to draw "the source is unreachable" as its own state that is never rendered as an
outage. Add it to the state matrix next to loading / empty / error.
