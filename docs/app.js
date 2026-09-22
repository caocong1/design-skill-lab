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

  /* ---- data ---------------------------------------------------------------- */
  const CAT = window.CATALOG || { domains: {}, resources: [] };
  const ZH = window.CATALOG_ZH || {};
  const SHOTS = new Set(window.SHOTS || []);
  const order = Object.keys(CAT.domains);
  const rank = { S: 0, A: 1, B: 2 };
  const res = CAT.resources.map((r) => ({ ...r, zh: ZH[r.id] || '', shot: SHOTS.has(r.id) ? `assets/shots/${r.id}.jpg` : null }));
  const domains = order.map((id) => {
    const meta = CONTENT.domains[id] || { zh: id, blurb: '', hue: 0 };
    const items = res.filter((r) => r.domain === id);
    return {
      id, ...meta, count: items.length,
      sections: CAT.domains[id].sections.map((s) => {
        const key = `${id}:${s.id}`;
        const zhSec = CONTENT.sections[key];
        return {
          id: s.id, key, zh: zhSec ? zhSec[0] : s.title, note: zhSec ? zhSec[1] : s.note,
          items: items.filter((r) => r.section === s.id).sort((a, b) => rank[a.tier] - rank[b.tier]),
        };
      }),
    };
  });
  const totals = {
    resources: res.length,
    domains: order.length,
    s: res.filter((r) => r.tier === 'S').length,
    shots: [...SHOTS].length,
    skills: CONTENT.skills.length,
  };

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
  const KIND = CONTENT.kind, ACCESS = CONTENT.access, REACH = CONTENT.reach;
  const hay = new Map(res.map((r) => [r.id, [r.name, r.best_for, r.how_to_use, r.license, r.url, r.zh, r.tags.join(' '), KIND[r.kind], (CONTENT.domains[r.domain] || {}).zh].join(' ').toLowerCase()]));
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
    content: CONTENT, totals, domains, state, esc, reduced: REDUCED,
    kindZh: (k) => KIND[k] || k,
    accessZh: (a) => ACCESS[a] || a,
    reachZh: (a) => REACH[a] || a,
    tierZh: (t) => CONTENT.tierNote[t] || t,
    zh: (r) => r.zh || r.best_for,
    view,
    set(patch) {
      Object.assign(state, patch);
      writeUrl();
      listeners.forEach((fn) => fn(view()));
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

  /* ---- mounting ------------------------------------------------------------ */
  let currentId = null;
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
    document.title = `Design Skill Lab · ${ctx.board().name} ${ctx.board().en}`;
    mod.mount(appEl, ctx);
  }
  function setStyle(id) {
    if (!CONTENT.styles.some((s) => s.id === id) || id === state.style && currentId === id) return;
    state.style = id;
    writeUrl();
    try { localStorage.setItem('dsl-style', id); } catch (e) {}
    const swap = () => {
      if (mods[id]) mount(id);
      else { waiting = id; load(id).catch((e) => { waiting = null; console.error(e); }); }
    };
    if (document.startViewTransition && !REDUCED && currentId) document.startViewTransition(swap);
    else swap();
  }

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
  load(state.style).catch((e) => {
    waiting = null;
    console.error(e);
    appEl.innerHTML = '<p style="padding:4rem;font-family:monospace">风格模块加载失败。</p>';
  });
})();
