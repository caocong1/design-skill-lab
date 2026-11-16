---
date: 2026-11-06
skill: implement-design
project: zh-macos-utility
type: missing
severity: minor
---

## What happened

The native verification guidance gives still-image and simulator options, but no macOS recipe for
sampling real SwiftUI transitions in normal and reduced modes. A native host and preview policy
were needed; accessibilityReduceMotion is read-only in EnvironmentValues, so direct environment
injection could not provide the reduced test configuration.

## Expected / suggestion

Add a macOS NSHostingView / NSWindow frame-sampling example and a system-following, injectable
motion-policy pattern for previews. Explain that requested sleep intervals exclude screenshot
overhead and cannot establish exact durations or frame rates; distinguish explanatory HTML frames,
native intermediate frames, and actual keyboard interaction evidence.
