# 06 设计系统与 token

> 元数据：更新于 2026-09-27 · 依据：dtcg-2025-10、design-md-spec、radix-colors-scale、web-baseline-2026、mcp-apps、openai-apps-sdk-ui、a2ui（旧摘要 dtcg-design-tokens-format、design-md-format 已被前两者取代）· 复核期限：2026-12-26

一句话：系统是“一次决定、处处复用”的那组决策。2026 年它有三种载体——给工具交换的 DTCG token（含 Resolver 主题模块）、给下一个 agent 读的 DESIGN.md、给浏览器的 `tokens.css`——外加一批只能容纳其中一部分的托管存储与宿主变量。本篇回答：分几层、主题怎么表达、DESIGN.md 管什么、怎么和别人的存储共处。

## 当前结论

1. **三层 token，引用单向。** 原始（无含义的色阶、间距阶）→ 语义（角色：`color.bg.surface`、`space.inset.md`）→ 组件（只在组件必须偏离时才有）。组件只读语义层；模式（浅 / 深 / 高对比 / 密度）只重映射语义层。暗色模式要改组件代码，说明缺了一个语义角色。DTCG Color 模块的非规范命名建议同样是 base / alias / component 三层。依据：dtcg-2025-10 #25、radix-colors-scale。一手资料 + 业内共识。
2. **色阶“位置即角色”。** Radix 把每条色阶固定为 12 级：1–2 背景、3–5 组件常态 / 悬停 / 按下、6–8 边框与焦点环、9–10 实色、11–12 文字；暗色与品牌主题只是换映射。Radix 保证 11 / 12 级在同色阶 2 级上达到 APCA Lc 60 / Lc 90——这是 APCA 口径，不是法规引用的 WCAG 2 比值，交付仍要算 WCAG 2 对比度。Sky、Mint、Lime、Yellow、Amber 的 9 级配深色文字。依据：radix-colors-scale #1–7。一手资料。
3. **DTCG 2025.10 是稳定版（2025-10-28），由 Format、Color、Resolver 三个模块组成。** 主题与模式的标准表达是 `.resolver.json`（sets + modifiers + resolutionOrder），不是 `$extensions`。它不是 W3C 标准轨道文档，但自称“稳定，后续以取代版发布”；2026-09-08 的预览草案明言勿实现、勿引用。token 文件扩展名 `.tokens.json`，媒体类型 `application/design-tokens+json`。依据：dtcg-2025-10 #1–4、#26–37。一手资料。
4. **主题族 × 模式 = 两个正交的 modifier。** 族文件只写原始色阶与结构（圆角、字号、表面处理），模式文件只把语义颜色角色以别名指向“当前族”的色阶。别名在集合合并之后（解析第 3 阶段）才求值，所以任何族自动获得任何模式，不需要 N×M 个文件；排列数是各 modifier 上下文数之积。密度若允许用户独立选择，就单独做一个只动间距与控件高度的 modifier，族文件不得再写这些 token。依据：dtcg-2025-10 #30–37、#41（Terrazzo 建议“每个 token 类型族一个 modifier”）。机制为一手资料，组织法为推论。
5. **工具链是硬约束（2026-09-27，易腐）。** 结论：`*.tokens.json` + `*.resolver.json` 是源，给 Figma 的是按模式降级的导出副本。依据：dtcg-2025-10 #40–43。一手资料。
   - Terrazzo ≥ 2.0：完整支持 2025.10，含 resolver 与 JSON Pointer `$ref`，按排列输出 CSS。
   - Style Dictionary 5.5.5：读对象颜色（≥ 5.3）与对象尺寸（≥ 5.4），**不读 resolver**，只能在外部解析后每个排列跑一次。
   - Tokens Studio 2.12.1：DTCG 模式仍写自有类型和字符串尺寸。
   - Figma 原生变量导入：一个文件 = 一个模式；只收 sRGB / HSL 颜色、px 尺寸、s 时长、单字符串字体；不收复合类型。
