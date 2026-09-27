<!-- Template: copy the structure, not the values. Save as .design/handoff/<feature>/README.md.
     Write for an implementer who never saw the conversation: short, measurable, no adjectives.
     handoff.json carries the same screens, shots, assets and motion in machine-readable form; keep
     both in the same change. The opening quote and the Build plan follow design-studio
     references/process/handoff.md sections 5 and 6. Delete these comments. -->

# <Feature>: design handoff

> Build <feature> in <repo> from `.design/handoff/<feature>/`. Read README.md top to bottom, then
> follow its Build plan step by step. Run every Verify command and compare with the expected output.
> Stop and ask at any STOP condition. Done means every Accept check passes on re-captured
> screenshots.

## Scope

- Covered: <screens and flows>
- Targets: <platform + logical size each, e.g. iOS 402 x 874; web 1280 and 390>
- Themes: <light, dark, high contrast>
- Not covered: <...>
- Surface contracts: <links to .design/surfaces/*.md>

## Screens

| Screen | States drawn | Targets | Themes | Mockup |
| --- | --- | --- | --- | --- |
| <screen> | <default, empty-first, no-results, loading, error> | <ios, web-lg, web-sm> | <light, dark> | <mockups/screen.html> |

Shots: `shots/<screen>-<state>-<target>-<theme>.png`. A shot is the visual target, never an asset to
slice or embed.

## Structure

<Per screen, the component tree in plain words: Scaffold > TopBar, ScrollRegion > Summary (2 x Stat),
List (n x Row), FloatingToolbar > PrimaryButton. Which region scrolls, what is pinned, what floats
over content. Mark each part SYSTEM (use the platform's own component) or CUSTOM.>

## Tokens

<Link tokens.css / tokens.json / tokens.resolver.json. List tokens this feature adds. Units:
1 px in a mockup = 1 pt / dp / vp; 2 rpx in a 375-wide mini-program.>

## Components

<Per custom component: purpose, anatomy, variants, states (default, pressed, focus-visible, disabled,
loading, selected, invalid), sizes and spacing as token names, truncation and wrapping, minimum
target size, accessible name.>

## Behaviour

<Navigation in and out, gestures and their alternatives, keyboard and focus order, validation timing,
empty and error handling, loading, refresh, pagination, offline, rotation, wide windows, large text.>

## Content

<Final strings, number / date / unit formats, plurals, length limits, localisation, mixed-script rules.>

## Motion

| Element | Trigger | Properties | From > to | Token or spring | Interruptible | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| <sheet> | <tap row> | <translate, opacity> | <...> | <motion.spatial-default: dampingRatio 0.9, stiffness 700> | <yes> | <fade 120 ms> |

## Assets

| Asset | File | Format / scales | Source | Licence |
| --- | --- | --- | --- | --- |
| <icon set> | <assets/icons/> | <SVG, currentColor> | <library or drawn here; model + prompt if generated> | <MIT, OFL...> |

## Platform notes

<Per target: conventions to honour (back behaviour, safe areas, capsule keep-out zone, system fonts,
system materials) and what the design knowingly leaves to the platform.>

## Acceptance

- Compare builds against the shots at the same logical size, theme, state and content.
- Tolerances: spacing within one scale step, exact tokens, fonts as specified.
- Not visible in a still: target sizes, focus order and visibility, screen-reader names, contrast,
  text scaling, reduced motion. Say how each is checked.
- Every visible asset is checked in its slot, at its call site and at its rendered size.
- Stop and ask when reality contradicts the spec (a missing API, a system component that cannot be
  styled as drawn): record the answer in Open questions, do not improvise.

## Open questions and known compromises

- <question or compromise> - owner: <who>

## Build plan

<Written for an executor that never saw the conversation: inline every fact, never point at the
chat. Each step names its files and ends in checks with their expected output.>

- Thesis: <one sentence>
- Host styling and component library: <e.g. CSS modules + the kit in src/ui/>
- Imitate: <three existing screens, by path>
- Tokens land in: <path>
- Commands: build `<cmd>` - test `<cmd>` - serve `<cmd>` at <http://localhost:port/path>

### Step 1: <Tokens>

Do: <what to build, per README > Tokens / Components > name; all values from tokens>
Files: <path (new)>, <path>
Verify: `<command>` -> <exit 0 | no output | the file listed>
Accept: <capture screen, states, target, themes; regions A, B match shots/<screen>-<state>-<target>-<theme>.png>
STOP if: <the fact that would contradict the spec>

### Step <n>: Checks a still cannot show

Verify: <target sizes, focus order and visibility, screen-reader names, contrast, text scaling,
reduced motion: one command or manual step each, with the expected result>
