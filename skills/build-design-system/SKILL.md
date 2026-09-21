---
name: build-design-system
description: Build or extend a design system - design tokens (primitive, semantic, component tiers), colour system with light and dark modes, type scale, spacing, radius, elevation and motion tokens, component specifications with anatomy, variants and states, theming of an existing component library, an agent-readable DESIGN.md, a living preview page, and a token-drift audit of an existing codebase. Use when the user wants a complete visual system, a theme, dark mode, brand theming for Ant Design / Element Plus / shadcn / MUI / Flutter, or wants scattered colours and sizes consolidated. 设计系统、设计规范、design token、主题、暗色模式、配色体系、字体层级。
metadata:
  version: 0.1.0
  short-description: Tokens, foundations, components, theming
---

# Build Design System

A design system is the set of decisions made once so they are not re-made
badly on every screen. Build the smallest system that covers the product, and
make it the only way to style things.

Fundamentals: `../design-studio/references/typography.md`,
`../design-studio/references/color.md`,
`../design-studio/references/layout-and-spacing.md`. Token file format:
`references/token-formats.md`.

## Modes

- `create`: a new system from a chosen direction.
- `extend`: add tokens or components to an existing system without breaking
  it.
- `theme`: map a brand onto an existing component library's theming API.
- `derive-mode`: produce dark, high-contrast or density variants.
- `audit`: find token drift in a codebase and propose consolidation.

## Token Architecture

Three tiers; references flow one way.

| Tier | Holds | Example | Who may reference it |
| --- | --- | --- | --- |
| Primitive | raw scales with no meaning | `blue.9`, `gray.3`, `space.4`, `radius.2` | semantic tokens only |
| Semantic | roles | `color.bg.surface`, `color.text.muted`, `color.accent.solid`, `space.inset.md`, `radius.control` | components and layouts |
| Component | exceptions a component needs | `button.radius`, `table.row.height.compact` | that component |

Rules:

- Components never reference primitives. Modes (light, dark, high contrast,
  brand, density) are **re-mappings of the semantic tier**; if dark mode needs
  component edits, the semantic tier is missing a role.
- Name by role, not by value: `color.text.muted`, never `gray-500-text`.
- Create a component token only when a component must deviate from the
  semantic default. Most systems need few.
- Keep scales short. Every extra step is a future inconsistency.
- A token that is used once is a magic number with extra steps.

## Foundations

Decide these in order; each constrains the next.

1. **Type**: families (one or two plus mono), a scale of six to eight sizes on
   a ratio suited to the product (tight for dense UI, wide for marketing),
   line-height and tracking per step, weights (two or three), numeric
   features. Define text **styles** (`display`, `title`, `heading`, `body`,
   `label`, `caption`, `code`), not just sizes. CJK products define the CJK
   stack, line-height and mixed-script rules here.
2. **Space and size**: a 4 px base; a non-linear spacing scale; control
   heights per density; container widths; breakpoints / window classes.
3. **Colour**: primitives as perceptually even tonal scales (generate with
   `../design-studio/scripts/color_tools.py scale`, do not hand-pick twelve
   hexes); neutrals tinted slightly toward the brand hue; semantic roles for
   background, surface levels, border (subtle / default / strong), text
   (primary / secondary / tertiary / disabled / on-accent), accent (subtle bg,
   subtle border, solid, solid-hover, text), and status (success, warning,
   danger, info - each with subtle bg, border, solid, text); a data-viz
   palette if charts exist. **Compute contrast for every text-on-background
   and UI-on-background pair** with `color_tools.py contrast`; record the
   ratios in `DESIGN.md`.
4. **Shape**: a radius scale with a logic (controls, cards, overlays, pills);
   nested radius = outer radius minus the padding between; border widths.
5. **Elevation**: three to five levels; layered soft shadows in light mode;
   in dark mode elevation is expressed by lighter surfaces and borders, since
   shadows disappear.
6. **Motion**: duration and easing tokens and a spring set
   (`../design-motion/SKILL.md`).
7. **Iconography and imagery**: the one icon family, sizes and stroke; image
   ratios and treatment.
8. **Voice**: a few lines on tone and microcopy conventions.

### Dark Mode

