# 05 · An AI agent run inside an accounting app: plan, progress, approval, error, result

> Fictional: Fernhill, Larkspur Outdoor Co., every person, vendor, bank, account number and amount below is invented
> for this eval.

## Context

Fernhill is a web accounting app for small and mid-sized companies. It has added an assistant that can carry out
multi-step finance tasks with the app's own tools: read bills, pull bank transactions, match them, and prepare
payments. Reading is automatic; **anything that moves money waits for a person to approve it**.

The team needs the screen where a user watches and controls one agent run, shown at four moments of the same run.

## Audience

- Dana Whitlock, Controller at Larkspur Outdoor Co. (a 60-person outdoor-gear retailer). She is accountable for every
  payment and for the month-end close. She is fluent in accounting, not in AI.
- She will use the assistant only if she can see what it is doing, stop it, check its numbers, and approve payments
  with full information. Her auditors will ask what the assistant did and who approved what.

## Content (use this; do not invent more data)

**App frame**: Fernhill. Company: Larkspur Outdoor Co. User: Dana Whitlock, Controller. Main navigation: Home, Bills,
Invoices, Banking, Payments, Reports, Close, Assistant (current). Decide whether the run is a full page, a split view or
a panel, as long as the app around it stays visible.

**Request** (sent by Dana, Mon 28 Sep 2026, 09:58): "Reconcile August vendor invoices against the bank feed, flag
anything that doesn't match, and prepare payments for everything due by Sep 30."

**Plan proposed by the assistant**
1. Collect August vendor invoices from Bills — read only
2. Pull bank transactions from 1 Aug to 27 Sep for Operating ••4417 and Card ••0385 — read only
3. Match invoices to transactions and flag mismatches — read only
4. Draft a payment batch for unpaid invoices due by 30 Sep — **needs your approval before anything is sent**
5. Write a reconciliation summary and attach it to the August close checklist

**Moment 1: in progress** (10:00:41, 41 s into the run)
- Step 1 done: found 52 invoices; skipped 3 duplicates (same vendor, amount and invoice number); 49 to reconcile.
  Tool: `bills.list`, 1.2 s.
- Step 2 done: pulled 318 transactions from Operating ••4417 and Card ••0385. Tool: `bank_feed.fetch` ×2, 4.8 s.
- Step 3 running: 39 of 49 checked. Findings so far: 37 matched exactly; Calder Freight Co. INV-2291: invoice
  $4,280.00, bank debit $4,028.00 on 12 Aug (possibly transposed digits); Pellucid Cloud INV-88120: charged twice,
  $612.00 on 3 Aug and again on 4 Aug. The assistant is currently writing: "Checking Oakridge Office Supply INV-1057
  ($2,315.40) against card transactions…"
- Steps 4 and 5 not started. Dana can stop the run.

**Moment 2: waiting for approval** (10:03:12)
- Steps 1–3 done: 49 invoices, 45 matched, 4 flagged (listed under Moment 4).
- Step 4 is paused on the tool call `payments.create_batch`, which needs Dana's approval:
  - From: Operating ••4417 (available balance $212,480.19)
  - Pay date: Tue 29 Sep 2026 by ACH (arrives 30 Sep)
  - 7 payments, total $18,940.55:

| Vendor | Invoice | Due | Amount |
|---|---|---|---|
| Brightline Janitorial | INV-7731 | 30 Sep | $2,150.00 |
| Calder Freight Co. | INV-2304 | 30 Sep | $3,862.10 |
| Harrow & Pike LLP | INV-0918 | 29 Sep | $6,400.00 |
| Northgate Electric | INV-55210 | 30 Sep | $1,187.45 |
| Oakridge Office Supply | INV-1057 | 30 Sep | $2,315.40 |
| Quillon Software | INV-2026-09 | 30 Sep | $1,450.00 |
| Tern Water Co. | INV-33871 | 29 Sep | $1,575.60 |

  - Warning on Oakridge Office Supply: its bank details were changed 2 days ago (26 Sep); this would be the first
    payment to the new account ••7710.
  - The 4 flagged invoices are excluded from the batch.
  - Payments can be cancelled until 5:00 pm ET on 29 Sep; after that an ACH return takes 2–5 business days.
  - Company policy: batches over $10,000 need approval from someone with the Payments role (Dana has it).
  - Choices: Approve and schedule · Approve without Oakridge (6 payments, $16,625.15) · Edit batch · Reject (the
    assistant continues to step 5 without payments).

**Moment 3: error** (a separate run of the same request, which failed during step 2; now 10:00:47)
- `bank_feed.fetch` for Card ••0385 failed: the Meridian Coast Bank connection timed out after 30 s (10:00:31). The
  assistant retried once automatically; the retry failed at 10:00:47 (HTTP 504). Last successful sync of this account:
  27 Sep, 23:10.
- Operating ••4417 succeeded: 211 transactions.
- Choices: Retry now · Continue without card transactions (12 invoices paid by card would be marked "unverified") ·
  Stop the run.
- Steps 3–5 are waiting.

**Moment 4: result** (run started 10:00:00 and finished at 10:07:52: 7 min 52 s, including the time waiting for approval)
- Dana chose "Approve without Oakridge". Payment batch PB-0928 is scheduled for 29 Sep: 6 payments, $16,625.15.
- Held: Oakridge Office Supply INV-1057 ($2,315.40) until its new bank details are confirmed. Suggested action: call
  the vendor on the phone number already on file.
- Reconciliation: 49 invoices, 45 matched, 4 flagged:

