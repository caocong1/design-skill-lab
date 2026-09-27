# 02 AI 设计 skill 生态与本套件定位

> 元数据：更新于 2026-09-27 · 依据：impeccable、impeccable-slop-rules、taste-skill、ui-ux-pro-max、anthropic-frontend-design-skill、anthropic-design-skills、emil-kowalski-skills、emil-kowalski-animation、design-md-spec、vercel-web-interface-guidelines、openai-apps-sdk-ui、mcp-apps；另有几份未单独写摘要的一手页面，文中给出 URL，均于 2026-09-27 读取 · 复核期限：2026-12-26

本篇回答四个问题：别人是怎么做"会设计的 agent"的；本套件和他们重叠在哪里；真正的不同在哪里；0.8.0 借了哪些机制，为什么借。同类项目都在固定提交上通读了 SKILL.md 和参考文件，并由第二位读者核对过。星数和安装量是 2026-09-27 的读数，会过时。

## 当前结论

1. **所有项目都在解同一个问题：模型在没有指引时，会落到少数几种默认风格上。** 现在厂商文档自己把这件事写明了。Opus 4.8 指南点名了自家模型的默认风格：暖米白底（约 `#F4F1EA`）、衬线标题、斜体强调词、赤陶或琥珀色点缀。Sonnet 5 不接受非默认的 `temperature`，所以"先提出几个方向再动手"被官方列为让多次运行产生明显不同方向的推荐做法。（一手资料：anthropic-design-skills 事实 26–28）
2. **回避清单有用，但有保质期。** 泛泛地说"别用米色""要极简"，只会把模型推到另一套固定配色上（Opus 4.8、Sonnet 5 指南）。点名具体模式，看首轮结果用了什么，再把它补进清单，这在短期内有效（Opus 5.5 指南）。所以清单必须标明针对哪个模型、哪一天；它只能压住症状，产品的身份感要从题材和方向里来。（一手资料。这一条修正了两处旧说法：2026-09-21 版"靠清单回避不是设计方法"说得过于绝对；全面审计把厂商的话转述成"回避清单无效"，也不准确）
3. **"解药也会过期"已经被坐实，而且在加速。** 2025-11 被推荐为解药的做法（Space Grotesk、编辑感衬线、氛围渐变、错峰入场），到 2026-09 一条条变成了症状。各家的清单还互相矛盾：
   - taste-skill 把 Geist、Outfit 当作推荐默认，Impeccable 把 Geist 列为用滥字体、把 Outfit 列为训练数据默认；
   - Anthropic canvas-design 打包的字体里，有多款出现在 Impeccable 的名单上。

   能长期成立的只有判据，一个是"这个选择是否无论题材是什么都会出现"，另一个是 Anthropic 的反事实自查："用相似的提示再做一遍，看是不是落在同一个地方"。（一手资料）
4. **机制最完整的是 Impeccable v4.4（官网更新日志日期 2026-09-25）。** 它的构成：
   - 一个 skill：86 行 SKILL.md，38 个按需加载的参考文件，24 条命令；
   - 61 条确定性检测规则，外加 6 种只能靠评审判断的模式；
   - 用骰子分配方向；
   - 以设计稿（comp）驱动还原，并量化还原度：`comp-diff` 达到 72% 才算过关；
   - 全新上下文的收尾评审，给出四种处置结论；
   - 有界验证；
   - 在 Anthropic、OpenAI、Google 三家模型上跑行为测试。

   它的代价同样明显：依赖专有引擎二进制、在线骰子服务和匿名遥测；README 自己承认，模型的命令被拒绝后，钩子仍可能去下载引擎；文风冗长强硬；"眉标永远不行"这类绝对禁令，和它自己的"brief 优先"原则冲突。（一手资料：impeccable）
5. **装机量大的另外几家，各有一条值得借的机制，也各有一个结构性短板。**
   - Anthropic frontend-design：单文件，从题材出发，先写计划再对照 brief 自查，附五个带日期的风格聚类。短板是没有多方案、没有设计系统。
   - taste-skill：1,206 行单文件。三个旋钮的默认值 8/6/4 本身就是一种口味；官方设计系统映射表和"不许悄悄改变"清单值得借。
   - UUPM：CSV 数据表加 BM25 检索。数据治理做得好，但按行业查表，得到的必然是品类均值。实测中，它给 AI 产品配紫色和 Inter，给后台配深色玻璃拟态，中文查询直接回落到默认结果。

   （一手资料 + 实测：ui-ux-pro-max 事实 17–20）
