/* 风格 8 · 控制台 Control Console
   机房值班台：顶部状态栏 + 左侧仪器轨（雷达/指令面板）+ 面板阵主区。
   动效：雷达扫描、电平升起、数字跳变、面板依次上电。克制，无发光。 */
(function () {
  'use strict';
  DSL.register('console', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n, w = 2) => String(n).padStart(w, '0');

  /* 五段电平表：fill 为点亮段数 */
  function meter(n, max, cls = '') {
    const fill = Math.max(1, Math.round((n / Math.max(1, max)) * 5));
    return `<span class="cc-meter ${cls}" role="img" aria-label="${n} 条">${[0, 1, 2, 3, 4].map((i) =>
      `<i class="${i < fill ? 'on' : ''}" style="--d:${i}"></i>`).join('')}</span>`;
  }
  /* 档位三格电平：S 满 / A 二 / B 一 */
  function tierLv(t) {
    const n = t === 'S' ? 3 : t === 'A' ? 2 : 1;
    return `<span class="cc-lv cc-lv${t}" title="档位 ${t}">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}<b>${t}</b></span>`;
  }

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    const counts = { S: 0, A: 0, B: 0 };
    ctx.domains.forEach((d) => d.sections.forEach((s) => s.items.forEach((r) => { counts[r.tier]++; })));
    const peak = Math.max(...ctx.domains.map((d) => d.count));

    el.innerHTML = `
    <div class="cc-deck">
      <header class="cc-status">
        <span class="cc-brand"><i></i>DSL/OPS</span>
        <div class="cc-meters" role="group" aria-label="按域筛选">
          ${ctx.domains.map((d, i) => `
            <button type="button" data-domain="${d.id}" class="cc-mtr" title="${esc(d.zh)} · ${d.count} 条" aria-pressed="false">
              ${meter(d.count, peak)}<span class="cc-mtr-id">${pad(i + 1)}</span>
            </button>`).join('')}
        </div>
        <div class="cc-meta">
          <span class="cc-tally">S<b>${counts.S}</b> A<b>${counts.A}</b> B<b>${counts.B}</b></span>
          <span class="cc-clock" id="cc-clock">--:--:--</span>
        </div>
      </header>

      <div class="cc-body">
        <aside class="cc-rail">
          <section class="cc-panel cc-radar-panel" aria-label="域方位图">
            <h2>SCAN</h2>
            <div class="cc-radar">
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="100" cy="100" r="96" class="cc-ring"/>
                <circle cx="100" cy="100" r="64" class="cc-ring"/>
                <circle cx="100" cy="100" r="32" class="cc-ring"/>
                <line x1="100" y1="4" x2="100" y2="196" class="cc-cross"/>
                <line x1="4" y1="100" x2="196" y2="100" class="cc-cross"/>
                ${ctx.domains.map((d, i) => {
                  const a = (i / ctx.domains.length) * Math.PI * 2 - Math.PI / 2;
                  const x = (100 + Math.cos(a) * 80).toFixed(1), y = (100 + Math.sin(a) * 80).toFixed(1);
                  return `<circle cx="${x}" cy="${y}" r="4.5" class="cc-blip" data-blip="${d.id}"/>`;
                }).join('')}
              </svg>
              <div class="cc-sweep" aria-hidden="true"></div>
            </div>
            <p class="cc-radar-legend" id="cc-radar-legend">全部域 · ${ctx.totals.resources} 条在线</p>
          </section>

          <section class="cc-panel cc-cmd" aria-label="指令面板">
            <h2>CMD</h2>
            <label class="cc-query"><span>&gt;</span><input id="cc-q" type="search" placeholder="QUERY_" aria-label="搜索资源" autocomplete="off" spellcheck="false"></label>
            <div class="cc-sels">
              <label>TIER <select id="cc-tier"><option value="">ALL</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select></label>
              <label>ACCS <select id="cc-access"><option value="">ALL</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select></label>
              <label>REACH <select id="cc-reach"><option value="">ALL</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select></label>
              <label>LANG <select id="cc-lang"><option value="">ALL</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select></label>
            </div>
            <button type="button" class="cc-rst" id="cc-reset">RST</button>
          </section>

          <section class="cc-panel cc-style-panel" aria-label="版式选择">
            <h2>STYLE <span>版式 · 1–0 · [ ]</span></h2>
            <div class="cc-bank">
              ${ctx.content.styles.map((s) => `<a class="cc-key" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.name)} · ${esc(s.en)}"><i aria-hidden="true"></i><b>${pad(s.num)}</b><span>${esc(s.name)}</span></a>`).join('')}
            </div>
          </section>
        </aside>

        <div class="cc-main">
          <section class="cc-panel cc-hero">
            <h2>SYSTEM OVERVIEW <span>设计技能实验室 · 在线</span></h2>
            <div class="cc-stats">
              <div class="cc-stat"><b data-n="${ctx.totals.resources}">0</b><span>资源 RESOURCES</span></div>
              <div class="cc-stat"><b data-n="${ctx.totals.domains}">0</b><span>域 DOMAINS</span></div>
              <div class="cc-stat"><b data-n="${ctx.totals.s}">0</b><span>首选 TIER S</span></div>
              <div class="cc-stat"><b data-n="${ctx.totals.skills}">0</b><span>SKILLS</span></div>
            </div>
            <p class="cc-lede">${esc(ctx.content.site.lede)}</p>
            <div class="cc-histo" id="cc-histo" role="group" aria-label="各域条目分布，点击选中">
              ${ctx.domains.map((d, i) => `
                <button type="button" data-domain="${d.id}" class="cc-bar" style="--v:${(d.count / peak).toFixed(3)}" title="${esc(d.zh)} · ${d.count}">
                  <i></i><span>${pad(i + 1)}</span>
                </button>`).join('')}
            </div>
          </section>

          <section class="cc-panel cc-config">
            <h2>CONFIG <span>${esc(b.name)} ${esc(b.en)}</span></h2>
            <div class="cc-kv">
              <p><span>concept</span><em>${esc(b.concept)}</em></p>
              ${Object.entries(b.axes).map(([k, v]) => `<p><span>${esc(k)}</span><em>${esc(v)}</em></p>`).join('')}
              <p><span>risk</span><em class="cc-warn">${esc(b.risk)}</em></p>
            </div>
          </section>

          <div id="cc-view" aria-live="polite"></div>

          <section class="cc-panel cc-modules">
            <h2>MODULES <span>${ctx.totals.skills} loaded</span></h2>
            <ul>${ctx.content.skills.map(([n, d]) => `
              <li><i class="cc-dot"></i><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}
            </ul>
          </section>

          <section class="cc-panel cc-boot">
            <h2>BOOT SCRIPT <span>怎么用</span></h2>
            <pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
            <ul>${ctx.content.usage.prompts.map((p) => `<li># ${esc(p)}</li>`).join('')}</ul>
          </section>

          <section class="cc-panel cc-notes">
            <h2>NOTES <span>方法与局限</span></h2>
            <ol>${ctx.content.method.map(([t, d], i) => `<li><span>${pad(i + 1)}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join('')}</ol>
          </section>

          <footer class="cc-foot">
            <span>DSL/OPS · DESIGN SKILL LAB</span>
            <span>原创内容 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> · 商标归各自所有者 · <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a></span>
          </footer>
        </div>
      </div>
    </div>`;

    bind(el, ctx);
    clock(ctx);
    countUp(el, ctx);
    powerOn(el, ctx);
  }

  /* ---- 目录渲染 ------------------------------------------------------------ */
  function row(ctx, r, i) {
    return `
    <li class="cc-row-wrap"><a class="cc-row" href="${esc(r.url)}" target="_blank" rel="noopener">
      <span class="cc-c-lv">${tierLv(r.tier)}</span>
      ${r.shot ? `<img class="cc-thumb" src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">` : '<span class="cc-thumb cc-none" aria-hidden="true"></span>'}
      <span class="cc-c-name">${esc(r.name)}${r.lang !== 'en' ? `<em class="cc-lang">${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</em>` : ''}</span>
      <span class="cc-c-desc">${esc(ctx.zh(r))}</span>
      <span class="cc-c-meta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登录' : ''}</span>
    </a></li>`;
  }

  function renderDomains(ctx) {
    const peak = Math.max(...ctx.domains.map((d) => d.count));
    return `<section class="cc-panel cc-gridpanel">
      <h2>DOMAINS <span>12 个域在线 · 点击进入</span></h2>
      <div class="cc-grid">${ctx.domains.map((d, i) => {
        const shots = d.sections.flatMap((s) => s.items).filter((r) => r.shot).slice(0, 2);
        return `
        <button type="button" class="cc-dpanel" data-domain="${d.id}" style="--i:${i}">
          <span class="cc-dp-head"><span class="cc-dp-id">${pad(i + 1)}</span><span class="cc-dp-name">${esc(d.zh)}</span>${meter(d.count, peak)}</span>
          <span class="cc-dp-count">${d.count}</span>
          <span class="cc-dp-blurb">${esc(d.blurb)}</span>
          <span class="cc-dp-shots">${shots.map((r) => `<img src="${r.shot}" alt="" loading="lazy">`).join('')}</span>
        </button>`;
      }).join('')}</div>
    </section>`;
  }

  function renderDomain(ctx, d) {
    let n = 0;
    return `
    <section class="cc-panel cc-tablepanel">
      <h2><button type="button" class="cc-back" data-domain="">◂ ALL</button> ${esc(d.zh)} <span>${esc(d.blurb)} · ${d.count} 条</span></h2>
      ${d.sections.filter((s) => s.items.length).map((s) => `
        <div class="cc-tsec">
          <header><span>${esc(s.zh)}</span><em>${esc(s.note)}</em><b>${s.items.length}</b></header>
          <ul class="cc-table">${s.items.map((r) => row(ctx, r, n++)).join('')}</ul>
        </div>`).join('')}
    </section>`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<section class="cc-panel cc-tablepanel"><h2>QUERY RESULT <span>0</span></h2>
      <div class="cc-empty"><p>没有符合条件的资源。</p><button type="button" data-reset>RST 清除条件</button></div></section>`;
    return `<section class="cc-panel cc-tablepanel">
      <h2>QUERY RESULT <span>${v.total} 条匹配</span></h2>
      ${v.groups.map((g) => `
        <div class="cc-tsec">
          <header><span>${esc(g.domain.zh)}</span><em>${esc(g.domain.blurb)}</em><b>${g.items.length}</b></header>
          <ul class="cc-table">${g.items.map((r, i) => row(ctx, r, i)).join('')}</ul>
        </div>`).join('')}
    </section>`;
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#cc-view');
    if (box) {
      box.classList.remove('cc-up');
      if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
      else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
      else box.innerHTML = renderResults(ctx, v);
      if (!ctx.reduced) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('cc-up')));
      else box.classList.add('cc-up');
    }
    // 状态同步：电平表、雷达方位点、直方图
    el.querySelectorAll('.cc-mtr').forEach((m) => m.setAttribute('aria-pressed', String(m.dataset.domain === ctx.state.domain)));
    el.querySelectorAll('.cc-blip').forEach((p) => p.classList.toggle('cc-hot', p.dataset.blip === ctx.state.domain));
    el.querySelectorAll('.cc-bar').forEach((bar) => bar.classList.toggle('cc-hot', bar.dataset.domain === ctx.state.domain));
    const legend = el.querySelector('#cc-radar-legend');
    if (legend) {
      const d = ctx.domains.find((x) => x.id === ctx.state.domain);
      legend.textContent = d ? `${d.zh} · ${d.count} 条` : `全部域 · ${ctx.totals.resources} 条在线`;
    }
  }

  /* ---- 绑定 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#cc-q', tier: '#cc-tier', access: '#cc-access', reach: '#cc-reach', lang: '#cc-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { const n = el.querySelector(s); if (n) n.value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#cc-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) {
        const dom = d.dataset.domain;
        const to = dom === ctx.state.domain ? '' : dom;
        // 点域 = 导航意图：清掉文本与筛选条件，滚到目录区。
        const patch = { domain: to };
        if (to) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
        ctx.set(patch);
        if (to) { sync(); el.querySelector('#cc-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' }); }
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  /* ---- 仪表：时钟 / 数字跳变 / 上电 ------------------------------------------ */
  function clock(ctx) {
    const t = () => {
      const n = elRef && elRef.querySelector('#cc-clock');
      if (n) n.textContent = new Date().toISOString().slice(11, 19) + 'Z';
    };
    t();
    const iv = setInterval(t, 1000);
    cleanup.push(() => clearInterval(iv));
  }
  function countUp(el, ctx) {
    const nums = [...el.querySelectorAll('.cc-stat b')];
    if (ctx.reduced) { nums.forEach((b) => { b.textContent = b.dataset.n; }); return; }
    const t0 = performance.now(), dur = 900;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      nums.forEach((b) => { b.textContent = Math.round(Number(b.dataset.n) * e); });
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function powerOn(el, ctx) {
    if (ctx.reduced) { el.querySelectorAll('.cc-panel').forEach((p) => p.classList.add('cc-on')); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('cc-on'); io.unobserve(en.target); } });
    }, { threshold: 0.05 });
    el.querySelectorAll('.cc-main > .cc-panel, .cc-rail > .cc-panel').forEach((p, i) => {
      p.style.setProperty('--pd', `${(i % 6) * 60}ms`);
      io.observe(p);
    });
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#cc-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; }
})();
