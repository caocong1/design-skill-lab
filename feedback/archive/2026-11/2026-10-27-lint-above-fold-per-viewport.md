---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: friction
severity: minor
---

## What happened

Surface contracts declare above-the-fold selectors per viewport (here the diagram must be above the fold at 1440 and 1280 but not at 390). `scripts/lint.mjs --above-fold` applies one selector list to every viewport in the run, so the page needed two lint runs with different lists.

## Expected / suggestion

Accept a per-viewport form, e.g. `--above-fold '1280x800=h1, .map; 390x844=h1'`, matching how the contract template writes it.