6. **2026-09-21 版的定位已经不成立。** 当时的判断是"没有项目同时覆盖多方案、参考、系统、动效、图标、品牌、平面、评审、交接"。现在：
   - UUPM 有品牌、logo、CIP、banner、slides；
   - taste 有 brandkit 和生图；
   - Impeccable 有 iOS / Android 参考；
   - Emil 有带切换器的多变体原型和 mobile-native。

   按学科铺满，已经不是差异。（一手资料）
7. **本套件仍然独有的几点**（按证据从强到弱）：
   - 设计师与实现者分开，用可移植的 HTML 样机覆盖原生平台和国内平台（鸿蒙、小程序）。其他同类都是前端代码生成器。
   - 中文排版、中文字体授权和国内平台的深度。
   - 证据层（`research/sources` 带复核期限），以及标注了 agent 可达性的资源目录。
   - 从功能地图出发的重设计，加上变更成本的反向约束，有 ooux-orca、change-aversion 作依据。
   - 从实战中总结出来的截图陷阱清单。

   必须说清楚：前两点是"别人没做"，不等于"我们做得更好"，这一点还没有评测结果。（依据：全面审计 2026-09-27 的机制对照）
8. **本套件落后的地方：**
   - 没有编辑钩子；
   - 没有量化的设计稿还原；
   - 没有跨模型的行为测试；
   - 没有在宿主代码里实时切换变体、调旋钮的面板；
   - 没有和托管设计系统（Claude Design、v0、Lovable、Figma Make）的双向互通；
   - 装机量为零；
   - 评测框架已建好，还没有跑完一轮。

   （实测）
9. **平台方正在把设计系统做成 agent 可读的一手资产。**
   - v0 Design Systems 2.0：一个设计系统保存为 skill + starter app + `v0.json`。规则是"组件、属性、token 无法从来源核实就不用"。保存前停下来等人审核，更新时复查 starter，防止退化（https://v0.app/docs/design-systems-2 ，2026-09-27）。
   - Stitch：读取 `.stitch/DESIGN.md`，但存下来的只有种子色、配色变体、3 个枚举字体和 4 档圆角（design-md-spec 事实 28）。
   - Figma MCP：可以写画布，beta 期间免费，以后按用量收费（https://github.com/figma/mcp-server-guide ，2026-09-27）。
   - Codex：自带 `image_gen`，默认用它生成和编辑图片（https://github.com/openai/skills 的 `.system/imagegen/SKILL.md`，2026-09-27）。

   含义有两点。本套件的系统产物要能和这些宿主互通，不能另起一套格式。生图已经是宿主的默认能力，应该给它一条可选的、记录出处的通道。（一手资料）
10. **设计理由必须对照渲染结果核查。** "Design Theater" 研究（arXiv 2607.22928，2026-07-24）测了 5 个生成式 UI 工具，共 120 个界面：超过 25% 的设计理由没有体现在界面上，功能需求有 34% 没有实现。凡是要求"写出理由"的套件，本套件也在内，都要做这项核查。（一手资料）
11. **0.8.0 的借用原则：拿机制，不拿文风、不拿默认值、不拿锁定。** 具体清单见下文采纳表。

## 论证

### 解药也会过期：时间线