6. **DTCG 没有的类型。** spring、字体样式、百分比 / 不透明度、资源文件、字符串、布尔都没有；`transition` 说不出“动哪个属性、从哪到哪”；`gradient` 不区分线性 / 径向。弹簧参数放 `$extensions`（反向域名键）或成对的 `number` token。依据：dtcg-2025-10 #18–19。一手资料。
7. **DESIGN.md 描述系统，token 文件实现系统。** 规范版本仍是 `alpha`，0.4.0 是 CLI `@google/design.md` 的版本（2026-07-27）。front matter 的 token 为准，正文给理由；`lint` 有错误时退出 1；`diff` 在错误或警告增多时退出 1。`export` 有损：广色域被压成 sRGB hex、别名被展开、组件丢失、`em` 被写成非法 DTCG 单位、`lineHeight: 24px` 被写成 24 倍行高。永远不把 export 当 token 源。依据：design-md-spec #3、#20–25。一手资料 + 实测（CLI 探针）。
8. **lint 通过不等于文件有效。** 两个实测反例：重复的 `## Colors` 在规范里应拒收，0.4.0 却零发现、退出 0；正文里多个 `yaml` 围栏代码块出现同名顶层键时，解析器忽略**全部** token，lint 只给一条警告、仍退出 0。PHILOSOPHY 示例里的自定义 `motion:` 块在 0.4.0 报 `token-like-ignored`，并被所有导出丢弃。依据：design-md-spec #14–15、#19。实测。
9. **DESIGN.md 真正的价值在 PHILOSOPHY：“形容词描述一个区域，具体参照描述一个点。”** Overview 写一句具体参照（而不是“现代、简洁、可信”）；Do's / Don'ts 写能在截图上核对的规则（“小字只用于图注”，而不是“慎用小字”）；Colors 写频率预算（“主色 < 5%，每屏只给一个主操作”）。依据：design-md-spec #16–18；Figma Make 指南的“规则要可核对、给频率”见审计报告 research-skills §3.11（二手）。一手资料 + 业内资料。
10. **托管设计系统存储只能容纳系统的一部分。** Stitch 把系统压成一个种子色 + 配色变体 + 3 个枚举字体 + 4 档圆角，其余只存在 Markdown 里，项目默认值只作用于新生成的屏；Figma 变量丢复合类型与广色域；Claude Design、v0、Lovable、Figma Make 各有自己的存储格式。原则：**只有一个系统记录源**，其余都是投影；投影丢了什么，记进 decisions.md。依据：design-md-spec #26–30、dtcg-2025-10 #43；Claude Design / v0 / Lovable / Figma Make 见审计报告 research-skills §3.5、§3.12（二手）。一手资料（Stitch、Figma）/ 业内资料（其余）。
11. **宿主内 UI 的系统记录源是宿主。** 我们的语义角色必须能一对一映射到宿主变量名。依据：mcp-apps #10–11、openai-apps-sdk-ui #9–10、a2ui #10–11。一手资料。
    - MCP Apps：76 个标准 CSS 变量（背景 / 文字 / 边框各 10 个角色、ring 7 个、字体、字重、字号与行高、圆角、描边、阴影）；**间距刻意不主题化**；视图必须为每个用到的变量写回退值；宿主宜用 `light-dark()` 表达。
    - ChatGPT：系统字体；品牌色只上主按钮、徽标、图标。
    - A2UI：样式由渲染端设计系统决定；v1.0 候选版删除了 `theme` 与 `primaryColor`。
12. **CSS 落地的三个作用域事实。** 依据：web-baseline-2026 #13–17；②③ 于 2026-09-27 在 Chrome 153 实测复现。一手资料 + 实测。
    - ① 角色用 `light-dark()` 声明一次（Baseline 2024），`color-scheme` 选分支。
    - ② 未注册的自定义属性在使用处求值，嵌套的 `[data-theme=dark]` 能翻转 `:root` 声明的角色；用 `@property` 注册为 `<color>` 的角色在 `:root` 就算定，不再翻转。
    - ③ 值里含 `var()` 的派生 token 在声明它的元素上解析：族作用域覆盖了原始值却不重声明派生 token，就会沿用 `:root` 的旧值。
    - 另：`contrast-color()`（Baseline 2026）只返回黑或白，只“应当”满足 3:1，不能用来给正文配色。

