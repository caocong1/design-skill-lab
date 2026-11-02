# Figma Make guidelines files: Guidelines.md, the guidelines folder and the library size limits
- id: figma-make-guidelines · url: https://help.figma.com/hc/articles/43602393097239 · fetched: 2026-11-01 · method: fetch
- review_by: 2027-01-30 (perishable +90d: "During beta") · licence note: paraphrased digest, not a mirror (Figma Help Center terms)
> 中文导语：Figma Make 读的是自家的 Markdown 约定：`Guidelines.md` 永远先读（可改名），其余按设计系统的组成分文件夹（foundations、components、composition），token 与组件各一份文件，写"何时用、语义、对错示例、API"；多个短文件优于一个长文件，并按上下文窗口做渐进披露。设计库里的 guidelines 文件只收 .md/.txt/.json，建议 3–8 个文件、合计 100 KB 以内，硬上限 200 KB。两篇文章都不提 DESIGN.md、DTCG 或 tokens JSON。这回答了"托管设计系统是否读 DESIGN.md"中 Figma Make 的一项：不读。

Read on 2026-11-01: "Write design system guidelines for Make kits" (article 43602393097239) and "Add guidelines files to a design library" (article 43509372175511); help-centre articles, undated. First read by a verifying subagent, then both re-fetched for the quotes below.

## Key facts
1. "`Guidelines.md` is the initial set of guidelines that Figma Make always looks at first." The name can be changed to suit the design system.
2. Files "are arranged in folders that correspond to the parts of the design system". The initial Make-kit tree shows `guidelines/components/`, `Guidelines.md`, `setup.md`, `styles.md`, `tokens.md`; the expanded example adds `guidelines/composition/` (hierarchy, icons, layout, overview, surfaces), `foundations/` (color, icons, modes, spacing, input_styling) and root files `icon-discovery.md`, `setup.md`, `overview.md`.
3. Token files cover, per token type: an overall philosophy of use; groups with their naming and usage patterns; specific tokens with examples; higher-level examples of tokens used together. "We commonly see tokens for colors, typography, and spacing, but you can add guidelines for any token type."
4. Component files cover: when to use it, and with or within which other components; its semantic purpose; correct and incorrect usage examples; its API and properties.
5. "Many short files for specific areas of the design system are better than a small number of lengthy guidelines"; "Build your guidelines with progressive disclosure and the size of the context window in mind"; overview files route Make to the specific ones so it does not load unnecessary content.
6. "Figma Make can read your design package and create guidelines for you when you're assembling your Make kit."
7. Design libraries accept `.md`, `.txt` and `.json` guidelines files; "aim for three to eight focused files with a combined size under 100 KB"; "The combined size of all guidelines files in a library can't exceed 200 KB"; menu Library > Manage guidelines…; Professional, Education, Organization and Enterprise plans; "During beta".
8. "guidelines files in a published library in Figma Design are not currently used when creating a Make kit."
9. Neither article mentions DESIGN.md, DTCG or tokens JSON.

## What it changes for the skills
- skills/design-studio/references/process/system.md section 8: the Figma Make row becomes verified: hand it a `Guidelines.md` plus a folder, inside the size limits; DESIGN.md is not read.
- skills/design-studio/references/process/handoff.md: when the host builds in Figma Make, the handoff carries the guidelines folder as a projection of DESIGN.md and the tokens.

## Not verified / open
- No statement on how Make weighs the guidelines against the design package's code when they disagree.
- Whether a `.json` guidelines file may be a DTCG token file is not stated; the articles call them guidelines, not variables.
