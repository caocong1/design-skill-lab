/* 风格 3 · 书目 Bibliography
   版式：书名页（竖排题名 + 朱印）+ 目录页（十二卷 · 文武线）+ 界行书目行。
   动效：钤印、展卷（clip-path）、墨色渐显。 */
(function () {
  'use strict';
  DSL.register('songban', { mount, unmount, focusSearch });

  let cleanup = [];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* 数字转汉字（1–999） */
  const ZD = '零一二三四五六七八九';
  function numToZh(n) {
    n = Math.floor(Number(n));
    if (!isFinite(n) || n < 0) return '零';
    if (n < 10) return ZD[n];
    if (n < 20) return '十' + (n % 10 ? ZD[n % 10] : '');
    if (n < 100) return ZD[Math.floor(n / 10)] + '十' + (n % 10 ? ZD[n % 10] : '');
    if (n < 1000) {
      const h = Math.floor(n / 100), r = n % 100;
      return ZD[h] + '百' + (r ? (r < 10 ? '零' + ZD[r] : numToZh(r)) : '');
    }
    return String(n);
  }
  /* 域名取繁体，撑住刻本气质；正文说明维持简体数据。 */
  const TRAD = {
    web: '網站設計', 'app-ui': '產品界面', motion: '動效', icons: '圖標',
    assets: '視覺素材', brand: '品牌', graphic: '平面', type: '字體排版',
    color: '色彩', code: '代碼開源', reading: '閱讀', general: '靈感社區',
  };
  const TIER = { S: '甲', A: '乙', B: '丙' };

  function mount(el, ctx) {
    const b = ctx.board();
    const t = ctx.totals;
    el.innerHTML = `
    <div class="sb-page">
      <header class="sb-cover">
        <div class="sb-cover-l">
          <p class="sb-en">DESIGN SKILL LAB · A CATALOGUE OF DESIGN RESOURCES AND AGENT SKILLS</p>
          <p class="sb-fan">凡${numToZh(t.resources)}種，分${numToZh(t.domains)}卷；首選${numToZh(t.s)}，叢書${numToZh(t.skills)}。</p>
          <p class="sb-lede">${esc(ctx.content.site.lede)}</p>
          <nav class="sb-nav">
            <a href="#sb-mulu">目錄</a><a href="#sb-suite">叢書</a><a href="#sb-how">用法</a><a href="#sb-method">凡例</a>
            <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
          </nav>
        </div>
        <div class="sb-cover-r">
          <h1 class="sb-vtitle">設計技能實驗室書目</h1>
          <span class="sb-seal sb-seal-big" aria-hidden="true"><span>設</span><span>計</span></span>
        </div>
      </header>

      <nav class="sb-styles" aria-label="頁面版式">
        <span class="sb-styles-label">版式十種</span>
        ${ctx.content.styles.map((s) => `<a class="sb-sty" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''} title="${esc(s.en)}"><i>${numToZh(s.num)}</i><span>${esc(s.name)}</span></a>`).join('')}
      </nav>

      <section class="sb-board sb-roll" aria-label="当前风格说明">
        <div class="sb-board-frame">
          <h2><span class="sb-seal sb-seal-sm" aria-hidden="true">式</span>本頁版式 · ${esc(b.name)}<span class="sb-board-en">${esc(b.en)}</span></h2>
          <p class="sb-concept">${esc(b.concept)}</p>
          <dl class="sb-axes">${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <p class="sb-risk">会在哪里失败：${esc(b.risk)}</p>
        </div>
      </section>

      <main class="sb-catalog" id="sb-mulu">
        <div class="sb-find" role="search">
          <label class="sb-find-q"><span>查</span><input id="sb-q" type="search" placeholder="輸入名稱、用途、授權（按 / 聚焦）" aria-label="搜索资源" autocomplete="off"></label>
          <label><span>檔</span><select id="sb-tier" aria-label="档位"><option value="">全</option><option value="S">甲 首選</option><option value="A">乙 可靠</option><option value="B">丙 備選</option></select></label>
          <label><span>費</span><select id="sb-access" aria-label="收费"><option value="">全</option><option value="free">免費</option><option value="freemium">部分免費</option><option value="paid">付費</option></select></label>
          <label><span>達</span><select id="sb-reach" aria-label="可达性"><option value="">全</option><option value="static">可直接抓取</option><option value="js">需要瀏覽器</option><option value="blocked">有防護或需登錄</option></select></label>
          <label><span>言</span><select id="sb-lang" aria-label="语言"><option value="">全</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select></label>
          <button type="button" id="sb-reset">淨</button>
        </div>
        <div class="sb-view" id="sb-view"></div>
      </main>

      <section class="sb-suite sb-roll" id="sb-suite">
        <h2>叢書<span class="sb-h2-side">${numToZh(t.skills)}種</span></h2>
        <p class="sb-suite-lede">套件的角色是設計師：決定、出圖、寫規格、交接、驗收。畫圖的媒介永遠是 HTML / CSS / SVG，在目標技術棧裡實現是 coding agent 的事。</p>
        <ol class="sb-skills">${ctx.content.skills.map(([n, d], i) => `
          <li><span class="sb-skno">${numToZh(i + 1)}</span><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}
        </ol>
      </section>

      <section class="sb-how sb-roll" id="sb-how">
        <h2>用法</h2>
        <div class="sb-how-grid">
          <div><h3>裝</h3><pre><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre></div>
          <div><h3>言</h3><ul>${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
        </div>
      </section>

      <section class="sb-method sb-roll" id="sb-method">
        <h2>凡例</h2>
        <dl class="sb-method-grid">${ctx.content.method.map(([t2, d]) => `<div><dt>${esc(t2)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
      </section>

      <footer class="sb-foot">
        <span>Design Skill Lab 藏版</span>
        <span>原創內容以 <a href="${ctx.content.site.repo}/blob/main/LICENSE">MIT</a> 許可發佈；站點名稱與商標歸各自所有者。</span>
      </footer>
    </div>`;

    bind(el, ctx);
    reveal(el, ctx);
  }

  /* ---- 目录渲染 ------------------------------------------------------------ */
  function row(ctx, r) {
    return `
    <li class="sb-row">
      <a href="${esc(r.url)}" target="_blank" rel="noopener">
        <span class="sb-seal sb-t${r.tier}" title="${ctx.tierZh(r.tier)}">${TIER[r.tier]}</span>
        <span class="sb-bmain">
          <span class="sb-bname">${esc(r.name)}${r.lang !== 'en' ? `<i class="sb-lang">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</i>` : ''}</span>
          <span class="sb-note">${esc(ctx.zh(r))}</span>
          <span class="sb-meta">${ctx.kindZh(r.kind)} · ${ctx.accessZh(r.access)}${r.login ? ' · 需登錄' : ''}${r.license ? ' · ' + esc(r.license.length > 40 ? r.license.slice(0, 40) + '…' : r.license) : ''}</span>
        </span>
        ${r.shot
          ? `<img class="sb-thumb" src="${r.shot}" alt="${esc(r.name)} 首頁書影" loading="lazy">`
          : `<span class="sb-thumb sb-noshot" aria-hidden="true">${esc(r.name.slice(0, 1))}</span>`}
      </a>
    </li>`;
  }

  function renderDomains(ctx) {
    return `
    <h3 class="sb-mulu-h">目錄</h3>
    <ol class="sb-mulu">${ctx.domains.map((d, i) => `
      <li><button type="button" data-domain="${d.id}">
        <span class="sb-juan">卷${numToZh(i + 1)}</span>
        <span class="sb-dname">${TRAD[d.id] || esc(d.zh)}</span>
        <span class="sb-dblurb">${esc(d.blurb)}</span>
        <span class="sb-dcount">${numToZh(d.count)}種</span>
      </button></li>`).join('')}</ol>`;
  }

  function renderDomain(ctx, d) {
    return `
    <div class="sb-dhead">
      <button type="button" class="sb-back" data-domain="">‹ 目錄</button>
      <h3>${TRAD[d.id] || esc(d.zh)}</h3>
      <p>${esc(d.blurb)} · ${numToZh(d.count)}種</p>
    </div>
    ${d.sections.filter((s) => s.items.length).map((s) => `
      <section class="sb-sec">
        <header><h4>${esc(s.zh)}</h4><p>${esc(s.note)}</p></header>
        <ol class="sb-rows">${s.items.map((r) => row(ctx, r)).join('')}</ol>
      </section>`).join('')}`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<div class="sb-empty"><p>查無此書。放寬檔位，或換個關鍵詞。</p><button type="button" data-reset>清除全部條件</button></div>`;
    return `<p class="sb-count">得 <b>${v.total}</b> 種</p>` + v.groups.map((g) => `
      <section class="sb-sec">
        <header><h4>${TRAD[g.domain.id] || esc(g.domain.zh)}</h4><p>${numToZh(g.items.length)}種</p></header>
        <ol class="sb-rows">${g.items.map((r) => row(ctx, r)).join('')}</ol>
      </section>`).join('');
  }

  function paint(el, ctx) {
    const v = ctx.view();
    const box = el.querySelector('#sb-view');
    if (!box) return;
    box.classList.remove('sb-dealt');
    if (v.mode === 'domains') box.innerHTML = renderDomains(ctx);
    else if (v.mode === 'domain') box.innerHTML = renderDomain(ctx, v.domain);
    else box.innerHTML = renderResults(ctx, v);
    if (!ctx.reduced) requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('sb-dealt')));
    else box.classList.add('sb-dealt');
  }

  /* ---- 交互 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#sb-q', tier: '#sb-tier', access: '#sb-access', reach: '#sb-reach', lang: '#sb-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#sb-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#sb-mulu').addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) { ctx.set({ domain: d.dataset.domain }); return; }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint(el, ctx)));
    paint(el, ctx);
  }

  /* ---- 动效：钤印 + 展卷 ---------------------------------------------------- */
  function reveal(el, ctx) {
    // clip-path 会把自己裁成零面积，IntersectionObserver 永远看不到它；
    // 所以观察外层 .sb-roll，裁剪作用在包出来的内层 .sb-rl 上。
    el.querySelectorAll('.sb-roll').forEach((sec) => {
      const inner = document.createElement('div');
      inner.className = 'sb-rl';
      while (sec.firstChild) inner.appendChild(sec.firstChild);
      sec.appendChild(inner);
    });
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('sb-open'); io.unobserve(en.target); } });
    }, { threshold: 0.05 });
    el.querySelectorAll('.sb-roll').forEach((n) => io.observe(n));
    // 封面朱印：载入后落印
    if (!ctx.reduced) {
      requestAnimationFrame(() => el.querySelectorAll('.sb-cover .sb-seal, .sb-board .sb-seal').forEach((n, i) => {
        n.style.animationDelay = `${300 + i * 260}ms`;
        n.classList.add('sb-stamp');
      }));
    }
    cleanup.push(() => io.disconnect());
  }

  function focusSearch() {
    const q = document.querySelector('#sb-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; }
})();
