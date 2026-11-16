---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: bug
severity: minor
---

## What happened

In `scripts/capture.mjs`, a routes file with a relative directory `base` (e.g. `"../../docs/"`) captured the wrong pages. The base goes through `resolve(here, file.base)`, which drops the trailing slash, and route paths then resolve one folder too high. An absolute `file://` base with a trailing slash worked.

## Expected / suggestion

Keep the trailing slash when the local base is a directory, or append one when `statSync` says it is a directory. Also say in `--help` that a directory base needs it.
