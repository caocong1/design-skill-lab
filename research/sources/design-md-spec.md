# DESIGN.md format (Google Labs): spec "alpha", @google/design.md CLI 0.4.0, and how Stitch consumes it
- id: design-md-spec · url: https://github.com/google-labs-code/design.md · fetched: 2026-09-27 · method: repo@9bf8eae67128b6cc55ad9bf86665767deb4c11cd
- review_by: 2026-12-26 (perishable +90d) · licence note: paraphrased digest, not a mirror (source is Apache-2.0)
> 中文导语：DESIGN.md 是给 agent 读的设计系统文件。YAML front matter 写 token，Markdown 正文按固定顺序写设计理由。规范版本号是 "alpha"，0.4.0 是 CLI 的版本号。本文记录规范、PHILOSOPHY、CLI 的 lint/diff/export 行为，其中导出实测有损：广色域被压成 sRGB，引用被展开，em 单位会生成非法的 DTCG。另外记录 Stitch 如何读写 DESIGN.md。写 DESIGN.md 模板、做系统互通或交接之前先读本文。

Read on 2026-09-27:
- **Repo, cloned at `9bf8eae`.** This is `main` HEAD, "release: 0.4.0 (#161)", 2026-07-27. Files read: `README.md`, `PHILOSOPHY.md`, `docs/spec.md` (generated from `spec-gen/spec.mdx` plus `spec-config.ts`, which loads `packages/cli/src/linter/spec-config.yaml`), the parser, the DTCG exporter and the lint rules.
- **Registry and GitHub metadata.** npm registry, GitHub releases, and open pull requests.
- **CLI runs (measured).** `npx @google/design.md@0.4.0` was run against probe files.
- **Stitch docs.** https://stitch.withgoogle.com/docs/design-md/{overview,get-instructions,specification,usage,linting-rules}/, `/docs/mcp/reference/` and `/docs/skills/reference/`, rendered in headless Chrome. The text lives in an `app-companion-430619.appspot.com` iframe.
- **Related repos.** `google-labs-code/stitch-skills` at `0337446` and `VoltAgent/awesome-design-md` at `f696123`.

## Key facts
**Status and versions**
1. **Repository.** `google-labs-code/design.md`: Apache-2.0, 28,119 stars on 2026-09-27; created 2026-04-10, last push 2026-09-14.
2. **npm releases of `@google/design.md`.** 0.1.0 and 0.1.1 on 2026-04-21, 0.2.0 on 2026-05-26, 0.3.0 on 2026-06-15, **0.4.0 on 2026-07-27** (latest). Requires Node ≥ 18. It installs two bins, `design.md` and `designmd`; the latter exists because Windows treats the `.md` suffix as a file association.
3. **The spec has no numbered version yet.** Its `version` field is **`"alpha"`**: see the spec-config.yaml line `version: alpha` and the README's Status section ("Expect changes to the format"). "0.4" is the CLI version.
4. **Unmerged work at `9bf8eae`** (open PRs, which show where the format is heading):
   - #178 (2026-09-14): interleaved YAML code blocks in the spec.
   - #177: make the DTCG export emit the required `lineHeight`/`letterSpacing`.
   - #176: project-defined component sub-tokens.
   - #169: "hypertokens".
   - #168: shadow export.
   - #167: a `prose-token-leak` rule.
   - #166: axis-specific padding.
   - #164: physical units pt/mm/cm/in.

**Format** (docs/spec.md)
5. **File layout.** A DESIGN.md has an optional YAML front matter (between lines that are exactly `---`) followed by a Markdown body. **The tokens are normative and the prose gives context.** Prose may use descriptive colour names such as "Midnight Forest Green" for token names such as `primary`.
6. **Schema.**
   - `version?`, `name`, `description?`, `omitted?`.
   - `colors: map<Color>`, `typography: map<Typography>`, `rounded: map<Dimension>`.
   - `spacing: map<Dimension | number>` (a unitless number can be a column count or a ratio).
   - `components: map<map<string | {ref}>>`.
