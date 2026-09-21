# 设计灵感与资源站点版图

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：本仓库资源目录 `catalog/resources.jsonl`（599 条，含用户 2026-09-20 提供的 15 个站点）与 2026-09-21 机械验链结果 ｜ 版本见 `analysis/SOURCE_INDEX.md`

这是本仓库第一篇**多来源综合型**分析：它不分析某一个站点，而是回答"设计师到底在用哪几类外部资源、每一类该怎么用、各自的偏差是什么"。用户最初给的 15 个站点（60fps.design、Navbar Gallery、Logobook、Component Gallery、Deck Gallery、Rebrand Gallery、Brand Guidelines、Minimal Gallery、A1 Gallery、Recent Design、One Page Love、Supahero、Grainient、Posts Design、YouWorkForThem）恰好覆盖了其中大部分类型，是很好的分类样本。

## 核心观点

- **资源的第一分类轴是"粒度"，不是"学科"。** 同样是找网页灵感，整站气质看精选画廊（Siteinspire、Minimal Gallery、A1）、页面叙事看落地页库（Land-book、Lapa、One Page Love）、单个区块看区块库（Supahero 的 hero、Navbar Gallery 的导航、Footer、Pricing）、单个组件看组件库（Component Gallery）、一段流程看真实产品截图库（Mobbin、Refero）、一个微交互看录屏库（60fps、Spotted in Prod）。问题的粒度决定去哪里找；粒度错了，找到的参考再好也用不上。
- **第二分类轴是"真实度"。** 精选画廊和获奖站展示的是"设计师欣赏什么"；真实产品库展示的是"什么真的上线了"；研究型来源（Baymard、NN/g、GoodUI）展示的是"什么被证明有效"。三者的结论经常相反。资深设计师每次至少混用两类。
- **第三分类轴是"易腐度"。** 趋势类聚合（Recent、Posts Design、Bento Grids、Dribbble）天然易腐，取用时要带日期；档案类（Logobook、Letterform Archive、Fonts In Use、Web Design Museum）和规范类（WCAG、clreq、APG）几乎不腐。
- **站点本身也在腐烂，而且不会通知你。** 2026-09-21 的验链在 607 个候选里发现：Godly 已重定向并入 Recent Design；Screenlane 与 UI Movement 重定向到 Page Flows；Scrnshts 并入 ScreensDesign；Lucide 图标设计指南、Cloudscape GenAI 模式、Spline 社区换了路径；Remix Icon 在 2026-01 从 Apache-2.0 改为自有许可。任何手工维护、不做机械核验的"设计导航"都会在一年内积累这类错误。

## 关键规则与数值

资源类型与用途（对应 `catalog/sections.json` 的分节）：

| 类型 | 代表 | 用来回答 | 主要偏差 |
| --- | --- | --- | --- |
| 精选整站画廊 | Siteinspire、Recent、Minimal、A1、Httpster | 这类站点现在长什么样、气质怎么定 | 偏代理商/作品集/SaaS 营销审美，是"做给设计师看的设计" |
| 落地页 / SaaS 库 | Land-book、Lapa、One Page Love、Saaspo | 页面怎么排序、各区块放什么 | 只看得到首版静态样子，看不到转化数据 |
| 区块 / 元素库 | Supahero、Navbar Gallery、Footer、CTA、Pricing、Really Good Emails | 同一个问题的十种解法 | 脱离上下文，容易拼出缝合怪 |
| 真实产品截图与流程 | Mobbin、Refero、Page Flows、UI Notes（国内） | 已上线产品怎么处理这个屏/这段流程 | 多数付费或需登录；只有成功产品 |
| 组件与规范 | Component Gallery、APG、各家设计系统 | 组件的解剖、状态、键盘行为 | 规范 ≠ 好看 |
| 平台官方规范 | Apple HIG、Material 3、HarmonyOS、微信小程序 | 平台惯例与硬性要求 | 随 OS 版本变化，多为 JS 站点，agent 抓不到 |
| 动效录屏 | 60fps、Spotted in Prod | 真实产品里东西怎么动 | 看不到参数，要自己估时长与缓动 |
| 品牌档案与评论 | Logobook、Brand New、BP&O、Rebrand Gallery、标志情报局 | 这个形已经被怎样解过；重塑怎么讲故事 | 幸存者偏差；评论多为事后合理化 |
| 规范文档集 | Brand Guidelines、Branding Style Guides | 一份品牌规范应该包含什么 | 大公司规范的体量不适合小团队 |
| 平面与历史档案 | Typographic Posters、Letterform Archive、Deck Gallery | 版式、栅格、字体作为图像 | 与屏幕媒介有距离，需要转译 |
| 素材与生成器 | Grainient、Haikei、fffuel、unDraw、Unsplash | 拿来就用的图形资产 | **授权**是主要风险；用得太多会同质化 |
| 字体 | Fontshare、Google Fonts、Fonts In Use、猫啃网、YouWorkForThem | 选什么字、在哪合法获得 | 试用版/个人免费版误用于商用 |
| 趋势聚合 | Recent、Posts Design、Sidebar、Codrops Collective | 此刻流行什么 | 高度易腐，极易导致跟风 |
| 代码与开源项目 | shadcn/ui、Motion、Style Dictionary、Satori、cn-font-split | agent 的设计媒介是代码，需要知道有哪些砖 | API 随版本变化 |

