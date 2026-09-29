---
title: Render and look - tool ladder, capture traps, bounded verification
evidence: measured
sources: [impeccable, anthropic-design-skills]
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Render and look

A design that was never rendered and looked at is a guess. Rendering is the designer's test run,
with the same rule: report what was actually verified. The designer's output is the rendered image,
so render before delivery even when speed tempts you to skip it.

Two acts share this file:

- **Looking at the design.** Mockups are HTML/CSS/SVG for every target, so a browser is the only
  renderer needed. Frames and logical sizes: [portable-mockups](../fundamentals/portable-mockups.md).
- **Accepting a build.** That needs screenshots of the running product from whatever stack built it.
  Producing them is the implementer's job (simulator, device, golden test, a pasted image). The
  comparison method is section 8; the verdict belongs to
  [critique-design](../../../critique-design/SKILL.md).

## 1. Tool ladder

Probe once per session, use the highest rung that works, and say which rung produced the evidence.
The scripts sit next to SKILL.md, not in the host project: call them by absolute path.

```sh
S="<directory of the design-studio SKILL.md>/scripts"
node "$S/capture.mjs" --help      # rung 1; prints flags and the manifest format
bash "$S/shot.sh" --help          # rung 2
```

| Rung | Tool | Use it for | Limits |
| --- | --- | --- | --- |
| 1 | `capture.mjs` (Playwright) | everything: mockups and running apps; true viewport emulation (390 is 390, touch below 600), DPR, forced colour scheme, language and time zone (`--locale`, `--timezone`), sizes x themes x states in one run, saved login (`--storage-state`, `--login-script`), route manifests, build stamps, wall / login / blank / error detection with exit 1, `--sheet` contact sheets, frozen sets (`--freeze`) | needs Node and Playwright |
| 2 | `shot.sh` (headless Chrome CLI) | mockups and public pages on a host without Node or Playwright | no login, no manifest, no touch emulation; one theme per run (`--dark`), states go in the URL. Below 500 px it renders in a sized iframe: a site that refuses framing has those sizes skipped with exit 3; an unreachable URL exits 2 |
| 3 | a browser tool in the host (Chrome or Playwright MCP) | interactive checks: hover, focus order, computed styles, console errors, measuring | slow for batches |
| 4 | nothing | - | deliver the artefact marked unverified (section 9) |

- No Playwright in the project: `npx -y -p playwright@1.63.0 node "$S/capture.mjs" ...`. The loader
  finds the npx copy and drives the installed Google Chrome, so only the npm package downloads
  (measured). Without Chrome it falls back to Playwright's Chromium, which needs
  `npx playwright@1.63.0 install chromium`. In PowerShell give npx literal paths: its wrapper
  re-parses the command line and cannot see a `$script:` variable (Windows 11, 2026-09).
- Take flags and the manifest format from `--help`, never from memory: they are perishable.

## 2. What to capture

| Dimension | Minimum |
| --- | --- |
| Sizes | the targets declared in the brief and surface contracts. Web with no declaration: 390, 768, 1280, 1920. Other targets: the platform frame at its logical size, plus the second size class the product serves (tablet, wide window) |
| Themes | every theme, mode and family claimed |
| States | default plus every designed state, named as in the [product-ui](../disciplines/product-ui.md) state matrix (`empty-first`, `no-results`, `loading`, `error`, `offline`), plus long content and focus-visible where reachable, through the state URLs the mockup exposes |
| Content | real or realistic; the longest strings; mixed scripts if they ship |
| Pixel density | DPR 2 by default; add a DPR 1 pass when the audience is on Windows laptops (hairlines, text rendering) |
| Motion | stepped frames or a recording: [motion](../disciplines/motion.md) |

Name every file with what it claims. `capture.mjs` writes `<name>-<state>-<W>x<H>-<theme>.png`
(`--name` sets the first part; a `?state=empty-first` variant is named `state-empty-first`) and records DPR, URL
and verdict per file in `capture-report.json`. Acceptance shots use target ids instead of sizes
(`<screen>-<state>-<target>-<theme>.png`): the rename recipe is in [handoff](handoff.md) section 3.

## 3. Capture traps

Each was hit in real runs; the first two were re-verified on Chrome 153.

