/* Design Skill Lab page logic: catalogue filtering, URL state, and the style switcher.
   The catalogue data comes from the generated catalog.js (window.CATALOG). */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const root = document.documentElement;
  const REPO = 'https://github.com/caocong1/design-skill-lab';

  /* ---- styles: each entry is the card a direction carries on an options board ---- */
  const STYLES = [
    { id: 'swatch', name: '色卡', en: 'Swatch Book', concept: '一本可以翻的色卡：界面本身单色，颜色只花在十二个域上，所以颜色永远在传递信息。',
      axes: { 字体: '中性无衬线', 色彩: '单色界面 + 信息色', 版式: '侧栏 + 密集列表', 密度: '高', 形状: '小圆角', 层次: '细线，无阴影' }, risk: '最接近"工具默认长相"，记忆点只有那条色带。' },
    { id: 'swiss', name: '瑞士', en: 'Swiss Grid', concept: '把目录当海报排：严格网格、巨大数字、黑白加一个红，靠尺度对比说话。',
      axes: { 字体: '粗无衬线', 色彩: '黑白 + 单一红', 版式: '横向数字索引 + 三栏行', 密度: '中', 形状: '零圆角', 层次: '粗线分割' }, risk: '巨大的标题吃掉首屏，找东西要多滚一屏。' },
    { id: 'songban', name: '书目', en: 'Bibliography', concept: '目录学的"目录"：宋体、界行、朱印，档位写作甲乙丙，像一册刻本书目。',
      axes: { 字体: '宋体 / 旧式衬线', 色彩: '墨 + 朱', 版式: '竖排题名 + 界行列表', 密度: '中', 形状: '方', 层次: '文武边框线' }, risk: '英文条目在宋体语境里有些出戏；竖排题名对读屏无益。' },
    { id: 'terminal', name: '终端', en: 'Amber Terminal', concept: 'skill 本来就活在终端里：等宽、琥珀单色、方括号档位，一行一条。',
      axes: { 字体: '等宽', 色彩: '琥珀单色（深底）', 版式: '单列行式', 密度: '最高', 形状: '零圆角', 层次: '虚线框' }, risk: '长段中文在等宽字体里不好读；不熟悉命令行的人会觉得冷。' },
    { id: 'blueprint', name: '蓝图', en: 'Blueprint', concept: '一张晒蓝的工程图：方格纸、图框与图签，条目是明细表，档位是零件序号圈。',
      axes: { 字体: '工业窄体', 色彩: '蓝底白线单色', 版式: '图框 + 明细表', 密度: '高', 形状: '方 + 圆形标号', 层次: '线框' }, risk: '蓝底长时间阅读疲劳；对比度余量比浅色方案小。' },
    { id: 'cards', name: '卡片柜', en: 'Card Catalogue', concept: '图书馆的卡片目录柜：每条资源是一张索引卡，域是分隔页签，打字机字体。',
      axes: { 字体: '打字机粗衬线', 色彩: '卡纸色 + 红色栏线', 版式: '多列卡片', 密度: '中低', 形状: '方卡 + 打孔', 层次: '纸张微阴影' }, risk: '卡片网格扫读比列表慢；600 条时页面很长。' },
    { id: 'label', name: '展签', en: 'Museum Label', concept: '美术馆墙上的展签：窄栏、大量留白、人文无衬线，每条资源像一件展品的说明。',
      axes: { 字体: '人文无衬线', 色彩: '近白 + 深灰', 版式: '单窄栏', 密度: '最低', 形状: '无', 层次: '无线无框，靠留白' }, risk: '信息密度最低，不适合天天来查的人。' },
    { id: 'console', name: '控制台', en: 'Control Console', concept: '机房值班台：深色面板、角标、刻度条和等宽数字，筛选结果的分布一直挂在侧栏。',
      axes: { 字体: '窄体 + 等宽数字', 色彩: '深灰蓝 + 单一青', 版式: '面板式，侧栏带分布', 密度: '高', 形状: '切角感的方', 层次: '面板亮度分层，无发光' }, risk: '离"深蓝发光大屏"的套路只有一步，克制一松就滑过去。' },
    { id: 'sticker', name: '贴纸', en: 'Sticker', concept: '一墙贴纸：圆体字、粗黑描边、硬阴影、十二个域各占一种明亮的颜色，按下去会"咔哒"。',
      axes: { 字体: '圆体粗字重', 色彩: '多色高饱和', 版式: '色块导航 + 贴纸行', 密度: '中低', 形状: '大圆角 / 胶囊', 层次: '硬投影' }, risk: '这是一种已经流行过的风格（新粗野），两年后会显旧；对严肃读者显得轻佻。' },
    { id: 'plain', name: '素页', en: 'Plain HTML', concept: '几乎不设计：浏览器默认的衬线、蓝色链接、表格线。最快、最耐久、最无障碍的一极。',
      axes: { 字体: '系统衬线', 色彩: '黑白 + 链接蓝', 版式: '单栏文档流', 密度: '中', 形状: '无', 层次: '无' }, risk: '没有品牌记忆；有人会以为样式表没加载。' },
  ];

  const current = () => (STYLES.find((s) => s.id === root.dataset.style) || STYLES[0]);
  function renderStyleNote() {
    const s = current();
    $('#stylenote').innerHTML = `<h2>${esc(s.name)} <span style="font-weight:400;opacity:.7">${esc(s.en)}</span></h2>
      <p class="concept">${esc(s.concept)}</p>
      <dl>${Object.entries(s.axes).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <p class="risk">会在哪里失败：${esc(s.risk)}</p>`;
    document.querySelectorAll('#switcher button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.style === s.id)));
  }
  function setStyle(id) {
    if (!STYLES.some((s) => s.id === id) || id === root.dataset.style) return;
    const apply = () => { root.dataset.style = id; renderStyleNote(); };
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !calm) document.startViewTransition(apply); else apply();   // the one orchestrated moment
    try { localStorage.setItem('dsl-style', id); } catch (e) {}
    writeUrl();
  }
  $('#switcher').insertAdjacentHTML('beforeend', STYLES.map((s, i) =>
    `<button type="button" data-style="${s.id}" aria-pressed="false" title="${esc(s.en)}"><kbd>${(i + 1) % 10}</kbd>${esc(s.name)}</button>`).join(''));
  $('#switcher').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setStyle(b.dataset.style); });

  /* ---- catalogue ----------------------------------------------------------------- */
  const results = $('#results');
  if (!window.CATALOG) {
    results.innerHTML = '<div class="empty"><p>没有读到 <code>catalog.js</code>。在仓库根目录运行 <code>scripts/build-catalog.py</code> 生成它。</p></div>';
    renderStyleNote();
    return;
  }
  const { domains, resources } = window.CATALOG;
  const order = Object.keys(domains);
  const hue = (d) => Math.round((order.indexOf(d) * 360) / order.length + 18) % 360;
  const ZH = { web: '网站', 'app-ui': '产品界面', motion: '动效', icons: '图标', assets: '视觉素材', brand: '品牌', graphic: '平面', type: '字体与排版', color: '色彩', code: '代码与开源项目', reading: '阅读', general: '社区与聚合' };
  const KIND = { gallery: '精选画廊', 'pattern-library': '模式库', archive: '档案', feed: '每日聚合', community: '社区', tool: '工具', assets: '素材', library: '代码库', 'design-system': '设计系统', guideline: '规范', article: '文章', book: '书', course: '课程', blog: '博客', skill: 'agent skill' };
  const ACCESS = { free: '免费', freemium: '部分免费', paid: '付费' };
  const REACH = { static: '可直接抓取', js: '需要浏览器', blocked: '有防护或需登录', unknown: '未能核验' };
  const SKILLS = [
    ['design-studio', '入口：读懂任务、选模式、路由；角色边界、核心规则、共享参考、目录视图与脚本'],
    ['explore-design-directions', '写 brief，出 2–4 个真正不同的方向，方案板、比较与推荐，收敛'],
    ['find-design-inspiration', '按粒度选来源、解构参考、综合成可执行动作；竞品拆解、风格 DNA、趋势扫描'],
    ['design-product-ui', '屏幕、组件、流程与全部状态；各平台画框与惯例、后台与数据大屏、AI 产品界面'],
    ['design-marketing-sites', '落地页、官网、作品集：信息先于版式、Hero 策略、节奏、响应式重排'],
    ['build-design-system', 'token 三层、色彩与字体体系、组件规格、主题与暗色、DESIGN.md、token 漂移审计'],
    ['design-motion', '要不要动、怎么动；动效 token、规格表、可慢放的原型'],
    ['design-icons', '选图标家族、按规则补图标、自绘图标集、应用图标与 favicon'],
    ['design-brand-identity', '一页纸策略、概念方向、SVG 标志与测试、识别系统、品牌规范、重塑'],
    ['design-graphics', '海报、社媒图、OG 图、演示文稿、印刷物、生成式背景；从代码渲染'],
    ['critique-design', '带证据与分级的评审报告、设计验收；也是套件自身产出的把关'],
    ['handoff-design', '设计到开发的交接契约：验收图、可移植样稿、token、全状态规格、切图；之后只凭截图验收'],
    ['implement-design', '给实现者用：在具体技术栈里忠实落地，映射 token、构建顺序、截图比对'],
    ['iterate-design-lab', '维护本仓库：加资源、加来源、验链、改 skill'],
  ];

  const sTier = resources.filter((r) => r.tier === 'S').length;
  const fromUser = resources.filter((r) => r.origin.startsWith('user')).length;
  $('#summary').innerHTML = `目录现有 <strong>${resources.length}</strong> 条资源，分布在 <strong>${order.length}</strong> 个域；其中 <strong>${sTier}</strong> 条是该需求下的首选（S），<strong>${fromUser}</strong> 条来自用户提供的样例。`;
  $('#deck').innerHTML = order.map((d) => `<i style="--h:${hue(d)}"></i>`).join('');
  $('#skills').innerHTML = SKILLS.map(([n, d]) => `<tr><td><a href="${REPO}/blob/main/skills/${n}/SKILL.md"><code>${n}</code></a></td><td>${esc(d)}</td></tr>`).join('');
  $('#foot').textContent = `目录数据生成自 catalog/resources.jsonl，最近一条收录于 ${resources.map((r) => r.added).sort().pop()}。`;
  $('#kind').insertAdjacentHTML('beforeend', [...new Set(resources.map((r) => r.kind))].sort().map((k) => `<option value="${k}">${KIND[k] || k}</option>`).join(''));

  const fields = ['q', 'tier', 'kind', 'access', 'reach', 'lang', 'origin'];
  const state = { domain: '' };
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.domain = p.get('domain') || '';
    fields.forEach((f) => { $('#' + f).value = p.get(f) || ''; });
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (root.dataset.style !== 'swatch') p.set('style', root.dataset.style);
    if (state.domain) p.set('domain', state.domain);
    fields.forEach((f) => { const v = $('#' + f).value.trim(); if (v) p.set(f, v); });
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  const hay = new Map(resources.map((r) => [r.id, [r.name, r.best_for, r.how_to_use, r.license, r.url, r.tags.join(' '), KIND[r.kind], ZH[r.domain]].join(' ').toLowerCase()]));
  function match(r) {
    const v = (f) => $('#' + f).value.trim();
    if (v('tier') && r.tier !== v('tier')) return false;
    if (v('kind') && r.kind !== v('kind')) return false;
    if (v('access') && r.access !== v('access')) return false;
    if (v('reach') && r.agent_access !== v('reach')) return false;
    if (v('lang') && r.lang !== v('lang')) return false;
    if (v('origin') && !r.origin.startsWith(v('origin'))) return false;
    const q = v('q').toLowerCase();
    return !q || q.split(/\s+/).every((w) => hay.get(r.id).includes(w));
  }

  const row = (r) => `
    <li class="row" data-tier="${r.tier}">
      <h4><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>${r.lang !== 'en' ? `<span class="lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</span>` : ''}</h4>
      <p class="best">${esc(r.best_for)}</p>
      ${r.how_to_use ? `<p class="how">${esc(r.how_to_use)}</p>` : ''}
      <div class="meta">
        <span class="tier" data-t="${r.tier}" aria-label="档位 ${r.tier}">${r.tier}</span>
        <span class="kind">${KIND[r.kind] || r.kind}，${ACCESS[r.access]}${r.login ? '，需登录' : ''}</span>
        <span class="reach">${REACH[r.agent_access]}${r.updated !== 'active' ? (r.updated === 'archived' ? '，已停更' : '，更新慢') : ''}</span>
        ${r.license ? `<span class="lic">${esc(r.license)}</span>` : r.origin.startsWith('user') ? '<span class="user">用户提供</span>' : '<span></span>'}
      </div>
    </li>`;

  function bars(title, pairs, total) {
    return `<section><h2>${title}</h2>${pairs.map(([label, n]) => `<div class="bar" style="--v:${total ? n / total : 0}"><span>${label}</span><i></i><b>${n}</b></div>`).join('')}</section>`;
  }

  function render() {
    const pool = resources.filter(match);
    const counts = Object.fromEntries(order.map((d) => [d, 0]));
    pool.forEach((r) => { counts[r.domain]++; });
    const peak = Math.max(1, ...Object.values(counts));
    $('#domains').innerHTML = [`<li><button type="button" data-d="" aria-pressed="${!state.domain}" style="--h:250;--v:1"><span></span><span>全部</span><span class="n">${pool.length}</span></button></li>`]
      .concat(order.map((d) => `<li><button type="button" data-d="${d}" aria-pressed="${state.domain === d}" style="--h:${hue(d)};--v:${counts[d] / peak}"><span class="chip"></span><span>${ZH[d]}</span><span class="n">${counts[d]}</span></button></li>`)).join('');

    const list = pool.filter((r) => !state.domain || r.domain === state.domain);
    $('#count').textContent = list.length;
    const tally = (key, labels) => Object.entries(labels).map(([k, label]) => [label, list.filter((r) => r[key] === k).length]);
    $('#stats').innerHTML = bars('档位', [['S 首选', 0], ['A 可靠', 0], ['B 备选', 0]].map(([l], i) => [l, list.filter((r) => r.tier === 'SAB'[i]).length]), list.length)
      + bars('收费', tally('access', ACCESS), list.length) + bars('agent 可达', tally('agent_access', REACH), list.length);

    if (!list.length) {
      results.innerHTML = '<div class="empty"><p>没有符合这些条件的资源。试试放宽档位或可达性，或者换一个关键词。</p><button class="btn" type="button" id="reset2">清除全部条件</button></div>';
      $('#reset2').onclick = reset;
      return;
    }
    const rank = { S: 0, A: 1, B: 2 };
    let html = '';
    for (const d of order) {
      for (const sec of domains[d].sections) {
        const rows = list.filter((r) => r.domain === d && r.section === sec.id).sort((a, b) => rank[a.tier] - rank[b.tier]);
        if (rows.length) html += `<section class="group" style="--h:${hue(d)}"><h3><span class="chip" aria-hidden="true"></span><span class="t">${esc(sec.title)}</span> <span class="dom">${ZH[d]}</span> <span class="n">${rows.length}</span></h3><p>${esc(sec.note)}</p><ul class="rows">${rows.map(row).join('')}</ul></section>`;
      }
    }
    results.innerHTML = html;
  }

  const update = () => { writeUrl(); render(); };
  function reset() { state.domain = ''; fields.forEach((f) => { $('#' + f).value = ''; }); update(); $('#q').focus(); }

  $('#domains').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state.domain = b.dataset.d; update();
    $('#domains').querySelector(`[data-d="${state.domain}"]`)?.focus();
  });
  $('#tools').addEventListener('input', update);
  $('#reset').onclick = reset;
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
    else if (e.key === 'Escape' && document.activeElement === $('#q') && $('#q').value) { $('#q').value = ''; update(); }
    else if (!typing && /^[0-9]$/.test(e.key)) { const s = STYLES[(Number(e.key) + 9) % 10]; if (s) setStyle(s.id); }
  });
  window.addEventListener('popstate', () => { readUrl(); render(); });

  readUrl(); renderStyleNote(); render();
})();
