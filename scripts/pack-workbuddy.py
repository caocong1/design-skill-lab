#!/usr/bin/env python3
"""Pack the design suite for the WorkBuddy open platform (open.workbuddy.cn).

Sources of truth stay where they are: skills/ holds the three skills, workbuddy/experts/ holds
the expert-only files (agents, plugin.json, avatars, rules). This script assembles upload zips
under dist/workbuddy/ (gitignored) and validates every documented requirement before zipping.

  dist/workbuddy/
    design-studio.zip        skill package   (skill dir at zip root, like the official template)
    critique-design.zip      skill package
    implement-design.zip     skill package
    design-suite.zip         expert package  (expertType agent, skills/ embedded as siblings)
    design-team.zip          expert team     (expertType team,  setting.json, rules/, avatars/)

Usage
  scripts/pack-workbuddy.py            build everything, print the manifest
  scripts/pack-workbuddy.py --check    same validation, writes to a throwaway dir

Stdlib only. Frontmatter parsing reuses scripts/gates.py's strict subset parser.
"""
import argparse
import json
import pathlib
import shutil
import struct
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
import gates  # noqa: E402  (repo-local strict frontmatter parser)

OUT = ROOT / 'dist' / 'workbuddy'
SKILLS = ('design-studio', 'critique-design', 'implement-design')
EXPERTS = ('design-suite', 'design-team')
EXCLUDE = {'.DS_Store', '__MACOSX', '__pycache__'}
AVATAR_MAX = 500 * 1024

SKILL_REQUIRED = ('display_name', 'display_name_en', 'description_zh', 'description_en',
                  'version', 'author')
PLUGIN_REQUIRED = ('name', 'version', 'description', 'author', 'agents', 'expertType', 'agentName',
                   'displayName', 'profession', 'displayDescription', 'avatar', 'categoryId',
                   'defaultInitPrompt', 'plugin', 'tags', 'quickPrompts')

fails = []


def fail(msg):
    fails.append(msg)
    print(f'FAIL {msg}')


def skip(p):
    return any(part in EXCLUDE or part.endswith('.pyc') for part in p.parts)


def copytree(src, dst):
    if dst.exists():
        shutil.rmtree(dst)
    dst.mkdir(parents=True)
    for p in sorted(src.rglob('*')):
        if p.is_file() and not skip(p):
            t = dst / p.relative_to(src)
            t.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, t)


def zipdir(src, zip_path, root_name):
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(src.rglob('*')):
            if p.is_file():
                z.write(p, f'{root_name}/{p.relative_to(src).as_posix()}')


def png_size(p):
    try:
        head = p.read_bytes()[:33]
        if head[:8] != b'\x89PNG\r\n\x1a\n':
            return None
        return struct.unpack('>II', head[16:24])
    except OSError:
        return None


def check_avatar(p, label):
    if not p.is_file():
        return fail(f'{label}: avatar missing: {p.relative_to(ROOT)}')
    if png_size(p) != (512, 512):
        fail(f'{label}: {p.name} is not a 512x512 PNG')
    if p.stat().st_size > AVATAR_MAX:
        fail(f'{label}: {p.name} is {p.stat().st_size // 1024}KB (limit 500KB)')


def skill_meta(name):
    fm, err = gates.frontmatter((ROOT / 'skills' / name / 'SKILL.md').read_text(encoding='utf-8'))
    if err:
        fail(f'skills/{name}/SKILL.md: {err}')
        return {}
    return fm


def check_skill(name):
    fm = skill_meta(name)
    if not fm:
        return
    if fm.get('name') != name:
        fail(f'{name}: name {fm.get("name")!r} != dir name')
    for key in SKILL_REQUIRED + ('description',):
        if not fm.get(key):
            fail(f'{name}: SKILL.md frontmatter missing {key}')


def check_agent_md(path, names):
    fm, err = gates.frontmatter(path.read_text(encoding='utf-8'))
    if err:
        return fail(f'{path.relative_to(ROOT)}: {err}')
    if fm.get('name') != path.stem:
        fail(f'{path.relative_to(ROOT)}: name {fm.get("name")!r} != filename')
    names.add(fm.get('name'))


def localized(v, label, key):
    if not isinstance(v, dict) or not v.get('en') or not v.get('zh'):
        fail(f'{label}: {key} needs {{en, zh}}')
        return {}
    return v


