---
title: Design system - tokens, DESIGN.md, theme families, interop
evidence: digest
sources: [dtcg-2025-10, design-md-spec, anthropic-design-skills, radix-colors-scale, web-baseline-2026]
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Design system

Loop step 6, and any request about tokens, themes, dark mode, a component library's theme or
`DESIGN.md`. A system is the set of decisions made once so they are not re-made badly on every
screen: build the smallest one that covers the product, then make it the only way to style
things. Syntax, CSS mechanics and toolchain versions: [token-formats](token-formats.md).

## 1. Where the system lives

- **The host's system of record is the system.** An existing `DESIGN.md`, token file or themed
  component library is updated in place. Never fork it into `.design/system/`: two systems drift.
- Otherwise write `.design/system/`: `DESIGN.md`, `tokens.css`, and `preview.html`; add
  `*.tokens.json` + `*.resolver.json` when more than one platform or a token pipeline consumes the
  tokens. Starters: [DESIGN.md](../../templates/DESIGN.md), [tokens.css](../../templates/tokens.css),
  [tokens.resolver.json](../../templates/tokens.resolver.json). Copy the structure, never the values.
- A hosted design-system store (Claude Design, Stitch, Figma, v0, Lovable) is in play: section 8.
- One page still implies a system (type scale, colour roles, spacing, radius), but a one-page site
  gets tokens, not component bureaucracy.

| Task | Sections | Deliver |
| --- | --- | --- |
| create from the chosen direction | 2-6 | DESIGN.md, tokens, preview.html rendered in every mode and family |
| extend an existing system | 2, 6, 9 | additions in the host's format, a `DESIGN.md` diff, preview of the new parts |
| theme a component library | 7 | the library's theme file in the host, before / after shots |
| derive a mode (dark, high contrast, density) | 4 | the semantic remap, its contrast matrix, preview in that mode |
| several switchable themes | 5 | families x modes, a picker preview, thumbnail test per family |
| audit drift in a codebase | 9 | inventory with counts and file evidence, `old > token` map, migration plan, guard |

## 2. Token architecture

Three tiers; references flow one way.

| Tier | Holds | Example | Referenced by |
| --- | --- | --- | --- |
| Primitive | scales with no meaning | `neutral.100`, `accent.600`, `space.4`, `radius.2` | semantic tokens only |
| Semantic | roles | `color.bg.surface`, `color.text.muted`, `space.inset.md`, `radius.control` | components, layouts |
| Component | an exception a component needs | `button.radius`, `table.row.height.compact` | that component |

- Components read semantic tokens only. If dark mode needs a component edit, a semantic role is
  missing.
- Modes (light, dark, high contrast, density) re-map the semantic tier and nothing else.
- Name semantic tokens `category.role.variant.state`, general to specific: `color.accent.solid.hover`,
  `space.inset.md`, `motion.duration.fast`. Name primitives by scale position (`blue.600`, `space.4`),
  never by use. Never encode a value in a semantic name (`blue-button`, `gray-500-text`).
- Map ramp steps to roles by position (backgrounds, component states, borders, solids, text), so the
  script's 50-950 ramp or a 12-step scale plugs in directly; dark mode takes the `--dark` ramp at the
  same steps. The mapping table is in [color](../fundamentals/color.md).
- Add a component token only when a component must deviate. A token used once is a magic number
  with extra steps. Keep scales short: every extra step is a future inconsistency.

## 3. Foundations, in order

Each decision constrains the next. Decide them from the chosen direction and the brief; the owner
file holds the craft rules.

