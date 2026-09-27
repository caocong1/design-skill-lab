---
title: Rubric (mechanical floor and 1-5 ceiling)
evidence: digest
sources: [wcag-22, accessibility-law, practical-typography-key-rules, impeccable, anthropic-design-skills]
reviewed: 2026-09-27
review_by: 2026-12-27
---

# Rubric

The rubric makes "is this good?" answerable the same way twice. Score what is rendered, against the
brief and the surface contract, in this order: floor, ceiling, gate. The scorer should be a fresh
context that has the brief, the contract and the screenshots, and not the author's reasoning.

Contents: 1 Floor · 2 Ceiling scale and gate · 3 Anchors per dimension · 4 Scoring procedure ·
5 Reading the dimensions for non-screen work

## 1. Floor (binary, mechanical)

Each item passes or fails. A pass needs evidence; a check that could not run is `not verified`, and
`not verified` is not a pass.

| # | Check | Passes when | How |
| --- | --- | --- | --- |
| F1 | Renders cleanly | every declared shot loads (HTTP below 400, no console errors, no blank, wall or error page), the intended fonts rendered rather than a fallback, and no frame was caught mid-animation | `capture.mjs` exit code and log; open each file |
| F2 | Contrast computed | every text and non-text pair (component boundaries, state and focus indicators, meaningful graphics against adjacent colours) meets its WCAG 2.2 AA minimum in design-studio's [color](../../design-studio/references/fundamentals/color.md) (Contrast: computed, never estimated), in every theme; thresholds are not rounded and nothing is estimated | `lint.mjs` computed pairs; `color_tools.py contrast` or `matrix` |
| F3 | No overflow at 390 | at 390 CSS px wide, with the longest real strings: no horizontal page scroll, no clipped or overlapping text. Native targets use their smallest declared logical size. Reading content also reflows at 320 | `lint.mjs`; the 390 capture |
| F4 | Targets | every interactive element meets the minimum for its declared target, input (pointer or touch) and mode in design-studio's [layout-and-spacing](../../design-studio/references/fundamentals/layout-and-spacing.md) (Targets and density): web per WCAG 2.5.8, including its spacing exception; native targets at their platform size; an elder mode (适老化), where declared, at its larger sizes | `lint.mjs` tap targets; measure |
| F5 | Focus visible | every interactive element shows a focus indicator on keyboard focus, meeting F2's non-text minimum, and no sticky or floating bar hides the focused element completely | tab through; focus-state shots |
| F6 | States present | every state the surface contract and the state matrix list for this surface is drawn and captured | the manifest against the contract |
| F7 | No placeholder left | no lorem ipsum, `TODO`, `{{var}}`, "Button" or "Title" labels, sample names or broken images; gaps the brief left open are visibly marked; no invented testimonials, logos, metrics or awards | read the shots; search the page text |
| F8 | Licences recorded | every font, icon set, image and generated raster has a recorded source and licence (handoff.json `assets` or the delivery note); no trial or personal-use asset | read the record; clearance itself is `human-required` |

- Any failure means the floor fails, and a failed floor is never `ship`. Each failure is a finding:
  P0 when it blocks the primary task, excludes users on a core path or creates legal exposure (F7
  fabricated proof, F8 unlicensed asset); otherwise P1.
- `n/a` needs a one-line reason: a printed poster has no focus or targets; a native-only target
  replaces 390 with its own smallest size.
- The thresholds here are the check; F2's minima live in color, F4's sizes in layout-and-spacing.
  How to design for them lives in design-studio's [accessibility](../../design-studio/references/fundamentals/accessibility.md) and the platform files.

## 2. Ceiling scale and gate

Six dimensions, each scored 1 to 5 in whole numbers.

| Score | Meaning |
| --- | --- |
| 1 | wrong or broken for this brief |
| 2 | works, but generic or unresolved. This is what a competent first pass usually looks like |
| 3 | good: a professional would ship it after minor refinements |
| 4 | excellent: specific to this product, deliberate everywhere, nothing to add or remove |
| 5 | exemplary: work others in the category would study. Rare |

**Gate**: the floor passes, every applicable dimension scores at least 3, Fit, Hierarchy and
Identity score at least 4, and no P0 or P1 finding is open. Anything less is another iteration
(`fix` or `rebuild` in [SKILL.md](../SKILL.md)).

