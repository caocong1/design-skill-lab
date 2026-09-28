# Notes and assumptions

- Mode: redesign, run as a compressed single-direction pass because of the 60-minute limit. I didn't make an options board, and I looked at the legacy screen early (the brief ships it). The function map lives in these notes.
- "Now" is 8:04 AM. Waiting times: Brennan 12 min (7:52), Chen 6 min (7:58), Natarajan 3 min (8:01). Room times: Wright 9 min (Rm 7 since 7:55), Johansson 7 min (Rm 4 since 7:57).
- No one is late at 8:04. All three 8:00 patients are here, so the queue has no "late" row. A late state would appear there once a start time passes without an arrival.
- Legacy datebar says "3 arrived"; I label them "3 waiting" because the two roomed patients are counted separately ("2 in room").
- Feld 10:15 double booking: legacy puts both in one Sick cell with a single [C]. I show both as confirmed; Reyes is typed Sick (fever) and Adams F/U (from the reason text).
- "Due next" window = appointments starting within the next 30 minutes (8:15 and 8:30) that have not arrived.
- Unconfirmed today (8, within 8:00–1:30): Castillo, Liu, Bennett, Foster, Soto, Stein, Dubois, Ibarra. "3 tomorrow" comes from the legacy alert banner.
- Brennan is already marked arrived at 7:52, so his Check In step shows as done. Collect Copay is his next action because legacy shows the copay as not collected. Insurance counts as verified (09/25/2026).
- I didn't add new features. The Verify and Remind buttons use the legacy Eligibility and Reminder functions, and Collect Copay uses the legacy Copay function.
- Type colours are kept as a 4 px stripe plus a text code, because staff learned them. Status now takes the cell fill instead.
- "UNCONF." reuses the legacy status legend's own abbreviation.
- Cell reasons truncate with an ellipsis by design. The full text shows in a tooltip (title) and in the detail panel when the cell is selected.
- Font: IBM Plex Sans (SIL OFL) from Google Fonts. Icons are inline SVG drawn for this file.
- Lint floor (contrast, overflow, accessible names) passes at 1280×800. The warnings left are ellipsis truncation in cells, which is intended.
- Rendered with Playwright + Chrome (`out/shot.mjs`) at 1280×800, DPR 1, viewport only.
- A fresh critic found no P0s. Fixed after it: Cancel and No Show are back as visible panel buttons, whole open slots are click targets, the double booking has a Review action, and the phone numbers sit on separate lines.
- Left open after it: the grid shows 8:00 to about 11:00 without scrolling (rows are 42 px so names stay 13.5 px). Later open slots need a scroll, or Find Slot. The waitlist is a wrapped paragraph rather than one line per entry.
- Type counts from the old legend (New Patient 30 …) are assumed to live in the Key popover. The popover itself isn't drawn.
