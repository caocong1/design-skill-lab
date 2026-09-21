# Design Tokens Format Module 2025.10 (DTCG)

> Source: https://www.designtokens.org/tr/2025.10/format/ and the source Markdown in https://github.com/design-tokens/community-group/tree/main/technical-reports ｜ Publisher: W3C Design Tokens Community Group ｜ Published: Final Community Group Report, 28 October 2025 ｜ Fetched: 2026-09-21 ｜ Method: curl of the report and of `format/types.md`, `format/design-token.md`, `format/composite-types.md`, `color/color-type.md`
> This file is a **paraphrased structured digest**, not a verbatim copy.

## Summary

The first stable version of the interoperable token file format. A token is a JSON object with a `$value`; its `$type` is set on the token, inherited from a parent group, or taken from the token it aliases. A token with no resolvable type is invalid - tools must not guess.

## Key rules / claims

- File-level `$schema`: `https://www.designtokens.org/schemas/2025.10/format.json`.
- Token properties: `$value` (required), `$type`, `$description` (plain string), `$extensions` (vendor-keyed proprietary data), `$deprecated` (`true` or an explanatory string). Aliases use `{group.token}`; braces and dots are therefore not allowed in names.
- **Types**: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`; composite types `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography`.
- **dimension**: an object `{ "value": 16, "unit": "px" }`; units are only `px` and `rem`; the unit is required even for 0. `px` maps to `dp` on Android and `pt` on iOS; 1 rem is 16 sp on Android.
- **duration**: `{ "value": 200, "unit": "ms" }`, units `ms` or `s`.
- **fontWeight**: a number from 1 to 1000 or a named alias (`thin` 100 ... `regular` 400, `medium` 500, `semi-bold` 600, `bold` 700 ... `extra-black` 950).
- **fontFamily**: a string or an ordered array of strings.
- **color** (Color module): an object with `colorSpace` (for example `srgb`, `srgb-linear`, `display-p3`, `hsl`, `oklch`), `components` (array; `"none"` allowed for an absent component), optional `alpha`, and an optional `hex` fallback.

## What is perishable vs durable

Durable: typed tokens, aliases, groups, composite types, explicit deprecation. Perishable: this is the 2025.10 version; a resolver/theming module and further types were still evolving - check the current report before relying on details. Many tools still read the older draft syntax where dimensions and colours are plain strings (`"16px"`, `"#ff00ff"`).

## Notes for the skill

Write `tokens.json` in the 2025.10 object syntax and say so; when the host tool (an older Style Dictionary or Tokens Studio setup) expects string values, match the host and note the difference.
