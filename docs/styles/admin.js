/* 风格 11 · 后台 Admin Panel
   版式：左侧导航树 + 顶栏面包屑 + 工作区（KPI 卡、筛选表单、数据表、分页）。
   动效：几乎没有——行高亮、排序箭头、展开导航。熟悉的东西做到最好。 */
(function () {
  'use strict';
  DSL.register('admin', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PAGE = 50;
  const rank = { S: 0, A: 1, B: 2 };
  // 表格本地状态：排序键与方向、当前页。切换视图时归零。
  const ui = { sort: 'tier', dir: 1, page: 1, open: '' };

  function tierTag(t) {
    const zh = { S: '首选', A: '可靠', B: '备选' }[t] || t;
    return `<span class="ad-tag ad-tag-${t}"><i></i>${t} ${zh}</span>`;
  }
  function accessTag(ctx, a) { return `<span class="ad-tag ad-tag-acc-${a}">${esc(ctx.accessZh(a))}</span>`; }
  function reachCell(ctx, r) {
    const zh = ctx.reachZh(r.agent_access);
    return `<span class="ad-reach ad-reach-${r.agent_access}"><i></i>${esc(zh)}</span>`;
  }
  function dist(d) {
    const c = { S: 0, A: 0, B: 0 };
    d.sections.forEach((s) => s.items.forEach((r) => { c[r.tier]++; }));
    return c;
  }

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    const cover = Math.round((ctx.totals.shots / ctx.totals.resources) * 100);
    el.innerHTML = `
    <div class="ad-app">
      <aside class="ad-side" id="ad-side">
        <div class="ad-brand">
          <span class="ad-brand-mark" aria-hidden="true">D</span>
          <span class="ad-brand-text"><b>Design Skill Lab</b><small>资源目录管理台</small></span>
        </div>
        <nav class="ad-nav" aria-label="导航">
          <p class="ad-nav-h">工作台</p>
          <a href="#ad-main" class="ad-nav-i" data-domain="" data-nav="overview"><i class="ad-ic ad-ic-home"></i>总览</a>
          <p class="ad-nav-h">资源目录 <span>${ctx.totals.resources}</span></p>
          ${ctx.domains.map((d) => `
            <div class="ad-tree" data-tree="${d.id}">
              <div class="ad-nav-row">
                <a href="#ad-main" class="ad-nav-i ad-nav-dom" data-domain="${d.id}"><i class="ad-dot" style="--h:${d.hue}"></i><span>${esc(d.zh)}</span><em>${d.count}</em></a>
                <button type="button" class="ad-tw" data-toggle="${d.id}" aria-label="展开 ${esc(d.zh)} 的小节" aria-expanded="false"></button>
              </div>
              <div class="ad-sub">
                ${d.sections.filter((s) => s.items.length).map((s) => `<a href="#ad-sec-${s.id}" class="ad-nav-s" data-domain="${d.id}" data-sec="${s.id}">${esc(s.zh)}<em>${s.items.length}</em></a>`).join('')}
              </div>
            </div>`).join('')}
          <p class="ad-nav-h">套件</p>
          <a href="#ad-skills" class="ad-nav-i"><i class="ad-ic ad-ic-box"></i>skill 套件<em>${ctx.totals.skills}</em></a>
          <a href="#ad-usage" class="ad-nav-i"><i class="ad-ic ad-ic-doc"></i>使用说明</a>
          <a href="#ad-method" class="ad-nav-i"><i class="ad-ic ad-ic-check"></i>方法与局限</a>
          <p class="ad-nav-h">外观</p>
          <div class="ad-themes" role="group" aria-label="页面风格">
            ${ctx.content.styles.map((s) => `<a class="ad-theme" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''}><i></i><b>${String(s.num).padStart(2, '0')}</b><span>${esc(s.name)}</span><small>${esc(s.en)}</small></a>`).join('')}
          </div>
        </nav>
        <div class="ad-side-foot">
          <span>MIT · 商标归各自所有者</span>
          <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </aside>

      <div class="ad-body">
        <header class="ad-top">
          <button type="button" class="ad-burger" id="ad-burger" aria-label="打开导航" aria-expanded="false"><i></i></button>
          <nav class="ad-crumb" aria-label="面包屑" id="ad-crumb"></nav>
          <label class="ad-search"><i class="ad-ic ad-ic-search"></i><input id="ad-q" type="search" placeholder="搜索名称、用途、标签…" aria-label="搜索资源" autocomplete="off"><kbd>/</kbd></label>
          <div class="ad-top-r">
            <a class="ad-btn" href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
            <span class="ad-avatar" aria-hidden="true">DS</span>
          </div>
        </header>

        <main class="ad-main" id="ad-main">
          <div class="ad-pagehead" id="ad-pagehead"></div>

          <section class="ad-kpis" aria-label="概览指标">
            <div class="ad-kpi"><span>资源总数</span><b>${ctx.totals.resources}</b><small>${ctx.totals.domains} 个域 · ${Object.keys(ctx.content.sections).length} 个小节</small></div>
            <div class="ad-kpi"><span>S 首选</span><b>${ctx.totals.s}</b><small>占 ${Math.round((ctx.totals.s / ctx.totals.resources) * 100)}%，同类首选</small></div>
            <div class="ad-kpi"><span>截图覆盖</span><b>${cover}%</b><small>${ctx.totals.shots} 条有首页截图</small></div>
            <div class="ad-kpi"><span>skill</span><b>${ctx.totals.skills}</b><small>1 个入口 + 12 个子 skill + 维护</small></div>
          </section>

          <section class="ad-panel ad-filters" role="search" aria-label="筛选">
            <div class="ad-panel-h"><h2>筛选</h2><span id="ad-filter-note"></span></div>
            <form class="ad-form" id="ad-form">
              <label>档位<select id="ad-tier"><option value="">全部</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select></label>
              <label>收费<select id="ad-access"><option value="">全部</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select></label>
              <label>agent 可达<select id="ad-reach"><option value="">全部</option><option value="static">可直接抓取</option><option value="js">需要浏览器</option><option value="blocked">有防护或需登录</option></select></label>
              <label>语言<select id="ad-lang"><option value="">全部</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select></label>
              <div class="ad-form-act"><button type="button" class="ad-btn" id="ad-reset">重置</button></div>
            </form>
          </section>

          <div id="ad-view"></div>

          <section class="ad-panel" id="ad-board">
            <div class="ad-panel-h"><h2>当前风格 · ${esc(b.name)} ${esc(b.en)}</h2><span>方案卡</span></div>
            <dl class="ad-desc">
              <div class="ad-desc-wide"><dt>概念</dt><dd>${esc(b.concept)}</dd></div>
              ${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
              <div class="ad-desc-wide"><dt>会在哪里失败</dt><dd class="ad-warn">${esc(b.risk)}</dd></div>
            </dl>
          </section>

          <section class="ad-panel" id="ad-skills">
            <div class="ad-panel-h"><h2>skill 套件</h2><span>${ctx.totals.skills} 个 · 设计师，不是前端工程师</span></div>
            <div class="ad-tablewrap"><table class="ad-table ad-table-skills">
              <thead><tr><th style="width:56px">#</th><th style="width:240px">skill</th><th>职责</th><th style="width:96px">操作</th></tr></thead>
              <tbody>${ctx.content.skills.map(([n, d], i) => `<tr><td class="ad-num">${String(i + 1).padStart(2, '0')}</td><td><code>${n}</code></td><td>${esc(d)}</td><td><a class="ad-link" href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener">SKILL.md ↗</a></td></tr>`).join('')}</tbody>
            </table></div>
          </section>

          <div class="ad-two" id="ad-usage">
            <section class="ad-panel">
              <div class="ad-panel-h"><h2>安装</h2><span>Claude Code / Codex</span></div>
              <pre class="ad-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
            </section>
            <section class="ad-panel">
              <div class="ad-panel-h"><h2>装好后直接说</h2><span>示例提示词</span></div>
              <ol class="ad-prompts">${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
            </section>
          </div>

          <section class="ad-panel" id="ad-method">
            <div class="ad-panel-h"><h2>方法与局限</h2></div>
            <dl class="ad-desc">${ctx.content.method.map(([t, d]) => `<div class="ad-desc-wide"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
          </section>

          <footer class="ad-foot">Design Skill Lab · 原创内容 MIT · 截图仅供索引预览 · <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a></footer>
        </main>
      </div>
      <div class="ad-scrim" id="ad-scrim" hidden></div>
    </div>`;

    bind(el, ctx);
  }

  /* ---- 表格 ------------------------------------------------------------------ */
  function sortItems(items) {
    const k = ui.sort, dir = ui.dir;
    const cmp = {
      tier: (a, b) => rank[a.tier] - rank[b.tier] || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
      kind: (a, b) => a.kind.localeCompare(b.kind) || rank[a.tier] - rank[b.tier],
      access: (a, b) => a.access.localeCompare(b.access) || rank[a.tier] - rank[b.tier],
    }[k] || ((a, b) => 0);
    return [...items].sort((a, b) => cmp(a, b) * dir);
  }
  function th(key, label, w) {
    const on = ui.sort === key;
    return `<th${w ? ` style="width:${w}"` : ''}${on ? ` aria-sort="${ui.dir > 0 ? 'ascending' : 'descending'}"` : ''}><button type="button" class="ad-th" data-sort="${key}">${label}<i class="ad-arrow${on ? (ui.dir > 0 ? ' up' : ' down') : ''}"></i></button></th>`;
  }
  function head(withDomain) {
    return `<thead><tr>
      ${th('name', '名称', withDomain ? '24%' : '27%')}
      <th>说明</th>
      ${withDomain ? '<th style="width:88px">域</th>' : ''}
      ${th('kind', '类型', '92px')}
      ${th('access', '收费', '84px')}
      <th style="width:112px">agent 可达</th>
      ${th('tier', '档位', '92px')}
      <th style="width:64px">操作</th>
    </tr></thead>`;
  }
  function row(ctx, r, withDomain) {
    const dom = ctx.domains.find((d) => d.id === r.domain);
    return `<tr>
      <td class="ad-c-name">
        ${r.shot ? `<img class="ad-thumb" src="${r.shot}" alt="" loading="lazy">` : '<span class="ad-thumb ad-thumb-none" aria-hidden="true"></span>'}
        <span><a href="${esc(r.url)}" target="_blank" rel="noopener" class="ad-name">${esc(r.name)}</a>${r.lang !== 'en' ? `<em class="ad-lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</em>` : ''}${r.login ? '<em class="ad-lang">需登录</em>' : ''}
        <small>${esc(r.license ? (r.license.length > 40 ? r.license.slice(0, 40) + '…' : r.license) : '')}</small></span>
      </td>
      <td class="ad-c-desc">${esc(ctx.zh(r))}</td>
      ${withDomain ? `<td><button type="button" class="ad-link" data-domain="${r.domain}">${esc(dom ? dom.zh : r.domain)}</button></td>` : ''}
      <td><span class="ad-tag ad-tag-kind">${esc(ctx.kindZh(r.kind))}</span></td>
      <td>${accessTag(ctx, r.access)}</td>
      <td>${reachCell(ctx, r)}</td>
      <td>${tierTag(r.tier)}</td>
      <td><a class="ad-link" href="${esc(r.url)}" target="_blank" rel="noopener">打开 ↗</a></td>
    </tr>`;
  }

  function renderDomains(ctx) {
    const peak = Math.max(...ctx.domains.map((d) => d.count));
    return `<section class="ad-panel">
      <div class="ad-panel-h"><h2>资源目录 · 按域</h2><span>${ctx.totals.domains} 个域 · 点击进入</span></div>
      <div class="ad-tablewrap"><table class="ad-table">
        <thead><tr><th style="width:48px">#</th><th style="width:150px">域</th><th>定位</th><th style="width:80px">条目</th><th style="width:220px">档位分布 S / A / B</th><th style="width:72px">小节</th><th style="width:64px">操作</th></tr></thead>
        <tbody>${ctx.domains.map((d, i) => {
          const c = dist(d);
          return `<tr class="ad-rowlink" data-domain="${d.id}" tabindex="0">
            <td class="ad-num">${String(i + 1).padStart(2, '0')}</td>
            <td><span class="ad-domname"><i class="ad-dot" style="--h:${d.hue}"></i>${esc(d.zh)}</span></td>
            <td class="ad-c-desc">${esc(d.blurb)}</td>
            <td class="ad-num"><b>${d.count}</b></td>
            <td><span class="ad-bar" style="--w:${(d.count / peak).toFixed(3)}" title="S ${c.S} · A ${c.A} · B ${c.B}"><i class="S" style="flex:${c.S}"></i><i class="A" style="flex:${c.A}"></i><i class="B" style="flex:${c.B}"></i></span><small class="ad-bar-n">${c.S} / ${c.A} / ${c.B}</small></td>
            <td class="ad-num">${d.sections.filter((s) => s.items.length).length}</td>
            <td><button type="button" class="ad-link" data-domain="${d.id}">查看 →</button></td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>
    </section>`;
  }

  function renderDomain(ctx, d) {
    return `<section class="ad-panel">
      <div class="ad-panel-h"><h2>${esc(d.zh)}</h2><span>${d.count} 条 · ${d.sections.filter((s) => s.items.length).length} 个小节</span></div>
      <div class="ad-tablewrap"><table class="ad-table">
        ${head(false)}
        ${d.sections.filter((s) => s.items.length).map((s) => `
          <tbody id="ad-sec-${s.id}">
            <tr class="ad-group"><th colspan="7" scope="rowgroup"><b>${esc(s.zh)}</b><span>${s.items.length}</span><em>${esc(s.note)}</em></th></tr>
            ${sortItems(s.items).map((r) => row(ctx, r, false)).join('')}
          </tbody>`).join('')}
      </table></div>
    </section>`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<section class="ad-panel"><div class="ad-panel-h"><h2>查询结果</h2><span>0 条</span></div>
      <div class="ad-empty"><p>没有符合条件的资源。</p><button type="button" class="ad-btn" data-reset>清除全部条件</button></div></section>`;
    const all = sortItems(v.groups.flatMap((g) => g.items));
    const pages = Math.max(1, Math.ceil(all.length / PAGE));
    ui.page = Math.min(Math.max(1, ui.page), pages);
    const slice = all.slice((ui.page - 1) * PAGE, ui.page * PAGE);
    return `<section class="ad-panel">
      <div class="ad-panel-h"><h2>查询结果</h2><span>共 ${v.total} 条 · ${v.groups.length} 个域</span></div>
      <div class="ad-tablewrap"><table class="ad-table">${head(true)}<tbody>${slice.map((r) => row(ctx, r, true)).join('')}</tbody></table></div>
      ${pager(all.length, pages)}
    </section>`;
  }
  function pager(total, pages) {
    if (pages <= 1) return `<div class="ad-pager"><span>共 ${total} 条</span></div>`;
    const p = ui.page;
    const nums = [];
    for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - p) <= 2) nums.push(i);
    const parts = [];
    nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) parts.push('<span class="ad-pg-gap">…</span>'); parts.push(`<button type="button" class="ad-pg${n === p ? ' on' : ''}" data-page="${n}"${n === p ? ' aria-current="page"' : ''}>${n}</button>`); });
    return `<div class="ad-pager">
      <span>共 ${total} 条 · 每页 ${PAGE} 条</span>
      <div class="ad-pg-list">
        <button type="button" class="ad-pg" data-page="${p - 1}"${p === 1 ? ' disabled' : ''} aria-label="上一页">‹</button>
        ${parts.join('')}
        <button type="button" class="ad-pg" data-page="${p + 1}"${p === pages ? ' disabled' : ''} aria-label="下一页">›</button>
      </div>
    </div>`;
  }

  /* ---- 面包屑 / 页头 / 导航态 ------------------------------------------------- */
  function chrome(ctx, v) {
    const el = elRef;
    const d = v.mode === 'domain' ? v.domain : null;
    const crumbs = ['<a href="#ad-main" data-domain="">工作台</a>', '<a href="#ad-main" data-domain="">资源目录</a>'];
    if (d) crumbs.push(`<span aria-current="page">${esc(d.zh)}</span>`);
    else if (v.mode === 'results') crumbs.push('<span aria-current="page">查询结果</span>');
    el.querySelector('#ad-crumb').innerHTML = crumbs.join('<i>/</i>');
    const title = d ? d.zh : v.mode === 'results' ? '查询结果' : '总览';
    const sub = d ? d.blurb : v.mode === 'results' ? `${v.total} 条资源符合当前条件` : ctx.content.site.tagline;
    el.querySelector('#ad-pagehead').innerHTML = `
      <div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div>
      <div class="ad-pagehead-act">${d || v.mode === 'results' ? '<button type="button" class="ad-btn" data-domain="">← 返回总览</button>' : ''}<a class="ad-btn ad-btn-pri" href="${ctx.content.site.repo}" target="_blank" rel="noopener">打开仓库</a></div>`;
    const active = ctx.state.domain;
    el.querySelectorAll('.ad-nav-dom').forEach((a) => a.classList.toggle('on', a.dataset.domain === active));
    el.querySelector('[data-nav="overview"]').classList.toggle('on', v.mode === 'domains');
    el.querySelectorAll('.ad-tree').forEach((t) => {
      const open = t.dataset.tree === active || t.dataset.tree === ui.open;
      t.classList.toggle('open', open);
      t.querySelector('.ad-tw').setAttribute('aria-expanded', String(open));
    });
    const n = [ctx.state.tier, ctx.state.access, ctx.state.reach, ctx.state.lang].filter(Boolean).length + (ctx.state.q.trim() ? 1 : 0);
    el.querySelector('#ad-filter-note').textContent = n ? `${n} 个条件生效` : '未设置条件';
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#ad-view');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    chrome(ctx, v);
  }

  /* ---- 绑定 ------------------------------------------------------------------ */
  function bind(el, ctx) {
    const F = { q: '#ad-q', tier: '#ad-tier', access: '#ad-access', reach: '#ad-reach', lang: '#ad-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => { ui.page = 1; ctx.set({ [k]: e.target.value }); });
    });
    el.querySelector('#ad-reset').addEventListener('click', () => { ui.page = 1; ctx.reset(); sync(); });
    el.querySelector('#ad-form').addEventListener('submit', (e) => e.preventDefault());

    const side = el.querySelector('#ad-side'), scrim = el.querySelector('#ad-scrim'), burger = el.querySelector('#ad-burger');
    const drawer = (open) => { side.classList.toggle('open', open); scrim.hidden = !open; burger.setAttribute('aria-expanded', String(open)); };
    burger.addEventListener('click', () => drawer(!side.classList.contains('open')));
    scrim.addEventListener('click', () => drawer(false));

    el.addEventListener('click', (e) => {
      const tw = e.target.closest('[data-toggle]');
      if (tw) { e.preventDefault(); ui.open = ui.open === tw.dataset.toggle ? '' : tw.dataset.toggle; chrome(ctx, ctx.view()); return; }
      const sec = e.target.closest('[data-sec]');
      if (sec) {
        e.preventDefault();
        ui.page = 1; ui.sort = 'tier'; ui.dir = 1;
        if (ctx.state.domain !== sec.dataset.domain) ctx.set({ domain: sec.dataset.domain, q: '', tier: '', access: '', reach: '', lang: '' });
        sync(); drawer(false);
        const t = el.querySelector(`#ad-sec-${sec.dataset.sec}`);
        if (t) t.scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      const d = e.target.closest('[data-domain]');
      if (d) {
        if (d.tagName === 'A') e.preventDefault();
        const to = d.dataset.domain;
        ui.page = 1; ui.sort = 'tier'; ui.dir = 1;
        const patch = { domain: to };
        if (to) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
        ctx.set(patch); sync(); drawer(false);
        el.querySelector('#ad-main').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      const s = e.target.closest('[data-sort]');
      if (s) { if (ui.sort === s.dataset.sort) ui.dir = -ui.dir; else { ui.sort = s.dataset.sort; ui.dir = 1; } paint(); return; }
      const pg = e.target.closest('[data-page]');
      if (pg && !pg.disabled) { ui.page = Number(pg.dataset.page); paint(); el.querySelector('#ad-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' }); return; }
      if (e.target.closest('[data-reset]')) { ui.page = 1; ctx.reset(); sync(); }
    });
    el.addEventListener('keydown', (e) => {
      const r = e.target.closest('.ad-rowlink');
      if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); r.click(); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  function focusSearch() {
    const q = document.querySelector('#ad-q');
    if (q) q.focus();
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; ui.open = ''; ui.page = 1; ui.sort = 'tier'; ui.dir = 1; }
})();
