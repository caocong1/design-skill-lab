#!/usr/bin/env python3
"""Self-test of skills/design-studio/scripts/seed.py, including pinned referents.

  scripts/test-seed.py        exit 0 = deterministic rolls and pin exclusion hold

Stdlib only; CI runs it on Linux and Windows.
"""
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'skills/design-studio/scripts/seed.py'
REFERENTS = [
    'Front-of-house notice board | signage | fixed date and area positions',
    'Duty magnet board | craft and tools | named pieces move between slots',
    'Handover log | print and publishing | one event per ruled line',
    'Airport task strip | transport | one strip per service',
    'Lifeguard rotation clock | instruments and controls | overlaps stay visible',
    'Pharmacist check slip | craft and tools | identity checked before sealing',
    'Radio running order | print and publishing | changes remain in sequence',
]


def run(folder, lines, pick):
    folder.mkdir(parents=True, exist_ok=True)
    brief = folder / 'brief.md'
    brief.write_text('Community theatre volunteer scheduling; six directions.', encoding='utf-8')
    source = folder / 'referents.txt'
    source.write_text('# rut: generic admin table\n' + '\n'.join(lines) + '\n', encoding='utf-8')
    command = [sys.executable, str(SCRIPT), '--brief', str(brief), '--round', '1',
               '--pick', str(pick), str(source)]
    return subprocess.run(command, capture_output=True, text=True, encoding='utf-8')


def result(folder, lines, pick):
    completed = run(folder, lines, pick)
    assert completed.returncode == 0, completed.stderr
    return completed.stdout, json.loads(completed.stdout.splitlines()[-1])


def main():
    with tempfile.TemporaryDirectory(prefix='seed-selftest-') as tmp:
        root = pathlib.Path(tmp)

        plain_out, plain = result(root / 'plain', REFERENTS, 6)
        assert len(plain['board']) == 6
        assert plain['count'] == plain['total_count'] == 7
        assert plain['pinned'] == []
        assert plain['board'][0]['role'] == 'lead'
        assert plain['board'][0]['position'] >= 3
        assert len({row['position'] for row in plain['board']}) == 6
        assert 'PIN=' not in plain_out
        print('PASS ordinary six-direction roll: unique positions, lead after skip, no pins')

        pinned_lines = REFERENTS.copy()
        pinned_lines[1] += ' | pinned'
        pinned_out, pinned = result(root / 'pinned', pinned_lines, 5)
        assert len(pinned['board']) == 5
        assert pinned['count'] == 6 and pinned['total_count'] == 7
        assert len(pinned['pinned']) == 1
        pin = pinned['pinned'][0]
        assert pin['position'] == 2
        assert not pin['referent'].endswith('| pinned')
        rolled_positions = {row['position'] for row in pinned['board']}
        assert 2 not in rolled_positions
        assert len(rolled_positions) == 5
        assert len(rolled_positions | {pin['position']}) == 6
        assert 'PIN=#2' in pinned_out
        assert 'Pinned, excluded from the roll' in pinned_out
        print('PASS pinned roll: five rolled + one pin = six unique directions')

        _, repeated = result(root / 'repeat', pinned_lines, 5)
        assert repeated['key'] == pinned['key']
        assert repeated['board'] == pinned['board']
        assert repeated['pinned'] == pinned['pinned']
        print('PASS deterministic roll: identical brief, pins and seed reproduce the board')

        original = result(root / 'original-position', REFERENTS[:1] + REFERENTS[2:], 5)[1]
        assert original['key'] == pinned['key']
        assert len(original['board']) == len(pinned['board'])
        for before, after in zip(original['board'], pinned['board']):
            assert before['slot'] == after['slot']
            assert before['role'] == after['role']
            assert before['referent'] == after['referent']
            shift = 1 if before['position'] >= 2 else 0
            assert after['position'] == before['position'] + shift
            assert after['file_line'] == before['file_line'] + shift
        print('PASS pin exclusion preserves rolled order, referents and original #N/file_line mapping')

        all_pinned = run(root / 'all-pinned', [line + ' | pinned' for line in REFERENTS], 1)
        assert all_pinned.returncode == 2
        assert '0 unpinned referents' in all_pinned.stderr
        print('PASS all-pinned accidental roll fails clearly instead of duplicating a card')

    print('\nOK  all seed.py self-tests pass.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except AssertionError as error:
        print(f'FAIL {error}', file=sys.stderr)
        sys.exit(1)
