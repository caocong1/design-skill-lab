---
title: Data-dense UI (tables, dashboards, big screens, charts)
evidence: practice
sources: [wcag-22, vercel-web-interface-guidelines]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Data-dense UI

Admin systems, tables, dashboards, data walls and every chart in the suite. People use these for hours,
know the domain and read numbers to decide. Reward density, predictability, keyboard speed and honest
data, not decoration. This file is the one home for chart choice, chart craft and data colour;
[product-ui](product-ui.md), [graphics](graphics.md) and [color](../fundamentals/color.md) link here.

References ([research](../process/research.md)): catalogue sections `dataviz:guides-principles`,
`dataviz:dashboards-bigscreen`, `dataviz:exemplars-journalism`, `dataviz:palettes-tools`; for admin
systems, `app-ui:design-systems` and `app-ui:screens-flows`.

## Admin / CRUD layout

This skeleton is the category canon, not a direction. On an options board it is the canon card
([directions](../process/directions.md) §4), and directions vary it on the structural axes
(directions §5). In a redesign the canon is the current structure instead, and change cost decides
the recommendation, not what the board shows ([redesign](../process/redesign.md) §3, §7). The rules
under the diagram hold in every direction.

```text
Sidebar (grouped, 1-2 levels, collapsible) | Top bar: breadcrumb, global search, scope (tenant / env / time range), user
                                           | Page header: title, status, primary action, secondary actions
                                           | Filter bar: the 3-5 most used filters inline; "more filters"; saved views
                                           | Table (list or cards at narrow widths)
                                           | Pagination + total count + page size
Create / edit: drawer for short forms (up to about 8 fields), page for long ones, wizard only for dependent steps
```

- Show where the user is (breadcrumb, selected nav item, title) and which scope is active.
- Filters are state: in the URL, shown as removable chips, with reset, saved views and the last view remembered.
- Bulk actions appear on selection and state the count. Selecting beyond the page is explicit ("已选本页 20 项 · 选择全部 1,284 项"). Destructive bulk actions confirm with the count or offer undo.
- Permissions: hide what a role can never use; disable with a reason what it cannot use right now.
- Exports, imports and batch jobs run in the background with a task centre and a notification; never block the screen.
- Form rules are in [product-ui](product-ui.md). Theme the host component library through its tokens; never ship its stock look (product-ui Traps).

## Tables

Alignment and numbers:

- Text left; numbers right with tabular figures and fixed decimals per column; one date format; units in the header, not in every cell; each header aligned like its column.
- Middle-truncate long IDs and paths ("a1b2…9f0e") so both ends stay comparable.

Density and type (row heights per density and the density setting: [layout-and-spacing](../fundamentals/layout-and-spacing.md)):

- Cell text: 13-14 px in compact tables (Chinese 14; 13 only when the face stays legible at DPR 1), 14 px default, 14-16 px comfortable. Density comes from row height and padding, never from shrinking type.
- Floor in dense CJK interfaces: 12 px for meta text, badges, footnotes and every table cell, with no caption exception. Below it Chinese strokes merge, worst at DPR 1 on Windows. Going under is a deviation recorded in decisions.md with its reason, not a density setting; a critique finding against it stays open until fixed or accepted there.

Structure:

- Sticky header; sticky identifier and actions columns when the table scrolls horizontally.
- Dividers or zebra striping, not both; a hover highlight; a selected state shown by more than colour (check plus tint).
- Two or three inline row actions, then an overflow menu; the identifying cell links to the detail.
- Sort indicators on sortable headers; one default sort that matches the task (newest or most urgent first).
- Truncate text with an ellipsis and reveal it on hover, focus or expand. Never truncate numbers or identifiers people compare. Columns are resizable and choosable; views can be saved.
- Status is a badge with colour + label (+ icon) from one fixed, product-wide vocabulary (草稿 / 待审核 / 已通过 / 已驳回), the same colour everywhere.
- Inline editing only for frequent small edits: affordance on hover and focus, Enter or blur saves, Esc cancels, errors per cell.
- Admin data gets pagination with a total count and page size (people return to page 7); infinite scroll is for feeds. Coming back from a detail restores page, filters and scroll.
- Large data: virtualise past about 50 rendered rows; sort and filter on the server; never load everything to paginate on the client.
- Narrow widths: cards with the two or three key fields, or horizontal scroll with a sticky identifier. Decide per table and draw it.
- States: skeleton rows while loading; the three empty states from [product-ui](product-ui.md); an inline error with retry; per-row results after a bulk action.

