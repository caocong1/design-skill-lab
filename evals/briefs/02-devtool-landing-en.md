# 02 · Landing page for a local-first database (developer tool)

> Fictional: Driftless, Driftless Labs, every package name, URL, number and benchmark below is invented for this eval.

## Context

Driftless is an open-source, local-first SQL database. It runs inside the app (browser, phone, desktop, server), so reads
and writes never wait for the network, and it syncs every copy in the background. Version 1.4 has just shipped. The
current website is a README-style docs page; the team wants a real landing page that makes the idea clear to developers
who have never built local-first, and that gets the ones who already want it to the install command fast.

## Audience

- Primary: application developers (web and mobile) who have hit the limits of "server + cache": slow screens on bad
  networks, offline bugs, hand-written conflict code. They read code before they read marketing copy.
- Secondary: tech leads deciding whether a managed plan is worth paying for.
- They distrust vague claims. They will look for how it works, what it costs, and what the catch is.

## Content (use this; do not invent more facts)

**Message** (use or rewrite in your own words, keep the meaning): Your app's data lives on the device first. Reads and
writes are instant and work offline; Driftless keeps every copy in sync.

**What it is**
- Embedded SQL database, SQLite-compatible dialect. Runs in the browser (WebAssembly + OPFS), iOS and Android (native
  library), desktop (Electron, Tauri) and server (Node, Bun, Deno).
- All reads and writes are local. Sync runs in the background through the Driftless Sync Server (open source, one binary,
  backed by Postgres or SQLite) or Driftless Cloud (managed).
- Conflicts merge automatically per column (hybrid logical clocks). Custom merge functions for counters, lists and rich text.
- Reactive queries: `db.watch` re-runs a query whenever matching rows change, locally or from sync.
- Partial sync with "shapes": each user syncs only the rows a filter selects (for example `WHERE team_id = ?`).
- Auth: bring your own JWT; row-level rules are checked by the sync server.
- Offline: the app keeps working offline; pending changes survive restarts.
- Browser bundle: 690 KB gzipped.

**How it works** (three steps): 1. Your app writes to its local database. 2. Driftless records the change and merges
concurrent edits per column. 3. The sync server relays changes to every other device that holds matching rows.

**Code sample** (show it as code, legible):

```ts
import { open } from "@driftless/client";

const db = await open("notes.db", { sync: "wss://sync.example.dev", token });

await db.exec`CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY, body TEXT, updated_at INTEGER)`;

db.watch`SELECT * FROM notes ORDER BY updated_at DESC`.subscribe(render);

await db.exec`INSERT INTO notes VALUES (${id}, ${body}, ${Date.now()})`;
```

**Install**
- `npm install @driftless/client`
- Swift Package Manager: `github.com/driftless-db/driftless-swift`
- Gradle: `dev.driftless:driftless-android:1.4.0`

**What's new in 1.4** (released 19 Aug 2026): shapes are generally available; Bun support; WebAssembly bundle 30% smaller.

