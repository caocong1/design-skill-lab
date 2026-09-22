/* 风格 6 · 卡片柜 Card Catalogue
   版式：图书馆卡片目录柜。12 个抽屉 = 12 个域，点抽屉拉出一格索引卡。
   动效：抽屉拉出、卡片翻转入场、档位盖章、抽卡 hover。 */
(function () {
  'use strict';
  DSL.register('cards', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');

  function mount(el, ctx) {
    const b = ctx.board();
    el.innerHTML = `
    <div class="cd-desk">
      <header class="cd-top">
        <span class="cd-mark">Design Skill Lab</span>
        <nav>
          <a href="#cd-catalog">目录柜</a><a href="#cd-suite">套件</a><a href="#cd-how">方法</a>
          <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
      </header>

      <nav class="cd-guides" aria-label="页面风格">
        <span class="cd-guides-label">风格导卡</span>
        ${ctx.content.styles.map((s) => `<a class="cd-guide" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.name)} · ${esc(s.en)}"><i class="cd-guide-tab" aria-hidden="true"></i><b>${pad(s.num)}</b><span>${esc(s.name)}</span></a>`).join('')}
      </nav>

      <section class="cd-hero">
        <div class="cd-card cd-titlecard">
          <span class="cd-hole"></span>
          <h1>设计资源<br>目录柜</h1>
          <p class="cd-sub">DESIGN SKILL LAB · 设计技能实验室</p>
          <p class="cd-lede">${esc(ctx.content.site.lede)}</p>
          <dl class="cd-form">
            <div><dt>资源</dt><dd>${ctx.totals.resources} 条</dd></div>
            <div><dt>域</dt><dd>${ctx.totals.domains} 个抽屉</dd></div>
            <div><dt>首选</dt><dd>${ctx.totals.s} 条</dd></div>
            <div><dt>套件</dt><dd>${ctx.totals.skills} 个 skill</dd></div>
          </dl>
        </div>
        <div class="cd-card cd-board">
          <span class="cd-hole"></span>
          <h2>方向卡 · ${esc(b.name)} ${esc(b.en)}</h2>
          <p>${esc(b.concept)}</p>
          <table><tbody>${Object.entries(b.axes).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
          <p class="cd-risk">会在哪里失败：${esc(b.risk)}</p>
        </div>
      </section>

      <section class="cd-catalog" id="cd-catalog">
        <div class="cd-cabinet">
          <div class="cd-cabinet-top">
            <span class="cd-plate">CARD CATALOGUE · 目录柜</span>
            <div class="cd-tools" role="search">
              <input id="cd-q" type="search" placeholder="检字：名称、用途、授权…（/ 聚焦）" aria-label="搜索资源" autocomplete="off">
              <select id="cd-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
              <select id="cd-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
              <select id="cd-reach" aria-label="可达性"><option value="">可达</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
              <select id="cd-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
              <button type="button" id="cd-reset" aria-label="重置">归位</button>
            </div>
          </div>
          <div class="cd-drawers" id="cd-drawers">
            ${ctx.domains.map((d, i) => `
            <button type="button" class="cd-drawer" data-domain="${d.id}" style="--i:${i}" aria-pressed="false">
              <span class="cd-dlabel"><span class="cd-dname">${esc(d.zh)}</span><span class="cd-dblurb">${esc(d.blurb)}</span></span>
              <span class="cd-dcount">${d.count}</span>
              <span class="cd-pull" aria-hidden="true"></span>
            </button>`).join('')}
          </div>
          <div class="cd-tray" id="cd-tray"></div>
        </div>
      </section>

      <section class="cd-suite" id="cd-suite">
        <h2>skill 套件 <span>一叠 ${pad(ctx.totals.skills)} 张卡</span></h2>
        <p class="cd-suite-lede">套件的角色是设计师：决定、出图、写规格、交接、验收。在 Flutter、鸿蒙、小程序、Tauri 里实现是 coding agent 的事。</p>
        <ol class="cd-stack">
          ${ctx.content.skills.map(([n, d], i) => `
          <li class="cd-minicard" style="--i:${i}"><span class="cd-mno">${pad(i + 1)}</span><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}
        </ol>
      </section>

      <section class="cd-how" id="cd-how">
        <h2>怎么用与方法</h2>
        <div class="cd-how-grid">
          <div class="cd-card cd-notecard">
            <span class="cd-hole"></span>
            <h3>安装（整套一起装）</h3>
            <pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
          </div>
          <div class="cd-card cd-notecard">
            <span class="cd-hole"></span>
            <h3>装好后直接说</h3>
            <ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          </div>
          ${ctx.content.method.map(([t, d]) => `
          <div class="cd-card cd-notecard">
            <span class="cd-hole"></span>
            <h3>${esc(t)}</h3>
            <p>${esc(d)}</p>
          </div>`).join('')}
        </div>
      </section>

      <footer class="cd-foot">
        <span>DESIGN SKILL LAB · CARD CATALOGUE</span>
        <span>原创内容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 许可发布；站点名称与商标归各自所有者。</span>
      </footer>
    </div>`;

    bind(el, ctx);
    reveal(el, ctx);
  }

  /* ---- 目录渲染 ------------------------------------------------------------ */
  function card(ctx, r, i) {
    const lic = r.license ? (r.license.length > 36 ? r.license.slice(0, 36) + '…' : r.license) : '';
    return `
    <li class="cd-cell" style="--d:${Math.min(i, 11) * 45}ms">
      <a class="cd-card cd-entry" href="${esc(r.url)}" target="_blank" rel="noopener">
        <span class="cd-hole"></span>
        <span class="cd-ehead">
          <span class="cd-ename">${esc(r.name)}${r.lang !== 'en' ? `<sup>${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</sup>` : ''}</span>
          <span class="cd-stamp cd-t${r.tier}">${r.tier}</span>
        </span>
        <span class="cd-edesc">${esc(ctx.zh(r))}</span>
        ${r.shot
          ? `<img class="cd-shot" src="${r.shot}" alt="${esc(r.name)} 首页截图" loading="lazy">`
          : `<span class="cd-shot cd-noshot">${esc(r.name.slice(0, 1))}</span>`}
        <span class="cd-emeta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登录' : ''}${lic ? ' · ' + esc(lic) : ''}</span>
      </a>
    </li>`;
  }

  function renderIdle(ctx) {
    return `
    <div class="cd-card cd-idle">
      <span class="cd-hole"></span>
      <p><b>${ctx.totals.resources}</b> 条资源分装在 <b>${ctx.totals.domains}</b> 个抽屉里，其中 <b>${ctx.totals.s}</b> 条是同类首选（S）。</p>
      <p>拉开一个抽屉按小节翻阅，或在检字盘里直接搜索；档位、收费、可达性可以叠加筛选。</p>
    </div>`;
  }

  function renderDomain(ctx, d) {
    return `
    <div class="cd-tray-head">
      <button type="button" class="cd-back" data-domain="">‹ 全部抽屉</button>
      <h3>${esc(d.zh)}</h3>
      <p>${esc(d.blurb)} · ${d.count} 条</p>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <section class="cd-sec">
        <header><h4>${esc(s.zh)}</h4><p>${esc(s.note)}</p><span>${s.items.length} 张</span></header>
        <ol class="cd-grid">${s.items.map((r, i) => card(ctx, r, i)).join('')}</ol>
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) {
      return `<div class="cd-card cd-idle"><span class="cd-hole"></span><p>没有符合条件的卡片。试试放宽档位或换个关键词。</p><button type="button" class="cd-back" data-reset>清除全部条件</button></div>`;
    }
    return `<p class="cd-count"><b>${v.total}</b> 条匹配</p>` + v.groups.map((g) => `
      <section class="cd-sec">
        <header><h4>${esc(g.domain.zh)}</h4><p>${esc(g.domain.blurb)}</p><span>${g.items.length} 张</span></header>
        <ol class="cd-grid">${g.items.map((r, i) => card(ctx, r, i)).join('')}</ol>
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#cd-tray');
    if (!box) return;
    box.classList.remove('cd-in');
    if (v.mode === 'domains') box.innerHTML = renderIdle(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    el.querySelectorAll('.cd-drawer').forEach((dr) => {
      dr.setAttribute('aria-pressed', String(dr.dataset.domain === (ctx.state.domain || '')));
    });
    if (!ctx.reduced) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('cd-in')));
    else box.classList.add('cd-in');
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#cd-q', tier: '#cd-tier', access: '#cd-access', reach: '#cd-reach', lang: '#cd-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#cd-reset').addEventListener('click', () => { ctx.reset(); sync(); });

    el.querySelector('#cd-catalog').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) {
        ctx.set({ domain: d.dataset.domain });
        if (d.dataset.domain) {
          setTimeout(() => el.querySelector('#cd-tray').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' }), 120);
        }
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });

    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 进场动效 ------------------------------------------------------------ */
  function reveal(el, ctx) {
    if (ctx.reduced) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('cd-vis'); io.unobserve(en.target); } });
    }, { threshold: 0.06 });
    el.querySelectorAll('.cd-titlecard, .cd-board, .cd-suite, .cd-how, .cd-foot').forEach((n) => { n.classList.add('cd-pre'); io.observe(n); });
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#cd-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