## Choosing a chart

Start from the question the reader must answer. Write it above the chart in the draft; if you cannot,
the chart is decoration.

| Question | Chart | Avoid |
| --- | --- | --- |
| How do these compare? | bars, sorted; horizontal when labels are long (most CJK labels) | pie, radar, unsorted bars |
| How did it change over time? | line; columns for a few discrete periods; area only for volumes that sum | more than 4-5 lines on one chart |
| What share of the whole? | one stacked or 100 % bar; treemap for many parts; pie or donut only for 2-3 slices | 3D, donuts with 8 slices |
| How is it distributed? | histogram, box plot; strip or beeswarm for small n | an average alone |
| Do two measures relate? | scatter, with a trend line only if it means something | two lines on dual axes |
| What is the rank? | sorted bars; bump chart for rank over time | |
| Where? | choropleth of rates (not counts) or proportional symbols | a map when location is not the insight |
| How does it flow or convert? | sankey; funnel for sequential steps | |
| Actual vs target? | bullet chart; bar with a target tick | gauges and speedometers |
| One number, now? | a KPI tile: value, unit, delta vs a named comparison, sparkline, as-of | a naked big number |
| Many series, same shape? | small multiples on shared axes | spaghetti lines |
| Exact lookup? | a table, with in-cell bars if magnitude matters | a chart |

## Chart craft

- The title states the finding ("华东区 Q3 退货率升至 4.2%"); the metric name, unit and period go in the subtitle.
- Bar axes start at zero. A line axis may start elsewhere if labelled; never crop an axis to exaggerate.
- Label directly at the line end or on the bar. Use a legend only when labels collide, ordered like the data.
- Highlight the series that matters and grey the rest. The same entity keeps the same colour in every chart of the product.
- Mute or drop gridlines. No chart borders, 3D, shadows or gradients on marks.
- No dual axes unless both series tell one unit story; prefer two aligned charts. Past 4-5 lines, use small multiples.
- Annotate events on a time series (release, outage, price change) where the reader would ask what happened.
- Numbers: locale grouping and abbreviations (万 and 亿, or K and M: [product-ui](product-ui.md) Words), tabular figures, consistent decimals.
- Show the as-of time and the source on the chart or its card.
- Too little data is a state ("数据不足 7 天，暂不显示趋势"), not a flat line at zero.
- Accessibility: marks and lines meet the non-text contrast minimum against adjacent colours (WCAG 1.4.11, threshold in [color](../fundamentals/color.md)), and each pie slice or area is told apart by more than hue; a second channel besides colour, such as a direct label, shape, dash or position (1.4.1); a table view or a one-sentence summary for key charts; tooltips reachable by keyboard, dismissible with Esc and hoverable (1.4.13); on touch, a tap shows the value.

## Data colour

Ramps, contrast and colour-vision simulation are computed as in [color](../fundamentals/color.md).
What is specific to charts:

- Categorical: at most eight hues, differing in lightness as well as hue, ordered by importance, "其他 / other" in grey. Simulate the whole set for colour-vision deficiency and check each hue against the plot ground.
- Sequential: one hue, a lightness ramp in OKLCH. More value means more contrast with the ground (darker on light grounds, brighter on dark ones).
- Diverging: two hues through a neutral midpoint placed at a meaningful zero (target, average, 0 %).
- Status colours are not series colours: red, amber and green stay reserved for status and are never used as categories.
- Price and market deltas follow the audience's convention (红涨绿跌 or the reverse: color.md Conventions). Make them tokens (`--data-up`, `--data-down`) so every chart follows the product's setting; never hard-code them in a chart.
- Business KPIs are coloured by good or bad, not by direction: a rising 退货率 is bad. The arrow shows direction; the colour shows judgement.

## Dashboards

Start from the questions, not from the widgets.

