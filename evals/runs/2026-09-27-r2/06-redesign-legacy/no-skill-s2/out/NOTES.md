# Assumptions (one per line)

- "Arrived" (Brennan 7:52) means he is at the desk or in the waiting room but check-in isn't finished, because the copay isn't collected. So Check In stays the primary action and the copay is shown as the outstanding step.
- Wait times are counted from the recorded arrival or rooming time up to 8:04 AM: Brennan 12, Chen 6, Natarajan 3, Wright 9 (Rm 7), Johansson 7 (Rm 4).
- "Late" = 0, because at 8:04 every 8:00 patient is already here or in a room. "No-show" = 0 and "14 open" come from the current screen's header, which covers the whole day.
- "8 unconfirmed today" counts the [U] appointments in the 8:00 AM – 1:30 PM data given; the afternoon isn't in the fixture.
- Insurance-unverified flags go only on Grace Liu and Elena Soto, as the brief says.
- The 10:15 Feld cell (Reyes / Adams) is treated as two appointments in one slot; both are shown as confirmed Sick/F-U, as the legacy cell shows.
- Appointment-type colours were dropped in favour of status colours. The type is written on multi-slot cards, in the tooltip and in the details panel.
- The per-type default durations from the legacy legend (e.g. Physical 45) aren't shown on the grid; the cards show their booked length instead.
- The lunch hour is collapsed to one row because nothing can be booked in it.
- The left rail's waiting-room list uses the arrival records from the brief. Clicking a name is assumed to select the appointment, like clicking a grid card.
- The "Remind", "Verify" and "View" to-do buttons open the existing reminder and eligibility functions (the same ones as the Reminder and Eligibility buttons and the Insurance / Eligibility tab). No new back-end features are assumed.
- The keyboard hint "/" on the search field is only a focus shortcut for the front end.
- A system font stack is used (no CDN), so the file renders the same offline from file://.
