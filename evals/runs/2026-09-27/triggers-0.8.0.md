# Trigger eval — suite 0.8.0

- results: `evals/runs/2026-09-27/triggers-0.8.0.jsonl`
- rows answered: 100/100; runs: 1, 2, 3
- unanswered rows: none
- answers naming a skill outside the suite (scored as none): none
- proxy method, not host triggering: see evals/run_triggers.md

## Role view (comparable across suites)

| metric | value |
| --- | --- |
| accuracy (all samples) | 100.0% |
| majority-vote accuracy (rows) | 100.0% |
| rows with identical answers across runs | 100.0% |
| false-trigger rate (expected none) | 0.0% |
| miss rate (expected a skill, got none) | 0.0% |
| wrong-skill rate (expected a skill, got another) | 0.0% |

Samples: 297 over 99 rows.

| class | support | predicted | precision | recall |
| --- | --- | --- | --- | --- |
| design-studio | 141 | 141 | 100.0% | 100.0% |
| critique-design | 30 | 30 | 100.0% | 100.0% |
| implement-design | 30 | 30 | 100.0% | 100.0% |
| none | 96 | 96 | 100.0% | 100.0% |

| slice | samples | accuracy |
| --- | --- | --- |
| positive | 165 | 100.0% |
| near-miss | 111 | 100.0% |
| negative | 21 | 100.0% |
| zh | 168 | 100.0% |
| en | 129 | 100.0% |
| collision rows | 45 | 100.0% |
| other rows | 252 | 100.0% |

Confusion (rows = expected, columns = answered):

| expected \ answered | design-studio | critique-design | implement-design | none |
| --- | --- | --- | --- | --- |
| design-studio | 141 | 0 | 0 | 0 |
| critique-design | 0 | 30 | 0 | 0 |
| implement-design | 0 | 0 | 30 | 0 |
| none | 0 | 0 | 0 | 96 |

Known collision rows: 15 of 15 right by majority vote.

| id | expected | answers | majority right | prompt |
| --- | --- | --- | --- | --- |
| t001 | design-studio | design-studio, design-studio, design-studio | yes | 我们要做一个给律所用的案件管理 SaaS，PRD 在 docs/prd.md，从需求开始把整体设计做出来 |
| t039 | design-studio | design-studio, design-studio, design-studio | yes | how could https://acme.example look better? ideas and references plea… |
| t040 | design-studio | design-studio, design-studio, design-studio | yes | 整体 UI 优化一下，现在太丑了，代码在 apps/web |
| t041 | design-studio | design-studio, design-studio, design-studio | yes | can you do a UI polish pass across the whole app? it looks like a 201… |
| t042 | design-studio | design-studio, design-studio, design-studio | yes | Make this page look nicer: src/app/settings/page.tsx |
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

Misrouted rows (0):

None.

## Ambiguous rows (reported, not scored)

Answers in the role view's labels for 0.8.0, in the 14 names for 0.7.0.

| id | label if forced | answers | prompt |
| --- | --- | --- | --- |
| t038 | design-studio | design-studio, critique-design, design-studio | 这个网站怎么改更好看 https://shop.example.com |