7. **Color values.** Any CSS colour string is accepted:
   - hex `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`;
   - named colours;
   - `rgb()`/`rgba()`/`hsl()`/`hsla()`/`hwb()`;
   - `oklch()`/`oklab()`/`lch()`/`lab()`;
   - `color-mix(in srgb, …)`. Weights may be omitted, but since 0.4.0 a weight that is given must be a percentage: `red 20` is a lint error, `red 20%` is fine (measured).

   Colours are converted to sRGB for contrast checks. **Hex `#RRGGBB` is the recommended default.**
8. **Dimension and typography values.**
   - A Dimension is a string with the unit **px, em or rem**.
   - Typography properties: `fontFamily` (string), `fontSize`, `fontWeight` (a number, bare or quoted), `lineHeight`, `letterSpacing`, `fontFeature` (maps to `font-feature-settings`), `fontVariation` (maps to `font-variation-settings`).
   - `lineHeight` takes a Dimension or a unitless number; unitless is recommended.
9. **References and nesting.**
   - A reference `{path.to.token}` must point at a primitive value. The exception is inside `components`, where composites such as `{typography.label-md}` are allowed.
   - Limits: token nesting depth 20, reference depth 10.
   - Nested maps such as `colors.background.light` have been supported since 0.3.0.
10. **`omitted` (0.4.0).** Lists sections that are deliberately absent, either as bare names or as `{section, reason}`, so the missing-section warnings stay quiet.
11. **Components.** Each component maps to sub-tokens. The only valid sub-tokens are `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height` and `width`. **States are sibling keys** (`button-primary-hover`, `-active`, `-pressed`). The spec says the components section "is actively evolving".
12. **Sections.** Sections are `##` headings; an optional H1 is not parsed. Sections may be omitted, but those present should follow this order (`docs/spec.md` says "should", the README says "must", and the linter only warns):
    1. Overview (also "Brand & Style")
    2. Colors
    3. Typography
    4. Layout (also "Layout & Spacing")
    5. Elevation & Depth (also "Elevation")
    6. Shapes
    7. Components
    8. Do's and Don'ts

    Within them, Colors says "at least the `primary` color palette must be defined", by convention primary, secondary, tertiary and neutral. Typography notes that "Most design systems have 9 - 15 typography levels". Layout notes that some systems (Liquid Glass is the example) use margins, safe areas and dynamic padding instead of a grid.
13. **Recommended token names** (non-normative):
    - Colours: primary, secondary, tertiary, neutral, surface, on-surface, error.
    - Typography: headline-display, headline-lg, headline-md, body-lg, body-md, body-sm, label-lg, label-md, label-sm.
    - Rounded: none, sm, md, lg, xl, full.
14. **Content the spec does not know.**
    - Unknown section: preserved, no error.
    - Unknown colour or typography name: accepted if the value is valid.
    - Unknown spacing value: kept as a string.
    - Unknown component property: accepted with a warning.
    - **Duplicate section heading: an error; the file is rejected.** Measured with 0.4.0: a file with two `## Colors` headings lints clean (no finding, exit 0), so the CLI does not enforce this rule.
15. **Parser behaviour** (`parser/handler.ts`, and measured). Tokens are read from the front matter **and from every fenced ```yaml / ```yml block in the body**, then merged. If the same top-level key appears in two blocks, the parser raises DUPLICATE_SECTION. In that case lint reports **one warning and ignores all tokens**; measured exit code 0. A file with no YAML at all produces a single warning: "No YAML content found".

