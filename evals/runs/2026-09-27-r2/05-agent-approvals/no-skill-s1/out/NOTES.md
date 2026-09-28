# Notes and assumptions

- Layout: full-page run view inside the Fernhill frame (left nav with Assistant current, top bar with company and user); main column for the plan or decision, right rail for run facts, permissions and audit info.
- Moment 2: the approval card is moved to the top of the main column (the full plan sits in the right rail) so the decision, account, date, total and Oakridge warning are visible above the fold.
- "Approve without Oakridge" gets the primary button style because the vendor's bank details changed 2 days ago (a common fraud pattern). "Approve all 7" is still a full, clearly labelled option. The brief doesn't state a recommendation, so this is my design call.
- Each approve button states its payment count and total; Reject and Edit batch are secondary. Reject's consequence (no payments, continue to step 5) is written next to it.
- Step 5 is tagged "Adds to close checklist" instead of "Read only", because it writes to the checklist but doesn't move money.
- Moment 3 (separate run): the brief gives no step-1 counts or start time for this run, so step 1 shows as done without numbers and the header shows only "Updated 10:00:47".
- Moment 3: "Stop the run" explains that steps 3–5 won't run. I made no claims about data retention beyond the brief.
- Moment 1: the tool-call list shows only the calls the brief names (bills.list, bank_feed.fetch ×2). The per-account split of the 4.8 s isn't given, so no per-call durations are shown for the fetches.
- Moment 2: "Waiting for your approval" shows the current time (10:03:12) but not when the pause began (not given).
- Moment 4: the action buttons map one-to-one to the suggested actions in the brief. For Oakridge, the phone number isn't given, so the button opens the vendor record ("call the number already on file").
- Moment 4: the scheduled-batch table lists the 6 approved payments from the Moment 2 batch minus Oakridge (total $16,625.15 checks out).
- Status never relies on colour alone: every step and payment state has an icon plus a text label (Done / Running / Waiting for your approval / Failed / Not started / Held / Scheduled).
- Fonts: Inter and JetBrains Mono from Google Fonts, with system fallbacks. There are no scripts; each HTML file is self-contained with inline CSS.
- Source generator (build.mjs) and renderer (render.mjs) are in the parent folder; out/*.html is the source of truth.
