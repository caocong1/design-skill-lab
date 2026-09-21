# DESIGN.md format

> Source: https://github.com/google-labs-code/design.md (README; Apache-2.0); specification published at https://stitch.withgoogle.com/docs/design-md/specification ｜ Publisher: Google Labs ｜ Published: spec version "alpha" ｜ Fetched: 2026-09-21 ｜ Method: curl of the raw README
> This file is a **paraphrased structured digest**, not a verbatim copy.

## Summary

DESIGN.md is a file format that gives coding agents a persistent description of a visual identity. It combines machine-readable tokens in YAML front matter with human-readable rationale in Markdown. Tokens are normative; prose explains why they exist and how to apply them. A CLI (`npx @google/design.md lint|diff`, alias `designmd`) validates structure, resolves token references, checks WCAG contrast of component colour pairs, and diffs two versions to detect regressions.

## Key rules / claims

**Front matter schema**: `version` (optional, currently "alpha"), `name`, `description` (optional), `omitted` (sections intentionally left out), `colors`, `typography`, `rounded`, `spacing`, `components`.

**Token types**: Color = any CSS colour (hex, `rgb()`, `oklch()`...). Dimension = number + unit (`px`, `em`, `rem`). Typography = object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation`. References use `{path.to.token}`.

**Components**: a name mapped to properties - `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. States are separate entries with a related name (`button-primary-hover`).

**Body section order** (sections may be omitted, but those present keep this order): Overview (alias Brand & Style), Colors, Typography, Layout (alias Layout & Spacing), Elevation & Depth, Shapes, Components, Do's and Don'ts.

**Consumer behaviour**: unknown sections are preserved; unknown token names are accepted if the value is valid; unknown component properties warn; a duplicate section heading is an error.

## What is perishable vs durable

Durable: tokens-plus-rationale in one agent-readable file; linting a design description; diffing it for regressions. Perishable: the schema is "alpha" and will change; the CLI package name; there is no motion, state-matrix or mode (dark theme) vocabulary yet.

## Notes for the skill

Emit `.design/system/DESIGN.md` in this shape so other agents, the linter and Stitch can consume it. Put what the schema cannot express yet (modes, motion tokens, state rules, non-goals) in additional `##` sections after the standard ones - consumers must preserve unknown sections.