- **Colour scheme.** Headless Chrome inherits the OS setting: a "light" capture on a dark-mode
  machine comes out dark. Force the scheme (both scripts do) and check it in the image.
- **The 500 px floor.** The Chrome CLI will not size a window below 500 px; a 390 px request lays
  the page out at 500 and crops it, which looks like a broken mobile layout. `capture.mjs` emulates
  the viewport; `shot.sh` uses an exactly sized iframe and skips (exit 3) sizes a site will not frame.
- **Full page.** A tall window that fakes a full-page capture breaks `vh` layouts: use a true
  full-page capture, taken from the document top. After switching a variant, route or theme,
  confirm `scrollY` is 0.
- **Readiness.** Wait for `document.fonts.ready`, for lazy images (scroll through the page first)
  and for entrance animations to finish, or disable them. A fixed delay is not readiness.
- **Fonts.** Confirm in the image that the intended face rendered: look at distinctive glyphs
  (a, g, R, 的), then run the load check in [typography](../fundamentals/typography.md) > Verify
  (never `document.fonts.check()`). A silent fallback changes widths, wrapping and tone.
- **Translucent fixed overlays** (toolbar, switcher, cookie bar) let the controls beneath show
  through as ghost buttons in a still. Make them opaque, or check them over busy content.
- **Canvas and WebGPU** often capture blank. Read the pixels back where the page can; otherwise say
  the canvas was not seen.
- **A caption is not a measurement.** For "is this aligned", compare boxes with a browser tool.
- A render is wrong in a way no rule here explains: [casebook](../casebook.md).

## 4. Running apps: logged in, route by route

- **Log in once**: `--storage-state auth.json` reuses a saved Playwright storage state;
  `--login-script login.mjs` logs in at the start of the run and keeps the session in memory. Never
  put credentials in a script, and never commit a state file: it holds live session cookies.
- **Local build, real backend.** Capture "before" from the deployed frontend. Capture "after" from
  the same origin with its frontend assets routed to the local build (Playwright `context.route`
  in a small script of your own: `capture.mjs` has no routing option). Both sides then share
  backend, data and session.
- **Route manifest** (`routes.json`, format in `capture.mjs --help`): one row per route with an id,
  the path with seeded record ids, a `ready` selector and its states. `capture.mjs` runs in en-US
  and the machine's time zone unless told otherwise: capture a Chinese product with
  `--locale zh-CN --timezone Asia/Shanghai` (or the same keys in the manifest). A product that
  keeps its language in a setting is still switched through the product itself (a URL parameter,
  or a setting the login script saves into the session). The report records both.
- **Read-only.** Against shared servers a capture navigates and reads; no step submits, deletes or
  changes data.
- **Assert every route** by its landing URL or ready element. A silent redirect, a login page or a
  loading state is not evidence of that route. When `capture.mjs` exits 1, read which files it
  flagged (wall, login, error, blank, not-ready, stale-build) and recapture those.
- **Same environment on both sides** (both deployed or both local). Dev-only chrome and broken
  fixtures otherwise read as regressions.
- **Stamp the build.** Each capture proves which build it shows (a version string, a hashed asset
  name, a DOM data attribute); `--build-stamp <text>` fails any capture whose HTML lacks it. A
  re-run that silently captured the old build looks exactly like "the fix did nothing".

## 5. Bounded verification

One batched capture round, one fix batch, at most one confirm round:

1. Build everything first: every surface, state, theme and target in scope.
2. Capture once: all declared sizes x themes x states in one run, with a contact sheet.
3. **Open every file** and check it shows what its name claims: right route, state, theme, size and
   build; no wall, blank, spinner or error page. A file that fails is recaptured, never judged.
4. Look (section 7) and run the floor: web `lint.mjs <page> --viewports <each declared size>`
   (default 1280x800 and 390x844; add `--touch` for a touch-first product); native `lint.mjs <screen>
   --platform ios|android|harmonyos|miniprogram` (that frame and its touch minimum, which fails the
   floor); plus `--above-fold "<selectors>"` when the contract lists the first viewport. Then
   `color_tools.py` on every text and UI colour pair. Write one findings list.