## 论证

**为什么是三层、单向。** 原始层回答“有哪些值”，语义层回答“这个值在干什么”，组件层只装例外。把颜色直接写进组件，等于把“是什么”和“干什么”焊死：换暗色、换品牌、加高对比都要逐个改组件。单向引用让模式成为纯映射问题，也让漂移审计有了判据：组件里出现原始值即违规。组件 token 只在必须偏离时加——只用一次的 token 是多绕一步的魔法数。

**命名上的一处张力。** DTCG Color 模块建议有序色阶按 100 步进（100、200…），而 Radix 用 1–12。我们保留 1–12：它的序号本身就是角色契约（“第 9 级 = 最纯的实色”），换成 100 步进反而丢了这层含义。DTCG 这条建议是非规范的，不构成冲突，但交接时要写明。

**Resolver 怎么工作。** 一个 resolver 文件：`version` 必须是 `"2025.10"`（这是 resolver 模式的版本，不是你的系统版本）；`sets` 是有序来源列表，后者覆盖前者；`modifier` 是一组命名 `contexts` 加一个 `default`，至少 2 个上下文；输入是 `{"theme":"dark"}` 这样的字符串映射。解析分四步：校验输入 → 按 `resolutionOrder` 展平（每个 modifier 只取选中的上下文）→ 解析别名 → 输出。关键在第 3 步晚于第 2 步：模式文件可以引用族文件里才定义的色阶。正交性是非规范建议：两个 modifier 若写同一批 token（规范自己的反例是 theme 与 brand 都写 `color.button`），顺序就开始有意义，这是坏味道。规范示例本身有勘误：Example 14、17 把 `contexts` 写成了 `context`，不要照抄。

**0.7.0 主题族与 resolver 的关系。** 0.7.0 在不知道 resolver 已稳定的情况下，用 CSS `[data-family]` 作用域发明了族 × 模式。现在两者可以对齐：CSS 作用域是浏览器端的实现，resolver 是跨平台的交换表达，组织法相同（族管色阶与结构，模式管语义颜色）。当前模板 `tokens.resolver.json` 把族叫 `theme`、把浅深叫 `mode`，而 DTCG 规范示例里的 `theme` 指浅深，Terrazzo 也把旧的 `$extensions.mode` 映射成伪 modifier `tzMode`。名字可以保留，但必须在 system.md 里说清，免得和按规范示例理解的工具或同事对不上。

**DESIGN.md 与 token 文件的分工。** PHILOSOPHY 说“生成设计的质量更多取决于意图描述得多清楚，而不是数值多精确”，维护者甚至明言不接受往规范里加 token 要求；而实现需要的恰恰是精确值、别名和模式。两者并不矛盾：DESIGN.md 负责让下一个 agent 理解“为什么”，token 文件负责让构建系统拿到“是什么”。DESIGN.md 表达不了的（模式、动效、状态矩阵、对比度表、非目标）写在标准八节之后的散文章节里——规范要求消费方保留未知章节，这是安全扩展点——但只能是散文，不能是自定义 YAML 键（会被警告并在导出时丢弃）。DESIGN.md 要在构建之后按实际渲染重写一次：构建前写的规则书会被拿来和现实对抗。

**托管存储的现实。** 各平台都在做“agent 会读的设计系统存储”。它们的共同问题是容量：Stitch 只存种子主题，Figma 导入只收简单类型，谁都存不下族 × 模式。所以互通的正确姿势是“单一记录源 + 投影 + 记录损失”，回流时通过一次 DESIGN.md 编辑，并用 `design.md diff` 与预览渲染核对，而不是手工合并两个存储。宿主内 UI 是这一规则的极端情形：宿主不接受你的系统，只借给你它的变量；此时我们的系统退化为“到宿主变量的映射表 + 本地回退值”，间距仍归自己（MCP Apps 明言间距不主题化，因为“间距一变布局就坏”）。

