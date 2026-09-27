#!/usr/bin/env bash
# The lab's Definition of Done. The checks live in scripts/gates.py (stdlib Python, one named function
# per gate, G1-G9); this entry point keeps the name that the maintainer skill, CI and habits use.
#
# Usage: scripts/check-lab-invariants.sh [G1 G4 ...]
# Exit 0 = every gate passes. Exit 1 = at least one gate failed (each failure is printed under its gate).
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/gates.py "$@"
