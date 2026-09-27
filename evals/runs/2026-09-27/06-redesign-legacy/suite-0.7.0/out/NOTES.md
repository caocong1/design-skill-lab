# Notes and assumptions (one per line)

- Mode: redesign; a single direction was delivered (time-boxed run), not an options board; the function map is summarised below instead of a separate `.design/` tree.
- Function map (objects → top actions): Appointment (check in 42%, book 23%, confirm/remind 11%, reschedule/cancel 9%); Patient (balance/insurance 8%); Day/Clinician (open slots, waitlist, double bookings); Admin (7%).
- "Now" is 8:04 AM; wait times are computed from the brief's arrival times (Brennan 12 min, Chen 6, Natarajan 3; Wright in Rm 7 for 9, Johansson in Rm 4 for 7).
- "Late" = booked, start time passed, not arrived; at 8:04 nobody qualifies, so "0 late" is shown and the Late chip appears only in the key.
- Johansson is in Room 4 and Wright in Room 7, taken from the brief ("In a room" records); legacy [R] status agrees.
- Unconfirmed count "8 today" counts the [U] appointments in the 8:00–1:30 data (Castillo, Liu, Bennett, Foster, Soto, Stein, Dubois, Ibarra); the afternoon is not in the data.
- Header totals (96 booked, 14 open, 0 no-show) are copied from the legacy date bar, not recomputed.
- Brennan's next check-in step is copay (arrived, insurance verified, copay not collected), so "Collect copay $25.00" is the primary button; "Check in" is the primary for not-yet-arrived patients.
- Gomez's cancelled 9:45 slot stays visible as a cancelled card (legacy behaviour), not converted into an "Open" slot.
- Lunch (12:00–1:00) is compressed to a single band to keep the morning on screen; the grid scrolls for 1:00–1:30.
- The Check-In tab stays in the tab bar because it may hold features beyond this screen; check-in itself can now be done on Schedule.
- "Ins. unverified" flags only Liu and Soto, per the brief; the legacy alert bar's "Click here to view" becomes the Verify button.
- Clinician headers read "Rao, MD" etc. for width; full names appear in the detail panel ("Rao, Anita MD").
- Font: Source Sans 3 (SIL OFL 1.1) from Google Fonts; icons are hand-drawn inline SVG strokes, no third-party icon set.
- Contrast computed with color_tools.py: smallest text pair #56606b on #e3ebfa = 5.34:1; white on status fills ≥ 5.35:1; amber #b86e00 is used only for borders/icons (3.99:1, ≥ 3:1 non-text).
- The render script used is `render.mjs` in the working directory (Playwright, Chrome channel, 1280×800, dpr 1).
- Fresh-eye critique (subagent) ran; fixed: clipped Ins. chips, Olsen missing from Expected next, vague 'More' labels, keyboard-reachable cards, removed invented Undo/Re-check/shortcut. Kept knowingly: 10:15 row is taller to show the double booking; Late appears only in the key (nobody is late at 8:04); the type legend is replaced by text tags on cards.