**相对 2026-09-21 旧文（分析 07）改了什么、为什么旧说法错。**
- 旧文称“DTCG 的主题 / 解析器模块仍在演进”。**这是错的**：Resolver 与 Format 同属 2025-10-28 的稳定版。错因是当时只读了 Format 模块页和一份 README 级旧摘要，没有打开 TR 索引核对模块清单。后果是技能里写了“在主题模块被采纳前用 `$extensions` 存模式映射”，0.7.0 的主题族也是在不知道标准存在的情况下设计的。
- 旧摘要把 token 文件里的 `$schema` 当作规范的一部分。实际上官方 schema 自己注释“不是 DTCG 规范的一部分”；只有 resolver 文件定义了可选的 `$schema`。
- 旧文只读了 DESIGN.md 的 README，说 CLI 能 diff “散文回归”。实测 0.4.0 的 diff 只比 token，不含散文差异。旧文“不可表达的内容放进追加章节”的建议仍然成立，但要补一句“只能是散文”。
- 审计报告里“DESIGN.md 于 2026-04-23 开源”来自二手来源；一手资料是 2026-04-21 发布 0.1.0，仓库 2026-04-10 创建。
- 旧文仍然正确、予以保留的：Web 项目默认只需 `tokens.css`，有第二个消费平台再出 DTCG JSON，DESIGN.md 始终写；“先弃用再删除”（`$deprecated`）；匹配宿主已安装的工具链版本——现在补上了具体版本门槛。
- 旧文没有的：托管存储互通、宿主变量映射、PHILOSOPHY 的“点而非区域”、CSS 作用域的两个实测陷阱。

## 未决问题

- Figma 原生**导出**是否保留别名、`$extensions`、颜色空间，未测；各套餐的模式数量上限页面未列。
- `create_design_system_from_design_md` 如何把完整 DESIGN.md 映射成 Stitch 的种子主题（12 色调色板、自定义字体是否保留），未测——测试需要写入真实 Stitch 项目。
- Claude Design、v0、Lovable、Figma Make 的存储格式本轮没有一手复核（Claude Design 的 `/design-sync` 由技能流对照宿主工具核对过）；需要各补一份 source 摘要。
- Style Dictionary 维护者 2026-08-28、09-18 两次提出 resolver 配置方案，尚未发布；发布后工具表要改。
- DTCG Format 模块自相矛盾：§6.6 说工具“MAY”支持 JSON Pointer，§6.6.2 与 §7.1.2 说“MUST”；§6.6.2 的 `{"$ref":"#/base"}` 指向整个 token，§7.1.2 指向 `/$value`。建议值别名一律用花括号或 `/$value`。
- DESIGN.md 未合并的 PR（#176 组件子 token、#164 物理单位、#169 hypertokens、#177 导出补齐行高与字距）可能改变模板写法。
- 2026-09-08 的 DTCG 预览草案是否新增 spring、不透明度类型，未读全文。
- MCP Apps 各宿主实际下发 76 个变量中的哪些、取值为何，未抓取；A2UI v1.0 删除 `theme` 是否原样定稿。
- Terrazzo 的正交性检测对“族 × 模式 × 密度”三 modifier 结构的实际判定未跑过；CSS 作用域 ↔ resolver ↔ CSS 的往返也没有实做一次。

## 对 skill 的约束

- `skills/design-studio/references/process/system.md`（loop 第 6 步的唯一所有者；语法细节可拆到同目录的 `token-formats.md`，但每条规则只写一处）必须写明：
  - 三层与单向引用；“组件只读语义层”“模式只重映射语义层”两条作为判据；组件 token 仅用于偏离。
  - 系统记录源规则：宿主已有 DESIGN.md / token / 主题化组件库时就地更新，不另建 `.design/system/`；托管存储是投影，损失记入 decisions.md；回流走 DESIGN.md 编辑 + `diff` + 预览渲染。
  - 族 × 模式的组织法：族 modifier 只写原始色阶与结构，模式 modifier 只写语义颜色别名，密度独立时单独成 modifier 且族不写间距；解释模板里 `theme`（族）/ `mode`（浅深）的命名与 DTCG 示例、Terrazzo `tzMode` 的差异。
  - DESIGN.md 章节：spec `alpha` / CLI 0.4.0；写入时 `lint`、修改时 `diff`；export 有损且不是源；lint 通过不等于有效（重复标题、多个 yaml 块两个反例）；构建后按渲染结果重写。
  - 宿主内 UI：语义角色 → MCP Apps `--color-{background|text|border|ring}-{role}` 等 76 个变量的映射表，每个变量本地回退；间距不映射；ChatGPT 继承系统字体；A2UI 的视觉值只在渲染端（`--a2ui-*`）。
  - CSS 作用域两条实测陷阱（派生 token 在每个覆盖作用域重声明；切换模式的颜色角色不要用 `@property` 注册），以及 `contrast-color()` 只保证 3:1。
