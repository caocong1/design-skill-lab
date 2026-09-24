---
name: design-studio
description: Senior-designer entrypoint and router for any design task - web front-end, mobile and desktop app UI, motion, icons, brand identity, and graphic design (posters, social graphics, decks). Use to turn requirements into a complete design (brief, directions, design system, key screens), design a single page or component, find and deconstruct inspiration for a site or app, present several distinct design options, critique or redesign an existing interface, and land a design in code with visual QA. 设计、UI、界面、动效、图标、品牌、Logo、海报、配色、字体、灵感、多套方案。
metadata:
  version: 0.6.0
  short-description: Route design work to focused skills
---

# Design Studio

Use this skill as the suite entrypoint. It frames the job the way a senior
designer would, then routes to the smallest set of focused skills.

## Role and Medium

This suite is the **designer**: it decides, draws, specifies, hands off and
reviews. Building the product in its target stack is the **implementer's** job
(a coding agent or a developer), whatever that stack is.

- The drawing medium is always HTML, CSS and SVG rendered to PNG - the way a
  human designer draws every platform in one canvas tool. It is also a
  description any coding agent can translate into Flutter, SwiftUI, Compose,
  ArkUI, a mini-program or a web framework.
- The **target** - web, iOS, Android, HarmonyOS, mini-program, desktop, data
  wall - changes the frame, the conventions and the constraints. It never
  changes the medium, the method or the quality bar. No target is out of scope
  because of the language it is built in.
- Stack-specific knowledge makes the implementer's translation better. It is
  an optimisation offered on request, not a precondition for designing.

See `references/portable-mockups.md`.

## Route First

Read only the child skill(s) the task needs:

| Need | Read |
| --- | --- |
| Turn a fuzzy request into a brief; produce 2-4 genuinely different directions; help the user choose and converge | `../explore-design-directions/SKILL.md` |
| Find references, deconstruct them, tear down competitors, extract a style's DNA, scan current trends, or suggest ideas for an existing site | `../find-design-inspiration/SKILL.md` |
| Screens, components, flows and states for web apps, mobile, desktop, admin systems, dashboards / big-screen, AI product UI | `../design-product-ui/SKILL.md` |
| Landing pages, marketing sites, portfolios, editorial and e-commerce pages | `../design-marketing-sites/SKILL.md` |
| Tokens, colour / type / space systems, component specs, theming, dark mode, `DESIGN.md`, token-drift audit | `../build-design-system/SKILL.md` |
| Micro-interactions, transitions, scroll and gesture motion, motion specs and demos | `../design-motion/SKILL.md` |
| UI icon sets, custom icons, app icons, favicons, SVG craft | `../design-icons/SKILL.md` |
| Logo, identity system, brand guidelines, rebrand | `../design-brand-identity/SKILL.md` |
| Posters, social graphics, OG images, decks, print, generative backgrounds | `../design-graphics/SKILL.md` |
| Review an existing design or implementation; heuristic, visual and accessibility audit; redesign plan; design QA | `../critique-design/SKILL.md` |
| Package a design for an implementer in any stack: acceptance shots, tokens, spec, assets; accept the build from screenshots | `../handoff-design/SKILL.md` |
| (For the implementer) land a handed-off design in a specific stack with fidelity | `../implement-design/SKILL.md` |
| Draw for a target: frame sizes, units, the portable HTML/CSS subset, how concepts map to native toolkits | `references/portable-mockups.md` |
| Where to look: galleries, pattern libraries, assets, tools, code, reading | `references/resource-map.md` |
| Which analysis or upstream source backs a rule | `references/source-map.md` |

Shared fundamentals every child skill relies on (read on demand, not up front):
`references/typography.md`, `references/color.md`,
`references/layout-and-spacing.md`, `references/anti-slop.md`,
`references/portable-mockups.md`, `references/render-and-look.md`,
`references/quality-rubric.md`, `references/licensing.md`.

## Modes

| Mode | The user wants | Pipeline |
| --- | --- | --- |
| `full` | A complete design from requirements | brief -> inspiration -> directions (user picks) -> system -> key screens / pages per target -> motion + icons + assets -> critique pass -> handoff |
| `piece` | One page, screen, component, flow, animation, icon, graphic | design read -> references -> the focused skill -> critique pass |
| `options` | Several schemes to choose from | `explore-design-directions`; combine with any other mode |
| `inspire` | Ideas and references, including for an existing site | `find-design-inspiration` |
| `critique` | An honest review and a fix plan | `critique-design` |
| `redesign` | A better version that keeps what works | critique -> equity audit -> directions -> system -> migration plan |
| `handoff` | A package an implementer can build from, in any stack | `handoff-design`; afterwards accept the build from screenshots |
| `implement` | The same agent is also asked to build it | `handoff-design` first, then `implement-design`, with `critique-design` as QA |

