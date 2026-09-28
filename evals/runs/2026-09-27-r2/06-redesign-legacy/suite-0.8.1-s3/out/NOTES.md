# Notes and assumptions

- Mode: redesign of one screen, run at standard effort because of the 60-minute limit. I drew one direction, not an options board with subagents, and there is no separate .design/ truth-file tree. The function map is the task table in the brief.
- Wait times are computed at 8:04 AM: Brennan 12 min (7:52), Chen 6 min (7:58), Natarajan 3 min (8:01). Time in room: Wright since 7:55, Johansson since 7:57.
- "8 unconfirmed today" counts the [U] appointments between 8:00 and 1:45 in legacy/index.html (Castillo, Liu, Bennett, Foster, Soto, Stein, Dubois, Ibarra). The file has no afternoon data after 1:45. "3 unconfirmed tomorrow" comes from the legacy alert.
- "Due next" lists the not-yet-arrived patients at 8:15 and 8:30 (Abernathy, Okafor, Fairbanks L., Olsen).
- 96 appts, 14 open and 0 no-show are the day totals from the legacy date bar. The grid shows 7 open slots between 8:00 and 1:45.
- The legacy double-booked cell has one [C] status and one type (Sick). I kept Sick as the stripe and show both names with their ages, plus "F/U" for Adams.
- Brennan: Check In is shown as done (arrived 7:52), so it has no button. For patients who have not arrived, Check In is the green button in Due next, and it is the first step in the panel.
- Open slots show "+ Open" as a booking target. Clicking one is assumed to start New appt, with the time and provider already filled in.
- The Walk-In, Find Slot, Block Time and Refresh buttons keep their legacy names. "Print / Export" is a menu holding Print Day, Print Labels and Export.
- Font: Atkinson Hyperlegible Next (Google Fonts, SIL OFL 1.1). I chose it because it keeps 0/O and 1/l/I distinct for names, MRNs and phone numbers read at a glance or on the wall screen. Its zero is slashed on purpose.
- Icons: hand-drawn inline SVG strokes, no library licence.
- lint.mjs floor: one remaining contrast finding on "Brennan, Harold" (measured 1.35 against the navy selection border). The computed ratio is 13.98:1, and a zoomed crop shows dark text on light green. I recorded it as a sampler artefact.
- lint.mjs warnings accepted: the hour labels wrap on purpose to "8:00 / AM", and reasons end in an ellipsis when too long. Every reason is shown in full in the detail panel.
- Afternoon rows (1:00 PM onwards) are below the grid's own scroll. This is allowed by the brief, and at 8:04 the morning is what matters.
- Not tried: week/month views, the other states (empty day, no selection, a late patient), the wall-screen layout, and the migration plan (phased opt-in preview for the three front-desk staff).
- Fresh critique (subagent, one round): no P0/P1 and no data errors. I fixed the P2 items: double-booking detail, phone wrapping, the cancelled 'X' that looked like a button, recent-visit wrapping, the copay row, and the missing status legend. Not fixed: merging the header and toolbar rows. I kept them separate because the tab row and its labels are equity for the temps.