- `skills/design-studio/templates/tokens.resolver.json`：必须通过 resolver schema——`version: "2025.10"`、有 `resolutionOrder`、`contexts` 用复数、`default` 是上下文键之一、每个 modifier ≥ 2 个上下文、根键只含 name / version / description / sets / modifiers / resolutionOrder / `$schema`，不写 `$defs`；族与模式正交；可选示例一个独立的 `density` modifier。
- `skills/design-studio/templates/DESIGN.md`：保持八节顺序、定义 `primary`；每个字阶写全五个属性（无单位 `lineHeight`，`letterSpacing` 用 px 或 rem，以免导出非法 DTCG）；组件同时写 `backgroundColor` 与 `textColor`（让 lint 检查对比度），状态用同级键；不写自定义顶层 YAML，正文不放 yaml 围栏；Overview 一句具体参照；Do's / Don'ts 可核对；Colors 带频率预算；Motion、Modes and themes、Contrast、Not covered 作为追加的散文章节。
- `skills/design-studio/templates/tokens.css`：角色用未注册的自定义属性 + `light-dark()`；派生 token 在 `:root, [data-family]` 同时声明；可选一段宿主变量回退块（嵌入式目标用）。
- `skills/design-studio/references/fundamentals/color.md`：Radix 12 级角色映射作为默认语义层；DTCG 颜色对象（`colorSpace` + `components` + `alpha`，可选 6 位 `hex` 回退）；OKLCH 的 L 取 0–1 而非百分比；导出器自选色域映射，sRGB 回退要核对；APCA 与 WCAG 2 并列报告、不互相替代。
- `skills/design-studio/references/disciplines/motion-tokens.md`：DTCG 有 `duration`、`cubicBezier`、`transition`（三字段必填）而无 spring；弹簧进 `$extensions` 或成对 number；DESIGN.md 没有动效词汇。
- `skills/design-studio/references/process/handoff.md`：交接包列出系统记录源、`*.tokens.json` + `*.resolver.json`、所用 DTCG 版本与工具链版本（Terrazzo / Style Dictionary / Tokens Studio），Figma 副本注明降级内容。
- `skills/implement-design/references/stacks.md`：三条构建路径——Terrazzo resolver + permutations；Style Dictionary 5.5 + 外部 resolver 步骤、每排列一次；源在 Tokens Studio 时用 `@tokens-studio/sd-transforms`。
- `skills/critique-design/references/heuristics.md` 与 `skills/design-studio/scripts/lint.mjs`：`design.md lint` 的 JSON 只是证据输入之一，不代表无障碍或质量合格；漂移检查（token 文件外出现原始颜色 / 字号字面量）列为机械项。
- `skills/design-studio/scripts/color_tools.py`：`matrix --from tokens.css` 是对比度表的来源，DESIGN.md 的 Contrast 章节引用它的输出，而不是 lint 的组件对检查。

## 变更记录

- 2026-09-27 重写：由旧分析 07 迁入并全文重写。更正“Resolver 仍在演进”与“`$schema` 属于 token 文件规范”两处错误；新增 Color / Resolver 模块、族 × 模式的正交组织法、工具支持现状、DESIGN.md 规范全文与 CLI 实测（export 损失、lint 两个漏检反例）、PHILOSOPHY、托管存储与宿主变量互通、CSS 作用域实测；删除“易腐与耐久”“对最终 skill 的影响”等仪式性小节。
