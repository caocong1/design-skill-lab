---
name: implement-design
description: Land a design in a real codebase with fidelity - inspect the host stack and its existing tokens, components and conventions; map design tokens onto the project's theming mechanism; build pages and components in the host framework (React, Vue, Next, Nuxt, Tailwind, Ant Design, Element Plus, Flutter, SwiftUI, Compose, ArkUI, mini-programs, Electron, Tauri); verify with a render-compare-fix loop and visual regression tests; or write a developer handoff spec. Use when the user wants a design implemented, a screenshot or mock-up turned into code, UI polish in an existing project, pixel-level restoration, or 设计稿还原、切图、标注、前端实现、UI 落地.
metadata:
  version: 0.1.0
  short-description: Design to code with visual verification
---

# Implement Design

The design is not done until it survives the codebase. The implementer's
discipline: respect the host, express everything through tokens, and prove
fidelity by looking.

Stack-specific mapping and gotchas: `references/stacks.md`.

## 1. Inspect the Host

Before writing a line, establish:

- Framework and version; rendering model (SPA, SSR, native).
- Styling approach: utility CSS, CSS modules, preprocessor, CSS-in-JS, the
  component library's theme API. **Use that approach**; do not introduce a
  second one.
- Existing tokens / theme / variables; breakpoints; dark-mode mechanism;
  density settings.
- Component library and which components already exist; the icon family;
  fonts and how they are loaded; i18n and text direction; image pipeline.
- Conventions: file layout, naming, lint / format rules, Storybook or preview
  tooling, existing visual or golden tests.
- Find three similar existing screens or components and follow their patterns.

Adding a dependency (a motion library, an icon pack, a UI kit) needs a reason
the existing stack cannot satisfy; say it and keep it minimal. Verify any
library API against the **installed version** - do not code from memory of
another major.

## 2. Map Tokens

- Put design tokens where the host keeps them (theme object, CSS variables,
  Tailwind theme, `ThemeData`, asset catalogue). One source of truth; modes
  as re-mappings.
- No raw hex, px, ms or z-index values in components when a token exists. If
  a needed token is missing, add it to the system rather than hard-coding.
- When the design and the existing system disagree, do not silently fork:
  either the design adopts the system's value, or the system changes for
  everyone. Surface the conflict.

## 3. Build Order

tokens -> layout primitives -> components (with all states) -> page
composition -> real data and edge content -> motion -> accessibility pass ->
responsive pass -> visual QA.

- Semantic structure first: headings, landmarks, lists, buttons vs links,
  labels tied to inputs. Accessible names for icon-only controls.
- Keyboard path and `:focus-visible` styles for everything interactive.
- States are code paths: loading, empty, error, disabled, long content. Make
  them reachable (story, fixture, query parameter) so they can be rendered.
- Text must survive: long strings, mixed CJK / Latin, 200% zoom, locale
  formats. Avoid fixed heights on text containers.
- Images: intrinsic size reserved, responsive sources, modern formats, alt
  text; icons as SVG using `currentColor`.
- Motion from the motion tokens, `transform` / `opacity` first, reduced-motion
  handled, nothing blocking input.
- Match the platform: system font stacks and native controls where the brief
  says native-feeling; safe areas and notches; pointer vs touch targets;
  desktop window chrome and drag regions; mini-program capsule area.

## 4. Verify by Looking

Follow `../design-studio/references/render-and-look.md`:

1. Run the app or the component preview.
2. Capture the same viewport, theme and state as the design.
3. Compare side by side (or overlay / pixel-diff). List deviations as
   `expected -> actual`.
4. Fix, re-capture, repeat until remaining differences are intentional and
   documented.
5. Walk the states, dark mode, the narrow and wide breakpoints, keyboard
   navigation, reduced motion, and one screen-reader pass on the primary flow
   when tools allow.

Then make fidelity durable: add or update visual regression coverage in the
project's own tooling (browser screenshot assertions, component snapshot
services, Flutter golden tests). A baseline image is the mechanical gate that
keeps the design from drifting.

When the environment cannot render (no browser, no simulator), say exactly
what was not verified.

## 5. From a Screenshot or Mock-up

When the source is an image rather than a spec:

- Extract the system first (grid, spacing rhythm, type sizes, colour roles,
  radii), map it to the host's tokens, then build. Do not pixel-chase
  arbitrary values: snap to the nearest token and note deliberate snaps.
- Identify fonts rather than guessing; if the face is unavailable or
  unlicensed, choose the closest licensed alternative and say so.
- Ask for (or infer and state) what the image does not show: hover, focus,
  errors, empty states, responsive behaviour, motion.
- Do not reproduce another company's product as-is; see the clone boundary in
  `../find-design-inspiration/SKILL.md`.

## 6. Handoff Spec (when someone else builds)

`.design/handoff/<feature>.md`, concise and measurable:

- Scope and the screens / components covered, with links to prototypes.
- Tokens used, new tokens introduced.
- Layout: grid, breakpoints, per-breakpoint behaviour, spacing between named
  regions.
- Components: variants, states, behaviour, keyboard map, accessible names.
- Content: final copy, truncation rules, formats, localisation notes.
- Assets: export list with formats and scales (SVG; PNG / WebP / AVIF at 1x /
  2x / 3x as needed), source and licence.
- Motion: spec table from `../design-motion/SKILL.md`.
- Acceptance checks: what a reviewer will compare and at which viewports.
- Open questions and known compromises.

## Anti-Patterns

- Restyling with overrides and `!important` on top of a component library
  instead of using its theme API.
- A second styling system, a second icon family, a second date library "just
  for this page".
- Magic numbers; one-off colours; z-index wars.
- Building only the happy path shown in the mock-up.
- Declaring fidelity without a screenshot comparison.
- Refactoring or "improving" unrelated code while implementing a design.
- Shipping trial fonts or unlicensed assets that came with the mock-up.

## Deliverables

Code in the host stack following its conventions; new or updated tokens;
reachable states; before / after or design / build screenshots; visual test
baseline when the project has the tooling; a short list of deviations,
unverified areas and follow-ups - or the handoff spec.
