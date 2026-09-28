# 研究日志

按日期记录：抓了什么、发现了什么、结论改了什么、影响了哪些 skill 文件。只追加，不改写旧条目；旧条目有错时，在新条目里更正并注明。逐来源的元数据看 [INDEX.md](INDEX.md)，现场证据看 [field/](field/)，待办看 [backlog.md](backlog.md)。

## 2026-09-20 · 首轮调研（中断）

- 用户给了 15 个设计站点作样例，要求建一个设计类 skill 实验室。
- 一次并行派出 9 个调研 agent（沿用顶配模型），约 25 分钟后全部因额度耗尽终止，没有写出交付物。抢救回来的有：候选域名清单（按 web / appui / motion / icons-assets / brand-graphic / type-color / reading / zh 分组）、GitHub 仓库元数据、部分已抓取的原文。那一轮的调研说明和候选 schema 已在 0.8.0 随调研草稿目录删除；它们描述的 schema 早已和最终目录对不上（例如 `tier_reason` 字段没有保留，S 档的判断理由因此没有记录）。
- 当天抓取：W3C clreq、《中文文案排版指北》、微信小程序设计指南、Anthropic `frontend-design` skill 的三个快照。

## 2026-09-21 · 首版证据层（0.1.0 至 0.3.0）

- 改成主 agent 直接筛选、撰写，再用脚本机械验链。产出 16 份一手摘要（15 份随 0.1.0，Impeccable `/slop` 规则随 0.2.0）、11 篇中文分析、599 条资源目录（0.2.0 增至 601 条）。
- **首次全量验链**：607 个候选 URL，约 100 秒，结果为 static 437 / js 105 / blocked 40 / unreachable 19 / dead 6。
  - 重定向暴露了并购和改名：Godly 并入 Recent Design；Screenlane、UI Movement 重定向到 Page Flows；Polaris 迁到 shopify.dev；react-aria 换了域名，等等。
  - 404 暴露了迁址：Lucide 设计指南、Cloudscape GenAI 模式页、Spline 社区。
  - 许可证变化：Remix Icon 自 2026-01 起改为 Remix Icon License v1.0。
  - 处理结果：移除 8 条，修正 15 条。19 个 TLS 握手失败的主机按网络问题处理，标 `unknown`，没有删除。
- **当日第二次全量运行**：维护者网络更不稳定，不可达升到 48 个，并暴露了一个脚本缺陷：抓取失败被写成 `unknown`，覆盖了上一轮的有效观测。修复为"抓取失败不算观测"，并恢复 34 条。最终分布为 static 433 / js 112 / blocked 40 / unknown 14。当时提交的验链报告是这次**降级的第二轮**，与目录的实际状态不一致。
- 由此定下三条方法约定，至今有效：①重定向到别的主机是并购或改名信号，必须人工看一眼；②不可达不等于死，要用网络搜索确认；③可达性只由脚本写入，抓取失败不覆盖已有观测。
- 0.2.0：用户问到 Anthropic 的 frontend-design。补了配套文章，以及 Impeccable `/slop` 摘要（英文站当天不可达，读的是中文站），同类横评补上"解药也会过期"一节。
- 0.3.0：方向修正，套件的角色是设计师而不是前端工程师，根因写进当时的第 11 篇分析。
- 当时登记的证据缺口：Apple HIG、Material 3、HarmonyOS 设计指南、NN/g。理由写成"站点是 JS 应用或网络不可达"。2026-09-27 的审计证明这个理由不成立（见下）。

## 2026-09-22 至 09-23 · 实验室页面三轮实战（0.4.0 至 0.4.4）

- 套件第一次用在真实任务上：给仓库自己做一个十方向、后来扩到十六方向的页面。过程、看图抓到的问题、写回 skill 的规则，以及 2026-09-27 审计对其中几条说法的更正，见 [field/2026-09-lab-page-dogfooding.md](field/2026-09-lab-page-dogfooding.md)。
- 09-22 页面被重建（每个方向成为独立模块，加入 539 张站点截图和逐条中文描述，中文草稿当时放在规划目录的批次 JSON 里）。这次重建没有进入证据层，它引入的对比度、缩略图问题要到 09-27 才被发现。

## 2026-09-24 · 两个宿主项目的复盘（0.5.1 至 0.7.0）

