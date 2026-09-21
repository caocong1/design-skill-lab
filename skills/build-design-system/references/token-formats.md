# Token Formats

One token source, rendered to whatever each consumer needs. Pick the simplest
format that serves the project; add formats only when a second consumer
exists. Format details are **perishable** - the lab digests they come from are
`raw/docs/dtcg-design-tokens-format.md` and `raw/docs/design-md-format.md`.

## 1. CSS Custom Properties (default for web work)

```css
:root {
  /* primitives */
  --gray-50: oklch(0.985 0.003 260);   --gray-900: oklch(0.21 0.012 260);
  --blue-500: oklch(0.623 0.188 259.8); --blue-600: oklch(0.55 0.188 259.8);
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem; --space-6: 1.5rem; --space-8: 2rem;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 999px;

  /* semantics: the only tier components may use */
  --color-bg: var(--gray-50);
  --color-surface: white;
  --color-border: oklch(0.9 0.005 260);
  --color-text: var(--gray-900);
  --color-text-muted: oklch(0.5 0.01 260);
  --color-accent: var(--blue-600);
  --color-accent-hover: oklch(0.49 0.186 259.8);
  --color-on-accent: white;
  --color-focus-ring: var(--blue-500);
  --radius-control: var(--radius-md);
  --shadow-raised: 0 1px 2px oklch(0.2 0.02 260 / 0.08), 0 4px 12px oklch(0.2 0.02 260 / 0.08);
  --duration-fast: 150ms; --duration-base: 220ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  color-scheme: light;
}

[data-theme="dark"] {
  --color-bg: oklch(0.17 0.01 260);
  --color-surface: oklch(0.21 0.012 260);
  --color-border: oklch(0.3 0.012 260);
  --color-text: oklch(0.93 0.005 260);
  --color-text-muted: oklch(0.68 0.01 260);
  --color-accent: oklch(0.68 0.16 259.8);
  --color-on-accent: oklch(0.17 0.01 260);
  --shadow-raised: 0 0 0 1px oklch(1 0 0 / 0.06);
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* same re-mapping */ } }
```

- Modes re-map semantics only. Provide both the attribute (explicit user
  choice) and the media query (system default).
- Give `oklch()` values an sRGB fallback only if the browser targets need it.
- Tailwind (v4) can take these through `@theme`; component libraries take them
  through their theme API - map, do not duplicate.

## 2. DTCG JSON (when more than one platform consumes tokens)

Design Tokens Format Module **2025.10** (the first stable version). Values are
typed objects, not strings:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "color": {
    "$type": "color",
    "blue": { "600": { "$value": { "colorSpace": "oklch", "components": [0.55, 0.188, 259.8], "hex": "#246bdd" } } },
    "accent": { "$value": "{color.blue.600}", "$description": "Primary action fill" }
  },
  "space": { "$type": "dimension", "4": { "$value": { "value": 1, "unit": "rem" } } },
  "motion": {
    "duration": { "fast": { "$type": "duration", "$value": { "value": 150, "unit": "ms" } } },
    "ease": { "out": { "$type": "cubicBezier", "$value": [0.16, 1, 0.3, 1] } }
  },
  "text": {
    "body": { "$type": "typography", "$value": {
      "fontFamily": ["Inter", "PingFang SC", "sans-serif"], "fontSize": { "value": 1, "unit": "rem" },
      "fontWeight": 400, "lineHeight": 1.5, "letterSpacing": { "value": 0, "unit": "px" } } }
  }
}
```

- Types: `color`, `dimension` (`px` or `rem` only), `fontFamily`,
  `fontWeight`, `duration` (`ms` or `s`), `cubicBezier`, `number`; composites
  `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography`.
- `$type` may be set on a group and inherited. Aliases are `{path.to.token}`.
  `$deprecated` marks tokens on their way out; `$extensions` holds
  vendor-specific data (use it for mode mappings until a theming module is
  adopted by the toolchain in use).
- Many existing pipelines still read the older draft syntax (`"16px"`,
  `"#246bdd"`). **Match the host toolchain's installed version** and note
  which syntax the file uses.
- Build with a token transformer (see
  `../../design-studio/references/resources/code.md` > Design tokens) to CSS,
  Swift, Kotlin / XML, Dart.

## 3. DESIGN.md (agent-readable system description)

Follow the open DESIGN.md format so other agents and linters can consume the
file: YAML front matter with tokens, then prose sections in a fixed order.

```markdown
---
name: <System name>
description: <one line>
colors:
  primary: "#1A1C1E"
  accent: "oklch(0.55 0.188 259.8)"
  on-accent: "#FFFFFF"
  surface: "#FFFFFF"
typography:
  body-md: { fontFamily: Inter, fontSize: 1rem, fontWeight: 400, lineHeight: 1.5 }
  title-lg: { fontFamily: Inter, fontSize: 1.75rem, fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.01em }
rounded: { sm: 4px, md: 8px, lg: 12px }
spacing: { sm: 8px, md: 16px, lg: 24px }
components:
  button-primary: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", rounded: "{rounded.md}", padding: 12px }
  button-primary-hover: { backgroundColor: "oklch(0.49 0.186 259.8)" }
---

## Overview
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Do's and Don'ts
```

Sections may be omitted but must keep this order; consumers preserve unknown
sections, so append what the schema cannot express yet:

```markdown
## Modes            <- dark / high-contrast / density re-mappings
## Motion           <- duration, easing, spring tokens and the personality sentence
## States           <- the state rules every component follows
## Contrast         <- the computed contrast table
## Non-Goals        <- what this system deliberately does not cover
```

The format is at an alpha version; validate with its linter when available in
the environment, and keep `tokens.css` or `tokens.json` as the implementation
source of truth. `DESIGN.md` describes; token files implement.

## 4. Native Theme Objects

Generate or hand-map from the same source:

| Stack | Target |
| --- | --- |
| Flutter | `ThemeData` + `ColorScheme` + `TextTheme`; custom roles in a `ThemeExtension`; never scatter `Color(0xFF…)` in widgets |
| SwiftUI | asset-catalogue colours with light / dark variants, a `Theme` struct in the environment, text styles mapped to Dynamic Type |
| Compose | `MaterialTheme` colour scheme, typography and shapes; extra roles via `CompositionLocal` |
| ArkUI (HarmonyOS) | resource files with qualifiers for dark mode and device type |
| Mini programs | CSS variables on `page`, rpx for layout, a theme JSON for dark mode where supported |

## Naming

`category.role.variant.state` from general to specific:
`color.text.muted`, `color.accent.solid.hover`, `space.inset.md`,
`radius.control`, `shadow.raised`, `motion.duration.fast`. Primitives are
named by scale position (`blue.600`, `space.4`), never by use. Do not encode
values in semantic names, and do not abbreviate beyond what the team reads
aloud.
