/* 风格 2 · 瑞士 Swiss Grid
   版式：海报网格 + 巨大红色数字索引 + 编号行式目录。动效：红线扫入、网格滑入、数字滚动。 */
(function () {
  'use strict';
  DSL.register('swiss', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n, w = 3) => String(n).padStart(w, '0');

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="ch-sheet">
      <div class="ch-edge" aria-hidden="true">DESIGN SKILL LAB — CATALOGUE OF DESIGN RESOURCES — MMXXVI</div>
      <div class="ch-redbar" aria-hidden="true"></div>

      <header class="ch-top">
        <span class="ch-mark">DSL</span>
        <nav>
          <a href="#ch-index">索引</a><a href="#ch-suite">套件</a><a href="#ch-how">方法</a>
          <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
      </header>

      <nav class="ch-styles" aria-label="页面版式">
        <span class="ch-styles-label">版式<em>STIL</em></span>
        ${ctx.content.styles.map((s) => `<a class="ch-sty" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.en)}"><b>${pad(s.num, 2)}</b><span>${esc(s.name)}</span></a>`).join('')}
      </nav>

      <section class="ch-hero">
        <div class="ch-hero-l">
          <h1>设计资源<br>目录与技能</h1>
          <p>${esc(ctx.content.site.tagline)}。同一份内容，十种设计方向——当前是<b>瑞士网格</b>。</p>
          <div class="ch-nums">
            <span data-n="${ctx.totals.resources}"><b>0</b>条资源</span>
            <span data-n="${ctx.totals.domains}"><b>0</b>个域</span>
            <span data-n="${ctx.totals.s}"><b>0</b>首选</span>
            <span data-n="${ctx.totals.skills}"><b>0</b>skills</span>
          </div>
        </div>
        <div class="ch-hero-r" aria-hidden="true">${ctx.totals.resources}</div>
      </section>

      <section class="ch-board">
        <h2><span class="ch-sq"></span>${esc(b.name)} ${esc(b.en)}</h2>
        <p>${esc(b.concept)}</p>
        <table><tbody>${Object.entries(b.axes).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
        <p class="ch-risk">会在哪里失败：${esc(b.risk)}</p>
      </section>

      <section class="ch-index" id="ch-index">
        <h2>索引 <span>Index</span></h2>
        <div class="ch-tools" role="search">
          <input id="ch-q" type="search" placeholder="搜索 /" aria-label="搜索资源" autocomplete="off">
          <select id="ch-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
          <select id="ch-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
          <select id="ch-reach" aria-label="可达性"><option value="">可达性</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
          <select id="ch-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
          <button type="button" id="ch-reset" aria-label="重置">×</button>
        </div>
        <div id="ch-view"></div>
      </section>

      <section class="ch-suite" id="ch-suite">
        <h2>套件 <span>${pad(ctx.totals.skills, 2)} skills</span></h2>
        <p class="ch-suite-lede">套件的角色是设计师：决定、出图、写规格、交接、验收。实现是 coding agent 的事。</p>
        <ol>${ctx.content.skills.map(([n, d], i) => `
          <li><span class="ch-no">${pad(i + 1, 2)}</span><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}
        </ol>
      </section>

      <section class="ch-how" id="ch-how">
        <h2>方法</h2>
        <div class="ch-how-grid">
          <div><h3>安装</h3><pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre></div>
          <div><h3>直接说需求</h3><ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
          <div><h3>支点与局限</h3><dl>${ctx.content.method.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></div>
        </div>
      </section>

      <footer class="ch-foot">
        <span>DESIGN SKILL LAB</span>
        <span>原创内容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 许可发布；商标归各自所有者。</span>
      </footer>
    </div>`;

    bind(el, ctx);
    reveal(el, ctx);
    countUp(el, ctx);
  }

  /* ---- 目录渲染 ------------------------------------------------------------ */
  function row(ctx, r, i) {
    return `
    <li class="ch-row">
      <a href="${esc(r.url)}" target="_blank" rel="noopener">
        <span class="ch-idx">${pad(i + 1)}</span>
        ${r.shot ? `<img class="ch-thumb" src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">` : '<span class="ch-nothumb"></span>'}
        <span class="ch-name">${esc(r.name)}${r.lang !== 'en' ? `<sup>${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</sup>` : ''}</span>
        <span class="ch-desc">${esc(ctx.zh(r))}</span>
        <span class="ch-tier ch-t${r.tier}">${r.tier}</span>
      </a>
    </li>`;
  }

  function renderDomains(ctx) {
    return `<ol class="ch-domains">${ctx.domains.map((d, i) => `
      <li><button type="button" data-domain="${d.id}">
        <span class="ch-dno">${pad(i + 1, 2)}</span>
        <span class="ch-dname">${esc(d.zh)}</span>
        <span class="ch-dblurb">${esc(d.blurb)}</span>
        <span class="ch-dcount">${d.count}</span>
      </button></li>`).join('')}</ol>`;
  }

  function renderDomain(ctx, d) {
    let n = 0;
    return `
    <div class="ch-backrow"><button type="button" class="ch-back" data-domain="">← 索引</button>
      <h3>${esc(d.zh)}</h3><span class="ch-dmeta">${esc(d.blurb)} / ${d.count} 条</span></div>
    ${d.sections.filter((s) => s.items.length).map((s, si) => `
      <section class="ch-sec">
        <header><span class="ch-sno">${pad(si + 1, 2)}</span><h4>${esc(s.zh)}</h4><p>${esc(s.note)}</p></header>
        <ol>${s.items.map((r) => row(ctx, r, n++)).join('')}</ol>
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<div class="ch-empty"><p>没有符合条件的资源。</p><button type="button" data-reset>清除条件</button></div>`;
    let n = 0;
    return `<p class="ch-count">${v.total} 条匹配</p>` + v.groups.map((g) => `
      <section class="ch-sec">
        <header><span class="ch-sno ch-sq-red"></span><h4>${esc(g.domain.zh)}</h4><p>${g.items.length} 条</p></header>
        <ol>${g.items.map((r) => row(ctx, r, n++)).join('')}</ol>
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#ch-view');
    if (!box) return;
    box.classList.remove('ch-in');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    if (!ctx.reduced) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('ch-in')));
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#ch-q', tier: '#ch-tier', access: '#ch-access', reach: '#ch-reach', lang: '#ch-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#ch-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#ch-index').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { ctx.set({ domain: d.dataset.domain }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 动效：网格滑入 + 数字滚动 -------------------------------------------- */
  function reveal(el, ctx) {
    if (ctx.reduced) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('ch-vis'); io.unobserve(en.target); } });
    }, { threshold: 0.06 });
    el.querySelectorAll('.ch-board, .ch-suite, .ch-how, .ch-domains > li').forEach((n) => { n.classList.add('ch-pre'); io.observe(n); });
    cleanup.push(() => io.disconnect());
  }
  function countUp(el, ctx) {
    if (ctx.reduced) { el.querySelectorAll('.ch-nums span').forEach((s) => { s.querySelector('b').textContent = s.dataset.n; }); return; }
    const t0 = performance.now(), dur = 1100;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.querySelectorAll('.ch-nums span').forEach((s) => {
        s.querySelector('b').textContent = Math.round(Number(s.dataset.n) * e);
      });
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function focusSearch() {
    const q = document.querySelector('#ch-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