- 两个真实宿主项目（一个带 Office/WPS 加载项的 Web 业务系统、一个需要登录的 AI 助手类 Web 应用）留下 15 条反馈，驱动了 0.5.1 收尾复盘、0.6.0 截图陷阱与嵌入窗格、0.7.0 从功能地图出发的重设计。逐条的经过、改动和验证状态见 [field/2026-09-host-retros.md](field/2026-09-host-retros.md)。
- 这一阶段的改动都没有进入证据层：没有摘要，没有来源，分析文件也没有更新。审计后来把"0.7.0 的重设计原则只靠一次主人纠正、没有文献"列为高风险。

## 2026-09-27 · 重构审计与重新调研（0.8.0）

**审计发现的问题**

1. **证据层是一天的快照，此后没人回来看过。** 16 份摘要里有 15 份、12 篇分析里有 11 篇写于 09-20/21，最后一次改动停在 0.4.4。0.5.0 到 0.7.0 的改动全部绕过了证据层。分析文件上的"版本 1.0 / 1.1 / 1.2"像是在持续维护，实际上没有。
2. **缺口的理由已经不成立。** Apple HIG 每页都有 JSON 版本（`developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`，返回 200），NN/g 和 WCAG 2.2 也都能直接抓，m3.material.io 用无头 Chromium 就能读。当年的缺口来自不稳定的网络和不知道这些路径，而不是来源读不到。
3. **有些事实写的时候就错了，或者后来过时了：**
   - DTCG 的 Resolver 模块写成"仍在演进"，实际上它和 Format 一起在 2025-10-28 发布为稳定版。
   - APCA 写成"草案"，实际上它 2023 年就从 WCAG 3 草案里移除了，WCAG 3 的对比度算法至今未定。
   - MDC 文档里的弹簧数值被标成"M3 Expressive"，其实那是 standard 方案；Material 推荐的默认是 expressive。
   - taste-skill 写成"1200 行单文件"，现在已是多 skill 的 v2。UI UX Pro Max 的数字过时了。Impeccable 已到 v4.4，规则从中文站的约 46 条变成英文站的 67 条。"没有同类项目覆盖多方向、品牌、平面、评审、交接"这一定位不再成立。
   - 阿里巴巴普惠体、HarmonyOS Sans、MiSans 被写成"开放许可字体"，并且紧接着建议对它们做切片，这有许可风险。
   - 旧分析声称图标 skill 已含 Lucide 的模糊测试，实际没有。
4. **可追溯性在文件一级是真的，在具体说法一级是走形式。** 同一个数字要在英文摘要、中文分析、英文 skill 里写三遍，没有 id 串起来；skill 里只有 4 处引用了证据。
5. **反馈回路是证据体系里最健康的部分**，但它的结论只留在 `feedback/` 和 CHANGELOG 里，从没回流到证据层。
6. **自我违反清单反向过时。** "从没在真实任务上跑过"已经不对（有页面实战和两个宿主项目），但也确实还没有评测集。
7. **页面上的说法不实。** "所有文字/背景对 ≥ 4.5:1"被 axe 证伪；约五分之一的资源没有可用缩略图。已在实战记录里更正。

**重新调研与新增**

- `research/sources/`：共 40 份摘要，全部在 2026-09-27 读取，头部统一写明 url、fetched、method、review_by 和许可说明。
  - 旧的 16 份按原 slug 迁入，并重新读了一遍，每份都写明了相对 09-21 版的更正。
  - 新增 24 份：
    - 平台：`apple-hig-liquid-glass`、`apple-hig-bars`、`apple-app-icons`、`material-3-expressive`、`harmonyos-design`、`fluent-2`、`jlreq`、`cjk-font-licensing`、`web-baseline-2026`
    - 无障碍与法规：`wcag-22`、`accessibility-law`、`ai-labelling-law`
    - token 与格式：`dtcg-2025-10`、`design-md-spec`
    - AI 宿主界面：`mcp-apps`、`openai-apps-sdk-ui`、`a2ui`
    - 同类 skill：`impeccable`、`taste-skill`、`ui-ux-pro-max`、`anthropic-design-skills`、`emil-kowalski-skills`
    - 方法：`ooux-orca`、`change-aversion`
  - 取代关系：`dtcg-design-tokens-format` → `dtcg-2025-10`，`design-md-format` → `design-md-spec`，`impeccable-slop-rules` → `impeccable`。旧文件保留，用于历史引用。
