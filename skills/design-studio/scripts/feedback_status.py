#!/usr/bin/env python3
"""Say whether feedback capture is on for this install, where entries go, and why.

  feedback_status.py

Capture is on when entries have somewhere to go. Checked in this order:

  1. DESIGN_SKILL_LAB_INBOX names an existing, writable folder. The user sets it; an agent never
     does. It may be the lab's own feedback/inbox, or any folder whose files the lab later takes
     in with its scripts/collect-feedback.py --import.
  2. This skill is linked from a checkout of the lab: two levels above the skill folder there is
     a .git and a feedback/inbox.

A copied or plugin-installed skill has neither, so capture is off until one of them is set up.

Prints "capture: on" with the inbox and how it was found, or "capture: off" with the reason and
how to turn it on. Exit: 0 on · 1 off.
Procedure: references/feedback.md. Python 3 stdlib only; macOS, Linux and Windows.
"""
import os
import sys
from pathlib import Path

ENV = "DESIGN_SKILL_LAB_INBOX"


def from_env():
    """(inbox, problem): the configured folder, or why the setting cannot be used."""
    value = os.environ.get(ENV, "").strip()
    if not value:
        return None, None
    folder = Path(value).expanduser()
    if not folder.is_dir():
        return None, f"{ENV} is set to {value}, which is not an existing folder"
    if not os.access(folder, os.W_OK):
        return None, f"{ENV} is set to {value}, which is not writable"
    return folder.resolve(), None


def from_checkout(skill):
    """(inbox, problem): the inbox of the lab this skill is linked from, or what kind of install it is."""
    lab = skill.parent.parent
    if "plugins" in lab.parts:
        return None, f"plugin install: {skill} is a copy managed by the host"
    inbox = lab / "feedback" / "inbox"
    if (lab / ".git").exists() and inbox.is_dir():
        return inbox, None
    return None, f"copied install: {skill} is not inside a checkout of the lab"


def main():
    if hasattr(sys.stdout, "reconfigure"):  # a path the console cannot encode must not stop the answer
        sys.stdout.reconfigure(errors="backslashreplace")
    if len(sys.argv) > 1:
        print(__doc__.strip())
        return 0 if sys.argv[1] in ("-h", "--help") else 2
    skill = Path(__file__).resolve().parent.parent  # resolve() follows links to the real folder
    problems = []
    for via, (inbox, problem) in ((ENV, from_env()), ("linked checkout", from_checkout(skill))):
        if inbox:
            print(f"capture: on\ninbox: {inbox}\nvia: {via}")
            for line in problems:
                print(f"note: {line}")
            return 0
        if problem:
            problems.append(problem)
    print("capture: off")
    for line in problems:
        print(f"why: {line}")
    print(f"turn on: link the skill folders from a checkout of the lab, or set {ENV} to an existing folder")
    return 1


if __name__ == "__main__":
    sys.exit(main())
