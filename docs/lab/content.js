/* Design Skill Lab 设计方向实验室的共享内容层：所有风格从这里取文案与元数据。
   条目、小节、中文说明都来自生成文件 ../data/lab-catalog.js（scripts/build-catalog.py 写出），这里只放手写的页面级内容。
   文案里的数字不手写：{resources} {domains} {sections} {s} {shots} {skills} {styles} 由 app.js 启动时按数据填入，
   加 _zh 后缀（如 {domains_zh}）填中文数字。 */
window.CONTENT = {
  site: {
    name: 'Design Skill Lab',
    cn: '设计技能实验室',
    tagline: '{resources} 条逐条标记的设计资源 + 一套让 agent 像资深设计师一样工作的 skill',
    lede: '这个仓库做三件事：一份经过筛选和标记的设计资源目录；一套让 coding agent 完成"决定、出图、写规格、交接、验收"的 skill；以及保证仓库自身不漂移的脚本与证据。覆盖 Web、移动与桌面 App、动效、图标、品牌、平面。',
    pillars: [
      { k: 'catalog', t: '资源目录', d: '{resources} 条设计资源，逐条标了"适合查什么、怎么直达、授权、档位、agent 能否直接读到"，分 {domains} 个域。' },
      { k: 'suite', t: 'skill 套件', d: '三件 skill 让 agent 像资深设计师那样工作：design-studio 读需求、找参考、出方向、定系统、画全部状态；critique-design 换新会话评审；implement-design 照交接落地。' },
      { k: 'evidence', t: '证据与自检', d: '一手资料摘要、中文专题综述、机械校验脚本：对比度与色阶能算就不估，链接由脚本核验。' },
    ],
    repo: 'https://github.com/caocong1/design-skill-lab',
  },

  /* 公用在线字体：全部走 jsDelivr 上的 npm 包（国内可达），中文用中文网字计划的分包字体
     （只下载页面用到的 unicode 区段），拉丁用 fontsource。每个风格在 fonts 里列出要加载的包，
     外壳在挂载前注入 <link>；各风格的字体栈把这些 family 放在最前，CDN 不可达时自动落回系统字体。 */
  fonts: {
    cdn: 'https://cdn.jsdelivr.net/npm/',
    packs: {
      zhuyuan:    { css: ['@chinese-fonts/mkzyt@3.0.0/dist/猫啃珠圆体/result.css'], family: 'MaokenZhuyuanTi', zh: '猫啃珠圆体', license: 'OFL 1.1' },
      tangyuan:   { css: ['@chinese-fonts/mkwtyt@3.0.0/dist/MaoKenTangYuan/result.css'], family: 'MaoKenTangYuan (beta)', zh: '猫啃糖圆体', license: 'OFL 1.1' },
      hanserif:   { css: ['@chinese-fonts/syst@3.0.0/dist/SourceHanSerifCN/result.css'], family: 'Source Han Serif CN VF', zh: '思源宋体（可变）', license: 'OFL 1.1' },
      wenkai:     { css: ['@chinese-fonts/lxgwwenkai@3.0.0/dist/LXGWWenKai-Regular/result.css'], family: 'LXGW WenKai', zh: '霞鹜文楷', license: 'OFL 1.1' },
      smiley:     { css: ['@chinese-fonts/dyh@3.0.0/dist/SmileySans-Oblique/result.css'], family: 'Smiley Sans Oblique', zh: '得意黑', license: 'OFL 1.1' },
      inter:      { css: ['@fontsource-variable/inter@5/index.css'], family: 'Inter Variable', license: 'OFL 1.1' },
      archivo:    { css: ['@fontsource-variable/archivo@5/index.css'], family: 'Archivo Variable', license: 'OFL 1.1' },
      sourcesans: { css: ['@fontsource-variable/source-sans-3@5/index.css'], family: 'Source Sans 3 Variable', license: 'OFL 1.1' },
      condensed:  { css: ['@fontsource-variable/roboto-condensed@5/index.css'], family: 'Roboto Condensed Variable', license: 'OFL 1.1' },
      barlow:     { css: ['@fontsource/barlow-condensed@5/index.css', '@fontsource/barlow-condensed@5/600.css', '@fontsource/barlow-condensed@5/700.css'], family: 'Barlow Condensed', license: 'OFL 1.1' },
      nunito:     { css: ['@fontsource-variable/nunito@5/index.css'], family: 'Nunito Variable', license: 'OFL 1.1' },
      playfair:   { css: ['@fontsource-variable/playfair-display@5/index.css'], family: 'Playfair Display Variable', license: 'OFL 1.1' },
      garamond:   { css: ['@fontsource-variable/eb-garamond@5/index.css'], family: 'EB Garamond Variable', license: 'OFL 1.1' },
      baskerville: { css: ['@fontsource/libre-baskerville@5/index.css', '@fontsource/libre-baskerville@5/700.css'], family: 'Libre Baskerville', license: 'OFL 1.1' },
      courier:    { css: ['@fontsource/courier-prime@5/index.css', '@fontsource/courier-prime@5/700.css'], family: 'Courier Prime', license: 'OFL 1.1' },
      jetbrains:  { css: ['@fontsource-variable/jetbrains-mono@5/index.css'], family: 'JetBrains Mono Variable', license: 'OFL 1.1' },
      jost:       { css: ['@fontsource-variable/jost@5/index.css'], family: 'Jost Variable', license: 'OFL 1.1' },
    },
  },

  /* 各域在本页的名字、一句话定位、色相（色卡、贴纸、线路图等风格按色相编码）。
     色相与 catalog/taxonomy.json 一致，全站同一个域同一个颜色。域的顺序与数量以目录数据为准：
     这里没有的域（目录以后新增的）由 app.js 用数据自带的名字、导语和色相补上，各风格照常渲染。 */
  domains: {
    'web':     { zh: '网站设计', blurb: '营销站、落地页、作品集的画廊与模式库', hue: 18 },
    'app-ui':  { zh: '产品界面', blurb: '真实产品的界面、官方平台规范、公开的设计系统', hue: 42 },
    'dataviz': { zh: '数据可视化', blurb: '选图表的指引、图表库、仪表盘与大屏参考、数据色板', hue: 66 },
    'ai':      { zh: 'AI 设计', blurb: 'AI 产品的交互模式、生成工具，以及给 agent 用的 skill 与 MCP', hue: 90 },
    'a11y':    { zh: '无障碍', blurb: '标准与法规、检测工具、无障碍组件模式与适老化', hue: 114 },
    'motion':  { zh: '动效', blurb: '上线产品的动效实录、曲线与弹簧工具、官方指引', hue: 138 },
    'icons':   { zh: '图标', blurb: '图标家族、搜索与 API、品牌 logo、绘制指引', hue: 162 },
    'assets':  { zh: '视觉素材', blurb: '插画、3D、摄影、样机与代码生成的背景', hue: 186 },
    'brand':   { zh: '品牌', blurb: 'logo 档案、品牌评审、规范手册与命名工具', hue: 210 },
    'graphic': { zh: '平面', blurb: '海报、设计史档案、演示文稿与平面出版物', hue: 234 },
    'type':    { zh: '字体排版', blurb: '开源字体、厂商、用例、工具与中日韩字体排版', hue: 258 },
    'color':   { zh: '色彩', blurb: '色板灵感、感知均匀色阶工具与对比度校验', hue: 282 },
    'code':    { zh: '设计工程', blurb: 'agent 的画笔：组件库、动效与图形库、token 工具与渲染管线', hue: 306 },
    'reading': { zh: '阅读', blurb: '塑造这套方法的文章、书、课程与规范', hue: 330 },
    'general': { zh: '灵感社区', blurb: '跨学科浏览与收集：量大信号杂，取用后用真实产品验证', hue: 354 },
  },

  /* 当前套件（0.8.0）装给用户的三件 skill（仓库维护用的 iterate-design-lab 不随插件安装，这里不列）。
     各风格按 skills/<name>/SKILL.md 链到仓库。 */
  skills: [
    ['design-studio', '入口，接住一切设计意图：读懂任务、写 brief、找参考、按种子出几个真正不同的方向、定系统、画全部状态、渲染自查、交接'],
    ['critique-design', '在全新的子会话里评审：先凭判断，再拿机械证据（渲染、对比度、lint），按严重程度分级；也做设计验收'],
    ['implement-design', '已有设计稿或交接包时，在具体技术栈里忠实落地：映射 token、构建顺序、按截图验收'],
  ],

  usage: {
    install: [
      '# Claude Code：插件市场一次装好整套',
      '/plugin marketplace add caocong1/design-skill-lab',
      '/plugin install design-skill-lab@design-skill-lab',
      '# Codex 或手动：软链接整套（Codex 用 ~/.codex/skills）',
      'git clone --depth 1 https://github.com/caocong1/design-skill-lab',
      'cd design-skill-lab && mkdir -p ~/.claude/skills',
      'for d in skills/*/; do',
      '  ln -sfn "$PWD/${d%/}" ~/.claude/skills/"$(basename "$d")"',
      'done',
    ],
    prompts: [
      '给设备运维后台出一套完整设计，先给三个方向让我选。',
      '这是我们的官网，找几个参考，告诉我首屏和导航怎么改。',
      '给 Flutter 巡检 App 设计设备列表页，手机和平板各一版，再打包交接给开发。',
      '用 critique-design 走查这个页面，给带证据和优先级的评审报告。',
    ],
  },

  method: [
    ['渲染并查看', '没有渲染并看过的设计只是猜测；没验证的如实说没验证。这个页面的 {styles} 个方向迁入 lab/ 时（2026-09-27）在 1440 与 390 两个视口重新截图核对过。'],
    ['能算的不估', '对比度与色阶由脚本计算（WCAG 比值 + APCA），验链与缩略图的像素校验由脚本完成，不消耗模型额度。'],
    ['耐久与易腐分开', '感知、层级、排版写在 SKILL.md；平台规格、库 API、社媒尺寸放在带复核日期的参考里。'],
    ['已知局限', '档位是单人判断；字体效果以 macOS 为准，其他平台落到各自的系统字体；这是早期实验页，新版首页与资源目录在上一级。'],
  ],

  /* 各方向的方案板：概念、各轴取值、会在哪里失败。每个风格页必须在某处展示自己这张卡。
     num 是编号：1–10 对应数字键 1–9、0；11 起没有数字键，用 [ ] 前后切换、点入口，或用顶部横条的下拉。 */
  styles: [
    { id: 'swatch', fonts: ['inter'], num: 1, name: '色卡', en: 'Swatch Book',
      concept: '一本摊开的色卡样本册：界面自身克制，颜色全部花在{domains_zh}个域上——每个域是一枚可以抽出来的色签，颜色永远在传递信息。',
      axes: { 字体: '中性无衬线', 色彩: '纸白界面 + 域信息色', 版式: '色签扇 + 抽屉式目录', 密度: '中', 形状: '色签圆角', 层次: '抽出的色签投影', 动效: '色签翻动与抽拉' },
      risk: '最接近"工具默认长相"的一个；记忆点靠色签的物理感撑住。' },
    { id: 'swiss', fonts: ['archivo'], num: 2, name: '瑞士', en: 'Swiss Grid',
      concept: '把目录当一张国际主义海报来排：严格网格、巨大红色数字、黑白红三色，靠尺度与网格说话。',
      axes: { 字体: '粗无衬线', 色彩: '黑白 + 单一红', 版式: '海报网格 + 数字索引', 密度: '中', 形状: '零圆角', 层次: '粗线与留白', 动效: '网格滑入与数字滚动' },
      risk: '巨大的标题吃掉首屏，找东西要多滚一屏。' },
    { id: 'songban', fonts: ['hanserif', 'wenkai', 'garamond'], num: 3, name: '书目', en: 'Bibliography',
      concept: '一册刻本书目：宋体、竖排题名、界行、朱印，档位写作甲乙丙，像翻开《书目答问》。',
      axes: { 字体: '宋体 / 楷体', 色彩: '纸色 + 墨 + 朱', 版式: '竖排书口 + 界行列表', 密度: '中', 形状: '方', 层次: '文武边框', 动效: '钤印与展卷' },
      risk: '英文条目在宋体语境里出戏；竖排对读屏无益，正文保持横排。' },
    { id: 'terminal', fonts: ['jetbrains'], num: 4, name: '终端', en: 'Amber Terminal',
      concept: 'skill 本来就活在终端里：琥珀单色等宽字，整个页面是一台开机中的终端，目录可以用命令翻，也可以点。',
      axes: { 字体: '等宽', 色彩: '琥珀单色（深底）', 版式: '终端窗口 + 命令行', 密度: '最高', 形状: '零圆角', 层次: '虚线与亮度', 动效: '开机引导、打字机、扫描线' },
      risk: '长段中文在等宽字体里不好读；不熟悉命令行的人会觉得冷——所以一切都可以点。' },
    { id: 'blueprint', fonts: ['barlow'], num: 5, name: '蓝图', en: 'Blueprint',
      concept: '一张晒蓝的工程图：方格纸、图框、右下角图签；资源是零件明细表，档位是序号圈，线是自己画出来的。',
      axes: { 字体: '工业窄体', 色彩: '蓝底白线单色', 版式: '图框 + 明细表 + 图签', 密度: '高', 形状: '方 + 圆形标号', 层次: '线框', 动效: '线条自绘与尺寸标注' },
      risk: '蓝底长时间阅读疲劳；对比度余量比浅色方案小。' },
    { id: 'cards', fonts: ['courier'], num: 6, name: '卡片柜', en: 'Card Catalogue',
      concept: '图书馆的卡片目录柜：拉开一个域的抽屉，每条资源是一张打孔索引卡，打字机字体，红蓝栏线。',
      axes: { 字体: '打字机粗衬线', 色彩: '卡纸色 + 红蓝栏线', 版式: '抽屉柜 + 卡片格', 密度: '中低', 形状: '方卡打孔', 层次: '纸张微阴影', 动效: '抽屉滑出与翻卡' },
      risk: '卡片扫读比列表慢；{resources} 条时抽屉很深。' },
    { id: 'label', fonts: ['sourcesans'], num: 7, name: '展签', en: 'Museum Label',
      concept: '美术馆：截图是挂在墙上的展品，说明卡又小又克制，大量留白，一次只看一件。',
      axes: { 字体: '人文无衬线', 色彩: '近白 + 深灰', 版式: '展品墙 + 窄说明卡', 密度: '最低', 形状: '无', 层次: '无线无框靠留白', 动效: '缓慢的淡入与凝视' },
      risk: '信息密度最低，不适合天天来查的人；截图缺失的条目退化为纯文字展签。' },
    { id: 'console', fonts: ['condensed', 'jetbrains'], num: 8, name: '控制台', en: 'Control Console',
      concept: '机房值班台：深色面板、刻度条、等宽数字，域的分布与筛选状态一直挂在眼前。',
      axes: { 字体: '窄体 + 等宽数字', 色彩: '深灰蓝 + 单一青', 版式: '面板阵 + 仪表侧栏', 密度: '高', 形状: '方', 层次: '面板亮度分层，无发光', 动效: '扫描、电平表与数字跳变' },
      risk: '离"深蓝发光大屏"的套路只有一步，克制一松就滑过去。' },
    { id: 'sticker', fonts: ['zhuyuan', 'nunito'], num: 9, name: '贴纸', en: 'Sticker Wall',
      concept: '一墙贴纸：圆体粗字、粗黑描边、硬阴影，{domains_zh}个域各占一种亮色，按下去会"咔哒"，hover 会抖。',
      axes: { 字体: '在线圆体（猫啃珠圆体 + Nunito）', 色彩: '多色高饱和', 版式: '贴纸墙 + 色块抽屉', 密度: '中低', 形状: '大圆角 / 胶囊', 层次: '硬投影', 动效: '弹簧砸入、抖动与撕下' },
      risk: '这是一种已经流行过的风格（新粗野），两年后会显旧；对严肃读者显得轻佻。' },
    { id: 'plain', fonts: [], num: 10, name: '素页', en: 'Plain HTML',
      concept: '几乎不设计：浏览器默认的衬线、蓝色链接、表格线。最快、最耐久、最无障碍的一极。',
      axes: { 字体: '系统默认衬线', 色彩: '黑白 + 链接蓝', 版式: '单栏文档流', 密度: '中', 形状: '无', 层次: '无', 动效: '没有——这就是它的观点' },
      risk: '没有品牌记忆；有人会以为样式表没加载。' },
    /* 第二轮追加的五个方向：仍从这个主题的世界里取材——套件本来就要设计后台、
       活在设计工具与对话框里、研究字体、做导视。 */
    { id: 'admin', fonts: [], num: 11, name: '后台', en: 'Admin Panel',
      concept: '把目录当成一个真的管理后台来做：左侧导航树、面包屑、KPI 卡、能排序能翻页的数据表、状态标签、批量筛选表单。不追求新奇，追求"熟悉的东西做到最好"。',
      axes: { 字体: '系统 UI 字体', 色彩: '浅灰工作区 + 白面板 + 单一蓝', 版式: '侧栏 + 顶栏 + 表格', 密度: '高', 形状: '6px 小圆角', 层次: '1px 线，不用阴影', 动效: '几乎没有：只有行高亮与排序箭头' },
      risk: '它长得像每一个后台——这是有意的；识别度靠内容不靠皮。表格在手机上必须退化成列表。' },
    { id: 'canvas', fonts: [], num: 12, name: '画板', en: 'Design Canvas',
      concept: '设计工具的界面：左边图层面板、右边属性检查器、中间是无限画布，{domains_zh}个域是画布上的画框，资源是画框里的元件，点一下出现蓝色选框和尺寸标注。',
      axes: { 字体: '系统 UI 字体，11–12px 的工具字号', 色彩: '深灰工具栏 + 浅灰画布 + 选区蓝', 版式: '三栏工具窗 + 画布', 密度: '高', 形状: '2–4px 小圆角', 层次: '面板贴边，画布一层阴影', 动效: '选框出现、尺寸标注、缩放' },
      risk: '长得像某个具体产品，会被当成模仿；面板吃掉横向空间，窄屏必须收起。' },
    { id: 'chat', fonts: [], num: 13, name: '对话', en: 'Agent Chat',
      concept: '这套 skill 本来就住在对话框里：整页是一段线程，你的问题是气泡，agent 的回答把资源当引注 [1][2] 列出来，底部的输入框就是搜索框。',
      axes: { 字体: '系统 UI 字体', 色彩: '近白 + 一支墨绿', 版式: '单栏线程 + 固定底部输入', 密度: '中', 形状: '气泡圆角', 层次: '灰底区分角色', 动效: '流式打字、引注浮现' },
      risk: '用对话找东西比列表慢；假装在聊天是噱头，所以每条回答都可以直接点、直接扫。' },
    { id: 'specimen', fonts: ['inter', 'sourcesans', 'condensed', 'nunito', 'zhuyuan', 'playfair', 'hanserif', 'garamond', 'baskerville', 'courier', 'jetbrains', 'wenkai', 'jost', 'archivo', 'smiley'], num: 14, name: '字样', en: 'Type Specimen',
      concept: '一份字体样张：{domains_zh}个域各用一种字体的气质排出来（黑体、宋体、楷体、圆体、等宽、窄体……），大字看字形，小字看正文，每行标字号——把套件里"按气质选系统字体栈"那张表变成页面。',
      axes: { 字体: '多种字体气质并置（在线字体 + 系统回落）', 色彩: '纸白 + 墨黑，仅此', 版式: '样张行 + 字号瀑布', 密度: '中', 形状: '无', 层次: '细横线', 动效: '样字换字体' },
      risk: '并置多款字体正是排版的大忌——这里以"样张"为理由；字体来自 CDN，网络不通时落回系统字体，Windows 上会有几行落到同一款。' },
    { id: 'metro', fonts: ['sourcesans'], num: 15, name: '线路图', en: 'Metro Map',
      concept: '一张地铁线路图：{domains_zh}个域是{domains_zh}条彩色线路，小节是车站，资源是沿线的站点；导视字体、线路色标、换乘环——用导视系统的语言组织 {resources} 条资源。',
      axes: { 字体: '导视人文无衬线', 色彩: '白底 + {domains_zh}条线路色', 版式: 'SVG 线路图 + 竖向站点列表', 密度: '中', 形状: '圆端线条 + 圆形站标', 层次: '线宽与站标大小', 动效: '列车沿线行驶、站点亮起' },
      risk: '把目录比作线路图是拉伸了的比喻：站点很多的线会很长；色盲读者要靠编号而不是颜色。' },
    { id: 'island', fonts: ['zhuyuan', 'tangyuan', 'nunito'], num: 16, name: '小岛', en: 'Cute Island',
      concept: '一座低多边形小岛上的可爱 3D 小游戏（WebGPU 从零写起，没有引擎）：{domains_zh}个域是{domains_zh}座彩色小屋，你是一颗圆滚滚的小球，滚到门口就能进屋翻目录；S 首选在屋顶上亮着星星。套件本来就要设计游戏 HUD、3D 素材与沉浸式界面——这一页是它的美术指导、HUD 与动效一起落地。',
      axes: { 字体: '在线圆体（猫啃珠圆体 / 糖圆体 + Nunito）', 色彩: '糖果色低饱和 + 天空渐变，三段卡通光照', 版式: '全屏 3D 场景 + 游戏 HUD 面板', 密度: '低（场景）/ 中（面板）', 形状: '一切都是圆的', 层次: '硬阴影盘 + 轮廓光', 动效: '弹跳、摇摆、云飘、水波、屋子被靠近时"呼吸"' },
      risk: 'WebGPU 只在较新的浏览器里有（Chrome 113+、Safari 26+、Firefox 141+）——没有它就退化成 2D 小岛地图，内容照样能用；用游戏找东西是所有方向里最慢的，所以 HUD 里始终有直达列表。' },
  ],

  access: { free: '免费', freemium: '部分免费', paid: '付费' },
  reach: { static: '可直接抓取', js: '需要浏览器', blocked: '有防护或需登录', unknown: '未能核验' },
  tierNote: { S: '同类首选', A: '可靠', B: '小众或有短板' },
};