**PHILOSOPHY.md**
16. **Intent over precision.** "The quality of a generated design is determined less by the precision of its values than by how clearly the intent is described." Prose is the focus of the format. Tokens are "context", not rendering instructions, and the maintainers "do not accept or recommend token requirements" in the spec.
17. **"Adjectives describe a region. A specific reference describes a point."** The worked example is a 1970s graduate lecture handout. Words like "modern, clean, trustworthy, premium" steer the model to the centre of what they describe, so the output is generic.
18. **Negative constraints.** A specific reference carries its own restrictions ("naming a dog tells the model that dogs don't meow"). A strong reference plus an intentional Do's/Don'ts list is the sweet spot. A long, rambling list of don'ts signals a description that was too vague.
19. **The format grows through its users.** Motion, iconography, elevation, casing and measure are left open. The document's example is a custom `motion:` YAML block (120ms feedback, 250ms content, `cubic-bezier(0.2, 0, 0, 1)`, all durations at 0ms under reduced motion), and it claims "the linter accepts these values".

    **Measured with 0.4.0:** custom top-level keys whose values look like tokens (`motion:`, `modes:`) trigger `token-like-ignored` warnings saying they "will be silently ignored by export commands".

**CLI** (`@google/design.md` 0.4.0)
20. **Commands.** `lint`, `diff`, `export` and `spec`. Each takes a file path or `-` for stdin and outputs JSON by default. A programmatic API is also available: `import { lint } from '@google/design.md/linter'` returns findings, a summary and the parsed design system.
21. **`lint`** exits with code 1 when there are errors. It runs **11 rules** (listed in the README and by `spec --rules-only --format json`):
    - **broken-ref** (error). An unknown component sub-token is also reported under this rule, but as a warning (measured).
    - **missing-primary** (warning).
    - **contrast-ratio** (warning). Checks only pairs of `backgroundColor`/`textColor` declared in components, against a single **4.5:1** threshold, with no 3:1 allowance for large text.
    - **orphaned-tokens** (warning). Fires only when at least one component exists. Material 3 colour families are exempt: primary, secondary, tertiary, error, surface, background and outline, plus their `on-`, `-container`, `-fixed` and other variants.
    - **token-summary** (info).
    - **missing-sections** (info; for spacing and rounded).
    - **missing-typography** (warning).
    - **section-order** (warning).
    - **unknown-key** (warning). Catches typos such as `colours` for `colors`.
    - **token-like-ignored** (warning).
    - **omitted-rules** (info).

    Version 0.4.0 also warns about typography sub-property typos and about name collisions between flattened and nested keys.
22. **`diff before after`.**
    - Output lists tokens added, removed and modified for colors, typography, rounded, spacing and components. It also gives finding counts before and after, with the delta.
    - **`regression: true` and exit code 1 when the "after" file has more errors or more warnings.**
    - Measured: the output contains no prose diff, despite the README's mention of "prose regressions". A component shows as modified when a colour it references changes.
23. **`export --format`** offers five formats:
    - `css-tailwind`: a Tailwind v4 `@theme` block with `--color-*`, `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*`, `--radius-*` and `--spacing-*` variables.
    - `json-tailwind`: a Tailwind v3 `theme.extend` object.
    - `tailwind`: an alias of `json-tailwind`.
    - `dtcg`: DTCG token JSON.
    - `css-vars`: `:root` custom properties with an optional `--prefix`. Added in 0.4.0 and missing from the README table; confirmed by the CLI's error message for an invalid format.

    Exit codes are 0 on success, whatever lint would say; 1 for an invalid format or an emitter error; 2 for an unreadable file (all verified).
