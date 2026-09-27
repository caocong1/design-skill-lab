---
title: Token formats - CSS mechanics, Tailwind v4, DTCG 2025.10, toolchains
evidence: digest
sources: [dtcg-2025-10, web-baseline-2026, design-md-spec, radix-colors-scale, fluent-2]
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Token formats

Syntax for the architecture in [system](system.md). One token source, rendered to whatever each
consumer needs; add a format only when a second consumer exists. Versions and browser support are
perishable (checked 2026-09-27): match the host's installed versions and say in the file which
syntax it uses. Items marked *measured* were run in Chrome 153 and Tailwind 4.3.3.

## 1. Pick the source format

| Consumers | Source of truth | Also shipped |
| --- | --- | --- |
| one web codebase, no pipeline | `tokens.css` | `DESIGN.md` |
| web with Tailwind v4 | `tokens.css` + an `@theme inline` map (section 3) | `DESIGN.md` |
| several platforms, a token pipeline, or Figma variables | `*.tokens.json` (DTCG 2025.10), plus `*.resolver.json` when there are families or modes | `tokens.css` and platform files built from it |
| a host that already has a pipeline | its format, at its installed version | - |

Native theme objects (Flutter, SwiftUI, Compose, ArkUI, mini-programs) are built or hand-mapped
from the same source: [stacks](../../../implement-design/references/stacks.md).

## 2. CSS custom properties

The [tokens.css](../../templates/tokens.css) starter shows the tiers. The mechanics:

**Modes, one declaration per role** (`light-dark()`; status: [web](../platforms/web.md) §4):

