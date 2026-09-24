# Data-Dense UI: Admin Systems, Tables, Forms, Dashboards, Big Screens

Enterprise and operational interfaces are used for hours by people who know
the domain. They reward density, predictability, keyboard speed and honest
data - not decoration. References:
`../../design-studio/references/resources/app-ui.md` (Published design
systems; Data visualisation, dashboards and big-screen).

## Admin / CRUD Archetype

```text
Sidebar (collapsible, grouped, 1-2 levels)  |  Top bar: breadcrumb, global search, tenant / env, user
                                            |  Page header: title, status, primary action, secondary actions
                                            |  Filter bar: the 3-5 most used filters inline; "more filters" panel; saved views
                                            |  Table (or list / cards on narrow widths)
                                            |  Pagination + total count + page size
Create / edit: drawer for short forms, page for long ones, wizard only for dependent steps
```

- Use the host component library and theme it through its token API; an
  untouched default theme is the enterprise version of generic design, and a
  pile of CSS overrides is worse.
- Show where the user is (breadcrumb, selected nav item, page title) and what
  scope is active (tenant, project, environment, time range).
- Filters are state: reflect them in the URL, show active filters as removable
  chips, offer reset, remember the last view.
- Bulk actions appear when rows are selected, state the count, and confirm or
  allow undo for destructive ones.
- Permissions: hide what a role can never use; disable with an explanation
  what it cannot use right now.
- Long operations run in the background with a visible task centre; never
  block the screen on an export.

## Tables

- Text left, numbers right with tabular figures and a consistent number of
  decimals; dates in one format; units in the header, not in every cell.
- Header aligned with its column; sticky header, and sticky first column plus
  actions column when scrolling horizontally.
- Row height by density: compact 32-36, default 40-48, comfortable 52-56.
  Offer a density control for heavy users.
- Density comes from row height and padding, not from shrinking type: cells
  13-14 px (Chinese 14), and a 12 px floor for meta text, badges and
  footnotes - Chinese strokes break up below it. Going under the floor is a
  deviation to record in `decisions.md`, not a density setting.
- Dividers **or** zebra striping, not both; hover highlight; clear selected
  state.
- Two or three inline actions at most, then an overflow menu; the row's main
  link is the identifying cell.
- Sort indicators on sortable headers; one default sort that matches the
  task (usually newest or most urgent first).
- Truncate with an ellipsis and reveal on hover or expand; never truncate
  numbers or identifiers people compare; let users resize and choose columns.
- Status as badge = colour + label (+ icon). A small, fixed status vocabulary
  with fixed colours across the whole product.
- States: skeleton rows while loading, an empty state that distinguishes "no
  data yet" from "no results for these filters", an inline error with retry.
- Pagination with total count for admin data (people need to know how much
  there is and to return to page 7); infinite scroll only for feeds.
- Large data: virtualise rows; server-side sort and filter; never load
  everything to paginate client-side.
- Narrow widths: transform rows into cards with the two or three key fields,
  or allow horizontal scroll with a sticky identifier - decide per table.

## Forms

- One column; labels above inputs; group with headings; order by the user's
  mental sequence, not the database schema.
- Mark the minority: if most fields are required, mark optional ones (in
  Chinese enterprise products the red asterisk for required is the expected
  convention - follow the host product).
- Field width hints at the expected answer; choose the right control: radio
  for two to five exclusive options, select for more, combobox with search for
  many, switch only for instantly applied settings, date picker with typed
  input allowed.
- Help text below the label or field, visible before the error occurs;
  placeholder is an example, never the label.
- Validate on blur; once a field shows an error, re-validate as the user
  types; on submit, summarise, focus the first error and keep every value.
  Error text says what is wrong and how to fix it.
- Do not pre-disable submit; do not block keystrokes; trim whitespace; accept
  forgiving formats (spaces in phone numbers, pasted codes).
- Long forms: sections with a sticky section nav, autosave or an explicit
  draft, an unsaved-changes guard, and the primary action always reachable
  (sticky footer bar).
- Wizards only when later steps depend on earlier answers; show steps, allow
  going back without losing data, review before commit.
