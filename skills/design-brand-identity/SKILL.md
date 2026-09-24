---
name: design-brand-identity
description: Design a brand identity - positioning and personality, concept territories, logo exploration (wordmark, lettermark, symbol, combination, emblem) drawn as clean SVG, colour and typography for the brand, a graphic language, applications, and a brand guidelines document - or plan a rebrand that keeps the equity that matters. Use when the user asks for a logo, a name lockup, brand colours and fonts, a visual identity, a brand book or style guide, or a brand refresh. 品牌设计、Logo 设计、标志、VI、品牌规范、品牌升级。
metadata:
  version: 0.1.2
  short-description: Logo, identity system, guidelines, rebrand
---

# Design Brand Identity

A logo is the smallest part of an identity and the hardest to change. Decide
what the brand must feel like before drawing, draw in black first, and judge
marks by whether they are appropriate, distinctive and simple - not by whether
they illustrate the product.

References: `../design-studio/references/resources/brand.md`. Guidelines
outline: `references/guidelines-template.md`. Licences:
`../design-studio/references/licensing.md`.

## Modes

- `identity`: a new identity from a brief.
- `logo`: a mark or wordmark only (still runs the short strategy step).
- `system`: extend an existing logo into colour, type, graphic language and
  applications.
- `guidelines`: document an identity.
- `rebrand`: evolve or replace an existing identity.

## 1. Strategy in One Page

Do not skip this even for "just a logo"; a mark can only be judged against it.

- **Who and for whom**: what the organisation does, for which audience, in
  which competitive set (collect the competitors' marks into one view - the
  new mark has to stand apart in that line-up).
- **Positioning**: the one thing it should be known for.
- **Personality**: three to five attributes as "X, not Y".
- **Name facts**: length, letterforms with character (ascenders, repeated
  letters, a distinctive initial), pronunciation, scripts needed (Latin,
  Chinese, both - a bilingual lockup is a design problem of its own).
- **Where it lives**: app icon, favicon, product UI header, packaging,
  signage, embroidery, social avatar. The smallest and crudest application
  sets the simplicity bar.

## 2. Concept Territories

Propose three territories - different *ideas*, not three drawings of one idea.
For example: the name's letterform; a metaphor for the benefit; an abstract
quality (precision, warmth, motion). Present each as a sentence plus rough
marks. Use `../explore-design-directions/SKILL.md` for the options protocol.

## 3. Draw

- **Type of mark** follows the name and use: short distinctive names suit a
  wordmark; long names need a symbol or monogram for small sizes; most
  digital products need a symbol that works alone as an app icon.
- **Black on white first.** A mark that needs colour, gradient or effects to
  work does not work. Colour comes after the form is settled.
- **Simple enough to draw from memory** after a glance; distinctive enough not
  to be confused with a competitor or a stock glyph.
- **Construct with geometry, finish by eye**: grids, circles and consistent
  angles give discipline; optical corrections (overshoot, thinned joins,
  balanced counters, adjusted diagonals) make it look right.
- **Wordmarks are drawn, not typed**: start from a typeface with the right
  voice and a licence that permits logo use, convert to outlines, then adjust
  spacing pair by pair, modify a letter or two for ownership, and check the
  rhythm at small sizes. For Chinese wordmarks, commercial-font licensing is a
  known legal trap - use open-licence faces or draw the characters.
- **Deliver clean SVG**: minimal nodes, no strokes that should be outlines,
  no transforms, `viewBox` tight to the mark with no built-in margin,
  colours as named variables in the source file.

### Tests every candidate must pass

| Test | Pass condition |
| --- | --- |
| Small | recognisable at 16 px favicon and 24 px avatar |
| One colour | works in solid black, solid white on dark, and knocked out of a photo |
| Line-up | distinct beside the five closest competitors |
| Memory | can be sketched roughly after five seconds of viewing |
| Context | looks right in the real header, app icon mask and social avatar circle |
| Reproduction | survives one-colour print, embroidery-level simplification, low resolution |
| Longevity | does not depend on a current effect (gradients-only, glass, 3D gloss) |

Originality: search for look-alikes (logo archives, reverse image search) and
tell the user that a **trademark clearance search by a professional** is
required before adoption - an agent cannot clear a mark.

## 4. Build the System

- **Lockups**: horizontal, stacked, symbol-only, wordmark-only; each in
  full-colour, one-colour and reversed. Clear space defined by a unit from the
  mark itself (often the height of a letter); minimum sizes per lockup.
- **Colour**: one or two brand colours with character, a neutral family, and
  functional extensions; specify sRGB hex and OKLCH, and note that CMYK and
  spot values must be proofed with a printer. Check contrast for text uses.
  Build the UI scales with `../build-design-system/SKILL.md`.
- **Typography**: a primary family (and a fallback stack), optionally a
  secondary; hierarchy examples; the licence and where to obtain it; CJK
  companion family for bilingual brands.
- **Graphic language**: the device derived from the mark (a shape, a grid, a
  line quality, a crop), patterns, iconography style, illustration and
  photography direction, motion behaviour of the mark.
- **Voice**: a few lines with examples of "we say / we do not say".
- **Applications**: show the identity working - app icon, site header, social
  avatar and banner, OG image, slide, business card, a product screen. Mock
  them as rendered HTML / SVG, not descriptions.

## 5. Guidelines

Write `guidelines` as a usable document, not a trophy: what the rules are,
the values to copy, misuse examples, and downloadable assets. Outline in
`references/guidelines-template.md`. A one-page quick-start matters more than
a hundred pages nobody opens.

## Rebrand

1. **Equity audit**: what do people actually recognise - a colour, a shape, a
   letterform, the name, a sound? Evidence over opinion (usage data, surveys,
   recognisability when parts are hidden).
2. **Diagnose**: what is failing - legibility at small sizes, dated styling,
   inconsistency, a changed strategy? A rebrand without a strategic reason is
   a redraw.
3. **Decide the distance**: refresh (tidy, keep everything recognisable),
   evolution (keep one or two equity elements, change the rest), revolution
   (new strategy, new identity). Show before / after with the reasoning.
4. **Plan the rollout**: asset inventory, priority touchpoints, transition
   period, communication. Identity changes are product changes.

## Anti-Patterns

- A literal illustration of the product as the logo (a cloud for cloud
  software).
- Gradient-only or effect-dependent marks; marks that fail in one colour.
- A stock-icon symbol beside a default-font name.
- Thin strokes and fine detail that vanish at favicon size.
- Following the category's cliche so closely the mark disappears in the
  line-up (the same blue, the same geometric sans).
- Typing the name in a typeface and calling it a wordmark; using a font
  whose licence does not cover logo use.
- Presenting logos floating in space instead of in real applications.
- Forty-page guidelines with no downloadable assets.

## Deliverables

Strategy page; concept territories; refined mark(s) as SVG in all lockups and
colour modes; test sheet (small sizes, one-colour, line-up, contexts) rendered
and inspected; colour and type specification with licences; application
mock-ups; guidelines document; for `rebrand`, the equity audit and rollout
plan; and the explicit note that legal clearance is outstanding.

## Feedback

When this skill causes friction, gets corrected, fails, or lacks something you
needed, log one entry per `../design-studio/references/feedback.md` and return
to the task. Before the final message of the round, run that file's close-out
retro and end with its `Skill feedback:` line - the retro is part of done.
Log, don't fix: skills are edited only inside the lab.
