---
date: 2026-09-29
skill: design-studio
project: zh-media-web
type: bug
severity: minor
---

## What happened
lint.mjs at 390 with a fixed bottom tab bar reported "measured" contrast failures of about 1.0:1 for text whose computed ratio was 10-17:1 (tickets, segmented buttons). The sampled background was the tab bar's own background, i.e. the text sat under the fixed bar at the measured scroll position. Both the author and the fresh critic had to rule these out by hand across six theme combinations.

## Expected / suggestion
When the text box intersects a fixed or sticky opaque element, scroll it clear before sampling, or report the finding as occluded rather than as a contrast failure.
