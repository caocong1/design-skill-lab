/* 风格 0 · 素页 Plain HTML
   几乎不设计：浏览器默认衬线、蓝色链接、表格线。动效：没有——这就是它的观点。 */
(function () {
  'use strict';
  DSL.register('plain', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="pl-doc">
      <h1>Design Skill Lab（设计技能实验室）</h1>
      <p><b>${esc(ctx.content.site.tagline)}。</b>${esc(ctx.content.site.lede)}</p>
      <p>目录现有 <b>${ctx.totals.resources}</b> 条资源，分布在 <b>${ctx.totals.domains}</b> 个域；
      其中 <b>${ctx.totals.s}</b> 条是同类首选（S），<b>${ctx.totals.shots}</b> 条配了首页截图。
      另有 <b>${ctx.totals.skills}</b> 个 skill。源代码在
      <a href="${ctx.content.site.repo}">GitHub</a>。</p>

      <nav>
        <p><b>版式（同一份内容，十种方向，按 1–0 切换）：</b><br>
        ${ctx.content.styles.map((s) => s.id === b.id
          ? `<b>${s.num}. ${esc(s.name)}（${esc(s.en)}）← 当前</b>`
          : `<a href="?style=${s.id}" data-goto="${s.id}">${s.num}. ${esc(s.name)}（${esc(s.en)}）</a>`).join('<br>')}</p>
      </nav>

      <h2>当前风格：${esc(b.name)}（${esc(b.en)}）</h2>
      <p>${esc(b.concept)}</p>
      <table border="1" cellspacing="0" cellpadding="6">
        <caption>方案板：各轴取值</caption>
        <tbody>${Object.entries(b.axes).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody>
      </table>
      <p>会在哪里失败：${esc(b.risk)}</p>

      <h2 id="pl-catalog">资源目录</h2>
      <form id="pl-tools" onsubmit="return false">
        <label for="pl-q">搜索：</label><input id="pl-q" type="search" size="24">
        <label for="pl-tier">档位：</label><select id="pl-tier"><option value="">全部</option><option value="S">S</option><option value="A">A</option><option value="B">B</option></select>
        <label for="pl-access">收费：</label><select id="pl-access"><option value="">全部</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
        <label for="pl-reach">可达性：</label><select id="pl-reach"><option value="">全部</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
        <label for="pl-lang">语言：</label><select id="pl-lang"><option value="">全部</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
        <button type="button" id="pl-reset">重置</button>
      </form>
      <div id="pl-view"></div>

      <h2 id="pl-suite">skill 套件</h2>
      <p>套件的角色是设计师：决定、出图、写规格、交接、验收。在 Flutter、鸿蒙、小程序、Tauri 里实现是 coding agent 的事。</p>
      <table border="1" cellspacing="0" cellpadding="6">
        <caption>十四个 skill</caption>
        <thead><tr><th scope="col">skill</th><th scope="col">做什么</th></tr></thead>
        <tbody>${ctx.content.skills.map(([n, d]) => `<tr><td><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md"><code>${n}</code></a></td><td>${esc(d)}</td></tr>`).join('')}</tbody>
      </table>

      <h2 id="pl-how">怎么用</h2>
      <h3>安装</h3>
      <pre>${ctx.content.usage.install.map(esc).join('\n')}</pre>
      <h3>然后直接说需求</h3>
      <ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>

      <h2 id="pl-method">方法与局限</h2>
      <dl>${ctx.content.method.map(([t, d]) => `<dt><b>${esc(t)}</b></dt><dd>${esc(d)}</dd>`).join('')}</dl>

      <hr>
      <p><small>原创内容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 许可发布；第三方名称、商标与截图归各自所有者，截图仅供索引预览。</small></p>
    </div>`;

    bind(el, ctx);
  }

  /* ---- 目录渲染 ------------------------------------------------------------ */
  function row(ctx, r) {
    return `<tr>
      <td>${r.shot ? `<img src="${r.shot}" alt="${esc(r.name)} 首页截图" width="200" loading="lazy">` : '（无截图）'}</td>
      <td><a href="${esc(r.url)}">${esc(r.name)}</a>${r.lang !== 'en' ? `（${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}）` : ''}</td>
      <td>${esc(ctx.zh(r))}</td>
      <td>[${r.tier}]</td>
      <td>${ctx.kindZh(r.kind)}；${ctx.accessZh(r.access)}${r.login ? '；需登录' : ''}</td>
    </tr>`;
  }

  function renderDomains(ctx) {
    return `<p>选一个域进入，或用上面的表单检索全部 ${ctx.totals.resources} 条。</p>
    <table border="1" cellspacing="0" cellpadding="6">
      <caption>十二个域</caption>
      <thead><tr><th scope="col">域</th><th scope="col">内容</th><th scope="col">条数</th></tr></thead>
      <tbody>${ctx.domains.map((d) => `<tr><td><a href="#pl-catalog" data-domain="${d.id}">${esc(d.zh)}</a></td><td>${esc(d.blurb)}</td><td align="right">${d.count}</td></tr>`).join('')}</tbody>
    </table>`;
  }

  function renderDomain(ctx, d) {
    return `
    <p><a href="#pl-catalog" data-domain="">← 返回十二个域</a></p>
    <h3>${esc(d.zh)}</h3>
    <p>${esc(d.blurb)}；共 ${d.count} 条。</p>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <h4>${esc(s.zh)}（${s.items.length}）</h4>
      <p><small>${esc(s.note)}</small></p>
      <table border="1" cellspacing="0" cellpadding="6">
        <thead><tr><th scope="col">截图</th><th scope="col">名称</th><th scope="col">说明</th><th scope="col">档位</th><th scope="col">类型与授权</th></tr></thead>
        <tbody>${s.items.map((r) => row(ctx, r)).join('')}</tbody>
      </table>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<p>没有符合条件的资源。<button type="button" data-reset>清除全部条件</button></p>`;
    return `<p>${v.total} 条匹配。<a href="#pl-catalog" data-domain="" data-resetlink>返回目录</a></p>` + v.groups.map((g) => `
      <h4>${esc(g.domain.zh)}（${g.items.length}）</h4>
      <table border="1" cellspacing="0" cellpadding="6">
        <thead><tr><th scope="col">截图</th><th scope="col">名称</th><th scope="col">说明</th><th scope="col">档位</th><th scope="col">类型与授权</th></tr></thead>
        <tbody>${g.items.map((r) => row(ctx, r)).join('')}</tbody>
      </table>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#pl-view');
    if (!box) return;
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
  }

  function bind(el, ctx) {
    const F = { q: '#pl-q', tier: '#pl-tier', access: '#pl-access', reach: '#pl-reach', lang: '#pl-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#pl-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#pl-catalog').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { e.preventDefault(); ctx.set({ domain: d.dataset.domain }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  function focusSearch() {
    const q = document.querySelector('#pl-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
