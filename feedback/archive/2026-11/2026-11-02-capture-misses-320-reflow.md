---
date: 2026-11-02
skill: design-studio
project: zh-docs-static-site
type: friction
severity: major
---

## What happened

The author's floor passed at the declared 1280 and 390 (lint and captures), but the fresh critic captured 320 on its own and failed F3: three of seven pages scrolled sideways (a `max-content` grid column and an unbreakable identifier string). Rubric F3 requires reading content to reflow at 320, and `fundamentals/layout-and-spacing.md` mentions 320, but the capture minimum in `references/process/render-and-look.md` section 2 (web: 390, 768, 1280, 1920) and the surface-contract template do not, so the gap surfaced only at critique and cost a fix round.

## Expected / suggestion

Add a 320 reflow frame to the web capture minimum for Read and Operate surfaces (desktop pointer, `--no-touch`), and a one-line overflow sweep over every page of a multi-page site before the critic runs.
