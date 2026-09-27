# Radix Colors: understanding the 12-step scale
- id: radix-colors-scale · url: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale · fetched: 2026-09-27 · method: fetch
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Radix Colors 把每条色阶固定为 12 级，每级对应一个用途（背景、组件底色、边框、实色、文字）。这种"色阶级别 = 角色契约"的做法让暗色模式和品牌主题只是重新映射；第 11、12 级文字在同色阶第 2 级背景上保证 APCA Lc 60 / Lc 90。

Read on 2026-09-27 (living documentation page, undated).

## Key facts
1. **12 steps, each with at least one use case** (§ Use cases table): 1 app background · 2 subtle background · 3 UI element background · 4 hovered UI element background · 5 active/selected UI element background · 6 subtle borders and separators · 7 UI element border and focus rings · 8 hovered UI element border · 9 solid backgrounds · 10 hovered solid backgrounds · 11 low-contrast text · 12 high-contrast text.
2. **Steps 1-2 - backgrounds** (§ Steps 1-2): main app background, striped table rows, code blocks, cards, sidebars, canvas areas; use interchangeably by feel. Light mode often uses white for the app background and dark mode step 1 or 2 of a grey or coloured scale - set up a mutable alias (`AppBg`) mapped per colour mode.
3. **Steps 3-5 - component backgrounds** (§ Steps 3-5): 3 normal, 4 hover, 5 pressed/selected; if a component is transparent at rest, use step 3 for its hover.
4. **Steps 6-8 - borders** (§ Steps 6-8): 6 subtle borders on non-interactive components (sidebars, headers, cards, alerts, separators); 7 subtle borders on interactive components; 8 stronger borders on interactive components and focus rings. (The summary table labels 8 "hovered UI element border"; the detail text says "stronger borders … and focus rings".)
5. **Steps 9-10 - solid backgrounds** (§ Steps 9-10): 9 has the highest chroma - the purest step, least mixed with white or black - used for app/section/header/component backgrounds, graphics and logos, overlays, coloured shadows, accent borders; 10 is the hover state of a step-9 background.
6. **Foreground on step 9**: most step-9 colours are designed for white text; **Sky, Mint, Lime, Yellow and Amber** are designed for dark text on steps 9 and 10.
7. **Steps 11-12 - text** (§ Steps 11-12; the guarantee sentence sits under § Steps 3-5): 11 low-contrast text, 12 high-contrast text; they are **guaranteed to reach APCA Lc 60 (step 11) and Lc 90 (step 12)** on a step-2 background of the same scale.

## What it changes for the skills
- skills/design-studio/references/fundamentals/color.md: adopt the step-to-role mapping as the default semantic layer whatever generates the primitives (backgrounds 1-2, component states 3-5, borders 6-8, solids 9-10, text 11-12); dark mode and brand themes are re-mappings of the same roles.
- skills/design-studio/references/fundamentals/color.md: when quoting Radix's contrast guarantee, say it is APCA (Lc 60 / Lc 90 on step 2), and report WCAG 2 ratios alongside - APCA is not the legal reference (see `wcag-22`, `accessibility-law`).
- skills/design-studio/references/process/system.md and templates/tokens.css: name semantic tokens by role (bg, bg-subtle, component, component-hover, component-active, border-subtle, border, border-strong, solid, solid-hover, text-muted, text) so a 12-step scale plugs in directly; mark the five light step-9 hues that need dark text.

## Not verified / open
- Exact colour values were not recorded (they are perishable and published in the Radix packages).
- Correction vs the 2026-09-21 digest: it said steps 11-12 "keep accessible contrast (the project targets APCA)"; the page states concrete guarantees - Lc 60 and Lc 90 on step 2 - and it omitted the five hues designed for dark foreground text.