`options` is a modifier, not a separate job: any deliverable can be produced as
2-4 alternatives when the decision is genuinely the user's to make.

## Baseline Workflow

1. **Inspect the host first.** Existing brand, tokens, component library, fonts,
   icon set and conventions are constraints, not suggestions. Extend the
   existing system; do not fork it. Note the **targets** (platforms and sizes)
   the design must serve; the stack they are built in does not limit the
   design.
2. **State a design read** before producing anything: what this is, for whom,
   the feeling it should carry, the constraints that bind. Infer from context;
   ask at most one to three questions, and only ones whose answer would change
   the direction.
3. **Look at references before inventing.** Pick sources from
   `references/resource-map.md`, deconstruct 3-6 references, and take principles
   rather than pixels.
4. **Diverge before converging** on anything non-trivial. Directions differ on
   real axes (type voice, colour strategy, layout grammar, density, depth,
   imagery, motion personality), never as palette swaps.
5. **Define the system before the screens**: type scale, spacing scale, colour
   roles, radii, elevation, motion tokens. Even one page implies a system.
6. **Design the unhappy paths**: empty, loading, error, partial, overflow,
   long and mixed-script text, disabled, focus, offline, first-run, small and
   large viewports, dark mode, reduced motion.
7. **Render and look.** Every visual deliverable is drawn in a frame of its
   target's logical size, rendered, and inspected at the sizes, themes and
   states it claims to support. See `references/render-and-look.md`.
8. **Critique with a fresh eye** against the brief using
   `references/quality-rubric.md` before presenting. When the host supports
   subagents, the critic should not be the context that made the work.
9. **Deliver with rationale**: what was decided, why, what was rejected, what
   remains open, and the licence of every third-party asset used.
10. **Retro the skills, then close.** Run the close-out retro in
    `references/feedback.md`: corrections, deviations and gaps become entries
    in the lab inbox, and the final message ends with the `Skill feedback:`
    line.

## Core Rules

- Design is decision-making under constraints. "Appropriate for this audience
  and this job" outranks "impressive". An enterprise admin that is calm, dense
  and conventional is good taste; the same aesthetic on a fashion brand is not.
- The medium is markup; the eyes are screenshots; the target is anything. Work
  that was never rendered and looked at is a guess. If nothing in the
  environment can render, say so and mark the deliverable unverified.
- Design and implementation are different jobs. Do not drift from deciding and
  drawing into solving the implementer's build and test problems; hand over a
  contract that makes those problems easy.
- Models regress to the statistical mean of the web: the same sans-serif, the
  purple-to-blue gradient, the centred hero, three equal cards, uniform large
  radii, shadows on everything, emoji as icons, a glow on every dashboard.
  Treat each default as a decision to be justified from the brief, and treat
  novelty the same way. See `references/anti-slop.md`.
- Real content beats placeholder. Use the user's copy, data and assets; when
  inventing, write plausible domain-specific content. Never fabricate
  testimonials, customer logos, metrics or awards - label them as placeholders
  the user must replace.
- Hierarchy first: decide the one thing the viewer must see first, then second,
  then third. Most weak designs fail here, not in decoration.
- Constrain the vocabulary: a small type scale, one spacing scale, a few colour
  roles, one radius logic, one icon family, one motion personality.
  Consistency is what makes simple work look designed.
- Accessibility is a constraint, not a feature: contrast, target size, visible
  focus, semantic structure, colour independence, motion sensitivity.
- Separate durable from perishable. Perception, hierarchy, typography,
  accessibility and platform conventions are durable. Trend aesthetics, tool
  and library versions, platform pixel specs and social-media sizes are
  perishable: they carry a date, and are re-verified before they are relied on.
- Reference, never clone. Do not copy a single source's layout wholesale, and
  never copy logos, illustrations, photography, copy or distinctive trade
  dress. Combine structure from one place, typographic voice from another, and
  colour from the brand.
- Licensing is part of the design. Fonts, icons, illustrations, photos and
  code each have a licence; record it. Trial fonts and "free for personal use"
  assets do not ship. See `references/licensing.md`.
- Every recommendation carries a "because" tied to the brief, a principle or a
  cited reference. Every critique finding carries evidence.
- A finished turn is not a finished design. Completion is judged by looking at
  the rendered result against the brief, not by the author's confidence.
- Publish what the design does not try to do beside what it does.

## Output Location