Identity is read against the design read's convention-or-novelty choice
([truth-files](../../design-studio/references/process/truth-files.md) section 3). Where it chose
convention, a conventional structure is a decision, not a row-1 default, and the idea is judged in
owned details ([anti-slop](../../design-studio/references/fundamentals/anti-slop.md), "When convention
is the right answer").

## 3. Anchors per dimension

A level is earned only when everything in its row is visible in the shots. The owner files hold the
underlying rules; these rows describe what each level looks like.

### Fit: right for this audience, job and scene

| Score | Looks like |
| --- | --- |
| 1 | Contradicts the brief: wrong audience or tone (a playful consumer look on an all-day operations console), the primary job missing or buried, declared targets or constraints ignored. |
| 2 | Right category, wrong product: it works, but you cannot point to the brief's attributes, the logo could be swapped for a competitor's, and the contract's thesis is not visible in the first viewport. |
| 3 | Recognisably for this audience and job: the primary task is obvious within five seconds, you can point to most "X, not Y" attributes, and density and tone suit the scene. One attribute is weak. |
| 4 | You can point to every attribute, the thesis and each finish-line condition in the shots; it works in the declared scene (distance, device, light, session length); nothing contradicts PRODUCT.md. |
| 5 | Serves the job better than the brief asked: it makes visible something about the users' work the brief implied but did not state, within every constraint. The audience would say it was made for them. |

Cite the region that carries each attribute and the shot for each finish-line condition.

### Hierarchy: what is seen first, second, third

| Score | Looks like |
| --- | --- |
| 1 | No entry point: several elements have equal weight, the squint test shows noise, and there is no primary action (or there are three). |
| 2 | A primary element exists, but the second and third levels blur: secondary actions look like the primary, headings differ from labels only by colour, the scan path zigzags. |
| 3 | On the squint test, first, second and third are clear and right for the job; one primary action per view; grouping by proximity reads without borders. |
| 4 | The order holds at every declared size and state (390 re-composed, not shrunk; empty and error states keep it); the scan path follows the contract's story; emphasis is spent in one place per view. |
| 5 | The layout alone tells the story: with the text blurred you can still say what matters and what to do next, and in dense data the exceptions find the eye (three overdue rows in a 200-row table). |

Cite the blurred 1280 and 390 crops and the first three things you saw.

### Identity: is it theirs?

| Score | Looks like |
| --- | --- |
| 1 | The statistical default (the category template, stock palette, the usual face, the usual hero), or novelty that breaks use. Most choices fail the subject test. |
| 2 | Competent and generic: one or two choices come from the subject and the rest are defaults. At thumbnail size it could be any product in the category. |
| 3 | One recognisable idea tied to the subject (the contract's own-world referent), used consistently, with restraint elsewhere. A few defaults remain unjustified. |
| 4 | The one memorable idea is visible in the first viewport at every target and carries into states and components; every remaining default is justified by the brief; the thumbnail stands apart from the category's usual page, or, on an Operate surface whose design read chose convention, the idea lives in owned details visible in a 2x crop (status vocabulary, numeral setting, row rhythm, empty-state voice) while the structure stays conventional. |
| 5 | Ownable: recognisable from a cropped fragment (a table row, an empty state, a button); the idea extends naturally to surfaces not yet drawn; it never costs usability. |

Cite the element that carries the idea and the defaults you put through the subject test in
[anti-slop](../../design-studio/references/fundamentals/anti-slop.md).

### Craft: nothing accidental

| Score | Looks like |
| --- | --- |
| 1 | Visible accidents: misaligned edges, clipped shadows or focus rings, mismatched nested radii, blurry or stretched images, overlapping text, mixed icon styles. |
| 2 | Clean in the default state, but accidents appear at other sizes, in dark mode or with long content; several radius, shadow or border values serve one purpose. |
| 3 | One logic per property (radius, border, shadow, icon family, spacing scale) is visibly in use; icons align optically with text; no accidents in any captured state. |
| 4 | Details resolved: nested radii follow design-studio's [layout-and-spacing](../../design-studio/references/fundamentals/layout-and-spacing.md) (Shape and radius), one light source for every shadow, browser surfaces themed (selection, caret, scrollbars, focus rings, underline offset, tabular numerals), images cropped with intent. Clean in 2x crops. |
| 5 | Nothing accidental at any magnification or in any transition, and the craft itself carries the identity (a rule system that is also the grid; icons drawn from the brand's letterforms). |

Cite 2x crops of edges, nested corners and icon-text pairs, and `lint.mjs` distinct-value counts.

### Typography

| Score | Looks like |
| --- | --- |
| 1 | The wrong face or a fallback rendered; no scale (many near-identical sizes and weights); body text below 12 px; Chinese set with Japanese glyph forms, or with 。and，at the start of a line. |
| 2 | A scale on paper that is not followed (13, 14 and 15 px side by side); weight carries every emphasis; body lines over 80 characters or running-text leading under 1.3; widowed headings; misaligned numbers in tables. |
| 3 | A small scale used consistently, neighbouring roles at least 1.25x apart; measure and leading inside the ranges of typography and cjk-typography, measured in the shot; tabular numerals where numbers are compared; CJK and Latin spaced; the smallest text readable in the declared scene. |
| 4 | The face or pairing was chosen for this brief (it would not appear for any product); type carries hierarchy without colour; details hold at every size: balanced headings, punctuation, numerals, CJK line-break rules, no synthesised bold on single-weight CJK faces, mixed-script sizes matched. |
| 5 | Typography is a main carrier of the identity, recognisable in greyscale; editorial-grade setting: optical sizes, rhythm between sizes, hanging punctuation where supported, CJK and Latin sharing baseline and colour. |

Cite measured sizes, line lengths and leading, crops of mixed-script lines, and the font that
actually loaded. The rules live in [typography](../../design-studio/references/fundamentals/typography.md)
and [cjk-typography](../../design-studio/references/fundamentals/cjk-typography.md).

### Accessibility: beyond the floor

| Score | Looks like |
| --- | --- |
| 1 | The primary path fails: keyboard trap, invisible focus, status by colour alone, unlabelled controls, text below contrast. |
| 2 | The floor passes in the default state, but focus order jumps, affordances appear only on hover, errors show only by colour or position, motion has no reduced-motion variant, or 200% text breaks the layout. |
| 3 | WCAG 2.2 AA holds on the primary flow in every captured state and theme: logical focus order, names and roles, headings and landmarks, errors in text with a way out, reduced motion honoured, 200% text survives, dragging has a single-pointer alternative. |
| 4 | Beyond AA where this audience needs it: 44 px targets on touch surfaces; focus indicators with at least a 2 px perimeter and a 3:1 change of contrast (2.4.13); nothing hidden under floating bars; forced colours and increased contrast checked; glass legible without transparency; large-text or 适老化 modes designed when older users are in the audience. |
| 5 | Inclusive by design: alternatives are first-class (documented shortcuts, non-drag paths, captions); 400% reflow keeps every function; a real screen-reader pass found no surprises (`human-required` evidence). |

Say which checks were automated, which were manual and which were not done.

## 4. Scoring procedure (fresh critic)

1. Read the brief, PRODUCT.md, the contract and the manifest. Do not ask for, or infer, how the
   design was made.
2. Score the floor first and list every failure.
3. For each dimension, start at 2. Move up one level only when the shots show everything in the
   next row; drop to 1 when anything in row 1 is visible. The burden of proof sits with the higher
   score, and surface compliance fails: the right component in the wrong state does not count.
4. Score the set, not the hero shot. A level holds only if it holds in every captured size, theme
   and state; name the shot that caps the score.
5. Give each score one line of evidence: a shot and region, or a measured value. A score without
   evidence is void.
6. Use whole numbers. Mark `n/a` only with a reason (Typography on a wordless icon set).
7. Apply the gate. P0 and P1 findings outrank averages; never average scores into a pass.
8. Comparing options, choose one per pair and say what would change the choice. Ties are rare.
9. In round 2, re-score only the dimensions a fix touched and show before and after (3 > 4).
10. When the user's reaction disagrees with the scores, record it in decisions.md. The lab adjusts
    these anchors; a host session does not.

## 5. Reading the dimensions for non-screen work

The anchors are written for screens. For other deliverables, read the dimensions like this:

| Deliverable | Hierarchy | Craft | Typography | Accessibility |
| --- | --- | --- | --- | --- |
| Logo or mark | reading order of the lockup; legible at 16 px and in one colour | optical overshoot, consistent stroke, clean paths, text converted to outlines | wordmark spacing; CJK and Latin lockups matched in weight and height | lockup contrast on every brand background |
| Icon set | consistent visual weight across the set | one grid, stroke, corner and terminal; crisp at 16, 20 and 24 | `n/a` | 3:1 against the surface; names where used |
| Deck | one assertion per slide, readable in 3 s | aligned to one grid; charts cleaned of defaults | projection sizes; the title is the claim | contrast at projector gamma; no colour-only charts |
| Poster, social, OG | reads at feed-thumbnail size | exact export size; safe zones respected | display type set, not just typed | alt text for the post; contrast over the image |
| Motion | the motion points to what changed | consistent timing and springs; interruptible; no jank | `n/a` | reduced-motion variant; nothing flashes more than 3 times per second |
| Token system | roles before values; semantic layer used by components | no near-duplicate values; one logic per property | type roles cover real content | the contrast matrix passes in every theme |

Fit and Identity read the same everywhere: does it serve this brief, and is it theirs?
