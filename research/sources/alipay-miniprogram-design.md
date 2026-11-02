# 支付宝小程序设计 (Alipay mini-program design): whitepaper, guidelines, visual spec, 大屏适配, 走查表
- id: alipay-miniprogram-design · url: https://opendocs.alipay.com/mini/design · fetched: 2026-11-01 · method: browser + fetch
- review_by: 2027-01-30 (perishable +90d) · licence note: paraphrased digest, not a mirror (Ant Group developer documentation; no licence stated)
> 中文导语：支付宝小程序设计文档（更新时间 2026-06-02）是微信之外第二个有"计分"约束的国内小程序宿主：核心体验白皮书写明非用户触发的弹窗同页最多 1 个、同屏动效不超过 2 个，违者"有下架风险"；导航栏由框架统一提供、深浅两套；标签栏固定底部、2–5 项、键盘弹出时隐藏；视觉稿以 750 px 宽为基准、左右边距 24 px（12 pt）；LOGO 为圆形、首页实际展示 56×56、主体占比 72%；服务 ICON 核心图形 106、最大 130；图片 ≤ 120 KB、占位色 #F5F5F5；大屏 720–3840 px 按 8/12/24 栅格。页面是 JS 壳，但每页有 `.md` 镜像和 `/mini/llms.txt`（378,747 字节），agent 可直接读。

Read on 2026-11-01 by two verifiers (headless render of the HTML shell; the markdown mirrors `https://opendocs.alipay.com/mini/<id>.md` and `https://opendocs.alipay.com/mini/llms.txt`): doc `00mry2` (design home) and section pages `00mpje` 导航, `00mry3` 流程, `00mpjg` 引导, `00mry4` 反馈, `00mqu3` 容错, `00mpjh` LOGO, `00mqu4` 服务 ICON, `00mqu5` 图片, `00mqu6` 布局, `088bw9` 大屏, `00mqu7` / `00mqu8` 组件, `00mqu9` 走查表, `03nzph`. Pages print "更新时间：2026-06-02 15:59:13". `/mini/design/overview` and `/mini/design/principles` return 200 but serve a generic landing page.

## Key facts
1. **Whitepaper rules with teeth**: "控制同一页面非用户主动触发的弹窗数量，最多不超过1个"; "同一屏幕内，不应出现大于 2 个动效"; navigation has "深浅两套配色方案"; compliance "后续会纳入小程序综合质量考核评分中", violators "有下架风险". The 走查表 says "同一页面非用户主动触发弹窗使用频次控制在 2 个以内": the two documents disagree (1 vs 2).
2. **Navigation**: the nav bar "默认由支付宝小程序框架统一提供，开发者不可以对其位置和样式进行自定义"; the tab bar "始终固定在屏幕底部… 每个导航最少 2 项，同时显示不超过 5 项"; a custom tab bar may change only icon, text and background colours; the tab bar hides when the keyboard shows; the status icon blinks three times.
3. **Pop-ups and permissions**: home pop-ups "控制在 1 个以内"; authorisation prompts at the point of need, not on entry.
4. **Feedback**: launch-page elements other than the logo are official; local loading is preferred and modal loading "应谨慎使用"; "同一时间只显示一个反馈提示".
5. **LOGO**: circular; "首页的实际展示尺寸为 56*56"; the subject "建议占比130（72%）" inside the "140*140 圆形辅助线" and not beyond "180*180"; no 图形+文字 stacking, no outline background, no 红点 / NEW / HOT / 认证 marks or QR codes.
6. **服务 ICON**: core graphic "106", maximum "130", circular background "撑满 180*180". **Images**: ≤ "120KB", placeholder "#F5F5F5".
7. **Layout**: "基于宽度 750px（iPhone 6）输出视觉方案… 左右边距 24px（12pt）"; the spacing, radius, type and colour specs are images only (the markdown mirrors carry headings without values).
8. **大屏适配**: width "720 px-3840 px", height "1000 px-1960 px"; aspect ratio > 1 is landscape; grid "宽度 ≤ 720：8 栅格 / 720 < 宽度 ≤ 2560：12 栅格 / 2560 < 宽度 ≤ 3840：24 栅格"; scaling "不缩放（≤ 720）/ 等比缩放（720 < 宽度 ≤ 1152）/ 宽度伸缩（≥ 1152（720 x 1.6））"; wrapping "< 1440 一排一 / ≥ 1440 一排二 / ≥ 2160 一排三".
9. **Deliverables for review**: the 体验设计走查表 is offered as .xlsx / .pdf; the whitepaper as PDF (neither opened).
10. **Agent access**: the HTML is a JavaScript shell (18.6 KB), but every page has a static `.md` twin and the site publishes `/mini/llms.txt` ("以 Markdown 格式查看 / 复制给 LLM" buttons on each page).

## What it changes for the skills
- skills/design-studio/references/platforms/mini-programs.md: an Alipay column next to WeChat: 750 px canvas with 24 px margins (WeChat 375 / 390 px), framework-owned nav bar in two schemes, 2–5 tabs hidden under the keyboard, the one-pop-up and two-motion caps, the 56 px circular logo at 72 % and the 106 / 130 service icon, images ≤ 120 KB, the 8 / 12 / 24 large-screen grid; and the `.md` / `llms.txt` endpoints as the agent path.
- skills/design-studio/references/disciplines/app-icons.md: Alipay's circular logo geometry (140 / 180 guides) next to the WeChat avatar.
- catalogue: add `entry_points` (`/mini/llms.txt`, `/mini/<id>.md`) to the existing `alipay-miniprogram-design` row.

## Not verified / open
- The 1-vs-2 pop-up conflict between the whitepaper and the 走查表 is unresolved; design to the stricter 1.
- 色彩 / 字体 / 间距 / 圆角 values live in images and were not read; neither PDF nor the .xlsx was opened.
- The `.md` mirrors carry no edit-date field; the 2026-06-02 stamp comes from the rendered pages.