| 时间 | 来源 | 被当作默认或症状的东西 | 当时给的出路 |
| --- | --- | --- | --- |
| 2025-11-12 | Anthropic 配套文章 | Inter、Roboto、白底紫色渐变、几乎没有动效；已点名模型会收敛到 Space Grotesk | 按气质挑特色字体（Space Grotesk、Playfair、Newsreader 等），字重 100/200 对 800/900，字号跳 3 倍以上，氛围渐变，一次编排好的错峰入场 |
| 2026-02-17 | Anthropic cookbook 最后更新 | 同上 | 按气质推荐字体，例如"Startup：Clash Display、Satoshi、Cabinet Grotesk" |
| 2026-05 | taste-skill v2 成为默认安装 | Inter 作默认、AI 紫、奶油底配黄铜的"高端消费"配色（附具体 hex 族） | 推荐 Geist、Outfit、Cabinet Grotesk、Satoshi；全面禁用 em dash 和 en dash |
| 2026-06-09 | frontend-design 修订 | 聚类 1–3：米色 + 衬线 + 赤陶；近黑 + 荧光点缀；报纸式细线版式 | "一个你能为之辩护的审美冒险" |
| 2026-09-03 | frontend-design 现行版 | 新增聚类 4–5：SaaS 卡片套件、与题材无关的模板装饰；把自家的 `#D97757` 点名为症状 | 不再推荐任何具体字体，改为从题材取材，写完计划后对照 brief 自查 |
| 2026-09 | Opus 4.8 / Sonnet 5 / Opus 5.5 提示指南 | 4.8 点名自家默认风格；5.5 的示例清单：米白底、标题斜体强调词、01/02/03 编号、等宽标签、胶囊按钮 | 给出具体规格，或者先出 4 个方向；点名具体模式，看首轮结果再补充清单 |
| 2026-09-25 | Impeccable `/slop` | 按年代切换：2022 紫渐变、玻璃、霓虹 → 2025 米色、编辑感标签、装饰性动效 → 2026 "GPT 式新粗野"（粗边框、硬投影、贴纸徽章）；`OVERUSED_FONTS` 含 Inter、Geist、Space Grotesk、Fraunces、Instrument Serif 等 | 能确定判断的交给检测器，其余交给评审 |

机制是 Anthropic 文章所说的"分布收敛"：模型从训练数据的高概率中心采样，把它从一个中心推开，它会落到下一个局部最大值。一年后又多了三种加速因素：

- 各家 skill 的推荐本身成了新的默认；
- 各家清单相互矛盾；
- skill 自带的素材也会变成默认，比如 canvas-design 打包的字体。

本仓库也有一个现成的例子：2026-09-23 实验室页面的"贴纸"方向，当时就承认它离新粗野只差一步，而 Impeccable 的 2026 年代恰好点名了新粗野。

对套件的推论有四条：

1. skill 里不写任何具体的推荐字体或配色，只教选择的方法。
2. 带日期、注明模型的清单可以作为短期辅助，放在 `anti-slop.md`，每份写明针对的模型和日期。
3. 发散靠流程：真随机的种子、隔离的子代理。
4. 身份感在评审和评测里统一用"与题材无关"来检验。

### 同类横评（固定提交，全文阅读）

| 项目（读到的版本） | 核心机制 | 值得借 | 不借或短板 |
| --- | --- | --- | --- |
| Impeccable（repo@9d715cc，skill 4.4.0） | 事实文件三件套；访客模式；骰子；comp 驱动还原；收尾评审；检测器 + 钩子；有界验证；行为测试 | 命名车辙；7 个参照跨 ≥3 个材料族；排除模型自己最先想到的两个候选；经典出口；四种处置；有界验证 | 在线骰子服务与遥测；专有引擎；长段落与"违约"措辞；绝对禁令 |
| Anthropic frontend-design（@41bbe19，2026-09-03） | 设定人设；从题材出发；两遍式流程；五个带日期的聚类；文案一节 | 反事实自查；"结构即信息"（编号只用于真正的顺序）；CTA 的名字贯穿整个流程 | 没有多方案、设计系统、平台规范 |
| Anthropic 其他设计 skill 与 skill-creator（@3337550） | canvas-design 先写设计哲学再画，第二遍只精修不加东西；algorithmic-art 用种子产生变体；theme-factory 查表；skill-creator 带基线运行、盲评、触发评测 | 种子是探索的单位；盲评比较器；触发评测用 60/40 训练 / 留出，每条跑 3 次 | theme-factory 和 brand-guidelines 的查表是反例；全大写施压；打包字体 |
| taste-skill（@ce26fc2） | 一句话 design read；三旋钮；官方设计系统映射；重设计协议；62 项预检；先生图再写码 | 官方设计系统的诚实规则（"没有官方 liquid-glass.css"）；"不许悄悄改变"清单；SEO 基线 | 默认 8/6/4；全禁 em dash（和中文破折号"——"冲突）；锁定 React 与 Tailwind；生图还原度靠自评 |
| UUPM v2.15（@823b0a1） | CSV + BM25；MASTER.md + 页面覆盖；风格生命周期 | active / deprecated 带替代 id；"不持久化未经核实的输出"；新鲜度 365 / 90 天 | 按行业查表 = 均值；没有 CJK 分词；各处版本号不同步 |
| Emil Kowalski skills（@d16ebe6，13 个） | 动效评审十条 + Block / Approve；Before \| After \| Why 表；给"零上下文、零品味"执行者的计划模板；原型变体 + 固定外观的切换器；91 个术语的反查词表；quick / standard / deep 三档力度 | 评审格式；计划模板；变体必须各占一条命名轴；词表 | 手动触发专用（`disable-model-invocation`）的设置，不适合需要被子代理调用的评审 |
| DESIGN.md（规范 "alpha"，CLI 0.4.0，@9bf8eae） | YAML token + 固定章节；lint 11 条规则；diff 出现退化时退出码为 1；export | "形容词描述一片区域，具体参照描述一个点"；写入时 lint，改动时 diff | export 有损：广色域被压成 sRGB，别名被展开，`em` 生成非法的 DTCG；没有动效和模式词汇 |
| Vercel Web Interface Guidelines | 评审时现场拉取 `command.md` | 易腐规则在运行时获取 | 只管工艺 |

