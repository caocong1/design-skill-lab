<!-- Template: copy the structure, not the values. Save as .design/function-map.md.
     Build it from routes, API, data model, permissions, docs and the user's words, BEFORE looking at
     the current screens. Objects, relationships, actions (CTAs) and attributes: OOUX / ORCA.
     Tables, not prose. Baseline and Migration are redesign-only. Delete these comments. -->

# Function map: <product>

Sources read: <routes file, API schema, data models, permissions, docs, interviews>

## Objects

| Object | What it is to the user | Volume per user | Lifecycle |
| --- | --- | --- | --- |
| <Object> | <one line in the user's words> | <tens / thousands> | <draft > active > archived> |

## Relationships

| From | To | Cardinality | Where the user crosses it |
| --- | --- | --- | --- |
| <Object A> | <Object B> | <1 : n> | <from A's detail to open B> |

## Actions

| Object | Action | Who | Frequency | Starts from | Must stay visible while acting |
| --- | --- | --- | --- | --- | --- |
| <Object> | <verb> | <role> | <30 / day> | <list, detail, notification> | <...> |

## Attributes

| Object | Scanned in lists | Filtered or sorted by | Only in detail |
| --- | --- | --- | --- |
| <Object> | <name, status, owner> | <status, date> | <history> |

## Top jobs as flows

| Job | Steps today | Decisions | Waits | Context switches |
| --- | --- | --- | --- | --- |
| <job> | <n> | <where the user decides> | <where the user waits> | <n> |

## First-principles answers

Per top job, as if no screen existed yet:

| Job | Entry point | Container | Presentation | Flow shape |
| --- | --- | --- | --- | --- |
| <job> | <inbox / search / dashboard / workspace> | <page / list + detail / drawer / modal / inline> | <table / list / cards / board / timeline / map> | <wizard / form / inline edit / batch / chat> |

## Equity

Fill this only after the directions are sketched.

| Users rely on | Evidence | Cost if it moves |
| --- | --- | --- |
| <learned location, shortcut, label> | <usage data, support tickets, the user's words> | <low / medium / high, and why> |

## Baseline

Redesign only: the detail fixes every direction inherits, from critique-design mode `redesign-brief`
on the current screens (references/process/redesign.md section 5). Fill it after the directions'
coordinates are fixed; every direction packet and the board header carry it.

| Fix | Where | Evidence shot |
| --- | --- | --- |
| <muted text 3.1:1 on the list background; use the text-muted role> | <queue list, every row> | <critique/<date>-current/03-contrast.png> |

## Migration

Written after converge for the chosen direction (references/process/redesign.md section 8).

| Change | Who (role, frequency) | Old > new | Mitigation | Phase | Signal to proceed |
| --- | --- | --- | --- | --- | --- |
| <what moves> | <role, n a day> | <old > new> | <redirect, "what moved" tip> | <1> | <task measure after one work cycle> |
