# 06 · Redesign a legacy clinic scheduler: the front-desk day view

> Fictional: Alder Street Family Practice, AlderCare Scheduler, every person, phone number, insurer, record and usage
> figure below is invented for this eval.

## Context

Alder Street Family Practice is a primary-care clinic with four clinicians and a front desk of three. Since 2014 it has
run on AlderCare Scheduler 3.2, a browser-based internal tool. The clinic is replacing the tool's front end (the back
end and the data stay) and wants the most-used screen redesigned first: the **Schedule** day view the front desk keeps
open all day.

The current screen is in your working directory:

- `legacy/index.html`: the current Schedule screen as it runs today (open it in a browser; it renders standalone).
- `legacy/legacy-1280x800.png`: the same screen rendered at 1280 × 800.

The clinic is open to changes in layout and structure. The screen is used on 1280 × 800 laptops at the desk.

## Audience

- Front-desk staff (three people, one of them part-time). They check patients in, answer the phone, book and move
  appointments, collect copays, and warn clinicians about delays. They use the screen for eight hours a day, often
  mid-conversation with a patient at the counter or on the phone.
- The clinicians glance at it on a wall screen and on their own laptops to see who has arrived.
- The practice manager uses it to fill gaps and to watch no-shows.

## What we know

**Volume**: about 100 appointments a day (96 booked today) across four clinicians, 15-minute slots from 8:00 to 17:00, lunch 12:00–13:00.