### 重叠与差异，诚实版

- **重叠：** 从题材出发、反套路判据、多方案、设计系统、评审、品牌和平面、原生平台参考。这些各家都有，本套件在这里不占优势。
- **差异：** 设计师与实现者的分工，加上可移植样机；中文与国内平台；证据层和资源目录；以功能地图为起点的重设计。这些之所以独有，部分原因是同类项目的出发点都是"生成前端代码"。
- **热度（2026-09-27，skills.sh 安装量，出自全面审计的读数）：**

  | skill | 安装量 |
  | --- | --- |
  | Anthropic frontend-design | 926.5K |
  | Vercel web-design-guidelines | 670.1K |
  | taste | 524.5K |
  | UUPM | 372.3K |
  | emil-design-eng | 300.7K |
  | Impeccable | 295.8K |

  GitHub 星数：UUPM 130,871，taste 90,402，Impeccable 71,605，awesome-design-md 118,191，design.md 28,119。本套件没有已知的公开安装。星数只能说明"设计 skill"是热门品类，不代表质量。

### 0.8.0 采纳什么，为什么

| 机制 | 来源 | 为什么 | 落在哪 |
| --- | --- | --- | --- |
| 14 个 skill 收成 3 个，另加 1 个维护 skill | Impeccable（常驻部分很小，深度按需加载）；skill-creator 的触发评测 | 关键变量是常驻描述的长度和必读文件链，不是 skill 个数。v1 的 14 段描述约 2.1k token，还互相抢触发 | 三个 SKILL.md；`evals/triggers.jsonl` |
| 事实文件三件套：`PRODUCT.md` / `DESIGN.md` / `surfaces/<surface>.md`（含访客模式与方向契约） | Impeccable；UUPM 的 MASTER + 页面覆盖 | v1 的 `brief.md` 把产品事实和本轮的 design read 混在一起；方向决定写下后，没有人拿渲染结果去对照 | `process/truth-files.md`、`templates/` |
| 用一句具体参照，代替形容词加语气滑杆 | design-md-spec PHILOSOPHY | 形容词会把模型推向中心 | `truth-files.md`、`directions.md` |
| 发散引擎：命名车辙 → 7 个参照 → `seed.py` 掷骰 → 每个方向一个子代理 → 方案板 → 经典出口 | Impeccable 的骰子；Anthropic"先出选项"；gpt-taste 在提示里模拟随机，恰好说明需要真脚本 | 采样固定时，多样性只能来自流程；在同一个上下文里连续生成的方向会互相靠拢 | `process/directions.md`、`scripts/seed.py`、`templates/options-board.html` |
| 评审：全新上下文；先判断后看机械证据；先求覆盖再筛选；严重度 × 证据基础；四种处置与有界轮数；Before \| After \| Why | Impeccable 的 critique 与收尾评审；Sonnet 5 指南；AccessLint（全面审计）；Emil；skill-creator 盲评 | 作者给自己打分不可信；检测器的输出会锚定评审者的判断 | `critique-design/*` |
| 有界验证：一轮批量截图 → 一批修复 → 最多一轮确认，然后如实披露 | Impeccable | v1 的完成定义没有上限，会引出没完没了的自检 | `process/render-and-look.md` |
| 确定性 lint | Impeccable 检测器的阈值；DESIGN.md lint | 能算的不要估。SEED-002 的触发条件永远不会满足，因为套件没有使用遥测 | `scripts/lint.mjs` |
| 可选的生图通道：记录出处，不交付 comp 的裁切 | Impeccable comp 驱动；taste 生图先行；Codex 默认 `image_gen` | 宿主默认就能生图；但"模型系统性地以为自己用代码还原图像成功了，其实没有"，所以 HTML 仍是契约媒介 | `process/image-generation.md` |
| 操作词：bolder、quieter、distill、harden、clarify、typeset、recompose、colorize、delight | Impeccable 的命令表 | 让迭代方向能说出口 | `SKILL.md` |
| 交接即执行计划：现有代码逐字引用、目标值写全、给一个范例、写清边界、代码漂移就停、机械验证加手感验证 | Emil 的计划模板；shadcn/improve（全面审计） | 执行者可能是更便宜的模型 | `process/handoff.md`、`templates/handoff-spec.md` |
| 重设计的"不许悄悄改变"清单，加 SEO / 埋点基线 | taste §11.F；change-aversion | 0.7.0 的激进化需要反向约束 | `process/redesign.md` |
| DESIGN.md 写入时 lint、改动时 diff，export 视为有损 | design-md-spec | 和 Stitch 等宿主互通 | `process/system.md` |
| 评测：三臂盲评 + 两两偏好 + 理由对照渲染 + 含近似反例的触发评测 | skill-creator；Design Arena 的形式；Design Theater | 没有评测，所有"更好"都无法证明 | `evals/` |
| 目录生命周期 active / slow / archived / sunset | UUPM | 目录要知道哪些东西已经过时 | `catalog/` |

