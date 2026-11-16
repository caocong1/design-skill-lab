---
date: 2026-10-23
skill: design-studio
project: zh-architecture-doc-html
type: missing
severity: minor
---

## What happened

The directions in this round were long scrolling documents whose main differentiator was figure motion (draw-in, payloads on paths, split-flap flips, scroll-driven assembly). templates/options-board.html only supports scaled static frames of one screen, and references/process/directions.md §7–10 only asks for PNGs. Static frames could not show the motion the user asked to compare, so I recorded per-direction clips with Playwright `recordVideo` + ffmpeg (scroll to the figure, optional click, or a scripted scroll for scroll-driven pages), added poster frames, and linked each live frame page instead of pasting markup.

## Expected / suggestion

A board variant for motion-led or long-scroll directions: an article with a cover still, one or two short clips with posters (autoplay only in view, never under reduced motion), and a link to the live frame; plus a small `record.mjs` beside capture.mjs (enter / click / scrub modes, trims the load, writes H.264).
