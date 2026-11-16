---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: missing
severity: minor
---

## What happened

A command palette was given an opaque background to fix a contrast failure, then a `.shadow` on the
whole stack. Without `.compositingGroup()`, SwiftUI cast every subview's shadow onto that background:
the accent-filled selected row darkened the next row's background to about #E3E3E3, and its 11 pt
status text fell to 3.96–4.35:1. It was only visible by sampling pixels.

## Expected / suggestion

In `references/stacks.md` (SwiftUI): put shadows on the background shape (`.background(shape.fill(c).shadow(...))`)
or call `.compositingGroup()` before `.shadow`; re-measure text next to large fills inside floating panels.
