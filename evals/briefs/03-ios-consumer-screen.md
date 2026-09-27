# 03 · iOS reading-habit app: Today, book detail, first-run empty state

> Fictional: the app Dogear, its user and her reading data are invented for this eval. The books are real
> public-domain works; the quotations are from their texts; page numbers are illustrative.

## Context

Dogear is a small iPhone app for people who want to read a little every day. It does three things: a daily reading goal
with a session timer, a log of what you read, and a place to keep highlights. It is not a store and not a social network.
The team is preparing its first release for iOS 26 and wants three key screens designed so they feel at home on the
current iPhone.

## Audience

- Adults who used to read a lot and want the habit back; they read paper books and e-books, mostly in the evening.
- They open the app for a few seconds at a time: start a session, log pages, glance at the streak.
- Many use larger text sizes; some read in bed with the phone dimmed.

## Target

- iPhone 17 Pro, iOS 26, light appearance, portrait. Canvas 402 × 874 pt.
- The top 62 pt hold the status bar and Dynamic Island; the bottom 34 pt hold the home indicator. Draw the status bar
  (time 9:41, signal, Wi-Fi, battery) and the home indicator as they would appear, so reviewers can see the layout
  around them.
- Top-level sections of the app: Today, Library, Stats, and Search.

## Content (use this; do not invent more data)

**Reader**: Maya. Daily goal 20 minutes. Current streak 4 days (best 23); a streak counts days with at least one
reading session. Today, Sunday 27 September: 12 of 20 minutes read so far.

**Currently reading**

| Book | Author | Progress | Last session |
|---|---|---|---|
| Middlemarch | George Eliot | page 312 of 880 (35%) | today, 12 min, pp. 301–312 |
| Walden | Henry David Thoreau | 61% (e-book) | Thursday, 6 min |
| The Pillow Book | Sei Shōnagon | 18% | 14 Sep, 9 min |

**This week (minutes)**: Mon 24 · Tue 18 · Wed 0 · Thu 31 · Fri 18 · Sat 22 · Sun 12 (today, in progress)

**A recent highlight** (Middlemarch, p. 194): "If we had a keen vision and feeling of all ordinary human life, it would be
like hearing the grass grow and the squirrel's heart beat, and we should die of that roar which lies on the other side of
silence."

**Book detail: Middlemarch**
- George Eliot · first published 1871–72 · 880 pages
- Progress: page 312 of 880 (35%). Time read: 11 h 40 min over 23 sessions. At your pace: about 21 h left.
- Sessions: Today · 12 min · pp. 301–312 / Sat 26 Sep · 22 min · pp. 285–300 / Fri 25 Sep · 18 min · pp. 271–284 /
  Thu 24 Sep · 25 min · pp. 252–270
- Highlights (2): p. 194 (Chapter 20) the quotation above; p. 211 (Chapter 21) "We are all of us born in moral
  stupidity, taking the world as an udder to feed our supreme selves."
- Actions: Start session (primary), Log pages, Add highlight; more: Mark as finished, Edit goal, Remove from library

**First-run empty state (Today, new user, no books yet)**
- Daily goal preset to 20 minutes, adjustable.
- Ways to add the first book: Scan barcode, Search by title, Import from a CSV file.
- Nothing else exists yet: no streak, no sessions, no highlights.

## Deliverables

All files go in `out/` inside your working directory.

| File | What | Viewport |
|---|---|---|
| `out/today.html` | Today (returning reader, data above) | 402 × 874 |
| `out/book.html` | Book detail: Middlemarch | 402 × 874 |
| `out/empty.html` | Today, first run, no books | 402 × 874 |

Each HTML file renders the screen edge to edge at a 402 × 874 viewport: no device bezel, no surrounding page. Only the
first screen (402 × 874) is reviewed; content may continue below it but will not be seen.

**PNGs: render them yourself into `out/png/`**: `today.png`, `book.png`, `empty.png`, at a 402 × 874 viewport with
devicePixelRatio 2 (804 × 1748 px).

