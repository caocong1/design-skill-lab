# 抖音小程序 视觉规范 and 快手小程序 设计 (Douyin and Kuaishou mini-program design guides)
- id: cn-mini-program-douyin-kuaishou · url: https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/design/design-specification/visual-specification/Basic-Specifications · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d: Douyin pages dated 2024-07-24; Kuaishou pages 2023–2026) · licence note: paraphrased digest, not a mirror (platform developer documentation; no licence stated)
> 中文导语：两个国内小程序宿主的可静态抓取的设计规范。抖音（2024-07-24）：logo 建议 200×200、不加圆角；标签 2–5 项、每项 2–6 字；toast 单行 1.5 s、双行 3 s，气泡 3 s；按钮要有普通 / 按下 / 禁用三态；胶囊"需要保证在最高层级"，用 `getCustomButtonBoundingClientRect` 取位。快手（指南 2026-09-21，要点 2024-08-06，导航 2024-09-26，logo 2024-12-24，排版 / 字体 / 色彩 2023-02-01）：基于 414 pt 宽、边距建议 19 pt；间距尽量不超过 4 种；字号最小 10 pt、最大 24 pt、不超过 3 种，"暂不支持自定义字体"；logo 不低于 204×204 px、不大于 2 M、不加圆角描边；胶囊固定、深浅两套。

Read on 2026-11-01 by the Chinese-ecosystem verifier (fetch; both sites serve static HTML): Douyin `Basic-Specifications`, `Common-Control`, `custom-nav-practices`, `Design-Principles` ("更新时间 2024-07-24"); Kuaishou `/docs/design/designPrinciples/guide.html` (2026-09-21; principles only), `/view/page`, `/view/font.html`, `/view/color.html` (2023-02-01), `/view/logo` (2024-12-24), `/control/navigationBar` (2024-09-26); `mp.kuaishou.com` redirects to `open.kuaishou.com`.

## Key facts — Douyin
1. Logo "建议上传尺寸为 200*200", no rounded corners.
2. Tabs "不能低于 2 个，不多于 5 个", labels "2-6 个字符".
3. Toast "单行…1.5s…双行…3s"; bubbles 3 s.
4. Buttons need 普通 / 按下态 / 禁用态.
5. The capsule "需要保证在最高层级"; position it with `getCustomButtonBoundingClientRect`. No px type or colour values in the text.

## Key facts — Kuaishou
6. "基于宽度414pt边距建议为19pt".
7. "间距的使用尽量不超过4个".
8. "建议最小字号10pt / 最大字号24pt", at most three sizes; "暂不支持自定义字体".
9. Logo "不低于204*204px…不大于2M", no rounded corners or strokes; four text-colour tiers shown only as an image.
10. The capsule is fixed with dark and light schemes.

## What it changes for the skills
- skills/design-studio/references/platforms/mini-programs.md: the "other hosts" section becomes a table: canvas (WeChat 375 / 390, Alipay 750 px, Baidu 750 px, Kuaishou 414 pt), margins (Alipay 24 px, Baidu 34 px, Kuaishou 19 pt), tab counts (all 2–5), logo rules (Alipay circular 56 px at 72 %, Douyin 200 px square, Kuaishou ≥ 204 px square), toast timing (WeChat ≈ 1.5 s; Douyin 1.5 / 3 s), capsule handling (all host-owned; Douyin's API to measure it), and font limits (Kuaishou 10–24 pt, ≤ 3 sizes, no custom fonts).

## Not verified / open
- Douyin's spacing, type and colour values are images only.
- Kuaishou's text-colour tiers are an image; the 2026-09-21 guide revision changed only prose.
