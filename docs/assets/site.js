/* Design Skill Lab: the shared site module. No framework, no build.
   Loaded at the end of <body> on every page, after the page's data scripts and before the page's own script.

   Page contract
   - <html lang> and data-theme are set before first paint by the inline head snippet (every page copies it).
   - Text that changes with the language carries data-i18n="key" (textContent), data-i18n-html (trusted table HTML),
     data-i18n-placeholder / data-i18n-aria / data-i18n-title / data-i18n-alt. Static HTML holds the zh text, so no-JS readers get zh.
   - <body data-root="./" | "../"> gives the path to docs/ from this page (for data, assets and internal links).
   - Page strings: DSL.strings({ zh: {...}, en: {...} }) before DSL.apply(), or pass them to DSL.init().
   Public: DSL.lang, t, L, strings, apply, esc, href, copy, setLang, cat (catalogue helpers), labels (AGENT, ACCESS, ...). */
(function (W, D) {
  'use strict';
  var root = D.documentElement;
  var LANG = /^en/i.test(root.lang) ? 'en' : 'zh';
  var ROOT = (D.body && D.body.getAttribute('data-root')) || './';

  /* ---------------- UI strings: one table, zh first ---------------- */
  var STR = {
    zh: {
      skip: '跳到正文', home: '首页',
      search_label: '搜索资源', search_ph: '搜索资源：配色、动效曲线、font…', search_go: '搜索',
      nav_label: '站点', nav_home: '首页', nav_catalog: '资源目录', nav_skills: 'Skill 套件', nav_lab: '设计方向实验室',
      lang_btn: 'EN', lang_aria: 'Switch to English',
      theme_dark: '暗色', theme_light: '亮色', theme_aria_dark: '切换到暗色', theme_aria_light: '切换到亮色',
      copy: '复制', copied: '已复制', copy_fail: '复制失败，请手动选择',
      foot_generated: function (d) { return '目录数据生成于 ' + d; }, foot_licence: 'MIT 许可', foot_nav: '数据与源码',
      /* catalogue vocabulary, shared by home, catalogue and skills pages */
      results: function (n) { return '共 ' + n + ' 条'; }, selected: '已选', clear_all: '清除全部',
      v_list: '列表', v_grid: '图版', v_table: '登记',
      f_domain: '域', f_section: '小节', f_kind: '类型', f_tier: '分级', f_access: '费用', f_agent: 'agent 可读',
      f_lang: '语言', f_status: '状态',
      how: '怎么直达', licence: '授权', cost_login: '费用与登录', agent: 'agent 可读', caveats: '注意', entry_points: '入口',
      tags: '标签', section: '所在小节', host: '网址',
      no_licence: '未标注，使用前到原站确认', login_yes: '需要登录', login_no: '无需登录',
      prev: '上一条', next: '下一条', close: '收起', open: '打开网站', copy_link: '复制链接',
      pos: function (i, n) { return '第 <b>' + i + '</b> / ' + n + ' 条'; },
      note_t: '校样批注', note_empty: '在左栏选一条，它的全部字段会在这里展开：怎么直达、授权、费用、agent 能否读到。',
      keys: [['/', '搜索'], ['j k', '上下移动'], ['Enter', '展开批注'], ['o', '打开网站'], ['Esc', '收起']],
      log_h: '核验记录', log_shot: '成像', log_reach: '可达核验', log_grade: '鉴定', log_added: '入藏',
      no_thumb: '暂无核验过的截图'
    },
    en: {
      skip: 'Skip to content', home: 'Home',
      search_label: 'Search resources', search_ph: 'Search: palette, easing, font…', search_go: 'Search',
      nav_label: 'Site', nav_home: 'Home', nav_catalog: 'Catalogue', nav_skills: 'Skills', nav_lab: 'Directions lab',
      lang_btn: '中文', lang_aria: '切换到中文',
      theme_dark: 'Dark', theme_light: 'Light', theme_aria_dark: 'Switch to dark theme', theme_aria_light: 'Switch to light theme',
      copy: 'Copy', copied: 'Copied', copy_fail: 'Copy failed; select the text instead',
      foot_generated: function (d) { return 'Catalogue data generated ' + d; }, foot_licence: 'MIT licence', foot_nav: 'Data and source',
      results: function (n) { return n + (n === 1 ? ' entry' : ' entries'); }, selected: 'Selected', clear_all: 'Clear all',
      v_list: 'List', v_grid: 'Plates', v_table: 'Register',
      f_domain: 'Domain', f_section: 'Section', f_kind: 'Kind', f_tier: 'Tier', f_access: 'Cost', f_agent: 'Agent access',
      f_lang: 'Language', f_status: 'Status',
      how: 'How to get there', licence: 'Licence', cost_login: 'Cost and login', agent: 'Agent access', caveats: 'Caveats',
      entry_points: 'Entry points', tags: 'Tags', section: 'Section', host: 'Address',
      no_licence: 'Not stated; check the site before use', login_yes: 'Login required', login_no: 'No login',
      prev: 'Previous', next: 'Next', close: 'Close', open: 'Open site', copy_link: 'Copy link',
      pos: function (i, n) { return '<b>' + i + '</b> of ' + n; },
      note_t: 'Proof note', note_empty: 'Pick an entry on the left. Every field opens here: how to get there, licence, cost, and whether an agent can read it.',
      keys: [['/', 'search'], ['j k', 'move'], ['Enter', 'open note'], ['o', 'open site'], ['Esc', 'close']],
      log_h: 'Checks', log_shot: 'Imaged', log_reach: 'Reach check', log_grade: 'Graded', log_added: 'Accessioned',
      no_thumb: 'No checked screenshot yet'
    }
  };

  /* value labels [zh, en]; agent access carries a glyph so status never depends on colour */
  var AGENT = {
    static: ['静态可读', 'Readable (static)', '●'], js: ['需执行 JS', 'Needs JS', '◐'],
    blocked: ['被拦截', 'Blocked', '×'], unknown: ['未检测', 'Unchecked', '○']
  };
  var ACCESS = { free: ['免费', 'Free'], freemium: ['部分免费', 'Freemium'], paid: ['付费', 'Paid'] };
  var STATUS = { active: ['活跃', 'Active'], slow: ['更新放缓', 'Slowing'], archived: ['已归档', 'Archived'], sunset: ['已停运', 'Shut down'] };
  var TIER = { S: ['S 级', 'Tier S'], A: ['A 级', 'Tier A'], B: ['B 级', 'Tier B'] };
  var RLANG = { en: ['英文', 'English'], zh: ['中文', 'Chinese'], ja: ['日文', 'Japanese'], ko: ['韩文', 'Korean'], multi: ['多语言', 'Multilingual'] };

  function t(key) {
    var v = STR[LANG][key];
    if (v === undefined) v = STR.zh[key];
    if (typeof v === 'function') return v.apply(null, Array.prototype.slice.call(arguments, 1));
    return v === undefined ? key : v;
  }
  function L(zh, en) { return LANG === 'en' ? (en || zh || '') : (zh || en || ''); }
  function pair(p) { return p ? L(p[0], p[1]) : ''; }
  function strings(tbl) {
    ['zh', 'en'].forEach(function (l) { var s = tbl && tbl[l]; if (s) Object.keys(s).forEach(function (k) { STR[l][k] = s[k]; }); });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  /* ---------------- language ---------------- */
  function navLang() {
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || 'zh';
    return /^zh\b/i.test(n) ? 'zh' : 'en';
  }
  /* internal links carry ?lang= when this page's language would not be re-derived on the next page */
  var carry = /[?&]lang=(zh|en)\b/.test(location.search) || LANG !== navLang();
  function href(path, params) {
    var q = new URLSearchParams(params || {});
    if (carry) q.set('lang', LANG);
    var s = q.toString();
    return path + (s ? (path.indexOf('?') < 0 ? '?' : '&') + s : '');
  }
  function setLang(l) {
    try { localStorage.setItem('dsl-lang', l); } catch (e) { /* storage blocked: the URL carries it */ }
    var u = new URL(location.href);
    u.searchParams.set('lang', l);
    location.href = u.toString();
  }

  /* apply the table to [data-i18n*] inside scope */
  function apply(scope) {
    var s = scope || D;
    s.querySelectorAll('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (typeof v === 'string') el.textContent = v; });
    s.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-html')); if (typeof v === 'string') el.innerHTML = v; });
    s.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    s.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    s.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.title = t(el.getAttribute('data-i18n-title')); });
    s.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.alt = t(el.getAttribute('data-i18n-alt')); });
    if (LANG === 'en') {
      /* translated runs are English now; runs that must stay Chinese carry their own lang="zh-CN" */
      s.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(function (el) { if (!el.hasAttribute('lang')) el.lang = 'en'; });
    }
  }

  /* ---------------- shell: language + theme buttons, links, "/" ---------------- */
  function theme() { return root.getAttribute('data-theme') || (W.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  function paintTheme(btn) {
    var dark = theme() === 'dark';
    btn.textContent = dark ? t('theme_light') : t('theme_dark');
    btn.setAttribute('aria-label', dark ? t('theme_aria_light') : t('theme_aria_dark'));
  }
  function shell() {
    D.querySelectorAll('[data-act="lang"]').forEach(function (b) {
      b.textContent = t('lang_btn');
      b.lang = LANG === 'zh' ? 'en' : 'zh-CN';
      b.setAttribute('aria-label', t('lang_aria'));
      b.addEventListener('click', function () { setLang(LANG === 'zh' ? 'en' : 'zh'); });
    });
    D.querySelectorAll('[data-act="theme"]').forEach(function (b) {
      paintTheme(b);
      b.addEventListener('click', function () {
        var n = theme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', n);
        try { localStorage.setItem('dsl-theme', n); } catch (e) { /* storage blocked: this page only */ }
        D.querySelectorAll('[data-act="theme"]').forEach(paintTheme);
      });
    });
    if (carry) {
      D.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href');
        if (/^(?:[a-z]+:|\/\/|#|mailto:)/i.test(h) || /\.(?:txt|json|md|webp|png|jpg)(?:$|[?#])/i.test(h)) return;
        var hash = '', k = h.indexOf('#');
        if (k >= 0) { hash = h.slice(k); h = h.slice(0, k); }
        if (!/[?&]lang=/.test(h)) a.setAttribute('href', h + (h.indexOf('?') < 0 ? '?' : '&') + 'lang=' + LANG + hash);
      });
      D.querySelectorAll('form[role="search"]').forEach(function (f) {
        if (f.querySelector('input[name="lang"]')) return;
        var i = D.createElement('input'); i.type = 'hidden'; i.name = 'lang'; i.value = LANG; f.appendChild(i);
      });
    }
    /* "/" focuses the header search from anywhere (not while typing) */
    D.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var a = D.activeElement, tag = a && a.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (a && a.isContentEditable)) return;
      var q = D.getElementById('q');
      if (q) { e.preventDefault(); q.focus(); q.select(); }
    });
  }
  /* footer stamp: the data's build date (argument, or CATALOG_V2.generated); the element starts hidden */
  function stamp(date) {
    var g = date || (W.CATALOG_V2 && W.CATALOG_V2.generated);
    if (!g) return;
    D.querySelectorAll('[data-slot="generated"]').forEach(function (el) { el.textContent = t('foot_generated', g); el.hidden = false; });
  }

  /* ---------------- clipboard ---------------- */
  function copy(text) {
    if (navigator.clipboard && W.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) {
      var ta = D.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      D.body.appendChild(ta); ta.select();
      try { D.execCommand('copy') ? ok() : fail(); } catch (e) { fail(e); }
      ta.remove();
    });
  }
  /* <button class="copy" data-copy="#id | text"> next to a <code>; falls back to the previous sibling's text */
  function copyButtons(scope) {
    (scope || D).querySelectorAll('button.copy').forEach(function (b) {
      b.addEventListener('click', function () {
        var src = b.getAttribute('data-copy'), el = src && src.charAt(0) === '#' ? D.querySelector(src) : null;
        var text = el ? el.textContent : (src || (b.previousElementSibling && b.previousElementSibling.textContent) || '');
        var label = t('copy');
        copy(text.trim()).then(function () { b.textContent = t('copied'); }, function () { b.textContent = t('copy_fail'); })
          .then(function () { setTimeout(function () { b.textContent = label; }, 1600); });
      });
    });
  }

  /* ---------------- catalogue helpers (pages that load data/catalog.js) ---------------- */
  var CAT = null;
  function cat() {
    if (CAT) return CAT;
    var C = W.CATALOG_V2;
    if (!C) return null;
    var dom = {}, kind = {};
    C.domains.forEach(function (d) {
      d.short_en = String(d.en).split(/,| and /)[0];   /* "Communities, moodboards and feeds" → "Communities" */
      d.secById = {};
      d.sections.forEach(function (s) { d.secById[s.id] = s; });
      dom[d.id] = d;
    });
    (C.kinds || []).forEach(function (k) { kind[k.id] = k; });
    var thumbs = W.THUMBS || null;
    CAT = {
      data: C, domains: C.domains, resources: C.resources, dom: dom, kind: kind,
      domainName: function (d, short) { d = typeof d === 'string' ? dom[d] : d; return d ? L(d.zh, short ? d.short_en : d.en) : ''; },
      sectionName: function (r) { var d = dom[r.domain], s = d && d.secById[r.section]; return s ? L(s.zh, s.en) : r.section; },
      kindName: function (id) { var k = kind[id]; return k ? L(k.zh, k.en) : id; },
      /* a QA-passed thumbnail, or null (render .card). THUMBS paths are relative to docs/ */
      thumb: function (r) { var th = (thumbs && thumbs[r.id]) || r.thumb; return th && th.src ? { src: ROOT + th.src, source: th.source } : null; }
    };
    return CAT;
  }
  /* agent glyph span: glyph + words, never colour alone */
  function agentTag(a) {
    var v = AGENT[a] || AGENT.unknown;
    return '<span class="ag" data-a="' + esc(AGENT[a] ? a : 'unknown') + '">' + esc(L(v[0], v[1])) + '</span>';
  }
  function tierSort(tier) { return '<span class="sort ' + esc(tier) + '" title="' + esc(pair(TIER[tier])) + '">' + esc(tier) + '</span>'; }

  function init(pageStrings) {
    if (pageStrings) strings(pageStrings);
    apply();
    shell();
    copyButtons();
  }

  W.DSL = {
    lang: LANG, root: ROOT, t: t, L: L, pair: pair, strings: strings, apply: apply, esc: esc, href: href,
    setLang: setLang, copy: copy, copyButtons: copyButtons, init: init, stamp: stamp, cat: cat, agentTag: agentTag, tierSort: tierSort,
    AGENT: AGENT, ACCESS: ACCESS, STATUS: STATUS, TIER: TIER, RLANG: RLANG
  };
})(window, document);
