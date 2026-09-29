---
date: 2026-09-29
skill: design-studio
project: zh-personal-media-web
type: missing
severity: minor
---

## What happened

The brief declared two web targets (1280 and 390). `references/process/directions.md` section 6 asks
each direction for `.screen` frames in a `frame.html` that renders on its own and is linted at the
frame sizes, but says nothing about how a file with two frames of different sizes is captured or how
`lint.mjs --above-fold` (checked per viewport at scroll 0) reaches the second frame. I invented a
`?frame=desktop|phone` switch and wrote it into every packet. `templates/options-board.html` also
assumes one `.screen` per direction: the frame-size label, the full-width toggle and the thumbnail
strip had to be rewritten for two frames per direction.

## Expected / suggestion

Add the frame switch to the packet in directions.md section 6, and a two-frame variant (desktop and
phone side by side, thumbnails grouped by frame kind) to the options board template.