**Benchmarks** (from the project's published benchmark page; setup: M3 MacBook Air, Chrome 140, OPFS)
- Local indexed read, p50: 0.2 ms
- Local write, p50: 0.8 ms
- 10,000 row changes reaching a second device over a throttled 4G profile: 1.9 s

**Comparison: server-first app with a cache vs Driftless**

| | Server-first + cache | Driftless |
|---|---|---|
| Reads | network round trip, or a possibly stale cache | local, sub-millisecond |
| Offline writes | usually blocked, or a custom queue you maintain | built in |
| Conflicts | hand-written | automatic per column, customisable |
| Live updates | a separate realtime service | reactive queries included |
| Where data lives | your server | each device and your server |

**Pricing**

| Plan | Price | Includes |
|---|---|---|
| Open source | Free | Client libraries and self-hosted sync server, Apache-2.0 |
| Cloud Hobby | $0 / month | 1 project, 1 GB synced data, 500 monthly active devices, community support |
| Cloud Pro | $39 / month per project | 25 GB synced data, 25,000 monthly active devices, 7-day point-in-time restore, email support |
| Enterprise | Contact us | SSO/SAML, dedicated region (EU, US or APAC), 99.95% uptime SLA, audit log export |

**FAQ**
- *Is it SQLite?* The storage engine is a fork of SQLite 3.46 with sync metadata; most SQLite SQL runs unchanged.
  Extensions that change the file format are not supported.
- *Do I need Driftless Cloud?* No. The sync server is a single open-source binary you can run anywhere; Cloud is the
  managed version.
- *How big can a local database get?* Browser storage limits apply (usually a share of free disk). On native platforms
  the tested limit is 50 GB.
- *What happens when two people edit the same row offline?* Each column merges by hybrid logical clock; register custom
  merge functions for counters, lists and rich text.

**Proof you may use** (the only social proof allowed): 18.4k GitHub stars · 236 contributors · 1.2M npm downloads per
month (August 2026).

**Navigation**: Docs · Guides · Pricing · Blog · Changelog · GitHub · Sign in · Get started (primary)

**Footer**: Docs, API reference, Status, Security, Privacy, Terms, Changelog, GitHub. © 2026 Driftless Labs.

## Deliverables

All files go in `out/` inside your working directory.

| File | What | Viewports |
|---|---|---|
| `out/index.html` | The landing page, one responsive file | desktop 1440 × 900 (full page) and mobile 390 × 844 (full page) |

**PNGs: render them yourself into `out/png/`**: `desktop.png` (1440 × 900 viewport, devicePixelRatio 1, full page) and
`mobile.png` (390 × 844 viewport, devicePixelRatio 2, full page).

`out/NOTES.md` (optional): your assumptions, one line each.

Reviewers re-render `index.html` with the settings below, so the HTML is the source of truth. Review is based on the
rendered screens and this brief; other files are not reviewed. Full pages are reviewed as consecutive screens; only the
first 10 screens of height are reviewed at each size.

### Render manifest (used by the reviewers' renderer; do not change)

```render-manifest
{"items": [
  {"html": "index.html", "png": "desktop.png", "width": 1440, "height": 900, "dpr": 1, "full_page": true},
  {"html": "index.html", "png": "mobile.png", "width": 390, "height": 844, "dpr": 2, "full_page": true}
]}
```

## Constraints

- **No invented social proof.** No customer logos, testimonials, quotes, "trusted by" rows, user counts or company
  names beyond the proof listed above. Platform and runtime names may appear as text. A wordmark or logo for
  Driftless itself is yours to design.
- No invented facts: numbers, features and claims come from the content above. You may shorten, reorder or omit content,
  but the install command, the code sample and the pricing must be on the page.
- Text contrast meets WCAG 2.2 AA. No horizontal scrolling at 390 wide.
- The page scrolls as a normal document; content must not depend on hover or clicks to appear. The renderer scrolls
  through the page once before capturing, so scroll-triggered entrances are fine.
- Opens directly from disk (file://) with no build step or local server. Fonts, libraries and images may load from
  public CDNs. Renders are made with Chrome on macOS with network access.
- Images, illustrations and diagrams: make them yourself (HTML, CSS, SVG, canvas) or load them from a public URL
  whose licence allows it; note the source in NOTES.md.
- Show the product page only: no annotations, callouts or notes addressed to reviewers on the page (put those in
  `out/NOTES.md`).

## Working rules (the same for every run)

- You work alone; no one will answer questions during the run. Where you would ask, decide, and write the assumption
  in `out/NOTES.md`.
- Time limit: 60 minutes wall-clock. The run is stopped at 60 minutes and whatever is in `out/` then is reviewed.
- Node and Playwright are available (`import { chromium } from 'playwright'`, launch with `{ channel: 'chrome' }`).

## Done means

- `out/index.html`, `out/png/desktop.png` and `out/png/mobile.png` exist.
- In the first desktop screen and the first mobile screen, a developer can tell what Driftless is and how to start.
- The code sample is readable at both sizes; the pricing plans can be compared.
- There is no invented social proof and no invented fact.
- The renders show no overlap, clipping, broken layout, or horizontal overflow on mobile.

<!-- JUDGE NOTES BELOW: the orchestrator removes everything from this line down before giving the brief to a design agent. -->

## Judging notes (judges only)

A strong answer usually:

- Makes the first screen say what it is, for whom, and what to do next (Get started / install), at 1440 and at 390.
- Explains local-first concretely (the how-it-works steps, a diagram, the comparison) rather than with adjectives.
- Shows the code sample as real, legible code (monospaced, sensible size, not a tiny image), and makes the install
  command easy to copy.
- Keeps technical claims exactly as given. Any invented metric, customer, logo, testimonial or quote is a serious Fit
  failure: cap Fit at 2 and say what was invented.
- Reflows for mobile (not a shrunken desktop): readable type, reachable navigation, code that wraps or scrolls
  sensibly, no horizontal overflow (see the facts).
- Has a character of its own. Apply the name-swap test: if the page would fit any developer tool unchanged (for
  example the stock combination of purple-blue glow, grid pattern, bento cards and a gradient headline), Identity is
  at most 3, however polished. A dark or light theme on its own decides nothing.
- Makes pricing comparable at a glance and the comparison table honest.

Common problems: a "trusted by" row or quotes (forbidden); marketing adjectives with no mechanism; code shown as a
decorative, unreadable screenshot; mobile first screen filled by an illustration with the message pushed below;
navigation that disappears on mobile without a replacement; low-contrast grey body text on dark backgrounds.

Do not reward or penalise: dark versus light theme as such; animation (the renders are static); extra pages.

Use the measured facts provided by the orchestrator for contrast, overflow and targets; do not re-estimate contrast by eye.
