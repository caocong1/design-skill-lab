# 实战记录：两个宿主项目的复盘（2026-09-24）

> 类型：field evidence（宿主项目反馈的提炼）· 事件时间：2026-09-24 · 整理：2026-09-27
> 原始材料：`feedback/archive/2026-09/` 下 15 条已归档反馈，以及 `feedback/log.md` 的两节处置记录。本篇不复制原文，只写发生了什么、skill 因此改了什么、改动有没有被验证。
> 匿名规则：宿主项目只按形态描述，不写产品名或客户名。原始反馈的 frontmatter 里还留着项目代号，由维护流程处理，本篇不引用。

## 两个宿主

- **宿主 A**：一个带 Office/WPS 加载项的 Web 业务系统。这一轮做了完整的 UI 优化，约 2 小时，用到 6 个以上 skill，中途有用户改向、agent 有意偏离指引、修复后又复发。需要登录的路由约 40 条，另有 320–480 px 宽的加载项任务窗格。
- **宿主 B**：一个需要登录的 AI 助手类 Web 应用。这一轮做了 UI 优化，外加多套可切换主题。

## 反馈是怎么来的

- 宿主 A 的会话里，agent 多次读到各 skill 末尾的反馈段，但**一条都没记**。11 条是事后由 evolve 第 0 步根据会话记录、宿主的 `decisions.md`、评审报告和提交补录的。另有一个机械原因：0.5.0 到 0.6.0 之间，反馈写入路径少上跳一级（解析到 `skills/` 而不是仓库根），就算 agent 想写也写不进来，0.6.1 修复。
- 宿主 B 跑在 0.6.1 之后。agent 在会话里记了 3 条，最终回复带着 `Skill feedback: 3 entries`。另外 1 条是主人的纠正，由主人在场的 evolve 会话录入。

## 逐条：发生了什么、改了什么、验证到哪一步

表中 `process/`、`disciplines/`、`casebook.md`、`feedback.md` 都在 `skills/design-studio/references/` 下，脚本在 `skills/design-studio/scripts/` 下。验证状态分四级：**已观察生效**（后来的真实运行里看到了预期行为）、**已落地未验证**（改动在文件里，但还没有后续运行检验过）、**部分落地**、**未落地**。

