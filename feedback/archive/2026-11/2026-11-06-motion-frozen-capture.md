---
date: 2026-11-06
skill: design-studio
project: zh-macos-utility
type: bug
severity: major
---

## What happened

The frame-freezing workflow in references/disciplines/motion.md suggests using capture.mjs with
moment and time query parameters. Its screenshot call uses animations: disabled, which finishes
the paused transitions: the zero-time and intermediate captures all showed the completed state.

## Expected / suggestion

Provide a frozen-frame capture mode that uses animations: allow and awaits the demo's ready
promise. Keep the existing settled screenshot default for ordinary UI acceptance. A small adapter
using the existing launch, newPage and contactSheet helpers produced distinct paused frames.
