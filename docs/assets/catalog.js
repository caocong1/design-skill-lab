/* Catalogue workbench (/catalog/): weighted search, facets with live counts, list / plates / register views,
   the proof-note pane (detail drawer), URL state and keys. No framework, no build.
   Load order (all defer): assets/site.js → assets/catalog.js → data/catalog.js → data/thumbs.js.
   The strings apply at once; the bench is set on DOMContentLoaded, when the data scripts have run.

   URL state   ?q= &domain= &section= &kind= &tier= &reach= &access= &rlang= &region= &status=   (comma lists)
               &sort=best|tier|name|domain  &view=list|grid|table  &id=<resource id>    (?lang=zh|en is the UI language)
               &open=1 (sent by the header search on the other pages): land on the top hit as if Enter was pressed here,
               so "/", type, Enter opens the note from any page; the flag is dropped from the URL at once.
   Old links   ?reach= kept its meaning; ?lang=ja|ko|multi meant the resource language and becomes rlang.
   Keys        /  search (site.js) · j k move · Enter open the note · o open the site · Esc close
   Search      tokens: Latin words (plural folded, colour/color), CJK runs → glossary words + bigrams.
               Field weights: name 10 > name_zh, tags 8 > zh (first clause 6, rest 4), best_for 5 > how_to_use (+ zh_how) 3,
               taxonomy labels 3 > host 2; ×1.2 when a query word (or its glossary equivalent) names the row's domain.
               Latin terms under 3 characters match whole words only ("ai" never hits "tailwind"); longer terms also
               match inside words at half weight. Ranked by score (5 % buckets of the best score), then tier.
               Checked against assets/search-goldens.json; DSL.catalogSearch(q) returns ranked ids for tests. */
