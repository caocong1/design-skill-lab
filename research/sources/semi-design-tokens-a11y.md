# Semi Design (Douyin): tokens, DESIGN.md for agents, the accessibility page and the a11y theme, MCP and Skills
- id: semi-design-tokens-a11y · url: https://github.com/DouyinFE/semi-design/blob/main/content/experience/accessibility/index.md · fetched: 2026-11-01 · method: repo@0580665e20da61422b5269b0c5c44aa2b389d2dc
- review_by: 2027-11-01 (durable +365d: token values; the MCP / Skills surface is dated) · licence note: paraphrased digest, not a mirror (MIT)
> 中文导语：Semi 是国内第一个带专门无障碍主题和 agent 文档的设计系统：无障碍页写明"文本对比至少 4.5:1，18px 或更大可降至 3:1"、active / hover / focus 态与相邻颜色 3:1、禁用态豁免、键盘规则与焦点归还；`@semi-bot/semi-theme-a11y` 提高色板对比并"加大了字体 token 的字号"；仓库根有给 agent 读的 DESIGN.md（2026-03-30），另有 Semi MCP（`@douyinfe/semi-mcp`）与 Semi Skills。字号 12/14 正文、标题 16–32 带固定像素行高、字重 200/400/600、间距 2–40、圆角 3/3/6/12、文字 alpha 1/.8/.62/.35、AI 色 token 与 20 色数据色板。站点的 accessibility 与 changelog 路由会重定向到首页，内容以仓库为准。

Read on 2026-11-01 by the Chinese-ecosystem verifier (GitHub raw on `main`): `content/experience/accessibility/index.md`, `content/start/mcp-skills/index.md`, `content/ecosystem/changelog/index.md`, `DESIGN.md` (added 2026-03-30), `packages/semi-theme-default/scss/{variables,global,_font}.scss`; semi.design `/zh-CN/basic/typography` and `/zh-CN/basic/tokens`. `@douyinfe/semi-ui` 2.104.0 (2026-10-09; fixes only); GitHub Releases stop at v2.88.2 (2025-11-18), the changelog lives in the repo.

Pin note: `DouyinFE/semi-design` is pinned at `0580665`, the HEAD of `main` when this digest was written (2026-11-01). The verifier read the `main` branch the same day, not this exact commit; the cited files may differ by the commits in between.

## Key facts
1. Sizes small 12 / regular 14 / h6 16 / h5 18 / h4 20 / h3 24 / h2 28 / h1 32 with line-heights 16 / 20 / 22 / 24 / 28 / 32 / 40 / 44; weights light 200, regular 400, bold 600 (title and strong = 600). The site typography page states only "`small`（12px）和 `normal`（14px）".
2. Spacing 2, 4, 8, 12, 16, 20, 24, 32, 40; radius extra-small 3, small 3, medium 6, large 12, circle 50 %, full 9999 px; elevated shadow `0 0 1px rgba(0,0,0,.3), 0 4px 14px rgba(0,0,0,.1)`; stack `"Inter", -apple-system, …, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"…`.
3. Text `rgba(grey-9, 1 / .8 / .62 / .35)` (dark theme .6 for text-2). DESIGN.md: primary `#0064FA` (dark `#54A9FF`), danger `#F93920`, text-0 `#1C1F23` / `#F9F9F9`, dark backgrounds `#16161A / #232429 / #35363C`, AI colours (`--semi-color-ai-general` gradient; AI purple `rgba(166,71,255)`), 20 data colours.
4. **Accessibility page**: "至少应达到 4.5:1…18px 或更大的文本对比度可以降至 3:1"; "active、hover、focus 状态都需要满足与相邻颜色 3:1"; disabled exempt; keyboard rules (Tab, arrows, Enter, Space, Esc) and focus return.
5. **a11y theme**: `@semi-bot/semi-theme-a11y` raises palette contrast and "加大了字体 token 的字号" (no px stated).
6. **Agent surface**: repo-root `DESIGN.md` "for AI agents" (2026-03-30); docs page "AI Agent MCP/Skills" with `@douyinfe/semi-mcp` (Node > 20.19.0) and Semi Skills.
7. Site routes `/zh-CN/start/accessibility` and `/zh-CN/start/changelog` redirect to the homepage; the repository paths are the stable reference.

## What it changes for the skills
- skills/design-studio/references/fundamentals/accessibility.md: a Chinese system now states the WCAG text ratios and a 3:1 rule for interactive states; a dedicated a11y theme is a precedent for "high contrast is a mode" (`skills/design-studio/references/process/system.md` §4).
- skills/design-studio/references/process/system.md §7–8: Semi hosts carry a repo DESIGN.md and an MCP; read them before theming.
- skills/design-studio/references/disciplines/ai-experience.md: Semi's AI colour tokens are a second example (with Carbon) of AI state living inside the main theme.

## Not verified / open
- The a11y theme's font-size increases are not quantified in the docs read.
- Whether Semi's DESIGN.md follows the google-labs-code schema was not checked.
