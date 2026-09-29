---
date: 2026-09-29
skill: design-studio
project: zh-media-web
type: friction
severity: minor
---

## What happened
references/process/system.md section 5 says to scope families on attributes "so a picker can preview any family live on any element". That holds for colour tokens (custom properties inherit from the nearest scope), but a family's structural variant rules (`[data-family="screen"] .strip .item:not(.soon) { display: none }`) match any ancestor, so a nested preview of another family also picks up the page family's structural rules. Live previews in the theme picker were abandoned for small SVG drawings coloured by the card's own tokens.

## Expected / suggestion
Say that live nested previews work for tokens only; structural variant points need `@scope ([data-family=x]) to ([data-family])`, an iframe, or a static preview.
