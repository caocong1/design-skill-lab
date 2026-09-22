/* 风格 12 · 画板 Design Canvas
   设计工具的界面：深色工具栏 + 左侧图层面板 + 中间画布（点阵网格、标尺、画框）+ 右侧属性检查器。
   十二个域是画框，资源是画框里的元件；选中出现蓝色选框、四角把手与尺寸标注。 */
(function () {
  'use strict';
  DSL.register('canvas', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ZOOMS = [75, 100, 125];
  const ui = { zoom: 100, open: '' };

  // 图层图标：# 画框 / ◇ 组件 / T 文本 / ▭ 矩形
  const ICON = {
    frame: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" stroke="currentColor" fill="none"/></svg>',
    comp: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1l5 5-5 5-5-5z" fill="#7b61ff"/></svg>',
    text: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2h8v2.5M6 2v9M4 11h4" stroke="currentColor" fill="none"/></svg>',
    rect: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1.5" y="2.5" width="9" height="7" stroke="currentColor" fill="none"/></svg>',
    img: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1.5" y="1.5" width="9" height="9" stroke="currentColor" fill="none"/><path d="M2 9l3-3 2 2 1.5-1.5L10 8.5" stroke="currentColor" fill="none"/></svg>',
  };

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    el.innerHTML = `
    <div class="cv-app" style="--z:${ui.zoom / 100}">
      <header class="cv-bar">
        <div class="cv-bar-l">
          <span class="cv-menu" aria-hidden="true"><i></i></span>
          <span class="cv-file"><b>Design Skill Lab</b><i>/</i><span>资源目录</span><em>▾</em></span>
        </div>
        <div class="cv-tools" role="toolbar" aria-label="工具">
          <button type="button" class="cv-tool on" title="移动 (V)" aria-pressed="true"><svg viewBox="0 0 16 16"><path d="M4 2l9 6.5-4 .5 2.5 4-1.6.9L7.4 10 4.5 13z" fill="currentColor"/></svg></button>
          <button type="button" class="cv-tool" title="画框 (F)"><svg viewBox="0 0 16 16"><path d="M5 1.5v13M11 1.5v13M1.5 5h13M1.5 11h13" stroke="currentColor" fill="none" stroke-width="1.4"/></svg></button>
          <button type="button" class="cv-tool" title="形状 (R)"><svg viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" fill="none" stroke-width="1.4"/></svg></button>
          <button type="button" class="cv-tool" title="文本 (T)"><svg viewBox="0 0 16 16"><path d="M3 3h10v3M8 3v10M6 13h4" stroke="currentColor" fill="none" stroke-width="1.4"/></svg></button>
          <button type="button" class="cv-tool" title="搜索 (/)" data-focus-q><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" stroke="currentColor" fill="none" stroke-width="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.4"/></svg></button>
        </div>
        <div class="cv-bar-r">
          <span class="cv-avatars" aria-hidden="true"><i>D</i><i>S</i><i>L</i></span>
          <a class="cv-share" href="${ctx.content.site.repo}" target="_blank" rel="noopener">分享</a>
          <button type="button" class="cv-zoom" id="cv-zoom" aria-label="缩放">${ui.zoom}% ▾</button>
        </div>
      </header>

      <div class="cv-work">
        <aside class="cv-panel cv-layers" aria-label="图层">
          <div class="cv-tabs"><button type="button" class="on" aria-pressed="true">图层</button><button type="button">资源</button></div>
          <div class="cv-pages">
            <p class="cv-ph">页面</p>
            <a href="#cv-frame-hero" class="cv-page on">总览</a>
            <a href="#cv-frame-suite" class="cv-page">skill 套件</a>
            <a href="#cv-frame-usage" class="cv-page">安装与用法</a>
            <a href="#cv-frame-method" class="cv-page">方法与局限</a>
          </div>
          <p class="cv-ph">图层 <span id="cv-layer-count">${ctx.totals.domains} 个画框</span></p>
          <div class="cv-tree" id="cv-tree">
            <a href="#cv-view" class="cv-layer cv-layer-root" data-domain="">${ICON.frame}<span>目录</span><em>${ctx.totals.resources}</em></a>
            ${ctx.domains.map((d) => `
              <div class="cv-lnode" data-tree="${d.id}">
                <div class="cv-lrow">
                  <button type="button" class="cv-tw" data-toggle="${d.id}" aria-label="展开 ${esc(d.zh)}" aria-expanded="false"></button>
                  <a href="#cv-view" class="cv-layer" data-domain="${d.id}">${ICON.frame}<span>${esc(d.zh)}</span><i class="cv-fill" style="--h:${d.hue}"></i><em>${d.count}</em></a>
                </div>
                <div class="cv-lkids">${d.sections.filter((s) => s.items.length).map((s) => `<a href="#cv-sec-${s.id}" class="cv-layer cv-layer-k" data-domain="${d.id}" data-sec="${s.id}">${ICON.text}<span>${esc(s.zh)}</span><em>${s.items.length}</em></a>`).join('')}</div>
              </div>`).join('')}
          </div>
        </aside>

        <main class="cv-canvas" id="cv-canvas">
          <div class="cv-ruler cv-ruler-x" aria-hidden="true"></div>
          <div class="cv-ruler cv-ruler-y" aria-hidden="true"></div>
          <div class="cv-stage">
            <section class="cv-frame cv-hero" id="cv-frame-hero">
              <span class="cv-flabel">总览 <i>1280 × ${ctx.totals.resources}</i></span>
              <div class="cv-hero-in">
                <h1>Design Skill Lab</h1>
                <p class="cv-tag">${esc(ctx.content.site.tagline)}</p>
                <p class="cv-lede">${esc(ctx.content.site.lede)}</p>
                <div class="cv-stats">
                  <span>${ICON.comp}<b>${ctx.totals.resources}</b>资源</span>
                  <span>${ICON.comp}<b>${ctx.totals.domains}</b>域</span>
                  <span>${ICON.comp}<b>${ctx.totals.s}</b>首选</span>
                  <span>${ICON.comp}<b>${ctx.totals.skills}</b>skill</span>
                  <span>${ICON.img}<b>${ctx.totals.shots}</b>截图</span>
                </div>
              </div>
            </section>

            <div id="cv-view"></div>

            <section class="cv-frame" id="cv-frame-suite">
              <span class="cv-flabel">skill 套件 <i>${ctx.totals.skills} 个组件</i></span>
              <div class="cv-comps">${ctx.content.skills.map(([n, d]) => `
                <a class="cv-comp" href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener">
                  <span class="cv-comp-h">${ICON.comp}<code>${n}</code></span><p>${esc(d)}</p>
                </a>`).join('')}
              </div>
            </section>

            <div class="cv-row2" id="cv-frame-usage">
              <section class="cv-frame">
                <span class="cv-flabel">安装 <i>文本</i></span>
                <pre class="cv-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
              </section>
              <section class="cv-frame">
                <span class="cv-flabel">装好后直接说 <i>${ctx.content.usage.prompts.length} 条</i></span>
                <ul class="cv-prompts">${ctx.content.usage.prompts.map((p) => `<li>${ICON.text}<span>${esc(p)}</span></li>`).join('')}</ul>
              </section>
            </div>

            <section class="cv-frame" id="cv-frame-method">
              <span class="cv-flabel">方法与局限 <i>${ctx.content.method.length} 条</i></span>
              <dl class="cv-method">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
            </section>

            <footer class="cv-foot">Design Skill Lab · 原创内容 MIT · 商标归各自所有者 · 截图仅供索引预览 · <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a></footer>
          </div>
        </main>

        <aside class="cv-panel cv-inspect" aria-label="属性">
          <div class="cv-tabs"><button type="button" class="on" aria-pressed="true">设计</button><button type="button">原型</button><button type="button">检查</button></div>
          <section class="cv-sec">
            <h3>选中 <span id="cv-selname">目录</span></h3>
            <div class="cv-props" id="cv-selprops"></div>
          </section>
          <section class="cv-sec" role="search">
            <h3>筛选</h3>
            <div class="cv-props">
              <label class="cv-prop cv-prop-wide"><span>内容</span><input id="cv-q" type="search" placeholder="搜索名称、用途、标签" aria-label="搜索资源" autocomplete="off"></label>
              <label class="cv-prop"><span>档位</span><select id="cv-tier"><option value="">全部</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select></label>
              <label class="cv-prop"><span>收费</span><select id="cv-access"><option value="">全部</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select></label>
              <label class="cv-prop"><span>可达</span><select id="cv-reach"><option value="">全部</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select></label>
              <label class="cv-prop"><span>语言</span><select id="cv-lang"><option value="">全部</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select></label>
            </div>
            <button type="button" class="cv-reset" id="cv-reset">重置筛选</button>
          </section>
          <section class="cv-sec">
            <h3>样式 <span>本地 · ${ctx.content.styles.length}</span></h3>
            <div class="cv-styles">
              ${ctx.content.styles.map((s, i) => `<a class="cv-style" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.en)}"><i style="--h:${(i * 47) % 360}"></i><span>${pad(s.num)} ${esc(s.name)}</span><small>${esc(s.en)}</small></a>`).join('')}
            </div>
          </section>
          <section class="cv-sec cv-board">
            <h3>说明 <span>${esc(b.name)} ${esc(b.en)}</span></h3>
            <p>${esc(b.concept)}</p>
            <div class="cv-props">${Object.entries(b.axes).map(([k, v]) => `<div class="cv-prop cv-prop-wide cv-prop-ro"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>
            <p class="cv-risk"><b>会在哪里失败</b>${esc(b.risk)}</p>
          </section>
        </aside>
      </div>
    </div>`;

    bind(el, ctx);
  }

  /* ---- 画布内容 ---------------------------------------------------------------- */
  function item(ctx, r) {
    return `<a class="cv-item" href="${esc(r.url)}" target="_blank" rel="noopener">
      ${r.shot ? `<img class="cv-thumb" src="${r.shot}" alt="" loading="lazy">` : `<span class="cv-thumb cv-thumb-none">${ICON.img}</span>`}
      <span class="cv-item-t">
        <span class="cv-item-n">${ICON.comp}<b>${esc(r.name)}</b>${r.lang !== 'en' ? `<i class="cv-chip">${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</i>` : ''}<i class="cv-tier cv-tier-${r.tier}">${r.tier}</i></span>
        <span class="cv-item-d">${esc(ctx.zh(r))}</span>
        <span class="cv-item-m">${esc(ctx.kindZh(r.kind))} · ${esc(ctx.accessZh(r.access))}${r.login ? ' · 需登录' : ''} · ${esc(ctx.reachZh(r.agent_access))}</span>
      </span>
    </a>`;
  }

  function renderDomains(ctx) {
    return `<div class="cv-grid">${ctx.domains.map((d, i) => {
      const shots = d.sections.flatMap((s) => s.items).filter((r) => r.shot).slice(0, 3);
      return `<button type="button" class="cv-frame cv-dframe" data-domain="${d.id}" style="--h:${d.hue}">
        <span class="cv-flabel">${esc(d.zh)} <i>${d.count}</i></span>
        <span class="cv-dhead"><i class="cv-fill" aria-hidden="true"></i><b>${esc(d.zh)}</b><em>${pad(i + 1)}</em></span>
        <span class="cv-dblurb">${esc(d.blurb)}</span>
        <span class="cv-dshots">${shots.map((r) => `<img src="${r.shot}" alt="" loading="lazy">`).join('')}</span>
        <span class="cv-dim" aria-hidden="true">${d.count} × ${d.sections.filter((s) => s.items.length).length}</span>
      </button>`;
    }).join('')}</div>`;
  }

  function renderDomain(ctx, d) {
    return `<section class="cv-frame cv-sel cv-open" style="--h:${d.hue}">
      <span class="cv-flabel"><button type="button" class="cv-up" data-domain="">← 目录</button>${esc(d.zh)} <i>${d.count} 个元件</i></span>
      <div class="cv-dtitle"><i class="cv-fill" aria-hidden="true"></i><h2>${esc(d.zh)}</h2><p>${esc(d.blurb)}</p></div>
      ${d.sections.filter((s) => s.items.length).map((s) => `
        <div class="cv-sub" id="cv-sec-${s.id}">
          <header><span class="cv-sublabel">${ICON.frame}${esc(s.zh)}<em>${s.items.length}</em></span><p>${esc(s.note)}</p></header>
          <div class="cv-items">${s.items.map((r) => item(ctx, r)).join('')}</div>
        </div>`).join('')}
      <span class="cv-dim" aria-hidden="true">${d.count} × ${d.sections.filter((s) => s.items.length).length}</span>
    </section>`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<section class="cv-frame cv-sel"><span class="cv-flabel">搜索结果 <i>0</i></span>
      <div class="cv-empty"><p>没有符合条件的元件。</p><button type="button" class="cv-reset" data-reset>清除全部条件</button></div></section>`;
    return `<section class="cv-frame cv-sel cv-open">
      <span class="cv-flabel">搜索结果 <i>${v.total} 个元件 · ${v.groups.length} 个画框</i></span>
      ${v.groups.map((g) => `
        <div class="cv-sub" style="--h:${g.domain.hue}">
          <header><span class="cv-sublabel">${ICON.frame}<button type="button" class="cv-link" data-domain="${g.domain.id}">${esc(g.domain.zh)}</button><em>${g.items.length}</em></span></header>
          <div class="cv-items">${g.items.map((r) => item(ctx, r)).join('')}</div>
        </div>`).join('')}
      <span class="cv-dim" aria-hidden="true">${v.total} × ${v.groups.length}</span>
    </section>`;
  }

  /* 检查器里的"选中"属性：X Y W H 用真实数据充填 */
  function props(ctx, v) {
    const el = elRef;
    const d = v.mode === 'domain' ? v.domain : null;
    el.querySelector('#cv-selname').textContent = d ? d.zh : v.mode === 'results' ? '搜索结果' : '目录';
    const rows = d
      ? [['X', pad(ctx.domains.indexOf(d) + 1)], ['Y', String(d.hue) + '°'], ['W', String(d.count)], ['H', String(d.sections.filter((s) => s.items.length).length)], ['填充', `hsl(${d.hue} 60% 55%)`], ['说明', d.blurb]]
      : v.mode === 'results'
        ? [['W', String(v.total)], ['H', String(v.groups.length)], ['条件', [ctx.state.q.trim(), ctx.state.tier, ctx.state.access, ctx.state.reach, ctx.state.lang].filter(Boolean).join(' · ') || '—']]
        : [['W', String(ctx.totals.resources)], ['H', String(ctx.totals.domains)], ['S', String(ctx.totals.s)], ['截图', String(ctx.totals.shots)]];
    el.querySelector('#cv-selprops').innerHTML = rows.map(([k, val]) => `<div class="cv-prop cv-prop-ro${k.length > 1 ? ' cv-prop-wide' : ''}"><span>${esc(k)}</span><b>${esc(val)}</b></div>`).join('');
    el.querySelectorAll('.cv-layer[data-domain]:not([data-sec])').forEach((a) => a.classList.toggle('on', (a.dataset.domain || '') === (ctx.state.domain || '') && v.mode !== 'results'));
    el.querySelectorAll('.cv-lnode').forEach((n) => {
      const open = n.dataset.tree === ctx.state.domain || n.dataset.tree === ui.open;
      n.classList.toggle('open', open);
      n.querySelector('.cv-tw').setAttribute('aria-expanded', String(open));
    });
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#cv-view');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    props(ctx, v);
  }

  /* ---- 绑定 -------------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#cv-q', tier: '#cv-tier', access: '#cv-access', reach: '#cv-reach', lang: '#cv-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#cv-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#cv-zoom').addEventListener('click', () => {
      ui.zoom = ZOOMS[(ZOOMS.indexOf(ui.zoom) + 1) % ZOOMS.length];
      el.querySelector('.cv-app').style.setProperty('--z', ui.zoom / 100);
      el.querySelector('#cv-zoom').textContent = `${ui.zoom}% ▾`;
    });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-focus-q]')) { focusSearch(); return; }
      const tw = e.target.closest('[data-toggle]');
      if (tw) { ui.open = ui.open === tw.dataset.toggle ? '' : tw.dataset.toggle; props(ctx, ctx.view()); return; }
      const sec = e.target.closest('[data-sec]');
      if (sec) {
        e.preventDefault();
        if (ctx.state.domain !== sec.dataset.domain || ctx.state.q || ctx.state.tier) ctx.set({ domain: sec.dataset.domain, q: '', tier: '', access: '', reach: '', lang: '' });
        sync();
        const t = el.querySelector(`#cv-sec-${sec.dataset.sec}`);
        if (t) t.scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      const d = e.target.closest('[data-domain]');
      if (d) {
        if (d.tagName === 'A') e.preventDefault();
        const to = d.dataset.domain;
        const patch = { domain: to };
        if (to) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
        ctx.set(patch); sync();
        el.querySelector('#cv-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  function focusSearch() {
    const q = document.querySelector('#cv-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'nearest' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; ui.open = ''; }
})();
