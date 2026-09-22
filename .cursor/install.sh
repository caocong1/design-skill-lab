#!/usr/bin/env bash
# Cloud Agent bootstrap for Design Skill Lab.
#
# The suite itself needs only the Python standard library, curl and a
# Chromium-family browser (all present on the base image). This script adds the
# two things a headless Linux container is missing for the design render loop:
#
#   1. ImageMagick, so skills/design-studio/scripts/shot.sh can crop the
#      sub-500px viewports (headless Chrome cannot size a window narrower than
#      500px, so shot.sh renders into a 500px frame and crops with `convert`).
#   2. A PATH-first `google-chrome` shim that gives shot.sh a one-shot headless
#      browser that EXITS. The stock /usr/local/bin/google-chrome wrapper keeps a
#      persistent --remote-debugging-port session alive for computer-use, so a
#      bare `--screenshot` renders the image but never terminates and shot.sh
#      hangs. The shim routes headless captures to the raw binary with
#      container-safe sandbox flags and passes everything else through to the
#      interactive wrapper unchanged.
#
# Idempotent: safe to run repeatedly and against a warm snapshot.
set -euo pipefail
cd "$(dirname "$0")/.."

# --- 1. ImageMagick (only when missing) --------------------------------------
if ! command -v convert >/dev/null 2>&1 && ! command -v magick >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq imagemagick
fi

# --- 2. One-shot headless Chrome shim ----------------------------------------
mkdir -p "$HOME/.local/bin"
cat > "$HOME/.local/bin/google-chrome" <<'SHIM'
#!/bin/bash
# PATH-first Chrome shim for this repo's render scripts. See .cursor/install.sh.
# Route one-shot headless captures to the raw binary (they must EXIT); pass
# every other invocation through to the interactive computer-use wrapper.
for arg in "$@"; do
  case "$arg" in
    --headless|--headless=*|--screenshot=*|--dump-dom)
      exec /usr/bin/google-chrome-stable \
        --no-sandbox --disable-dev-shm-usage --disable-gpu "$@" ;;
  esac
done
exec /usr/local/bin/google-chrome "$@"
SHIM
chmod +x "$HOME/.local/bin/google-chrome"

# --- 3. Ensure the shim is discovered first ----------------------------------
# ~/.profile already prepends ~/.local/bin for login shells; cover non-login
# interactive shells too so `shot.sh` finds the shim however it is invoked.
if ! grep -q 'HOME/.local/bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi

echo "Design Skill Lab environment ready."
echo "  imagemagick: $(command -v convert || command -v magick || echo MISSING)"
echo "  chrome shim: $HOME/.local/bin/google-chrome"
