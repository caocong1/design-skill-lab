# Vercel Web Interface Guidelines

> Source: https://vercel.com/design/guidelines and https://github.com/vercel-labs/web-interface-guidelines (README.md, MIT) ｜ Publisher: Vercel ｜ Published: living document, undated ｜ Fetched: 2026-09-21 ｜ Method: curl of the repository README
> This file is a **paraphrased structured digest**, not a verbatim copy. Read the original for exact wording.

## Summary

A living, non-exhaustive list of the small decisions that make web interfaces feel right, mostly framework-agnostic, with some React/Next.js notes. The repository ships an `AGENTS.md` and a review skill so coding agents can apply and audit the rules. A final section is explicitly Vercel-specific (copywriting preferences) and is not meant as universal guidance.

## Key rules / claims

**Interactions**
1. Every flow is keyboard-operable and follows the WAI-ARIA Authoring Practices patterns; focus is managed (trap, move, return).
2. Every focusable element has a visible, unobscured focus ring; prefer `:focus-visible`, use `:focus-within` for grouped controls; sticky chrome never covers the focused element.
3. Hit target matches the visual target, except that visuals under 24 px get a hit area of at least 24 px; on mobile the minimum is 44 px.
4. Mobile `<input>` font-size is at least 16 px to stop iOS Safari zooming on focus. Never disable browser zoom. Never block paste.
5. Loading buttons keep their label and add an indicator. Spinners and skeletons get a show-delay of roughly 150-300 ms and a minimum visible time of roughly 300-500 ms, so fast responses do not flicker.
6. State lives in the URL (filters, tabs, pagination, expanded panels) so share, refresh and back/forward work; scroll position is restored on back/forward.
7. Optimistic updates when success is likely; on failure show the error and roll back or offer Undo. Destructive actions need confirmation or an Undo window.
8. An ellipsis ends menu items that open a follow-up ("Rename…") and in-progress states ("Saving…").
9. `touch-action: manipulation` on controls; tap highlight set deliberately; `overscroll-behavior: contain` in modals and drawers.
10. The first tooltip in a group is delayed; subsequent peers appear without delay.
11. Autofocus the single primary input on desktop; rarely on mobile (the keyboard shifts layout).
12. No dead zones: if it looks interactive, it is. Generous hit targets, predictable behaviour.
13. While dragging, disable text selection and make the rest `inert`. Every gesture has a click/tap and keyboard alternative unless essential.
14. Navigation uses real links (`<a>`), never buttons or divs. Async updates are announced with a polite `aria-live`. Keyboard shortcuts are locale-aware and show platform symbols.

**Animations**
15. Honour `prefers-reduced-motion` with a reduced variant.
16. Prefer CSS, then the Web Animations API, then JavaScript libraries.
17. Animate compositor-friendly properties (`transform`, `opacity`); avoid `width`, `height`, `top`, `left`.
18. Animate only to clarify cause and effect or for deliberate delight. Easing fits what changes (size, distance, trigger). Animations are interruptible by input.
19. No autoplay beyond muted, non-essential loops; motion longer than 5 s alongside content needs pause/stop/hide.
20. Set the correct `transform-origin`. Never `transition: all`. For SVG, transform a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.

**Layout**
21. Optical alignment beats geometry (adjust by about 1 px). Every element aligns with something on purpose.
22. Balance text and icon weight in lockups. Verify mobile, laptop and ultra-wide (zoom to 50% to simulate). Respect safe areas. Remove accidental scrollbars (test with scroll bars always visible). Let flex/grid size things instead of JavaScript measurement.

**Content**
23. Inline help before tooltips. Skeletons mirror the final layout. `<title>` reflects context. No dead ends. Design empty, sparse, dense and error states.
24. Curly quotes, the real ellipsis character, no widows/orphans, `tabular-nums` for comparisons, non-breaking spaces between number and unit and inside shortcuts and product names.
25. Status never relies on colour alone; icons have text equivalents; icon-only buttons have `aria-label`; native semantics before ARIA; hierarchical headings and a skip link; `scroll-margin-top` on anchored headings.
26. Layouts survive short, average and very long user content. Formats are locale-aware; language comes from `Accept-Language` / `navigator.languages`, never from IP. Wrap brand and code strings in `translate="no"`.

**Forms**
27. Enter submits a single-field form; in a textarea Cmd/Ctrl+Enter submits. Every control has a label, and clicking it focuses the control.
28. Keep submit enabled until submission starts, then disable, show a spinner and use an idempotency key. Do not pre-disable submit; let validation speak. Do not block keystrokes; accept input and validate.
29. Errors sit next to their fields; on submit focus the first error. Set `autocomplete`, meaningful `name`, correct `type` and `inputmode`; disable spellcheck for emails, codes and usernames.
30. Placeholders are examples ending with an ellipsis, not labels. Warn about unsaved changes. Stay compatible with password managers and pasted one-time codes; trim trailing whitespace from inputs.

**Performance**
31. Test iOS Low Power Mode and macOS Safari; profile with CPU and network throttling. Mutations (`POST/PATCH/DELETE`) complete in under 500 ms. Virtualise large lists. Preload only above-the-fold images; set explicit image dimensions; preconnect to asset origins; preload and subset fonts; move long tasks to workers; prefer `<video>` over GIF.

**Design**
32. Shadows have at least two layers (ambient + direct). Combine borders and shadows; semi-transparent borders sharpen edges. Nested radii are concentric (child radius <= parent).
33. On tinted backgrounds, tint borders, shadows and text toward the same hue. Charts use colour-blind-friendly palettes. Interaction states increase contrast. The guideline prefers APCA over WCAG 2 for perceptual accuracy.
34. Set `theme-color` to the page background and `color-scheme: dark` on `<html>` in dark themes. Animate a wrapper rather than text nodes to avoid anti-aliasing shifts. Avoid gradient banding from CSS masks.

## What is perishable vs durable

Durable: focus, targets, labelling, states, URL-as-state, optimistic UI, compositor-only animation, concentric radii, layered shadows. Perishable: specific library mentions (nuqs, virtua, React Scan), Safari workarounds, the APCA recommendation (APCA is still draft guidance, not a legal standard), and the Vercel-specific copy rules (Title Case, ampersands).

## Notes for the skill

This is the best available checklist for `critique-design` web reviews and `implement-design` polish passes. The loading-state timing rule (delay 150-300 ms, minimum 300-500 ms) and the 24 px / 44 px target rule are directly reusable. Report WCAG 2 ratios alongside APCA rather than replacing them.
