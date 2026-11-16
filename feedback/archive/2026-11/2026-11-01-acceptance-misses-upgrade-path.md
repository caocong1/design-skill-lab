---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

Two acceptance rounds passed on build shots that all came from the app's demo scenario. The demo
scenario marks one-time notes as seen and fills every date (last opened, last inspection). The owner
then opened the release on their own data: one project, one ungrouped device, dark appearance, the
one-time "what moved" note not yet dismissed. The note's text used `.fixedSize(horizontal: false,
vertical: true)`; measured at zero width for the window's minimum size, it became one character per
line (about 1350 pt) and pushed the whole window content out of its frame. Sidebar rows sat under the
traffic lights and the table header and rows were out of view. The same run showed three
data-dependent faults the demo could not show:
- the open project missing from the sidebar (no open date on upgraded data);
- the project name repeated where the customer was empty;
- a day-old project flagged as overdue.

## Expected / suggestion

In the acceptance shot list, require one pair from the owner's real data and preferences (or an
upgrade fixture: previous version's data, first launch of the new build, one-time notes unseen). Name
"first launch after upgrade" and "sparse data (1 project, 1 device, empty optional fields)" as
mandatory states next to the stress content. In `references/stacks.md` (SwiftUI): never use
`fixedSize(vertical)` on wrapping text outside a scroll view without a minimum width.
