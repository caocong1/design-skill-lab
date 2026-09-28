/* Home: page strings, and the desktop fit of the case. The case, the picks, the ledger and the data stamp are static
   HTML written by the catalogue build (regions marked gen:* in index.html), in both UI languages; the page loads no
   catalogue data. Load order (defer): assets/site.js → assets/home.js. */
(function (W, D) {
  'use strict';
  var DSL = W.DSL, esc = DSL.esc, t = DSL.t;

  DSL.init({
    zh: {
      h1: '<span class="ph">让 coding agent</span> <span class="ph">像资深设计师一样做设计，</span><span class="ph">交出能照着开工的稿子。</span>',
      lede: '给设计师和设计工程师：三件 skill 装进 Claude Code 或 Codex，agent 先写 brief，出几个真正不同的方向，渲染出来自己看，再换一个新会话挑错，最后交接。另附一份逐条标注的设计资源目录：怎么直达、什么授权、agent 能不能读到。',
      inst_h: '装进 Claude Code', first: '装好后直接说需求，比如“给这个后台做三套方向”，或“评审一下这个页面”。',
      inst_alt: 'Codex 或手动安装：软链接整套 skill',
      case_h: '资源字架',
      more: function (k) { return '另 ' + k + ' 节'; },
      proof_h: '校样', proof_cap: '这套方法用在本站自己身上的产物',
      pf_eval2: '第二轮盲评：六份 brief 全胜，均分差仍不到门槛', pf_eval2_n: '0.8.1 对不装 skill：brief 6:0，盲评组 17:1；均分 4.11 对 3.83，差 0.28，不到 0.5，按规则是“没有明确差别”。花费 2.0 倍。',
      pf_eval: '首轮盲评：规则不允许说“更好”', pf_eval_n: '0.8.0 对不装 skill 赢 5 份、输 1 份，均分只高 0.17；落地页 0:3 输掉。',
      pf_crit: '新会话评审本站：没过门槛', pf_crit_n: '评审挑出 5 个 P1，这一版照着改；下面是它在资源列表上标的一处。',
      pf_dec: '盲评与决定：C 字架胜出', pf_dec_n: '抽签领先的 B 身份感只得 1 分，出局。', pf_board: '方向板：按种子抽出的三个方向', pf_brief: '本站设计 brief',
      ledger_h: '入藏记录',
      mk_tag: '删', mk_cap: 'P2：列表里的截图只有 120px 宽，字看不清，一屏只放得下三条半。改后列表只排字，截图留在图版和批注里。', mk_alt: '评审截下的旧资源列表：每条左边一张 120px 宽的网站截图',
      shop_h: '这套 skill 怎么干活',
      st1: '排字', st1d: '读懂任务，写 brief，按种子出几个真正不同的方向，定下系统，画出每一种状态。',
      st2: '打样', st2d: '每一版都真的渲染出来、截图、自己看；没看过的，如实写“未验证”。',
      st3: '校对', st3d: '换一个全新的子会话挑错，按严重程度写出带证据的报告。',
      st4: '付印', st4d: '照交接规格在你的技术栈里落地，再按截图验收。',
      which_h: '该交给哪一件',
      r1a: '已有设计稿、交接包或 mockup，要在某个技术栈里做出来', r1b: '还没有能照着做的稿子', r1b_a: '看 2',
      r2a: '已有页面或设计，要评审、验收、挑错', r2b: '要新做或重做设计：页面、系统、方向、图标、动效、品牌',
      route_note: '拿不准就直接说需求：design-studio 是入口，需要评审时它会另开会话交给 critique-design。',
      lab_line: '<a href="lab/">设计方向实验室</a>：同一份目录的多种排法，每种附方向卡，写明它会在哪里失败。这套方法最早的试验品，留作对照。',
    },
    en: {
      h1: 'Make your coding agent design like a senior designer, and hand off work a team can build.',
      lede: 'For designers and design engineers: three skills for Claude Code or Codex. The agent writes a brief, draws a few genuinely different directions, renders and looks at its own work, has a fresh session look for faults, then hands off. Plus a hand-tagged catalogue of design resources: how to get there, the licence, and whether an agent can read it.',
      inst_h: 'Install in Claude Code', first: 'Then just ask, for example “draw three directions for this admin console” or “critique this page”.',
      inst_alt: 'Codex or manual install: symlink the whole set',
      case_h: 'The resource case',
      more: function (k) { return '+' + k + ' more'; },
      proof_h: 'Proof', proof_cap: 'What the method produced for this site',
      pf_eval2: 'Second blind eval: all six briefs won, the mean gap still under the margin', pf_eval2_n: '0.8.1 vs no skill: briefs 6-0, judged sets 17-1; mean 4.11 vs 3.83, a gap of 0.28 where the rule asks 0.5, so “no clear difference”. Cost 2.0 times.',
      pf_eval: 'First blind eval: the rule allows no “better” claim', pf_eval_n: '0.8.0 beat no skill on 5 of 6 briefs but by only 0.17 on the mean, and lost the landing page 0-3.',
      pf_crit: 'A fresh-session critique of this site: gate not met', pf_crit_n: 'It found 5 P1 issues and this version follows it. Below, one of its marks on the resource list.',
      pf_dec: 'Blind review and decision: C wins', pf_dec_n: 'B, the seeded lead, scored 1 on identity and lost.', pf_board: 'Options board: three seeded directions', pf_brief: 'Design brief for this site',
      ledger_h: 'Accession ledger',
      mk_tag: 'Delete', mk_cap: 'P2: list screenshots are 120px wide, too small to read, and only three and a half rows fit on a screen. The list is now type only; screenshots stay in the plates and the proof note.', mk_alt: 'The old resource list as the critic captured it: a 120px website screenshot left of every row',
      shop_h: 'How the skills work',
      st1: 'Compose', st1d: 'Reads the task, writes the brief, rolls a few genuinely different directions, sets the system, draws every state.',
      st2: 'Proof', st2d: 'Every version is rendered, captured and looked at; anything not looked at is reported as unverified.',
      st3: 'Correct', st3d: 'A brand-new subagent looks for faults and writes a graded report with evidence.',
      st4: 'Print', st4d: 'Builds from the handoff spec in your stack, then accepts it by screenshot.',
      which_h: 'Which skill takes the job',
      r1a: 'A design, handoff package or mockup exists; build it in a stack', r1b: 'Nothing to build from yet', r1b_a: 'go to 2',
      r2a: 'A page or design exists; review it, accept it, find faults', r2b: 'Design something new or redo it: pages, systems, directions, icons, motion, brand',
      route_note: 'Not sure? Just describe the job: design-studio is the entry point and hands reviews to critique-design in a fresh session.',
      lab_line: 'The <a href="lab/">directions lab</a>: the same catalogue set several ways, each with its direction card and where it fails. The method’s first experiments, kept for comparison.',
    }
  });

  /* desktop: a compartment that overflows hides its last sections behind "另 N 节" (a link to the whole domain) */
  function fit(c) {
    var ul = c.querySelector('.c-secs');
    var old = ul.querySelector('.more');
    if (old) old.remove();
    var items = Array.prototype.slice.call(ul.children);
    items.forEach(function (li) { li.hidden = false; });
    if (c.scrollHeight <= c.clientHeight + 1) return;
    var more = D.createElement('li');
    more.className = 'more';
    ul.appendChild(more);
    var link = c.querySelector('.c-name').getAttribute('href');
    for (var k = items.length - 1; k > 0 && c.scrollHeight > c.clientHeight + 1; k--) {
      items[k].hidden = true;
      more.innerHTML = '<a href="' + esc(link) + '"><span>' + esc(t('more', items.length - k)) + '</span></a>';
    }
  }
  function layout() {
    var desk = W.matchMedia('(min-width: 721px)').matches;
    D.querySelectorAll('#case-rows .cell').forEach(function (c) {
      if (desk) fit(c);
      else { c.querySelectorAll('.c-secs li').forEach(function (li) { li.hidden = false; }); var m = c.querySelector('.more'); if (m) m.remove(); }
    });
  }
  layout();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(layout);
  W.addEventListener('load', layout);                /* the proof figure's image can change the column height */
  var tm;
  W.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(layout, 120); });
})(window, document);
