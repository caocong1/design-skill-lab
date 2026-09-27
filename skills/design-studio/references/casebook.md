---
title: Casebook (incident lore)
evidence: measured
sources: []
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Casebook

Single incidents seen in the lab or in host projects: true once, not yet a rule. Read this when a
render or a build is wrong in a way no rule explains. Each line is symptom > cause > check, with the
origin. A case becomes a rule in its owning file only after a second, independent occurrence; the lab
does that, not a host session.

Origins: *lab page* = the lab's own 16-direction showcase, rounds 1-3 (2026-09-21 to 09-23).
*Host A* = a web business system with Office/WPS add-in panes. *Host B* = an AI-assistant web app.
Both host rounds were on 2026-09-24.

## Motion

- Entrance "plays twice" > the last keyframe omits an animated property, so it interpolates back to the element's underlying value (the `opacity: 0` of a waiting class) before cleanup > write every animated property in every keyframe, use `animation-fill-mode: both`, and sample the property per frame; counting `animationstart` will not show it. *Lab page, round 2.*
- Final tilt is double, then snaps > a keyframe rotates inside `transform` while the element also sets `rotate`; the two compose > animate the property the element rests on. *Lab page, round 2.*
- A hover wiggle restarts the entrance > a second class replaced the `animation` shorthand mid-entrance, and removing it replays the first > skip the secondary animation while the first runs, or put them on different elements. *Lab page, round 2.*
- A dot piles up in the SVG's top-left corner > a SMIL `animateMotion` object sits at the origin until it begins, and in some browsers never attaches > ride the path with `offset-path` and rest the object on the path. *Lab page, round 2.*
- A newly switched view opens mid-page > `overflow: hidden` on the body hid the scrollbar but kept `scrollY`; View Transitions also write the old position back when they finish > reset scroll inside the update and again when `finished` resolves. *Lab page, round 3.*

## Layout and CSS

- The last row of a table, map or diagram is hidden > `overflow-x: auto` computes `overflow-y` to `auto`, and the horizontal bar covers the last row > pad the bottom or set `overflow-y: hidden`; look at the last row in the shot, not the middle. *Lab page, rounds 2 and 3.*
- A sticky table header covers the first row > `position: sticky` inside an `overflow` wrapper sticks to that wrapper > move the scroll container or offset the header. *Lab page, round 2.*
- Fading a row also fades its track line > `opacity` on the row applies to its `::before` track > fade the content, not the line. *Lab page, round 3.*
- A small label is stretched to full width > a direct child of a column flex container stretches by default > `align-self: start`. *Lab page, round 2.*
- A global control style (a custom select arrow) vanishes on one page > a page-level `background:` shorthand reset the longhand the global rule set > before adding global control styles, search for shorthands that touch the same property. *Host A.*

## Diagrams and marks on a line

- A station or timeline dot reads as fallen off the line > it was centred on the whole name-plus-description block > align each mark with the first line of the label it names. *Lab page, round 3.*
- A dot is hidden under a later line > marks were drawn before strokes > draw every mark after every stroke. *Lab page, round 3.*
- A mark disappears into the stroke > same thickness and colour as the stroke > give it a ring or a larger size. *Lab page, round 3.*
- Half of the first or last mark hangs past the line > the stroke ends at the mark's centre > extend the stroke to cover the whole mark. *Lab page, round 3.*
- A summary said "the marks are on the line" and they were not > a caption of a screenshot was treated as a measurement > compare the mark's box with the stroke and with the label's box. *Lab page, round 3.*

## Switchers and boards

- The eleventh direction shows the label "1" > labels and digit keys were printed as `n % 10`; digit keys only cover ten > label from the list index; beyond ten, switch with `[` and `]`. *Lab page, round 2.*

## Rendering environment

- A headless WebGPU page falls back to its 2D mode although it rendered > software WebGPU in headless Chrome reports `device.lost` with reason `destroyed` after the first frame > treat only losses with another reason as fatal. *Lab page, round 2.*

## Promoted to rules

These started here and are now owned elsewhere; follow the owner, not this list.

- A Japanese face listed before the Chinese one mixes glyph shapes and weights in one line > [cjk-typography](fundamentals/cjk-typography.md).
- Captures of the wrong page, a loading state or the old build > the capture traps in [render-and-look](process/render-and-look.md).
- A P0/P1 marked fixed before its evidence shot was re-captured; issued findings rewritten afterwards > [critique-design](../../critique-design/SKILL.md).
- A committed critique pointing at gitignored screenshots > `critique/<date>-<target>/` in the output layout ([SKILL.md](../SKILL.md)).
- A critic subagent handed directory globs instead of a manifest > [critic-brief](../../critique-design/templates/critic-brief.md).
- Runner-up directions turned into colour-only themes that lost their character > theme families in [system](process/system.md).

## Adding a case (lab only; host sessions log feedback instead)

One line: symptom (what you saw) > cause (verified, not guessed) > check (what to do or look at next
time), then the origin with a generic host description and the date. No product or customer names.