**明确不借的：**

- 在线骰子服务与遥测：`seed.py` 完全离线。
- 专有引擎。
- 编辑钩子：推迟。以后要做，也必须是用户自己开启、只在本地运行、不下载任何东西、可以审计。
- 绝对禁令。
- 旋钮默认值。
- 按行业查表出方案。
- 打包的字体集。
- 全大写施压。
- 运行时拉取易腐规则：0.8.0 改用 `review_by` 加 gates。
- 宿主代码内的实时切换器和旋钮面板：先用一个能直接打开的静态方案板。
- 按模型家族手写"已用掉"清单：要先有评测数据。

### 2026-09-21 以来改了什么，旧观点错在哪里

- **阅读深度。** 从读 README 改为在固定提交上通读 SKILL.md 和参考文件，并由第二位读者核对。旧版自己也承认 taste 只读了 140 行、UUPM 没读 CSV。
- **事实更正：**
  - Impeccable 的规则数：46 → 61 + 6 = 67；
  - taste：一个文件 → 13 个 skill（默认的仍是 1,206 行单文件）；
  - UUPM：67 / 161 → 79 种可检索风格 / 192 条推理规则；
  - DESIGN.md："alpha，只有 lint 和 diff" → 规范仍是 alpha，CLI 0.4.0 已有 export 和 spec；
  - 补上 Anthropic 的其他设计 skill 与 skill-creator 评测闭环、Emil 的套件、各平台的设计系统存储。
- **"不做单文件巨型 skill，要入口路由 + 子 skill"找错了变量。** Impeccable 用单个 skill 加按需参考做到了领域最强。0.8.0 收为 3 个 skill。
- **"不做按行业查表"得到了证实。** 这次不再是推断，而是实测了 UUPM。
- **"反套路要教判据，清单要标日期"保留。** 补充两点：清单按模型分开；采用 Opus 5.5 的"首轮后补充清单"做法。

## 未决问题