| 条目 | 宿主 · 类型 · 严重度 | 发生了什么 | 当时的改动 | 0.8.0 去向 | 验证状态 |
| --- | --- | --- | --- | --- | --- |
| close-out-retro-missing | A · friction · major | 长会话里一条反馈都没记，最终回复里也没有交代 | 0.5.1：收尾复盘三问（被纠正 / 偏离或绕开了指引 / skill 缺失或出错），最终回复以 `Skill feedback: N entries` 结尾，写进完成定义 | `skills/design-studio/references/feedback.md` 保留收尾复盘，改为静默、不阻塞；13 份复制的反馈段删掉，只在三个 SKILL.md 各留两行指针 | **已观察生效一次**：宿主 B 在会话中记了 3 条且格式合规。样本只有 1 个 |
| screenshot-evidence-traps | A · bug · major | 三条路由前后都被静默重定向，两轮评审都没真正看到；一个窗格截在"加载中…"；同一窗格前后宽度不同；"之前"截线上、"之后"截本地，出现假回归；全部 1x，也没有 brief 写明的宽度 | 0.6.0：截图陷阱四条（断言落地 URL 或就绪元素、前后同一环境、视口与倍率写进清单、尺寸取自 brief） | `process/render-and-look.md` 的陷阱清单；`skills/design-studio/scripts/capture.mjs` 把它变成机械检查：路由表的 `ready` 选择器、反爬 / 空白 / 报错 / 跳转登录页检测，任一失败即非零退出，另出 `capture-report.json` | 已落地未验证（宿主 B 的记录里没有提到截图陷阱是否被遵守） |
| verify-before-marking-fixed | A · bug · major | 头号问题还没修，评审报告里那一行就被改成"已修复"，独立评审发现三个主题下都仍然存在；同时出现回归：页面级 `background:` 简写冲掉了全局下拉箭头 | 0.6.0：P0/P1 必须在同样尺寸下重拍证据截图才能标记已修；简写属性冲掉全局控件样式列为反模式 | critique-design / implement-design 的验收规则；简写属性陷阱进 `casebook.md`（Host A） | 已落地未验证 |
| min-text-size-dense-cjk | A · friction · minor | 评审建议最小 12 px，实现用了 11 px，agent 事后把评审建议改成 11 px，也没写进 `decisions.md` | 0.6.0：高密度中文界面字号下限；已发出的评审建议不许事后改写，偏离要进 `decisions.md` | `disciplines/data-dense-ui.md`：表格、角标、脚注都不低于 12 px，低于它只能作为有理由的偏离记入 decisions.md；critique-design 的评审纪律 | **已观察生效一次**：`feedback/log.md` 记录宿主 B 执行了字号下限 |
| legacy-color-migration | A · missing · minor | 132 个文件里约 4000 处写死颜色；agent 有意偏离"组件不直接引用原始色阶"，先机械迁到色阶类，再整条色阶重映射；还得自己发明"颜色归哪个色系"的规则，很浅的带色背景被误归为中性灰，返工 | 0.6.0：认可两阶段迁移，写明色阶重映射的局限（状态色、分类色不随主题变）；辅助脚本没做 | `process/system.md` §9 漂移审计与遗留迁移（两阶段迁移）；`lint.mjs` 能清点实际用到的颜色并聚类近似值，但**不做色系归类** | **部分落地**：归色系辅助工具仍在待办（见 `research/backlog.md`） |
| critic-brief-manifest | A · friction · minor | 独立评审子 agent 花了约 31 分钟、23 万 token、105 次工具调用看约 110 张截图，抓到了全部回归，但交给它的只有几个目录通配符 | 0.6.0：交给评审一份清单（每对前后图对应的路由与尺寸、改过的组件、优先复查的 P0/P1） | `skills/critique-design/templates/critic-brief.md`（新鲜评审子 agent 拿到 brief、契约、截图清单，拿不到作者的推理） | 已落地未验证；0.8.0 评测里的新鲜评审会用到它 |
| embedded-host-panes | A · missing · major | 用户要求覆盖 Office/WPS 加载项任务窗格，套件没有任何指引。agent 自己摸索出：宽 320–480 px；跟随宿主的浅色外观；与 Web 不同源、存储不共享；内嵌 Chromium 渲染；Mac 上无法在真实宿主里验证；窗格与 Web 的 token 需要测试保证一致 | 0.6.0：平台参考新增"嵌入宿主的窗格"一节（证据等级 practice） | 按 0.8.0 结构归入平台参考的嵌入宿主一篇（Office/WPS 加载项、浏览器扩展、IDE 面板、对话宿主里的 MCP Apps / Apps SDK 组件） | 已落地未验证；**仍只有一次会话的经验，缺一手来源**（Office 加载项设计指南等，见 backlog） |
| existing-system-of-record | A · friction · minor | 同一个 agent 既设计又实现，宿主已有自己的 `DESIGN.md`；它跳过了 handoff 和灵感步骤，把 token 直接落进产品源码。skill 没说这些步骤什么时候可以省，照字面执行会把设计系统分叉 | 0.6.0：宿主已有 `DESIGN.md` / token 文件时原地更新；同一 agent 实现时，handoff 缩成验收截图清单 | design-studio SKILL.md 的产出契约：宿主的系统记录原地更新，不另建 `.design/system/` | 已落地未验证 |
| runner-up-directions-as-themes | A · preference · minor | 用户选了方向 A，又要把 B、C 也做成可切换主题。B 只换了颜色，丢掉了大部分个性，独立评审认为它和标准主题"几乎没区别" | 0.6.0：落选方向做成主题时，要写明主题保留了该方向的哪些特征，否则标为配色变体 | `process/directions.md` 第 11 步 Runners-up as themes；主题族机制在 `process/system.md` | **部分观察**：宿主 B 执行了"主题要有个性"，但也暴露出缺少主题族机制（下一条） |
| authenticated-route-sweep | A · missing · minor | 要给约 40 条需要登录、带种子 ID 的路由逐条截图，`shot.sh` 只接受单个 URL；agent 手写了登录辅助、路由表和截图脚本，还自己设置了 zh-CN 语言和 Asia/Shanghai 时区 | 进提案 P1，等第二个项目的证据 | **0.8.0 执行**：`capture.mjs` 支持 `--storage-state` / `--login-script`（登录一次、会话复用）、`routes.json` 路由表（id、path、ready、states）、视口 × 主题 × 状态、联系表 | 已落地未验证（脚本本身在实验室测过；还没在宿主里用过） |
| commit-curated-evidence | A · friction · nit | agent 把整个 `.design/shots/` 加进了 `.gitignore`，提交进仓库的评审报告指向不存在的截图 | 进提案 P2（涉及产出目录契约） | **0.8.0 执行**：产出契约新增 `.design/critique/<date>-<target>/`（报告 + 精选证据裁图，入库），批量截图放 `shots/` 并忽略 | 已落地未验证 |
| redesign-too-conservative | A 与 B · correction · major | 主人在两个宿主上做整体 UI 优化和多主题，结果都很保守：结构、交互不动，只打磨细节；主题只在配色、密度、圆角上变。两个宿主的 `decisions.md` 开头都是"结构不动"或"风险最低" | 0.7.0：redesign 改为功能拆解 → 脱离旧界面出方向 → 评审与资产盘点 → 收敛；四条结构轴；至少两个重构方向，细节修复是共享基线；"整体 UI 优化"默认按 redesign 处理 | `process/redesign.md`：功能地图（OOUX / ORCA）+ 结构轴 + **变更成本反向规则**（用户已习惯的结构是资产，每个结构改动都要说明它值得付出的学习成本）+ 平等性审计 + 迁移；依据 `ooux-orca`、`change-aversion` 两份来源 | **未验证**。审计指出 0.7.0 这条原则当时只靠一次主人纠正、没有任何文献支撑，而 change aversion 研究恰好主张相反方向的谨慎。0.8.0 补了来源和反向规则。效果留待评测 brief 06（重设计一个旧应用）和下一次真实重设计检验 |
| theme-families-scoping | B · missing · minor | 用户要多套可切换主题，宿主已有的主题族只差色相，等于换皮；skill 只讲模式（深色、高对比、密度），没讲作为个性的主题族；也没讲两个机制：结构 token 与颜色 token 分块，以便族能套在任意元素上（选择器里的实时小预览）；`:root` 上用 `var()` 派生的 token 在 `:root` 就解析了，不跟随嵌套作用域 | 0.7.0：Theme Families（全局 → 族结构 → 族 × 明暗颜色三层 token，按属性限定作用域，`var()` 派生 token 的作用域陷阱） | `process/system.md` 主题族；0.8.0 起用 DTCG 2025.10 的 Resolver 模块表达族 × 模式（模板 `tokens.resolver.json`，来源 `dtcg-2025-10`） | 已落地未验证 |
| authenticated-app-capture | B · missing · minor | 重设计一个需要登录的应用：`shot.sh` 不能登录，本地开发服务器也连不上真实后端。可行做法是 Playwright 保存登录态，"之前"截线上前端，"之后"用 `context.route` 把同源前端换成本地构建，两边用同一套真实数据和后端 | 0.7.0：`render-and-look.md` 工具梯级加"登录应用"一级（文字做法） | 登录与会话复用进了 `capture.mjs`；"本地前端 + 线上后端"仍是 `process/render-and-look.md` 里的文字做法，脚本没有内建 `context.route` | **部分落地** |
| after-capture-wrong-build | B · friction · minor | 修复后重拍时漏了本地构建参数，"之后"那组其实截的是线上旧构建；只因文件大小不对劲，才在看图前发现 | 0.7.0：每张截图带构建标记，先核对标记再看图 | `capture.mjs --build-stamp`：页面 HTML 里没有这段标记的截图一律判失败 | 已落地未验证（机械化了，但还没在宿主里跑过） |

