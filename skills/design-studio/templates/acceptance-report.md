<!-- Template: copy the structure, not the values. Save as .design/handoff/<feature>/acceptance.md.
     Acceptance is judged from screenshots of the build compared with the handoff shots, nothing else.
     Crops of every finding go to .design/critique/<date>-<target>/ and are committed.
     Delete these comments. -->

# Acceptance: <feature>, <YYYY-MM-DD>

## Build under test

- Build stamp: <commit, version string or hashed asset name, checked in every shot>
- Environment: <local / staging / device>; capture: <capture.mjs / simulator / golden test / user>
- Viewports and scale: <per target, as in handoff.json>

## Coverage

One row per region per shot pair. Region verdicts, and the rule that `ship` needs every region
`match` or `adapted`: [critique-design](../../critique-design/SKILL.md) > Accepting a build. A pair
with no build shot, or captured at another size, DPR, theme or state, keeps one row marked `recapture`.

| Screen | State | Target | Theme | Design shot | Build shot | Region | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <screen> | <empty-first> | <web-sm> | <dark> | <shots/...png> | <build/...png> | <TopBar> | <match / adapted / missing / contradicted / added / recapture> |

## Deviations

| # | Screen > component | Expected > actual | Class | Severity | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | <queue > row> | <title 16/24 semibold > 14/20 regular> | <build bug / spec gap / platform difference> | <P0-P3> | <critique/<date>-<target>/01.png> |

Build bug: the build differs from a clear spec. Spec gap: the handoff did not say; fix the handoff.
Platform difference: a system component or font renders differently; usually accept.

## Checks a still cannot show

| Check | Method | Result |
| --- | --- | --- |
| Target sizes | <lint.mjs / manual> | <...> |
| Focus order and visibility | <keyboard pass> | <...> |
| Screen-reader names | <tool or manual> | <...> |
| Contrast | <color_tools.py on computed pairs> | <...> |
| Text scaling | <200% / large text setting> | <...> |
| Reduced motion | <setting on> | <...> |

## Accepted compromises

- <deviation accepted, why, recorded in the spec>

## Disposition

<ship | fix | rebuild | recapture>. <One sentence why.> Not verified: <what, and why>.
