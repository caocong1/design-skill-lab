/* 风格 1 · 色卡 Swatch Book
   版式：色签扇 Hero + 域色签墙 + 抽屉式目录。动效：色签扇入、抽拉、揭页。 */
(function () {
  'use strict';
  DSL.register('swatch', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="sw-book">
      <header class="sw-head">
        <div class="sw-wordmark">
          <strong>Design Skill Lab</strong><span>设计技能实验室</span>
        </div>
        <nav class="sw-top">
          <a href="#sw-catalog">目录</a><a href="#sw-suite">套件</a><a href="#sw-how">怎么用</a>
          <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
        </nav>
      </header>

      <nav class="sw-styles" aria-label="页面版式">
        <span class="sw-styles-label">版式</span>
        ${ctx.content.styles.map((s, i) => `<a class="sw-sty" href="?style=${s.id}" data-goto="${s.id}" style="--h:${i * 36}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.name)} · ${esc(s.en)}"><i class="sw-sty-chip" aria-hidden="true"></i><b>${s.num > 10 ? s.num : s.num % 10}</b><span>${esc(s.name)}</span></a>`).join('')}
      </nav>

      <section class="sw-hero">
        <div class="sw-fan" aria-hidden="true">
          ${ctx.domains.map((d, i) => `<i class="sw-leaf" style="--h:${d.hue};--i:${i};--n:${ctx.domains.length}"></i>`).join('')}
        </div>
        <div class="sw-hero-text">
          <h1>${ctx.totals.resources} 条设计资源，<br>一套 agent 设计技能。</h1>
          <p class="sw-lede">${esc(ctx.content.site.lede)}</p>
          <div class="sw-stats">
            <span><b>${ctx.totals.resources}</b> 资源</span>
            <span><b>${ctx.totals.domains}</b> 域</span>
            <span><b>${ctx.totals.s}</b> 首选</span>
            <span><b>${ctx.totals.skills}</b> skills</span>
          </div>
        </div>
        <aside class="sw-board" aria-label="当前风格说明">
          <h2>${esc(b.name)} <span>${esc(b.en)}</span></h2>
          <p>${esc(b.concept)}</p>
          <dl>${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <p class="sw-risk">会在哪里失败：${esc(b.risk)}</p>
        </aside>
      </section>

      <section class="sw-pillars">
        ${ctx.content.site.pillars.map((p) => `<div class="sw-pillar"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>`).join('')}
      </section>

      <section class="sw-catalog" id="sw-catalog">
        <div class="sw-tools" role="search">
          <input id="sw-q" type="search" placeholder="搜索名称、用途、授权…（按 / 聚焦）" aria-label="搜索资源" autocomplete="off">
          <div class="sw-selects">
            <select id="sw-tier" aria-label="档位"><option value="">全部档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
            <select id="sw-access" aria-label="收费"><option value="">全部收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
            <select id="sw-reach" aria-label="agent 可达性"><option value="">可达性</option><option value="static">可直接抓取</option><option value="js">需要浏览器</option><option value="blocked">有防护或需登录</option></select>
            <select id="sw-lang" aria-label="语言"><option value="">全部语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
            <button type="button" id="sw-reset">重置</button>
          </div>
        </div>
        <div class="sw-view" id="sw-view"></div>
      </section>

      <section class="sw-suite" id="sw-suite">
        <h2>skill 套件 <span>${ctx.totals.skills} 个</span></h2>
        <p class="sw-suite-lede">套件的角色是设计师，不是前端工程师：决定、出图、写规格、交接、验收。画图的媒介永远是 HTML / CSS / SVG，在 Flutter、鸿蒙、小程序、Tauri 里实现是 coding agent 的事。</p>
        <ol class="sw-skills">
          ${ctx.content.skills.map(([n, d]) => `<li><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}
        </ol>
      </section>

      <section class="sw-how" id="sw-how">
        <div class="sw-col">
          <h2>怎么用</h2>
          <pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
        </div>
        <div class="sw-col">
          <h2>装好后直接说</h2>
          <ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
        <div class="sw-col">
          <h2>方法</h2>
          <dl class="sw-method">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        </div>
      </section>

      <footer class="sw-foot">
        <span>Design Skill Lab · 目录数据最近收录于 ${esc(ctx.domains.reduce((m, d) => d.sections.reduce((x, s) => s.items.reduce((y, r) => r.added > y ? r.added : y, x), m), ''))}</span>
        <span>原创内容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 许可发布；站点名称与商标归各自所有者。</span>
      </footer>
    </div>`;

    bind(el, ctx);
    reveal(el, ctx);
  }

  /* ---- 目录区渲染 ---------------------------------------------------------- */
  function shotImg(ctx, r, cls) {
    return r.shot
      ? `<img class="${cls}" src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">`
      : `<span class="${cls} sw-noshot" style="--h:${domainHue(ctx, r)}" aria-hidden="true">${esc(r.name.slice(0, 1))}</span>`;
  }
  function domainHue(ctx, r) {
    const d = ctx.domains.find((d) => d.id === r.domain);
    return d ? d.hue : 0;
  }
  function metaLine(ctx, r) {
    const bits = [`<em class="sw-tier" data-t="${r.tier}">${r.tier}</em>`, `${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登录' : ''}`];
    if (r.license) bits.push(esc(r.license.length > 42 ? r.license.slice(0, 42) + '…' : r.license));
    return bits.join('<i class="sw-dot"></i>');
  }

  function renderDomains(ctx) {
    return `<div class="sw-wall">${ctx.domains.map((d) => {
      const previews = d.sections.flatMap((s) => s.items).filter((r) => r.shot).slice(0, 3);
      return `
      <button type="button" class="sw-swatch" data-domain="${d.id}" style="--h:${d.hue}">
        <span class="sw-chip-face">
          <span class="sw-chip-color"></span>
          <span class="sw-chip-count">${d.count}</span>
          <span class="sw-chip-name">${esc(d.zh)}</span>
          <span class="sw-chip-blurb">${esc(d.blurb)}</span>
          <span class="sw-chip-shots">${previews.map((r) => `<img src="${r.shot}" alt="" loading="lazy">`).join('')}</span>
        </span>
      </button>`;
    }).join('')}</div>`;
  }

  function renderEntry(ctx, r) {
    return `
    <li class="sw-row" style="--h:${domainHue(ctx, r)}">
      <a class="sw-row-main" href="${esc(r.url)}" target="_blank" rel="noopener">
        ${shotImg(ctx, r, 'sw-thumb')}
        <span class="sw-row-text">
          <span class="sw-row-name">${esc(r.name)}${r.lang !== 'en' ? `<span class="sw-lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</span>` : ''}</span>
          <span class="sw-row-desc">${esc(ctx.zh(r))}</span>
        </span>
        <span class="sw-row-meta">${metaLine(ctx, r)}</span>
      </a>
    </li>`;
  }

  function renderDomain(ctx, d) {
    return `
    <div class="sw-domain-head" style="--h:${d.hue}">
      <button type="button" class="sw-back" data-domain="">‹ 全部域</button>
      <span class="sw-domain-chip"></span>
      <h3>${esc(d.zh)}</h3>
      <p>${esc(d.blurb)} · ${d.count} 条</p>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <section class="sw-section">
        <header><h4>${esc(s.zh)}</h4><p>${esc(s.note)}</p><span>${s.items.length}</span></header>
        <ul class="sw-rows">${s.items.map((r) => renderEntry(ctx, r)).join('')}</ul>
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<div class="sw-empty"><p>没有符合条件的资源。试试放宽档位或换个关键词。</p><button type="button" data-reset>清除全部条件</button></div>`;
    return `<p class="sw-count"><b>${v.total}</b> 条匹配</p>` + v.groups.map((g) => `
      <section class="sw-section" style="--h:${g.domain.hue}">
        <header><h4><span class="sw-dot-lead"></span>${esc(g.domain.zh)}</h4><span>${g.items.length}</span></header>
        <ul class="sw-rows">${g.items.map((r) => renderEntry(ctx, r)).join('')}</ul>
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#sw-view');
    if (!box) return;
    box.classList.remove('sw-dealt');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    // 发牌动效：重排后整体错帧浮起
    if (!ctx.reduced) requestAnimationFrame(() => box.classList.add('sw-dealt'));
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#sw-q', tier: '#sw-tier', access: '#sw-access', reach: '#sw-reach', lang: '#sw-lang' };
    const syncInputs = () => Object.entries(F).forEach(([k, sel]) => { el.querySelector(sel).value = ctx.state[k] || ''; });
    syncInputs();
    Object.entries(F).forEach(([k, sel]) => {
      el.querySelector(sel).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#sw-reset').addEventListener('click', () => { ctx.reset(); syncInputs(); });

    el.querySelector('#sw-catalog').addEventListener('click', (e) => {
      const swEl = e.target.closest('[data-domain]');
      if (swEl) { ctx.set({ domain: swEl.dataset.domain }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); syncInputs(); }
    });

    const off = ctx.onChange(() => paint(el, ctx));
    cleanup.push(off);
    paint(el, ctx);
  }

  /* ---- 进场动效：色签扇开 + 分区揭起 ---------------------------------------- */
  function reveal(el, ctx) {
    if (ctx.reduced) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('sw-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    el.querySelectorAll('.sw-pillar, .sw-board, .sw-suite, .sw-how, .sw-foot').forEach((n) => {
      n.classList.add('sw-pre');
      io.observe(n);
    });
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#sw-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() {
    cleanup.forEach((fn) => fn());
    cleanup = [];
  }
})();