## 跨条目的观察

1. **样本很薄。** 15 条来自 2 个项目、同一天。11 条是事后补录，不是会话里记的。这些结论都是"出现过一次"的证据，不是规律。
2. **偏向流程。** 约 10 条关于截图、验证和工作流。视觉质量本身几乎进不了这个回路，因为回路只记录 agent 或主人注意到的东西。这是 0.8.0 建评测（`evals/`）的直接理由之一：设计质量要靠盲评分数，不能靠自发反馈。
3. **机械化比写规则可靠。** 同一类问题（截错页、截到加载态、截错构建）在 0.6.0 和 0.7.0 都只写成了文字规则。0.8.0 把它们做进 `capture.mjs`，失败时直接非零退出。它是否真的减少了这类事故，要看下一个宿主项目。
4. **"已观察生效"只有两条**（收尾复盘、字号下限），而且各只有一次观察。其余改动都没有后续运行检验过。
5. **自动化从未真正跑过。** `feedback/evolve.log` 里只有 2026-09-23 的测试记录（inbox 为空、DRY_RUN）。0.8.0 的规则是：无人值守的 evolve 只产出提案分支，不直接改 Tier B。

## 这份记录如何更新

- 下一个宿主项目的收尾复盘，要回填上表"验证状态"一列：**observed-effective**（观察到生效）/ **not-observed**（该出现的场景出现了，但行为没变）/ **regressed**（回退）。回填请追加日期，不要覆盖旧状态。
- 新的宿主轮次另起文件：`research/field/<yyyy-mm>-host-retros.md`，并在 `research/log.md` 记一行。
- 某条经验在第二个独立项目里再次出现，就从 `casebook.md` 升级成它所属文件里的规则。这一步由实验室做，宿主会话不做。
