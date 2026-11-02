# TDesign 设计指南 (Tencent): type scales, the "+8 px" line-height rule, contrast per colour, layout grid and breakpoints
- id: tdesign-spec · url: https://tdesign.tencent.com/design/fonts · fetched: 2026-11-01 · method: browser + repo@d41f945f19a5d7fff2bcf9bfb5aad818293719bc
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (TDesign MIT; the design-guide pages are JavaScript-rendered and undated)
> 中文导语：TDesign 是唯一一份在正文里写明行高规则和逐色对比度的中文设计系统：两套字阶（10/12/14/16/20 步进 2 px；24/28/36/48/64 步进 +4/+8/+12/+16），"桌面端的最小字号是 12px，10px 则作为移动端的 Base 字号"，行高 = 字号 + 8（由 WCAG 1.5 倍在 14/16 px 处推出），只用 400 和 600 两个字重（Windows 把 600 以下渲染成常规）；文字 90/60/40/26% 黑、100/55/35/22% 白，"至少 1:4.5（AA 级别）"；腾讯蓝 `#0052d9` 对比度 6.54:1，红 `#d54941` 4.32、橙 `#e37318` 3.12、绿 `#2ba471` 3.16（HCT 十级）；中性色 14 级并声明常用文字对比均大于 4.5；8 px 网格、12 栅格、间距 16、边距 24、侧栏 232/64、992 自动收起、最小页宽 768；断点 320/768/992/1200/1400/1880。

Read on 2026-11-01 by the Chinese-ecosystem verifier (headless render of `/design/fonts`, `/design/color`, `/design/layout`, `/design/dark`, `/design/values`; the static HTML is a 2 KB shell) and the visual verifier (source `Tencent/tdesign` `site/src/pages/design/fonts.vue` and `Tencent/tdesign-common` `style/web/theme/{_font,_size,_radius,_light,_variables}.less` on `develop`). Package versions on 2026-11-01: `tdesign-vue-next` 1.20.10 (2026-10-15), `tdesign-react` 1.18.6 (2026-10-30), `tdesign-miniprogram` 1.17.0 (2026-09-23; 1.18.0-beta 2026-10-29), `@tdesign/uniapp` 1.0.0 (2026-10-15).

Pin note: `Tencent/tdesign-common` is pinned at `d41f945`, the HEAD of `develop` when this digest was written (2026-11-01). The verifier read the `develop` branch the same day, not this exact commit; the cited files may differ by the commits in between.

## Key facts
1. **Scales**: "第一字阶，每个字号的增长步数差距为 2px… Body 字号设置为 14px，Base 取 12px，桌面端的最小字号是 12px，而 10px 则作为移动端的 Base 字号"; the second scale grows "+4、+8、+12、+16": 10 → 12, 14, 16, 20 → 24, 28, 36, 48, 64.
2. **Line height**: "line-height = font size + 8", derived from WCAG's 1.5× at 14 / 16 px. Tokens: 12/20, 14/22, 16/24, 18/26, 20/28, 24/32, 28/36, 36/44, 48/56, 64/72 (body-small … display-large); title, headline and display weight 600.
3. **Weights**: "font-weight: 400 和 font-weight: 600" only, because Windows renders weights below 600 as regular. Tabular digits use the "TCloud Number" face. Stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Source Han Sans CN, sans-serif…` (page); token `--td-font-family: PingFang SC, Microsoft YaHei, Arial Regular` (code).
4. **Text colours and contrast**: Gy1 `#000000` 90 %, Gy2 60 %, Gy3 40 %, Gy4 26 %; Wh1 `#ffffff` 100 %, Wh2 55 %, Wh3 35 %, Wh4 22 %; "文字显示色彩对比满足至少 1:4.5（AA 级别）"; dark page repeats "至少要有 1:4.5 的对比度".
5. **Palette**: Tencent Blue `#0052d9` (Blue7, "对比度 6.54:1"), Red6 `#d54941` (4.32:1), Orange5 `#e37318` (3.12:1), Green5 `#2ba471` (3.16:1), 10 steps each in HCT; 14 neutrals (`#f3f3f3` L96 … `#181818` L8) with "常用文字与其色彩对比度均大于4.5"; brand-tinted neutrals "品牌色的混合比例为 8%-12%"; 8 extended palettes; dark palettes × 10 (Blue6 `#2174FF`, Cyan6 `#3CB1FB`, Purple6 `#B382F0`).
6. **Sizes and radii** (code): `--td-size-1…16` = 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72 px; component heights `--td-comp-size-m` 32 px (xxxs 16 … xxxxxl 72); radius small 2, default 3, medium 6, large 9, extraLarge 12, round 999 px.
7. **Layout**: "标准画板宽度定为 1440px 或 1920px"; "网格基数为 8px"; gutter "默认为 16px"; margin "默认值为 24px"; content "采用 12 栅格系统"; sidebar expanded 232 px / collapsed 64 px, auto-collapse at 992 px; three breakpoints, minimum page width 768 px (704 px content with a sidebar); spacing "遵循 8 倍数…增加了 4、12 两档". Less breakpoints: xs 320, sm 768, md 992, lg 1200, xl 1400, xxl 1880.
8. **Recent releases**: `tdesign-miniprogram` 1.17.0 (2026-09-23): "组件间距、圆角与字号样式全量 token 化… `--td-spacer-* / --td-font-size-* / --td-radius-*`"; `@tdesign/uniapp` 1.0.0: grey corrections (dark `--td-gray-color-11` `#383838` → `#393939`; light `--td-gray-color-3` `#e7e7e7` → `#e8e8e8`, `-4` `#dcdcdc` → `#ddd`, `-5` `#c5c5c5` → `#c6c6c6`), Navbar `right` slot no longer hidden by the capsule; `@tdesign-vue-next/chat` 0.7.0 (2026-09-09): "ChatEngine: 新增生成式 UI 能力，内置支持 A2UI 协议… AG-UI Activity".

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: the 14 / 22 body pair and "+8 px" rule are now stated by two Chinese systems (with `ant-design-spec`); 12 px desktop minimum and 10 px mobile base become digest-backed floors for Chinese UI; the two-weight rule (400 / 600) and its Windows rationale are quotable.
- skills/design-studio/references/fundamentals/color.md: a Chinese palette that publishes per-colour ratios (6.54 / 4.32 / 3.12 / 3.16) is the model for how a DESIGN.md should record its contrast table.
- skills/design-studio/references/fundamentals/layout-and-spacing.md: TDesign's 8 px grid, 16 gutter, 24 margin, 232 / 64 sidebar and 992 collapse join the breakpoint table for Chinese admin targets.
- skills/implement-design/references/stacks.md (TDesign, uni-app, mini-programs): the mini-program package is fully tokenised since 1.17.0; the chat engine speaks A2UI and AG-UI.

## Not verified / open
- The design-guide pages are undated and their Markdown source is not in any public repository found.
- HCT steps and the extended palettes' hex lists were not transcribed.
