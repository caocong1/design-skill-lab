---
date: 2026-09-27
skill: design-product-ui
project: suite-0.7.0
type: missing
severity: minor
---

## What happened

platforms.md says "do not imitate Liquid Glass with custom blur", and the anti-patterns forbid a re-drawn native tab bar. A static mockup still has to show the glass tab bar and toolbar buttons, and the brief asks for AA contrast of text over translucent surfaces. I had to invent the approach: an approximate CSS blur, a scroll-edge fade, and a note that the system draws the material.

## Expected / suggestion

Add a short recipe for depicting system materials in stills: an approximate fill, the scroll-edge effect, and how to state and verify worst-case contrast of labels over glass.
