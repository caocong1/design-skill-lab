# Anthropic `frontend-design` skill

> Source: https://github.com/anthropics/skills (skills/frontend-design/SKILL.md; also shipped as a Claude Code plugin) ｜ Publisher: Anthropic ｜ Published: first released late 2025, substantially rewritten by mid-2026 ｜ Fetched: 2026-09-20 ｜ Method: fetched by a research agent with curl; three snapshots (2025-12, 2026-06, current) were compared
> Companion article: https://claude.com/blog/improving-frontend-design-through-skills (not re-fetched)
> This file is a **paraphrased structured digest**, not a verbatim copy.

## Summary

A single, short skill that casts the model as the design lead of a studio whose client has already rejected templated proposals. Its core demand: ground the design in the subject matter, make deliberate and specific choices, and check the plan for generic defaults before writing code. The 2025-12 version was a brief call for bold aesthetic direction; the current version roughly doubled in length and added a process, a list of current "generated-looking" clusters, and a section on writing.

## Key rules / claims

1. **Ground in the subject**: identify the product, audience and the page's primary job (propose them if the brief is silent). Distinctive choices come from the subject's industry, materials and vernacular. Build with real content.
2. **Hero**: open with the most characteristic thing in the subject's world, in the most fitting form. "Big number, small label, supporting stats, gradient accent" is the default treatment - use it only if truly best.
3. **Typography carries the personality**: one family or two clearly distinct ones; chosen deliberately, not the usual defaults; a clear scale; type treatment as an active element. Line length under 80 characters; serif body gets slightly more line-height.
4. **Typographic tells to avoid**: accenting a single word in a headline; all-caps labels; unnecessary labels above content.
5. **Structure is information**: borders, numbering, eyebrows and dividers must encode something. Numbered markers (01 / 02 / 03) only for real sequences.
6. **Motion**: non-user-triggered motion sparingly - one orchestrated moment beats scattered effects. Fade-and-slide-up on every section and hover transitions on every card read as generated. Motion answering a user action is welcome.
7. **Current clusters of AI-generated design** (as of the fetch date): (a) warm cream background near `#F4F1EA`, high-contrast serif display, terracotta accent near `#D97757`; (b) near-black background with one acid-green or vermilion accent; (c) broadsheet layout with hairline rules, zero radius, dense columns; (d) the SaaS card kit - identical rounded cards, one radius everywhere, the same soft grey shadow, gradient washes; (e) template chrome - tracked-out all-caps eyebrows, middle-dot meta strings, "WORD - fragment" labels, tinted near-black standing in for black, monospace for small data labels, an arrow appended to links and buttons. All are legitimate for some brief; they are defaults rather than choices. The brief's own words always win, including when it asks for one of these looks.
8. **Process**: two passes. First a compact plan - 4-6 named colours, typefaces and roles, a layout concept with ASCII wireframes and alignment guidance, and principles. Then review the plan against the brief: anything that reads like what you would produce for any similar page gets revised, stating what changed and why. Only then write code. Watch CSS specificity conflicts between section and element selectors.
9. **Restraint**: spend boldness in one place; keep the rest quiet; remove one accessory. Meet a quality floor without announcing it: responsive, visible focus, reduced motion, accessible, harmonious colour. Critique your own work with screenshots if the environment allows; keep notes of what was tried.
10. **Writing**: words are design content. Write from the user's perspective in plain, specific language; active voice; a CTA says exactly what happens and keeps its name through the flow; errors explain what happened and how to fix it without apologising; empty states invite action; sentence case; each element does one job.

## What is perishable vs durable

Durable: subject-grounded choices, plan-then-review-then-build, one bold move, writing as design, screenshots as self-critique. Perishable: the list of clusters in rule 7 - it describes model output at a moment in time and had already changed between the 2025 and 2026 versions (the earlier tells were generic fonts and purple gradients). A list of tells is a dated observation, not a rule.

## Notes for the skill

This is the baseline any design skill must beat. It validates this suite's render-and-look loop and its anti-default stance, and it supplies a better formulation: the problem is not any particular look but choices that appear **regardless of subject**. `references/anti-slop.md` should teach that test and date its examples.
