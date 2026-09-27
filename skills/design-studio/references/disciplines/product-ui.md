---
title: Product UI (screens, flows, states)
evidence: practice
sources: [ooux-orca, vercel-web-interface-guidelines, wcag-22, laws-of-ux]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Product UI

Screens, components and flows that people use again and again to get something done: apps, admin
systems, desktop tools, embedded panes, on any target. The visitor mode is Operate: clarity, speed and
predictability beat expression. Personality lives in type, colour discipline, motion and words, not in
reinventing controls.

This file owns the model-to-screen step, archetypes, navigation structure, the state matrix, forms,
collection views, density, adaptive rules and product microcopy. Elsewhere:

- Tables, dashboards, charts, data walls: [data-dense-ui](data-dense-ui.md). AI features, agent runs, chat-host widgets: [ai-experience](ai-experience.md).
- The target's chrome, components and numbers: [platforms](../platforms/README.md), then [ios](../platforms/ios.md), [android](../platforms/android.md), [harmonyos](../platforms/harmonyos.md), [mini-programs](../platforms/mini-programs.md), [desktop](../platforms/desktop.md), [web](../platforms/web.md) or [embedded-hosts](../platforms/embedded-hosts.md).
- Frames, units, the portable subset: [portable-mockups](../fundamentals/portable-mockups.md). Contrast, target and focus thresholds: [accessibility](../fundamentals/accessibility.md).

## Procedure for a screen or flow

1. Name the targets and their logical sizes (PRODUCT.md). The build stack does not change the drawing.
2. Build the model before pixels (next section).
3. Pick the archetype per screen; start from the target's standard structure for it.
4. Choose the navigation structure.
5. Set hierarchy: one focal region, one primary action. Demote with size, weight and colour before adding borders or boxes.
6. Compose from the system: host tokens and components. A missing piece goes into the system ([system](../process/system.md)), not styled ad hoc.
7. Draw every applicable state with real or plausible domain content, long and mixed-script strings included.
8. Define adaptive behaviour per window class.
9. Write the words.
10. Render, floor and critique (loop steps 8-9 in [SKILL.md](../../SKILL.md)).

## Model before pixels

The function map ([template](../../templates/function-map.md)) is the model. In a redesign it is built
before looking at the current screens ([redesign](../process/redesign.md)). For a `piece`, write five
lines in the brief: the object, its top three actions with frequency, the attributes scanned in lists,
the lifecycle states, the relationship crossed most often.

Derive screens from the model, not from a list of pages:

| Model fact | Screen consequence |
| --- | --- |
| An object with many instances, scanned by a few attributes | a collection view plus a detail; the scanned attributes become columns or the row's second line |
| An action done many times a day | visible on the collection and the detail without navigating; a shortcut on desktop; never in an overflow menu |
| An action done monthly | overflow menu, settings or the detail's secondary area |
| An attribute people filter by | a control in the filter bar; the rest go under "more filters" |
| Lifecycle states (draft > active > archived) | one status vocabulary; each state lists the actions it allows; status is a column and a filter |
| A 1 : n relationship crossed often | the children inside the parent's detail (tab, section, nested list) or a list-detail split |
| A job with waits | a place to come back to (inbox, task centre, notification), not a spinner to watch |

- Collection nouns (library, calendar, catalogue, map) are views of a core object, not objects: model the event, product or place, then choose how to list it.
- Actions depend on role, permission and object state: on your own record you see edit and delete, on someone else's you see follow. Draw each combination that changes the action set.
- Related objects link to each other in their details, so users move from content to content without a dead end; global navigation is the fire escape, not the only route.

Test before drawing: every screen names its object and its primary action; each top job in PRODUCT.md
walks through the screens with no dead end and no step that re-asks known data. Screens drawn from a
navigation list instead of objects look fine one by one and do not connect.

## Archetypes

