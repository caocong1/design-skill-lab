# NOTES — 恒川设备云 · 工单列表与详情

Design read: calm, dense Chinese enterprise console for a supervisor who scans all day; `piece` mode, standard effort. The one idea: SLA urgency is read first. Overdue is the only solid red on the list: a red-tinted row with a left rule, and a filled red 「已超时 …」 chip with a ⚠ icon. The 已超时 quick-view count sits in a red pill. The detail page has a big remaining-time readout. P1 badges are outlined rather than filled, and the priority badge is muted on 已关闭 rows, so priority never out-shouts overdue.

## Assumptions (one per line)
- The org switcher shows 苏州一厂, but the list contains 二厂 rows as the brief does; I assumed the switcher is the organisation or default context, and the 厂区/产线 filter is what narrows the list by plant.
- The SLA column splits the brief's text into value + phase (e.g. 「已超时 12分」 over 「响应时限」); the wording is unchanged, only the order differs.
- 「响应剩 35分」 is shown in amber as 即将超时 (under 1 hour left); no threshold was given, so I chose < 1 h.
- Rows still marked 未完成 whose SLA is overdue (0402, 0371) get a red left rule on the row plus a ⚠ icon and the words 已超时, so colour is never the only cue.
- 「超时 20分修复」 (closed, but late) is amber with a check icon, which separates it from 按时修复 (green).
- The 已挂起（等备件） status is shown as the 已挂起 badge with （等备件） on a second line, to keep the column narrow.
- Selecting rows 2 and 3 replaces the table toolbar with a bulk bar: 「已选 2 项（本页）」, 批量派单, 批量修改优先级, 导出所选 and 取消选择. There is no select-across-pages option, since the brief does not list one.
- Total pages = ceil(1,286 / 15) = 86.
- 「导出全部」 and 「新建工单」 sit in the page header; 「列设置」 sits in the table toolbar; 「导出所选」 appears in the bulk bar.
- Detail page: the 「更多」 items (打印工单, 复制链接, 关闭工单) are shown as quiet visible buttons under the main actions instead of a hidden dropdown, because the brief requires content to be visible without clicking. They carry a small 「更多」 label, and 关闭工单 is deliberately not red, so it doesn't compete with the main actions.
- Detail: 添加处理记录 is the primary action (the most frequent action while the ticket is 处理中); 提交验收 is secondary until repair is done.
- Detail: 处理记录 is ordered newest first (labelled 「最新在上」).
- The 3 photos in 处理记录 are placeholders labelled with the brief's captions (冷却器外观, 滤网, 温控表); there are no real images.
- Chart annotations (09:12 自动报警, 09:28 节拍降至 80%) and the title「08:50 超过报警线」 come from the brief's timeline and trend data; the red area marks readings above 55 °C.
- The repair SLA bar uses 09:12 → 13:12 (4 h), with 30 min used at 09:42, which matches 「剩余 3 时 30 分」.
- Empty state: the quick-view counts stay as they are (they count all tickets, not the filtered result); the 3 active filters are highlighted in the filter bar and echoed as removable chips.
- Loading state: quick-view counts, rows and pagination are skeletons; the filters stay usable; the toolbar says 「正在加载工单…」.
- Error state: quick-view counts show 「—」 (assumed to come from the same failed request). The message states only what is known (the interface returned HTTP 502 and no data came back); it does not claim the data is safe. It offers 重新加载 and says to send the request number to the administrator if retries keep failing, and shows 请求编号 7f3a-91c2-0d44, 时间 09:42:17 and 状态码 502.
- Phone number shown masked, exactly as the brief gives it (138****2716).

## System
- Type: Inter (OFL, Google Fonts CDN) for Latin and numbers with tabular figures; PingFang SC (the macOS system font, not bundled) for Chinese; JetBrains Mono (OFL) for ticket and device IDs.
- Cell text is 13 px, and meta and badges are 12 px. That keeps the 12 px CJK floor while holding 15 rows at about 50 px each, so 10+ rows fit in the first 900 px.
- Colours: primary #1F4FB5; status colours are red #B42318, amber #8A4B00, green #1D6B38 and violet #6230A8 (待验收), each on a light tint. Every text pair was computed at ≥ 4.5:1 with color_tools.py; the lint contrast floor passes on all 5 pages.
- Icons are inline SVG, hand-drawn in a Lucide-like 24 px stroke style.

## Verification
- All 5 pages were rendered at 1440×900 @1x full page and inspected. lint.mjs passes the floor on all 5 (contrast, overflow, unnamed controls); token-drift and vocabulary warnings are left open.
- A fresh critic round found a text overlap in the detail SLA bar, P1 red out-shouting the overdue rows, checkbox border contrast (2.58:1, now #7A8699 = 3.69:1), and an unverifiable error claim. All are fixed. There was no second critic round.
- Unverified: focus-visible states and keyboard order (no focus renders were made).

## Not attempted
- Narrow or responsive layouts, dark theme, keyboard focus states in the renders, and the open states of the filter dropdowns and the org switcher.
- Source generator: `src/*.mjs` builds `out/*.html`; `src/render.mjs` writes `out/png/*.png`.
