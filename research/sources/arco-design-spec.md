# ArcoDesign 样式指南 (ByteDance): type, the 1.4 vs 1.5715 line-height split, Chinese–digit spacing, radii and spacing scale
- id: arco-design-spec · url: https://arco.design/docs/spec/style-guideline · fetched: 2026-11-01 · method: browser + repo@e34b8bd23971aff86df2fa7ac2717b8010c4d531
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror (Arco MIT; the guideline page is undated)
> 中文导语：Arco 的样式指南给出"最小可识别文字尺寸 12px"、"字号差距需保持 2-4px"、"3-5 种之间"、主字号 14、段间距至少字号的 1.5 倍（14 px 对应 21 px，引 WCAG AAA）、字重 400/500（西文与数字 600）、主色 `#165DFF` 与 13 套色板、遮罩 `#1D2129` 60%；并且是国内设计系统里少见地把"中文与数字之间需要加空格"（例外：7号线、3D打印）写成规范的一份。注意行高的页面与代码不一致：指南写"默认的行高为 1.4 倍"，代码 `@line-height-base: 1.5715`，两处都记。旧地址 `/docs/spec/font`、`/docs/spec/colors` 已变成 404 页。

Read on 2026-11-01 by the Chinese-ecosystem verifier (headless render of `/docs/spec/style-guideline`, `/docs/spec/typography`, `/docs/spec/layout`; raw `site/docs_spec/style-guideline.zh-CN.md`; `components/style/theme/{default,global}.less`; `components/Typography/style/token.less` on `main`). Packages: `@arco-design/web-react` 2.66.18 (npm 2026-10-12), `web-vue` 2.59.0 (2026-10-20), `mobile-react` 2.39.1 (2026-06-03); October releases are fixes and DatePicker options, no token changes.

Pin note: `arco-design/arco-design` is pinned at `e34b8bd`, the HEAD of `main` when this digest was written (2026-11-01). The verifier read the `main` branch the same day, not this exact commit; the cited files may differ by the commits in between.

## Key facts
1. Primary `#165DFF`, "13 种通用主色…13套基础色板"; mask "`#1D2129`，透明度为60%".
2. Fonts: PingFang SC / Microsoft Yahei for Chinese, Nunito for Latin, digits Nunito or "Byte Number".
3. "最小可识别文字尺寸：12px"; "字号差距需保持2-4px"; "3-5 种之间"; "主字号定义为14px".
4. Line height: the guideline says "arco默认的行高为1.4倍" (and discusses 1.5–2× for Chinese); the code says `@font-size-body: 14px; @line-height-base: 1.5715`. The Typography spec page lists "较大的行高：44px, 40px；较小的行高：36px，32px，20px".
5. Weights: "Regular 以及 Medium…400 和 500…semibold…600…Light…300"; headings h1–h6 36 / 32 / 28 / 24 / 20 / 16 px with line-heights 1.23 / 1.25 / 1.29 / 1.33 / 1.4 / 1.5 and weight 500 (code).
6. "段落间距至少为字体大小的 1.5 倍。正文14px字号对应段间距为21px" (the page cites WCAG AAA).
7. **Spacing convention**: "中文与数字之间需要加空格" except fixed terms such as "7号线、3D打印"; 24-hour time.
8. Radii small 2 / medium 4 / large 8; size scale in 4 px steps (`@size-1` 4 px … `@size-50` 200 px; controls mini 24, small 28, default 32, large 36); spacing tokens 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 36, 40, 48, 56, 60, 64, 72, 80.
9. The old spec URLs `/docs/spec/font` and `/docs/spec/colors` now return the site's 404 view; `site/docs_spec` holds introduce, philosophy, style-guideline, values and components, and no accessibility page.

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: the Chinese–digit space is now a stated rule of a major Chinese system (with the 《中文文案排版指北》 convention); the 12 px floor and 2–4 px size steps are quotable; the 1.4 vs 1.5715 split is an example of design docs and code disagreeing: the matrix and the render decide.
- skills/design-studio/references/process/system.md §7: Arco themes via Less variables; note the doc/code split when auditing an Arco host.

## Not verified / open
- Breakpoints and grid gutters were not found in the pages read.
- Mobile (`mobile-react`) typography was not read.
