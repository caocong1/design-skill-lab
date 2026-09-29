---
date: 2026-09-29
skill: design-studio
project: zh-media-web
type: missing
severity: major
---

## What happened
Capturing a running app (references/process/render-and-look.md section 4) executed page scripts that write state: the player page saved playback position on pagehide, so each capture round overwrote the sample data the next round was judged on. The fresh critic found the resulting data-loss bug only because its own captures and lint runs changed the API output between rounds.

## Expected / suggestion
Section 4 could add a trap: captures and lint runs of a live app run its scripts (autosave, progress, analytics, "last seen"), so use a disposable dataset, reset it before each round, and diff the relevant API output before and after a capture round; a change is either a bug to report or a capture side effect to disclose.
