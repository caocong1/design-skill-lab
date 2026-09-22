/* 风格 14 · 字样 Type Specimen
   一份字体样张：十二个域各配一种系统字体气质（来自 typography.md 的"按气质选系统字体栈"表）。
   大字看字形、小字看正文、字号瀑布、度量线。纸白 + 墨黑，仅此。动效：样字换字体。 */
(function () {
  'use strict';
  DSL.register('specimen', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');

  /* 十二种气质，按域顺序分配。stack 是真实的系统字体栈：拉丁在前，中文伴随其后。 */
  const VOICES = [
    { zh: '中性黑体', en: 'Neutral grotesque', stack: '"Inter Variable", "Helvetica Neue", "Arial Nova", Arial, "PingFang SC", "Microsoft YaHei", sans-serif', w: 500 },
    { zh: '原生界面', en: 'Native UI', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", sans-serif', w: 600 },
    { zh: '人文无衬线', en: 'Humanist sans', stack: '"Source Sans 3 Variable", Optima, "Avenir Next", Seravek, Candara, "Gill Sans Nova", "PingFang SC", "Hiragino Sans GB", sans-serif', w: 500 },
    { zh: '工业窄体', en: 'Industrial condensed', stack: '"Roboto Condensed Variable", "DIN Alternate", Bahnschrift, "Avenir Next Condensed", "Roboto Condensed", "Arial Narrow", "PingFang SC", "Microsoft YaHei", sans-serif', w: 700 },
    { zh: '圆体', en: 'Rounded', stack: '"Nunito Variable", "MaokenZhuyuanTi", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Yuanti SC", YouYuan, "PingFang SC", sans-serif', w: 700 },
    { zh: '现代衬线', en: 'Didone display', stack: '"Playfair Display Variable", Didot, "Bodoni 72", "Bodoni MT", "Source Han Serif CN VF", "Songti SC", "Noto Serif CJK SC", SimSun, serif', w: 700 },
    { zh: '旧式衬线', en: 'Old-style serif', stack: '"EB Garamond Variable", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Source Han Serif CN VF", "Songti SC", STSong, "Noto Serif CJK SC", SimSun, serif', w: 400 },
    { zh: '过渡衬线', en: 'Transitional serif', stack: '"Libre Baskerville", Charter, "Bitstream Charter", "Sitka Text", Cambria, "Source Han Serif CN VF", "Songti SC", "Noto Serif CJK SC", SimSun, serif', w: 400 },
    { zh: '打字机粗衬线', en: 'Slab / typewriter', stack: '"Courier Prime", "American Typewriter", Rockwell, "Courier New", STFangsong, FangSong, "Source Han Serif CN VF", "Songti SC", serif', w: 600 },
    { zh: '等宽', en: 'Monospace', stack: '"JetBrains Mono Variable", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "Sarasa Mono SC", "PingFang SC", monospace', w: 500 },
    { zh: '楷体', en: 'Kai / brush', stack: '"LXGW WenKai", "Kaiti SC", STKaiti, KaiTi, "AR PL UKai CN", "Noto Serif CJK SC", serif', w: 400 },
    { zh: '几何无衬线', en: 'Geometric sans', stack: '"Jost Variable", "Avenir Next", Futura, "Century Gothic", "Trebuchet MS", "PingFang SC", "Microsoft YaHei", sans-serif', w: 600 },
  ];
  const voice = (ctx, id) => VOICES[Math.max(0, ctx.domains.findIndex((d) => d.id === id)) % VOICES.length];
  const face = (v) => `font-family:${v.stack};font-weight:${v.w}`;

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    el.innerHTML = `
    <div class="sp-sheet">
      <header class="sp-mast">
        <div class="sp-mast-l">
          <p class="sp-eyebrow">Type Specimen · 字样 <span>Design Skill Lab · ${ctx.totals.resources} glyphs of design</span></p>
          <h1 class="sp-title">Design Skill Lab</h1>
          <p class="sp-cn">设计技能实验室</p>
        </div>
        <nav class="sp-toc" aria-label="页面风格">
          <p>同一份内容的 ${ctx.content.styles.length} 种排法</p>
          ${ctx.content.styles.map((s) => `<a href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''}><b>${pad(s.num)}</b>${esc(s.name)}<i>${esc(s.en)}</i></a>`).join('')}
        </nav>
      </header>

      <section class="sp-hero" aria-label="样字">
        <figure class="sp-glyph" id="sp-glyph">
          <span class="sp-line sp-line-cap" aria-hidden="true"><i>cap height</i></span>
          <span class="sp-line sp-line-x" aria-hidden="true"><i>x-height</i></span>
          <span class="sp-line sp-line-base" aria-hidden="true"><i>baseline</i></span>
          <span class="sp-g sp-g-latin" id="sp-g-latin">Aa</span>
          <span class="sp-g sp-g-han" id="sp-g-han">永</span>
          <figcaption id="sp-glyph-cap"></figcaption>
        </figure>
        <div class="sp-hero-t">
          <p class="sp-lede">${esc(ctx.content.site.lede)}</p>
          <table class="sp-meta"><tbody>
            <tr><th>资源</th><td>${ctx.totals.resources}</td><th>域 / 字体气质</th><td>${ctx.totals.domains}</td></tr>
            <tr><th>S 首选</th><td>${ctx.totals.s}</td><th>截图</th><td>${ctx.totals.shots}</td></tr>
            <tr><th>skill</th><td>${ctx.totals.skills}</td><th>在线字体</th><td>${(ctx.board().fonts || []).length} 包 · 系统回落</td></tr>
          </tbody></table>
          <p class="sp-note">十二个域各用一种字体气质排出——这正是套件 <code>typography.md</code> 里"按气质选字体栈"那张表。字体来自公用 CDN（中文网字计划分包 + fontsource），网络不通时按栈落回系统字体，那时 Windows 与 Linux 会有几行落到同一款。</p>
        </div>
      </section>

      <section class="sp-tools" role="search">
        <label class="sp-q"><span>查</span><input id="sp-q" type="search" placeholder="名称、用途、标签、授权（按 / 聚焦）" aria-label="搜索资源" autocomplete="off"></label>
        <select id="sp-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
        <select id="sp-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
        <select id="sp-reach" aria-label="可达性"><option value="">agent 可达</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
        <select id="sp-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
        <button type="button" id="sp-reset">重置</button>
      </section>

      <div id="sp-view"></div>

      <section class="sp-block" id="sp-suite">
        <header class="sp-bh"><span>${pad(13)}</span><h2 style="${face(VOICES[9])}">skill 套件</h2><em>Monospace · ${ctx.totals.skills} 个</em></header>
        <ol class="sp-skills">${ctx.content.skills.map(([n, d], i) => `<li><span class="sp-skn">${pad(i + 1)}</span><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><p>${esc(d)}</p></li>`).join('')}</ol>
      </section>

      <section class="sp-block sp-two" id="sp-how">
        <div>
          <header class="sp-bh"><span>${pad(14)}</span><h2 style="${face(VOICES[9])}">安装</h2></header>
          <pre class="sp-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
        </div>
        <div>
          <header class="sp-bh"><span>${pad(15)}</span><h2 style="${face(VOICES[10])}">装好后直接说</h2><em>Kai</em></header>
          <ul class="sp-prompts" style="${face(VOICES[10])}">${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
      </section>

      <section class="sp-block" id="sp-method">
        <header class="sp-bh"><span>${pad(16)}</span><h2 style="${face(VOICES[7])}">方法与局限</h2><em>Transitional serif</em></header>
        <dl class="sp-method" style="${face(VOICES[7])}">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
      </section>

      <section class="sp-block sp-board" id="sp-board">
        <header class="sp-bh"><span>${pad(17)}</span><h2>关于这份样张 · ${esc(b.name)} ${esc(b.en)}</h2></header>
        <p>${esc(b.concept)}</p>
        <dl class="sp-axes">${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="sp-risk"><b>会在哪里失败</b>${esc(b.risk)}</p>
      </section>

      <footer class="sp-foot">
        <span>Design Skill Lab · 原创内容 MIT · 商标归各自所有者 · 截图仅供索引预览</span>
        <a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
      </footer>
    </div>`;

    bind(el, ctx);
    cycle(el, ctx);
  }

  /* ---- 样张行 -------------------------------------------------------------------- */
  function renderDomains(ctx) {
    return `<section class="sp-rows" aria-label="十二个域，十二种字体气质">${ctx.domains.map((d, i) => {
      const v = VOICES[i % VOICES.length];
      return `<button type="button" class="sp-row" data-domain="${d.id}" data-voice="${i}">
        <span class="sp-row-l"><b>${pad(i + 1)}</b><span>${esc(v.zh)}</span><i>${esc(v.en)}</i><em>${d.count} 条</em></span>
        <span class="sp-row-m" style="${face(v)}">
          <span class="sp-big">${esc(d.zh)}</span>
          <span class="sp-small">${esc(d.blurb)}</span>
        </span>
        <span class="sp-row-r" style="${face(v)}" aria-hidden="true"><span class="s36">${esc(d.zh)}</span><span class="s24">${esc(d.zh)}</span><span class="s16">${esc(d.zh)}</span><span class="s12">${esc(d.zh)}</span></span>
      </button>`;
    }).join('')}</section>`;
  }

  function item(ctx, r, v) {
    return `<li class="sp-item">
      <a href="${esc(r.url)}" target="_blank" rel="noopener">
        <span class="sp-item-n" style="${face(v)}">${esc(r.name)}</span>
        <span class="sp-item-tags"><i class="sp-tier sp-tier-${r.tier}">${r.tier}</i>${r.lang !== 'en' ? `<i class="sp-lang">${r.lang === 'zh' ? '中' : r.lang === 'ja' ? '日' : esc(r.lang)}</i>` : ''}</span>
        <span class="sp-item-d">${esc(ctx.zh(r))}</span>
        <span class="sp-item-m">${esc(ctx.kindZh(r.kind))} · ${esc(ctx.accessZh(r.access))}${r.login ? ' · 需登录' : ''} · ${esc(ctx.reachZh(r.agent_access))}${r.license ? ' · ' + esc(r.license.length > 36 ? r.license.slice(0, 36) + '…' : r.license) : ''}</span>
        ${r.shot ? `<img class="sp-shot" src="${r.shot}" alt="" loading="lazy">` : ''}
      </a>
    </li>`;
  }

  function renderDomain(ctx, d) {
    const i = ctx.domains.indexOf(d), v = VOICES[i % VOICES.length];
    return `<section class="sp-domain" data-voice="${i}">
      <header class="sp-dh">
        <p class="sp-dh-l"><button type="button" class="sp-back" data-domain="">← 全部</button><b>${pad(i + 1)}</b>${esc(v.zh)} <i>${esc(v.en)}</i> · ${d.count} 条</p>
        <h2 style="${face(v)}">${esc(d.zh)}</h2>
        <p class="sp-dh-b" style="${face(v)}">${esc(d.blurb)}</p>
        <p class="sp-stack"><span>font-family:</span> ${esc(v.stack)}</p>
      </header>
      ${d.sections.filter((s) => s.items.length).map((s, si) => `
        <section class="sp-sec">
          <header class="sp-sh"><span>${pad(i + 1)}.${si + 1}</span><h3 style="${face(v)}">${esc(s.zh)}</h3><em>${s.items.length}</em><p>${esc(s.note)}</p></header>
          <ul class="sp-items">${s.items.map((r) => item(ctx, r, v)).join('')}</ul>
        </section>`).join('')}
    </section>`;
  }

  function renderResults(ctx, v) {
    if (!v.total) return `<section class="sp-empty"><p>没有符合条件的条目。</p><button type="button" class="sp-back" data-reset>清除全部条件</button></section>`;
    return `<section class="sp-domain">
      <header class="sp-dh"><p class="sp-dh-l"><b>${v.total}</b> 条匹配 · ${v.groups.length} 个域，各用各的字体</p></header>
      ${v.groups.map((g) => {
        const i = ctx.domains.indexOf(g.domain), vv = VOICES[i % VOICES.length];
        return `<section class="sp-sec">
          <header class="sp-sh"><span>${pad(i + 1)}</span><h3 style="${face(vv)}"><button type="button" class="sp-linkbtn" data-domain="${g.domain.id}">${esc(g.domain.zh)}</button></h3><em>${g.items.length}</em><p>${esc(vv.zh)} · ${esc(vv.en)}</p></header>
          <ul class="sp-items">${g.items.map((r) => item(ctx, r, vv)).join('')}</ul>
        </section>`;
      }).join('')}
    </section>`;
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#sp-view');
    box.innerHTML = v.mode === 'domains' ? renderDomains(ctx) : v.mode === 'domain' ? renderDomain(ctx, v.domain) : renderResults(ctx, v);
  }

  /* ---- 样字换字体：每 2.4s 换一种气质；hover 某一行时跟随该行 -------------------------- */
  let vi = 0;
  function setGlyph(el, ctx, i) {
    vi = i % VOICES.length;
    const v = VOICES[vi], d = ctx.domains[vi];
    ['#sp-g-latin', '#sp-g-han'].forEach((s) => { const n = el.querySelector(s); if (n) n.style.cssText = face(v); });
    const cap = el.querySelector('#sp-glyph-cap');
    if (cap) cap.innerHTML = `<b>${pad(vi + 1)} ${esc(v.zh)}</b> ${esc(v.en)} <span>→ ${esc(d ? d.zh : '')}</span>`;
  }
  function cycle(el, ctx) {
    setGlyph(el, ctx, 0);
    if (ctx.reduced) return;
    let paused = false;
    const iv = setInterval(() => { if (!paused) setGlyph(el, ctx, vi + 1); }, 2400);
    cleanup.push(() => clearInterval(iv));
    el.addEventListener('mouseover', (e) => {
      const r = e.target.closest('[data-voice]');
      if (r) { paused = true; setGlyph(el, ctx, Number(r.dataset.voice)); }
    });
    el.addEventListener('mouseout', (e) => { if (e.target.closest('[data-voice]')) paused = false; });
  }

  /* ---- 绑定 -------------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#sp-q', tier: '#sp-tier', access: '#sp-access', reach: '#sp-reach', lang: '#sp-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#sp-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) {
        const to = d.dataset.domain;
        const patch = { domain: to };
        if (to) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
        ctx.set(patch); sync();
        el.querySelector('#sp-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  function focusSearch() {
    const q = document.querySelector('#sp-q');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; vi = 0; }
})();