```css
:root, [data-family] {
  color-scheme: light dark;
  --color-bg: light-dark(var(--p-neutral-50), var(--p-neutral-dark-50)); /* same step, dark ramp */
}
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

`light-dark()` takes colours (and images, newly: [web](../platforms/web.md) §4). Differences that are
not colours (shadow geometry, border widths in high contrast) need a `[data-theme]` or media block.

**Derived states.** The rule (ramp step first, states move toward more contrast) is in
[color](../fundamentals/color.md). When a state must be derived, one declaration serves both modes:

```css
--color-accent-hover: color-mix(in oklab, var(--color-accent), var(--color-text) 10%);
```

- Mixing toward the text colour moves away from the page background in both modes: darker in
  light, lighter in dark. *Measured.*
- Mix in `oklab` when either side is a grey written in OKLCH with hue 0 (as the starter's
  neutrals are): `in oklch` drags the hue, 260 to 270 at 10%. Greys written as hex, as `black`, or
  as `oklch(0.2 0 none)` carry no hue and do not drag. *Measured.*
- `oklch(from var(--color-accent) calc(l - 0.06) c h)` darkens in both modes, which lowers
  contrast on dark: give relative colour a sign per mode.
- Follow the platform: Fluent on Windows lightens on hover. Recompute contrast for every derived
  state.

**Wide gamut.** P3 buys the most extra chroma in greens (at L 0.55: C 0.17 in sRGB, 0.23 in P3;
*measured*):

```css
:root { --p-accent-600: oklch(0.55 0.17 145); }                              /* in sRGB */
@media (color-gamut: p3) { :root { --p-accent-600: oklch(0.55 0.23 145); } } /* in P3 only */
```

Worth it for the one accent or illustration where vividness is the identity; never for text or
neutrals. Compute contrast for both values. In DTCG, write `colorSpace: "display-p3"` with a
6-digit `hex` fallback.

**Registered properties.** Register tokens that animate (angles, lengths, gradient stops) so they
interpolate (`@property`; status: [web](../platforms/web.md) §4):

```css
@property --sweep { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
```

Never register a mode-switching colour role: it computes on `:root` and stops flipping
(system section 4).

**Other colour functions.** OKLCH and two-colour `color-mix()` need no sRGB fallback; keep mixes to
two colours. `contrast-color()` returns only black or white and promises about 3:1: a fallback, not
a computed pair. Status of each: [web](../platforms/web.md) §4.

## 3. Tailwind v4

Map the roles into Tailwind's namespaces and remove the default palette:

```css
@import "tailwindcss";
@import "./tokens.css";          /* the starter's roles, renamed --ds-* */
@theme { --color-*: initial; }   /* bg-blue-500 now compiles to nothing */
@theme inline {
  --color-bg: var(--ds-bg);
  --color-accent: var(--ds-accent);
  --radius-control: var(--ds-radius-control);
}
```

- Utility names come from the variable: `--color-bg` gives `bg-bg`, `text-bg`; `--radius-control`
  gives `rounded-control`.
- In a Tailwind host, name the source roles outside `--color-*`, `--radius-*`, `--text-*`,
  `--font-*`, `--spacing-*` (for example the `--ds-` prefix, or the host's convention: shadcn/ui
  uses `--background`).
- Use `inline`. A plain `@theme` map resolves `var(--ds-bg)` on `:root`, so theme-family scopes
  stop working: the `var()` trap again. *Measured.*
- Do not map a name to itself (`--color-bg: var(--color-bg)`): Tailwind emits a self-referencing
  copy in `@layer theme`, which works only while the token file stays unlayered. *Measured.*
- `--color-*: initial` doubles as a drift guard: default palette classes produce no CSS.

## 4. DTCG 2025.10 token files

Format, Color and Resolver modules, stable since 2025-10-28. Files end in `.tokens.json` (media
type `application/design-tokens+json`); resolvers end in `.resolver.json` (`application/json`).
An excerpt (the `color.neutral` ramp it aliases lives elsewhere in the file):

```json
{
  "color": {
    "$type": "color",
    "accent": { "600": { "$value": { "colorSpace": "oklch", "components": [0.52, 0.14, 250], "hex": "#116bb5" } } },
    "text": {
      "$root": { "$value": "{color.neutral.950}" },
      "muted": { "$value": "{color.neutral.800}" }
    }
  },
  "space": { "$type": "dimension", "4": { "$value": { "value": 16, "unit": "px" } } },
  "duration": { "$type": "duration", "fast": { "$value": { "value": 120, "unit": "ms" } } },
  "ease": { "$type": "cubicBezier", "standard": { "$value": [0.2, 0, 0, 1] } },
  "typography": {
    "body": { "$type": "typography", "$value": {
      "fontFamily": ["<text face>", "PingFang SC", "sans-serif"],
      "fontSize": { "value": 16, "unit": "px" }, "fontWeight": 400,
      "letterSpacing": { "value": 0, "unit": "px" }, "lineHeight": 1.5 } }
  }
}
```

- A token is any object with `$value`. An object with both `$value` and children is an error.
  Names never start with `$` and never contain `{`, `}` or `.`.
- Type comes from `$type`, else the alias target, else the nearest group's `$type`; otherwise the
  token is invalid (tools never guess). Put `$type` on groups.
- The 13 types:
  - `color`;
  - `dimension`: `px` or `rem` only, unit required even at 0;
  - `fontFamily`: a string or an array;
  - `fontWeight`: 1-1000 or the exact lower-case aliases (`regular`, `semi-bold`, `bold`...);
  - `duration`: `ms` or `s`;
  - `cubicBezier`: x values in [0, 1];
  - `number`;
  - composites: `strokeStyle`, `border`, `transition` (duration, delay and timingFunction all
    required), `shadow` (one or an array; `inset`), `gradient` (the kind is unspecified), and
    `typography` (all five fields required; `lineHeight` multiplies `fontSize`).
- Not in the spec: springs, opacity or percentage, strings, booleans, font style, assets. Put them
  in `$extensions` under a reverse-domain key, or as paired `number` tokens. The spring convention:
  [motion-tokens](../disciplines/motion-tokens.md).
- Colour values: `colorSpace` (14 spaces), `components` (numbers or `"none"`), optional `alpha`,
  optional 6-digit `hex` fallback. OKLCH `L` is 0-1, not a percentage. Converters choose their own
  gamut mapping: check the sRGB fallbacks they write.
- `$root` gives a group a base value next to its variants: reference it as `{color.text.$root}`;
  `{color.text}` points at a group and is invalid.
- `$extends` makes a group inherit another (`"$extends": "{button}"`). A local token at the same
  path replaces the inherited token whole, not field by field.
- Reference whole tokens with `{group.token}`. Reference a part (one colour component, a
  dimension's value, a shared `fontFamily`) with JSON Pointer:
  `{ "$ref": "#/color/accent/600/$value/components/0" }`.
- `$description`, `$deprecated` (`true` or a reason) and `$extensions` are allowed on tokens and
  groups. Tools keep extension data they do not understand.
- `$schema` is not part of the token-file spec (it is optional in a resolver).

## 5. Resolver (families x modes)

Start from [tokens.resolver.json](../../templates/tokens.resolver.json).

- Root keys: `version: "2025.10"` (the schema version, not yours) and `resolutionOrder` are
  required. Only `name`, `description`, `sets`, `modifiers` and `$schema` may join them.
- A set is `{ "sources": [...] }`: files by `$ref`, or inline token trees. The later source wins.
- A modifier is `{ "contexts": { "<name>": [sources] }, "default": "<name>" }`. Write `contexts`,
  plural: two examples in the spec itself say `context`. Give it at least two contexts; `default`
  must be one of them. A context may reference a set, never a modifier.
- `resolutionOrder` lists sets and modifiers by `$ref`; the later entry wins. Aliases resolve after
  the merge, so a mode file may alias the active family's ramps.
- Inputs are strings: `{ "theme": "dusk", "mode": "dark" }`. A boolean input is an error.
- Keep modifiers orthogonal: each touches its own tokens (family: ramps and structure; mode:
  colour roles; density: spacing and control heights). Terrazzo recommends one modifier per token
  type family. Permutations multiply: 3 families x 4 modes = 12 builds.
- `$defs` is undefined behaviour; do not rely on it for bundling.

## 6. Toolchain support (checked 2026-09-27)

| Tool | Version | Reads | Resolver |
| --- | --- | --- | --- |
| Terrazzo CLI | 2.0+ (2.7.1 current) | full 2025.10 including JSON Pointer `$ref`; object colour, dimension and duration required by default (old string syntax errors) | yes; the CSS plugin builds each permutation (`permutations: [{ input: { theme: "dark" } }]`) |
| Style Dictionary | 5.3+ object colours (14 spaces, `hex` as the out-of-sRGB fallback), 5.4+ object dimensions (5.5.5 current) | no `$extends` or `$ref` in the changelog; `outputReferences` can emit a raw `{group.$root}` | no: resolve outside it and run once per permutation |
| Tokens Studio for Figma | DTCG by default since 2.11 (2.12.1 current) | still writes its own types and string dimensions in DTCG mode | no; `@tokens-studio/sd-transforms` bridges to Style Dictionary |
| Figma variables | import, one file per mode | sRGB and HSL colours, px dimensions, durations in s, single-string font families, no composites | no |
| `@google/design.md` export | 0.4.0 | lossy (system section 6) | no |
