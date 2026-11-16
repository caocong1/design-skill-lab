---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

Building a native macOS (SwiftUI) app, `references/stacks.md` gave no capture recipe for desktop
apps. The working method had to be invented: a debug-only launch argument that seeds demo data and
drives the state (project, selection, sheet, window size, appearance), a side-by-side copy of the app
with its own bundle id and data folder, background launch (`open -g -n`) and window-only capture
(`screencapture -l <window id>`), then an sRGB conversion. Along the way an early full-screen capture
included the user's own screen, and after a crash macOS's "reopen windows?" alert became the only
window, so a whole capture round silently captured the alert instead of the app.

## Expected / suggestion

Add a native-desktop section: never capture the full screen; capture one window by id; launch in the
background with window restoration disabled (`-ApplePersistenceIgnoreState YES`); filter out small
windows (alerts); state that background windows render inactive (greyed toolbar, sidebar, selection,
prominent buttons) so critics should not flag it; convert captures to sRGB before colour checks.