`out/NOTES.md` (optional): your assumptions, one line each.

Reviewers re-render the HTML files with the settings below, so the HTML is the source of truth. Review is based on the
rendered screens and this brief; other files are not reviewed.

### Render manifest (used by the reviewers' renderer; do not change)

```render-manifest
{"items": [
  {"html": "today.html", "png": "today.png", "width": 402, "height": 874, "dpr": 2, "full_page": false},
  {"html": "book.html", "png": "book.png", "width": 402, "height": 874, "dpr": 2, "full_page": false},
  {"html": "empty.html", "png": "empty.png", "width": 402, "height": 874, "dpr": 2, "full_page": false}
]}
```

## Constraints

- It must look and behave like an iPhone app on iOS 26, not like a website or an app from another platform.
  Reviewers judge platform fit.
- Text contrast meets WCAG 2.2 AA, including any text over translucent or blurred surfaces.
- Opens directly from disk (file://) with no build step or local server. Fonts and libraries may load from public
  CDNs. Renders are made with Chrome on macOS with network access.
- No invented data beyond the content above. You may shorten or reorder copy.
- Images: make them yourself (HTML, CSS, SVG) or load them from a public URL whose licence allows it; note the source
  in NOTES.md. Book covers may be drawn as simple designed placeholders.
- Show the app screen only: no annotations, callouts or notes addressed to reviewers on the page (put those in
  `out/NOTES.md`).

## Working rules (the same for every run)

- You work alone; no one will answer questions during the run. Where you would ask, decide, and write the assumption
  in `out/NOTES.md`.
- Time limit: 60 minutes wall-clock. The run is stopped at 60 minutes and whatever is in `out/` then is reviewed.
- Node and Playwright are available (`import { chromium } from 'playwright'`, launch with `{ channel: 'chrome' }`).

## Done means

- The three HTML files and three PNGs exist with the names above.
- Each screen shows the content given for it; the first-run screen makes the first step obvious.
- Status bar and home indicator are drawn; nothing interactive sits under them.
- The renders show no overlap, clipping, or text that is hard to read.

<!-- JUDGE NOTES BELOW: the orchestrator removes everything from this line down before giving the brief to a design agent. -->

## Judging notes (judges only)

Platform fit for iOS 26 (Liquid Glass generation) usually shows as:

- A tab bar that floats above the content near the bottom (inset from the screen edges, rounded, on a translucent
  material layer), above the home indicator, with content visibly continuing beneath it. Search may appear as its own
  tab or control at the trailing end.
- Navigation: a large title on the top-level screen (Today); on the pushed detail screen a back control at the top
  leading edge and actions at the top trailing edge, typically as round or capsule-shaped glass buttons. Controls and
  navigation sit on the glass layer; the content itself (cards, lists) is not made of glass.
- One clear primary action per screen (Start session), not several competing filled buttons.
- San Francisco / the system font (on the web: `-apple-system`, `system-ui`), text-style sizes (body around 17 pt,
  large title around 34 pt), consistent SF Symbols-style glyphs, touch targets at least 44 × 44 pt.
- The status bar and home indicator areas are respected; nothing interactive sits under them.

A web mock can only approximate glass. Judge placement, layering, shape and legibility, not the fidelity of the blur.

Other signs of quality: the goal and streak read in a glance; the week chart is labelled and honest (Wednesday is 0,
Sunday is in progress); long quotations are set as reading text, not squeezed; the empty state explains what the app
does in one line and makes adding the first book the obvious step without faking a streak or data.

Common problems: Material patterns on iOS (floating action button, hamburger menu, top app bar with left-aligned title
and overflow menu, Roboto); an opaque flush tab bar from older iOS drawn as the default; a website layout inside a
phone-sized canvas; everything frosted; tiny secondary text; multiple primary buttons; a device bezel instead of an
edge-to-edge screen; invented features (social feed, store).

Do not reward or penalise: exact status-bar icon drawings; the specific accent colour; extra screens.

Use the measured facts provided by the orchestrator for contrast and target sizes; do not re-estimate contrast by eye.
