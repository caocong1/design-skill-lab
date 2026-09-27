---
title: Handoff package and executable build plan
evidence: practice
sources: [impeccable, dtcg-2025-10, design-md-spec]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Handoff

The designer decides, draws and specifies; the implementer builds in the target stack and proves
the build. The handoff is the contract between the two. It knows nothing about how the target stack
is coded: a portable HTML/CSS mockup plus tokens and a spec is a description any coding agent can
translate ([portable-mockups](../fundamentals/portable-mockups.md)).

## 1. How much to hand off

| Situation | Hand off |
| --- | --- |
| `handoff` mode, or a separate implementer (another agent, a developer, a cheaper model) | the full package (section 3) with a build plan (section 6) |
| `implement` mode: the same agent designs and builds | the acceptance-shot list, the tokens landing in the host source (or the host's system updated in place), decisions.md; then [implement-design](../../../implement-design/SKILL.md) |
| `quick` piece answered in chat | the rendered PNG, the tokens it used, the states it covers |

## 2. Gate before packaging

- The design passed the fresh critique at the gate in
  [rubric](../../../critique-design/references/rubric.md), or the gaps are disclosed.
- Every applicable state is drawn, not described; each target has its own frame and composition.
- Mockups use the portable subset: tokens for every value, named components and states, bars
  outside the scroll region, real content.
- Every shot was rendered and opened ([render-and-look](render-and-look.md)), and the rationale
  passed its close-out re-check (section 9).
- Licences are cleared: fonts, icons and images the target cannot legally ship are replaced now,
  not after ([licensing](../fundamentals/licensing.md)).

## 3. Package layout

```text
.design/handoff/<feature>/
  README.md        the spec; starts with the one instruction, ends with the build plan
  handoff.json     machine-readable index of screens, shots, assets, motion, open questions
  shots/           acceptance images: <screen>-<state>-<target>-<theme>.png
  mockups/         the portable HTML/CSS source of every shot, plus a motion demo when things move
  tokens.css       the tokens; *.tokens.json + *.resolver.json when several platforms consume them
  assets/          SVG icons and marks, rasters at the needed scales, fonts or where to license them
  acceptance.md    after the build: the acceptance report
```

Templates: [handoff-spec.md](../../templates/handoff-spec.md) (README),
[handoff.json](../../templates/handoff.json), [acceptance-report.md](../../templates/acceptance-report.md).
Keep README, handoff.json and the shots in the same change.

- **Shots are the acceptance reference**: one PNG per screen x state x target x theme at the
  target's logical size, DPR 2. Target ids come from handoff.json (`ios`, `web-lg`, `web-sm`);
  names are lower-case kebab; screen names are the words the spec and the mockup use, state names
  come from the [product-ui](../disciplines/product-ui.md) state matrix (`empty-first`, `no-results`).
  A target's `dpr` in handoff.json is the capture DPR: 2, unless the spec says why not.
- **Producing the names with capture.mjs.** It writes `<name>-<state>-<W>x<H>-<theme>.png`, and a
  `?state=empty-first` variant is named `state-empty-first`. Run it once per target, with
  `--name <screen>` and that target's logical size, into the bulk folder; then copy each file in
  under its handoff name.
  From `.design/handoff/queue/`, for the `web-sm` target:

  ```sh
  S="<directory of the design-studio SKILL.md>/scripts"
  node "$S/capture.mjs" mockups/queue.html --name queue --viewports 390x844 --themes light,dark \
    --states "default,?state=empty-first" --out ../../shots/queue
  for f in ../../shots/queue/queue-*-390x844-*.png; do
    n=$(basename "$f"); n=${n/-state-/-}; cp "$f" "shots/${n/-390x844-/-web-sm-}"
  done   # queue-state-empty-first-390x844-dark.png > shots/queue-empty-first-web-sm-dark.png
  ```
- **A shot is the visual target, never an asset** to slice, trace or embed.
- **Tokens state their versions**: which DTCG spec (2025.10) and which toolchain versions the
  files target ([token-formats](token-formats.md)), and link the `DESIGN.md` they implement.
- **The surface contract travels**: link `.design/surfaces/<surface>.md` in README > Scope and in
  handoff.json `surfaces`. Its finish-line conditions become acceptance criteria.

## 4. Rules

- **Draw it, don't describe it.** If a state matters, it has a shot. "To be defined during
  development" is a missing shot.
- **Name things once.** Component, state and token names are the same words in the spec, the
  mockup's `data-component` attributes and the shot filenames.
- **Say what is system and what is custom.** Mark every part SYSTEM (use the platform's own
  component) or CUSTOM. A re-drawn native tab bar handed over as a drawing invites someone to
  rebuild it.
- **Values are tokens.** A raw number in the spec is a missing token or an exception with a reason.
- **One source of truth.** When the design changes, regenerate the shots and update the spec in the
  same change; stale shots are worse than none.
- **Leave the how to the implementer.** Specify results and constraints, not widgets, libraries or
  file structure. Stack advice only when asked, via implement-design.
- **Licences travel with assets.** Every asset row names its source and licence; a generated
  raster also carries its provenance ([image-generation](image-generation.md)).
- **Each target gets its own shots.** iOS shots are not the reference for an Android or HarmonyOS
  build ([platforms](../platforms/README.md)).

## 5. The one instruction

Open README.md with one paragraph a user can paste to any coding agent unchanged:

> Build <feature> in <repo> from `.design/handoff/<feature>/`. Read README.md top to bottom, then
> follow its Build plan step by step. Run every Verify command and compare with the expected output.
> Stop and ask at any STOP condition. Done means every Accept check passes on re-captured
> screenshots.

## 6. The build plan (for a separate or cheaper executor)

The executor never saw the conversation and will not infer intent. Write the plan as the last
section of README.md (`## Build plan`), so it can be run without judgement calls.

- **Inline the context.** Paste the facts it needs; never point at the chat:
  - the thesis in one sentence;
  - the host's styling approach and component library;
  - three existing screens to imitate, by path;
  - where the tokens land;
  - commands to build, test and serve.
- **Small steps, each verifiable.** Every step names its files and ends in commands with their
  expected output: exit codes, "no output", a listed file. A step without a check is not a step.
- **STOP conditions.** Stop and ask when:
  - reality contradicts the spec (a missing API field, a system component that cannot be styled
    as drawn, a missing token);
  - a Verify command prints anything other than the expected output;
  - the step would touch a file outside its list.
  Record the answer in README > Open questions. Never improvise design.
- **Accept by screenshots, region by region.** Capture the build at the same logical size, DPR,
  theme, state and content as the matching shot. Compare region by region
  ([render-and-look](render-and-look.md) section 8). A region counts as done only when its own
  evidence shot was re-captured after the fix.
- **Checks a still cannot show** get their own command or manual step: target sizes, focus order
  and visibility, screen-reader names, contrast, text scaling, reduced motion.

Step format:

```markdown
### Step 3: QueueRow
Do: build `QueueRow` per README > Components > QueueRow, all values from tokens.
Files: src/features/queue/QueueRow.tsx (new), src/features/queue/index.ts
Verify: `npm run typecheck` -> exit 0
        `grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(' src/features/queue` -> no output
Accept: capture `queue` default and empty-first, web-sm, light and dark; regions TopBar, QueueRow and
        Toolbar match shots/queue-{default,empty-first}-web-sm-{light,dark}.png
STOP if: the queue API has no `deadline` field (README > Content shows it on every row).
```

## 7. After the build

Acceptance needs screenshots of the build and nothing else; how they were produced is the
implementer's business. With none, say acceptance has not happened. The comparison runs as in
render-and-look section 8. Verdict, deviation classes (build bug, spec gap, platform difference)
and the report: [critique-design](../../../critique-design/SKILL.md) and
[acceptance-report.md](../../templates/acceptance-report.md). Every spec gap found is fixed in the
handoff, not only in the build; accepted compromises are recorded in the spec.

## Anti-patterns

- A prototype link and the word "pixel-perfect" instead of a spec.
- Only the happy path.
- Redlines in raw pixels next to a token system nobody referenced.
- Custom drawings of system chrome presented as components to build.
- Accepting a build from a description ("it matches") instead of screenshots.