agent 可达性（2026-09-21 实测，599 条）：约 73% 可直接抓取（static），约 17% 需要真实浏览器（js），约 7% 有反爬或登录墙（blocked），约 3% 在维护者网络下不可达（unknown）。高价值来源恰恰集中在后两类（Mobbin、Land-book、Lapa、Siteinspire、Game UI Database、WCAG 速查均返回 403/429），所以 skill 必须教会 agent 在被拦时**换源或把链接交给用户**，而不是绕过防护。

## 易腐与耐久

- 耐久：按"粒度 × 真实度 × 易腐度"选源的方法；混用不同类型来源；参考的是原则而不是像素。
- 易腐：具体站点的存活、付费墙、授权与 URL 结构；趋势类站点里的一切内容。应对方式是机械验链加日期标注，而不是相信记忆。

## 对设计 agent 的启发

- 目录必须是**带标记的数据**（粒度/类型、可达性、授权、档位、活跃度），而不是链接清单；运行时视图由数据生成，才不会漂移。
- "怎么直达"比"是什么站"更有用：能确认的分类页、筛选参数、API 端点（Iconify、Simple Icons CDN、svgl API、WebAIM contrast API、jsDelivr 上各图标库的原始 SVG 路径）直接写进条目。
- 找灵感的产出不应是链接，而应是**可执行的动作**："重点色只花在主按钮上（见 X、Y）→ 你的后台现在链接、标签、按钮都用蓝色"。
- 日本站点画廊（SANKOU!、MUUUUU、81-web、Responsive JP）是中文版式最接近的高质量公开参考，这一点在英文世界的资源清单里几乎从不出现。
- 游戏 UI 数据库是数据大屏、HUD、沉浸式界面的最好参考源，同样属于"非这类网站"里的高价值发现。

## 注意

- 档位（S/A/B）是维护者的判断，不是客观指标，应随使用反馈调整；S 不应超过总量的四分之一左右（当前 131/599）。
- 本网络下 19 个站点 TLS 握手失败（Typewolf、Phosphor、Thinking with Type、Sidebar 等），它们大概率是网络路径问题而非站点死亡，目录中标为 `unknown`，不应据此删除。
- 国内"设计导航"类站点多数是 SEO/推广农场，目录只收了优设导航一个并注明含推广链接。

## 对最终 skill 的影响

- `catalog/resources.jsonl` + `catalog/sections.json` 作为单一事实来源，`scripts/build-catalog.py` 生成 `skills/design-studio/references/resources/*.md` 与 `docs/catalog.js`；`scripts/check-links.py` 机械写入 `agent_access`。
- `skills/find-design-inspiration/SKILL.md`：按粒度选源的表、"四类来源各取其一"的规则、被拦时不绕过、Bias Warnings 一节、产出为"动作"而非链接。
- `skills/design-studio/references/resource-map.md`：按需求路由到目录文件与分节，并解释 Access 列的含义与"不可达 ≠ 已死"。
- `skills/iterate-design-lab/SKILL.md`：`add-resource` / `link-check` 流程、收录门槛、档位纪律、重定向即并购信号的处理方式。
