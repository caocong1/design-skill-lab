/* 风格 5 · 蓝图 Blueprint
   整张页面是一张晒蓝工程图：线框图框、方格纸、明细表目录、右下角图签。
   动效：图框自绘、尺寸标注伸展、注记画圈。 */
(function () {
  'use strict';
  DSL.register('blueprint', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n, w = 2) => String(n).padStart(w, '0');

  function mount(el, ctx) {
    const b = ctx.board();
    const today = new Date().toISOString().slice(0, 10);
    el.innerHTML = `
    <div class="bp-sheet">
      <i class="bp-edge bp-edge-n" aria-hidden="true"></i><i class="bp-edge bp-edge-e" aria-hidden="true"></i>
      <i class="bp-edge bp-edge-s" aria-hidden="true"></i><i class="bp-edge bp-edge-w" aria-hidden="true"></i>
      <i class="bp-inner" aria-hidden="true"></i>
      <i class="bp-crop bp-crop-tl"></i><i class="bp-crop bp-crop-tr"></i><i class="bp-crop bp-crop-bl"></i><i class="bp-crop bp-crop-br"></i>

      <header class="bp-head">
        <span class="bp-logo">DSL<em>設計技能實驗室</em></span>
        <nav class="bp-nav">
          <a href="#bp-cat">圖紙目錄</a><a href="#bp-suite">構件表</a><a href="#bp-notes">注記</a>
          <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
      </header>

      <nav class="bp-sheets" aria-label="版式圖幅">
        <span class="bp-sheets-label">圖幅<em>SHEET</em></span>
        ${ctx.content.styles.map((s) => `<a class="bp-sht" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.en)}"><b>${pad(s.num)}</b><span>${esc(s.name)}</span></a>`).join('')}
      </nav>

      <section class="bp-hero">
        <div class="bp-hero-l">
          <p class="bp-kicker">總說明 GENERAL</p>
          <h1>設計資源總目錄</h1>
          <div class="bp-dim" aria-hidden="true">
            <span class="bp-dim-tick"></span><span class="bp-dim-line"><i></i></span>
            <span class="bp-dim-num">${ctx.totals.resources}</span>
            <span class="bp-dim-line"><i></i></span><span class="bp-dim-tick"></span>
          </div>
          <p class="bp-lede">${esc(ctx.content.site.lede)}</p>
          <table class="bp-stats"><tbody><tr>
            <td><b>${ctx.totals.resources}</b><span>資源</span></td>
            <td><b>${ctx.totals.domains}</b><span>域</span></td>
            <td><b>${ctx.totals.s}</b><span>首選 S</span></td>
            <td><b>${ctx.totals.skills}</b><span>構件 skill</span></td>
          </tr></tbody></table>
        </div>
        <aside class="bp-board" aria-label="當前風格說明">
          <h2>設計說明 <span>${esc(b.en)}</span></h2>
          <p>${esc(b.concept)}</p>
          <table><tbody>${Object.entries(b.axes).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
          <p class="bp-risk">會在哪裡失敗：${esc(b.risk)}</p>
        </aside>
      </section>

      <section class="bp-cat" id="bp-cat">
        <div class="bp-tools" role="search">
          <span class="bp-tools-label">檢索</span>
          <input id="bp-q" type="search" placeholder="名稱 / 用途 / 授權（按 / 聚焦）" aria-label="搜索資源" autocomplete="off">
          <select id="bp-tier" aria-label="檔位"><option value="">檔位</option><option value="S">S 首選</option><option value="A">A 可靠</option><option value="B">B 備選</option></select>
          <select id="bp-access" aria-label="收費"><option value="">收費</option><option value="free">免費</option><option value="freemium">部分免費</option><option value="paid">付費</option></select>
          <select id="bp-reach" aria-label="可達性"><option value="">可達性</option><option value="static">可抓取</option><option value="js">需瀏覽器</option><option value="blocked">有防護</option></select>
          <select id="bp-lang" aria-label="語言"><option value="">語言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
          <button type="button" id="bp-reset">重置</button>
        </div>
        <div id="bp-view"></div>
      </section>

      <section class="bp-suite" id="bp-suite">
        <h2 class="bp-h2">構件表 <span>PARTS · ${ctx.totals.skills}</span></h2>
        <p class="bp-note">套件的角色是設計師：決定、出圖、寫規格、交接、驗收。在目標技術棧裡實現是 coding agent 的事。</p>
        <table class="bp-tbl">
          <thead><tr><th>序</th><th>構件</th><th>用途</th></tr></thead>
          <tbody>${ctx.content.skills.map(([n, d], i) => `
            <tr><td class="bp-c">${pad(i + 1)}</td>
            <td><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a></td>
            <td>${esc(d)}</td></tr>`).join('')}
          </tbody>
        </table>
      </section>

      <section class="bp-notes" id="bp-notes">
        <h2 class="bp-h2">注記 <span>NOTES</span></h2>
        <div class="bp-notegrid">
          <div class="bp-note1">
            ${noteSvg(1)}<h3>安裝</h3>
            <pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
          </div>
          <div class="bp-note2">
            ${noteSvg(2)}<h3>直接說需求</h3>
            <ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          </div>
          <div class="bp-note3">
            ${noteSvg(3)}<h3>支點與局限</h3>
            <dl>${ctx.content.method.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>
          </div>
        </div>
      </section>

      <footer class="bp-foot">
        <table class="bp-titleblock" aria-label="圖簽">
          <tbody>
            <tr><th>項目</th><td>DESIGN SKILL LAB</td><th>比例</th><td>1:${ctx.totals.resources}</td></tr>
            <tr><th>圖號</th><td>DSL-2026-05</td><th>張</th><td>5 / 10</td></tr>
            <tr><th>風格</th><td>藍圖 BLUEPRINT</td><th>日期</th><td>${today}</td></tr>
            <tr><th>許可</th><td colspan="3"><a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> · 商標歸各自所有者</td></tr>
          </tbody>
        </table>
      </footer>
    </div>`;

    bind(el, ctx);
    draw(el, ctx);
  }

  function noteSvg(n) {
    return `<svg class="bp-note-no" viewBox="0 0 44 44" aria-hidden="true">
      <circle class="bp-ring" cx="22" cy="22" r="19" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <text x="22" y="28" text-anchor="middle" font-size="16" fill="currentColor" stroke="none">${n}</text>
    </svg>`;
  }

  /* ---- 目錄渲染 ------------------------------------------------------------ */
  function balloon(r) {
    return `<span class="bp-bal bp-bal-${r.tier}" title="檔位 ${r.tier}">${r.tier}</span>`;
  }
  function shotImg(r) {
    if (!r.shot) return '<span class="bp-noshot">—</span>';
    return `<span class="bp-shot"><img src="${r.shot}" alt="${esc(r.name)} 首頁截圖" loading="lazy"><i></i><i></i></span>`;
  }
  function row(ctx, r, num) {
    return `<tr>
      <td class="bp-c">${balloon(r)}</td>
      <td class="bp-no">${num}</td>
      <td class="bp-thumbcell">${shotImg(r)}</td>
      <td class="bp-name"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>${r.lang !== 'en' ? `<sup>${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</sup>` : ''}</td>
      <td class="bp-desc">${esc(ctx.zh(r))}</td>
      <td class="bp-meta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登錄' : ''}</td>
    </tr>`;
  }

  function renderDomains(ctx) {
    return `
    <h3 class="bp-tblcap">圖紙目錄 <span>SHEET INDEX</span></h3>
    <table class="bp-tbl bp-tbl-hover">
      <thead><tr><th>圖號</th><th>圖名</th><th>內容</th><th>張數</th></tr></thead>
      <tbody>${ctx.domains.map((d, i) => `
        <tr data-domain="${d.id}" tabindex="0" role="button" aria-label="查看 ${esc(d.zh)}">
          <td class="bp-no">A-${pad(i + 1)}</td>
          <td class="bp-name">${esc(d.zh)}</td>
          <td class="bp-desc">${esc(d.blurb)}</td>
          <td class="bp-c">${d.count}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  }

  function renderDomain(ctx, d) {
    return `
    <div class="bp-backrow">
      <button type="button" class="bp-back" data-domain="">← 圖紙目錄</button>
      <h3>${esc(d.zh)}</h3><span class="bp-dmeta">A-${pad(ctx.domains.findIndex((x) => x.id === d.id) + 1)} · ${esc(d.blurb)} · ${d.count} 條</span>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s, si) => `
      <h3 class="bp-tblcap">分項明細表 <span>A-${pad(ctx.domains.findIndex((x) => x.id === d.id) + 1)}.${si + 1} · ${esc(s.zh)} · 1:${s.items.length}</span></h3>
      <p class="bp-secnote">${esc(s.note)}</p>
      <table class="bp-tbl">
        <thead><tr><th></th><th>序</th><th>圖</th><th>名稱</th><th>說明</th><th>備注</th></tr></thead>
        <tbody>${s.items.map((r, ri) => row(ctx, r, `${pad(si + 1)}-${pad(ri + 1)}`)).join('')}</tbody>
      </table>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<div class="bp-empty"><p>沒有符合條件的資源。</p><button type="button" data-reset>清除條件</button></div>`;
    return `<h3 class="bp-tblcap">檢索結果 <span>${v.total} 條</span></h3>` + v.groups.map((g) => `
      <table class="bp-tbl">
        <thead><tr><th></th><th>序</th><th>圖</th><th>${esc(g.domain.zh)}</th><th>說明</th><th>備注</th></tr></thead>
        <tbody>${g.items.map((r, ri) => row(ctx, r, pad(ri + 1))).join('')}</tbody>
      </table>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#bp-view');
    if (!box) return;
    box.classList.remove('bp-in');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    if (!ctx.reduced) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('bp-in')));
    else box.classList.add('bp-in');
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#bp-q', tier: '#bp-tier', access: '#bp-access', reach: '#bp-reach', lang: '#bp-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#bp-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    const cat = el.querySelector('#bp-cat');
    cat.addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { ctx.set({ domain: d.dataset.domain }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cat.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const d = e.target.closest('[data-domain]');
      if (d) { e.preventDefault(); ctx.set({ domain: d.dataset.domain }); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 動效：線條自繪 + 注記畫圈 --------------------------------------------- */
  function draw(el, ctx) {
    if (ctx.reduced) return;
    requestAnimationFrame(() => requestAnimationFrame(() => el.querySelector('.bp-sheet').classList.add('bp-drawn')));
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('bp-vis'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    el.querySelectorAll('.bp-suite, .bp-notes, .bp-foot, .bp-board').forEach((n) => { n.classList.add('bp-pre'); io.observe(n); });
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#bp-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