5. Fix everything in one batch.
6. Confirm at most once: recapture what the fixes touched, plus a fresh sheet. Then stop, and
   disclose what remains unfixed or unverified.

The fresh critique (loop step 9, critique round 1) receives the confirmed set. Its P0/P1 fixes and
the elevate variants (step 10) get one more capture-and-confirm round, judged as critique round 2,
no more. Endless self-inspection anchors on the previous round's judgement and spends the context
the critic needs.

Freeze what the critic sees. Capture the set for a critique round into a folder of its own
(`--out .design/shots/<round> --freeze`): `capture.mjs` then refuses to write into that folder
again, and `capture-report.json` gives the set its `capture_id` and every PNG its `sha256`. Hand
over that folder's manifest and do not edit the build until the report is back. Fixes are captured
into a new folder, and a finding names the set it was seen in: a file replaced under the same name
turns a finding into a dispute. A look taken while the code is still changing is exploratory: say
so, and raise no findings from it.

## 6. Contact sheets

`capture.mjs --sheet` writes `contact-sheet.png`: every capture as a labelled tile, four per row,
failed captures first and outlined in red, a capture with no image hatched.

- Use a sheet for coverage (does every file show what its name claims), for comparison at
  thumbnail size (directions, families: the thumbnail test) and for reference captures before
  deconstructing them ([research](research.md)).
- Tiles are 320 px wide. Judge coverage and hierarchy there; never type, contrast or alignment.
  Open the full-size file for those.

## 7. How to look

- Use the ordered checklist in
  [heuristics](../../../critique-design/references/heuristics.md): the same list serves the
  self-check, the critique and the rubric.
- Look at two distances: the full-size file at 100% for detail, a thumbnail or 25% view for
  hierarchy (what is seen first, second, third).
- Measure instead of estimating: computed sizes and families, colour values, target sizes, the
  number of distinct colours, sizes and radii (`lint.mjs` reports these).
- Look at the edges: the last row, the bottom of every scroll region, the narrowest target, the
  longest string, the darkest theme.

## 8. Compare two images

For design against build, comp against HTML, before against after.

1. Same logical size, DPR, theme, state and content on both sides. Anything else makes the
   comparison meaningless: recapture first.
2. Side by side, then overlaid. A browser does the overlay: black where the images agree, doubled
   bright edges where something moved (checked by rendering it):

   ```html
   <!doctype html><meta charset="utf-8"><title>compare</title>
   <style>
     body { margin: 0; background: #000; }
     .pair { display: flex; gap: 8px; }
     .overlay { position: relative; width: fit-content; }
     .overlay img + img { position: absolute; inset: 0; mix-blend-mode: difference; }
     img { display: block; width: 390px; } /* the logical width, whatever the DPR */
   </style>
   <div class="pair"><img src="design.png"><img src="build.png"></div>
   <div class="overlay"><img src="design.png"><img src="build.png"></div>
   ```

3. **Region by region.** The regions are the named components of the structure tree (the
   `data-component` names in the mockup). Give each region a verdict from the list in
   [critique-design](../../../critique-design/SKILL.md) > Accepting a build, with a crop.
4. Anti-aliasing and hinting noise is not a finding. Offsets, wrong tokens, wrong faces, missing
   states and missing or substituted assets are.
5. Keep both images and the crops with the deliverable: they are the evidence
   (`critique/<date>-<target>/`).

The verdict and deviation classes for a build: [critique-design](../../../critique-design/SKILL.md)
and the [acceptance report](../../templates/acceptance-report.md).

## 9. Report honestly

State what was rendered (files, sizes, themes, states), which rung produced it, what was looked
at, and what was not verified and why. "Looks good" without a screenshot is not a result. Each
unverified claim says:

> Unverified: <claim>. Not rendered because <reason>. To verify: open <file> at <size>, <theme>,
> <state> and check <observable condition>.

Report three verdicts separately: the floor (what the tools measured), the fresh critique (its
disposition and gate) and the user (accepted, asked for changes, or has not seen it). None stands
in for another: a passed floor and a met gate do not say the user is satisfied.

Close-out: before delivery, re-check every positional, size or colour claim in the notes, rationale
and decisions against the final render ("above the fold" is a measurement, not a memory of an
earlier round). Delete superseded lines; never leave them beside their correction.
