# Trigger eval — suite 0.7.0

- results: `evals/runs/2026-09-27/triggers-0.7.0.jsonl`
- rows answered: 100/100; runs: 1, 2, 3
- unanswered rows: none
- answers naming a skill outside the suite (scored as none): none
- proxy method, not host triggering: see evals/run_triggers.md

## Role view (comparable across suites)

| metric | value |
| --- | --- |
| accuracy (all samples) | 99.0% |
| majority-vote accuracy (rows) | 99.0% |
| rows with identical answers across runs | 98.0% |
| false-trigger rate (expected none) | 0.0% |
| miss rate (expected a skill, got none) | 0.0% |
| wrong-skill rate (expected a skill, got another) | 1.5% |

Samples: 297 over 99 rows.

| class | support | predicted | precision | recall |
| --- | --- | --- | --- | --- |
| design-studio | 141 | 138 | 100.0% | 97.9% |
| critique-design | 30 | 30 | 100.0% | 100.0% |
| implement-design | 30 | 33 | 90.9% | 100.0% |
| none | 96 | 96 | 100.0% | 100.0% |

| slice | samples | accuracy |
| --- | --- | --- |
| positive | 165 | 100.0% |
| near-miss | 111 | 97.3% |
| negative | 21 | 100.0% |
| zh | 168 | 100.0% |
| en | 129 | 97.7% |
| collision rows | 45 | 93.3% |
| other rows | 252 | 100.0% |

Confusion (rows = expected, columns = answered):

| expected \ answered | design-studio | critique-design | implement-design | none |
| --- | --- | --- | --- | --- |
| design-studio | 138 | 0 | 3 | 0 |
| critique-design | 0 | 30 | 0 | 0 |
| implement-design | 0 | 0 | 30 | 0 |
| none | 0 | 0 | 0 | 96 |

Known collision rows: 14 of 15 right by majority vote.

| id | expected | answers | majority right | prompt |
| --- | --- | --- | --- | --- |
| t001 | design-studio | design-studio, design-studio, design-studio | yes | 我们要做一个给律所用的案件管理 SaaS，PRD 在 docs/prd.md，从需求开始把整体设计做出来 |
| t039 | design-studio | design-studio, design-studio, design-studio | yes | how could https://acme.example look better? ideas and references plea… |
| t040 | design-studio | design-studio, design-studio, design-studio | yes | 整体 UI 优化一下，现在太丑了，代码在 apps/web |
| t041 | design-studio | implement-design, implement-design, design-studio | no | can you do a UI polish pass across the whole app? it looks like a 201… |
| t042 | design-studio | design-studio, design-studio, implement-design | yes | Make this page look nicer: src/app/settings/page.tsx |
| t043 | design-studio | design-studio, design-studio, design-studio | yes | dashboard 页面太丑了帮忙整一下 src/pages/dashboard.tsx |
| t044 | design-studio | design-studio, design-studio, design-studio | yes | 给开发出切图和标注，设计稿在 design/v2/，他们用 Flutter |
| t045 | design-studio | design-studio, design-studio, design-studio | yes | 这几个页面帮我切一下图，iOS 要 @2x @3x |
| t047 | design-studio | design-studio, design-studio, design-studio | yes | design + build: I need a new usage dashboard designed and then coded … |
| t048 | design-studio | design-studio, design-studio, design-studio | yes | 这个页面哪里不好看，直接帮我重新设计一版 |
| t049 | critique-design | critique-design, critique-design, critique-design | yes | 这个页面哪里不好看？截图在 shots/home.png |
| t059 | implement-design | implement-design, implement-design, implement-design | yes | 按这个设计稿实现 design/order-list.png，Vue3 + Element Plus |
| t073 | none | none, none, none | yes | the dropdown menu gets clipped inside the table on Safari, fix it |
| t074 | none | none, none, none | yes | 按钮点了没反应，控制台报 Cannot read properties of undefined (reading 'id')，帮我修一下 |
| t075 | none | none, none, none | yes | 页面在 iPhone 上可以横向滚动，应该是哪个元素超宽了，帮我找出来修掉 |

Misrouted rows (2):

| id | kind | expected | answers | prompt |
| --- | --- | --- | --- | --- |
| t041 | near-miss | design-studio | implement-design, implement-design, design-studio | can you do a UI polish pass across the whole app? it looks like a 201… |
| t042 | near-miss | design-studio | design-studio, design-studio, implement-design | Make this page look nicer: src/app/settings/page.tsx |

## Exact 0.7.0 skill (expect_07)

