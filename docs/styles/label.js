/* 风格 7 · 展签 Museum Label
   版式：美术馆——截图是挂在墙上的展品，说明卡又小又克制，大量留白。
   动效：缓慢的淡入与凝视。 */
(function () {
  'use strict';
  DSL.register('label', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="ml-museum">
      <header class="ml-top">
        <span class="ml-word">设计技能实验室</span>
        <nav><a href="#ml-rooms">展厅</a><a href="#ml-suite">工具</a><a href="#ml-colophon">版权页</a><a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a></nav>
      </header>

      <nav class="ml-guide" aria-label="展厅导览">
        <span class="ml-guide-label">十个展厅</span>
        ${ctx.content.styles.map((s) => `<a class="ml-g" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''}><b>${String(s.num).padStart(2, '0')}</b>${esc(s.name)}</a>`).join('')}
      </nav>

      <section class="ml-lobby">
        <p class="ml-eyebrow">常设展 · The Permanent Collection</p>
        <h1>设计资源<br>六百零一件</h1>
        <p class="ml-dates">2026 年 · 免费入场 · 允许拍照</p>
        <p class="ml-intro">${esc(ctx.content.site.lede)}</p>
        <div class="ml-stats">
          <span><b>${ctx.totals.resources}</b> 件藏品</span>
          <span><b>${ctx.totals.domains}</b> 个展厅</span>
          <span><b>${ctx.totals.s}</b> 件典藏</span>
          <span><b>${ctx.totals.shots}</b> 幅影像</span>
        </div>
      </section>

      <section class="ml-preface">
        <h2>展览前言</h2>
        <p class="ml-preface-name">第七展厅 · ${esc(b.name)}（${esc(b.en)}）</p>
        <p>${esc(b.concept)}</p>
        <dl>${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="ml-risk">展厅提示：${esc(b.risk)}</p>
      </section>

      <section class="ml-rooms" id="ml-rooms">
        <div class="ml-tools" role="search">
          <label class="ml-search"><span>检索</span><input id="ml-q" type="search" placeholder="藏品名、用途、授权…" autocomplete="off"></label>
          <div class="ml-filters">
            <select id="ml-tier" aria-label="档位"><option value="">全部档位</option><option value="S">典藏 S</option><option value="A">馆藏 A</option><option value="B">文献 B</option></select>
            <select id="ml-access" aria-label="收费"><option value="">全部</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
            <select id="ml-reach" aria-label="可达性"><option value="">可达性</option><option value="static">可直接抓取</option><option value="js">需要浏览器</option><option value="blocked">有防护或需登录</option></select>
            <select id="ml-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
            <button type="button" id="ml-reset">重置</button>
          </div>
        </div>
        <div id="ml-view"></div>
      </section>

      <section class="ml-suite" id="ml-suite">
        <p class="ml-eyebrow">策展工具</p>
        <h2>skill 套件 · ${ctx.totals.skills} 件工具</h2>
        <p class="ml-suite-lede">套件的角色是设计师：决定、出图、写规格、交接、验收。实现是 coding agent 的事。</p>
        <ol>${ctx.content.skills.map(([n, d], i) => `
          <li>
            <span class="ml-sk-no">${String(i + 1).padStart(2, '0')}</span>
            <a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a>
            <p>${esc(d)}</p>
          </li>`).join('')}
      </ol>
      </section>

      <section class="ml-colophon" id="ml-colophon">
        <div class="ml-col"><h2>布展</h2><pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre></div>
        <div class="ml-col"><h2>讲解词</h2><ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
        <div class="ml-col"><h2>方法</h2><dl>${ctx.content.method.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></div>
      </section>

      <footer class="ml-foot">
        <span>Design Skill Lab · 2026</span>
        <span>原创内容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 许可发布；展品（站点截图）归各自所有者，仅供索引预览。</span>
      </footer>
    </div>`;

    bind(el, ctx);
    gaze(el, ctx);
  }

  /* ---- 展品 ---------------------------------------------------------------- */
  let exhibitNo = 0;
  function exhibit(ctx, r) {
    exhibitNo++;
    const no = `${r.tier}-${String(exhibitNo).padStart(3, '0')}`;
    if (r.shot) {
      return `
      <figure class="ml-exhibit ml-gaze">
        <a href="${esc(r.url)}" target="_blank" rel="noopener" class="ml-frame">
          <img src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">
        </a>
        <figcaption class="ml-label">
          <p class="ml-l-name">${esc(r.name)}${r.lang !== 'en' ? `<span class="ml-l-lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</span>` : ''}</p>
          <p class="ml-l-desc">${esc(ctx.zh(r))}</p>
          <p class="ml-l-meta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登录' : ''} · 馆藏编号 ${no}</p>
        </figcaption>
      </figure>`;
    }
    return `
    <figure class="ml-exhibit ml-text ml-gaze">
      <figcaption class="ml-label">
        <p class="ml-l-name"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>${r.lang !== 'en' ? `<span class="ml-l-lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</span>` : ''}</p>
        <p class="ml-l-desc">${esc(ctx.zh(r))}</p>
        <p class="ml-l-meta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)} · 文献 · 馆藏编号 ${no}</p>
      </figcaption>
    </figure>`;
  }

  function renderDomains(ctx) {
    exhibitNo = 0;
    return `
    <p class="ml-eyebrow ml-gaze">展厅导览</p>
    <ol class="ml-roomlist">${ctx.domains.map((d, i) => `
      <li class="ml-gaze"><button type="button" data-domain="${d.id}">
        <span class="ml-room-no">第${['一','二','三','四','五','六','七','八','九','十','十一','十二'][i]}展厅</span>
        <span class="ml-room-name">${esc(d.zh)}</span>
        <span class="ml-room-blurb">${esc(d.blurb)}</span>
        <span class="ml-room-count">${d.count} 件</span>
      </button></li>`).join('')}
    </ol>`;
  }

  function renderDomain(ctx, d) {
    exhibitNo = 0;
    return `
    <div class="ml-dhead ml-gaze">
      <button type="button" class="ml-back" data-domain="">← 展厅导览</button>
      <h3>${esc(d.zh)}</h3>
      <p>${esc(d.blurb)} · ${d.count} 件</p>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <section class="ml-sec">
        <header class="ml-gaze"><h4>${esc(s.zh)}</h4><p>${esc(s.note)}</p></header>
        ${s.items.map((r) => exhibit(ctx, r)).join('')}
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    exhibitNo = 0;
    if (!v.total) return `<div class="ml-empty ml-gaze"><p>本馆没有符合这些条件的藏品。</p><button type="button" data-reset>清除条件</button></div>`;
    return `<p class="ml-count ml-gaze">${v.total} 件藏品符合条件</p>` + v.groups.map((g) => `
      <section class="ml-sec">
        <header class="ml-gaze"><h4>${esc(g.domain.zh)}</h4><p>${g.items.length} 件</p></header>
        ${g.items.map((r) => exhibit(ctx, r)).join('')}
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#ml-view');
    if (!box) return;
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    gazeIn(box, ctx);
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#ml-q', tier: '#ml-tier', access: '#ml-access', reach: '#ml-reach', lang: '#ml-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#ml-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#ml-rooms').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { ctx.set({ domain: d.dataset.domain }); el.querySelector('#ml-rooms').scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth' }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 动效：凝视 ----------------------------------------------------------- */
  let io = null;
  function gaze(el, ctx) { gazeIn(el, ctx); }
  function gazeIn(scope, ctx) {
    if (ctx.reduced) return;
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('ml-seen'); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    scope.querySelectorAll('.ml-gaze:not(.ml-seen)').forEach((n) => io.observe(n));
    cleanup.push(() => io && io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#ml-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; io = null; }
})();