1. **Type.** Monitoring (is anything wrong now? status and exceptions first, auto-refresh, alarms), analysis (why did it change? filters, comparisons, drill-down) or reporting (what happened this period? fixed period, narrative, export and print). One dashboard, one type.
2. **Who looks, when, and what they do next.** A tile that leads to no decision or action goes.
3. **Order by importance.** A headline strip of three to five numbers, then trends, then breakdowns, then detail tables or drill-down. The top-leading position is the strongest. Vary tile size by importance: a grid of equal tiles answers no question.
4. **Every number has context:** label with scope, value and unit, delta vs a named comparison ("较上周 +3.2%"), direction, time range, as-of. A lone big number is decoration (the hero-metric tell in [anti-slop](../fundamentals/anti-slop.md)).
5. **One global time range and filter set** in the header applies to everything; a tile that differs says so on the tile.
6. **Interaction:** hover for detail, click to drill, a path to the underlying records, cross-filtering where it helps.
7. **States per tile, not per page:** loading skeleton shaped like the chart, empty, insufficient data, stale (older than twice the refresh interval), partial failure with retry.
8. **Refresh:** state the interval; animate value changes subtly; never reorder a ranking under the user's pointer without a signal.

## Big screens (数据大屏)

A wall is read from metres away, by a group, often unattended. It is closer to signage than to an app.

Get the hardware facts first: physical width and height, resolution and aspect (1920 x 1080, 3840 x 2160,
spliced walls such as 5760 x 1080), bezel positions, farthest viewing distance, ambient light, whether
anyone interacts, how long it runs unattended.

- **Fixed canvas, scaled to fit.** Design at native resolution and scale uniformly; do not reflow like a web page. Specify other aspects (letterbox or an alternate layout). Keep text and key marks off the seams.
- **Legibility by visual angle.** The smallest text that must be read is at least 1/200 of the farthest viewing distance tall (about 17 arcminutes); headline numbers three times that. Convert: px = mm / pixel pitch (wall width in mm / horizontal pixels); font size = text height / 0.7 for Latin capitals, / 0.9 for CJK. Example: a 5.5 m wide 1920 px wall (2.9 mm/px) read from 10 m needs 50 mm = 17 px of text: a 25 px font for Latin capitals, 19 px for CJK. Without hardware facts, on a 1080p canvas: nothing under 24 px, labels 28-36 px, headline numbers 64 px and up. Medium or semibold weights; tabular figures.
- **Layout.** A dominant centre (map, twin, key chart), supporting panels at the sides, a headline strip on top. Six to nine panels, each answering one question. The most critical status sits where the eye rests, not in a corner.
- **Colour.** Deep, slightly tinted darks rather than pure black; strong semantic colours kept for status; series at lower chroma, since saturated colour blooms on LED panels. Walls shift colour and crush dark greys: check on the real display, and list the colour as unverified until then.
- **The cliché.** Navy-to-black ground, cyan glow, neon corner-bracket frames (科技感边框), a trapezoid title bar ("XX 智慧平台"), a spinning globe, particle flows, gauge dials, animation on every panel. It reads as generic, lowers legibility and burns GPU. Instead: typographic hierarchy with large numbers, flat surfaces with hairline structure, one accent hue, real spatial data, motion only where data changes. When the brief asks for 科技感, the brief wins: keep the look, spend glow only on alarms, keep text flat and legible.
- **Motion.** Data updates animate over 300-800 ms, noticed but not startling. No perpetual decorative loops. Unattended rotation between views is slow and pauses on interaction. Alarms are the only thing that pulses, within the flash limit in [motion](motion.md).
- **Real-time honesty.** Show the last-updated time and the connection state on the wall. When a feed drops, values turn visibly stale (grey, "数据中断 14:32") instead of freezing as if live. Simulated data carries a "演示数据" label.
- **Performance.** Canvas or WebGL for dense or fast series; updates throttled to what the eye can follow; particles and glow capped; a 24-hour soak test for memory growth.
- **Digital twin and 3D.** The scene is navigation and context, not the data. Overlay legible 2D labels and panels, provide preset camera views, let selection in 3D drive the 2D panels and back, and fall back to 2D when the GPU cannot cope.
- **Operations consoles** (worked at arm's length, not shown off): higher density, strict status semantics, alarm lists with acknowledge, shelve and clear flows, an audit trail, full keyboard operation.

## Deliverable and checks

- Tables and dashboards: drawn at target size with real-shaped data (plausible magnitudes, long names, missing values), across the state matrix, plus a narrow-width version of every table.
- Charts: the question, the chart type and why, colour tokens (including up and down per locale), and the table fallback.
- Walls: a native-resolution render plus 1:1 crops of the smallest text and a seam overlay; a scaled-down full shot hides legibility failures. States: live, stale, feed down, alarm.
- Before critique: the categorical palette under CVD and against its ground (color_tools.py); the smallest text against the visual-angle rule; no text on a seam.