- 读取方法：Apple HIG 用 DocC JSON；华为设计指南用文档 API（每篇带 `updatedDate`）；Material 用无头 Chromium，再对照 androidx 源码；Web 能力状态用 web-features 3.40.0 数据集；同类 skill 仓库固定到某个提交（`repo@<sha>`）后通读。
- `research/topics/`：9 篇中文主题综合，取代旧分析 01–11。每篇都有当前结论（带来源 id 和日期）、论证、未决问题、对 skill 的约束和变更记录。
- `research/field/`：页面实战记录与宿主复盘，从旧分析 12 和 `feedback/` 提炼而来；评测结果以后也放这里。
- `research/INDEX.md`：由 `scripts/build-research-index.py` 生成，列出每份来源的抓取日期、复核期限（逾期会标出），以及哪些 skill 文件引用了它。reference 文件在 frontmatter 里用 `sources: [id]` 引用来源，取代了旧的 source-map（按文件粗分证据等级）。
- `research/backlog.md`：旧种子 SEED-001、SEED-002，加上各主题的未决问题入口和日历触发点。

**删除的旧层（内容都已迁入 research/ 或别处）**

- 中文分析目录（12 篇分析 + 来源索引）：迁入 topics/、field/、本日志和 INDEX.md。
- 原始摘要目录（16 份）：按原 slug 迁入 sources/，并重新核对。
- 调研草稿目录（调研说明、候选 schema、候选域名清单）：属于历史材料，要点记在本日志 2026-09-20 一节。
- 规划目录：
  - 两个种子并入 backlog.md。
  - 验链报告由 `catalog/observed.jsonl` 取代：那是 `scripts/check-links.py` 写入的机器观测，每条带 `checked_at`，只追加，同一 id 以最新一条为准，不再提交整份 Markdown 报告。
  - 中文描述批次文件由 `catalog/resources.jsonl` 的 `zh` 字段取代。
- design-studio 的 source-map（逐文件证据等级表）：由 INDEX.md 和 reference frontmatter（`evidence` / `sources` / `review_by`）取代。
- 上游仓库克隆目录的说明文件：克隆和固定提交的约定移入 [README.md](README.md)。克隆目录本身保留，内容照旧被 git 忽略。
- 以上旧文件都能在 git 提交 `f5c0421` 中找到。

**写作时的状态说明（2026-09-27）**

- `catalog/observed.jsonl` 目前是从 v1 迁入的 601 条 2026-09-21 观测；新一轮全量探测由目录流负责，完成后在本日志补记。
- 有 5 份来源暂时没有被任何 skill 引用：`a2ui`、`apple-app-icons` 等候技能流写完平台与 AI 体验参考；`design-md-format`、`dtcg-design-tokens-format` 已被取代；`emil-kowalski-skills` 与 `emil-kowalski-animation` 分工互补，前者尚无 reference 引用。

## 2026-09-27 · 首轮输出评测与触发评测（0.8.0）

- 6 份固定 brief × 三组（不装 skill、0.7.0、0.8.0），一格一个样本，三位模型评审盲评。按事先定好的规则，三对比较都是"没有明确差别"：0.8.0 对 no-skill 赢 5 份、输 1 份（02 落地页 0:3），但均分只高 0.17；0.7.0 对 no-skill 输 4 份。0.8.0 每份花费约为 no-skill 的 2.2 倍。触发评测（代理）角色视图 0.8.0 为 100%，0.7.0 为 99%，0.8.0 的结果只能当上限看。
- 过程、结果表和由此要改的 skill 文件见 [field/evals-2026-09-27.md](field/evals-2026-09-27.md)；英文完整报告在 `evals/runs/2026-09-27/report.md`。

## 2026-09-28 · 第二轮输出评测与量测工具的缺陷（0.8.1）

