# Notes: Fernhill agent run (4 moments)

## Assumptions (one per line)
- Layout: the run is a full page inside the app frame (sidebar nav + top bar stay visible), with a narrow run-details rail on the right. A side panel would squeeze the approval table.
- Order on the page: the decision block (approval / error) or the outcome (result) comes first. The plan ledger always sits below it, so the steps are in the same place in every moment.
- The run title "Reconcile August vendor invoices and prepare payments due by 30 Sep" is a shortened version of Dana's request. The full request is quoted just below it.
- Moment 3 is a separate run of the same request. Step 1 shows the same Bills result (52 found, 3 duplicates, 49 to reconcile), since it reads the same data. Its duration isn't shown because the brief doesn't give one.
- Moment 1: "35 s so far" for step 3 is 41 s minus steps 1–2 (1.2 s + 4.8 s). Moment 4: "2 min 28 s waiting" is 10:03:12 to 10:05:40.
- Moment 4: "5 items need your follow-up" = 4 flagged invoices + the held Oakridge payment.
- Moment 4: the cancel window (until 5:00 pm ET, 29 Sep) is carried over from the approval screen for PB-0928.
- Button labels on flagged items (e.g. "Request corrected invoice", "Pay $252.00 difference", "Review refund email", "Mark as matched") come straight from the suggested actions in the brief. "Open vendor contact" and "View batch PB-0928" assume the app already has vendor and batch pages.
- In the approval, "Approve and schedule" is the filled primary button because it is the brief's first choice. The Oakridge warning sits on that payment's row, right above both approve buttons, so it gets read before either click.
- "What the assistant may do" restates the brief's rule: reading is automatic, and moving money needs a Payments-role approval. No other permissions were invented.
- The raw tool call (payments.create_batch) sits behind a "View exact payload" link for auditors. Nothing needed to decide is hidden.
- AI disclosure: an "AI" label plus the name "Fernhill Assistant" on every run header. There's no permanent caveat footer.

## Design choices
- One idea: the run reads like a ledger. A left column gives each step's state as icon + word (Done / Running / Needs you / Failed / Not started / Waiting) plus its duration. The money-moving step sits under a double rule (the accounting total mark), and so does the batch total.
- States never rely on colour alone: every state has an icon and a word, and flagged rows have a warning icon and text.
- Type: IBM Plex Sans / Plex Mono (SIL OFL 1.1, Google Fonts), tabular numerals, amounts right-aligned.
- Contrast was computed with color_tools.py: every text/background pair is 5.5:1 or higher. lint.mjs at 1440×900 passes contrast, overflow and control labels on all four files.

## Not done / limits
- No fresh-context critique subagent was run (time budget). Self-check only, against the brief's "Done means" list.
- The approval's action buttons sit about 90 px below the 900 px fold on first load; the decision summary (account, date, total, payees) is above the fold.
- Static renders only: the spinner and streaming caret animate in the browser and stop under reduced motion.

Sources: build/build.mjs generates the HTML; build/render.mjs writes the PNGs.
