---
date: 2026-11-01
skill: design-studio
project: zh-macos-native-app
type: friction
severity: major
---

## What happened

The drawn screens used a content brief with 4 location blocks and elided rows, while the build's
demo data (written to show the scale the user asked about) had 8 blocks and every row. The
signature component never met its stress case in the drawings: at the 1280 pt target the build fell
back to a degraded layout, and the fitting rules (minimum block, gaps, giving back columns, shorter
labels) had to be designed during implementation.

## Expected / suggestion

In the screens step, require the stress content from the content brief (largest realistic counts,
longest names, most groups) for at least one frame per target size, and generate mockup content from
the same data set the build uses for its acceptance captures, so the pair compares like with like.