**What the front desk does on this screen** (share of clicks over four weeks, from the tool's logs):

| Task | Share |
|---|---|
| Check in an arriving patient (find them, confirm details, collect copay, mark arrived) | 42% |
| Find a free slot and book (phone or counter) | 23% |
| Confirm appointments / send reminders | 11% |
| Reschedule or cancel | 9% |
| Look up a patient's balance or insurance status | 8% |
| Everything else (reports, labels, inventory, admin, messages) | 7% |

**What staff and clinicians say** (from interviews):

- "When someone walks up I need to find them in two seconds. The names are tiny and everything is the same weight."
- "Colours mean appointment type, but what I actually need at a glance is who's here, who's late and who hasn't
  confirmed."
- "Double bookings are invisible. At 10:15 on Mondays Dr. Feld has two kids in one slot and you can't tell."
- "Don't make me scroll sideways. I need all four clinicians on one screen."
- "The patient alerts are at the bottom of the right panel. I've missed an allergy flag and an unpaid balance because
  of that."
- "Twelve buttons that all look the same. Check In is the one I press all day." (front desk)
- "I just want to see who's in the waiting room and for how long." (Dr. Rao)
- "Please don't move everything around. We have temps who learned this in a day." (practice manager)

All appointment data for the redesign is in `legacy/index.html`, plus the few record details below that the current
screen does not show. Use the same day and time (Monday 28 September 2026, 8:04 AM), the same appointments and the
same selected appointment (Harold Brennan, arrived 7:52 AM) so the two screens can be compared. The file lists the
schedule from 8:00 AM to 1:30 PM; that is all the redesign needs to show.

**Also in the records** (not on the current screen; use them if your design shows them):

- Arrival times: Harold Brennan 7:52 AM, Robert Chen 7:58 AM, Priya Natarajan 8:01 AM.
- In a room: Jamal Wright, Room 7 since 7:55 AM; Mia Johansson, Room 4 since 7:57 AM.
- The 2 patients today whose insurance could not be verified: Grace Liu (9:30, Rao) and Elena Soto (10:30, Ortega).

## Deliverables

All files go in `out/` inside your working directory.

| File | What | Viewport |
|---|---|---|
| `out/schedule.html` | The redesigned Schedule day view, Harold Brennan's appointment selected | 1280 × 800 (one screen) |
| `out/rationale.md` | At most 300 words, plain language: what you changed in the structure and why (tie it to what we know), where each current function went if it is not on the screen, and what you deliberately kept | — |

**PNG: render it yourself into `out/png/schedule.png`** at a 1280 × 800 viewport, devicePixelRatio 1 (viewport only,
not full page).

`out/NOTES.md` (optional): your assumptions, one line each.

Reviewers re-render `schedule.html` with the settings below, so the HTML is the source of truth, and compare it with the
current screen. Review of the design is based on the rendered screen and this brief. The rationale is checked claim by
claim against the render. Other files are not reviewed.

### Render manifest (used by the reviewers' renderer; do not change)

```render-manifest
{"items": [
  {"html": "schedule.html", "png": "schedule.png", "width": 1280, "height": 800, "dpr": 1, "full_page": false}
]}
```

## Constraints

- One screen at 1280 × 800. Inner scrolling (for example of the day grid) is allowed, but what matters most must be
  visible without it.
- Every current function stays reachable (on the screen, or one clear step away such as a labelled menu). The
  rationale says where anything not on the screen went.
- Text contrast meets WCAG 2.2 AA. Status must not rely on colour alone. Controls the front desk uses all day are easy to
  hit (at least 24 × 24 px).
- Opens directly from disk (file://) with no build step or local server. Fonts and libraries may load from public
  CDNs. Renders are made with Chrome on macOS with network access.
- Use the data in `legacy/index.html` and above; do not invent appointments, patients or features.
- Show the product screen only: no annotations, callouts or notes addressed to reviewers on the page (put those in
  `out/rationale.md` or `out/NOTES.md`).

## Working rules (the same for every run)

- You work alone; no one will answer questions during the run. Where you would ask, decide, and write the assumption
  in `out/NOTES.md`.
- Time limit: 60 minutes wall-clock. The run is stopped at 60 minutes and whatever is in `out/` then is reviewed.
- Node and Playwright are available (`import { chromium } from 'playwright'`, launch with `{ channel: 'chrome' }`).

## Done means

- `out/schedule.html`, `out/png/schedule.png` and `out/rationale.md` exist.
- The redesigned screen shows the same day, appointments and selected patient as the current one.
- The structure reflects how the front desk works (the task shares and quotes above), not only a new coat of paint.
- Every current function is on the screen or accounted for in the rationale.
- The render shows no overlap, clipping, or unreadable text.

<!-- JUDGE NOTES BELOW: the orchestrator removes everything from this line down before giving the brief to a design agent. -->

## Judging notes (judges only)

You receive the current screen (`before.png`, the legacy tool) as well as each arm's redesign. Score `before.png` too,
as reference R, with the same anchors; it is not part of the pairwise preferences.

The question is whether the **structure** improved for the front desk, not only the finish:

- The most frequent task (check-in, 42%) is fast: arriving patients are easy to find by name, and Check In is the obvious
  action for the selected appointment.
- Status (arrived and for how long, in room, late, unconfirmed, no-show, cancelled) reads at a glance and not by colour
  alone; the double booking at 10:15 (Feld: Reyes and Adams) is visible as a double booking.
- Patient alerts (penicillin allergy, overdue balance, hearing and large-print needs) are prominent where check-in
  happens.
- All four clinicians are visible at once without horizontal scrolling, and a useful span of the day (roughly two hours
  or more) is visible.
- Navigation is consolidated (the 14 tabs grouped or reduced) while every function stays reachable. You see neither
  the rationale nor the inside of closed menus, so do not penalise a function for sitting behind a labelled menu,
  tab or control whose label plausibly holds it. Walk the function list below and count against Fit only functions
  with no visible home at all. The function-by-function check against the rationale is done separately and reported
  beside your scores.
- The practice manager's concern is respected: familiar anchors (the clinician-column day view, the names of actions)
  are kept or their replacement is clearly easier.

Scoring guidance: a re-skin that keeps the legacy structure (same regions, same 12 equal buttons, same colour-by-type
legend) with nicer styling scores at most 3 on Fit and Hierarchy, however polished. Removing functions to look clean is
not an improvement. Density suited to an eight-hour work tool is correct; do not reward whitespace for its own sake.

Common problems: a patient-facing, consumer-style look with large cards that fits one clinician's morning on screen;
colour still encoding type while status stays hidden; alerts moved further away; functions silently dropped; invented
features (AI suggestions, analytics) that were not asked for; tiny text carried over from the legacy.

Do not reward or penalise: the brand colour; dark versus light theme; extra screens.

Use the measured facts provided by the orchestrator for contrast and target sizes; do not re-estimate contrast by eye.

### Function list (for the coverage check)

Every function on the current screen; each must be on the redesigned screen or one clear step away, or the rationale
must say where it went.

- Header: clinic location switcher (Main / Eastside Annex), signed-in user, preferences, change password, log out, date
  and time.
- Top tabs: Home, Schedule, Patients, Check-In, Waitlist (4), Recalls, Billing, Insurance / Eligibility, Reports,
  Messages (3), Tasks, Inventory, Admin, Help.
- Alert banner: 3 appointments unconfirmed for tomorrow; 2 patients today whose insurance could not be verified;
  maintenance notice (Sat 10/03, 10:00 PM – 2:00 AM).
- Toolbar: New appointment, Find slot, Block time, Walk-in, Print day, Print labels, Export, Refresh, Day / Week / Month,
  provider filter, date back / forward / picker / Today, patient search (name or MRN).
- Left column: month calendar, appointment-type legend, status-code legend, waitlist (4 patients).
- Day grid: four clinician columns (Rao, Feld, Kim, Ortega) with rooms, 15-minute rows, appointments with status,
  name, age/sex and reason, blocked time (admin, flu clinic, same-day hold, lunch), cancelled appointments.
- Appointment details (selected: Harold Brennan): patient, DOB/age, MRN, phones, time, type, provider, reason, status,
  room, insurance and eligibility, copay, booked by, reminder status; 12 actions (Check in, Room, Check out, Edit,
  Reschedule, Cancel, No show, Copay, Eligibility, Reminder, Notes, Print); patient alerts (balance overdue $140.00,
  64 days; penicillin allergy; large-print forms, hard of hearing right ear); recent visits.
- Status bar: counts (96 appointments, 3 arrived, 2 in room, 0 no-shows), server and build.
