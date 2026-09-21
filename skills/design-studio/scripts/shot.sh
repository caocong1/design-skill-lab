#!/usr/bin/env bash
# Multi-viewport screenshots of a URL or a local HTML file, with no dependencies
# beyond an installed Chromium-family browser.
#
#   shot.sh <url-or-file> [out-dir] [--dark] [--full] [--wait ms] [WxH ...]
#
# Default viewports: 390x844 768x1024 1280x800 1920x1080 (device scale factor 2).
# Headless Chrome cannot make a window narrower than 500 px, so narrower
# viewports are rendered inside an exactly sized iframe and cropped. Remote pages
# that forbid framing need Playwright (--full) or a browser automation tool.
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
    shot_url="$url" win_w="$w"
    if [ "$w" -lt 500 ] && [ $full -eq 0 ]; then
      # A --window-size below 500 still lays the page out at 500 px. An iframe gives a true viewport.
      wrapper="$out/.shot-wrapper-$w.html"
      printf '<!doctype html><meta charset="utf-8"><style>html,body{margin:0}iframe{border:0;display:block;width:%spx;height:%spx}</style><iframe src="%s"></iframe>' "$w" "$h" "$url" > "$wrapper"
      shot_url="file://$(cd "$out" && pwd)/.shot-wrapper-$w.html" win_w=500
    fi
    flags=(--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2
           --window-size="$win_w,$h" --virtual-time-budget="$wait" --screenshot="$file"
           --blink-settings=preferredColorScheme=$((1 - dark)))
    "$browser" "${flags[@]}" "$shot_url" >/dev/null 2>&1
    if [ "$win_w" != "$w" ]; then
      rm -f "$wrapper"
      if command -v magick >/dev/null 2>&1; then magick "$file" -crop "$((w * 2))x$((h * 2))+0+0" +repage "$file"
      elif command -v convert >/dev/null 2>&1; then convert "$file" -crop "$((w * 2))x$((h * 2))+0+0" +repage "$file"
      elif command -v sips >/dev/null 2>&1; then sips -c "$((h * 2))" "$((w * 2))" --cropOffset 1 1 "$file" >/dev/null 2>&1
      else echo "note: $file is 500 px wide; the page occupies the left $w px (no crop tool found)" >&2; fi
    fi
  fi
  echo "$file"
done
