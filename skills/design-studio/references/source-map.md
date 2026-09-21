# Source Map

Which evidence backs which part of the suite. When this skill is installed
outside the lab (for example symlinked into `~/.claude/skills/` or
`~/.codex/skills/`), the `analysis/` and `raw/docs/` paths below are
unavailable; use the upstream links. Paths are relative to the lab repository
root.

## Evidence Levels

Not every file rests on the same ground. Be more willing to override a
lower-evidence file with the official source or the user's knowledge.

| Level | Meaning |
| --- | --- |
| **digest** | Backed by a primary source fetched and digested in the lab on the stated date |
| **measured** | Produced or verified by a script in this repository |
| **practice** | Written from general professional knowledge; not verified against a fetched source in this lab |

| File | Level | Notes |
| --- | --- | --- |
| `typography.md` | digest + practice | Latin body-text numbers and CJK typesetting rules are digest-backed; font-selection advice is practice |
| `color.md` | digest + measured | step-to-role mapping is digest-backed; contrast and scales are computed by `scripts/color_tools.py`; APCA thresholds are practice and APCA itself is draft |
| `layout-and-spacing.md` | digest + practice | numeric craft rules are digest-backed; window classes and density values are practice |
| `anti-slop.md` | digest | all three dated lists and the "cures decay" timeline come from fetched sources; the test itself is the durable part |
| `render-and-look.md` | measured + practice | the colour-scheme and 500 px minimum-width traps were observed while building `scripts/shot.sh` and the lab's docs page |
| `quality-rubric.md` | practice | anchors are untested against real reviews |
| `licensing.md` | practice + digest | specific licence facts in the catalogue were read at the source; this file is general guidance, not legal advice |
| `resources/*.md` | measured | generated from the catalogue; `agent_access` is observed by `scripts/check-links.py` |
| `../../design-motion/references/motion-tokens.md` | digest + practice | durations, press scale, easing and spring parameters are digest-backed; platform snippets are practice |
| `../../build-design-system/references/token-formats.md` | digest | DTCG 2025.10 and DESIGN.md (alpha) as fetched |
| `../../design-product-ui/references/platforms.md` | practice + digest | only the mini-program section is digest-backed; Apple, Android and HarmonyOS details must be checked against the official pages |
| `../../design-product-ui/references/data-dense-ui.md` | practice | |
| `../../design-product-ui/references/ai-ux.md` | digest + practice | the six families are digest-backed; mechanics are practice |
| `../../design-icons/references/app-icons-and-favicons.md` | practice | perishable; verify before export |
| `../../design-graphics/references/production.md` | practice | sizes are perishable; verify before export |
| `../../design-brand-identity/references/guidelines-template.md` | practice | |
| `../../implement-design/references/stacks.md` | practice | verify APIs against installed versions |

## Analyses

| Analysis | Informs |
| --- | --- |
| `analysis/01-inspiration-site-landscape.md` | the catalogue design, `find-design-inspiration`, `resource-map.md`, `iterate-design-lab` |
| `analysis/02-ai-design-skills-survey.md` | suite architecture, `anti-slop.md`, `explore-design-directions`, `token-formats.md`, `quality-rubric.md` |
| `analysis/03-web-interface-craft.md` | `critique-design`, `layout-and-spacing.md`, `color.md`, forms and feedback rules in `design-product-ui` |
| `analysis/04-motion-principles.md` | `design-motion` and `motion-tokens.md` |
| `analysis/05-visual-fundamentals.md` | `typography.md`, `color.md`, `scripts/color_tools.py`, `build-design-system` |
| `analysis/06-icon-design-rules.md` | `design-icons` |
| `analysis/07-design-tokens-and-design-md.md` | `build-design-system`, `token-formats.md` |
| `analysis/08-chinese-typography-and-platforms.md` | CJK sections of `typography.md`, `licensing.md`, mini-program and HarmonyOS sections of `platforms.md` |
| `analysis/09-ai-ux-patterns.md` | `ai-ux.md` |
| `analysis/10-overall-design-synthesis.md` | the core rules in `../SKILL.md`; the durable / perishable split |
| `analysis/11-distilled-skill-design.md` | suite shape, non-goals, known self-violations |

## Digests and Upstream Links

| Digest (`raw/docs/`) | Upstream | Fetched |
| --- | --- | --- |
| `anthropic-frontend-design-skill.md` | https://github.com/anthropics/skills/tree/main/skills/frontend-design · https://claude.com/blog/improving-frontend-design-through-skills | 2026-09-20 / 21 |
| `impeccable-slop-rules.md` | https://impeccable.style · https://impeccable.cn/slop · https://github.com/pbakaus/impeccable | 2026-09-21 |
| `vercel-web-interface-guidelines.md` | https://vercel.com/design/guidelines · https://github.com/vercel-labs/web-interface-guidelines | 2026-09-21 |
| `emil-kowalski-animation.md` | https://emilkowal.ski/ui/great-animations · https://emilkowal.ski/ui/7-practical-animation-tips | 2026-09-21 |
| `material-motion-tokens.md` | https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md · https://m3.material.io/styles/motion/overview | 2026-09-21 |
| `lucide-icon-design-principles.md` | https://lucide.dev/contribute/icons/design-principles | 2026-09-21 |
| `radix-colors-scale.md` | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale | 2026-09-21 |
| `practical-typography-key-rules.md` | https://practicaltypography.com/summary-of-key-rules.html | 2026-09-21 |
| `hobday-visual-design-rules.md` | https://anthonyhobday.com/sideprojects/saferules/ | 2026-09-21 |
| `laws-of-ux.md` | https://lawsofux.com | 2026-09-21 |
| `design-md-format.md` | https://github.com/google-labs-code/design.md · https://stitch.withgoogle.com/docs/design-md/specification | 2026-09-21 |
| `dtcg-design-tokens-format.md` | https://www.designtokens.org/tr/2025.10/format/ | 2026-09-21 |
| `shape-of-ai.md` | https://www.shapeof.ai | 2026-09-21 |
| `clreq-chinese-text-layout.md` | https://www.w3.org/TR/clreq/ | 2026-09-20 |
| `chinese-copywriting-guidelines.md` | https://github.com/sparanoid/chinese-copywriting-guidelines | 2026-09-20 |
| `wechat-miniprogram-design-guidelines.md` | https://developers.weixin.qq.com/miniprogram/design/ | 2026-09-20 |

## Known Evidence Gaps

Not digested because the site is a JavaScript app or was unreachable from the
maintainer's network on the fetch dates; listed in the catalogue, cited only
by name in the skills:

- Apple Human Interface Guidelines (including app icons and motion), WWDC
  talks on fluid interfaces and springs
- Material Design 3 guidance pages (tokens were obtained from Google's
  Android components repository instead)
- HarmonyOS design guidelines; Ant Design design values
- Nielsen Norman Group heuristics and response-time limits
- Refactoring UI public articles; Evil Martians on OKLCH (fetched, not
  digested); Stripe on accessible colour systems