- 6 份固定 brief × 两组（不装 skill、0.8.1），一格三个样本，36 份产物配成 18 组，三位模型评审盲评。0.8.1 赢了全部 6 份 brief、18 组里的 17 组、54 张评审票里的 49 张，但平均总分 4.11 对 3.83，只高 0.28，不到事先定好的 0.5。按规则仍是"没有明确差别"，数字照列。每次花费是 no-skill 的 2.0 倍（$3.17 对 $1.55）。
- **量测工具的缺陷**：`evals/tools/facts.mjs` 的取样点落在一帧最后一行像素上时（y = 899.55，帧高 900），命中测试返回空，工具把深底浅字叠到默认的白底上，给 02 样本 3 的 0.8.1 产物报了一条假的对比度失败（报 1.12:1，实测 16:1）。`396df58` 修复：取样点上移一行，命中测试没碰到文字就记"未测"，不再猜。
- **重测与重评**：用修好的工具把两轮全部 54 份产物重量了一遍，报出的事实只有这一条变了，首轮结果不受影响。受影响的那一组换三位新评审、用更正后的事实表重评（2:1 变成 3:0，两次都是 0.8.1 胜），作废的回复留在 `evals/runs/2026-09-27-r2/02-devtool-landing-en/judging/s3/superseded-facts-bug/`，不计入。
- **新工具**：`evals/tools/run_round.sh`（无头跑完一轮的设计运行，臂名可带样本后缀，运行期间阻止电脑休眠）、`run_judges.sh`（每位评审一个独立的无头会话，只能读自己的评审包）、`aggregate.py`（从评审的原始回复算出报告里的每个数字，支持一格多个样本）、`selftest.mjs`（用答案已知的夹具测 `facts.mjs`，CI 里运行）。
- 方法约定新增一条：事实表和设计稿一样要被怀疑。每条报出的失败，交给评审之前都对着它描述的那一帧看一眼。
- 过程、结果表、结论能说到哪一步和下一轮要改的见 [field/evals-2026-09-28.md](field/evals-2026-09-28.md)；英文完整报告在 `evals/runs/2026-09-27-r2/report.md`。

## 2026-09-28 · 交互与易用性（0.9.0）

- 主人要求从"交互组件好不好用：方便、舒心、快捷、高效"方向迭代设计 skill。先盘点：套件的地板（焦点、目标尺寸、加载时序、表单、空状态）已经扎实，缺的是**效率与行为**：没有任务交互成本的量法，组件的键盘模型和快捷键没有规则，中文输入法组字完全没人管，toast / tooltip / 组合框等组件的行为只写到"照 APG 做"。宿主复盘和评测里没有这方面的现场证据，所以这一版全部靠一手来源。
- 新增 6 份摘要：`nng-heuristics`（十条启发式、0.1 / 1 / 10 s、交互成本、命令命名与快捷键；backlog §4 第 2 项）、`wai-aria-apg`（键盘接口总则、组合框、菜单）、`ui-events-ime`（组字事件、`isComposing`、keyCode 229、Safari 事件顺序缺陷）、`klm-kieras`（KLM 操作时间与 M 的放置规则；原论文在付费墙后未读）、`rauno-interaction-details`（backlog §4 第 11 项）、`carbon-notification-tooltip`（官网页面过大，读的是 carbon-website 仓库源文件 @d8783ad）。`wcag-22` 补第 32 条（2.1.4 字符键快捷键）。
- 核对时的发现：MDN 页面写 `isComposing` "2026-09 新近可用"，用 web-features 3.40.0 与 BCD 8.1.3 复查属实（2026-09-14，Safari 27），并查到 Safari 10.1–26.6 的事件顺序缺陷说明——这正是"中文输入法选词回车就把消息发出去"的根源，结论 16。Rauno 文章的小节名第一次抓取给的是摘要式标题，重抓核对后改成页面上的实际标题。Carbon 与 NN/g 都没有给 tooltip 出现延迟的数值，延迟规则仍取自 emil-kowalski-animation #2。
- skill 改动：新增 `disciplines/interaction.md`；design-studio 路由表、阅读顺序、新算子 `streamline`；product-ui 加响应时间三档；ai-experience 输入框加输入法例外；system、desktop 指向 interaction；surface contract 加 Task cost 块，handoff-spec 的 Behaviour 节列出交互交付物；critique-design 的启发式第 2 节改为按截图计算任务成本，第 8 节加键盘、快捷键、输入法、toast / tooltip、"不在指针下移动"。主题 03 加结论 14–18。
- 未验证：这些规则还没有在任何宿主项目或评测里跑过。评测 brief 01（中文运维台）和 05（审批）是最接近的替身，第三轮可以把"任务成本块"和"输入法说明"列为事实检查项。

