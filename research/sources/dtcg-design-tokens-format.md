# Design Tokens Format Module 2025.10 (DTCG)
- id: dtcg-design-tokens-format · url: https://www.designtokens.org/tr/2025.10/format/ · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
- superseded_by: dtcg-2025-10 (covers the whole 2025.10 release: Format + Color + Resolver). This file stays as the Format-module digest.
> 中文导语：W3C 设计 token 社区组（DTCG）2025-10-28 发布的第一个稳定版 token 交换格式。本文件只摘 Format 模块（token 结构、类型、组、引用）；Color 模块只列要点；Resolver（主题/模式）模块是同一稳定版的一部分，详见 `dtcg-2025-10`。

Read on 2026-09-27: the Format module "Final Community Group Report 28 October 2025" (editors Louis Chenais, Kathleen McMahon, Drew Powers, Matthew Ström-Awn, Donna Vitan) and the Technical Reports index https://www.designtokens.org/technical-reports/ ; Color module https://www.designtokens.org/tr/2025.10/color/ for the colour-space list.

## Key facts
1. **Release status** (TR index): "2025.10 - Stable - 2025-10-28"; earlier editors' drafts 2025-07-21, 2022-06-14, 2021-09-23; a "Preview" line is marked Experimental. No newer stable release on 2026-09-27. The 2025.10 release comprises **Format, Color and Resolver** modules; the Resolver (theming/modes) module is stable, not "still evolving" (see `dtcg-2025-10`).
2. **Files** (§4.1-4.2, `#media-type-mime-type`, `#file-extensions`): media type `application/design-tokens+json` SHOULD be used; `application/json` MAY; tools MUST accept both. Recommended extensions `.tokens` and `.tokens.json`; saving tools SHOULD append one.
3. **Token = object with `$value`** (§5.1): the parent key is the name; names are case-sensitive (tools may collide when exporting case-insensitively). Names MUST NOT start with `$` and MUST NOT contain `{`, `}` or `.` (§5.1.1).
4. **Token properties** (§5.2, `#type`, `#extensions`): `$description` (plain string), `$type`, `$extensions` (vendor-specific keys, reverse-domain names recommended; tools MUST preserve extension data they do not understand), `$deprecated` (`true` or an explanatory string; also allowed on groups).
5. **Type resolution** (§5.2.2 and §6.7.3 `#type-inheritance`): explicit `$type` → resolved group `$type` (after `$extends`) → parent groups up the tree → otherwise the token is **invalid**; tools must not guess. Aliases take the type of their target.
6. **Groups** (§6): a group may hold a root token under the reserved name `$root` (`{color.accent.$root}`; `{color.accent}` is invalid because it names a group) (§6.2). `$extends` inherits another group, is syntactic sugar for JSON Schema `$ref`, MUST NOT reference a token, and must not be circular (§6.4). Empty groups are allowed (§6.5 `#empty-groups`).
7. **References** (§7): curly-brace aliases `{group.token}` resolve to a whole token value; tools MUST also support JSON Pointer `$ref` (RFC 6901, e.g. `"#/colors/blue/$value"`) (§7.1.2); **property-level references** reach into a value - a colour component, a dimension's `value`, a typography sub-property (§7.3). Chained references resolve; circular ones are errors.
8. **Primitive types** (§8): `color` (defined in the Color module), `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`.
9. **dimension** (§8.2): object `{ "value": 16, "unit": "px" }`; units only `px` and `rem`; unit required even for 0; `px` ≈ Android `dp` / iOS `pt`; `1rem` = 100 % of the default font size ≈ 16 sp on Android; platforms without rem may need lossy conversion.
10. **fontWeight** (§8.4): number in [1, 1000] or an alias: 100 thin/hairline, 200 extra-light/ultra-light, 300 light, 400 normal/regular/book, 500 medium, 600 semi-bold/demi-bold, 700 bold, 800 extra-bold/ultra-bold, 900 black/heavy, 950 extra-black/ultra-black; anything else (including case variants) MUST be rejected.
11. **duration** (§8.5): `{ "value": 200, "unit": "ms" }`, units `ms` or `s`. **cubicBezier** (§8.6 `#cubic-bezier`): array `[P1x, P1y, P2x, P2y]`; x in [0, 1], y any real number.
12. **Composite types** (§9): `strokeStyle` (keyword or `{dashArray, lineCap: round|butt|square}`, `#stroke-style`), `border` (color, width, style, `#border`), `transition` (duration, delay, timingFunction), `shadow` (single object or **array**; each has color, offsetX, offsetY, blur, spread, optional `inset`), `gradient`, `typography` (fontFamily, fontSize, fontWeight, letterSpacing, lineHeight - lineHeight is a number multiplier of fontSize). Composites may alias whole sub-values.
13. **Not yet types** (§8.8, non-normative): font style, percentage/ratio, file/asset. There is **no spring type** - spring motion (damping/stiffness) has to go into `$extensions` or be expressed as `number` pairs.
14. **Colour value** (Color module): object with `colorSpace`, `components` (array; `"none"` allowed for a missing component, CSS Color 4 semantics), optional `alpha`, optional `hex` - a 6-digit CSS hex **fallback**, not the source of truth. 14 colour spaces: srgb, srgb-linear, hsl, hwb, lab, lch, oklab, oklch, display-p3, a98-rgb, prophoto-rgb, rec2020, xyz-d65, xyz-d50.
15. **JSON Schema**: the Format TR says the group "is currently exploring the addition of a JSON Schema" (editor's note, §4.2); schema files are nevertheless served at `https://www.designtokens.org/schemas/2025.10/format.json` and `.../resolver.json` (both HTTP 200 on 2026-09-27). The earlier digest presented the format schema URL as if the TR defined it; it does not.
16. **Compatibility** (§6.8): tools MUST keep supporting existing group syntax, SHOULD warn on deprecated patterns, MAY implement new features incrementally. Many tools still read the pre-2025 draft string syntax (`"16px"`, `"#ff00ff"`).

## What it changes for the skills
- skills/design-studio/references/process/system.md: write `*.tokens.json` in the 2025.10 object syntax and say so; use `$root`, `$extends`, `$deprecated`; keep `hex` only as fallback; put modes in a `.resolver.json` (cite `dtcg-2025-10`) when the toolchain supports it, otherwise per-mode files or `$extensions`, and state which; motion springs go in `$extensions` (no spring type).
- skills/design-studio/templates/tokens.resolver.json: its companion token files follow facts 3-14.
- skills/design-studio/references/process/system.md: when the host tool expects the old string syntax (older Style Dictionary / Tokens Studio setups), match the host and note the difference.

## Not verified / open
- Tool support thresholds (Style Dictionary, Terrazzo, Figma export) are not part of this source; see `dtcg-2025-10`.
- The published JSON Schema files were only checked for availability, not validated against the TR text.
- Correction vs the 2026-09-21 digest: it said a resolver/theming module was "still evolving"; the Resolver module has been part of the stable 2025.10 release since 2025-10-28.
