---
date: 2026-09-24
skill: design-studio
project: ai-assistant-web
type: missing
severity: minor
---

## What happened

Redesigning a logged-in web app: shot.sh cannot authenticate, and the local dev server could not reach the real backend. What worked was Playwright with a saved login state against the deployed environment, plus `context.route` serving the local build's html/assets, so before and after shared the same real data and backend. render-and-look.md does not describe this.

## Expected / suggestion

Add a "logged-in app" rung to the tool ladder in render-and-look.md: save storageState once, then capture the deployed frontend (before) and the same origin with its frontend routed to a local build (after). Also add: stamp each capture with the build it shows (for example, assert a hashed asset name) so an "after" run cannot silently capture the deployed build.
