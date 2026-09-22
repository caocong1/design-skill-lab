/* 风格 4 · 终端 Amber Terminal
   整个页面是一台开机中的终端：boot 引导、命令行检索、扫描线。一切能敲的都能点。 */
(function () {
  'use strict';
  DSL.register('terminal', { mount, unmount, focusSearch });

  let cleanup = [];
  let ctxRef = null, elRef = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(el, ctx) {
    ctxRef = ctx; elRef = el;
    const b = ctx.board();
    el.innerHTML = `
    <div class="tm-frame">
      <div class="tm-bar">
        <span class="tm-dots"><i></i><i></i><i></i></span>
        <span class="tm-title">dsl — design-skill-lab — 80×∞</span>
        <span class="tm-clock" id="tm-clock"></span>
      </div>
      <div class="tm-screen" id="tm-screen">
        <div id="tm-out">
          <pre class="tm-boot" id="tm-boot"></pre>
          <section class="tm-sec" data-cmd="cat README.md">
            <pre class="tm-banner">
██████╗ ███████╗██╗      █████╗
██╔══██╗██╔════╝██║     ██╔══██╗
██║  ██║███████╗██║     ███████║
██║  ██║╚════██║██║     ██╔══██║
██████╔╝███████║███████╗██║  ██║
╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝</pre>
            <p class="tm-dim"># ${esc(ctx.content.site.tagline)}</p>
            <p>${esc(ctx.content.site.lede)}</p>
            <p class="tm-stat">resources=<b>${ctx.totals.resources}</b>  domains=<b>${ctx.totals.domains}</b>  tier_S=<b>${ctx.totals.s}</b>  skills=<b>${ctx.totals.skills}</b>  shots=<b>${ctx.totals.shots}</b></p>
          </section>
          <section class="tm-sec" data-cmd="cat board.txt">
            <p><span class="tm-key">style</span>   ${esc(b.name)} ${esc(b.en)}</p>
            <p><span class="tm-key">concept</span> ${esc(b.concept)}</p>
            ${Object.entries(b.axes).map(([k, v]) => `<p><span class="tm-key">${esc(k)}</span>${'　'.repeat(Math.max(1, 4 - k.length))} ${esc(v)}</p>`).join('')}
            <p><span class="tm-key">risk</span>   ${esc(b.risk)}</p>
          </section>
          <section class="tm-sec" data-cmd="style --list">
            ${ctx.content.styles.map((s) => `<p><a class="tm-link tm-sty" href="?style=${s.id}" data-goto="${s.id}"${s.id === b.id ? ' aria-current="page"' : ''}>${s.id === b.id ? '<span class="tm-key">*</span>' : ' '} [${s.num > 10 ? s.num : s.num % 10}] ${s.id}</a><span class="tm-dim">  # ${esc(s.name)} ${esc(s.en)}</span></p>`).join('')}
            <p class="tm-dim"># 切换：点上面任意一行，或输入 style &lt;编号|id&gt;，或直接按数字键 1–0（11 起用 [ ] 前后切换）</p>
          </section>
          <section class="tm-sec" data-cmd="cat suite.txt">
            <p class="tm-dim"># 套件的角色是设计师：决定、出图、写规格、交接、验收。实现是 coding agent 的事。</p>
            <div class="tm-skills">${ctx.content.skills.map(([n, d]) => `
              <p><a href="${ctx.content.site.repo}/blob/main/skills/${n}/SKILL.md" target="_blank" rel="noopener" class="tm-link">${n}</a><span class="tm-dim">  # ${esc(d)}</span></p>`).join('')}
            </div>
          </section>
          <section class="tm-sec" data-cmd="cat install.sh && cat usage.txt">
            <pre class="tm-code">${ctx.content.usage.install.map(esc).join('\n')}</pre>
            ${ctx.content.usage.prompts.map((p) => `<p class="tm-dim"># ${esc(p)}</p>`).join('')}
          </section>
          <section class="tm-sec" data-cmd="man dsl">
            ${ctx.content.method.map(([t, d]) => `<p><span class="tm-key">${esc(t)}</span>  ${esc(d)}</p>`).join('')}
          </section>

          <section class="tm-sec tm-live">
            <div id="tm-catalog"></div>
          </section>

          <p class="tm-foot">MIT licensed · <a class="tm-link" href="${ctx.content.site.repo}" target="_blank" rel="noopener">github.com/caocong1/design-skill-lab</a> · 商标归各自所有者</p>
        </div>
      </div>
      <form class="tm-input" id="tm-form">
        <span class="tm-prompt">dsl&gt;</span>
        <input id="tm-cmd" autocomplete="off" spellcheck="false" aria-label="命令行：help 查看命令" placeholder="help — 查看命令；一切能敲的都能点">
        <span class="tm-cursor" aria-hidden="true"></span>
      </form>
      <div class="tm-scan" aria-hidden="true"></div>
      <div class="tm-vig" aria-hidden="true"></div>
    </div>`;

    boot(el, ctx);
    bind(el, ctx);
    clock(ctx);
  }

  /* ---- 目录输出 ------------------------------------------------------------ */
  function row(ctx, r) {
    const shots = r.shot ? '' : '';
    return `<p class="tm-row">` +
      `<span class="tm-tier tm-t${r.tier}">[${r.tier}]</span> ` +
      `<a class="tm-link" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>` +
      (r.shot ? ` <span class="tm-shot" data-shot="${r.shot}" data-name="${esc(r.name)}">[截图]</span>` : '') +
      `<span class="tm-dim">  # ${esc(ctx.zh(r))}${r.lang !== 'en' ? `（${r.lang === 'zh' ? '中文' : r.lang === 'ja' ? '日文' : esc(r.lang)}）` : ''}</span></p>`;
  }

  function paint() {
    const ctx = ctxRef, el = elRef;
    const v = ctx.view();
    const box = el.querySelector('#tm-catalog');
    if (!box) return;
    let html = `<p class="tm-echo" id="tm-echo"></p>`;
    if (v.mode === 'domains') {
      html += `<p class="tm-dim"># 十二个域：cd &lt;域名&gt; 进入，find &lt;词&gt; 全局搜索</p>`;
      html += ctx.domains.map((d) =>
        `<p class="tm-row tm-dir" data-domain="${d.id}"><span class="tm-dir-name">${d.id === 'web' ? 'web/' : esc(d.id + '/')}</span>` +
        `<span class="tm-dir-zh">${esc(d.zh)}</span><span class="tm-dim">  # ${esc(d.blurb)}（${d.count}）</span></p>`).join('');
    } else if (v.mode === 'domain') {
      const d = v.domain;
      html += `<p class="tm-dim"># ${esc(d.zh)} · ${esc(d.blurb)} · ${d.count} 条 — <span class="tm-dir tm-back" data-domain="">cd ..</span> 返回</p>`;
      for (const s of d.sections) {
        if (!s.items.length) continue;
        html += `<p class="tm-sub">${esc(s.zh)} <span class="tm-dim">(${s.items.length}) — ${esc(s.note)}</span></p>`;
        html += s.items.map((r) => row(ctx, r)).join('');
      }
    } else {
      html += `<p class="tm-dim"># ${v.total} 条匹配</p>`;
      if (!v.total) html += `<p>没有符合条件的资源。reset 清除全部条件。</p>`;
      for (const g of v.groups) {
        html += `<p class="tm-sub">${esc(g.domain.zh)} <span class="tm-dim">(${g.items.length})</span></p>`;
        html += g.items.map((r) => row(ctx, r)).join('');
      }
    }
    box.innerHTML = html;
    echo();
  }

  function echo() {
    const s = ctxRef.state;
    const parts = [];
    if (s.domain) parts.push(`cd ${s.domain}`);
    if (s.q) parts.push(`find "${s.q}"`);
    if (s.tier) parts.push(`tier ${s.tier}`);
    if (s.access) parts.push(`access ${s.access}`);
    if (s.reach) parts.push(`reach ${s.reach}`);
    if (s.lang) parts.push(`lang ${s.lang}`);
    const el = elRef.querySelector('#tm-echo');
    if (el) el.innerHTML = `<span class="tm-prompt">dsl&gt;</span> ${esc(parts.length ? parts.join(' && ') : 'ls')}`;
  }

  /* ---- 命令解析 ------------------------------------------------------------ */
  const HELP = [
    ['ls', '列出十二个域'],
    ['cd <域>', '进入某个域，如 cd web；cd .. 返回'],
    ['find <词>', '全局搜索，如 find 字体'],
    ['tier S|A|B', '按档位过滤'],
    ['access free|freemium|paid', '按收费过滤'],
    ['lang zh|en|ja', '按语言过滤'],
    ['reset', '清除全部条件'],
    ['style <编号|id>', '切换页面风格'],
    ['github', '打开仓库'],
  ];
  function run(cmdRaw) {
    const ctx = ctxRef;
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    const domIds = ctx.domains.map((d) => d.id);
    if (head === 'help') {
      print(`<div class="tm-help">${HELP.map(([c, d]) => `<p><span class="tm-key">${c}</span>${'　'.repeat(Math.max(1, 22 - c.length * 2))}${d}</p>`).join('')}</div>`);
    } else if (head === 'ls') ctx.set({ domain: '' });
    else if (head === 'cd') {
      if (arg === '..' || arg === '') ctx.set({ domain: '' });
      else if (domIds.includes(arg)) ctx.set({ domain: arg });
      else {
        const hit = ctx.domains.find((d) => d.zh.includes(arg));
        if (hit) ctx.set({ domain: hit.id });
        else print(`<p class="tm-err">cd: 没有这个域：${esc(arg)}（试试 ${domIds.join(' / ')}）</p>`);
      }
    } else if (head === 'find' || head === 'search') ctx.set({ q: arg });
    else if (head === 'tier') ctx.set({ tier: arg.toUpperCase() });
    else if (head === 'access') ctx.set({ access: arg });
    else if (head === 'reach') ctx.set({ reach: arg });
    else if (head === 'lang') ctx.set({ lang: arg });
    else if (head === 'reset' || head === 'clear') { if (head === 'clear') { clearLog(); return; } ctx.reset(); }
    else if (head === 'style') { const s = ctx.content.styles.find((x) => x.id === arg || (x.num <= 10 ? x.num % 10 : x.num) === Number(arg)); if (s) ctx.goto(s.id); }
    else if (head === 'github') window.open(ctx.content.site.repo, '_blank');
    else ctx.set({ q: cmd });   // 裸词 = 搜索
    scrollBottom();
  }
  function print(html) {
    const box = elRef.querySelector('#tm-catalog');
    box.insertAdjacentHTML('beforeend', html);
  }
  function clearLog() {
    elRef.querySelector('#tm-catalog').innerHTML = '';
    paint();
  }
  function scrollBottom() {
    const sc = elRef.querySelector('#tm-screen');
    sc.scrollTop = sc.scrollHeight;
  }

  /* ---- boot 打字机 ---------------------------------------------------------- */
  function boot(el, ctx) {
    const lines = [
      'DSL/OS 26.9.1 boot — design-skill-lab terminal',
      `loading catalog.js … ${ctx.totals.resources} records OK`,
      `loading shots … ${ctx.totals.shots} frames OK`,
      `locale zh-CN · font mono · style "${ctx.board().id}"`,
      'type `help` for commands — 一切能敲的都能点',
      '',
    ];
    const pre = el.querySelector('#tm-boot');
    if (ctx.reduced) { pre.textContent = lines.join('\n'); return; }
    let li = 0;
    const iv = setInterval(() => {
      pre.textContent += lines[li] + '\n';
      li++;
      if (li >= lines.length) clearInterval(iv);
    }, 130);
    cleanup.push(() => clearInterval(iv));
  }

  /* ---- 时钟 ---------------------------------------------------------------- */
  function clock(ctx) {
    const t = () => {
      const n = elRef && elRef.querySelector('#tm-clock');
      if (!n) return;
      n.textContent = new Date().toTimeString().slice(0, 8);
    };
    t();
    if (!ctx.reduced) { const iv = setInterval(t, 1000); cleanup.push(() => clearInterval(iv)); }
  }

  /* ---- 绑定 ---------------------------------------------------------------- */
  function bind(el, ctx) {
    const form = el.querySelector('#tm-form');
    const input = el.querySelector('#tm-cmd');
    form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
    el.querySelector('.tm-screen').addEventListener('click', (e) => {
      const dir = e.target.closest('.tm-dir');
      if (dir) { run(`cd ${dir.dataset.domain || '..'}`); return; }
      const shot = e.target.closest('.tm-shot');
      if (shot) { showShot(shot.dataset.shot, shot.dataset.name); return; }
      if (!e.target.closest('a') && !window.getSelection().toString()) input.focus();
    });
    // 输入即搜索的降级：输入框留空时的实时搜索不适用于命令行；Esc 清空
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') input.value = ''; });
    cleanup.push(ctx.onChange(() => paint()));
    paint();
  }

  /* ---- 截图查看器 ------------------------------------------------------------ */
  function showShot(src, name) {
    const el = elRef;
    let ov = el.querySelector('.tm-shotview');
    if (!ov) {
      ov = document.createElement('div');
      ov.className = 'tm-shotview';
      ov.innerHTML = `<div class="tm-shotbar"><span class="tm-shotname"></span><button type="button">close ×</button></div><img alt="">`;
      ov.querySelector('button').addEventListener('click', () => ov.remove());
      ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
      el.querySelector('.tm-frame').appendChild(ov);
    }
    ov.querySelector('img').src = src;
    ov.querySelector('img').alt = `${name} 首页截图`;
    ov.querySelector('.tm-shotname').textContent = `open --shot ${name}`;
  }

  function focusSearch() {
    const q = document.querySelector('#tm-cmd');
    if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function unmount() { cleanup.forEach((fn) => fn()); cleanup = []; ctxRef = elRef = null; }
})();
