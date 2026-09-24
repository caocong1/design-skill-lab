---
date: 2026-09-24
skill: design-studio
project: ai-assistant-web
type: friction
severity: minor
---

## What happened

On a re-capture after fixes, the local-build argument was left off, so the "after" set actually showed the deployed old build. Only the file sizes looked off, and it was caught before anyone looked at the images. The "same environment" rule in render-and-look covers before versus after, but it does not cover a mix-up between two after runs.

## Expected / suggestion

In the capture checklist, require a per-shot marker that proves which build rendered it (a version string, asset hash, or DOM data attribute), and check it before looking at the images.