| Archetype | Fits | Skeleton | Trap |
| --- | --- | --- | --- |
| List-detail | browse, then act on one item | collection + detail pane or pushed page | a detail that only repeats the row |
| Work queue / inbox | items arrive and must be triaged | queue by urgency + detail + next/previous + bulk | no "all done" state; no keyboard triage |
| Table CRUD | records compared and edited in bulk | filter bar + table + drawer or page ([data-dense-ui](data-dense-ui.md)) | a table where two attributes matter |
| Dashboard | monitoring, analysis, reporting | [data-dense-ui](data-dense-ui.md) | equal tiles that answer no question |
| Feed | a stream consumed in order | timeline with an unread marker and refresh | infinite scroll for things people must find again |
| Form / wizard | data entry | one column, grouped; steps only for dependent answers | a wizard for independent fields |
| Canvas / editor | making something | canvas + toolbar + inspector + layers; command palette | chrome crowding the canvas; no zoom or undo model |
| Settings | rare, deliberate changes | grouped list; search past about 20 items | a Save button for instant toggles, or the reverse |
| Conversation / agent | open-ended or delegated work | [ai-experience](ai-experience.md) | chat as the default when inputs are known |

## Navigation structures

Choose by breadth (how many top-level places), depth, and how often users jump between places.

| Situation | Structure |
| --- | --- |
| 3-5 peer destinations used daily, on a phone | bottom tab bar in the target's current form (see its platform file) |
| 6+ modules or grouped areas (admin, enterprise) | sidebar, grouped, one or two levels, collapsible to icons with labels on hover and focus |
| A deep hierarchy of one kind of object | drill-in with back; breadcrumb on desktop web |
| A workspace around one object (project, document, device) | minimal global nav; object-scoped tabs or a local sidebar inside the object |
| A scope that changes everything (tenant, project, environment, time range) | a scope switcher in the top-leading corner, always visible, reflected in the URL |
| Power users jumping between distant places | command palette (Cmd+K / Ctrl+K) and shortcuts, in addition to visible navigation, never instead |
| A linear task that must finish (checkout, onboarding, 开户) | no global nav during the task; visible progress; leaving saves or warns |

- The user always sees where they are (selected item, page title, back or breadcrumb) and which scope is active.
- Labels are the function map's nouns in the user's words. Once shipped they are equity (PRODUCT.md) and change only with a row in decisions.md.
- Tools, filters and view options are local to the screen, never global navigation.
- The navigation form changes by window class: bar > rail > sidebar (see Adaptive behaviour).
- On web the URL is state: filters, tabs, sort, page, selected item, open panel. Back and Forward restore them and the scroll position.

## The state matrix

Design every screen and component across the rows that apply; list skipped rows with the reason.

| Dimension | Cases |
| --- | --- |
| Data | first-use empty, no results, one item, typical, many (pagination or virtualisation), extreme values, stale |
| Async | loading, refreshing, partial failure, error with recovery, offline, success, background job running |
| Interaction | default, hover, focus-visible, pressed, selected, dragging, disabled (with reason), read-only, busy |
| Validation | pristine, invalid (specific message and fix), valid, server-rejected |
| Permissions | signed out, no access, read-only role, over quota or paywalled |
| Content | long strings, missing image, mixed CJK and Latin, large numbers, long names, RTL if shipped, 200 % text |
| Environment | each window class, light and dark, reduced motion, high contrast and forced colours, touch vs pointer vs keyboard |

Three empty states are three different designs:

| State | Trigger | Say | Offer | Never |
| --- | --- | --- | --- | --- |
| First use | nothing exists yet | what this place is for and what it will show | the first action (create, import, connect, invite); a sample if it teaches | an illustration with no action |
| No results | search or filters matched nothing | the query and the active filters, echoed | remove a filter, broaden, search elsewhere | a bare "暂无数据" |
| Error | loading failed | what failed, in words; whether the user's data is safe | retry; the last good data with a stale marker; a status or support link | a raw code alone; a blank screen |

A cleared queue ("全部处理完毕") is a success state, not an empty one: confirm it, then show what comes next.

Loading: a skeleton shaped like the loaded layout. Spinners and skeletons appear only after 150-300 ms
and stay at least 300-500 ms so they never flash. A loading button keeps its label and adds an indicator
("保存中…"). Feedback within 400 ms feels immediate; past about 10 s show progress, let the user leave and
notify on completion. A partial load never gets a whole-page spinner.