| # | Decide | Owner |
| --- | --- | --- |
| 1 | Type: one or two families plus mono; text styles, not sizes (`display`, `title`, `heading`, `body`, `label`, `caption`, `code`); 6-8 steps on a ratio (tight for dense UI, wide for editorial); CJK stack and mixed-script rules | [typography](../fundamentals/typography.md), [cjk-typography](../fundamentals/cjk-typography.md) |
| 2 | Space and size: 4 px base, non-linear scale, control heights per density, containers, window classes | [layout-and-spacing](../fundamentals/layout-and-spacing.md) |
| 3 | Colour: generated ramps (`color_tools.py scale`), tinted neutrals, roles, status sets, dark mapping; every pair computed | [color](../fundamentals/color.md) |
| 4 | Shape: one radius logic, nesting, border widths | [layout-and-spacing](../fundamentals/layout-and-spacing.md) |
| 5 | Elevation: 3-5 levels; in dark, lighter surfaces and borders instead of shadows; platform materials by role | [materials](../fundamentals/materials.md) |
| 6 | Motion: durations, easings, springs, one personality | [motion-tokens](../disciplines/motion-tokens.md) |
| 7 | Icons and imagery: one family, sizes, stroke; image ratios and treatment | [icons](../disciplines/icons.md) |
| 8 | Voice: a few lines on tone and microcopy conventions | [product-ui](../disciplines/product-ui.md) |

## 4. Modes and the scoping trap

- Declare each colour role once with `light-dark()`; `color-scheme` picks the branch, and
  `[data-theme]` sets `color-scheme` so an explicit choice beats the OS. No duplicated
  media-query block. Dark-mode colour rules (not inverted, chroma down, re-picked accent steps,
  re-run contrast) live in [color](../fundamentals/color.md).
- **The `var()` trap.** A custom property whose value uses `var()` is resolved on the element that
  declares it. `--color-bg: var(--p-neutral-50)` on `:root` keeps `:root`'s neutral inside a
  `[data-family]` scope that overrides `--p-neutral-50` (measured, Chrome 153). Declare derived
  tokens in every scope that overrides their inputs; the starter does it with `:root, [data-family]`.
- `light-dark()` in an unregistered custom property is evaluated where the token is used, so a
  nested `[data-theme="dark"]` flips roles declared on `:root`. A role registered with
  `@property { syntax: '<color>' }` is computed on `:root` and does not flip: never register
  mode-switching colour roles (measured, Chrome 153).
- High contrast is a mode: stronger borders on every control, no meaning carried by translucency.
  Forced colours and contrast preferences: [accessibility](../fundamentals/accessibility.md).
- Density is a mode: `compact / default / comfortable` re-map spacing and control-height roles,
  never component code. When users pick density independently of the theme, give it its own
  resolver modifier.

## 5. Theme families

Several switchable themes are **families**: personalities, each with its own light and dark mode.
A family that differs only in hue is a palette variant; label it so.

- A family differs on at least three axes: density, shape, depth, type size, surface treatment. It
  may also switch the declared structural variant points; which traits a runner-up direction must
  keep as a theme is decided in [directions](directions.md) section 11.
- Every family passes the thumbnail test with and without its signature element on screen.
- Layer the tokens: foundation constants > family structure (`[data-family]`: radius, density, type
  size, variant switches) > family x mode colour. Scope families on attributes, not only on `:root`,
  so a picker can preview any family live on any element.
- After switching families in a build, search for the previous family's accent values: category
  labels and charts keep stale accents.
- **Implementation.** CSS: `[data-family]` scopes as in the tokens.css starter. DTCG: one resolver
  with a `theme` modifier (the families) and a `mode` modifier (light, dark, high contrast). Family
  files hold ramps and structure; mode files map roles to the active family's ramps by reference,
  so every family gets every mode without a file per combination. Use the resolver only when the
  toolchain reads it ([token-formats](token-formats.md) section 6 has which do); otherwise build one
  output per permutation or keep CSS scoping.

## 6. DESIGN.md: the agent-readable system

`DESIGN.md` describes the system; `tokens.css`, `*.tokens.json` and `*.resolver.json` implement it.
Another agent must be able to design a new screen from `DESIGN.md` alone.

- **Write it from what was built.** At step 6, draft tokens, Overview and Do's and Don'ts from the
  chosen direction. At step 11, rewrite it from the rendered screens: values actually in use,
  components that exist, the contrast table computed from tokens.css. A rulebook written before the
  build gets defended against reality; one describing aspirations is wrong.