def check_plugin(expert, build):
    cfg_path = build / '.codebuddy-plugin' / 'plugin.json'
    try:
        cfg = json.loads(cfg_path.read_text(encoding='utf-8'))
    except ValueError as e:
        fail(f'{expert}: plugin.json invalid: {e}')
        return
    for key in PLUGIN_REQUIRED:
        if key not in cfg:
            fail(f'{expert}: plugin.json missing {key}')
    name = cfg.get('name', '')
    if name != expert:
        fail(f'{expert}: name {name!r} != package dir')
    if cfg.get('plugin') != name:
        fail(f'{expert}: plugin field must equal name')
    if cfg.get('expertType') not in ('agent', 'team'):
        fail(f'{expert}: expertType {cfg.get("expertType")!r}')
    for key in ('displayName', 'profession', 'defaultInitPrompt'):
        localized(cfg.get(key), expert, key)
    dd = localized(cfg.get('displayDescription'), expert, 'displayDescription')
    if dd:
        zh_len = len(dd['zh'])
        if not 40 <= zh_len <= 50:
            fail(f'{expert}: displayDescription.zh is {zh_len} chars (must be 40-50)')
    tags, qp = cfg.get('tags', []), cfg.get('quickPrompts', [])
    if len(tags) != 3:
        fail(f'{expert}: tags must be exactly 3')
    if len(qp) != 3:
        fail(f'{expert}: quickPrompts must be exactly 3')
    elif cfg.get('defaultInitPrompt') != qp[0]:
        fail(f'{expert}: defaultInitPrompt must equal quickPrompts[0]')
    check_avatar(build / cfg.get('avatar', ''), expert)

    agents = cfg.get('agents', [])
    agent_names = set()
    for rel in agents:
        p = build / rel.lstrip('./')
        if not p.is_file():
            fail(f'{expert}: agent file missing: {rel}')
        else:
            check_agent_md(p, agent_names)
    if cfg.get('agentName') not in agent_names:
        fail(f'{expert}: agentName {cfg.get("agentName")!r} not among agents {sorted(agent_names)}')

    if cfg.get('expertType') == 'team':
        ti = cfg.get('teamInfo', {})
        if ti.get('leadAgent') != cfg.get('agentName'):
            fail(f'{expert}: teamInfo.leadAgent must equal agentName')
        missing = set(ti.get('memberAgents', [])) - agent_names
        if missing:
            fail(f'{expert}: teamInfo.memberAgents not in agents/: {sorted(missing)}')
        members = {m.get('id'): m for m in cfg.get('members', [])}
        if set(members) != agent_names:
            fail(f'{expert}: members ids {sorted(members)} != agents {sorted(agent_names)}')
        for m in cfg.get('members', []):
            check_avatar(build / m.get('avatar', ''), f'{expert}:{m.get("id")}')
            if m.get('role') not in ('lead', 'member'):
                fail(f'{expert}: member {m.get("id")} role must be lead|member')
        try:
            setting = json.loads((build / 'setting.json').read_text(encoding='utf-8'))
            if setting.get('agent') != cfg.get('agentName'):
                fail(f'{expert}: setting.json agent != agentName')
        except (OSError, ValueError) as e:
            fail(f'{expert}: setting.json unreadable: {e}')
        if sum(1 for m in cfg.get('members', []) if m.get('role') == 'lead') != 1:
            fail(f'{expert}: exactly one member must have role lead')


def build_skills():
    for name in SKILLS:
        check_skill(name)
        stage = OUT / 'build' / 'skills' / name
        copytree(ROOT / 'skills' / name, stage)
        zipdir(stage, OUT / f'{name}.zip', name)


def build_expert(expert, suite_version):
    src = ROOT / 'workbuddy' / 'experts' / expert
    stage = OUT / 'build' / expert
    copytree(src, stage)
    plugin_src = stage / 'plugin.json'
    if not plugin_src.is_file():
        return fail(f'{expert}: workbuddy/experts/{expert}/plugin.json missing')
    cfg = json.loads(plugin_src.read_text(encoding='utf-8'))
    if cfg.get('version') != suite_version:
        print(f'  note: {expert} plugin.json version {cfg.get("version")!r} -> suite {suite_version}')
        cfg['version'] = suite_version
    plugin_src.unlink()
    plugdir = stage / '.codebuddy-plugin'
    plugdir.mkdir(exist_ok=True)
    (plugdir / 'plugin.json').write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + '\n',
                                         encoding='utf-8')
    for name in SKILLS:
        copytree(ROOT / 'skills' / name, stage / 'skills' / name)
    check_plugin(expert, stage)
    zipdir(stage, OUT / f'{expert}.zip', expert)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='validate only, write nothing')
    args = ap.parse_args()

    suite = skill_meta('design-studio').get('metadata', {}).get('version')
    if not suite:
        sys.exit('cannot read design-studio metadata.version')

    if args.check:
        OUT_CHECK = ROOT / 'dist' / 'workbuddy-check'
        global OUT
        OUT = OUT_CHECK
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    build_skills()
    for expert in EXPERTS:
        build_expert(expert, suite)

    print()
    for z in sorted(OUT.glob('*.zip')):
        print(f'  {z.relative_to(ROOT)}  {z.stat().st_size / 1024:.0f} KB')
    if fails:
        sys.exit(f'\n{len(fails)} problem(s) found')
    print(f'\nall checks passed; zips in {OUT.relative_to(ROOT)}/'
          + (' (check run)' if args.check else ''))


if __name__ == '__main__':
    main()
