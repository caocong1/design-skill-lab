# Notes: Fernhill agent run, four moments

Mode: design-studio `piece`, standard effort. Discipline: ai-experience (agent control chain, approvals). Light theme only, 1440 × 900.

## Design read
- A calm, dense accounting console for a Controller, not a chat UI. The run page is a full page inside the Fernhill frame (dark fern sidebar with all 8 nav items, Assistant current; company and user visible).
- The main idea is an **approval gate**: a dashed line across the plan between the read-only steps (1–3) and step 4, labelled "nothing below this line moves money until you approve". It appears in every moment, so Dana always sees where the money boundary is.
- Every step state has a glyph and a text label (Done / Running / Waiting for you / Failed / Waiting / Not started), so state never depends on colour alone. Flags use a warning icon and a type name.
- When the run needs Dana (approval, error), the decision block comes first and the plan follows below it. The approval block runs the full width so the terms, the payees and all four choices fit in the first 900 px.

## Assumptions (one per line)
- Full page, not a panel: the batch table plus the plan need the width; the app frame (sidebar, top bar) stays visible.
- Run title "Reconcile August vendor invoices and prepare payments due by 30 Sep" and the breadcrumb "August vendor reconciliation" are paraphrased from Dana's request.
- "Approve without Oakridge" is the filled primary button, because changed bank details plus a first payment is the classic payment-fraud pattern. "Approve and schedule all 7" stays one click away with equal size.
- Edit batch copy ("Remove payments or change the pay date") describes a normal batch editor; the brief only names the choice.
- Reject copy follows the brief: no payments are created and the assistant continues to step 5.
- The raw tool call `payments.create_batch` sits in a closed disclosure "for the audit log"; nothing needed to decide is hidden behind it.
- Moment 3 is a separate run. Step 1 is shown as "Invoices collected" with no count or duration, because the brief gives neither for that run. The request time is shown as the same 09:58 request; the start time in the side panel is "10:00" with no seconds.
- The error's 30 s timeout and the retry's HTTP 504 appear together on the card row. "Failed twice" summarises the first attempt plus the one automatic retry.
- Error choices: Retry now is recommended (the connection has worked before; last sync 27 Sep 23:10). "Stop the run" copy says nothing is matched and no payments are drafted.
- Result actions per flag come from the brief's suggested actions (request corrected invoice / pay $252.00 difference; review refund email; mark as matched / keep flagged; mark as paid another way / pay now). For Oakridge the actions are "Show phone number on file" and "Pay after confirming".
- "Cancel batch" on PB-0928 is the undo for the scheduled payments, valid until 5:00 pm ET on 29 Sep, as stated in the brief.
- The CSV download is offered once, in the result header; its contents are not described.
- On the approval screen, "Stop the whole run" is a quiet text link so it can't be mistaken for Reject (which continues to step 5).
- AI disclosure: an "AI" label next to "Fernhill Assistant" in every run header, plus a persistent line in the side column. Markets are not specified; this satisfies the EU first-exposure and persistent-label defaults.
- Stop is always visible while the run is active (progress, approval) and states what it keeps; in the error moment "Stop the run" is one of the three choices.
- No sparkle icons or violet: the assistant is identified by name and the AI label only.

## What this design does not try to do
- No dark theme, no narrow or mobile layout, no run inbox or history list, no composer or follow-up chat.
- No motion spec; the running glyph and text caret are drawn static, as the moment looks.

## Critique
- A fresh critic subagent reviewed the four renders: no P0 issues. I fixed its P1 (stale approval pill on step 4 of the result) and its P2/P3 items (an empty disclosure, the "5 items" count, a duplicate download, an inferred step-1 count, the Stop wording, a visible reason on the recommended approval).
- Not verified: narrow widths, focus rings and keyboard order. The brief asks for 1440 only.

## Floor
- lint.mjs at 1440 × 900 on all four files: contrast fixed (the sidebar avatar initials were 2.0:1 and are now dark on light). Remaining warnings are token-drift and vocabulary only.
- Non-text contrast computed: dashed not-started ring #8C918B on white is 3.21:1; white on the amber waiting glyph #B26B00 is 4.20:1; white on green, red and fern is at least 6.4:1.

## Licences
- IBM Plex Sans and IBM Plex Mono: SIL Open Font License 1.1, loaded from Google Fonts.
- Icons: simple strokes hand-drawn for this mockup, no third-party set.
- Source: `src/build.mjs` generates the four HTML files (CSS inlined). `src/render.mjs` renders the PNGs.
