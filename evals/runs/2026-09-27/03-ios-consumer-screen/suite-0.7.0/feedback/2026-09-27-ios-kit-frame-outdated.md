---
date: 2026-09-27
skill: design-product-ui
project: suite-0.7.0
type: friction
severity: minor
---

## What happened

The mockup kit's iOS frame is 393 x 852 with a 54 pt status bar, is always wrapped in a bezel, and draws the status icons as crude clip-path blocks. The brief targeted iPhone 17 Pro (402 x 874, 62 pt top inset) edge to edge, so I wrote my own frame: status bar, Dynamic Island and home indicator.

## Expected / suggestion

Add a bezel-less `data-frame="bare"` option and a 402 x 874 / 62 pt iPhone 17 Pro preset. Give the kit SVG status icons, and an iOS 26 floating tab bar with Search as a separate circle.