- **要不要上编辑钩子**，在编辑后自动跑 lint？收益是即时发现问题，风险是在宿主里越权行事。
- **实时切换器或旋钮面板**（Emil prototype、Anthropic playground），要不要作为 `options` 的第二种形态？
- **按模型的渲染先验**，即各模型家族"已经用掉"的风格清单，应该由多样本评测测出来，而不是手写。评测每格至少要 3 个样本才能做。
- **托管设计系统的互通深度。** Claude Design、v0、Lovable、Figma Make 是否原生读取 DESIGN.md，未核实（design-md-spec 的未决项）。
- **本地策展参照库。** Impeccable 在线概念目录的规模和质量没有读到，本套件离线的 `seed.py` 没有"挑战者"目录，要不要自己策展一份本地参照库，未定。
- **差异能否转化为更好的产出**，要等第一轮评测。评测里的一个偏差来源要预先承认：身份感维度的"与题材无关"判据，本套件自己也在教。
- **Design Theater 的 25% 能否外推。** 研究对象是 5 个生成式 UI 工具，这个比例放到由 skill 驱动的通用 agent 上是否成立，未知。
- **参考库 MCP**（Mobbin、Refero）只核实到搜索结果层面；安装量数字出自 skills.sh 页面，还没有单独写摘要。

## 对 skill 的约束

- `skills/design-studio/SKILL.md`：
  - `description` 控制在约 900 字符以内，包含中英文触发词和一句 "Not for"；
  - 写入操作词表和三档力度；
  - 模式名保持不变；
  - 写明"brief 的原话永远优先"。
- `skills/design-studio/references/fundamentals/anti-slop.md`：
  - 以"无论题材都会出现"为总判据，配合反事实自查；
  - 收录三份带日期的清单：Anthropic 2026-09-03 的五个聚类、Impeccable 2026-09 的 67 条与年代切换、Opus 4.8 / 5.5 指南里的示例，每份注明模型和日期；
  - "解药也会过期"一节引用本篇时间线；
  - 不写任何推荐字体名，不引入 em dash 禁令；
  - 写明 Opus 5.5 的做法：先看首轮结果，再补充清单。
- `skills/design-studio/references/process/directions.md`：
  - 车辙三行；
  - 7 个参照，至少跨 3 个材料族；
  - 用 `seed.py` 决定领头方向；
  - 方向卡至少包含背景 hex、强调色 hex、字体和一句理由；
  - 经典出口永远不作推荐；
  - 每个方向在隔离的子代理里生成；
  - 做缩略图测试。
- `skills/design-studio/scripts/seed.py`：
  - 用 sha256(`scope:salt:key`) 生成随机数，除以 2^32（不是 2^32−1，避免 u = 1.0 的边界情况）；
  - 离线运行，无遥测；
  - 种子写入 `decisions.md`。
- `skills/design-studio/references/process/image-generation.md`：
  - 每张位图都记录出处；
  - 不交付 comp 的裁切；
  - 按区域对照还原度；
  - 能力较弱的模型走代码通道。
- `skills/design-studio/references/process/system.md`：
  - 写明 DESIGN.md 是"规范 alpha / CLI 0.4.0"；
  - 写入时 lint，改动时 diff，export 是有损的，不能当 token 源；
  - 写明 Stitch 会把系统降维，以及 v0 的"无法从来源核实就不用"规则。
- `skills/design-studio/references/platforms/embedded-hosts.md`：OpenAI plugin UI 的四种展示形态和数量上限（openai-apps-sdk-ui），MCP Apps 的主题变量（mcp-apps）。
- `skills/critique-design/SKILL.md`、`references/rubric.md`、`templates/critic-brief.md`：
  - 给评审的输入包里不放作者的推理过程；
  - 先判断，再看 lint 结果；
  - 先求覆盖，再筛选；
  - 理由逐条对照渲染结果，标为"已证实 / 被反驳 / 无法核查"；
  - Identity 维度用"与题材无关"来测。
- `research/sources/`：同类项目每季度按固定提交重读一次（本篇复核期限 2026-12-26）。另外补写三份摘要：skills.sh 目录、v0 Design Systems、Design Theater 论文。

## 变更记录

- 2026-09-27 重写：
  - 由旧分析 02（2026-09-21，1.1）迁入，根据新的同类摘要全部重写。
  - 保留："解药也会过期"与"无论题材都会出现"这两条判据。
  - 更正："没有项目覆盖全部学科"的定位；Impeccable、taste、UUPM、DESIGN.md 的过期事实；"清单无效"的绝对说法。
  - 新增：厂商按模型公布的默认风格；平台方设计系统存储；Design Theater；重叠与差异对照；0.8.0 采纳表与不借清单。
- 2026-09-21 1.1（旧分析 02）：补充 v0 与 impeccable.cn，新增"解药也会过期"一节。
- 2026-09-21 1.0（旧分析 02）：首版横评。
