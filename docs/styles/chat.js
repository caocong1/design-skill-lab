/* 风格 13 · 对话 Agent Chat
   整页是一段与 design-studio 的线程：左侧会话列表（=风格入口）、中间线程、底部固定的输入框（=搜索框）。
   目录以回答的形式出现，资源是引注 [1][2]……每一条都能直接点。动效：首条回答流式打字、回答浮现。 */
(function () {
  'use strict';
  DSL.register('chat', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const AVATAR = '<span class="ai-av" aria-hidden="true">D</span>';

  const user = (text) => `<article class="ai-msg ai-user"><div class="ai-bubble">${text}</div></article>`;
  const bot = (html, cls = '') => `<article class="ai-msg ai-bot ${cls}">${AVATAR}<div class="ai-body">${html}</div></article>`;

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    el.innerHTML = `
    <div class="ai-app">
      <aside class="ai-side" id="ai-side">
        <div class="ai-side-h">
          <span class="ai-logo">${AVATAR}<b>Design Skill Lab</b></span>
          <button type="button" class="ai-new" data-domain="">＋ 新对话</button>
        </div>
        <p class="ai-side-t">会话 · 同一份内容的 ${ctx.content.styles.length} 种讲法</p>
        <nav class="ai-convs" aria-label="页面风格">
          ${ctx.content.styles.map((s) => `<a class="ai-conv" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''}><span>${esc(s.name)} <em>${esc(s.en)}</em></span><small>${pad(s.num)}</small></a>`).join('')}
        </nav>
        <p class="ai-side-t">可用工具 · ${ctx.totals.skills}</p>
        <ul class="ai-tools">${ctx.content.skills.map(([n]) => `<li><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a></li>`).join('')}</ul>
        <div class="ai-side-f"><a href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub ↗</a><span>MIT</span></div>
      </aside>

      <div class="ai-main">
        <header class="ai-top">
          <button type="button" class="ai-burger" id="ai-burger" aria-label="打开会话列表" aria-expanded="false"><i></i></button>
          <span class="ai-model"><i class="ai-live" aria-hidden="true"></i>design-studio <em>▾</em><small>${ctx.totals.resources} 条资源在线</small></span>
          <a class="ai-top-gh" href="${ctx.content.site.repo}" target="_blank" rel="noopener">GitHub</a>
        </header>

        <div class="ai-thread" id="ai-thread">
          ${bot(`
            <p class="ai-stream" id="ai-stream" data-text="你好，我是 design-studio。这里有 ${ctx.totals.resources} 条逐条标记的设计资源，分 ${ctx.totals.domains} 个域；还有 ${ctx.totals.skills} 个让 coding agent 像资深设计师一样工作的 skill。"></p>
            <p class="ai-muted">${esc(ctx.content.site.lede)}</p>
            <div class="ai-facts">
              <span><b>${ctx.totals.resources}</b>资源</span><span><b>${ctx.totals.domains}</b>域</span><span><b>${ctx.totals.s}</b>S 首选</span><span><b>${ctx.totals.shots}</b>截图</span><span><b>${ctx.totals.skills}</b>skill</span>
            </div>
            <p class="ai-muted ai-small">在下方输入就是搜索——名称、用途、标签、授权都能搜；点任何一个域或引注可以直接打开。</p>`, 'ai-first')}

          <div id="ai-view"></div>

          ${user('这个页面用的是什么风格？')}
          ${bot(`
            <p><b>${esc(b.name)} ${esc(b.en)}</b>——${esc(b.concept)}</p>
            <dl class="ai-axes">${Object.entries(b.axes).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
            <p class="ai-muted"><b>会在哪里失败：</b>${esc(b.risk)}</p>
            <p class="ai-muted ai-small">左侧会话列表里是同一份内容的另外 ${ctx.content.styles.length - 1} 种讲法。</p>`)}

          ${user('有哪些 skill？分别做什么？')}
          ${bot(`
            <p>一共 ${ctx.totals.skills} 个。套件是设计师：决定、出图、写规格、交接、验收；实现是 coding agent 的事。</p>
            <ol class="ai-skills">${ctx.content.skills.map(([n, d]) => `<li><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener"><code>${n}</code></a><span>${esc(d)}</span></li>`).join('')}</ol>`)}

          ${user('怎么安装？装好以后怎么用？')}
          ${bot(`
            <p>克隆仓库，把 <code>skills/</code> 下的每个目录链接进 agent 的 skills 目录：</p>
            <pre class="ai-code"><code>${ctx.content.usage.install.map(esc).join('\n')}</code></pre>
            <p>装好后直接说需求，比如：</p>
            <ul class="ai-prompts">${ctx.content.usage.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`)}

          ${user('这套东西的方法和局限？')}
          ${bot(`<dl class="ai-method">${ctx.content.method.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
            <p class="ai-muted ai-small">Design Skill Lab · 原创内容 MIT · 商标归各自所有者 · 截图仅供索引预览</p>`)}
        </div>

        <footer class="ai-composer" role="search">
          <div class="ai-box">
            <div class="ai-chips">
              <select id="ai-tier" aria-label="档位"><option value="">档位</option><option value="S">S 首选</option><option value="A">A 可靠</option><option value="B">B 备选</option></select>
              <select id="ai-access" aria-label="收费"><option value="">收费</option><option value="free">免费</option><option value="freemium">部分免费</option><option value="paid">付费</option></select>
              <select id="ai-reach" aria-label="可达性"><option value="">agent 可达</option><option value="static">可抓取</option><option value="js">需浏览器</option><option value="blocked">有防护</option></select>
              <select id="ai-lang" aria-label="语言"><option value="">语言</option><option value="zh">中文</option><option value="en">英文</option><option value="ja">日文</option></select>
              <button type="button" id="ai-reset" class="ai-clear">清除</button>
            </div>
            <div class="ai-input">
              <input id="ai-q" type="search" placeholder="问点什么，或直接搜资源……（按 / 聚焦）" aria-label="搜索资源" autocomplete="off">
              <button type="button" class="ai-send" id="ai-send" aria-label="搜索"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
          </div>
          <p class="ai-hint">输入即搜索，不用回车。资源信息可能过期，授权以来源页面为准。</p>
        </footer>
      </div>
      <div class="ai-scrim" id="ai-scrim" hidden></div>
    </div>`;

    bind(el, ctx);
    stream(el, ctx);
  }

  /* ---- 回答里的目录 ------------------------------------------------------------ */
  function cite(ctx, r, n) {
    return `<li id="ai-r-${esc(r.id)}">
      <a class="ai-cite" href="${esc(r.url)}" target="_blank" rel="noopener">[${n}]</a>
      <span class="ai-rtext">
        <span class="ai-rhead"><a class="ai-rname" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>${r.lang !== 'en' ? `<i class="ai-tag">${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}</i>` : ''}<i class="ai-tag ai-tag-${r.tier}">${r.tier} ${ctx.tierZh(r.tier)}</i></span>
        <span class="ai-rdesc">${esc(ctx.zh(r))}</span>
        <span class="ai-rmeta">${esc(ctx.kindZh(r.kind))} · ${esc(ctx.accessZh(r.access))}${r.login ? ' · 需登录' : ''} · ${esc(ctx.reachZh(r.agent_access))}${r.license ? ' · ' + esc(r.license.length > 40 ? r.license.slice(0, 40) + '…' : r.license) : ''}</span>
      </span>
      ${r.shot ? `<img class="ai-shot" src="${r.shot}" alt="" loading="lazy">` : ''}
    </li>`;
  }
  function sources(items) {
    const shots = items.filter((r) => r.shot).slice(0, 6);
    if (!shots.length) return '';
    return `<div class="ai-sources"><span>来源</span>${shots.map((r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener" title="${esc(r.name)}"><img src="${r.shot}" alt="" loading="lazy"></a>`).join('')}${items.length > shots.length ? `<em>+${items.length - shots.length}</em>` : ''}</div>`;
  }

  function renderDomains(ctx) {
    return user('目录里有哪些域？') + bot(`
      <p>${ctx.totals.domains} 个，按下面任何一个我就把它整段列出来：</p>
      <div class="ai-domains">${ctx.domains.map((d, i) => `
        <button type="button" class="ai-dom" data-domain="${d.id}" style="--h:${d.hue}">
          <span class="ai-dom-h"><i></i><b>${esc(d.zh)}</b><em>${d.count}</em></span>
          <span class="ai-dom-b">${esc(d.blurb)}</span>
        </button>`).join('')}
      </div>`, 'ai-reply');
  }

  function renderDomain(ctx, d) {
    let n = 0;
    const all = d.sections.flatMap((s) => s.items);
    return user(`看看「${esc(d.zh)}」。`) + bot(`
      <p><b>${esc(d.zh)}</b>——${esc(d.blurb)}。共 ${d.count} 条，分 ${d.sections.filter((s) => s.items.length).length} 个小节；S 首选 ${all.filter((r) => r.tier === 'S').length} 条。</p>
      ${d.sections.filter((s) => s.items.length).map((s) => `
        <section class="ai-sec">
          <h3>${esc(s.zh)} <small>${s.items.length}</small></h3>
          <p class="ai-muted ai-small">${esc(s.note)}</p>
          <ol class="ai-refs">${s.items.map((r) => cite(ctx, r, ++n)).join('')}</ol>
        </section>`).join('')}
      ${sources(all)}
      <p class="ai-followup"><button type="button" class="ai-fb" data-domain="">← 回到全部域</button></p>`, 'ai-reply');
  }

  function renderResults(ctx, v) {
    const cond = [ctx.state.q.trim() && `「${esc(ctx.state.q.trim())}」`, ctx.state.tier && `档位 ${ctx.state.tier}`, ctx.state.access && ctx.accessZh(ctx.state.access), ctx.state.reach && ctx.reachZh(ctx.state.reach), ctx.state.lang && ({ zh: '中文', en: '英文', ja: '日文' }[ctx.state.lang] || ctx.state.lang)].filter(Boolean);
    const ask = `搜 ${cond.join('，')}${ctx.state.domain ? `，只看「${esc((ctx.domains.find((d) => d.id === ctx.state.domain) || {}).zh || '')}」` : ''}。`;
    if (!v.total) return user(ask) + bot(`<p>没有找到符合这些条件的资源。换个词，或者放宽一个筛选条件？</p><p class="ai-followup"><button type="button" class="ai-fb" data-reset>清除全部条件</button></p>`, 'ai-reply');
    let n = 0;
    return user(ask) + bot(`
      <p>找到 <b>${v.total}</b> 条，来自 ${v.groups.length} 个域，按域分组、档位靠前：</p>
      ${v.groups.map((g) => `
        <section class="ai-sec">
          <h3><button type="button" class="ai-fb ai-fb-h" data-domain="${g.domain.id}">${esc(g.domain.zh)}</button> <small>${g.items.length}</small></h3>
          <ol class="ai-refs">${g.items.map((r) => cite(ctx, r, ++n)).join('')}</ol>
        </section>`).join('')}
      ${sources(v.groups.flatMap((g) => g.items))}`, 'ai-reply');
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    if (!el) return;
    const v = ctx.view();
    const box = el.querySelector('#ai-view');
    box.innerHTML = v.mode === 'domains' ? renderDomains(ctx) : v.mode === 'domain' ? renderDomain(ctx, v.domain) : renderResults(ctx, v);
    // 新回答先给一个"思考中"的三点，再浮现；减少动态效果时直接显示。
    const reply = box.querySelector('.ai-reply');
    if (reply && !ctx.reduced && paint.count++) {
      reply.classList.add('ai-thinking');
      const t = setTimeout(() => reply.classList.remove('ai-thinking'), 260);
      cleanup.push(() => clearTimeout(t));
    }
    el.querySelectorAll('.ai-conv').forEach((a) => a.setAttribute('aria-current', a.dataset.goto === ctx.state.style ? 'page' : 'false'));
  }
  paint.count = 0;

  /* ---- 绑定 -------------------------------------------------------------------- */
  function bind(el, ctx) {
    const F = { q: '#ai-q', tier: '#ai-tier', access: '#ai-access', reach: '#ai-reach', lang: '#ai-lang' };
    const sync = () => Object.entries(F).forEach(([k, s]) => { el.querySelector(s).value = ctx.state[k] || ''; });
    sync();
    Object.entries(F).forEach(([k, s]) => {
      el.querySelector(s).addEventListener(k === 'q' ? 'input' : 'change', (e) => ctx.set({ [k]: e.target.value }));
    });
    el.querySelector('#ai-reset').addEventListener('click', () => { ctx.reset(); sync(); });
    el.querySelector('#ai-send').addEventListener('click', () => { el.querySelector('#ai-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' }); });
    el.querySelector('#ai-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.querySelector('#ai-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' }); } });

    const side = el.querySelector('#ai-side'), scrim = el.querySelector('#ai-scrim'), burger = el.querySelector('#ai-burger');
    const drawer = (open) => { side.classList.toggle('open', open); scrim.hidden = !open; burger.setAttribute('aria-expanded', String(open)); };
    burger.addEventListener('click', () => drawer(!side.classList.contains('open')));
    scrim.addEventListener('click', () => drawer(false));

    el.addEventListener('click', (e) => {
      const d = e.target.closest('[data-domain]');
      if (d) {
        const to = d.dataset.domain;
        const patch = { domain: to };
        if (to || d.classList.contains('ai-new')) { patch.q = ''; patch.tier = ''; patch.access = ''; patch.reach = ''; patch.lang = ''; }
        ctx.set(patch); sync(); drawer(false);
        el.querySelector('#ai-view').scrollIntoView({ block: 'start', behavior: ctx.reduced ? 'auto' : 'smooth' });
        return;
      }
      if (e.target.closest('[data-reset]')) { ctx.reset(); sync(); }
    });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  /* ---- 流式打字：只对首条问候，其它内容即时出现 ------------------------------------- */
  function stream(el, ctx) {
    const p = el.querySelector('#ai-stream');
    if (!p) return;
    const text = p.dataset.text;
    if (ctx.reduced) { p.textContent = text; return; }
    p.classList.add('ai-typing');
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      p.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(iv); p.classList.remove('ai-typing'); }
    }, 18);
    cleanup.push(() => { clearInterval(iv); p.textContent = text; });
  }

  function focusSearch() {
    const q = document.querySelector('#ai-q');
    if (q) q.focus();
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; paint.count = 0; }
})();
