---
name: handoff-design
description: Package a finished design so that any implementer - a coding agent or a developer, in any stack (web frameworks, Flutter, SwiftUI, Compose, HarmonyOS ArkUI, mini-programs, Electron, Tauri, native desktop) - can build it faithfully without guessing. Produces acceptance screenshots at the target's logical size, portable HTML/CSS mockups, platform-neutral tokens, a measured spec with every state, the asset list, the motion spec, platform notes and acceptance criteria; then reviews the implementation against them from screenshots alone. Use when a design needs to be handed to development, when the target is not the web, or when the user asks for 设计稿交付、标注、切图、设计规格、给开发的设计说明、验收标准.
metadata:
  version: 0.1.1
  short-description: Design package a coding agent can build from
---

# Handoff Design

The designer decides, draws and specifies. The implementer builds in the
target stack and proves the build. This skill is the contract between the two.
It deliberately knows nothing about how the target stack is coded: a clean
HTML/CSS mockup plus tokens and a spec is a description any coding agent can
translate (`../design-studio/references/portable-mockups.md`).

## What the Implementer Receives

```text
.design/handoff/<feature>/
  README.md            the spec (template below)
  shots/               acceptance images: <screen>-<state>-<target>-<theme>.png
  mockups/             the portable HTML/CSS source of every shot
  tokens.css           the design's tokens (tokens.json as well when several platforms consume them)
  assets/              SVG icons and marks, raster at the needed scales, fonts or where to license them
  motion.md            spec table + a runnable demo page, when anything moves
```

The **shots are the acceptance reference**: one PNG per screen, state, target
and theme, rendered at the target's logical size with the mockup kit
(`../design-product-ui/assets/mockup-kit/kit.css`). The mockups are there so
the implementer can read structure, tokens and exact values instead of
measuring pixels.

## Before Packaging

1. The design passed its own critique (`../critique-design/SKILL.md`).
2. Every state in the state matrix that applies is drawn, not described
   (`../design-product-ui/SKILL.md`).
3. Mockups follow the portable subset: flex layout, tokens for every value,
   named components and states, bars outside the scroll region, real content.
4. Each target has its own frame and its own composition; conventions of the
   platform are honoured (`../design-product-ui/references/platforms.md`).
5. Shots were rendered and looked at
   (`../design-studio/references/render-and-look.md`).

## The Spec (`README.md`)

Write for a reader who has never seen the conversation. Short, measurable,
no adjectives.

```markdown
# <Feature> - design handoff

## Scope
Screens and flows covered, targets (platform + logical size), themes. What is NOT covered.

## Screens
| Screen | States drawn | Shots | Mockup |
| --- | --- | --- | --- |

## Structure
Per screen: the component tree in plain words (Scaffold > AppBar, ScrollRegion > Summary(2 x Stat),
DeviceList(n x DeviceRow), StickyFooter > PrimaryButton). Which region scrolls; what is pinned.
Which parts are SYSTEM components (use the platform's own) and which are custom.

## Tokens
Table of tokens used, with values per theme. New tokens this feature introduces.
Unit note: 1 px in the mockup = 1 pt / dp / vp / logical pixel; 2 rpx in a 375-wide mini-program.

## Components
Per component: purpose, anatomy, variants, states (default, pressed, focused, disabled, loading,
selected, invalid...), sizes and spacing in token names, truncation and wrapping rules,
minimum target size, accessible name.

## Behaviour
Navigation in and out, gestures and their alternatives, what is tappable, keyboard and focus order
where relevant, validation timing, error and empty handling, loading strategy, refresh, pagination,
offline. What happens at other sizes: rotation, tablet or wide window, large text setting.

## Content
Final copy per string, formats for numbers / dates / units, pluralisation and length limits,
localisation notes, mixed-script rules.

## Motion
Link to motion.md: element, trigger, properties, from -> to, duration and easing or spring tokens,
interruptibility, reduced-motion behaviour.

## Assets
| Asset | File | Format / scales | Source and licence |

## Platform Notes
Per target: conventions that must be honoured (back behaviour, safe areas, capsule keep-out zone,
system fonts, status-bar style), and anything the design knowingly leaves to the platform.
Effects that may need a fallback on this target.

## Acceptance
The shots to compare against, the sizes and themes to check, tolerances (spacing within 1 unit,
exact tokens, fonts as specified), and the checks that are not visible in a still:
target sizes, focus and screen-reader names, contrast values, text scaling, reduced motion.

## Open Questions and Known Compromises
```

## Rules

- **Draw it, do not describe it.** If a state matters, it has a shot.
- **Name things once.** Component, state and token names in the spec, the
  mockup and the shots' filenames are the same words.
- **Say what is system and what is custom.** Handing over a re-drawn native tab
  bar invites someone to build it.
- **Values are tokens.** A raw number in the spec is either a missing token or
  an exception with a reason.
- **One source of truth.** When the design changes, regenerate the shots and
  update the spec in the same change; stale shots are worse than none.
- **Leave the how to the implementer.** Specify the result and the constraints.
  Offer stack-specific advice only when asked, or point to
  `../implement-design/SKILL.md`.
- **Licences travel with assets.** Fonts and icons the target cannot legally
  ship are replaced before handoff, not after.

## Accepting the Build

Acceptance needs screenshots of the implementation and nothing else; how they
were produced (simulator, device, golden test, a screenshot pasted by the
user) is the implementer's business.

1. Ask for shots at the same logical size, theme, state and content as the
   acceptance references. Mismatched content makes comparison meaningless.
2. Compare side by side with `../critique-design/SKILL.md` in `qa` mode:
   structure and spacing, type (face, size, weight, line height), colour
   tokens, radii / borders / shadows, icons and images, each state, behaviour
   at the other sizes.
3. Report deviations as `expected -> actual` with the screen and component
   name. Separate three kinds: **build bug** (implementation differs from a
   clear spec), **spec gap** (the handoff did not say - fix the handoff), and
   **platform difference** (system component or font renders differently -
   usually accept).
4. Re-check after fixes. Record accepted compromises in the spec.

## Anti-Patterns

- A link to a prototype and the word "pixel-perfect" instead of a spec.
- Only the happy path; states "to be defined during development".
- Redlines in raw pixels beside a token system nobody referenced.
- iOS shots handed to an Android or HarmonyOS build as the reference.
- Custom drawings of system chrome, presented as components to build.
- Prescribing widgets, libraries or file structure to the implementer.
- Accepting a build from a description ("it matches") instead of screenshots.

## Deliverables

The handoff folder above, complete for every target in scope; and after the
build, an acceptance report with deviations classified and the final list of
accepted compromises.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Log, don't fix: skills are edited only inside the lab.
