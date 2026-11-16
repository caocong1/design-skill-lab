---
date: 2026-10-26
skill: design-studio
project: zh-architecture-doc-html
type: missing
severity: minor
---

## What happened

A bolder re-roll produced a direction whose two key figures were 3D scenes written in WebGPU, with a 2D SVG fallback. The skill gave no guidance for verifying or reviewing such a frame, so I worked it out:

- **Headless verification.** On macOS, Playwright's Chrome headless exposes hardware WebGPU (Apple, Metal 3) on `file://` pages. `about:blank` is not a secure context, so `navigator.gpu` is absent there and a probe on it falsely reports "no WebGPU". `page.screenshot` and `recordVideo` both capture the WebGPU canvas with default flags. Capture had to wait on a page-set ready flag (`html[data-ready]`) after adapter and pipeline creation, not just on load.
- **Sharing.** The board was shared over plain http on a LAN IP. That is not a secure context, so every colleague got the 2D fallback, and the page wrongly said their browser lacked WebGPU. Fixed by adding an https port (self-signed certificate) and making the fallback note name the real cause, with a "download this page" link (a downloaded file opens as `file://` and gets WebGPU).
- **Recording.** I needed scripted interactions: scroll, wait past transient on-scroll UI, click a camera preset, drag to orbit.
- **Review find.** The cover's orbit camera had no way home. A long drag left the model under the headline, and the cover has no preset buttons. Fixed with a spring back to the composed view on release.

## Expected / suggestion

A short section for 3D / WebGPU frames, in references/disciplines/motion.md or the render-and-look reference. Cover:
- **Verify on the right origin:** `file://`, https or localhost, never `about:blank`. Test the URL people will actually open: a LAN http address hides WebGPU entirely.
- **Honest fallback note:** check `isSecureContext` before blaming the browser.
- **Wait on a ready flag** set after the GPU pipelines exist.
- **Freeze from engine time:** `?t` must drive the engine's own clock, because capture's `animations: 'disabled'` does not touch rAF rendering.
- **Review check:** every user-orbitable camera needs a way back (spring back or a reset preset).
- **Measure the cost:** frame time and triangle count, with a 2D fallback that is complete rather than a placeholder.

The casebook's software-WebGPU `destroyed` trap could link from there.
