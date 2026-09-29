---
date: 2026-09-29
skill: design-studio
project: zh-personal-media-web
type: friction
severity: minor
---

## What happened

A direction mockup held two frames, desktop 1280x800 and phone 390x844, each reachable by a query
state. `scripts/capture.mjs` crosses every state with every viewport, so pairing each frame with its
own size took one run per frame, and the second run replaced the first run's `capture-report.json`
in the same folder. Three direction subagents and the board assembly all hit this; each kept manual
copies of the reports or used one output folder per run.

## Expected / suggestion

Let a route in `routes.json` name its own viewports, or let a run append to an existing report in
the output folder. `references/process/render-and-look.md` section 2 could say which to use.