Inside a host project, write design artefacts under `.design/` unless the
project already has a convention (check for `design/`, `docs/design/`,
`.stitch/`, a Storybook, or instructions in `AGENTS.md` / `CLAUDE.md`):

```text
.design/
  brief.md                      design read, brief, assumptions
  decisions.md                  decision log: chosen, rejected, why
  inspiration/<topic>.md        references with deconstruction
  directions/<round>/index.html options board (one file, same content per option)
  system/DESIGN.md              agent-readable design system
  system/tokens.css|json        tokens (CSS variables; DTCG JSON when cross-platform)
  system/preview.html           living style guide
  screens/<name>.html           page / screen mockups, one frame per target
  handoff/<feature>/            spec, acceptance shots, mockups, tokens, assets
  motion/<name>.html            motion demos + spec
  icons/<set>/                  SVGs + preview sheet
  brand/  graphics/             identity and artwork, with sources
  critique/<date>-<target>.md   review reports
```

When the host already keeps a system of record - a `DESIGN.md`, a token file,
a themed component library - update it in place instead of creating
`.design/system/`; two systems drift. When the same agent designs and
implements, `handoff` shrinks to the acceptance-shot list and the tokens
landing in the host source; the full handoff folder is for a separate
implementer. A conservative redesign that preserves the product's equity may
skip the inspiration step; say so in `brief.md`.

Production code, when this agent is also asked to implement, goes into the
project's real source tree, following its structure. Do not generate reports nobody asked for: `brief.md` and
`decisions.md` stay short, and a chat answer is enough for small `piece` work.

## Tool Awareness

Capabilities vary by host. Probe once, then use the best available route; see
`references/render-and-look.md` for the ladder.

- **Rendering and screenshots**: a browser automation tool, Playwright, or
  headless Chrome from the shell. Required for anything visual.
- **Reference browsing**: web fetch for static sites; a real browser for
  JavaScript-heavy galleries. The catalogue marks which is which.
- **Optional generators**: if a UI generation service (for example a Stitch
  MCP), an image model, or a Figma bridge is present, use it as a fast sketching
  hand inside this process - brief, directions, critique and system discipline
  still apply to its output.
- **Bundled scripts**: `scripts/color_tools.py` (contrast checks, OKLCH tonal
  scales) and `scripts/shot.sh` (multi-viewport screenshots). Colour arithmetic
  and contrast are computed, never estimated.

## Contract Stability

This suite's contract is its **modes**, its **deliverables**, its **output
layout**, and its **reference paths**. MAJOR removes or renames one of them,
MINOR adds guidance, a skill or a newly analysed source, PATCH refreshes
wording or catalogue entries. Nothing in the contract is removed without first
being listed as deprecated in `CHANGELOG.md` for at least two MINOR releases.
While the version is `0.x`, the contract is still settling and MINOR releases
may reshape it; breaking changes are still called out in `CHANGELOG.md`.

## Deliverables

- `full`: brief, inspiration notes, options board, chosen direction recorded in
  `decisions.md`, design system (`DESIGN.md`, tokens, preview), key screens
  with states for each target, motion spec, icon and asset list with licences,
  critique result, and the handoff package.
- `piece`: the rendered artefact (or in-project code), its states, a short
  rationale, and screenshot evidence.
- `options`: one options board plus a comparison and a recommendation.
- `inspire`: an inspiration brief with links, deconstruction and proposed
  moves.
- `critique` / `redesign`: findings table with evidence and severity,
  prioritised plan, and for `redesign` the equity audit and migration plan.
- `handoff`: the handoff folder (spec, acceptance shots, portable mockups,
  tokens, assets, motion) and, after the build, an acceptance report.
- `implement`: the handoff, then code in the host stack, design/build
  screenshot evidence, and residual gaps.

## Definition of Done

- The design read and its assumptions were stated, and the user's existing
  brand / system / stack were respected.
- References were consulted and cited for non-trivial work.
- Non-default choices and defaults alike can be justified from the brief.
- Everything visual was rendered and inspected at its declared viewports,
  themes and states; screenshots or an explicit "unverified" note exist.
- Contrast pairs were computed and pass the declared level; focus, target size
  and reduced motion were handled.
- States and edge content were designed, not just the happy path.
- Third-party assets have recorded licences; nothing fabricated is presented
  as real.
- A fresh-eye critique ran and its P0/P1 findings were fixed or disclosed.
- The skill retro ran: entries are in the lab inbox, or the final message
  says `Skill feedback: none`.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Before the final message of the round, run that file's close-out
retro and end with its `Skill feedback:` line - the retro is part of done.
Log, don't fix: skills are edited only inside the lab.
