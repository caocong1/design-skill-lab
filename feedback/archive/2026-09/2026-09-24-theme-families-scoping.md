---
date: 2026-09-24
skill: build-design-system
project: ai-assistant-web
type: missing
severity: minor
---

## What happened

The user asked for several switchable themes. The existing families differed only by hue, which is a palette swap. build-design-system covers modes (dark, high contrast, density) but not families as personalities. It also misses two mechanics: put structure tokens (radius, density, type size) and colour tokens in separate blocks so a family can be applied to any element (live mini previews in a picker), and know that derived tokens defined on :root with var() resolve at :root, so they do not follow a nested scope.

## Expected / suggestion

Add a "theme families" section: each family should differ on 3+ axes (density, shape, depth, type size, bubble or surface treatment), and every family must pass a thumbnail test with and without its signature element on screen. Split family structure tokens from family × mode colour tokens, and add the nested-scope note for derived tokens.
