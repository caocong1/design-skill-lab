# Notes: Fernhill assistant run, four moments

Mode and effort: design-studio `piece`, standard effort (one screen in four states). Single designer context; one fresh critic subagent ran on the rendered PNGs.

## Design read
- Surface: an agent run (plan > act > report) shown as a full page inside the Fernhill app frame. The sidebar nav and the company and user stay visible, so the run feels like part of the books and not like a chat.
- Hierarchy on every moment: 1) run header with a status chip and a Done / Now (or Waiting, Failed) / Your part strip; 2) the plan, with the active step expanded in place (progress, approval card, error card); 3) a side column with the request, what the assistant may do, the scope and the audit log.
- The one idea: the plan reads like a ledger in which every step declares its reach: "Read only", "Moves money · needs your approval before anything is sent", "Writes a summary to the August close checklist". Totals use the accountant's single rule over a double rule.
- Status is never colour alone. Each state has a coloured chip, an icon (check, arrow, pause, ×, clock) and a word, and the step marker changes shape too (filled check, ring, pause, ×, hollow number).
- Type: system UI stack (SF on macOS) with tabular figures; monospace only for tool names such as `bills.list`. No web fonts, so it works from file:// offline.
- Colour: fern green for the brand and primary actions on a cool light grey ground. Status colours: green done, blue running, amber waiting, red failed, grey not started. Every text pair computed ≥ 4.5:1 (color_tools.py). `lint.mjs` floor passes (contrast, overflow, accessible names) at 1440×900 on all four files.
- AI identity: a plain "AI" badge next to "Fernhill Assistant" plus a one-line caveat in the side panel. No sparkles or violet.

## Assumptions (one line each)
- Layout: a full page within the app frame, not a panel. The approval table and the flag list need the width, and Dana watches one run at a time.
- Run start 10:00:00 comes from Moment 4; the request was sent at 09:58. I did not invent a separate plan-confirmation event.
- Moment 1's audit log lists the two `bank_feed.fetch` calls as one ×2 row with the combined 4.8 s, as the brief gives it.
- Moment 2 shows the 4 flagged invoices by name in step 3, using the list from Moment 4, so Dana can see which invoices the batch excludes.
- The approval card makes "Approve without Oakridge" the primary button because of the fresh bank-detail change. "Approve and schedule all 7" sits beside it with equal size, so either choice is one click.
- "Edit batch…" help text ("remove payments or change the pay date") is my reading of what editing a batch means; the brief names the choice only.
- The fraud-risk sentence on the Oakridge warning is product guidance based on the brief's suggested action (call the vendor on the number already on file). It is not new data.
- Moment 3 (a separate run) shows step 1 only as "Collected August vendor invoices", because the brief gives no step 1 figures or duration for that run.
- Moment 3 calls the run "Paused at step 2 · needs you", not "failed": it waits for Dana's choice and can resume.
- Moment 3's "Stop the run" says nothing is matched, drafted or written. The brief does not say whether the pulled data is kept, so I don't claim it is.
- Moment 4's "2 min 28 s waiting for your approval" is 10:03:12 (paused) to 10:05:40 (approved), both taken from the brief.
- Moment 4 lists the held Oakridge payment first under "Needs your decision" with the 4 flags. The action buttons (Show number on file, Pay after confirming…, Ask for corrected invoice, Pay $252.00 difference…, Review refund email, Mark as matched / Keep flagged, It was paid another way… / Pay now…) map one to one to the brief's suggested actions. An ellipsis marks the ones that open a further step.
- Moment 4 repeats the PB-0928 payee list with its total, built from the Moment 2 table minus Oakridge, so the auditor-facing record is complete on one page.
- "Cancel until 5:00 pm ET, 29 Sep" appears on the result too, because the brief's cancellation window applies to PB-0928.
- Times use the brief's formats (10:00:41, Mon 28 Sep 2026). The top bar shows the current time of each moment.
- The streaming line in Moment 1 is drawn as a static caret after the text; in the product it is a polite live region.

## What this design does not try to do
- Mobile and narrow layouts, dark mode, and the plan-editing interaction were not drawn. Neither were the run inbox and the approval timeout, rejection and undo states.
- The raw `payments.create_batch` payload is only referenced by name; its audit view is not drawn.

## Source
- Generator: `src/build.mjs` + `src/shared.mjs` + `src/extra.css` → `out/*.html` (inline CSS, self-contained). PNGs: `src/shoot.mjs` (Playwright + Chrome, 1440×900, DPR 1, full page).
- Icons: hand-drawn inline SVG, one 16 px stroke family, no licence needed.

## Verification
- Rendered with Playwright + Chrome at 1440×900, DPR 1, full page (`src/shoot.mjs`), and every PNG looked at. Heights: progress 1395, approval 1892, error 1467, result 1899 px.
- `lint.mjs` floor passes on all four at 1440×900 (contrast, overflow, accessible names). Remaining warnings are token drift in spacing (8–12 px steps). No failures.
- A fresh critic subagent reviewed round 1: disposition "fix", no P0/P1, data fidelity confirmed. Fixed: the Oakridge warning moved above the payee table; "Go to the decision ↓" links added in the Your part cell; the error choices lifted above the 900 px fold; reach tags carried into the collapsed steps and the result's step list; the Calder row now shows the $252.00 difference; Held uses the amber state.
- Deliberately left: in Moment 2 the approve buttons sit below the payee table (y ≈ 1430). Dana reads account, date, undo window and the Oakridge warning above the fold, then the payees, then decides. The link in "Your part" jumps straight there.
- Not verified: keyboard focus order and focus rings in a live session, and widths below 1440 (the brief declares only 1440).
