---
name: implement-design
description: Land a design in a real codebase with fidelity - inspect the host stack and its existing tokens, components and conventions; map design tokens onto the project's theming mechanism; build pages and components in the host framework (React, Vue, Next, Nuxt, Tailwind, Ant Design, Element Plus, Flutter, SwiftUI, Compose, ArkUI, mini-programs, Electron, Tauri); verify with a render-compare-fix loop and visual regression tests. This is the implementer's companion to the design suite, which hands designs over through handoff-design. Use when the user wants a design implemented, a screenshot or mock-up turned into code, UI polish in an existing project, pixel-level restoration, or 设计稿还原、切图、标注、前端实现、UI 落地.
metadata:
  version: 0.2.3
  short-description: Design to code with visual verification
---

# Implement Design

This skill is for the **implementer** - the coding agent or developer who
receives a design (ideally a package from `../handoff-design/SKILL.md`) and
builds it. It is separate from designing: the design suite can do its whole
job for any target without this file. A clean HTML/CSS mockup with tokens is
already a description that can be translated into any front-end; what follows
makes that translation faithful.

The implementer's discipline: respect the host, express everything through
tokens, and prove fidelity by looking.

Stack-specific mapping and gotchas: `references/stacks.md` - an optimisation
for better translations, not a prerequisite. Concept mapping from the mockup
to native toolkits: `../design-studio/references/portable-mockups.md`.

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
- Layout traps that a correct mockup will not show you:
  - `overflow-x: auto` forces the other axis to `auto`. The horizontal bar
    covers the last row of a map, table or SVG. Pad for it, or set
    `overflow-y: hidden`.
  - `position: sticky` inside an `overflow` ancestor sticks to that ancestor.
    A sticky table header then covers the first row.
  - Opacity on a row also fades a `::before` track drawn on that row. Fade
    the content, not the line.
  - Replacing the whole view (a direction switch, a route change) scrolls
    the window, and any scroller you keep, back to the start. A view that
    only sets `overflow: hidden` does not clear `scrollY`.
- Match the platform: system font stacks and native controls where the brief
  says native-feeling; safe areas and notches; pointer vs touch targets;
  desktop window chrome and drag regions; mini-program capsule area.

## 4. Verify by Looking

Producing screenshots of the build is the implementer's responsibility, with
whatever the stack offers: a browser, a simulator or device, golden or
snapshot tests, a preview tool. Then:

1. Run the app or the component preview.
2. Capture the same logical size, theme, state and content as the acceptance
   shots in the handoff.
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

## 6. Translating a Mockup into a Non-Web Stack

1. Read the handoff spec's structure section, then the mockup's markup: the
   flex rows and columns, `data-component` and `data-state` names are the
   widget tree and its variants.
2. Map tokens first (theme, resources), then build components by name, then
   compose screens. Units carry over one-to-one (1 px = 1 pt / dp / vp /
   logical pixel; 2 rpx in a 375-wide mini-program).
3. Where the spec says "system component", use the platform's own navigation
   bar, tab bar, sheet, picker or switch instead of rebuilding the drawing.
4. When an effect has no cheap native equivalent, use the fallback named in
   the handoff, or ask for one; do not improvise a look.
5. Report back **spec gaps** you had to guess at - they are defects of the
   handoff, and the designer should fix them at the source.

Writing the handoff itself is the designer's job: `../handoff-design/SKILL.md`.

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
baseline when the project has the tooling; a short list of deviations, spec
gaps, unverified areas and follow-ups.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Before the final message of the round, run that file's close-out
retro and end with its `Skill feedback:` line - the retro is part of done.
Log, don't fix: skills are edited only inside the lab.
