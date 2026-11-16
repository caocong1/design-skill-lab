---
date: 2026-11-02
skill: design-studio
project: zh-desktop-ops-tool
type: friction
severity: nit
---

## What happened

templates/options-board.html and references/process/directions.md section 7 ask to paste each
direction's scoped styles and markup into its own article. For desktop directions with three
1440 x 900 frames each (60–85 KB of HTML per direction), the board used the captured PNGs with links
to each live frame.html instead, which kept the board light and the frames exact.

## Expected / suggestion

Allow "captures + links to the live frames" for multi-frame desktop directions, and keep the
greyscale strip generated from the same captures.