24. **`spec`** accepts `[--rules] [--rules-only] [--format markdown|json]`. It prints the spec so it can be injected into agent prompts.
25. **What the DTCG export loses** (from reading `dtcg/handler.ts` and running a probe file):
    - It writes `$schema` pointing at the 2025.10 format.json.
    - **Every colour becomes `colorSpace: "srgb"`** with components rounded to 3 decimals and a lowercase hex. `oklch(62% 0.25 250)` came out as `#0083ff`, so wide-gamut colours are clipped.
    - **Aliases are resolved into values** rather than kept as references.
    - **Components are not exported.**
    - Unitless spacing numbers are dropped.
    - **`em` values are written as `unit: "em"`**, which is invalid DTCG (only px and rem are allowed).
    - **`lineHeight: 24px` is written as `24`**, which DTCG reads as a 24× multiplier.
    - Typography is written with only the fields that are present, while the DTCG schema requires all five (PR #177 is open).
    - The Tailwind and css-vars exports also turn colours into hex, and css-vars omits typography entirely.

**Stitch and other consumers**
26. **Stitch's framing.** The overview page calls DESIGN.md "the design counterpart to AGENTS.md": README.md is read by humans, AGENTS.md by coding agents, DESIGN.md by design agents. It describes three ways to create one: the agent generates it from a vibe prompt, it is derived from a brand URL or image, or it is written by hand. Stitch's specification page follows `docs/spec.md` but lags it (see fact 29).
27. **Stitch UI behaviour** (`/docs/design-md/usage/`).
    - The Design System panel shows the resolved colours, fonts, roundedness, spacing and components.
    - A project default applies **only to newly generated screens**; existing screens must have it applied explicitly.
    - The panel can edit only the primary, secondary, tertiary and neutral colours, the headline, body and label fonts, and roundedness. Everything else is changed by editing the Markdown.
    - A project export zip includes DESIGN.md.
28. **Stitch MCP** (`/docs/mcp/reference/`) has 14 tools. Six handle design systems: `create_design_system`, `update_design_system`, `list_design_systems` (read-only), `apply_design_system`, `upload_design_md` and `create_design_system_from_design_md`.
    - Uploading from a file is a two-step flow. `upload_design_md` takes base64-encoded UTF-8 and returns a screen instance. That instance goes into `create_design_system_from_design_md` (optional `deviceType`: MOBILE, DESKTOP, TABLET or AGNOSTIC), which returns an `assetId` for `apply_design_system`.
    - What Stitch stores is a **seed-based `DesignTheme`**. Required fields are `colorMode`, `headlineFont`, `bodyFont`, `roundness` and `customColor`:
      - `colorMode`: LIGHT or DARK.
      - `headlineFont`, `bodyFont` and `labelFont` (optional), chosen from an enum (INTER, DM_SANS, GEIST, …).
      - `roundness`: ROUND_FOUR, ROUND_EIGHT, ROUND_TWELVE or ROUND_FULL (the enum table also lists ROUND_TWO as deprecated).
      - `customColor`: a hex seed.
      - `colorVariant`: MONOCHROME, NEUTRAL, TONAL_SPOT, VIBRANT, EXPRESSIVE, FIDELITY, CONTENT, RAINBOW or FRUIT_SALAD.
      - Optional hex overrides for primary, secondary, tertiary and neutral.
      - `designMd`: the Markdown as a string.
29. **Stitch docs that disagree with the 0.4.0 CLI.**
    - The linting-rules page lists **8** rules, not 11, and files unknown component properties under the error rule `broken-ref`.
    - The overview example says "Do maintain **4:1** contrast ratio for all text". The spec and the linter use WCAG AA **4.5:1**. Do not copy the Stitch example.
    - The specification page still types Color as "# + hex code (sRGB)" and its schema has no `omitted` key, while `docs/spec.md` at 0.4.0 accepts any CSS colour and defines `omitted`.
30. **Stitch Design Skills** (`google-labs-code/stitch-skills` at `0337446`, 8,378 stars).
    - **Path convention:** `.stitch/DESIGN.md`.
    - The docs say "13 agent skills in three plugins" (stitch-design, stitch-build, stitch-utilities); the repo actually has **16** SKILL.md files.
    - The main DESIGN.md skills:
      - `extract-design-md`: source code to DESIGN.md, no build needed.
      - `design-md`: rendered Stitch screens to DESIGN.md.
      - `manage-design-system`: uploads and applies a design system.
      - `code-to-design`: the orchestrator.
      - `taste-design`: produces a "premium" DESIGN.md.
    - Install with `npx plugins add google-labs-code/stitch-skills --scope project --target claude-code` (or `cursor`, `gemini-cli`, `antigravity`).
    - Stitch's extraction prompt treats the repository as the source of truth and says "nothing invented, nothing placeholder". It says to inherit an existing design system, and to let the product's data shape (a timeline, a graph, a catalog) organise the page.
31. **`VoltAgent/awesome-design-md`** (`f696123`, 118,191 stars, MIT) is a collection of DESIGN.md files "extracted from real websites". It is useful for studying style DNA, but the brands' IP stays with the brands.

## What it changes for the skills
- **skills/design-studio/references/process/system.md**
  - DESIGN.md *describes* the system. `tokens.css`, `*.tokens.json` and `*.resolver.json` *implement* it. Say "spec alpha, CLI 0.4.0".
  - Run `npx @google/design.md lint` when the file is written and `diff` when it changes (exit code 1 = regression).
  - Treat `export` as lossy and never as the token source: it clips to sRGB, flattens aliases, drops components, and may emit invalid `em` units.
  - The contrast-ratio rule covers only declared component pairs at 4.5:1, so it does not replace a full contrast matrix.
- **skills/design-studio/templates/DESIGN.md**
  - Keep the canonical section order and define `primary`.
  - Give every typography level all five properties, with a unitless `lineHeight` and `letterSpacing` in px or rem, so a DTCG export stays valid. The px/rem constraint is our inference from fact 25, not a spec rule.
  - Declare both `backgroundColor` and `textColor` on components, so the linter checks their contrast. Write states as sibling keys.
  - Do not add custom top-level YAML keys (modes, motion), and do not put stray ```yaml fences in the prose. Describe modes and motion in prose sections and keep their values in the token files.
- **skills/design-studio/references/process/truth-files.md and process/directions.md**
  - Replace adjective lists and tone sliders with one specific referent sentence ("a point, not a region") plus an intentional Do's/Don'ts list (PHILOSOPHY).
- **skills/design-studio/references/disciplines/motion-tokens.md**
  - DESIGN.md has no motion vocabulary, and a custom `motion:` YAML block warns in 0.4.0 and is dropped by exporters. Motion lives in DTCG / `tokens.css` (see `dtcg-2025-10`) and is described in prose.
- **skills/design-studio/references/process/handoff.md and platforms/embedded-hosts.md (hosted design-system interop)**
  - For Stitch: put the file at `.stitch/DESIGN.md` and upload it with the two MCP tools.
  - Expect Stitch to reduce the system to a seed colour, variant, 3 enum fonts and 4 roundness levels. A project default does not restyle existing screens.
- **skills/critique-design/SKILL.md (mechanical track) and skills/design-studio/scripts/lint.mjs**
  - `design.md lint` JSON can be one evidence input. Its findings are not a pass on accessibility or quality.

## Not verified / open
- **How `create_design_system_from_design_md` maps a full DESIGN.md onto `DesignTheme`** (for example, whether a 12-colour palette or custom font survives). Not tested: it would mean writing to a live Stitch project.
- **When DESIGN.md was open-sourced.** The claim "open-sourced on 2026-04-23" in the audit's research-knowledge.md comes from a secondary source. The primary sources show the GitHub and npm 0.1.0 release on **2026-04-21**, and the repo was created on 2026-04-10.
- **Stitch's CLI page.** `/docs/design-md/cli/` rendered the generic docs landing page in headless Chrome, so its content was not read.
- **Other hosts.** Whether Claude Design, v0, Lovable or Figma Make read DESIGN.md natively was not checked here.
- **Stitch March-2026 redesign.** The claim that it made DESIGN.md first-class (from the audit's research-skills.md) was not verified from a primary source.
- **Fact-check pass 2026-09-27.** An independent re-read of the repo at `9bf8eae`, npm, the GitHub API, the Stitch pages (headless Chrome), the two related repos, and fresh CLI 0.4.0 probe runs corrected facts 7, 12, 26 and 28, and added findings to 14 and 29. Everything else matched the sources, including all export, diff and exit-code measurements.