| metric | value |
| --- | --- |
| accuracy (all samples) | 95.3% |
| majority-vote accuracy (rows) | 94.9% |
| rows with identical answers across runs | 97.0% |
| false-trigger rate (expected none) | 0.0% |
| miss rate (expected a skill, got none) | 2.9% |
| wrong-skill rate (expected a skill, got another) | 3.9% |
| router fallback (design-studio answered a child's intent) | 0 samples |

Samples: 297 over 99 rows.

| class | support | predicted | precision | recall |
| --- | --- | --- | --- | --- |
| build-design-system | 12 | 14 | 85.7% | 100.0% |
| critique-design | 30 | 30 | 100.0% | 100.0% |
| design-brand-identity | 9 | 9 | 100.0% | 100.0% |
| design-graphics | 12 | 12 | 100.0% | 100.0% |
| design-icons | 9 | 9 | 100.0% | 100.0% |
| design-marketing-sites | 12 | 12 | 100.0% | 100.0% |
| design-motion | 9 | 9 | 100.0% | 100.0% |
| design-product-ui | 27 | 29 | 89.7% | 96.3% |
| design-studio | 21 | 14 | 100.0% | 66.7% |
| explore-design-directions | 9 | 9 | 100.0% | 100.0% |
| find-design-inspiration | 12 | 12 | 100.0% | 100.0% |
| handoff-design | 9 | 9 | 100.0% | 100.0% |
| implement-design | 30 | 33 | 90.9% | 100.0% |
| iterate-design-lab | 6 | 0 | — | 0.0% |
| none | 90 | 96 | 93.8% | 100.0% |

| slice | samples | accuracy |
| --- | --- | --- |
| positive | 165 | 97.0% |
| near-miss | 111 | 91.9% |
| negative | 21 | 100.0% |
| zh | 168 | 95.2% |
| en | 129 | 95.3% |
| collision rows | 45 | 93.3% |
| other rows | 252 | 95.6% |

Confusion (rows = expected, columns = answered):

- iterate-design-lab -> none: 6
- design-studio -> design-product-ui: 3
- design-studio -> build-design-system: 2
- design-studio -> implement-design: 2
- design-product-ui -> implement-design: 1

Known collision rows: 14 of 15 right by majority vote.

| id | expected | answers | majority right | prompt |
| --- | --- | --- | --- | --- |
| t001 | design-studio | design-studio, design-studio, design-studio | yes | 我们要做一个给律所用的案件管理 SaaS，PRD 在 docs/prd.md，从需求开始把整体设计做出来 |
| t039 | find-design-inspiration | find-design-inspiration, find-design-inspiration, find-design-inspiration | yes | how could https://acme.example look better? ideas and references plea… |
| t040 | design-studio | design-studio, design-studio, design-studio | yes | 整体 UI 优化一下，现在太丑了，代码在 apps/web |
| t041 | design-studio | implement-design, implement-design, design-studio | no | can you do a UI polish pass across the whole app? it looks like a 201… |
| t042 | design-product-ui | design-product-ui, design-product-ui, implement-design | yes | Make this page look nicer: src/app/settings/page.tsx |
| t043 | design-product-ui | design-product-ui, design-product-ui, design-product-ui | yes | dashboard 页面太丑了帮忙整一下 src/pages/dashboard.tsx |
| t044 | handoff-design | handoff-design, handoff-design, handoff-design | yes | 给开发出切图和标注，设计稿在 design/v2/，他们用 Flutter |
| t045 | handoff-design | handoff-design, handoff-design, handoff-design | yes | 这几个页面帮我切一下图，iOS 要 @2x @3x |
| t047 | design-studio | design-studio, design-studio, design-studio | yes | design + build: I need a new usage dashboard designed and then coded … |
| t048 | design-studio | design-studio, design-studio, design-studio | yes | 这个页面哪里不好看，直接帮我重新设计一版 |
| t049 | critique-design | critique-design, critique-design, critique-design | yes | 这个页面哪里不好看？截图在 shots/home.png |
| t059 | implement-design | implement-design, implement-design, implement-design | yes | 按这个设计稿实现 design/order-list.png，Vue3 + Element Plus |
| t073 | none | none, none, none | yes | the dropdown menu gets clipped inside the table on Safari, fix it |
| t074 | none | none, none, none | yes | 按钮点了没反应，控制台报 Cannot read properties of undefined (reading 'id')，帮我修一下 |
| t075 | none | none, none, none | yes | 页面在 iPhone 上可以横向滚动，应该是哪个元素超宽了，帮我找出来修掉 |

Misrouted rows (6):

| id | kind | expected | answers | prompt |
| --- | --- | --- | --- | --- |
| t036 | positive | design-studio | build-design-system, design-studio, build-design-system | 配色太土了，帮我换一套好看的配色，网站是 https://www.example.com |
| t037 | positive | design-studio | design-product-ui, design-product-ui, design-product-ui | 重新设计一下我们的 App，现在信息架构太乱，用户老找不到功能 |
| t041 | near-miss | design-studio | implement-design, implement-design, design-studio | can you do a UI polish pass across the whole app? it looks like a 201… |
| t042 | near-miss | design-product-ui | design-product-ui, design-product-ui, implement-design | Make this page look nicer: src/app/settings/page.tsx |
| t092 | near-miss | iterate-design-lab | none, none, none | 在 design-skill-lab 仓库里把 Mobbin 加进资源目录 |
| t093 | near-miss | iterate-design-lab | none, none, none | digest the new entries in feedback/inbox into skill improvements for … |

## Ambiguous rows (reported, not scored)

Answers in the role view's labels for 0.8.0, in the 14 names for 0.7.0.

| id | label if forced | answers | prompt |
| --- | --- | --- | --- |
| t038 | design-studio | find-design-inspiration, find-design-inspiration, find-design-inspiration | 这个网站怎么改更好看 https://shop.example.com |