(function (W, D) {
  'use strict';
  var DSL = W.DSL, esc = DSL.esc, L = DSL.L, t = DSL.t;

  DSL.init({
    zh: {
      h1: '资源目录', skip_results: '跳到检索结果',
      lede: '每一条都写明怎么直达、什么授权、要不要登录、agent 能不能读到。给 agent 的纯文本：<a href="../data/llms.txt" lang="en">llms.txt</a> 和 <a href="../data/catalog.json" lang="en">catalog.json</a>。',
      q_clear: '清除搜索', filters_close: '收起筛选',
      loading: '正在载入目录数据…', results_h: '检索结果', filters: '筛选', view: '视图',
      filters_on: function (n) { return '已选 ' + n + ' 项'; }, show_n: function (n) { return '查看 ' + n + ' 条结果'; },
      sort: '排序', sort_best: '最佳匹配', sort_tier: '分级', sort_name: '名称', sort_domain: '按域',
      f_region: '地区', more_kinds: function (n) { return '另 ' + n + ' 种类型'; }, fewer_kinds: '收起',
      sunset_note: '默认不显示', more: function (n, k) { return '再显示 ' + n + ' 条（还有 ' + k + ' 条）'; },
      empty_h: function (q) { return q ? '没有找到“' + q + '”' : '这组筛选下没有条目'; },
      empty_f: function (n) { return '去掉筛选后有 ' + n + ' 条'; }, empty_drop: '去掉全部筛选', empty_try: '换个词试试',
      error: '目录数据没有载入。不用脚本也能读全表：<a href="../data/llms.txt">纯文本全表 <span lang="en">llms.txt</span></a>',
      name_col: '名称', desc_col: '说明', reg_label: '登记表（可横向滚动）', path_col: '域与小节', lang_region: '语言与地区', also: '也收在', api: 'API',
      imaged: '成像', siblings: '同一小节', section_all: function (n) { return '看这一节全部 ' + n + ' 条'; },
      not_in: '不在当前结果里', api_sample: '示例',
      th_screenshot: '截图，已通过自动质检', th_og: '站点的分享图（og:image），已通过自动质检', th_github: 'GitHub 仓库卡片',
      th_none: '暂无通过质检的截图，用排字卡代替',
      reach_note: {
        static: '直接抓取就能读到正文', js: '要在浏览器里执行 JS 才有内容', blocked: '有反爬墙：把链接交给人打开', unknown: '还没核验'
      },
      alt_shot: function (n) { return n + ' 的页面截图'; }, alt_card: function (n) { return n + ' 的排字卡'; },
      title_note: function (n) { return n + ' · 资源目录 · Design Skill Lab'; }, title_page: '资源目录 · Design Skill Lab',
      link_copied: '链接已复制'
    },
    en: {
      h1: 'Catalogue', skip_results: 'Skip to results',
      lede: 'Every entry says how to get there, the licence, whether you need to log in, and whether an agent can read it. Plain text for agents: <a href="../data/llms.txt">llms.txt</a> and <a href="../data/catalog.json">catalog.json</a>.',
      q_clear: 'Clear the search', filters_close: 'Close filters',
      loading: 'Loading the catalogue…', results_h: 'Results', filters: 'Filters', view: 'View',
      filters_on: function (n) { return n + ' selected'; }, show_n: function (n) { return 'Show ' + n + (n === 1 ? ' result' : ' results'); },
      sort: 'Sort', sort_best: 'Best match', sort_tier: 'Tier', sort_name: 'Name', sort_domain: 'By domain',
      f_region: 'Region', more_kinds: function (n) { return n + ' more kinds'; }, fewer_kinds: 'Fewer',
      sunset_note: 'hidden by default', more: function (n, k) { return 'Show ' + n + ' more (' + k + ' left)'; },
      empty_h: function (q) { return q ? 'Nothing found for “' + q + '”' : 'No entries under these filters'; },
      empty_f: function (n) { return n + ' without the filters'; }, empty_drop: 'Clear all filters', empty_try: 'Try',
      error: 'The catalogue data did not load. The full list as plain text: <a href="../data/llms.txt">llms.txt</a>',
      name_col: 'Name', desc_col: 'Description', reg_label: 'Register table (scrolls sideways)', path_col: 'Domain and section', lang_region: 'Language and region', also: 'Also in', api: 'API',
      imaged: 'Image', siblings: 'Same section', section_all: function (n) { return 'All ' + n + ' in this section'; },
      not_in: 'Not in the current results', api_sample: 'sample',
      th_screenshot: 'Screenshot, passed automatic QA', th_og: 'The site’s share image (og:image), passed automatic QA', th_github: 'GitHub repository card',
      th_none: 'No screenshot has passed QA yet; a set card stands in',
      reach_note: {
        static: 'A plain fetch reads the content', js: 'Content appears only after JavaScript runs', blocked: 'Bot wall: hand the link to a person', unknown: 'Not checked yet'
      },
      alt_shot: function (n) { return 'Screenshot of ' + n; }, alt_card: function (n) { return 'Set card for ' + n; },
      title_note: function (n) { return n + ' · Catalogue · Design Skill Lab'; }, title_page: 'Catalogue · Design Skill Lab',
      link_copied: 'Link copied'
    }
  });

  var REGION = { global: ['全球', 'Global'], cn: ['中国', 'China'], jp: ['日本', 'Japan'], kr: ['韩国', 'Korea'] };
  var TIER_N = { S: 0, A: 1, B: 2 };
  var PAGE = 60;
  var KIND_TOP = 8;
  var TRY = ['配色', '动效曲线', 'font', 'figma mcp', '无障碍', 'icon'];

  /* ============================== search ============================== */
  var CJK_R = '\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af';
  var IS_CJK = new RegExp('[' + CJK_R + ']');
  var RUN = new RegExp('[' + CJK_R + ']+|[a-z0-9]+', 'g');
  var STOP = { a: 1, an: 1, and: 1, the: 1, of: 1, 'for': 1, to: 1, 'in': 1, on: 1, 'with': 1, by: 1, or: 1, is: 1, are: 1, at: 1, as: 1, from: 1, vs: 1 };
  var STOP_ZH = { '的': 1, '和': 1, '与': 1, '及': 1, '或': 1 };
  /* design words whose English equivalents raise a row that already contains the Chinese word (a boost, never a match
     on their own, never underlined). They also segment a run: 动效曲线 → 动效 + 曲线, never the junk bigram 效曲. */
  var GLOSS = {
    '配色': ['palette', 'colour', 'color'], '色板': ['palette', 'swatch'], '调色板': ['palette'], '颜色': ['colour', 'color'],
    '色彩': ['colour', 'color'], '色阶': ['scale'], '对比度': ['contrast'], '字体': ['font', 'typeface'], '字库': ['font', 'foundry'],
    '排版': ['typography'], '图标': ['icon'], '插画': ['illustration'], '动效': ['motion', 'animation'], '动画': ['animation', 'motion'],
    '曲线': ['easing', 'bezier', 'curve'], '缓动': ['easing'], '弹簧': ['spring'], '无障碍': ['accessibility', 'a11y'],
    '图表': ['chart'], '可视化': ['visualisation', 'visualization', 'dataviz'], '大屏': ['dashboard'], '仪表盘': ['dashboard'],
    '组件': ['component'], '渐变': ['gradient'], '样机': ['mockup'], '落地页': ['landing'], '原型': ['prototype', 'prototyping'],
    '品牌': ['brand'], '标志': ['logo'], '截图': ['screenshot'], '灵感': ['inspiration'], '规范': ['guideline', 'guidelines']
  };
  var GKEYS = Object.keys(GLOSS).sort(function (a, b) { return b.length - a.length; });

  function norm(s) { return String(s == null ? '' : s).normalize('NFKC').toLowerCase(); }
  function alnum(c) { return (c >= 48 && c <= 57) || (c >= 97 && c <= 122); }
  /* a Latin term in a field: 1 = at a word start (whole word for terms < 3 chars), .5 = inside a word (3+ chars), 0 = absent */
  function latin(term, text) {
    var i = text.indexOf(term), mid = 0, n = term.length;
    while (i >= 0) {
      var start = i === 0 || !alnum(text.charCodeAt(i - 1));
      if (n < 3) { if (start && (i + n >= text.length || !alnum(text.charCodeAt(i + n)))) return 1; }
      else if (start) return 1;
      else mid = 0.5;
      i = text.indexOf(term, i + 1);
    }
    return n < 3 ? 0 : mid;
  }
  function variants(w) {
    if (w.length >= 4 && /[^s]s$/.test(w)) w = w.slice(0, -1);          /* fonts → font; prefix matching finds both */
    var v = [w], swap = [['colour', 'color'], ['grey', 'gray'], ['isation', 'ization']];
    swap.forEach(function (p) {
      if (w.indexOf(p[0]) >= 0) v.push(w.replace(p[0], p[1]));
      else if (w.indexOf(p[1]) >= 0) v.push(w.replace(p[1], p[0]));
    });
    return v;
  }
  function latinUnit(w) { return { key: 'l:' + w, cjk: '', lat: variants(w), gl: [] }; }
  function cjkUnit(s) { return { key: 'c:' + s, cjk: s, lat: [], gl: GLOSS[s] || [] }; }

  /* query → groups; every group must match (AND). A CJK run is one group whose units need ≥ 60 % coverage (all when ≤ 2). */
  function tokenize(q) {
    var groups = [];
    (norm(q).match(RUN) || []).forEach(function (run) {
      if (!IS_CJK.test(run)) {
        if (run.length > 1 && !STOP[run]) groups.push({ units: [latinUnit(run)] });
        return;
      }
      if (run.length === 1) { if (!STOP_ZH[run]) groups.push({ units: [cjkUnit(run)] }); return; }
      var taken = [], units = [], seen = {};
      GKEYS.forEach(function (k) {
        for (var at = run.indexOf(k); at >= 0; at = run.indexOf(k, at + 1)) {
          var free = true, c;
          for (c = at; c < at + k.length; c++) if (taken[c]) free = false;
          if (!free) continue;
          for (c = at; c < at + k.length; c++) taken[c] = true;
          if (!seen[k]) { seen[k] = 1; units.push(cjkUnit(k)); }
        }
      });
      var seg = '';
      for (var c = 0; c <= run.length; c++) {
        if (c < run.length && !taken[c]) { seg += run.charAt(c); continue; }
        for (var j = 0; j + 1 < seg.length; j++) { var b = seg.substr(j, 2); if (!seen[b]) { seen[b] = 1; units.push(cjkUnit(b)); } }
        seg = '';
      }
      if (units.length) groups.push({ units: units });
    });
    return groups;
  }

  function engine(rows) {
    var N = rows.length, dfc = {};
    function hit(u, text) {
      if (u.cjk) return text.indexOf(u.cjk) >= 0 ? 1 : 0;
      var m = 0;
      for (var b = 0; b < u.lat.length && m < 1; b++) { var h = latin(u.lat[b], text); if (h > m) m = h; }
      return m;
    }
    /* best field + 0.3 × second-best field (a word in the name and in the description beats the name alone),
       + 0.4 × the best field holding a glossary equivalent, once the word itself matched */
    function unit(u, row) {
      var best = 0, second = 0, alt = 0;
      for (var j = 0; j < row.f.length; j++) {
        var f = row.f[j];
        if (!f[0]) continue;
        var v = f[1] * hit(u, f[0]);
        if (v > best) { second = best; best = v; } else if (v > second) second = v;
        for (var g = 0; g < u.gl.length; g++) { var a = f[1] * latin(u.gl[g], f[0]); if (a > alt) alt = a; }
      }
      return best ? best + 0.3 * second + 0.4 * alt : 0;
    }
    /* does any query word (or its glossary equivalent) name the domain? 配色 → colour → 色彩 / Colour */
    function names(groups, dn) {
      for (var g = 0; g < groups.length; g++) {
        for (var k = 0; k < groups[g].units.length; k++) {
          var u = groups[g].units[k];
          if (hit(u, dn)) return true;
          for (var j = 0; j < u.gl.length; j++) if (latin(u.gl[j], dn) === 1) return true;
        }
      }
      return false;
    }
    function df(u) {
      if (!(u.key in dfc)) { var n = 0; for (var i = 0; i < N; i++) if (unit(u, rows[i])) n++; dfc[u.key] = n; }
      return dfc[u.key];
    }
    /* → { groups, qn, score: Float64Array (0 = no match) } */
    function run(q) {
      var groups = tokenize(q), qn = norm(q).trim().replace(/\s+/g, ' ');
      groups.forEach(function (g) {
        if (g.units.length > 1) {                          /* a bigram found nowhere (效曲 in 动效曲线) only dilutes coverage */
          var live = g.units.filter(function (u) { return df(u) > 0; });
          if (live.length) g.units = live;
        }
        g.need = g.units.length <= 2 ? g.units.length : Math.ceil(g.units.length * 0.6);
        g.units.forEach(function (u) { u.idf = Math.log(1 + N / Math.max(1, df(u))); });
      });
      var score = new Float64Array(N);
      if (!groups.length) return { groups: groups, qn: qn, score: null };
      for (var i = 0; i < N; i++) {
        var row = rows[i], total = 0, ok = true;
        for (var g = 0; g < groups.length && ok; g++) {
          var G = groups[g], got = 0, s = 0;
          for (var k = 0; k < G.units.length; k++) { var v = unit(G.units[k], row); if (v) { got++; s += v * G.units[k].idf; } }
          if (got < G.need) ok = false; else total += s;
        }
        if (!ok) continue;
        if (names(groups, row.dn)) total *= 1.2;                                      /* the query names this row's domain */
        var name = row.f[0][0], nz = row.f[1][0];
        if (name === qn || nz === qn) total *= 1.5;                                   /* exact name */
        else if (groups.length > 1 && (name.indexOf(qn) >= 0 || (nz && nz.indexOf(qn) >= 0))) total *= 1.25;  /* the phrase in the name */
        score[i] = total;
      }
      return { groups: groups, qn: qn, score: score };
    }
    return { run: run };
  }

  /* marks for the proof-red underline: the CJK strings and Latin terms (with their spelling variants) of the query */
  function marksOf(groups) {
    var out = [], seen = {};
    groups.forEach(function (g) {
      g.units.forEach(function (u) {
        if (u.cjk && !seen[u.cjk]) { seen[u.cjk] = 1; out.push({ s: u.cjk, lat: false }); }
        u.lat.forEach(function (s) { if (!seen[s]) { seen[s] = 1; out.push({ s: s, lat: true }); } });
      });
    });
    return out;
  }
  function hl(text, marks) {
    text = String(text == null ? '' : text);
    if (!marks || !marks.length || !text) return esc(text);
    var low = text.toLowerCase();
    if (low.length !== text.length) return esc(text);
    var on = new Uint8Array(text.length), any = false;
    marks.forEach(function (m) {
      for (var i = low.indexOf(m.s); i >= 0; i = low.indexOf(m.s, i + 1)) {
        if (m.lat && m.s.length < 3) {
          var pre = i === 0 || !alnum(low.charCodeAt(i - 1)), post = i + m.s.length >= low.length || !alnum(low.charCodeAt(i + m.s.length));
          if (!pre || !post) continue;
        }
        for (var k = i; k < i + m.s.length; k++) on[k] = 1;
        any = true;
      }
    });
    if (!any) return esc(text);
    var out = '', open = false;
    for (var c = 0; c < text.length; c++) {
      if (on[c] && !open) { out += '<mark class="pm">'; open = true; }
      else if (!on[c] && open) { out += '</mark>'; open = false; }
      out += esc(text.charAt(c));
    }
    return out + (open ? '</mark>' : '');
  }

  /* ============================== state ============================== */
  var FKEYS = ['domain', 'section', 'tier', 'kind', 'reach', 'access', 'rlang', 'region', 'status'];
  var SORTS = { best: 1, tier: 1, name: 1, domain: 1 };
  var VIEWS = { list: 1, grid: 1, table: 1 };
  var state = { q: '', sort: 'best', view: 'list', id: '' };
  var openTop = false;
  FKEYS.forEach(function (k) { state[k] = []; });

  var cat, rows, eng, byId = {}, known = {};
  var qCache = { q: null, res: null };
  var results = [], total = 0, counts = {}, marks = [];
  var shown = PAGE, cur = '', kindsOpen = false, railOpen = false;
  var mqPane = W.matchMedia('(min-width: 1200px)');
  var mqRail = W.matchMedia('(min-width: 961px)');
  var mqNarrow = W.matchMedia('(max-width: 720px)');
  var $ = function (id) { return D.getElementById(id); };

  function val(key, r) {
    switch (key) {
      case 'reach': return r.agent_access || 'unknown';
      case 'rlang': return r.lang;
      default: return r[key];
    }
  }
  function has(list, v) { return list.indexOf(v) >= 0; }
  function passes(key, r) {
    if (key === 'status') return state.status.length ? has(state.status, r.status) : r.status !== 'sunset';  /* sunset: hidden unless asked for */
    return !state[key].length || has(state[key], val(key, r));
  }

  function readURL() {
    var p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    FKEYS.forEach(function (k) {
      state[k] = (p.get(k) || '').split(',').map(function (s) { return s.trim(); }).filter(function (v) { return known[k][v]; });
    });
    var lg = p.get('lang');
    if (lg && known.rlang[lg] && lg !== 'zh' && lg !== 'en' && !state.rlang.length) state.rlang = [lg];
    state.sort = SORTS[p.get('sort')] ? p.get('sort') : 'best';
    state.view = VIEWS[p.get('view')] ? p.get('view') : 'list';
    state.id = byId[p.get('id')] ? p.get('id') : '';
    openTop = p.get('open') === '1' && !!state.q.trim() && !state.id;
    pruneSections();
  }
  function writeURL() {
    var p = new URLSearchParams(), lg = new URLSearchParams(location.search).get('lang');
    if (state.q.trim()) p.set('q', state.q.trim());
    FKEYS.forEach(function (k) { if (state[k].length) p.set(k, state[k].join(',')); });
    if (state.sort !== 'best') p.set('sort', state.sort);
    if (state.view !== 'list') p.set('view', state.view);
    if (state.id) p.set('id', state.id);
    if (lg === 'zh' || lg === 'en') p.set('lang', lg);
    var s = p.toString().replace(/%2C/g, ',');
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }
  /* a section only means something inside a selected domain (ids like "tools" repeat across domains) */
  function pruneSections() {
    if (!state.section.length) return;
    if (!state.domain.length) {                          /* old link with ?section= alone: take its domain(s) */
      cat.domains.forEach(function (d) { if (state.section.some(function (s) { return d.secById[s]; })) state.domain.push(d.id); });
    }
    state.section = state.section.filter(function (s) { return state.domain.some(function (d) { return cat.dom[d].secById[s]; }); });
  }

  /* ============================== compute ============================== */
  var collator = W.Intl && Intl.Collator ? new Intl.Collator(DSL.lang === 'zh' ? 'zh-CN' : 'en', { sensitivity: 'base', numeric: true }) : null;
  function compute() {
    if (qCache.q !== state.q) qCache = { q: state.q, res: eng.run(state.q) };
    var res = qCache.res, score = res.score;
    marks = marksOf(res.groups);
    counts = {};
    FKEYS.forEach(function (k) { counts[k] = {}; });
    var out = [];
    total = 0;
    for (var i = 0; i < rows.length; i++) {
      if (score && !score[i]) continue;
      var r = rows[i].r, fails = 0, failKey = '';
      for (var k = 0; k < FKEYS.length && fails < 2; k++) if (!passes(FKEYS[k], r)) { fails++; failKey = FKEYS[k]; }
      if (!fails) {
        out.push({ row: rows[i], s: score ? score[i] : 0 });
        for (var m = 0; m < FKEYS.length; m++) { var c = counts[FKEYS[m]], v = val(FKEYS[m], r); c[v] = (c[v] || 0) + 1; }
      } else if (fails === 1) {                            /* disjunctive counts: what this option would add */
        var cc = counts[failKey], vv = val(failKey, r); cc[vv] = (cc[vv] || 0) + 1;
      }
      if (r.status !== 'sunset' || state.status.length) total++;
    }
    results = ranked(out, state.sort);
  }
  /* score buckets: 5 % of the best score; inside a bucket the tier decides ("score, then tier") */
  function tierCmp(a, b) { return TIER_N[a.row.r.tier] - TIER_N[b.row.r.tier]; }
  var CMP = {
    best: function (a, b) { return (b.b - a.b) || tierCmp(a, b) || (b.s - a.s) || (a.row.i - b.row.i); },
    tier: function (a, b) { return tierCmp(a, b) || (b.s - a.s) || (a.row.i - b.row.i); },
    name: function (a, b) { return (collator ? collator.compare(a.row.r.name, b.row.r.name) : (a.row.r.name < b.row.r.name ? -1 : 1)) || (a.row.i - b.row.i); },
    domain: function (a, b) { return (a.row.d - b.row.d) || (a.row.sx - b.row.sx) || tierCmp(a, b) || (b.s - a.s) || (a.row.i - b.row.i); }
  };
  function ranked(out, sort) {
    var top = 0;
    out.forEach(function (x) { if (x.s > top) top = x.s; });
    out.forEach(function (x) { x.b = top ? Math.round(20 * x.s / top) : 0; });
    return out.sort(CMP[sort]);
  }
  function activeCount() { return FKEYS.reduce(function (n, k) { return n + state[k].length; }, 0); }
  function indexOf(id) { for (var i = 0; i < results.length; i++) if (results[i].row.r.id === id) return i; return -1; }

  /* ============================== rendering helpers ============================== */
  function nameLang(s) {
    s = String(s || '');
    if (/[\u3040-\u30ff]/.test(s)) return ' lang="ja"';
    if (/[\uac00-\ud7af]/.test(s)) return ' lang="ko"';
    if (IS_CJK.test(s)) return DSL.lang === 'zh' ? '' : ' lang="zh-CN"';
    return DSL.lang === 'en' ? '' : ' lang="en"';
  }
  var EN = DSL.lang === 'en' ? '' : ' lang="en"';           /* English data text inside a zh page */
  var ZH = DSL.lang === 'zh' ? '' : ' lang="zh-CN"';
  function entryLink(id) { return DSL.href('./', { id: id }); }
  function hue(r) { var d = cat.dom[r.domain]; return d ? d.hue : 240; }
  function path(r) {
    return '<span class="path"><i class="tick" style="--h:' + hue(r) + '"></i>' + esc(cat.domainName(r.domain, true)) + ' › ' + esc(cat.sectionName(r)) + '</span>';
  }
  /* the plate / note slot: a QA-passed image, or the set card (kind + domain hue, the zh line, host). The name is the
     caption beside it, so the card never prints it a second time. */
  function media(r, cls, alt) {
    var th = cat.thumb(r);
    if (th) {
      return '<div class="' + cls + ' shot"' + (alt ? '' : ' aria-hidden="true"') + '><img src="' + esc(th.src) + '" width="800" height="500" loading="lazy" decoding="async" alt="' +
        (alt ? esc(t('alt_shot', r.name)) : '') + '"></div>';
    }
    return '<div class="' + cls + ' card" style="--h:' + hue(r) + '" aria-hidden="true"><span class="ck"><i class="tick"></i>' + esc(cat.kindName(r.kind)) + '</span>' +
      '<span class="cz"' + ZH + '>' + esc(r.zh) + '</span><span class="cf"><span lang="en">' + esc(r.host) + '</span></span></div>';
  }
  /* images fade in once they arrive; until then the slot is the paper well */
  function reveal(scope) {
    scope.querySelectorAll('.shot img:not(.in)').forEach(function (im) {
      if (im.complete && im.naturalWidth) im.classList.add('in');
      else { im.addEventListener('load', function () { im.classList.add('in'); }, { once: true }); }
    });
  }
  function primary(r) { return DSL.lang === 'en' ? r.best_for : r.zh; }
  function howOf(r) { return DSL.lang === 'zh' && r.zh_how ? [r.zh_how, ''] : [r.how_to_use, EN]; }
  function cur_(id) { return id === (state.id || cur) ? ' aria-current="true"' : ''; }

  /* a galley row: type only (the English line and every other field wait in the note) */
  function entryHTML(x) {
    var r = x.row.r, how = howOf(r), ag = DSL.agentTag(r.agent_access);
    var st = r.status !== 'active' ? '<span class="opt-m">' + esc(DSL.pair(DSL.STATUS[r.status])) + '</span>' : '';
    return '<li class="entry" data-id="' + esc(r.id) + '"' + cur_(r.id) + '>' +
      '<h3 class="entry-name"><a href="' + esc(entryLink(r.id)) + '" data-open="' + esc(r.id) + '"' + nameLang(r.name) + '>' + hl(r.name, marks) + '</a>' + DSL.tierSort(r.tier) + '</h3>' +
      '<p class="entry-zh">' + hl(primary(r), marks) + '</p>' +
      '<p class="entry-how"><b>' + esc(t('how')) + '</b><span' + how[1] + '>' + hl(how[0], marks) + '</span></p>' +
      '<p class="entry-meta">' + path(r) + '<span>' + esc(cat.kindName(r.kind)) + '</span><span lang="en">' + esc(r.host) + '</span>' + ag +
      '<span class="opt-m">' + esc(DSL.pair(DSL.ACCESS[r.access])) + '</span>' + st + '</p></li>';
  }
  function plateHTML(x) {
    var r = x.row.r;
    return '<li class="plate" data-id="' + esc(r.id) + '"' + cur_(r.id) + '>' + media(r, 'plate-media', false) +
      '<h3 class="plate-name"><a href="' + esc(entryLink(r.id)) + '" data-open="' + esc(r.id) + '"' + nameLang(r.name) + '>' + hl(r.name, marks) + '</a>' + DSL.tierSort(r.tier) + '</h3>' +
      '<p class="plate-meta">' + path(r) + DSL.agentTag(r.agent_access) + '</p></li>';
  }
  function rowHTML(x) {
    var r = x.row.r;
    return '<tr data-id="' + esc(r.id) + '"' + cur_(r.id) + '><td class="t-name"><a href="' + esc(entryLink(r.id)) + '" data-open="' + esc(r.id) + '"' + nameLang(r.name) + '>' + hl(r.name, marks) + '</a>' +
      '<span class="t-host" lang="en">' + esc(r.host) + '</span></td><td><span class="t-desc">' + hl(primary(r), marks) + '</span></td><td>' + path(r) + '</td>' +
      '<td>' + esc(cat.kindName(r.kind)) + '</td><td>' + DSL.tierSort(r.tier) + '</td><td>' + esc(DSL.pair(DSL.ACCESS[r.access])) + '</td><td>' + DSL.agentTag(r.agent_access) + '</td></tr>';
  }

  /* ============================== the rail (facets) ============================== */
  function facetOptions(key) {
    var C = cat.data;
    switch (key) {
      case 'domain': return cat.domains.map(function (d) { return { v: d.id, label: esc(cat.domainName(d, true)), pre: '<i class="tick" style="--h:' + d.hue + '"></i>' }; });
      case 'tier': return ['S', 'A', 'B'].map(function (v) { return { v: v, label: esc(DSL.pair(DSL.TIER[v])), pre: DSL.tierSort(v) }; });
      case 'kind': return (C.kinds || []).map(function (k) { return { v: k.id, label: esc(L(k.zh, k.en)), n0: known.kind[k.id] }; })
        .filter(function (o) { return o.n0; }).sort(function (a, b) { return b.n0 - a.n0; });
      case 'reach': return ['static', 'js', 'blocked', 'unknown'].map(function (v) { return { v: v, label: DSL.agentTag(v) }; });
      case 'access': return ['free', 'freemium', 'paid'].map(function (v) { return { v: v, label: esc(DSL.pair(DSL.ACCESS[v])) }; });
      case 'rlang': return ['zh', 'en', 'ja', 'ko', 'multi'].map(function (v) { return { v: v, label: esc(DSL.pair(DSL.RLANG[v])) }; });
      case 'region': return ['cn', 'global', 'jp', 'kr'].map(function (v) { return { v: v, label: esc(DSL.pair(REGION[v])) }; });
      case 'status': return ['active', 'slow', 'archived', 'sunset'].map(function (v) {
        return { v: v, label: esc(DSL.pair(DSL.STATUS[v])) + (v === 'sunset' && !state.status.length ? ' <small>' + esc(t('sunset_note')) + '</small>' : '') };
      });
    }
    return [];
  }
  function optHTML(key, o) {
    var n = counts[key][o.v] || 0, on = has(state[key], o.v);
    return '<label class="opt' + (n || on ? '' : ' zero') + '"><input type="checkbox" name="' + key + '" value="' + esc(o.v) + '"' + (on ? ' checked' : '') + (n || on ? '' : ' disabled') + '> ' +
      (o.pre || '') + '<span class="opt-l">' + o.label + '</span><span class="n num">' + n + '</span></label>';
  }
  function facetHTML(key, legend, opts) {
    return '<fieldset class="facet" data-facet="' + key + '"><legend>' + esc(legend) + '</legend>' + opts.map(function (o) { return optHTML(key, o); }).join('') + '</fieldset>';
  }
  function renderRail() {
    var box = $('facets'), a = D.activeElement, focusKey = a && a.name && box.contains(a) ? a.name + '=' + a.value : '';
    var html = facetHTML('domain', t('f_domain'), facetOptions('domain'));
    if (state.domain.length) {                               /* sections of the selected domains, under their domain */
      var multi = state.domain.length > 1;
      html += '<fieldset class="facet facet-sec" data-facet="section"><legend>' + esc(t('f_section')) + '</legend>' +
        cat.domains.filter(function (d) { return has(state.domain, d.id); }).map(function (d) {
          return (multi ? '<p class="facet-sub">' + esc(cat.domainName(d, true)) + '</p>' : '') + d.sections.map(function (s) {
            return optHTML('section', { v: s.id, label: esc(L(s.zh, s.en)) });
          }).join('');
        }).join('') + '</fieldset>';
    }
    html += facetHTML('tier', t('f_tier'), facetOptions('tier'));
    var kinds = facetOptions('kind'), hidden = 0;
    if (!kindsOpen) {
      kinds = kinds.filter(function (o, i) { var keep = i < KIND_TOP || has(state.kind, o.v); if (!keep) hidden++; return keep; });
    }
    html += facetHTML('kind', t('f_kind'), kinds).replace(/<\/fieldset>$/, (hidden || kindsOpen ?
      '<button type="button" class="facet-more" data-act="kinds" aria-expanded="' + kindsOpen + '">' + esc(kindsOpen ? t('fewer_kinds') : t('more_kinds', hidden)) + '</button>' : '') + '</fieldset>');
    html += facetHTML('reach', t('f_agent'), facetOptions('reach'));
    html += facetHTML('access', t('f_access'), facetOptions('access'));
    html += facetHTML('rlang', t('f_lang'), facetOptions('rlang').filter(function (o) { return known.rlang[o.v]; }));
    html += facetHTML('region', t('f_region'), facetOptions('region').filter(function (o) { return known.region[o.v]; }));
    html += facetHTML('status', t('f_status'), facetOptions('status').filter(function (o) { return known.status[o.v]; }));
    box.innerHTML = html;
    if (focusKey) {
      var k = focusKey.split('='), el = box.querySelector('input[name="' + k[0] + '"][value="' + k.slice(1).join('=') + '"]');
      if (el) el.focus();
    }
    var n = activeCount();
    $('rail-on').textContent = n ? t('filters_on', n) : '';
    $('rail-done').textContent = t('show_n', results.length);
  }

  /* ============================== results ============================== */
  function renderHead() {
    $('count').innerHTML = esc(t('results', results.length)).replace(/(\d+)/, '<b class="num">$1</b>');
    $('res-ctl').hidden = false;
    $('sort').value = state.sort;
    D.querySelectorAll('.seg [data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view)); });
    var chips = [];
    function chip(label, text, act, lang) {
      chips.push('<span class="chip"><b>' + esc(label) + '</b> <span' + (lang || '') + '>' + text + '</span><button type="button" data-act="' + esc(act) + '" aria-label="' +
        esc((DSL.lang === 'zh' ? '去掉 ' : 'Remove ') + text.replace(/<[^>]+>/g, '')) + '"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8"/></svg></button></span>');
    }
    var label = { domain: 'f_domain', section: 'f_section', tier: 'f_tier', kind: 'f_kind', reach: 'f_agent', access: 'f_access', rlang: 'f_lang', region: 'f_region', status: 'f_status' };
    FKEYS.forEach(function (k) {
      state[k].forEach(function (v) { chip(t(label[k]), chipText(k, v), 'rm:' + k + ':' + v); });
    });
    $('q-clear').hidden = !$('q').value;
    var box = $('chips');
    box.hidden = !chips.length;
    box.innerHTML = chips.join('') + (chips.length > 1 ? '<button type="button" class="chip-clear" data-act="clear">' + esc(t('clear_all')) + '</button>' : '');
  }
  function chipText(k, v) {
    switch (k) {
      case 'domain': return esc(cat.domainName(v, true));
      case 'section': var d = state.domain.map(function (x) { return cat.dom[x]; }).filter(function (x) { return x.secById[v]; })[0], s = d && d.secById[v]; return esc(s ? L(s.zh, s.en) : v);
      case 'tier': return esc(DSL.pair(DSL.TIER[v]));
      case 'kind': return esc(cat.kindName(v));
      case 'reach': return esc(DSL.pair(DSL.AGENT[v]));
      case 'access': return esc(DSL.pair(DSL.ACCESS[v]));
      case 'rlang': return esc(DSL.pair(DSL.RLANG[v]));
      case 'region': return esc(DSL.pair(REGION[v]));
      case 'status': return esc(DSL.pair(DSL.STATUS[v]));
    }
    return esc(v);
  }
  function view() { return state.view === 'table' && mqNarrow.matches ? 'list' : state.view; }   /* the register never squeezes into a phone */
  function renderResults() {
    var out = $('out'), items = results.slice(0, shown), v = view();
    if (!results.length) { out.innerHTML = emptyHTML(); $('more').hidden = true; return; }
    if (v === 'grid') out.innerHTML = '<ol class="plates">' + items.map(plateHTML).join('') + '</ol>';
    else if (v === 'table') {
      out.innerHTML = '<div class="tbl-wrap" tabindex="0" role="region" aria-label="' + esc(t('reg_label')) + '"><table class="tbl reg"><thead><tr><th scope="col">' + esc(t('name_col')) + '</th><th scope="col">' + esc(t('desc_col')) +
        '</th><th scope="col">' + esc(t('path_col')) + '</th><th scope="col">' + esc(t('f_kind')) + '</th><th scope="col">' + esc(t('f_tier')) + '</th><th scope="col">' + esc(t('f_access')) +
        '</th><th scope="col">' + esc(t('f_agent')) + '</th></tr></thead><tbody>' + items.map(rowHTML).join('') + '</tbody></table></div>';
    } else out.innerHTML = '<ol class="entries">' + items.map(entryHTML).join('') + '</ol>';
    reveal(out);
    var left = results.length - items.length, more = $('more');
    more.hidden = left <= 0;
    if (left > 0) more.textContent = t('more', Math.min(PAGE, left), left);
  }
  function emptyHTML() {
    var q = state.q.trim(), n = activeCount(), html = '<div class="empty"><p class="empty-h">' + (q ? esc(t('empty_h', '\u0000')).replace('\u0000', '<del class="pm">' + esc(q) + '</del>') : esc(t('empty_h', ''))) + '</p>';
    if (n) {
      var saved = {};
      FKEYS.forEach(function (k) { saved[k] = state[k]; state[k] = []; });
      var res = qCache.res.score, all = 0;
      rows.forEach(function (row, i) { if ((!res || res[i]) && row.r.status !== 'sunset') all++; });
      FKEYS.forEach(function (k) { state[k] = saved[k]; });
      if (all) html += '<p>' + esc(t('empty_f', all)) + ' <button type="button" class="lnk" data-act="clear-f">' + esc(t('empty_drop')) + '</button></p>';
    }
    html += '<p class="empty-try"><span>' + esc(t('empty_try')) + '</span>' + TRY.map(function (w) {
      return '<a class="lnk" href="' + esc(DSL.href('./', { q: w })) + '" data-q="' + esc(w) + '"' + (IS_CJK.test(w) ? ZH : EN) + '>' + esc(w) + '</a>';
    }).join('') + '</p></div>';
    return html;
  }

  /* ============================== the proof note (detail) ============================== */
  function field(k, v, lang) { return v ? '<dt>' + esc(k) + '</dt><dd' + (lang || '') + '>' + v + '</dd>' : ''; }
  function noteHTML(r) {
    var i = indexOf(r.id), how = howOf(r), rn = t('reach_note'), a = r.agent_access || 'unknown';
    var icon = { prev: 'M4 11l5-5 5 5', next: 'M4 7l5 5 5-5', close: 'M4 4l10 10M14 4L4 14' };
    var nav = [['prev', 'k', i <= 0], ['next', 'j', i < 0 || i >= results.length - 1], ['close', 'Esc', false]].map(function (b) {
      return '<button type="button" class="btn-quiet" data-act="' + b[0] + '" aria-label="' + esc(t(b[0])) + '"' + (b[2] ? ' disabled' : '') + '><kbd aria-hidden="true">' + b[1] + '</kbd>' +
        '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="' + icon[b[0]] + '" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><span class="lbl" aria-hidden="true">' + esc(t(b[0])) + '</span></button>';
    }).join('');
    var dl = '';
    var howHTML = '<p' + how[1] + '>' + esc(how[0]) + '</p>' + (how[1] === '' && DSL.lang === 'zh' ? '<p class="dd-2" lang="en">' + esc(r.how_to_use) + '</p>' : '');
    dl += field(t('how'), howHTML);
    if (r.entry_points && r.entry_points.length) {
      dl += field(t('entry_points'), '<ul>' + r.entry_points.map(function (e) {
        return '<li><a href="' + esc(e.url) + '" target="_blank" rel="noopener"' + EN + '>' + esc(e.label || e.url) + '</a></li>';
      }).join('') + '</ul>');
    }
    if (r.api && r.api.url) {
      dl += field(t('api'), '<code class="dd-code">' + esc(r.api.url) + '</code>' + (r.api.sample ? ' <a href="' + esc(r.api.sample) + '" target="_blank" rel="noopener">' + esc(t('api_sample')) + '</a>' : ''));
    }
    dl += field(t('licence'), r.license ? esc(r.license) : esc(t('no_licence')), r.license ? EN : '');
    dl += field(t('cost_login'), esc(DSL.pair(DSL.ACCESS[r.access])) + L('，', ', ') + esc(r.login ? t('login_yes') : t('login_no')));
    dl += field(t('agent'), DSL.agentTag(a) + ' <span class="dd-2">' + esc(rn[a] || '') + '</span>');
    dl += field(t('f_status'), esc(DSL.pair(DSL.STATUS[r.status])));
    dl += field(t('lang_region'), esc(DSL.pair(DSL.RLANG[r.lang])) + L('，', ', ') + esc(DSL.pair(REGION[r.region])));
    if (r.caveats && r.caveats.length) dl += field(t('caveats'), '<ul>' + r.caveats.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>', EN);
    if (r.tags && r.tags.length) {
      dl += field(t('tags'), '<span class="tags">' + r.tags.map(function (g) {
        return '<a href="' + esc(DSL.href('./', { q: g })) + '" data-q="' + esc(g) + '"' + EN + '>' + esc(g) + '</a>';
      }).join('') + '</span>');
    }
    if (r.also && r.also.length) {
      dl += field(t('also'), '<ul>' + r.also.map(function (x) {
        var p = x.split(':'), d = cat.dom[p[0]], s = d && d.secById[p[1]];
        if (!d) return '';
        return '<li><a href="' + esc(DSL.href('./', { domain: p[0], section: p[1] })) + '" data-sec="' + esc(x) + '">' + esc(cat.domainName(d, true)) + ' › ' + esc(s ? L(s.zh, s.en) : p[1]) + '</a></li>';
      }).join('') + '</ul>');
    }
    var th = cat.thumb(r);
    dl += field(t('imaged'), esc(th ? t('th_' + th.source) || th.source : t('th_none')));
    /* siblings: the rest of this section, tier first */
    var sib = rows.filter(function (x) { return x.r.domain === r.domain && x.r.section === r.section && x.r.id !== r.id && x.r.status !== 'sunset'; })
      .sort(function (a, b) { return TIER_N[a.r.tier] - TIER_N[b.r.tier] || a.i - b.i; });
    var sibHTML = sib.length ? '<div class="sib"><h3 class="log-h">' + esc(t('siblings')) + ' <span class="muted">' + esc(cat.sectionName(r)) + '</span></h3><ul>' +
      sib.slice(0, 8).map(function (x) {
        return '<li><a href="' + esc(entryLink(x.r.id)) + '" data-open="' + esc(x.r.id) + '"' + nameLang(x.r.name) + '>' + esc(x.r.name) + '</a>' + DSL.tierSort(x.r.tier) + '</li>';
      }).join('') + '</ul><a class="lnk sib-all" href="' + esc(DSL.href('./', { domain: r.domain, section: r.section })) + '" data-sec="' + esc(r.domain + ':' + r.section) + '">' + esc(t('section_all', sib.length + 1)) + '</a></div>' : '';
    /* dated provenance, only from dates the data carries (added, checked_at, thumb.captured_at); no date, no line */
    var log = [];
    if (r.thumb && r.thumb.captured_at) log.push([r.thumb.captured_at, t('log_shot'), esc(t('th_' + r.thumb.source) || r.thumb.source)]);
    if (r.checked_at) log.push([r.checked_at, t('log_reach'), DSL.agentTag(a)]);
    if (r.added) log.push([r.added, t('log_added'), esc(DSL.pair(DSL.TIER[r.tier]))]);
    log.sort(function (x, y) { return x[0] < y[0] ? 1 : x[0] > y[0] ? -1 : 0; });
    var logHTML = log.length ? '<div><h3 class="log-h">' + esc(t('log_h')) + '</h3><ol class="log">' + log.map(function (l) {
      var d = String(l[0]).slice(0, 10);
      return '<li><time datetime="' + esc(d) + '">' + esc(d) + '</time><span class="k">' + esc(l[1]) + '</span><span class="v">' + l[2] + '</span></li>';
    }).join('') + '</ol></div>' : '';
    var nz = r.name_zh && r.name.indexOf(r.name_zh) < 0 ? '<p class="note-namezh"' + nameLang(r.name_zh) + '>' + esc(r.name_zh) + '</p>' : '';
    return '<div class="note-bar"><p class="note-pos">' + (i >= 0 ? t('pos', i + 1, results.length) : esc(t('not_in'))) + '</p><div class="note-nav">' + nav + '</div></div>' +
      '<div class="note-body">' + (cat.thumb(r) ? media(r, 'note-media', true) : '') +
      '<div><h2 class="note-name" id="note-h" tabindex="-1"><span' + nameLang(r.name) + '>' + esc(r.name) + '</span>' + DSL.tierSort(r.tier) + '</h2>' + nz + '</div>' +
      '<p class="note-path">' + path(r) + '<span>' + esc(cat.kindName(r.kind)) + '</span><a href="' + esc(r.url) + '" target="_blank" rel="noopener" lang="en">' + esc(r.host) + '</a></p>' +
      '<p class="note-zh"' + ZH + '>' + esc(r.zh) + '</p><p class="note-en"' + EN + '>' + esc(r.best_for) + '</p>' +
      '<div class="note-act"><a class="btn" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(t('open')) + ' <kbd aria-hidden="true">o</kbd></a>' +
      '<button type="button" class="btn-quiet" data-act="copy-link">' + esc(t('copy_link')) + '</button></div>' +
      '<dl class="note-fields">' + dl + '</dl>' + logHTML + sibHTML + '</div>';
  }
  function emptyNoteHTML() {
    return '<div class="note-empty"><h2 id="note-h">' + esc(t('note_t')) + '</h2><p>' + esc(t('note_empty')) + '</p>' +
      '<ul class="keys" aria-label="' + esc(DSL.lang === 'zh' ? '键盘' : 'Keyboard') + '">' + t('keys').map(function (k) {
        return '<li>' + k[0].split(' ').map(function (c) { return '<kbd>' + esc(c) + '</kbd>'; }).join('') + esc(k[1]) + '</li>';
      }).join('') + '</ul></div>';
  }
  function renderNote() {
    var note = $('note'), r = state.id && byId[state.id];
    note.innerHTML = r ? noteHTML(r.r) : emptyNoteHTML();
    reveal(note);
    $('bench').classList.toggle('no-sel', !r);           /* ≥ 1200: the empty pane shrinks to a key strip */
    D.title = r ? t('title_note', r.r.name) : t('title_page');
  }
  function overlay() { return !mqPane.matches || view() === 'table'; }
  /* the note is a pane in the grid, or a drawer (right, ≥ 721) / sheet (≤ 720, site.css) over a scrim; CSS places it
     by width, .v-table on the bench asks for the drawer in the register view */
  function syncMode() {
    var o = overlay();
    $('bench').classList.toggle('v-table', view() === 'table');
    if (!o && isOpen()) {                                  /* grew into the pane layout: the sheet becomes the pane */
      var note = $('note');
      note.removeAttribute('data-open'); $('scrim').removeAttribute('data-open');
      note.removeAttribute('role'); note.removeAttribute('aria-modal');
      setInert(false);
    } else if (o && state.id && !isOpen()) { state.id = ''; renderNote(); markCurrent(); writeURL(); }
  }
  function isOpen() { return $('note').hasAttribute('data-open'); }
  /* while an overlay is open (the note as a sheet or drawer, or the filter drawer) everything else is inert */
  function setInert(on, keep) {
    ['.hd', '.wb-band', '#rail', '#results', '#note', '.ft', '.skip'].forEach(function (s) {
      var el = D.querySelector(s);
      if (!el || s === (keep || '#note')) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    D.documentElement.classList.toggle('sheet-open', on);
  }
  function openNote(id, focusInside) {
    if (!byId[id]) return;
    state.id = id; cur = id;
    renderNote(); markCurrent(); writeURL();
    var note = $('note');
    if (overlay()) {
      var was = isOpen();
      note.setAttribute('data-open', ''); $('scrim').setAttribute('data-open', '');
      note.setAttribute('role', 'dialog'); note.setAttribute('aria-modal', 'true');
      setInert(true);
      if (!was || focusInside) { var h = $('note-h'); if (h) h.focus({ preventScroll: true }); }
    } else if (focusInside) { var hh = $('note-h'); if (hh) hh.focus({ preventScroll: true }); }
  }
  function closeNote() {
    var id = state.id;
    state.id = '';
    var note = $('note');
    note.removeAttribute('data-open'); $('scrim').removeAttribute('data-open');
    note.removeAttribute('role'); note.removeAttribute('aria-modal');
    setInert(false);
    renderNote(); markCurrent(); writeURL();
    focusRow(id);
  }
  function markCurrent() {
    var id = state.id || cur;
    D.querySelectorAll('#out [data-id]').forEach(function (el) {
      if (el.getAttribute('data-id') === id) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
    });
  }
  function focusRow(id) {
    var a = id && D.querySelector('#out [data-id="' + cssEsc(id) + '"] a[data-open]');
    if (a) { a.focus({ preventScroll: true }); a.closest('[data-id]').scrollIntoView({ block: 'nearest' }); }
  }
  function cssEsc(s) { return W.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }
  /* j / k: move the cursor; the pane follows on wide screens and inside an open sheet */
  function move(d) {
    if (!results.length) return;
    var i = indexOf(state.id || cur);
    i = i < 0 ? 0 : Math.max(0, Math.min(results.length - 1, i + d));
    if (i >= shown) { shown = Math.ceil((i + 1) / PAGE) * PAGE; renderResults(); }
    var id = results[i].row.r.id;
    if (!overlay() || isOpen()) openNote(id, false);
    else { cur = id; markCurrent(); }
    if (overlay() && isOpen()) return;                     /* focus stays in the sheet */
    focusRow(id);
  }

  /* ============================== render + events ============================== */
  var liveT, first = true;
  function render(keepShown) {
    if (!keepShown) shown = PAGE;
    compute();
    renderRail();
    renderHead();
    renderResults();
    if (state.id) {
      var i = indexOf(state.id);
      if (i >= shown) { shown = Math.ceil((i + 1) / PAGE) * PAGE; renderResults(); }
      renderNote();
    }
    writeURL();
    clearTimeout(liveT);
    if (!first) liveT = setTimeout(function () { $('live').textContent = t('results', results.length); }, 600);
    first = false;
  }
  function setQuery(v) { state.q = v; $('q').value = v; render(); }

  function bind() {
    var q = $('q'), timer, composing = false;
    q.value = state.q;
    function commit() { clearTimeout(timer); if (q.value !== state.q) { state.q = q.value; render(); } }
    q.addEventListener('compositionstart', function () { composing = true; });
    q.addEventListener('compositionend', function () { composing = false; clearTimeout(timer); timer = setTimeout(commit, 120); });
    q.addEventListener('input', function (e) { $('q-clear').hidden = !q.value; if (composing || e.isComposing) return; clearTimeout(timer); timer = setTimeout(commit, 120); });
    $('q-clear').addEventListener('click', function () { setQuery(''); q.focus(); });
    /* Enter or ↓ in the field: run the query now and land on the first result */
    function toFirst() { commit(); toTop(); }
    q.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' && results.length) { e.preventDefault(); toFirst(); } });
    $('qform').addEventListener('submit', function (e) { e.preventDefault(); toFirst(); });

    $('facets').addEventListener('change', function (e) {
      var el = e.target;
      if (!el.name || !state[el.name]) return;
      var list = state[el.name].filter(function (v) { return v !== el.value; });
      if (el.checked) list.push(el.value);
      state[el.name] = list;
      if (el.name === 'domain') pruneSections();
      render();
    });
    $('facets').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act="kinds"]');
      if (b) { kindsOpen = !kindsOpen; renderRail(); var nb = D.querySelector('[data-act="kinds"]'); if (nb) nb.focus(); }
    });
    $('sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    D.querySelector('.seg').addEventListener('click', function (e) {
      var b = e.target.closest('[data-view]');
      if (!b) return;
      if (isOpen()) closeNote();
      state.view = b.getAttribute('data-view');
      syncMode(); renderHead(); renderResults(); writeURL();
    });
    $('more').addEventListener('click', function () {
      var from = shown;
      shown += PAGE; renderResults();
      var el = D.querySelectorAll('#out [data-id] a[data-open]')[from];   /* keyboard users land on the first new row */
      if (el) el.focus({ preventScroll: true });
    });

    /* one delegate for rows, chips, the note and links that change the query or the filters */
    D.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var el = e.target.closest('[data-open],[data-act],[data-q],[data-sec]');
      if (!el || el.closest('#facets') || el.closest('.hd')) return;
      if (el.hasAttribute('data-open')) { e.preventDefault(); openNote(el.getAttribute('data-open'), overlay()); return; }
      if (el.hasAttribute('data-q')) { e.preventDefault(); FKEYS.forEach(function (k) { state[k] = []; }); if (overlay() && isOpen()) closeNote(); setQuery(el.getAttribute('data-q')); return; }
      if (el.hasAttribute('data-sec')) {
        e.preventDefault();
        var p = el.getAttribute('data-sec').split(':');
        FKEYS.forEach(function (k) { state[k] = []; });
        state.domain = [p[0]]; state.section = [p[1]];
        if (overlay() && isOpen()) closeNote();
        setQuery('');
        return;
      }
      var act = el.getAttribute('data-act');
      if (act === 'prev') move(-1);
      else if (act === 'next') move(1);
      else if (act === 'close') closeNote();
      else if (act === 'copy-link') {
        var u = new URL(location.href);
        u.search = ''; u.searchParams.set('id', state.id);
        DSL.copy(u.toString()).then(function () { el.textContent = t('link_copied'); }, function () { el.textContent = t('copy_fail'); })
          .then(function () { setTimeout(function () { el.textContent = t('copy_link'); }, 1600); });
      } else if (act === 'clear') { FKEYS.forEach(function (k) { state[k] = []; }); setQuery(''); }
      else if (act === 'clear-f') { FKEYS.forEach(function (k) { state[k] = []; }); render(); }
      else if (act && act.indexOf('rm:') === 0) {
        var bits = act.split(':');
        if (bits[1] === 'q') setQuery('');
        else {
          state[bits[1]] = state[bits[1]].filter(function (v) { return v !== bits.slice(2).join(':'); });
          if (bits[1] === 'domain') pruneSections();
          render();
        }
        var next = D.querySelector('#chips button') || $('q');
        next.focus();
      }
    });
    $('scrim').addEventListener('click', function () { if (railOpen && !mqRail.matches) toggleRail(false); else closeNote(); });

    /* keys: j k Enter o Esc ("/" lives in site.js) */
    D.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      var a = D.activeElement, tag = a && a.tagName;
      var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (a && a.isContentEditable);
      if (e.key === 'Escape') {
        if (typing && a.id === 'q') return;               /* the search field clears itself */
        if (state.id) { e.preventDefault(); closeNote(); }
        else if (railOpen && !mqRail.matches) { e.preventDefault(); toggleRail(false); }
        return;
      }
      if (typing) return;
      if (e.key === 'j' || e.key === 'k') { e.preventDefault(); move(e.key === 'j' ? 1 : -1); }
      else if (e.key === 'o') {
        var id = state.id || cur;
        if (id && byId[id]) { e.preventDefault(); W.open(byId[id].r.url, '_blank', 'noopener'); }
      } else if (e.key === 'Enter' && (!a || a === D.body || a === $('results'))) {
        var c = state.id || cur;
        if (c) { e.preventDefault(); openNote(c, true); }
      }
    });

    /* the rail on narrow screens: a drawer over the page */
    $('rail-toggle').addEventListener('click', function () { toggleRail(!railOpen); });
    $('rail-x').addEventListener('click', function () { toggleRail(false); });
    $('rail-done').addEventListener('click', function () { toggleRail(false, true); $('results').focus({ preventScroll: true }); $('results').scrollIntoView({ block: 'start' }); });

    function onMedia() {
      syncMode();
      if (mqRail.matches && railOpen) toggleRail(false, true);
      renderResults();
      stick();
    }
    W.addEventListener('resize', stick);
    [mqPane, mqRail, mqNarrow].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', onMedia); else m.addListener(onMedia); });
  }
  /* the top hit: its note opens (pane, or the drawer with focus inside); on a phone the cursor lands on the first row
     instead, so the sheet never covers a list the reader has not seen yet */
  function toTop() {
    if (!results.length) return;
    cur = '';
    if (overlay() && !mqNarrow.matches) openNote(results[0].row.r.id, true);
    else { if (!overlay()) state.id = ''; move(0); }
  }
  function toggleRail(on, quiet) {
    railOpen = on;
    var rail = $('rail'), drawer = on && !mqRail.matches;
    rail.classList.toggle('open', on);
    $('rail-toggle').setAttribute('aria-expanded', String(on));
    if (drawer) { rail.setAttribute('role', 'dialog'); rail.setAttribute('aria-modal', 'true'); $('scrim').setAttribute('data-open', ''); }
    else { rail.removeAttribute('role'); rail.removeAttribute('aria-modal'); if (!isOpen()) $('scrim').removeAttribute('data-open'); }
    setInert(drawer, '#rail');
    if (drawer) { var f = rail.querySelector('input:not([disabled]), button'); if (f) f.focus(); }
    else if (!quiet) $('rail-toggle').focus();
  }
  /* ≤ 720 the header sticks with only its search row showing: its top is pulled up by the rows above the field */
  function stick() {
    var hd = D.querySelector('.hd'), f = $('qform');
    if (hd && f) hd.style.setProperty('--hd-stick', -Math.max(0, f.offsetTop - 8) + 'px');
  }

  /* ============================== start ============================== */
  function ready() {
    cat = DSL.cat();
    if (!cat) {
      $('count').innerHTML = '<span class="wb-err">' + t('error') + '</span>';
      $('bench').classList.add('failed');
      return;
    }
    var dPos = {};
    cat.domains.forEach(function (d, i) { dPos[d.id] = i; d.secPos = {}; d.sections.forEach(function (s, j) { d.secPos[s.id] = j; }); });
    FKEYS.forEach(function (k) { known[k] = {}; });
    rows = cat.resources.map(function (r, i) {
      var d = cat.dom[r.domain], s = d && d.secById[r.section], k = cat.kind[r.kind];
      var zh = norm(r.zh), cut = zh.search(/[，；：,;:]/), zhHead = cut < 0 ? zh : zh.slice(0, cut);   /* the first clause says what it is */
      FKEYS.forEach(function (key) { var v = val(key, r); known[key][v] = (known[key][v] || 0) + 1; });
      var row = {
        r: r, i: i, d: d ? dPos[r.domain] : 99, sx: d && d.secPos[r.section] != null ? d.secPos[r.section] : 99,
        f: [
          [norm(r.name), 10], [norm(r.name_zh), 8], [norm((r.tags || []).join(' ')), 8],
          [zhHead, 6], [norm(r.zh).slice(zhHead.length), 4], [norm(r.best_for), 5], [norm((r.how_to_use || '') + ' ' + (r.zh_how || '')), 3],
          [norm([d && d.zh, d && d.en, s && s.zh, s && s.en, k && k.zh, k && k.en].join(' ')), 3], [norm(r.host), 2]
        ],
        dn: norm(d ? d.zh + ' ' + d.en : '')
      };
      byId[r.id] = row;
      return row;
    });
    known.status.sunset = known.status.sunset || 0;
    eng = engine(rows);
    DSL.catalogSearch = function (q) {                     /* for the golden checks: ranked ids, default filters, best match */
      var res = eng.run(q), s = res.score, out = [];
      rows.forEach(function (row, i) { if ((!s || s[i]) && row.r.status !== 'sunset') out.push({ row: row, s: s ? s[i] : 0 }); });
      return ranked(out, 'best').map(function (x) { return x.row.r.id; });
    };
    readURL();
    bind();
    stick();
    $('bench').classList.toggle('v-table', view() === 'table');
    render();
    renderNote();
    if (openTop) { toTop(); writeURL(); }
    if (state.id) {
      var id = state.id;
      state.id = '';
      openNote(id, false);
      var el = D.querySelector('#out [data-id="' + cssEsc(id) + '"]');
      if (el && !overlay()) el.scrollIntoView({ block: 'nearest' });
    }
    DSL.stamp();
  }
  if (W.CATALOG_V2) ready(); else D.addEventListener('DOMContentLoaded', ready);
})(window, document);