| Flag | Vendor · invoice | Detail | Suggested action |
|---|---|---|---|
| Amount mismatch | Calder Freight Co. · INV-2291 | invoice $4,280.00, bank debit $4,028.00 (12 Aug) | ask for a corrected invoice or pay the $252.00 difference |
| Duplicate charge | Pellucid Cloud · INV-88120 | $612.00 charged on 3 Aug and 4 Aug | request a refund (draft email ready) |
| FX difference | Marisol Catering · INV-4410 | EUR 1,150.00 invoiced, USD 1,274.35 debited; $2.44 above the reference rate | within the 0.5% FX tolerance: mark as matched? |
| No payment found | Brightline Janitorial · INV-7702 | $2,150.00 due 31 Aug; no matching transaction | confirm whether it was paid another way; otherwise pay now (overdue) |

- Summary attached to the August close checklist, item 14 "Vendor reconciliation".
- Downloads: august-vendor-reconciliation.csv. Audit log: 23 tool calls, 1 approval (Dana Whitlock, 10:05:40).

## Deliverables

All files go in `out/` inside your working directory.

| File | What | Viewport |
|---|---|---|
| `out/run-progress.html` | Moment 1: in progress | 1440 × 900, full page |
| `out/run-approval.html` | Moment 2: waiting for approval | 1440 × 900, full page |
| `out/run-error.html` | Moment 3: error with retry | 1440 × 900, full page |
| `out/run-result.html` | Moment 4: result | 1440 × 900, full page |

**PNGs: render them yourself into `out/png/`** with the same names (`run-progress.png`, `run-approval.png`,
`run-error.png`, `run-result.png`), viewport 1440 × 900, devicePixelRatio 1, full page.

`out/NOTES.md` (optional): your assumptions, one line each.

Reviewers re-render the HTML files with the settings below, so the HTML is the source of truth. Review is based on the
rendered screens and this brief; other files are not reviewed. The renders are static: show streaming and progress as
they look at that moment.

### Render manifest (used by the reviewers' renderer; do not change)

```render-manifest
{"items": [
  {"html": "run-progress.html", "png": "run-progress.png", "width": 1440, "height": 900, "dpr": 1, "full_page": true},
  {"html": "run-approval.html", "png": "run-approval.png", "width": 1440, "height": 900, "dpr": 1, "full_page": true},
  {"html": "run-error.html", "png": "run-error.png", "width": 1440, "height": 900, "dpr": 1, "full_page": true},
  {"html": "run-result.html", "png": "run-result.png", "width": 1440, "height": 900, "dpr": 1, "full_page": true}
]}
```

## Constraints

- Desktop web app at 1440 wide; the Fernhill app frame is visible in every moment.
- Text contrast meets WCAG 2.2 AA. Step and payment states must not rely on colour alone.
- The page scrolls as a normal document; nothing needed for review may hide behind hover, clicks or inner scroll areas.
- Opens directly from disk (file://) with no build step or local server. Fonts and libraries may load from public
  CDNs. Renders are made with Chrome on macOS with network access.
- No invented data, vendors, amounts or features. You may shorten or reorder copy.
- Show the product screen only: no annotations, callouts or notes addressed to reviewers on the page (put those in
  `out/NOTES.md`).

## Working rules (the same for every run)

- You work alone; no one will answer questions during the run. Where you would ask, decide, and write the assumption
  in `out/NOTES.md`.
- Time limit: 60 minutes wall-clock. The run is stopped at 60 minutes and whatever is in `out/` then is reviewed.
- Node and Playwright are available (`import { chromium } from 'playwright'`, launch with `{ channel: 'chrome' }`).

## Done means

- The four HTML files and four PNGs exist with the names above.
- In each moment Dana can tell at a glance what the assistant has done, what it is doing or waiting for, and what she
  can do now.
- The approval shows exactly what will happen (account, date, payees, amounts, total), the Oakridge warning, and how to
  undo it.
- The error says what failed, what already succeeded, and what each choice will do.
- The result leads with the outcome and makes each flagged item actionable.
- The renders show no overlap, clipping, or misaligned numbers.

<!-- JUDGE NOTES BELOW: the orchestrator removes everything from this line down before giving the brief to a design agent. -->

## Judging notes (judges only)

A strong answer usually:

- Keeps the plan visible and makes step states distinct (pending, running, done, waiting for approval, failed) with text
  or shape as well as colour.
- Shows live progress in Moment 1 (what is happening now, partial findings) with an obvious way to stop.
- Makes tool calls inspectable (name, what it read or will change, duration) without letting them drown the story.
- In the approval: states the exact action (account, pay date, payee list, amounts, total), puts the Oakridge
  bank-change warning where it cannot be missed, states reversibility (cancellable until 5:00 pm ET on 29 Sep) and what
  Reject does, and offers the partial approval. Approve and Reject are both clear; nothing nudges approval (no pre-checked
  boxes, no hidden reject).
- In the error: says what failed and why in plain words, what already succeeded (Operating ••4417), what Retry and
  Continue each do (12 invoices marked unverified), without alarming red floods or blaming the user.
- In the result: outcome first (batch scheduled, amount, what was held), then the four flags with their suggested
  actions, then the audit trail; the assistant's own output is recognisable as the assistant's.
- Sets money well: tabular figures, aligned decimals, totals that visibly add up.

Common problems: a chat transcript with no structure where the plan and state are lost; a generic "Approve?" dialog
without the details; the approval as a modal that hides the context; approval and warning at equal weight with ten
other things; spinner-only progress; an error that only says "Something went wrong"; numbers that do not match the
brief; the app frame missing; decorative AI sparkle styling that competes with the task.

Do not reward or penalise: chat versus page layout as such; dark versus light theme; extra moments.

Use the measured facts provided by the orchestrator for contrast and targets; do not re-estimate contrast by eye.
