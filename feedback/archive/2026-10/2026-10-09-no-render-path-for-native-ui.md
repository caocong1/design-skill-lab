---
date: 2026-10-09
skill: implement-design
project: zh-desktop-egui-and-web
type: missing
severity: minor
---

## What happened

The design was built in a native immediate-mode GUI (egui on wgpu). Launching the app for a screenshot
would have joined a live LAN, and the render ladder only covers web pages, so an offscreen render
harness (headless wgpu texture readback to PNG with stubbed services) had to be written from scratch
to compare the build with the mockup.

## Expected / suggestion

A short note in the acceptance guidance for native GUIs: render the component offscreen with stubbed
services (egui: run_ui + egui_wgpu::Renderer into a texture, copy to a buffer, save PNG), or use the
toolkit's snapshot test crate when the project has one.
