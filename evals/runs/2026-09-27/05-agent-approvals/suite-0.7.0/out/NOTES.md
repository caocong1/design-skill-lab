# Notes: Fernhill agent run screens

## Assumptions and decisions (one per line)

- Container: a full page inside the app frame (dark Fernhill sidebar, breadcrumb top bar). "Assistant" is the current nav item. A side panel would be too narrow for a 7-row payment table and the 4-way decision.
- Layout: the main column holds the run (status bar, then the focal block, then the plan). A 328 px right rail holds run details, what the assistant may do, and the activity log for auditors.
- The h1 is a short title taken from Dana's request. Her full request is quoted verbatim with sender and time on every screen.
- The run header shows state as colour plus icon plus words: Running (blue, spinner), Waiting for your approval (amber, pause), Paused on error (red, x), Complete (green, check). Step badges and markers use the same set, so no state relies on colour alone.
- Every plan step is tagged "Read only" or "Needs your approval". That makes the rule "anything that moves money waits for a person" visible on the plan itself.
- Moment 1: the streaming line is drawn as it looks at 10:00:41, with a steady caret. Only the spinner animates, and only when reduced motion is off. The progress bar is 39/49 (79.6%).
- Moment 1: "Stopping keeps what has been read. Nothing is paid." This is true to the brief (nothing moves money before step 4). I made up this wording; it adds no new behaviour.
- Moment 2: the approval card is placed first in the main column, above the plan, so it is the focal region. The plan keeps step 4 as "Waiting for you, review above".
- Moment 2: "Approve without Oakridge" is the filled, recommended choice and "Approve and schedule all 7" is secondary. A first payment to bank details changed 2 days earlier is a common vendor-fraud pattern. All four brief choices are present, and each states what it will do.
- Moment 2: the 4 flagged invoices, listed in the brief under Moment 4, are also shown under step 3. This lets Dana see what is excluded from the batch before she approves.
- Moment 2: the undo line reads "You can cancel until 5:00 pm ET on Tue 29 Sep; after that an ACH return takes 2–5 business days". The 29 Sep date is the brief's.
- Moment 2 and Moment 4: "Your approval is recorded in the run's audit log with your name and the time" is inferred from the brief's audit log (1 approval, Dana Whitlock, 10:05:40).
- Moment 3 is a separate run. The brief gives no step 1 numbers for it, so I assumed the same Bills data ("49 invoices to reconcile") and showed no duration for bills.list.
- Moment 3: the run start time is not given, so the rail shows "Paused at 10:00:47" instead of a start time or elapsed time.
- Moment 3: "Retry now" is the recommended (filled) choice. The failure is a transient bank timeout (HTTP 504), and the last good sync was the night before.
- Moment 3: "Stop the run" says "Steps 3–5 will not run and no payment batch is drafted". This follows from the brief's statement that steps 3–5 are waiting.
- Moment 4: the page leads with the outcome: batch PB-0928 scheduled, the 49/45/4 counts, and 1 held payment. "Needs your attention · 5" (held Oakridge plus 4 flags) comes next, then the step history.
- Moment 4: each flagged item has buttons that turn its suggested action into verbs:
  - Oakridge: "Show number on file" and "Mark details confirmed". The confirmation button is an inferred affordance for "held until confirmed". It does not release money.
  - Calder: "Ask for corrected invoice" and "Pay $252.00 difference".
  - Pellucid: "Review refund email".
  - Marisol: "Mark as matched" and "Keep flagged".
  - Brightline: "Mark as paid another way" and "Pay $2,150.00 now".
- Moment 4: "You can cancel PB-0928 until 5:00 pm ET on Tue 29 Sep" repeats the undo window from the approval.
- Moment 4: the "Approved by you" tag on step 4 replaces "Needs your approval" once approval has happened.
- No phone number, email text, timestamps for individual tool calls, or other data were invented. The activity log shows only times the brief gives.
- The top bar shows only the breadcrumb and the date. There is no global search, notifications or help, because the brief does not list those features.
- Type: IBM Plex Sans for UI and IBM Plex Mono only for tool names (they are code). Both come from Google Fonts under the SIL OFL. Tabular figures are used for all amounts and times.
- Colour: spruce-green brand (#1d5c4d) for primary actions and the nav. Separate status hues for ok, running, warning and critical. All text pairs were checked with color_tools.py; the lowest is 4.75:1 (green badge text on its tint).
- Icons are hand-drawn inline SVG in one stroke style. The assistant mark is a small frond (a nod to "Fernhill"), not a sparkle.
- Source: build/build.mjs generates the four HTML files with inlined CSS, and build/render.mjs renders the PNGs (Chrome, 1440×900, dpr 1, full page).

## Not verified

- Screens were checked only at 1440 wide, in light theme, as the brief asks. Narrow widths, dark mode and 200% zoom were not designed.
- Keyboard focus styles exist (:focus-visible) but were not captured in the renders.
