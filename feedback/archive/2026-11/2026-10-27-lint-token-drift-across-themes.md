---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: bug
severity: nit
---

## What happened

`scripts/lint.mjs` `token-drift` grouped `#eeeeee ~ #ebebeb` as near-duplicates. One is the light theme's table-head background and the other is the dark theme's text colour, so they never meet. Both critics marked it as a false positive.

## Expected / suggestion

Compare near-duplicate values within each theme's runs (light with light, dark with dark), or at least within one role (background with background).
