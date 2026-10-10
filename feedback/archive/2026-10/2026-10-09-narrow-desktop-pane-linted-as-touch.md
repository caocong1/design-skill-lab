---
date: 2026-10-09
skill: design-studio
project: zh-desktop-egui-and-web
type: friction
severity: minor
---

## What happened

A desktop app's 320-wide side drawer was drawn as its own frame. capture.mjs and lint.mjs emulate every
width under 600 as a phone, so lint reported 44 px touch-target failures for a mouse-only desktop pane,
and the fresh critic counted them against the floor.

## Expected / suggestion

A `--pointer fine` (or `--desktop`) flag for narrow viewports, or a routes.json field, so a narrow desktop
pane is captured and linted with a mouse pointer.
