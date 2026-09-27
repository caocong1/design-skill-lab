/* 风格 9 · 贴纸 Sticker Wall
   版式：贴纸墙拼贴 + 色块抽屉。动效：弹簧砸入、hover 抖动、按下咔哒。 */
(function () {
  'use strict';
  DSL.register('sticker', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rot = (i, span = 5) => (((i * 37) % (span * 2 + 1)) - span);   // 确定性伪随机角度

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="st-wall">
      <header class="st-head">
        <a class="st-logo st-pop" style="--r:-2deg" href="#top">设计技能实验室</a>
        <nav>
          <a class="st-nav s-y" style="--r:2deg" href="#st-catalog">目录</a>
          <a class="st-nav s-p" style="--r:-2.5deg" href="#st-suite">套件</a>
          <a class="st-nav s-b" style="--r:1.5deg" href="#st-how">怎么用</a>
          <a class="st-nav s-g" style="--r:-1.5deg" href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
        </nav>
      </header>

      <nav class="st-strip" aria-label="页面风格">
        <span class="st-strip-label">换皮→</span>
        ${ctx.content.styles.map((s, i) => `<a class="st-stk s-${'ypbgr'[i % 5]} st-pop" style="--r:${rot(i, 3)}deg" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.name)} · ${esc(s.en)}"><b>${s.num > 10 ? s.num : s.num % 10}</b>${esc(s.name)}</a>`).join('')}
      </nav>

      <section class="st-hero" id="top">
        <div class="st-hero-l">
          <h1 class="st-title st-pop" style="--r:-2.2deg"><span>Design</span> <span>Skill</span> <span>Lab</span></h1>
          <p class="st-sub st-pop" style="--r:1.6deg">${ctx.totals.resources} 条设计资源 + ${ctx.totals.skills} 个 agent 技能，<br>每条都标了用途、授权、档位，还配了截图。</p>
          <div class="st-minis">
            <span class="st-mini s-y st-pop" style="--r:3deg"><b>${ctx.totals.resources}</b>资源</span>
            <span class="st-mini s-p st-pop" style="--r:-3.5deg"><b>${ctx.totals.domains}</b>域</span>
            <span class="st-mini s-b st-pop" style="--r:2.5deg"><b>${ctx.totals.s}</b>首选</span>
            <span class="st-mini s-g st-pop" style="--r:-2deg"><b>${ctx.totals.shots}</b>截图</span>
          </div>
        </div>
        <aside class="st-board st-pop" style="--r:1.8deg" aria-label="当前风格说明">
          <span class="st-tape" aria-hidden="true"></span>
          <h2>${esc(b.name)} ${esc(b.en)}</h2>
          <p>${esc(b.concept)}</p>
          <dl>${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <p class="st-risk">会在哪里失败：${esc(b.risk)}</p>
        </aside>
      </section>

      <section class="st-catalog" id="st-catalog">
        <div class="st-tools" role="search">
          <input id="st-q" type="search" placeholder="搜一下！（按 / 聚焦）" aria-label="搜索资源" autocomplete="off">
          <select id="st-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
          <select id="st-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
          <select id="st-reach" aria-label="可达性"><option value="">可达性</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
          <select id="st-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
          <button type="button" id="st-reset">重来</button>
        </div>
        <div id="st-view"></div>
      </section>

      <section class="st-suite" id="st-suite">
        <h2 class="st-h2 st-pop" style="--r:-1.5deg">skill 套件 ×${ctx.totals.skills}</h2>
        <p class="st-suite-lede">套件是设计师：决定、出图、写规格、交接、验收。实现是 coding agent 的事。</p>
        <ol>${ctx.content.skills.map(([n, d], i) => `
          <li class="st-skill st-pop" style="--r:${rot(i, 2)}deg">
            <a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a>
            <p>${esc(d)}</p>
          </li>`).join('')}
      </ol>
      </section>

      <section class="st-how" id="st-how">
        <div class="st-install st-pop" style="--r:-1deg">
          <h2>安装</h2>
          <pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
        </div>
        <div class="st-prompts">
          <h2>装好后直接说</h2>
          ${ctx.content.usage.prompts.map((p, i) => `<p class="st-bubble st-pop" style="--r:${rot(i + 3, 2)}deg">${esc(p)}</p>`).join('')}
        </div>
        <div class="st-method">
          <h2>方法</h2>
          ${ctx.content.method.map(([t, d], i) => `<div class="st-mrow st-pop" style="--r:${rot(i + 7, 2)}deg"><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('')}
        </div>
      </section>

      <footer class="st-foot">
        <span>Design Skill Lab · MIT</span>
        <span>商标归各自所有者 · 截图仅供索引预览</span>
      </footer>
    </div>`;

    bind(el, ctx);
    slam(el, ctx);
  }

  /* ---- 目录 ---------------------------------------------------------------- */
  function domainHue(ctx, id) { const d = ctx.domains.find((d) => d.id === id); return d ? d.hue : 0; }

  function entry(ctx, r, i) {
    return `
    <li class="st-row st-pop" style="--r:${rot(i, 1)}deg">
      <a href="${esc(r.url)}" target="_blank" rel="noopener">
        ${r.shot ? `<img class="st-thumb" src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">` : `<span class="st-noshot" style="--h:${domainHue(ctx, r.domain)}">${esc(r.name.slice(0, 1))}</span>`}
        <span class="st-rtext">
          <span class="st-rname">${esc(r.name)}${r.lang !== 'en' ? `<i class="st-lang">${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</i>` : ''}</span>
          <span class="st-rdesc">${esc(ctx.zh(r))}</span>
          <span class="st-rmeta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登录' : ''}${r.license ? ' · ' + esc(r.license.length > 36 ? r.license.slice(0, 36) + '…' : r.license) : ''}</span>
        </span>
        <span class="st-badge s-t${r.tier}">${r.tier}</span>
      </a>
    </li>`;
  }

  function renderDomains(ctx) {
    return `
    <p class="st-hint">点一个域，抽屉拉开！</p>
    <div class="st-domains">${ctx.domains.map((d, i) => {
      const previews = d.sections.flatMap((s) => s.items).filter((r) => r.shot).slice(0, 2);
      return `
      <button type="button" class="st-domain st-pop" data-domain="${d.id}" style="--h:${d.hue};--r:${rot(i)}deg">
        <span class="st-dtop"><b>${d.count}</b></span>
        <span class="st-dname">${esc(d.zh)}</span>
        <span class="st-dblurb">${esc(d.blurb)}</span>
        ${previews.length ? `<span class="st-dshots">${previews.map((r) => `<img src="${r.shot}" alt="" loading="lazy">`).join('')}</span>` : ''}
      </button>`;
    }).join('')}</div>`;
  }

  function renderDomain(ctx, d) {
    return `
    <div class="st-dhead" style="--h:${d.hue}">
      <button type="button" class="st-back" data-domain="">‹ 全部域</button>
      <h3>${esc(d.zh)}</h3><span class="st-dmeta">${esc(d.blurb)} · ${d.count} 条</span>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s, si) => `
      <section class="st-sec">
        <header class="st-pop" style="--r:${rot(si, 1)}deg"><h4>${esc(s.zh)}</h4><span>${s.items.length}</span><p>${esc(s.note)}</p></header>
        <ul class="st-rows">${s.items.map((r, i) => entry(ctx, r, i)).join('')}</ul>
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<div class="st-empty st-pop"><p>什么都没找到！</p><button type="button" data-reset>清除全部条件</button></div>`;
    return `<p class="st-hint"><b>${v.total}</b> 条匹配</p>` + v.groups.map((g) => `
      <section class="st-sec">
        <header class="st-pop" style="--h:${g.domain.hue};--r:0deg"><h4>${esc(g.domain.zh)}</h4><span>${g.items.length}</span></header>
        <ul class="st-rows">${g.items.map((r, i) => entry(ctx, r, i)).join('')}</ul>
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#st-view');
    if (!box) return;
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    slamIn(box, ctx);
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#st-q', tier: '#st-tier', access: '#st-access', reach: '#st-reach', lang: '#st-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#st-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#st-catalog').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { ctx.set({ domain: d.dataset.domain }); el.querySelector('#st-catalog').scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth' }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 动效：弹簧砸入 + 抖动 ------------------------------------------------ */
  function slam(el, ctx) {
    if (ctx.reduced) return;
    slamIn(el, ctx);
    // hover 抖动：用 JS 触发以重置动画。正在砸入的贴纸不抖——
    // 抖动会顶掉 animation 简写，抖完再把 st-slam 露出来就等于重播一遍。
    el.addEventListener('mouseover', (e) => {
      const t = e.target.closest('.st-domain, .st-row, .st-skill, .st-bubble, .st-mini');
      if (!t || t.dataset.wig || t.classList.contains('st-slam')) return;
      t.dataset.wig = '1';
      t.classList.add('st-wig');
      const done = () => { t.classList.remove('st-wig'); delete t.dataset.wig; clearTimeout(tid); };
      const tid = setTimeout(done, 700);   // 只是兜底：标签页不可见时动画事件不会来
      t.addEventListener('animationend', done, { once: true });
    });
  }
  function slamIn(scope, ctx) {
    if (ctx.reduced) return;
    // paint() 已经给目录区挂过观察者；整页那次只接手还没人观察的元素，避免同一元素被两个观察者触发。
    const items = scope.querySelectorAll('.st-pop:not(.st-await):not(.st-done)');
    if (!items.length) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (!en.isIntersecting) return;
        const n = en.target;
        io.unobserve(n);
        n.classList.add('st-done');
        const sibs = [...n.parentElement.children].indexOf(n);
        n.style.animationDelay = Math.min(sibs * 45, 500) + 'ms';
        n.classList.add('st-slam');
        // 动画播完摘掉等待态；只认自己的 st-slam，不接子元素冒泡上来的事件。
        const end = (e) => {
          if (e.target !== n || e.animationName !== 'st-slam') return;
          n.removeEventListener('animationend', end);
          n.classList.remove('st-await', 'st-slam');
          n.style.animationDelay = '';
        };
        n.addEventListener('animationend', end);
      });
    }, { threshold: 0.05 });
    items.forEach((n) => { n.classList.add('st-await'); io.observe(n); });
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#st-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