- Overview carries one specific referent sentence (a point, not a region of adjectives) and the one
  memorable idea. Do's and Don'ts are rules a reviewer can check on a screenshot ("Don't use small
  text for anything except captions", not "use small text sparingly"). Colors carries a frequency
  budget ("primary under 5%, only the one main action per view").
- Format: spec version `alpha`, CLI `@google/design.md` 0.4.0. YAML front matter tokens are
  normative; prose is context. Sections, when present, keep the order Overview, Colors,
  Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts; extra sections
  (Motion, Modes and themes, Contrast, Not covered) follow and are preserved by consumers.
- Rules that keep the file valid and exportable:
  - define `primary`; write colours as the hex of the token (`color_tools.py convert`);
  - give every typography level all five properties: `lineHeight` a quoted unitless number (`"1.5"`;
    measured with 0.4.0, the DTCG export drops a bare YAML number), `letterSpacing` in px or rem;
  - give every component both `backgroundColor` and `textColor`, so lint checks their contrast;
    states are sibling keys (`button-primary-hover`);
  - no custom top-level YAML keys (`motion:`, `modes:` are warned about and dropped by export);
    describe modes and motion in prose and keep their values in the token files;
  - no fenced `yaml` blocks in the prose: the parser merges them, and a repeated key makes it
    ignore every token while lint still exits 0;
  - no repeated `##` heading: the spec says it rejects the file, but CLI 0.4.0 lints it clean
    (exit 0), so check for duplicate headings yourself.
- Check it when the CLI is reachable:
  - `npx -y @google/design.md@0.4.0 lint DESIGN.md` exits 1 on errors;
  - `npx -y @google/design.md@0.4.0 diff old.md DESIGN.md` exits 1 on a regression (more errors
    or warnings);
  - lint's contrast rule checks only declared component pairs against 4.5:1. It does not replace
    `color_tools.py matrix --from tokens.css`.
- `export` (DTCG, Tailwind v4 `@theme`, css-vars) is lossy: colours clipped to sRGB hex, aliases
  flattened, components dropped, `em` written as an invalid DTCG unit, `lineHeight: 24px` written
  as a 24x multiplier. Never make an export the token source.
- **preview.html is the proof the system builds**: every colour role as a swatch pair with its
  computed ratio, each text style with the brief's real copy (CJK too), spacing, radii, elevation,
  and every component in every state, per mode and per family. Render it at loop step 8
  ([render-and-look](render-and-look.md)); a system that was never rendered is a guess.
- Never use a token or component the host system cannot show in its source. Missing one: add it to
  the system first (extend), record why in decisions.md, then use it.
- A component's behaviour is specified, not invented: name the ARIA Authoring Practices pattern it
  follows and its keyboard map. Build on the host library or proven headless primitives; never
  specify a hand-rolled focus trap, combobox, menu or date picker.

## 7. Theming an existing component library

Map semantic tokens onto the library's theme API; never restyle components piecemeal with deep
selectors or `!important`. Find the mechanism for the installed major version (lockfile, not
memory): Ant Design `ConfigProvider` theme tokens and algorithms, Element Plus CSS variables,
MUI theme with CSS variables, shadcn/ui CSS variables through Tailwind v4 `@theme inline`,
Naive UI theme overrides, Flutter `ThemeData` / `ColorScheme` / `ThemeExtension`, SwiftUI asset
catalogues, Compose `MaterialTheme`, ArkUI resource qualifiers. Entry points per stack:
[stacks](../../../implement-design/references/stacks.md). Keep one source (the token file) and
generate or hand-map the library theme from it. A library's stock theme is itself a default: every
value it keeps must pass the anti-slop question.

## 8. Hosted design-system stores

One system of record, always. Decide which side is the source, record it in decisions.md, and make
the other a projection. Export from the tokens and DESIGN.md; bring changes back through a
DESIGN.md edit checked with `design.md diff` and a preview render, never by hand-merging two stores.
Whatever a store cannot express (families, modes, motion) stays in the token files; note the loss.

| Store | Recipe | Watch |
| --- | --- | --- |
| Claude Design (claude.ai/design) | The user runs `/design-sync` in Claude Code; it syncs a local component library into a design-system project one component at a time after the user approves a plan. Prepare one preview HTML per component group whose first line is `<!-- @dsCard group="Buttons" -->`, rendering the host's real components with its tokens. Claude Design can also build a team system from the codebase and send a handoff bundle to Claude Code. | Never start the sync yourself; never replace the project wholesale. Checked against the host's sync tool, 2026-09-27. |
| Google Stitch | Keep the file at `.stitch/DESIGN.md`. Stitch MCP: `upload_design_md` (base64 UTF-8) > `create_design_system_from_design_md` > `apply_design_system`. | Stitch stores a seed theme: one hex, a colour variant, three enum fonts, four roundness steps; the rest lives only in the Markdown. A project default restyles new screens only. Its docs' "4:1 contrast" example is wrong; use 4.5:1. |
| Figma variables | Import takes DTCG JSON, one file per mode; `tz import <figma-url>` (Terrazzo; Figma Enterprise, `file_variables:read`) pulls variables into a resolver. | Import drops much of the format ([token-formats](token-formats.md) section 6 lists what survives): export a reduced copy per mode and keep the full file as the source. |
| v0, Lovable, Figma Make | Each keeps its own store (v0 design-system skill and starter app; Lovable `.lovable/design-system.json`; Figma Make `guidelines/`). | Not verified against primary docs here: read the host's current docs, then apply the rules above. |

## 9. Drift audit and legacy migration

1. Inventory raw values: colours, font sizes, weights and line heights, spacing, radii, shadows,
   z-index, durations and easings, in stylesheets, inline styles, theme files and utility classes
   with arbitrary values. Count occurrences per value and per file.
2. Cluster near-duplicates (colours within a just-visible difference, sizes within 1-2 px) and
   classify colours by hue family. Use relative chroma (C divided by the largest sRGB C at that L
   and hue; bisect C until the colour leaves the gamut), not absolute chroma. Tailwind's slate
   greys sit at 0.2-0.45 and its blue-50 and blue-100 tints near 1.0, while absolute chroma
   overlaps (blue-50 C 0.014, slate-500 C 0.046; measured), so a cut near 0.6 separates a tinted
   grey from a pale tint. A tinted near-white belongs to its hue, not to neutral.
3. Propose the canonical scale and an `old > token` table; flag intentional exceptions.
4. Migrate in small reviewable steps: tokens first, then replace area by area. Appearance stays the
   same unless the user approved a visual change. When raw values run into the thousands, use two
   stages: (a) a mechanical, re-runnable pass to primitive-scale classes (`text-neutral-500`) with
   zero visual drift; (b) semantic roles area by area. Record (a) in decisions.md as a temporary
   exception to "components read semantic tokens only". Until (b) lands, a theme made by
   re-mapping whole primitive scales cannot vary status or category colours.
5. Guard against return: a lint rule against raw values outside the token file, a check such as
   `grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|oklch\(' src` that must print nothing outside tokens,
   `--color-*: initial` in a Tailwind v4 theme so the default palette stops existing, and a visual
   regression baseline.

Report in the user's language with counts and file evidence.

## 10. Versioning

A design system is an API. Renaming or removing a token or a component prop is breaking; adding
is minor; tuning a value within its role is a patch. Deprecate before removing (`$deprecated` in
DTCG), and log changes in decisions.md or the host's changelog.

## Anti-patterns

- Hand-picked hexes with uneven lightness steps; seven greys that differ by one digit.
- Primitives used directly in components; semantic names that encode a value.
- Dark mode by `filter: invert()` or by flipping the scale index blindly.
- A re-skinned library held together by deep overrides and `!important`.
- Theme families that change only the hue, or a family whose roles were declared on `:root` only.
- A `DESIGN.md` of aspirations, written once before the build and never updated.