Not an inversion. Re-map semantics: backgrounds near-black but not `#000`
unless the brief is OLED-first; raise surfaces with lightness rather than
shadow; lower the chroma of large coloured areas; re-pick accent steps so
solid fills keep contrast with their label; re-check every contrast pair;
soften pure white text to reduce glare; swap shadows for borders; provide dark
variants of illustrations and logos.

## Components

Specify in priority order of product need. For each:

```markdown
## <Component>
- **Purpose / when not to use** (and what to use instead).
- **Anatomy**: named parts.
- **Variants**: size, emphasis (primary / secondary / tertiary / ghost),
  tone (neutral / accent / danger), layout.
- **States**: default, hover, focus-visible, pressed, selected, loading,
  disabled, read-only, invalid.
- **Behaviour**: keyboard map, focus management, dismissal, touch and pointer
  differences; the ARIA Authoring Practices pattern it follows.
- **Content rules**: label length, truncation, icon use, localisation.
- **Tokens used**.
- **Do / Don't**.
```

Build behaviour on proven headless primitives or the host library; do not
hand-roll focus traps, comboboxes, menus or date pickers.

Typical order: button, link, text field family, select / combobox, checkbox /
radio / switch, form field wrapper, card, badge / tag, avatar, tooltip,
popover, menu, dialog, drawer / sheet, tabs, accordion, table, pagination,
toast, alert / banner, breadcrumb, navigation (top bar, sidebar, tab bar),
skeleton, progress, empty state, then date / upload / tree and other domain
components.

## Theming an Existing Library

Map semantic tokens onto the library's **theme API**; do not override
component CSS piecemeal. Identify the mechanism first (for example: Ant
Design's `ConfigProvider` theme tokens and algorithms, Element Plus CSS
variables and SCSS variables, MUI's theme object, shadcn/ui CSS variables,
Naive UI theme overrides, Tailwind's theme, Flutter's `ThemeData` /
`ColorScheme` / `ThemeExtension`, SwiftUI asset catalogues, Compose
`MaterialTheme`). Verify the exact API against the **installed version** - 
theming APIs change across majors. Keep one source of truth (the token file)
and generate or hand-map the library theme from it.

## Token-Drift Audit

For an existing codebase:

1. Inventory raw values: colours, font sizes / weights / line-heights,
   spacing, radii, shadows, z-index, durations and easings (search stylesheets,
   inline styles, theme files, utility classes with arbitrary values).
2. Count occurrences; cluster near-duplicates (colours within a just-visible
   difference, sizes within 1-2 px).
3. Propose the canonical scale and a mapping table `old -> token`, flagging
   values that are intentional exceptions.
4. Plan the migration as small, reviewable steps (tokens file first, then
   replace by area); never a big-bang restyle. Behaviour and appearance stay
   the same unless the user approved a visual change.
5. Suggest a guard so drift does not return: a stylelint or lint rule against
   raw values, and a visual regression baseline.

Report in the user's language with counts and file evidence.

## Deliverables

- `.design/system/tokens.css` - CSS custom properties, primitives then
  semantics, modes under `[data-theme="dark"]` and
  `@media (prefers-color-scheme: dark)`.
- `.design/system/tokens.json` - DTCG-format JSON when more than one platform
  consumes the tokens (`references/token-formats.md`).
- `.design/system/DESIGN.md` - agent-readable system: principles, foundations
  with values, contrast table, component specs, do / don't, and the things
  this system does **not** cover. Written so another agent can design a new
  screen from this file alone.
- `.design/system/preview.html` - living style guide rendering every token and
  component state, in each mode. Render it and look at it.
- For `theme`: the library theme file in the host project plus a before /
  after screenshot.
- For `audit`: inventory, mapping table, migration plan.

## Versioning

A design system is an API. Renaming or removing a token or a component prop is
breaking; adding is minor; value tuning that stays within the role is a patch.
Record changes; deprecate before removing.

## Anti-Patterns

- A palette of hand-picked hexes with uneven lightness steps.
- Semantic names that encode a value (`blue-button`), or primitives used
  directly in components.
- Dark mode by `filter: invert()` or by flipping the scale index blindly.
- Forty spacing values; seven greys that differ by one hex digit.
- A component library re-skinned through deep CSS overrides and `!important`.
- A `DESIGN.md` that describes aspirations instead of the values in use.
- Building a system for a one-page site: tokens yes, component bureaucracy no.
