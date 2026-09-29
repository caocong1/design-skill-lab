---
date: 2026-09-29
skill: design-studio
project: zh-personal-media-web
type: bug
severity: minor
---

## What happened

`scripts/capture.mjs --full` on the options board at 390 wide produced a PNG of 780 x 17524 device
pixels whose lower part repeats the top of the page instead of showing the last sections. The run
reported `ok`. The cause looks like the browser's limit on screenshot height at DPR 2. I checked
the lower sections with hash states at the viewport size instead.

## Expected / suggestion

Warn, lower the DPR or split the capture when page height x DPR passes the limit, and list the trap in
`references/process/render-and-look.md` section 3.