- Dangerous settings live in a separate "danger zone" and require typing the
  resource name or an equivalent confirmation.

## Dashboards

Start from the questions, not from the widgets.

1. **Who looks, when, and what do they do next?** Monitoring (is anything
   wrong now?), analysis (why did it change?), reporting (what happened this
   period?) are different dashboards.
2. **Order by importance**: status and headline numbers first, trends second,
   breakdowns third, detail tables last or on drill-down. The top-left is the
   most valuable position.
3. **Every number needs context**: comparison to a target or a previous
   period, a direction, a unit, and the time range. A lone big number is
   decoration.
4. **Choose the chart from the question**: comparison -> bars; change over
   time -> line (area only for volumes); part-to-whole -> stacked bar or
   treemap (pie only for two or three slices); distribution -> histogram or
   box plot; correlation -> scatter; ranking -> sorted bars; geography ->
   map only when location is the insight; flow -> sankey.
5. **Chart craft**: start bar axes at zero; label directly instead of using a
   legend when possible; mute gridlines; highlight one series and grey the
   rest; consistent colours for the same entity across charts; never 3D,
   never dual axes without strong reason; show the data-as-of time.
6. **Interaction**: a global time range and filters that apply to everything;
   hover details; click to drill; link to the underlying records.
7. **States**: loading skeletons shaped like the charts, empty and
   insufficient-data states, stale-data warnings, partial failures per card.
8. **Accessibility**: colour-blind-safe palettes, patterns or labels as a
   second channel, table alternative for key charts, keyboard-reachable
   tooltips.

A grid of equally sized, equally weighted cards answers no question. Vary
size by importance.

## Big-Screen Data Walls (数据大屏) and Digital-Twin Consoles

A wall is read from metres away, by a group, often unattended. It is closer to
signage than to an app.

- **Get the hardware facts first**: physical size, resolution and aspect
  (1920 x 1080, 3840 x 2160, spliced walls with extreme aspect ratios),
  viewing distance, bezels between panels (keep content off the seams),
  ambient light, whether anyone can interact.
- **Fixed canvas, scaled to fit**: design at the wall's native resolution and
  scale uniformly; do not reflow like a web page. Specify behaviour for other
  aspect ratios (letterbox or an alternate layout).
- **Legibility at distance**: minimum text height is set by distance - as a
  rule of thumb, on a 1080p wall nothing below about 24 px, labels 28-36 px,
  headline numbers 64 px and up; scale proportionally for higher resolutions.
  Medium or semibold weights; tabular figures.
- **Layout**: a dominant centre (map, twin, 3D scene or the key chart) with
  supporting panels at the sides and a headline strip on top. Few panels -
  six to nine - each answering one question. The most critical status where
  the eye rests, not in a corner.
- **Colour**: dark backgrounds reduce glare and hide bezels, but use deep,
  slightly tinted darks rather than pure black; a restrained palette with
  strong semantic colours reserved for status. Check on the actual display:
  walls shift colour and crush dark greys.
- **The cliché** is deep blue, cyan glow, neon borders, a spinning globe and
  animated decorations on every panel. It reads as generic, lowers legibility
  and burns GPU. Alternatives: typographic hierarchy with large numbers, flat
  surfaces with hairline structure, one accent hue, real spatial data, motion
  only where data changes.
- **Motion**: data updates animate smoothly (300-800 ms) so changes are
  noticed but not startling; no perpetual decorative loops; rotate views
  slowly if unattended; alarms are the only thing allowed to pulse.
- **Real-time honesty**: show last-updated time, connection state and what
  happens when a feed is down (stale markers, not frozen values).
- **Performance**: canvas or WebGL charts, throttled updates, capped particle
  and glow effects; test for a 24-hour run for memory growth.
- **Digital twin / 3D**: the 3D scene is a navigation and context device, not
  the data. Overlay legible 2D labels and panels; provide preset camera views;
  selection in 3D drives the 2D panels and vice versa; degrade gracefully when
  the GPU cannot cope.
- **Operations consoles** (as opposed to show walls) are worked at arm's
  length: higher density, strict status semantics, alarm lists with
  acknowledge flows, audit trails, keyboard operation. Study mission-control
  style design systems in the catalogue.
