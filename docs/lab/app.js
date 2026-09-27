/* Design Skill Lab 外壳：风格注册与切换、URL 状态、目录筛选引擎。
   每个风格是 styles/<id>.js 里的一个模块：DSL.register(id, { mount(el, ctx), unmount(), focusSearch() })。
   页面本体由风格模块渲染；外壳只管切换器、地址栏和数据。 */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const root = document.documentElement;
  const appEl = $('#app');
  const CONTENT = window.CONTENT;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- registry ------------------------------------------------------------ */
  const mods = {};      // id -> module
  const loading = {};   // id -> Promise
  window.DSL = {
    // 给核验脚本用：拿到已注册的风格模块（例如小岛的离屏快照）。
    module: (id) => mods[id] || null,
    register(id, mod) {
      mods[id] = mod;
      // 模块可能在注册时还没执行完自身作用域（模块级 const 的 TDZ），挂载推迟到微任务。
      if (waiting === id) queueMicrotask(() => { waiting = null; mount(id); });
    },
  };
  let waiting = null;
  function load(id) {
    if (mods[id]) return Promise.resolve();
    if (loading[id]) return loading[id];
    loading[id] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = `styles/${id}.js`;
      s.onload = () => res();
      s.onerror = () => rej(new Error(`风格模块加载失败：${id}`));
      document.head.appendChild(s);
    });
    return loading[id];
  }

  /* ---- web fonts ------------------------------------------------------------
     每个风格声明要用的字体包；挂载前注入 <link>。字体栈里 CDN 字体排在系统字体前，
     加载失败或网络不通时文字仍由系统字体渲染，页面不会因此不可用。 */
  const fontLinks = {};
  function ensureFonts(id) {
    const s = CONTENT.styles.find((x) => x.id === id);
    const F = CONTENT.fonts;
    if (!s || !F) return;
    (s.fonts || []).forEach((key) => {
      const pack = F.packs[key];
      if (!pack) return;
      pack.css.forEach((path) => {
        const href = F.cdn + path;
        if (fontLinks[href]) return;
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = href;
        l.onerror = () => console.warn(`字体未能加载，已落回系统字体：${href}`);
        document.head.appendChild(l);
        fontLinks[href] = l;
      });
    });
  }

  /* ---- data ---------------------------------------------------------------- */
  /* 数据全部来自生成文件（../data/，由 scripts/build-catalog.py 写出）：
     lab-catalog.js → window.CATALOG + window.CATALOG_ZH；thumbs.js → window.THUMBS（只含通过像素校验的缩略图，
     路径相对 docs/ 根，所以这里补 '../'）。没有缩略图的条目 shot 为 null，各风格自己退化。 */
  const CAT = window.CATALOG || { domains: {}, resources: [] };
  const ZH = window.CATALOG_ZH || {};
  const THUMBS = window.THUMBS || {};
  const order = Object.keys(CAT.domains);
  const rank = { S: 0, A: 1, B: 2 };
  const res = CAT.resources.map((r) => ({ ...r, zh: ZH[r.id] || '', shot: THUMBS[r.id] ? '../' + THUMBS[r.id].src : null }));
  const domains = order.map((id) => {
    // 域的名字、导语、色相：content.js 里有就用它（本页的配色），没有就用目录数据自带的，最后退到中性值。
    const cat = CAT.domains[id];
    const meta = { zh: cat.zh || cat.title || id, blurb: cat.blurb || cat.intro || '', hue: cat.hue ?? 0, ...CONTENT.domains[id] };
    const items = res.filter((r) => r.domain === id);
    return {
      id, ...meta, count: items.length,
      sections: cat.sections.map((s) => ({
        id: s.id, key: `${id}:${s.id}`, zh: s.zh || s.title, note: s.note_zh || s.note,
        items: items.filter((r) => r.section === s.id).sort((a, b) => rank[a.tier] - rank[b.tier]),
      })),
    };
  });
  const totals = {
    resources: res.length,
    domains: order.length,
    sections: domains.reduce((n, d) => n + d.sections.length, 0),
    s: res.filter((r) => r.tier === 'S').length,
    shots: res.filter((r) => r.shot).length,
    skills: CONTENT.skills.length,
    styles: CONTENT.styles.length,
  };

  /* 中文数字（0–9999），给"十五个域""八百一十二件"这类文案用；更大的数直接用阿拉伯数字。 */
  const CN = '零一二三四五六七八九', UNIT = ['', '十', '百', '千'];
  function cn(n) {
    if (!Number.isInteger(n) || n < 0 || n > 9999) return String(n);
    if (n < 10) return CN[n];
    if (n < 20) return '十' + (n % 10 ? CN[n % 10] : '');
    const ds = String(n).split('').map(Number);
    let out = '', gap = false;
    ds.forEach((d, i) => {
      if (!d) { gap = true; return; }
      out += (gap ? '零' : '') + CN[d] + UNIT[ds.length - 1 - i];
      gap = false;
    });
    return out;
  }
  /* content.js 的文案里不手写数字：把 {resources}、{domains_zh} 这类占位按数据填好，风格模块拿到的是成品。 */
  (function fill(o) {
    Object.keys(o).forEach((k) => {
      if (k === 'fonts') return;
      const v = o[k];
      if (typeof v === 'string') o[k] = v.replace(/\{(\w+?)(_zh)?\}/g, (m, key, zh) => (key in totals ? (zh ? cn(totals[key]) : String(totals[key])) : m));
      else if (v && typeof v === 'object') fill(v);
    });
  })(CONTENT);

  /* ---- state + URL --------------------------------------------------------- */
  const FIELDS = ['q', 'tier', 'kind', 'access', 'reach', 'lang', 'origin'];
  const state = { style: root.dataset.style, domain: '', q: '', tier: '', kind: '', access: '', reach: '', lang: '', origin: '' };
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.domain = p.get('domain') || '';
    FIELDS.forEach((f) => { state[f] = p.get(f) || ''; });
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.style !== 'swatch') p.set('style', state.style);
    if (state.domain) p.set('domain', state.domain);
    FIELDS.forEach((f) => { if (state[f]) p.set(f, state[f]); });
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ---- filtering ----------------------------------------------------------- */
  const KIND = CAT.kinds || {}, ACCESS = CONTENT.access, REACH = CONTENT.reach;
  const domZh = Object.fromEntries(domains.map((d) => [d.id, d.zh]));
  const hay = new Map(res.map((r) => [r.id, [r.name, r.best_for, r.how_to_use, r.license, r.url, r.zh, (r.tags || []).join(' '), KIND[r.kind], domZh[r.domain]].join(' ').toLowerCase()]));
  function match(r) {
    if (state.tier && r.tier !== state.tier) return false;
    if (state.kind && r.kind !== state.kind) return false;
    if (state.access && r.access !== state.access) return false;
    if (state.reach && r.agent_access !== state.reach) return false;
    if (state.lang && r.lang !== state.lang) return false;
    if (state.origin && !r.origin.startsWith(state.origin)) return false;
    if (state.domain && r.domain !== state.domain) return false;
    const q = state.q.trim().toLowerCase();
    return !q || q.split(/\s+/).every((w) => hay.get(r.id).includes(w));
  }
  const filtering = () => !!(state.q.trim() || state.tier || state.kind || state.access || state.reach || state.lang || state.origin);
  /* view(): 风格模块据此渲染目录区。
     domains → 域总览（默认）; domain → 单域小节; results → 筛选/搜索结果（按域分组）。 */
  function view() {
    if (!filtering() && !state.domain) return { mode: 'domains', domains };
    if (!filtering() && state.domain) {
      return { mode: 'domain', domain: domains.find((d) => d.id === state.domain) };
    }
    const pool = res.filter(match);
    const groups = domains
      .map((d) => ({ domain: d, items: pool.filter((r) => r.domain === d.id).sort((a, b) => rank[a.tier] - rank[b.tier]) }))
      .filter((g) => g.items.length);
    return { mode: 'results', groups, total: pool.length };
  }

  /* ---- context for style modules ------------------------------------------- */
  const listeners = new Set();
  const ctx = {
    content: CONTENT, totals, domains, state, esc, cn, reduced: REDUCED,
    kindZh: (k) => KIND[k] || k,
    accessZh: (a) => ACCESS[a] || a,
    reachZh: (a) => REACH[a] || a,
    tierZh: (t) => CONTENT.tierNote[t] || t,
    zh: (r) => r.zh || r.best_for,
    view,
    set(patch) {
      Object.assign(state, patch);
      writeUrl();
      const v = view();
      listeners.forEach((fn) => fn(v));
      announce(v);
    },
    reset() {
      state.domain = '';
      FIELDS.forEach((f) => { state[f] = ''; });
      writeUrl();
      listeners.forEach((fn) => fn(view()));
    },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    board: () => CONTENT.styles.find((s) => s.id === state.style),
    goto: (id) => setStyle(id),
  };

  /* 结果条数交给外壳统一播报（风格模块自带 live region 的，比如控制台，就不重复）。 */
  const live = $('#lab-live');
  let liveTimer = 0;
  function announce(v) {
    if (appEl.querySelector('[aria-live="polite"], [role="status"]')) return;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      live.textContent = v.mode === 'results' ? `${v.total} 条匹配` : v.mode === 'domain' && v.domain ? `${v.domain.zh}，${v.domain.count} 条` : '';
    }, 400);
  }

  /* ---- mounting ------------------------------------------------------------ */
  let currentId = null;
  // 换风格从页顶开始。上一个方向的滚动位置不能留下来，否则新页面的滚动条停在中段。
  function pinTop() {
    const se = document.scrollingElement;
    if (se) se.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  function mount(id) {
    const mod = mods[id];
    if (!mod) return;
    if (currentId && mods[currentId] && mods[currentId].unmount) {
      try { mods[currentId].unmount(); } catch (e) { console.error(e); }
    }
    listeners.clear();
    appEl.innerHTML = '';
    currentId = id;
    root.dataset.style = id;
    document.title = `${ctx.board().name} ${ctx.board().en} · 设计方向实验室 · Design Skill Lab`;
    pick.value = id;
    mod.mount(appEl, ctx);
    pinTop();
  }
  function setStyle(id) {
    if (!CONTENT.styles.some((s) => s.id === id) || id === state.style && currentId === id) return;
    state.style = id;
    writeUrl();
    try { localStorage.setItem('dsl-style', id); } catch (e) {}
    ensureFonts(id);
    const swap = () => {
      if (mods[id]) mount(id);
      else { waiting = id; load(id).catch((e) => { waiting = null; console.error(e); }); }
    };
    if (document.startViewTransition && !REDUCED && currentId) {
      const vt = document.startViewTransition(swap);
      // 过渡结束时有的浏览器会把旧滚动位置写回来。
      vt.finished.then(pinTop, pinTop);
    } else swap();
  }

  /* ---- 实验室横条（index.html 里的静态 HTML，不随风格重建）----------------------
     横条上的下拉列出全部方向：各风格自己的入口在窄屏上会横向滚动，这里保证任何方向在任何风格里都能一步到达。 */
  const pick = $('#lab-pick');
  // 横条高度写进 --lab-bar-h：整屏布局的风格（小岛、终端）据此让出顶部，不被横条压住。
  const bar = $('.lab-bar');
  const barH = () => root.style.setProperty('--lab-bar-h', bar.offsetHeight + 'px');
  barH();
  if (window.ResizeObserver) new ResizeObserver(barH).observe(bar);
  pick.innerHTML = CONTENT.styles.map((s) => `<option value="${s.id}">${String(s.num).padStart(2, '0')} ${esc(s.name)} ${esc(s.en)}</option>`).join('');
  pick.addEventListener('change', () => setStyle(pick.value));
  pick.parentElement.hidden = false;   // 没有脚本时下拉是空的，所以默认隐藏
  document.querySelectorAll('[data-fill]').forEach((el) => {
    const [key, zh] = el.dataset.fill.split('_');
    if (key in totals) el.textContent = zh ? cn(totals[key]) : String(totals[key]);
  });
  // 横条跟随新版站点的语言（?lang= > 站点上保存的选择 > 浏览器语言）；各方向的正文只有中文，英文横条会说明这一点。
  const lang = (() => {
    let l = (/[?&]lang=(zh|en)\b/.exec(location.search) || [])[1];
    try { l = l || localStorage.getItem('dsl-lang'); } catch (e) {}
    return l === 'zh' || l === 'en' ? l : /^zh\b/i.test(navigator.language || 'zh') ? 'zh' : 'en';
  })();
  if (lang === 'en') {
    bar.lang = 'en';
    bar.setAttribute('aria-label', 'About this lab');
    $('.lab-bar-nav').setAttribute('aria-label', 'Back to the new site');
    const [home, cat] = document.querySelectorAll('.lab-bar-nav a');
    home.textContent = '← New home'; cat.textContent = 'Catalogue';
    $('.lab-bar-note').innerHTML = `<b>Directions lab</b>: the same catalogue set ${totals.styles} ways, the method’s first experiments, kept for comparison. The pages themselves are in Chinese.`;
    $('.lab-bar-pick span').textContent = 'Direction';
    pick.setAttribute('aria-label', 'Switch direction');
    const skip = $('.lab-skip');
    skip.lang = 'en'; skip.textContent = 'Skip to catalogue search';
  }
  // 跳过链接：直接把焦点交给当前风格的搜索框（每个风格模块都实现 focusSearch）。
  $('.lab-skip').addEventListener('click', (e) => {
    if (!currentId || !mods[currentId].focusSearch) return;
    e.preventDefault();
    mods[currentId].focusSearch();
  });

  /* ---- 页内风格入口 ----------------------------------------------------------
     切换器不再是外壳浮动件：每个风格模块在自己的版式里渲染 [data-goto] 链接，
     外壳只在 appEl 上做一层委托（appEl 本身不随 innerHTML 重建，监听一直有效）。 */
  appEl.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (!g) return;
    e.preventDefault();
    setStyle(g.dataset.goto);
  });

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (!typing && /^[0-9]$/.test(e.key)) {
      // 数字键只覆盖前十个方向（1–9、0）；之后的用 [ ] 前后切换。
      const s = CONTENT.styles.find((x) => x.num <= 10 && x.num % 10 === Number(e.key));
      if (s) setStyle(s.id);
    } else if (!typing && (e.key === '[' || e.key === ']')) {
      const n = CONTENT.styles.length;
      const i = CONTENT.styles.findIndex((x) => x.id === state.style);
      setStyle(CONTENT.styles[(i + (e.key === ']' ? 1 : n - 1)) % n].id);
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      if (currentId && mods[currentId].focusSearch) mods[currentId].focusSearch();
    }
  });
  window.addEventListener('popstate', () => {
    const before = state.style;
    readUrl();
    const p = new URLSearchParams(location.search);
    const st = p.get('style');
    if (st && st !== before) { state.style = st; setStyle(st); }
    else listeners.forEach((fn) => fn(view()));
  });

  /* ---- boot ----------------------------------------------------------------- */
  readUrl();
  const p0 = new URLSearchParams(location.search);
  state.style = CONTENT.styles.some((s) => s.id === p0.get('style')) ? p0.get('style') : root.dataset.style;
  waiting = state.style;
  ensureFonts(state.style);
  load(state.style).catch((e) => {
    waiting = null;
    console.error(e);
    appEl.innerHTML = '<p style="padding:4rem;font-family:monospace">风格模块加载失败。</p>';
  });
})();
