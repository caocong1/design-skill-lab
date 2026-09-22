/* 风格 15 · 线路图 Metro Map
   十二个域是十二条线路，小节是车站，资源是沿线站点。总览是一张 SVG 线路图（从"目录"枢纽扇出），
   进入一条线后是车厢里那种竖向路线条：S 首选 = 换乘站（双环），A = 普通站，B = 小站。
   动效：列车沿线行驶（SMIL animateMotion）、站点点亮。 */
(function () {
  'use strict';
  DSL.register('metro', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const color = (d) => `hsl(${d.hue} 60% 42%)`;
  const badge = (n, d, cls = '') => `<span class="mt-badge ${cls}" style="--c:${color(d)}">${pad(n)}</span>`;

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    el.innerHTML = `
    <div class="mt-page">
      <header class="mt-head">
        <div class="mt-brand">
          <span class="mt-roundel" aria-hidden="true">M</span>
          <div><h1>Design Skill Lab <small>线路图</small></h1><p>${ctx.totals.domains} 条线 · ${ctx.totals.resources} 站 · ${ctx.totals.s} 个换乘站</p></div>
        </div>
        <nav class="mt-transfer" aria-label="页面风格">
          <span class="mt-transfer-l">换乘其他版式</span>
          ${ctx.content.styles.map((s, i) => `<a class="mt-tbadge" style="--c:hsl(${(i * 47) % 360} 55% 42%)" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.name)} · ${esc(s.en)}"><b>${pad(s.num)}</b><span>${esc(s.name)}</span></a>`).join('')}
        </nav>
      </header>

      <section class="mt-notice-bar">
        <p class="mt-lede">${esc(ctx.content.site.lede)}</p>
        <div class="mt-legend" aria-label="图例">
          <span><i class="mt-m mt-m-S"></i>S 首选 · 换乘站</span>
          <span><i class="mt-m mt-m-A"></i>A 可靠 · 车站</span>
          <span><i class="mt-m mt-m-B"></i>B 备选 · 小站</span>
          <span><i class="mt-m mt-m-sec"></i>小节 · 大站</span>
        </div>
      </section>

      <section class="mt-query" role="search" aria-label="查询">
        <label class="mt-q"><span>查询站点</span><input id="mt-q" type="search" placeholder="名称、用途、标签、授权（按 / 聚焦）" aria-label="搜索资源" autocomplete="off"></label>
        <select id="mt-tier" aria-label="档位"><option value="">全部档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
        <select id="mt-access" aria-label="收费"><option value="">全部收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
        <select id="mt-reach" aria-label="可达性"><option value="">agent 可达</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
        <select id="mt-lang" aria-label="语言"><option value="">全部语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
        <button type="button" id="mt-reset">清除</button>
      </section>

      <div id="mt-view"></div>

      <section class="mt-block" id="mt-suite">
        <header class="mt-bh"><span class="mt-badge mt-badge-k">S</span><h2>skill 线 <small>${ctx.totals.skills} 站 · 套件是设计师：决定、出图、写规格、交接、验收</small></h2></header>
        <ol class="mt-strip mt-strip-k" style="--c:#111">
          ${ctx.content.skills.map(([n, d], i) => `<li class="mt-stop mt-stop-k${i === 0 || i === ctx.content.skills.length - 1 ? ' mt-term' : ''}"><i></i><div><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></div></li>`).join('')}
        </ol>
      </section>

      <div class="mt-two">
        <section class="mt-block" id="mt-how">
          <header class="mt-bh"><span class="mt-badge mt-badge-k">i</span><h2>乘车指南 <small>安装</small></h2></header>
          <pre class="mt-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
          <p class="mt-sub">装好后直接说：</p>
          <ul class="mt-prompts">${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </section>
        <section class="mt-block" id="mt-method">
          <header class="mt-bh"><span class="mt-badge mt-badge-k">!</span><h2>乘客须知 <small>方法与局限</small></h2></header>
          <dl class="mt-method">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        </section>
      </div>

      <section class="mt-block mt-about" id="mt-about">
        <header class="mt-bh"><span class="mt-badge mt-badge-k">?</span><h2>关于本图 <small>${esc(b.name)} ${esc(b.en)}</small></h2></header>
        <p>${esc(b.concept)}</p>
        <dl class="mt-axes">${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="mt-risk"><b>会在哪里失败</b>${esc(b.risk)}</p>
      </section>

      <footer class="mt-foot">
        <span>Design Skill Lab · 原创内容 MIT · 商标归各自所有者 · 截图仅供索引预览</span>
        <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
      </footer>
    </div>`;

    bind(el, ctx);
  }

  /* ---- 总览：SVG 线路图 + 线路表 --------------------------------------------------- */
  function renderMap(ctx) {
    const L = ctx.domains, n = L.length, gap = 46, top = 34;
    const H = top * 2 + (n - 1) * gap, cy = H / 2, hubX = 74, endX = 900, W = 1120;
    const lines = L.map((d, i) => {
      const y = top + i * gap;
      const dx = Math.max(24, Math.abs(y - cy));
      const x1 = hubX + dx;
      const secs = d.sections.filter((s) => s.items.length);
      const sx0 = x1 + 70, sx1 = endX - 40;
      const step = secs.length > 1 ? (sx1 - sx0) / (secs.length - 1) : 0;
      const path = `M ${hubX} ${cy} L ${x1} ${y} H ${endX}`;
      return { d, i, y, path, secs: secs.map((s, k) => ({ s, x: secs.length > 1 ? sx0 + k * step : (sx0 + sx1) / 2 })) };
    });
    return `
    <section class="mt-map-wrap" aria-label="线路图">
      <div class="mt-map-scroll">
        <svg class="mt-map" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="十二条线路从目录枢纽扇出，每条线上的车站是小节">
          ${lines.map(({ d, i, path }) => `<path id="mt-p-${d.id}" class="mt-l-bg" d="${path}"/>`).join('')}
          ${lines.map(({ d, i, y, path, secs }) => `
            <g class="mt-line" data-domain="${d.id}" style="--c:${color(d)}" tabindex="0" role="link" aria-label="${esc(d.zh)}，${d.count} 站">
              <path class="mt-l" d="${path}"/>
              <path class="mt-l-hit" d="${path}"/>
              ${secs.map(({ s, x }) => `<circle class="mt-st" cx="${x.toFixed(1)}" cy="${y}" r="6" data-domain="${d.id}" data-sec="${s.id}"><title>${esc(s.zh)} · ${s.items.length} 站</title></circle>`).join('')}
              <circle class="mt-term-c" cx="${endX}" cy="${y}" r="8"/>
              <text class="mt-tl" x="${endX + 18}" y="${y + 5}">${esc(d.zh)}</text>
              <text class="mt-tn" x="${endX + 18 + d.zh.length * 15 + 6}" y="${y + 5}">${d.count}</text>
              ${ctxRef.reduced ? '' : `<circle class="mt-train" r="5" opacity="0"><set attributeName="opacity" to="1" begin="${(i * 0.9).toFixed(1)}s" fill="freeze"/><animateMotion dur="${(16 + i * 1.3).toFixed(1)}s" begin="${(i * 0.9).toFixed(1)}s" repeatCount="indefinite"><mpath href="#mt-p-${d.id}" xlink:href="#mt-p-${d.id}"/></animateMotion></circle>`}
            </g>`).join('')}
          <circle class="mt-hub" cx="${hubX}" cy="${cy}" r="17"/>
          <text class="mt-hub-t" x="${hubX}" y="${cy + 4}" text-anchor="middle">目录</text>
        </svg>
      </div>
      <p class="mt-map-hint">点线路或终点站进入该线；点车站直达该小节；悬停车站看站名。</p>
    </section>
    <section class="mt-lines" aria-label="线路表">
      ${L.map((d, i) => `
        <button type="button" class="mt-linecard" data-domain="${d.id}" style="--c:${color(d)}">
          ${badge(i + 1, d)}
          <span class="mt-lc-t"><b>${esc(d.zh)}</b><small>${esc(d.blurb)}</small></span>
          <span class="mt-lc-n"><b>${d.count}</b>站 · ${d.sections.filter((s) => s.items.length).length} 大站</span>
        </button>`).join('')}
    </section>`;
  }

  /* ---- 一条线：竖向路线条 -------------------------------------------------------- */
  function stop(ctx, r) {
    return `<li class="mt-stop mt-t${r.tier}">
      <i aria-hidden="true"></i>
      <a class="mt-stop-a" href="${esc(r.url)}" target="_blank" rel="noopener">
        <span class="mt-stop-n">${esc(r.name)}${r.lang !== 'en' ? `<em class="mt-lang">${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</em>` : ''}<em class="mt-tier">${r.tier}</em></span>
        <span class="mt-stop-d">${esc(ctx.zh(r))}</span>
        <span class="mt-stop-m">${esc(ctx.kindZh(r.kind))} · ${esc(ctx.accessZh(r.access))}${r.login ? ' · 需登录' : ''} · ${esc(ctx.reachZh(r.agent_access))}${r.license ? ' · ' + esc(r.license.length > 36 ? r.license.slice(0, 36) + '…' : r.license) : ''}</span>
      </a>
      ${r.shot ? `<img class="mt-shot" src="${r.shot}" alt="" loading="lazy">` : ''}
    </li>`;
  }

  function renderDomain(ctx, d) {
    const i = ctx.domains.indexOf(d);
    const secs = d.sections.filter((s) => s.items.length);
    return `<section class="mt-route" style="--c:${color(d)}">
      <header class="mt-rhead">
        <button type="button" class="mt-back" data-domain="">← 线路图</button>
        ${badge(i + 1, d, 'mt-badge-lg')}
        <div><h2>${esc(d.zh)} <small>${pad(i + 1)} 号线</small></h2><p>${esc(d.blurb)} · ${d.count} 站 · ${secs.length} 大站</p></div>
        <nav class="mt-rnav" aria-label="本线大站">${secs.map((s) => `<a href="#mt-sec-${s.id}">${esc(s.zh)}</a>`).join('')}</nav>
      </header>
      <ol class="mt-strip">
        ${secs.map((s, k) => `
          <li class="mt-major${k === 0 ? ' mt-first' : ''}${k === secs.length - 1 ? ' mt-last' : ''}" id="mt-sec-${s.id}"><i aria-hidden="true"></i><div><h3>${esc(s.zh)}<small>${s.items.length}</small></h3><p>${esc(s.note)}</p></div></li>
          ${s.items.map((r) => stop(ctx, r)).join('')}`).join('')}
      </ol>
    </section>`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<section class="mt-empty"><p>没有到达这些条件的列车。</p><button type="button" class="mt-back" data-reset>清除全部条件</button></section>`;
    return `<section class="mt-results">
      <p class="mt-rsum"><b>${v.total}</b> 站匹配 · ${v.groups.length} 条线</p>
      ${v.groups.map((g) => {
        const i = ctx.domains.indexOf(g.domain);
        return `<section class="mt-route mt-route-s" style="--c:${color(g.domain)}">
          <header class="mt-rhead">${badge(i + 1, g.domain)}<div><h2><button type="button" class="mt-linkbtn" data-domain="${g.domain.id}">${esc(g.domain.zh)}</button> <small>${g.items.length} 站</small></h2></div></header>
          <ol class="mt-strip">${g.items.map((r, k) => stop(ctx, r).replace('class="mt-stop', `class="mt-stop${k === 0 ? ' mt-first' : ''}${k === g.items.length - 1 ? ' mt-last' : ''}`)).join('')}</ol>
        </section>`;
      }).join('')}
    </section>`;
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#mt-view');
    box.innerHTML = v.mode === 'domains' ? renderMap(ctx) : v.mode === 'domain' ? renderDomain(ctx, v.domain) : renderResults(ctx, v);
    if (!ctx.reduced) light(box);
  }

  /* 站点点亮：进入视口的站点依次亮起 */
  function light(scope) {
    const items = scope.querySelectorAll('.mt-stop, .mt-major');
    if (!items.length) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('mt-on'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    items.forEach((n, i) => { n.style.setProperty('--d', `${(i % 8) * 40}ms`); io.observe(n); });
    cleanup.push(() => io.disconnect());
  }

  /* ---- 绑定 -------------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#mt-q', tier: '#mt-tier', access: '#mt-access', reach: '#mt-reach', lang: '#mt-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#mt-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    const go = (to, sec) => {
      const patch = { domain: to };
      if (to) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
      ctx.set(patch); sync();
      const t = sec ? el.querySelector(`#mt-sec-${sec}`) : el.querySelector('#mt-view');
      if (t) t.scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
    };
    el.addEventListener('click', (e) => {
      const st = e.target.closest('[data-sec]');
      if (st) { e.stopPropagation(); go(st.dataset.domain, st.dataset.sec); return; }
      const d = e.target.closest('[data-domain]');
      if (d) { go(d.dataset.domain); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    el.addEventListener('keydown', (e) => {
      const g = e.target.closest('.mt-line');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(g.dataset.domain); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  function focusSearch() {
    const q = document.querySelector('#mt-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; }
})();