Make every designed state reachable by query parameter, as [portable-mockups](../fundamentals/portable-mockups.md)
describes, with names from this matrix (`?state=empty-first`, `?state=no-results`, `?state=error`), so the
capture round shoots all of them ([render-and-look](../process/render-and-look.md)).

## Actions and overlays

- One primary action per view. Destructive actions are separated, never the default focus, and name the consequence ("删除 3 个文件", not "确定").
- Prefer undo to confirmation. Confirm only irreversible, costly actions; deleting a named resource asks the user to type its name.
- Least modal first: inline edit > popover > drawer or sheet > dialog > full page. Never a modal on a modal.
- Give every overlay a contract: how it dismisses (light dismiss or explicit only), Esc, where focus lands on open and returns on close, what stays usable behind it. On web, native popover and dialog provide most of this ([web](../platforms/web.md)).
- A disabled control says why, next to it; or it stays enabled and explains on use.
- Optimistic updates roll back visibly on failure and offer undo.
- Every drag has a single-pointer alternative: a "move to" menu, up and down controls, tap-to-set on a slider track (WCAG 2.5.7).
- Icon-only buttons only for glyphs universal on that platform (close, search, back, more), always with an accessible name. A tooltip is not a label on touch.

## Forms

- Order fields by the user's mental sequence, not the schema; group them under headings; one column. Pairs that belong together may share a row (start and end date, 省/市/区).
- Control choice: 2-5 exclusive options > radio or segmented control; 6-15 > select; long or searchable lists > combobox; an instantly applied setting > switch; a choice confirmed on submit > checkbox; dates > typed input plus picker; a small bounded number > stepper.
- Mark the minority: mark optional fields when most are required. Chinese enterprise products expect a red asterisk on required fields; follow the host.
- Help text is visible before the error. A placeholder is an example value, never the label.
- Validate on blur; once a field shows an error, re-validate as the user types. On submit, focus the first error, summarise on long forms, keep every value.
- Never pre-disable submit. When the request starts, disable it and keep its label with an indicator.
- Accept forgiving input and normalise it: spaces and dashes in phone numbers, full-width digits and punctuation from Chinese input methods, pasted codes with spaces; trim.
- Pre-fill what the user already gave in this flow (WCAG 3.3.7). Sign-in allows paste and password managers; no puzzle CAPTCHA without an alternative (3.3.8).
- Long forms: section navigation, autosave or an explicit draft, an unsaved-changes guard, a sticky action bar. Dangerous settings sit in a separate danger zone.
- Wizards only when later steps depend on earlier answers: show the steps, go back without loss, review before commit.
- Specify input type, on-screen keyboard (`inputmode`) and `autocomplete` per field; web specifics in [web](../platforms/web.md).
- Chinese-market fields: one 姓名 field, never split into given and family names; 手机号 grouped 3-4-4 as it is typed; an SMS code button with a countdown ("重新获取 (59s)"); an 18-character 身份证号 whose last character may be X; region as a cascading 省/市/区 picker with search.

## Collection views: table, list, cards, board

| The items are | Use | Because |
| --- | --- | --- |
| records compared across three or more attributes, sorted, filtered, edited in bulk | table ([data-dense-ui](data-dense-ui.md)) | the eye compares down a column |
| identified by a title and one or two facts, scanned top to bottom | list | fastest to scan; works at every width |
| recognised by an image (products, media, people, places), browsed | cards or a grid | the image is the identifier |
| moving through stages | board, with a non-drag "move to" | the stage is the main attribute |
| events in time | timeline | order and gaps carry meaning |
| located in space | map plus a synced list | the list carries details and the keyboard path |

- Cards for comparable records are the SaaS default and defeat comparison. Equal cards for things without images are a list pretending.
- A desktop table on a phone becomes a list with two or three key fields, or scrolls horizontally with a sticky identifier. Decide per table and draw it.

## Density

Row heights and the density setting: [layout-and-spacing](../fundamentals/layout-and-spacing.md); the
CJK text floor: [data-dense-ui](data-dense-ui.md).

