---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

Two SwiftUI `Table` behaviours cost rework and one crash. Toggling column visibility from layout code
(to fit a width) made the table stretch columns and scroll sideways; only static defaults set in the
initializer worked. Calling `ScrollViewReader.scrollTo` from `onChange` in the same update that
replaced the table (switching to an empty list) crashed with an AttributeGraph precondition failure;
deferring it to a `.task(id:)` fixed it.

## Expected / suggestion

In `references/stacks.md` (SwiftUI): set `TableColumnCustomization` defaults once in `init`; make
default ideal widths sum below the narrowest supported width; never scroll or mutate table state
inside the update that changes its rows; prefer `.task(id:)` keyed on selection and sort.
