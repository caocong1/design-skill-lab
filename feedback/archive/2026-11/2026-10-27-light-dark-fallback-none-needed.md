---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: bug
severity: major
---

## What happened

`references/platforms/web.md` (Colour and theming table) lists `light-dark()` with fallback "none needed", although the same row says it only becomes widely available on 2026-11-13. Following it, every colour token was written only as `light-dark()`. The fresh critic simulated an engine without support: custom properties hold the unparsed text, every colour declaration becomes invalid at computed time, and the primary button turned transparent with white text, so it disappeared (P1 in round 1). In-app browsers and iOS 16 and older matter for links shared in chat groups.

## Expected / suggestion

Change the fallback cell to: plain colour values first, dark values in `@media (prefers-color-scheme: dark)`, until the feature is widely available and longer when the audience includes in-app browsers or older iOS. `references/fundamentals/modern-css.md` (the `light-dark()` row) could link to the same caveat.
