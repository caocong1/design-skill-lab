#!/usr/bin/env bash
# Multi-viewport screenshots of a URL or a local HTML file, with no dependencies
# beyond an installed Chromium-family browser.
#
#   shot.sh <url-or-file> [out-dir] [--dark] [--full] [--wait ms] [WxH ...]
#
# Default viewports: 390x844 768x1024 1280x800 1920x1080 (device scale factor 2).
# --dark  emulate prefers-color-scheme: dark
# --full  full-page capture. Uses Playwright when `npx` is available (true full
#         page); otherwise falls back to a tall window, which distorts layouts
#         that use vh units - the script says so when it happens.
# --wait  virtual time budget for fonts, images and entrance animation (default 4000)
#
# The point of this script is the design loop: render, LOOK at the PNGs, fix.
set -euo pipefail

target="" out="" dark=0 full=0 wait=4000 sizes=()
while [ $# -gt 0 ]; do
  case "$1" in
    --dark) dark=1 ;;
    --full) full=1 ;;
    --wait) wait="$2"; shift ;;
    [0-9]*x[0-9]*) sizes+=("$1") ;;
    *) if [ -z "$target" ]; then target="$1"; else out="$1"; fi ;;
  esac
  shift
done
[ -n "$target" ] || { sed -n '2,14p' "$0"; exit 2; }
[ ${#sizes[@]} -gt 0 ] || sizes=(390x844 768x1024 1280x800 1920x1080)
out="${out:-.design/shots}"
mkdir -p "$out"

case "$target" in
  http://*|https://*|file://*) url="$target" ;;
  *) url="file://$(cd "$(dirname "$target")" && pwd)/$(basename "$target")" ;;
esac
name="$(basename "${target%%\?*}")"; name="${name%.*}"; name="${name:-page}"

browser=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
  if [ -x "$candidate" ] || command -v "$candidate" >/dev/null 2>&1; then browser="$candidate"; break; fi
done

suffix=""; [ $dark -eq 1 ] && suffix="-dark"
for size in "${sizes[@]}"; do
  w="${size%x*}" h="${size#*x}"
  file="$out/$name-$w$suffix.png"
  if [ $full -eq 1 ] && command -v npx >/dev/null 2>&1; then
    scheme=light; [ $dark -eq 1 ] && scheme=dark
    npx --yes playwright screenshot --channel chrome --full-page --color-scheme "$scheme" \
      --viewport-size "$w,$h" --wait-for-timeout "$wait" "$url" "$file" >/dev/null
  else
    [ -n "$browser" ] || { echo "No Chromium-family browser found. Install one, or use a browser automation tool." >&2; exit 1; }
    if [ $full -eq 1 ]; then
      h=6000
      echo "note: no npx; using a ${h}px-tall window for $size - vh-based layouts will look wrong" >&2
    fi
    # Headless Chrome inherits the OS colour scheme, so the scheme is always forced
    # (0 = dark, 1 = light): a "light" capture on a dark-mode machine is otherwise dark.
    flags=(--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2
           --window-size="$w,$h" --virtual-time-budget="$wait" --screenshot="$file"
           --blink-settings=preferredColorScheme=$((1 - dark)))
    "$browser" "${flags[@]}" "$url" >/dev/null 2>&1
  fi
  echo "$file"
done
