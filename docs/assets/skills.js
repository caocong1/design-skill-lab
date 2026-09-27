/* Skills page: page strings, the effort filter on the job ticket (工单) and the step list (工序), the proof marks on
   the critique sample, and the eval scoreboard from assets/showcase/showcase.json "runs" (shape in its README).
   The dated artifacts are static HTML. Load order (both defer): assets/site.js → assets/skills.js. No catalogue data.

   Strings: zh is written once, in the static HTML (what no-JS readers get). It is harvested from the DOM before
   DSL.init() so apply() can put it back; en is the table below. Strings only JS renders carry both languages here. */
(function (W, D) {
  'use strict';
  var DSL = W.DSL, esc = DSL.esc, L = DSL.L, t = DSL.t;
  var GH = 'https://github.com/caocong1/design-skill-lab/blob/main/';

  function harvest() {
    var zh = {};
    D.querySelectorAll('[data-i18n]').forEach(function (el) { zh[el.getAttribute('data-i18n')] = el.textContent; });
    D.querySelectorAll('[data-i18n-html]').forEach(function (el) { zh[el.getAttribute('data-i18n-html')] = el.innerHTML; });
    D.querySelectorAll('[data-i18n-aria]').forEach(function (el) { zh[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
    D.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { zh[el.getAttribute('data-i18n-placeholder')] = el.getAttribute('placeholder'); });
    D.querySelectorAll('[data-i18n-alt]').forEach(function (el) { zh[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt'); });
    return zh;
  }

  /* rendered by JS only: both languages */
  var DYN = {
    zh: {
      eff_quick: 'quick：一个组件、图标、小改或单张图。读 → 画 → 渲染 → 底线 → 交付；第 4、5 站只在加 options 时补上。',
      eff_standard: 'standard：一屏、一页、一个流程、inspire、交接。在 quick 之上加：看过参考、一片系统、新会话评审、一轮拔高。',
      arm_none: '不装 skill', arm_suite: function (v) { return '套件 ' + v; },
      ev_round: function (d) { return d + ' 一轮'; },
      ev_wins: function (a, n) { return a + ' 胜 ' + n + ' 个'; }, ev_nowin: function (n) { return n + ' 个没有明确胜者'; },
      ev_report: '完整报告', ev_tA: '各维度平均分（1–5，三位评审，所有 brief 平均）', ev_tB: '逐个 brief：总分和胜者',
      ev_arm: '对照组', ev_brief: 'brief', ev_winner: '胜者', ev_bwins: '胜出', ev_none: '无', ev_empty: '空',
      ev_reason: { cycle: '偏好成环', ties: '平票', 'all-empty': '三组都没交出东西' },
      ev_shots: '首屏并排', ev_notes: '备注', ev_old: function (d) { return d + ' 一轮（较早）'; },
      dim_fit: '契合', dim_hierarchy: '层次', dim_identity: '辨识', dim_craft: '工艺', dim_typography: '排版', dim_platform_a11y: '平台与无障碍', dim_overall: '总分'
    },
    en: {
      eff_quick: 'quick: a component, icon, tweak or single graphic. Read, draw, render, floor, deliver; steps 4 and 5 join only with options.',
      eff_standard: 'standard: a screen, page, flow, inspire or handoff. quick plus references looked at, a system slice, a fresh critique and one elevate pass.',
      arm_none: 'No skill', arm_suite: function (v) { return 'Suite ' + v; },
      ev_round: function (d) { return 'Round of ' + d; },
      ev_wins: function (a, n) { return a + ' won ' + n; }, ev_nowin: function (n) { return n + ' with no clear winner'; },
      ev_report: 'Full report', ev_tA: 'Mean score per dimension (1–5, three judges, averaged over briefs)', ev_tB: 'Per brief: overall score and winner',
      ev_arm: 'Arm', ev_brief: 'Brief', ev_winner: 'Winner', ev_bwins: 'Briefs won', ev_none: 'None', ev_empty: 'empty',
      ev_reason: { cycle: 'preference cycle', ties: 'tied votes', 'all-empty': 'no arm delivered' },
      ev_shots: 'First screens side by side', ev_notes: 'Notes', ev_old: function (d) { return 'Round of ' + d + ' (earlier)'; },
      dim_fit: 'Fit', dim_hierarchy: 'Hierarchy', dim_identity: 'Identity', dim_craft: 'Craft', dim_typography: 'Type', dim_platform_a11y: 'Platform & a11y', dim_overall: 'Overall'
    }
  };

  var EN = {
    h1: 'The agent designs. The implementer builds.',
    lede: 'Three skills for designers and design engineers, split the way a design studio splits the work. design-studio reads the requirements, draws directions, sets the system, draws every state, and renders and looks at its own work. critique-design finds faults, scores and accepts, in a fresh context. implement-design only steps in once a design exists, and builds it in your stack.',
    inst_cc: 'Install in Claude Code', inst_more: 'Codex or manual install, upgrading from 0.7.x',
    b1_k: 'The designer', b1_do: 'Decides, draws, specifies, hands off, reviews. Knowing the stack sharpens a handoff; it is never a precondition.',
    b2_k: 'The handoff: the boundary', b2_do: 'A spec, handoff.json, shots per state, tokens and acceptance criteria. The implementer builds from it without guessing.',
    b3_k: 'The implementer', b3_or: 'or your developers', b3_do: 'Builds in the target stack and proves fidelity with build screenshots; a gap in the design goes back to the designer, never improvised.',
    medium: 'Designs are drawn in HTML/CSS/SVG at the target’s logical size, rendered to PNG and looked at; one medium for web, iOS, Android, HarmonyOS, mini-programs and desktop. When the host has an image model, an optional image lane makes direction comps and photographic assets, recording model, prompt, date and licence; the contract stays HTML.',
    toc_label: 'On this page', toc_map: 'Job ticket', toc_skills: 'The three skills', toc_modes: 'Modes and effort', toc_output: 'Output layout', toc_evals: 'Evals', toc_install: 'Other installs, upgrading',
    map_h: 'Job ticket',
    map_cap: 'The route a job takes through design-studio: the main line is the design loop, thin lines lead to the reference files; step 9 hands over to critique-design (proofreading), step 11 to implement-design (to press).',
    map_t: 'design-studio job ticket',
    map_d: 'The route a job takes through design-studio, clockwise: 1 inspect the host, 2 truth files, 3 research, 4 diverge, 5 converge, 6 system, 7 draw, 8 render and floor checks (proof), 9 fresh critique (proofreading), 10 elevate, 11 deliver or hand off (to press), 12 retro, which returns to the entry. Thin lines lead to the reference files: from step 1 to process, from step 6 to fundamentals, from step 7 to disciplines and platforms. Step 9 hands over to critique-design (evidence, judge, measure, vet, verdict); step 11 hands over to implement-design (inspect host, land tokens, build, verify by looking, acceptance), and acceptance hands back to critique-design. The step list below gives the same, with the files each step reads.',
    eff_l: 'View by effort', eff_deep: 'deep: full, redesign, several surfaces or targets. The whole loop, with directions and critique in isolated subagents.',
    lg_main: 'Main line: design-studio’s loop', lg_cp: 'A step, numbered in order', lg_crit: 'The skill a job is handed to', lg_spur: 'Thin line: reference files',
    lg_proof: 'Proofreading: handed to critique-design', lg_skip: 'Skipped at this effort',
    idx_h: 'Steps', reads: 'Reads', xfer: 'Hand to', catalog_link: 'the catalogue',
    skipped: 'Skipped at this effort', skipped_opt: 'Skipped at this effort; added by options', skipped_q: 'quick runs only the floor and a heuristics self-check',
    s1: 'Inspect the host', s1d: 'Brand, tokens, library, fonts, icons, conventions, targets. An existing system of record is the system.',
    s2: 'Truth files', s2d: 'PRODUCT.md, the brief with the design read, one contract per surface. In a redesign the function map comes before the current screens.',
    s3: 'Research', s3d: 'Harvest, capture, contact sheet, look, deconstruct into moves; resources come from the catalogue.',
    s4: 'Diverge', s4d: 'Name the category’s rut and its opposite, find referents from its own world, roll a seed, one subagent per direction, an options board.',
    s5: 'Converge', s5d: 'The user picks, mixes or rejects; recorded with the seed in decisions.md.',
    s6: 'System', s6d: 'DESIGN.md and tokens; a host system of record is updated in place, never forked.',
    s7: 'Draw', s7d: 'Per surface contract, at logical size, every state that applies.',
    s8: 'Render and floor', s8d: 'Capture, lint, computed contrast, in bounded rounds. Anything not looked at is reported as unverified.',
    s9: 'Fresh critique', s9d: 'critique-design in a subagent that gets the brief, the contract and a screenshot manifest, not the author’s reasoning.',
    s10: 'Elevate', s10d: 'Fix P0 and P1, then intensify the contract’s one memorable idea twice and let the critic pick.',
    s11: 'Deliver or hand off', s11d: 'Rationale, rejected options, what the design does not try to do, licences; a handoff package when someone else builds it.',
    s12: 'Retro', s12d: 'A silent close-out: when corrected, failing or missing something, log feedback, then back to the entry for a sharper next run.',
    grp_h: 'Where the thin lines end: the reference files',
    grp_cap: 'Before starting, read SKILL.md plus at most two references: the mode’s process file and the one discipline or platform file the surface needs. The rest is read at the step that uses it.',
    g_process: 'How each step runs', g_disciplines: 'What you are drawing', g_platforms: 'Where it runs', g_fundamentals: 'The durable basics',
    gl_posture: 'posture table and cross-platform checklist',
    grp_more: 'Also <a href="https://github.com/caocong1/design-skill-lab/blob/main/skills/design-studio/references/casebook.md">casebook</a> (for a render that is wrong in a way no rule explains) and <a href="https://github.com/caocong1/design-skill-lab/tree/main/skills/design-studio/references/catalog">catalog/</a> (generated from the resource catalogue; query it with <code>scripts/catalog.py</code>).',
    skills_h: 'The three skills',
    skills_cap: 'Not sure which one? Just describe the job: design-studio is the entry point and hands reviews to critique-design in a fresh session.',
    st1: 'Compose', st3: 'Correct', st4: 'Print',
    use: 'Use it for', makes: 'Produces', not: 'Not for', ops: 'Operators', flow: 'Flow', try: 'Say it like this', read_skill: 'Read SKILL.md on GitHub',
    arts_h: 'Real artifacts', arts_cap: 'What the method produced when used on this site, each dated. implement-design has no public example yet.', pf_brief: 'Design brief for this site', pf_brief_n: 'Readers, jobs, scenes, constraints, and the ruts to avoid.',
    pf_board: 'Options board: three seeded directions', pf_board_n: 'The same data set three ways; at 600px wide the structures still differ.',
    board_alt: 'The three directions’ home first screens side by side: A Herbarium, B Selection table, C Composing room',
    pf_crit: 'A fresh-session critique of this site: gate not met', pf_crit_n2: '5 P1 issues; craft, typography and accessibility scored 2. This version follows it.',
    mk_tag: 'Delete', mk_done: 'Done', mk_alt: 'The old resource list as the critic captured it: a 120px website screenshot left of every row',
    mk_before: 'Before, in the critic’s capture: a 120px screenshot on every row, three and a half rows per screen.', mk_after: 'After: the list is type only; screenshots stay in the plates and the proof note.',
    mk_alt_after: 'The resource list after the fix: type only, three rows and more in the same height',
    pf_dec: 'Blind review and decision: C wins', pf_dec_n: 'B, the seeded lead, scored 1 on identity and lost.',
    c1_tag: 'The entry point for every design intent, from requirements through to handoff.',
    c1_u1: 'Designing or redesigning: a whole product, a page, a screen, a component or a flow',
    c1_u2: 'Motion, icons, app icons, logos, posters, social graphics, decks',
    c1_u3: 'Options to choose from, inspiration and teardowns, handoff specs, annotations and asset slices',
    c1_m: 'PRODUCT.md, a brief, an options board, DESIGN.md and tokens, screens in every state, a handoff package; every version rendered and looked at.',
    c1_n: 'Reviewing an existing design or build (critique-design); coding an existing design (implement-design); front-end bugs that involve no design decision.',
    c2_tag: 'Fresh-eye review, scoring and build acceptance, best run in a brand-new subagent.',
    c2_u1: 'Reviewing a site, screen, flow, component, brand asset or deck, from shots, a URL, mockups or a Figma export',
    c2_u2: 'Accessibility (WCAG 2.2) audits, walkthroughs, design QA',
    c2_u3: 'Accepting a build against its handoff screenshots',
    c2_u4: 'The fresh critic that design-studio spawns at step 9',
    c2_m: 'Findings ranked by severity (P0–P3) and evidence basis, each as Before | After | Why with a crop; rubric scores; a disposition: ship, fix, rebuild or recapture.',
    c2_f: 'Evidence → judge (by eye first) → measure (lint, contrast, captures) → vet → verdict',
    c2_n: 'Making or redesigning a design (design-studio); fixing it in code (implement-design); code review with no visual question.',
    c3_tag: 'Builds a design that already exists in your stack, and proves it with screenshots.',
    c3_u1: 'A handoff package, HTML/CSS mockup, Figma frame or approved PNG has to land in the project',
    c3_u2: 'React, Vue, Tailwind, Ant Design, uni-app, Flutter, SwiftUI, Compose, ArkUI, mini-programs and more',
    c3_u3: 'A build drifted from its design and must be brought back',
    c3_m: 'Tokens landed in the host theme with a mapping, every state reachable, build shots beside the design shots, an acceptance report, visual-regression baselines, and a list of deviations and spec gaps.',
    c3_f: 'Inspect host → land tokens → build → verify by looking → acceptance (by critique-design; it never grades itself)',
    c3_n: 'Deciding or improving the design, UI polish, whole-product optimisation, design-then-build from scratch, dev specs and slices (design-studio); reports without fixing (critique-design).',
    modes_h: 'Modes and effort',
    modes_cap: 'design-studio first decides which mode you want, then picks an effort by scope, and says both in the design read.',
    modes_t: 'Modes × effort', th_mode: 'Mode', th_want: 'The user wants', th_eff: 'Effort', start_with: 'Start with: ',
    m_full: 'A complete design from requirements', m_piece: 'One page, screen, component, flow, animation, icon or graphic', m_piece_s: 'the discipline file',
    m_options: 'Several schemes to choose from; a modifier on any mode', m_options_e: 'adds steps 4 and 5 at the current effort',
    m_inspire: 'References, teardowns, style DNA, ideas for an existing product', m_critique: 'An honest review and a fix plan', m_critique_e: 'handed to critique-design',
    m_redesign: 'The product rethought from what it does', m_handoff: 'A package any implementer can build from',
    m_implement: 'The same agent also builds it', m_implement_s: 'a shrunk handoff (shots + tokens), then <code>implement-design</code>',
    ladder_h: 'The effort ladder',
    r_q_s: 'a component, icon, tweak, single graphic', r_q_d: 'Read → draw → render → floor → deliver. One reference at most, no options unless asked.', r_q_a: 'Includes steps 1, 2, 7, 8, 11 and 12',
    r_s_s: 'a screen, page, flow, brand asset, inspire, handoff', r_s_d: 'quick plus references looked at, a system slice (tokens), a fresh critique, one elevate pass.', r_s_a: 'Includes every step except 4 and 5',
    r_d_s: 'full, redesign, several surfaces or targets', r_d_d: 'The whole loop, with directions and critique in isolated subagents.', r_d_a: 'Includes every step',
    ladder_up: 'Move up when the user asks for options or the change touches navigation or several surfaces; move down when the user says quick or the host system already decides most choices.',
    ladder_bv: 'Verification is bounded: build everything first, then one batched capture round, one fix batch and at most one confirm round; then stop and disclose what remains.',
    modes_note: 'Optimising a product as a whole (“整体 UI 优化”, “全站优化”, “改版”, “重新设计”) is redesign, not a polish pass; only a named page or component with a bounded change is piece.',
    output_h: 'Output layout',
    output_cap: 'Everything lands in the project’s .design/, and every file has a template to copy: copy the structure, never the values.',
    tree_label: 'The .design/ folder', new: 'new in 0.8.0',
    o_product: 'Durable product truth', o_brief: 'Design read, referent, constraints', o_fmap: 'Objects, actions, frequency', o_dec: 'Decisions, options, why, seed',
    o_surf: 'One contract per surface', o_insp: 'Notes, captures, contact sheet', o_dir: 'The options board (index.html) and direction cards',
    o_sys: 'DESIGN.md, tokens, preview.html', o_arts: 'Artefacts, with their sources', o_hand: 'Spec, handoff.json, shots, mockups, assets, acceptance report',
    o_crit: 'Critique report and curated evidence crops, committed', o_shots: 'Bulk captures, gitignored',
    o_rule1: 'A host convention wins: <code>design/</code>, <code>docs/design/</code>, <code>.stitch/</code>, or instructions in AGENTS.md or CLAUDE.md.',
    o_rule2: 'A host system of record (DESIGN.md, a token file, a themed library) is updated in place, never forked into .design/system/.',
    o_rule3: 'Keep the brief and decisions short; quick work can be answered in chat.', o_tpl: 'All templates on GitHub',
    evals_h: 'Evals',
    evals_cap: 'The same model on the same fixed briefs, in three arms: no skill, suite 0.7.0, suite 0.8.0. Judges never see which arm made what; they score from the brief and canonical PNG renders and compare in pairs. Measurable facts (contrast, target sizes) are measured by script and handed to them. Losses are published too.',
    ev_state: 'The eval plan is set: fixed briefs, blind judging rules and a results format, all in <a href="https://github.com/caocong1/design-skill-lab/tree/main/evals">evals/</a>. It has not run yet, so there are no scores here.',
    ev_briefs_h: 'The fixed briefs',
    bf1: 'Equipment maintenance tickets: list, detail, and empty, loading and error states (Chinese admin, desktop)',
    bf2: 'Landing page for a local-first database, with no invented social proof (desktop and mobile)',
    bf3: 'Reading-habit app: Today, book detail, first-run empty state (iOS 26)',
    bf4: 'Home-service booking: list, filters and empty state (WeChat mini-program)',
    bf5: 'An agent run inside an accounting app: plan, progress, approval, error, result (desktop)',
    bf6: 'Redesign of a legacy clinic scheduler: the front desk’s day view (desktop)',
    ev_links: '<a href="https://github.com/caocong1/design-skill-lab/blob/main/evals/README.md">Method</a>, <a href="https://github.com/caocong1/design-skill-lab/blob/main/evals/judging.md">judging rules</a>, <a href="https://github.com/caocong1/design-skill-lab/blob/main/evals/results.schema.json">results format</a>',
    install_h: 'Other installs, upgrading',
    install_cap: 'The two Claude Code plugin commands are at the top of the page. Install the three as a set: critique-design and implement-design read design-studio’s references and scripts. Installed alone, their SKILL.md still works by itself.',
    inst_first: 'Then just describe the job; no need to name a skill. Every example on the cards below works as is.',
    inst_alt: 'Codex or manual install: symlink the whole set',
    inst_up: 'Upgrading from 0.7.x: where the old skills went',
    up_p: '0.8.0 folded the old child skills into design-studio’s references; three entry points remain. Where each old name went:',
    up_t: 'Old skills and their new places', up_old: 'Old skill', up_new: 'Now in',
    up_rm: 'Remove the old symlinks (symlinks only; real folders are left alone):',
    foot_note: 'The skills themselves live on GitHub.'
  };

  var ZH = harvest();
  Object.keys(DYN.zh).forEach(function (k) { ZH[k] = DYN.zh[k]; });
  Object.keys(DYN.en).forEach(function (k) { EN[k] = DYN.en[k]; });
  DSL.init({ zh: ZH, en: EN });

  /* ---------- effort filter: map + station index ---------- */
  var seg = D.getElementById('eff-seg'), route = D.getElementById('route'), stns = D.getElementById('stns'), cap = D.getElementById('eff-cap');
  function setEffort(e) {
    route.setAttribute('data-effort', e);
    stns.setAttribute('data-effort', e);
    seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-effort') === e)); });
    cap.textContent = t('eff_' + e);
  }
  seg.addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-effort]');
    if (b) setEffort(b.getAttribute('data-effort'));
  });

  /* ---------- the critique sample: the proof marks draw once when it comes into view (not under reduced motion;
     without script or motion they are simply there) ---------- */
  function src(p) { return /^[a-z]+:/i.test(p) ? p : DSL.root + p; }
  function img(im, cls) {
    var s = src(im.src);
    return '<a class="' + cls + '" href="' + esc(s) + '"><img src="' + esc(s) + '" width="' + (+im.w || '') + '" height="' + (+im.h || '') +
      '" loading="lazy" decoding="async" alt="' + esc(L(im.alt_zh, im.alt_en)) + '"></a>';
  }
  var marks = D.querySelectorAll('.marks');
  if (marks.length && W.IntersectionObserver && W.matchMedia && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    marks.forEach(function (m) { m.classList.add('wait'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    marks.forEach(function (m) { io.observe(m); });
  }

  /* ---------- showcase: the eval scoreboard (runs) ---------- */
  var ORDER = ['no-skill', 'suite-0.7.0', 'suite-0.8.0'];
  var DIMS = ['fit', 'hierarchy', 'identity', 'craft', 'typography', 'platform_a11y', 'overall'];
  function armName(k) { return k === 'no-skill' ? t('arm_none') : t('arm_suite', k.replace(/^suite-/, '')); }
  function armKeys(rs) {
    var seen = {};
    rs.forEach(function (r) { Object.keys(r.arms).forEach(function (k) { seen[k] = 1; }); });
    return ORDER.filter(function (k) { return seen[k]; }).concat(Object.keys(seen).filter(function (k) { return ORDER.indexOf(k) < 0; }).sort());
  }
  function val(r, k, d) { var a = r.arms[k], v = a && a.means && a.means[d]; return typeof v === 'number' && isFinite(v) ? v : null; }
  function mean(xs) { xs = xs.filter(function (x) { return x !== null; }); return xs.length ? xs.reduce(function (s, x) { return s + x; }, 0) / xs.length : null; }
  function fmt(v) { return v === null ? '–' : v.toFixed(1); }
  function reason(r) { var m = t('ev_reason'); return (m && m[r.winner_reason]) || ''; }
  /* region label carries the round date: several rounds can be on the page at once */
  function table(capt, date, head, rows, minW) {
    return '<div class="tbl-wrap" tabindex="0" role="region" aria-label="' + esc(capt + ' · ' + date) + '"><table class="tbl ev-t"' + (minW ? ' style="min-width:' + minW + '"' : '') + '><caption>' + esc(capt) + '</caption><thead><tr>' +
      head.join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
  }
  function round(date, rs) {
    rs = rs.slice().sort(function (a, b) { return a.brief < b.brief ? -1 : 1; });
    var arms = armKeys(rs), wins = {}, none = 0;
    rs.forEach(function (r) { if (r.winner && arms.indexOf(r.winner) >= 0) wins[r.winner] = (wins[r.winner] || 0) + 1; else none++; });
    var report = (rs.filter(function (r) { return r.report; })[0] || {}).report;
    var head = arms.map(function (k) { return esc(t('ev_wins', armName(k), wins[k] || 0)); }).join(L('；', '; ')) + (none ? L('；', '; ') + esc(t('ev_nowin', none)) : '') +
      (report ? '<a href="' + esc(src(report)) + '">' + esc(t('ev_report')) + '</a>' : '');
    var tA = table(t('ev_tA'), date,
      ['<th scope="col">' + esc(t('ev_arm')) + '</th>'].concat(DIMS.map(function (d) { return '<th scope="col" class="num">' + esc(t('dim_' + d)) + '</th>'; }), ['<th scope="col" class="num">' + esc(t('ev_bwins')) + '</th>']),
      arms.map(function (k) {
        return '<tr><th scope="row">' + esc(armName(k)) + '</th>' + DIMS.map(function (d) { return '<td class="num">' + fmt(mean(rs.map(function (r) { return val(r, k, d); }))) + '</td>'; }).join('') +
          '<td class="num">' + (wins[k] || 0) + '</td></tr>';
      }), '40rem');
    var tB = table(t('ev_tB'), date,
      ['<th scope="col">' + esc(t('ev_brief')) + '</th>'].concat(arms.map(function (k) { return '<th scope="col" class="num">' + esc(armName(k)) + '</th>'; }), ['<th scope="col">' + esc(t('ev_winner')) + '</th>']),
      rs.map(function (r) {
        var title = L(r.title_zh, r.title_en) || r.brief;
        return '<tr><th scope="row"><a href="' + esc(GH + 'evals/briefs/' + r.brief + '.md') + '">' + esc(title) + '</a></th>' + arms.map(function (k) {
          var v = val(r, k, 'overall'), empty = r.arms[k] && r.arms[k].status === 'empty';
          var cell = empty ? esc(t('ev_empty')) : fmt(v);
          return '<td class="num">' + (r.winner === k ? '<span class="sort S">' + cell + '</span>' : cell) + '</td>';
        }).join('') + '<td>' + (r.winner ? esc(armName(r.winner)) : esc(t('ev_none')) + (reason(r) ? '<small>' + esc(reason(r)) + '</small>' : '')) + '</td></tr>';
      }));
    var notes = rs.filter(function (r) { return L(r.note_zh, r.note_en); }).map(function (r) { return '<li><b>' + esc(L(r.title_zh, r.title_en) || r.brief) + '</b>' + L('：', ': ') + esc(L(r.note_zh, r.note_en)) + '</li>'; });
    var shots = rs.filter(function (r) { return r.shots && Object.keys(r.shots).length; }).map(function (r) {
      return '<div><h4>' + esc(L(r.title_zh, r.title_en) || r.brief) + '</h4><div class="ev-row">' + arms.filter(function (k) { return r.shots[k] && r.shots[k].src; }).map(function (k) {
        return '<figure>' + img(r.shots[k], 'shot') + '<figcaption><b>' + esc(armName(k)) + '</b>' + (r.winner === k ? L('，', ', ') + esc(t('ev_winner')) : '') + '</figcaption></figure>';
      }).join('') + '</div></div>';
    });
    return '<p class="ev-head">' + head + '</p><div class="ev-tables">' + tA + tB + '</div>' +
      (notes.length ? '<ul class="ev-notes" aria-label="' + esc(t('ev_notes')) + '">' + notes.join('') + '</ul>' : '') +
      (shots.length ? '<h4 class="sub-h">' + esc(t('ev_shots')) + '</h4><div class="ev-shots">' + shots.join('') + '</div>' : '');
  }
  function setRuns(runs) {
    runs = runs.filter(function (r) { return r && r.date && r.brief && r.arms && typeof r.arms === 'object'; });
    if (!runs.length) return;                       /* nothing judged yet: the static 评测进行中 state stays */
    var byDate = {};
    runs.forEach(function (r) { (byDate[r.date] = byDate[r.date] || []).push(r); });
    var dates = Object.keys(byDate).sort().reverse();
    var board = D.getElementById('ev-board');
    board.innerHTML = dates.map(function (d, i) {
      return i === 0
        ? '<section class="ev-round" aria-labelledby="ev-r0"><h3 id="ev-r0">' + esc(t('ev_round', d)) + '</h3>' + round(d, byDate[d]) + '</section>'
        : '<details class="ev-old"><summary>' + esc(t('ev_old', d)) + '</summary>' + round(d, byDate[d]) + '</details>';
    }).join('');
    board.hidden = false;
    D.getElementById('ev-pending').hidden = true;
  }

  function loadShowcase() {
    if (!W.fetch || location.protocol === 'file:') return;
    fetch(DSL.root + 'assets/showcase/showcase.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && Array.isArray(j.runs)) setRuns(j.runs);
      })
      .catch(function () { /* absent or offline: the plain status line stays */ });
  }
  loadShowcase();
})(window, document);
