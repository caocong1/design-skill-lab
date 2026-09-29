#!/usr/bin/env python3
"""Self-test of the skill's feedback_status.py on installs whose answer is known.

  scripts/test-feedback-status.py        exit 0 = every install type is recognised

Builds, in a temporary folder, a stand-in lab checkout and four installs of the skill (linked,
copied, plugin, copied with DESIGN_SKILL_LAB_INBOX) and checks what the script says about each.
The link is a symlink on macOS and Linux and a directory junction on Windows, which needs no
administrator rights. Stdlib only; CI runs it on Linux and on Windows.
"""
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'skills/design-studio/scripts/feedback_status.py'
ENV = 'DESIGN_SKILL_LAB_INBOX'


def skill_in(parent):
    """A minimal skill folder holding the real script."""
    scripts = parent / 'design-studio' / 'scripts'
    scripts.mkdir(parents=True)
    shutil.copy2(SCRIPT, scripts / SCRIPT.name)
    return parent / 'design-studio'


def checkout(root):
    """A folder that looks like a lab checkout, with the skill inside it."""
    (root / '.git').mkdir(parents=True)
    (root / 'feedback' / 'inbox').mkdir(parents=True)
    return skill_in(root / 'skills')


def link(source, target):
    target.parent.mkdir(parents=True)
    if os.name == 'nt':
        subprocess.run(['cmd', '/c', 'mklink', '/J', str(target), str(source)], check=True, capture_output=True)
    else:
        target.symlink_to(source, target_is_directory=True)


def run(skill, inbox=None):
    env = {k: v for k, v in os.environ.items() if k != ENV}
    if inbox is not None:
        env[ENV] = str(inbox)
    r = subprocess.run([sys.executable, str(skill / 'scripts' / SCRIPT.name)],
                       capture_output=True, text=True, encoding='utf-8', env=env)
    return r.returncode, r.stdout


def main():
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='feedback-status-')).resolve()
    try:
        lab_skill = checkout(tmp / 'lab')
        linked = tmp / 'home' / 'skills' / 'design-studio'
        link(lab_skill, linked)
        copied = skill_in(tmp / 'copy' / 'skills')
        plugin = checkout(tmp / 'plugins' / 'cache' / 'lab')
        drafts = tmp / 'drafts'
        drafts.mkdir()
        lab_inbox = (tmp / 'lab' / 'feedback' / 'inbox').resolve()

        cases = [
            ('a linked install writes into the checkout it is linked from',
             run(linked), 0, ['capture: on', f'inbox: {lab_inbox}', 'via: linked checkout']),
            ('a copied install is off and says why',
             run(copied), 1, ['capture: off', 'why: copied install', 'turn on:']),
            ('a plugin install is off even with a .git and an inbox beside it',
             run(plugin), 1, ['capture: off', 'why: plugin install']),
            ('a copied install with the variable set writes into that folder',
             run(copied, drafts), 0, ['capture: on', f'inbox: {drafts.resolve()}', f'via: {ENV}']),
            ('a variable naming a missing folder is reported, not created',
             run(copied, tmp / 'missing'), 1, ['capture: off', f'why: {ENV} is set to', 'not an existing folder']),
            ('a linked install ignores a broken variable and says so',
             run(linked, tmp / 'missing'), 0, ['capture: on', 'via: linked checkout', f'note: {ENV} is set to']),
        ]
        failed = 0
        for name, (code, out), want_code, want in cases:
            ok = code == want_code and all(w in out for w in want)
            failed += not ok
            print('PASS' if ok else 'FAIL', name)
            if not ok:
                print(f'  exit {code}, expected {want_code}; output:\n' + '\n'.join('    ' + ln for ln in out.splitlines()))
        if (tmp / 'missing').exists():
            failed += 1
            print('FAIL the script created the folder the variable named')
        return 1 if failed else 0
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    sys.exit(main())
