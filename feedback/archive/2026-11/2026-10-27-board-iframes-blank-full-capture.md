---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: friction
severity: minor
---

## What happened

The options board embedded each direction's `frame.html` through `<iframe>` from `file://`. Full-page captures of the board showed the iframes blank, because Chrome does not paint offscreen `file://` iframes, and `loading="lazy"` made it worse. Working around it took section-by-section captures with hash states.

## Expected / suggestion

Add this trap to `references/process/render-and-look.md` (capture traps) or the casebook, and say in `references/process/directions.md` how to build a board that captures in one shot: static thumbnails from each direction's own shots, with the live iframes kept as links.
