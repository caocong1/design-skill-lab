# Assumptions

- Layout: full-page run view inside the Fernhill frame (left nav with Assistant current, top bar with user); a right rail holds run details, permissions and policy.
- Every step shows its permission level (Read only / Moves money · needs approval / Adds to close checklist) plus a status tag with an icon and text, so state never relies on colour alone.
- Tool names (`bills.list`, `bank_feed.fetch`, `payments.create_batch`) appear as small secondary labels for audit; plain-language outcomes lead.
- Moment 1: the progress bar is 39/49 (shown as 80%); the "currently writing" text is shown mid-stream with a static caret.
- Moment 1: "Stop run" says stopping ends the run after the current check. This is a behaviour assumption, not something the brief states.
- Moment 2: the approval card sits above the plan so it is the first thing Dana sees; steps 1–3 are summarised below it.
- Moment 2: "Approve without Oakridge" is styled as the primary choice because of the bank-detail-change warning (a common fraud pattern). All four choices are shown with what each one does.
- Moment 2: suggesting she confirm by phone uses the same "phone number already on file" advice the brief gives in Moment 4.
- Moment 2: "Not in this batch" lists the 4 flagged invoices from Moment 4; the brief says they are excluded from the batch.
- Moment 3: this separate run shows step 1 as done with the same counts (52 found, 49 to reconcile). The brief does not give step 1 figures for this run, but it is the same request on the same data.
- Moment 3: the run's start time is not given, so no elapsed time is shown; the header shows "Paused at 10:00:47".
- Moment 3: "Retry now" describes continuing to step 3 if the retry works; "Stop the run" describes that nothing was changed (steps so far were read-only).
- Moment 4: the cancel deadline (5:00 pm ET, 29 Sep) is carried over from the approval moment.
- Moment 4: the flagged-item buttons turn each suggested action in the brief into a button. "Pay now" and "Pay $252.00 difference" would go through the same approval flow.
- Moment 4: "Mark details confirmed" on the Oakridge hold is the action that follows the suggested phone check.
- No run ID, extra timestamps or tool-call counts beyond those in the brief are shown.
