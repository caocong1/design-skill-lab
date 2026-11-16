---
date: 2026-11-01
skill: critique-design
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

Accepting a native macOS build from window captures taken in the background: every window was
inactive, so selection, prominent buttons and focus never rendered in their real colours. Round 1
treated that greying as a platform difference and moved on; round 2 found, by sampling the inactive
selection fill and reading the cell code, that custom status and muted text colours never adapt to the
selection (3.7–4.3:1 on the grey fill, about 1.1:1 on an accent fill). A P1 on the most-used row slipped
a whole round.

## Expected / suggestion

In SKILL.md › Accepting a build (and "Checks a still cannot show"): for native targets, sample text on
the system selection fill in the captures, check that custom colours read the platform's selection
state (SwiftUI `backgroundProminence`, emphasized NSTableView rows), and require one active-window
capture per theme for selection, the primary action and focus before `ship`.