- Take the level from PRODUCT.md frequency and expertise, and apply it to content as well as spacing: a daily expert tool shows more per screen and adds shortcuts; an occasional task shows fewer choices per screen and more guidance.
- One density per surface. A compact table next to an airy form on one screen reads as two products.

## Adaptive behaviour

Specify per window class (breakpoints: [layout-and-spacing](../fundamentals/layout-and-spacing.md);
component names: the platform file). Worked example, list-detail:

| | Compact | Medium | Expanded |
| --- | --- | --- | --- |
| Navigation | bottom bar | rail | sidebar |
| List and detail | list; detail pushed | split when both panes fit their minimum width, else pushed | persistent split |
| Filters | a filter button with the active count, opening a sheet | chips plus a sheet | inline filter bar |
| Primary action | the target's bottom action (platform file) | toolbar | page header |
| Table | list rows with 2-3 fields | priority columns, the rest in detail | all columns, resizable |

Desktop apps also specify the minimum window size, pane resize and collapse rules, and multi-window
behaviour. Re-compose at each class; never just shrink.

## Words

- Buttons: verb + object ("创建项目", "Export CSV"). The name persists through the flow ("发布" > toast "已发布"). An ellipsis marks a command that opens a further step ("重命名…").
- Errors: what happened, why if known, what to do next; never blame. A code comes after the human sentence ("无法连接服务器，请检查网络后重试（错误码 502）").
- One term per concept, taken from the function map. English UI: sentence case unless the host uses title case.

Chinese UI:

- Fix terms once in a glossary: 登录 (not 登陆), 账号 (not 帐号); 删除 destroys, 移除 detaches from a group; 取消 aborts, 撤销 reverses a finished action, 撤回 recalls something sent; 提交 starts a review or process, 保存 only stores.
- Choose 您 or 你 once per product (您 for finance, government and service; 你 for consumer products and tools). Never mix.
- No 请 on buttons or labels; keep it for instructions that ask something of the user. No terminal punctuation on buttons, labels, titles or one-phrase toasts; full sentences end with 。.
- Punctuation width and CJK-Latin spacing follow [cjk-typography](../fundamentals/cjk-typography.md): one convention per product.
- Numbers: 万 and 亿 for large counts in consumer UI (1.2 万); full digits with separators in admin and finance (1,280.00). Choose currency, date and time formats once per context (¥1,280.00 or 1,280.00 元; 2026-09-27 or 2026年9月27日; 24-hour time). Relative time: 刚刚 > N 分钟前 > 今天 14:30 > 昨天 14:30 > date.
- Lay out for the longest shipped locale: a label that fits in Chinese often doubles in English or German.

## Deliverable

- `.design/screens/<screen>.html`: self-contained, on host tokens (or `.design/system/tokens.css`), inside the target frame from the [mockup kit](../../assets/mockup-kit/kit.css), in the portable subset, with the state switcher; PNGs per target x theme x state.
- Several targets: frames side by side in one file, one design language re-composed per target. The primary action moves to each platform's idiom and a phone list becomes a table with a toolbar on desktop. The same content stamped into four sets of chrome is not re-composition.
- Show where system components go (tab bars, navigation bars, the mini-program capsule, keyboards) and label them as system; the platform draws them and the implementer does not rebuild them.
- Per screen, a short note: object and primary action, states covered, adaptive rules, content rules, accessibility notes, open questions. Handoff shape: [handoff-spec](../../templates/handoff-spec.md).

## Traps

- Only the populated, error-free, one-language, light screen was designed.
- An untouched component-library theme, the enterprise version of generic. The first five token moves that make any library stop looking stock: brand and neutral tint, radius logic, density, type ramp, focus style. Mechanism per library: [system](../process/system.md) (theming a component library).
- Hover-only affordances on touch; custom back buttons fighting the system gesture; one platform's idiom on another, such as a Material FAB on an iOS screen ([platforms](../platforms/README.md)).
- A confirmation for every click; a disabled submit with no reason; placeholder-only labels; icon-only navigation in an unfamiliar product.
- Drifting into the implementer's build and test tooling instead of finishing the design.
