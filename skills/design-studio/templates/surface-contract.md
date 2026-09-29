<!-- Template: copy the structure, not the values. Save as .design/surfaces/<surface>.md, one per
     surface (a route, a screen family or a page). The final critique audits the render against every
     block below. Never copy this file into shipped code. Delete these comments. -->

# Surface: <surface> (<route or screen>)

Visitor mode: <Operate | Persuade | Read | Experience> - Targets: <web 1280 and 390; iOS 402 x 874> -
Direction: <A "<name>"> - Updated: <YYYY-MM-DD>

## Thesis

<One sentence: what this surface must make true for the person using it.>

## Own-world

<The referent from the audience's world that this surface borrows.>

One memorable idea: <the one element that carries the referent on this surface, e.g. "the queue as a
departure board: one line per job, status by position". Elevate (loop step 10) intensifies this.>

## Story

<The order in which the surface reveals itself: first, then, then. On an Operate surface this is the
order of the primary task.>

## First viewport

<Per target: the one thing seen first, the primary action, and what is deliberately below the fold.
A collection also names its default sort, the fields every row shows, how each status reads without
colour, and which low-frequency fields (ids, paths, provenance) sit behind a disclosure.>

Above the fold (checked with `lint.mjs --above-fold`): <per viewport, the selectors that must end
inside it, e.g. 1280x720: `h1, [data-component=PrimaryAction]`; 390x844: `h1, [data-component=PrimaryAction]`>

## Task cost

<Operate surfaces: each top job as a keystroke-level string with its estimate, before and after, pointer
and keyboard paths (references/disciplines/interaction.md section 1), e.g. "派单: M P BB = 2.5 s (was
M P BB · P BB · M P BB · M P BB · M P BB = 11.3 s); keyboard M K K K K = 2.3 s". Other modes: delete.>

## Form + seed

<Type voice, colour strategy, layout grammar, density, shape, motion personality, with the DESIGN.md
sections or tokens that implement them. Seed: <value, as recorded in decisions.md>.>

## Finish line

<Observable conditions a critic can check on the screenshots, e.g. "the queue count and the next
item's deadline read at arm's length in the 1280 shot"; "dark theme passes the floor"; "the one
memorable idea is visible in the first viewport at 390".>

- [ ] <condition>
- [ ] <condition>
