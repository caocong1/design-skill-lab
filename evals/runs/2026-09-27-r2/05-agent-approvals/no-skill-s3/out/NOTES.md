# Notes and assumptions

- Layout: a full page inside the Fernhill frame (dark left nav with Assistant marked current, top bar with company and user). This gives the run the most room while the rest of the app stays visible.
- The same structure is used in every moment: Dana's request, a status bar (state, time, main control), the 5-step plan with a state on each step, and a right rail with details. Only the current step is expanded.
- States never rely on colour alone. Each step has an icon (check, spinner, pause, !, dashed circle, clock) and a text label (Done, Running, Waiting for your approval, Failed · needs your decision, Not started, Waiting).
- Moment 3 is a separate run. Its start time and step-1 counts aren't given, so I show step 1 as done without numbers and the header only shows "Last update 10:00:47".
- "Stop run" consequence text only states facts from the plan (steps 4–5 won't run, nothing has been sent). It doesn't describe how the stop is carried out.
- Approval: "Approve without Oakridge" is the filled primary button and "Approve and schedule" is outlined. The bank-detail change is a fraud risk, so the safer choice gets the most weight. All four choices from the brief are shown, each with what it will do.
- The fraud line ("changed bank details are a common route for payment fraud") is general guidance, not new data. The confirmation advice reuses the brief's "phone number already on file".
- "Pay date Tue 29 Sep, arrives Wed 30 Sep": the weekday comes from 28 Sep 2026 being a Monday. "Due 29–30 Sep" comes from the batch table.
- The flag type labels in Moment 1 ("Amount mismatch", "Duplicate charge") reuse the labels from the Moment 4 table.
- Result action buttons are the brief's suggested actions turned into buttons: Request corrected invoice / Pay $252.00 difference; Review refund email; Mark as matched / Keep flagged; Paid another way / Pay now; and for Oakridge, Show number on file.
- The result lists the 6 scheduled payments (the approval table minus Oakridge) and repeats the cancel window, since Dana can still undo until 5:00 pm ET on 29 Sep.
- Streaming is shown statically as a "Now" line with a text caret. Step 3 progress is a bar at 39/49.
- Source: src/build.mjs and src/styles.css generate the HTML, with CSS inlined so each file opens alone. src/render.mjs makes the PNGs. Fonts are Inter and JetBrains Mono from Google Fonts, with a system font fallback.
