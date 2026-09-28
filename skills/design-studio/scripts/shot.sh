#!/usr/bin/env bash
# Multi-viewport screenshots with no dependencies beyond an installed Chromium-family browser.
# Fallback renderer: prefer capture.mjs (Playwright: true viewports at any width, touch, saved
# login, states, wall/blank detection, contact sheets) whenever Node and Playwright are available.
#
#   shot.sh <url-or-file> [out-dir] [--dark] [--full] [--wait ms] [--dpr n] [--name base] [WxH ...]
#
#   shot.sh page.html                         390x844 768x1024 1280x800 1920x1080 into .design/shots/
#   shot.sh "page.html?state=empty-first" out 390x844 1280x800 -> out/page--state-empty-first-390x844.png ...
#   shot.sh og.html out 1200x630 --dpr 1 --name og-card    -> out/og-card-1200x630.png at 1200x630 px
#
# Output: <out>/<base>[--<query-or-hash>]-<W>x<H>[-dark].png, one path per line on stdout.
#   <base> is the file name without extension unless --name is given; the query or #fragment is
#   slugged into the name so state variants never overwrite each other.
# --dark   emulate prefers-color-scheme: dark (light is forced otherwise: headless Chrome inherits
#          the OS scheme, so an unforced "light" capture on a dark-mode machine comes out dark)
# --full   full-page capture through Playwright (npx, pinned to capture-core's version, system
#          Chrome; always DPR 1). Without npx: a 6000 px tall window, which distorts vh layouts.
# --wait   virtual time budget in ms for fonts, images and entrance animation (default 4000)
# --dpr    device scale factor, integer 1-4 (default 2). Use 1 for exact-pixel artboards (OG images).
#
# Headless Chrome cannot make a window narrower than 500 px, so narrower viewports render inside an
# exactly sized, sandboxed iframe and are cropped (ImageMagick or sips). There is no touch emulation:
# (hover) and (pointer) media queries answer as a desktop. An http(s) target is probed once with curl:
# unreachable fails with exit 2; an HTTP error status is reported (the PNG may show an error or
# challenge page); a site that refuses framing (X-Frame-Options, CSP frame-ancestors) would render as
# Chrome's "refused to connect" page below 500 px, so those sizes are skipped with exit 3.
# Exit: 0 all written, 2 usage, no browser or unreachable, 3 some size could not be captured truthfully.
set -euo pipefail

synopsis='shot.sh <url-or-file> [out-dir] [--dark] [--full] [--wait ms] [--dpr n] [--name base] [WxH ...]'
usage() { awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"; }
die() { echo "shot.sh: $1" >&2; exit "${2:-2}"; }

target="" out="" dark=0 full=0 wait=4000 dpr=2 base="" sizes=()
while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --dark) dark=1 ;;
    --full) full=1 ;;
    --wait|--dpr|--name)
      [ $# -ge 2 ] && [ -n "$2" ] && [ "${2#--}" = "$2" ] || die "$1 needs a value (see --help)"
      case "$1" in
        --wait) [[ "$2" =~ ^[0-9]+$ ]] || die "--wait takes milliseconds, got '$2'"; wait="$2" ;;
        --dpr) [[ "$2" =~ ^[1-4]$ ]] || die "--dpr takes an integer 1-4, got '$2'"; dpr="$2" ;;
        --name) base="$2" ;;
      esac
      shift ;;
    -*) printf 'shot.sh: unknown option %s\nusage: %s\n' "$1" "$synopsis" >&2; exit 2 ;;
    *)
      if [[ "$1" =~ ^[0-9]+x[0-9]+$ ]]; then sizes+=("$1")
      elif [ -z "$target" ]; then target="$1"
      elif [ -z "$out" ]; then out="$1"
      else die "unexpected argument '$1' (sizes look like 390x844)"; fi ;;
  esac
  shift
done
[ -n "$target" ] || { usage; exit 2; }
[ ${#sizes[@]} -gt 0 ] || sizes=(390x844 768x1024 1280x800 1920x1080)
out="${out:-.design/shots}"
mkdir -p "$out"
here="$(cd "$(dirname "$0")" && pwd)"

case "$target" in
  http://*|https://*|file://*) url="$target" ;;
  *)
    path="${target%%[?#]*}" rest="${target#"$path"}"
    [ -e "$path" ] || die "no such file: $path"
    url="file://$(cd "$(dirname "$path")" && pwd)/$(basename "$path")$rest" ;;
esac
if [ -z "$base" ]; then
  page="${target%%[?#]*}"; page="${page%/}"; base="$(basename "$page")"; base="${base%.*}"; base="${base:-page}"
  case "$target" in *[?#]*)
    variant="$(printf '%s' "${target#*[?#]}" | tr -c 'A-Za-z0-9._-' '-' | tr -s '-' | sed 's/^-//; s/-$//' | cut -c1-60)"
    [ -z "$variant" ] || base="$base--$variant" ;;
  esac
fi

browser=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
  if [ -x "$candidate" ] || command -v "$candidate" >/dev/null 2>&1; then browser="$candidate"; break; fi
done

# One GET with a browser UA. Sets http_code and frame_deny (the header that forbids framing) from the
# final response after redirects; both stay empty when curl is missing.
http_code="" frame_deny=""
case "$url" in http://*|https://*)
  if command -v curl >/dev/null 2>&1; then
    rc=0
    headers="$(curl -sSL -o /dev/null -D - --max-time 15 \
      -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" \
      "$url" 2>/dev/null)" || rc=$?
    case $rc in
      0) ;;
      6|7) die "cannot reach $url (curl exit $rc: no such host or connection refused). Is the server running?" ;;
      28) echo "note: $url did not answer within 15 s; captures may show an error page" >&2 ;;
      *) echo "note: curl exit $rc probing $url; captures are unchecked" >&2 ;;
    esac
    parsed="$(printf '%s\n' "$headers" | tr -d '\r' | awk '
      /^HTTP\// { code = $2; xfo = ""; fa = "" }
      tolower($0) ~ /^x-frame-options:/ { xfo = $0 }
      tolower($0) ~ /^content-security-policy:.*frame-ancestors/ && tolower($0) !~ /frame-ancestors[^;]*[ ]\*/ { fa = "content-security-policy: frame-ancestors" }
      END { print code "|" (xfo != "" ? xfo : fa) }')"
    http_code="${parsed%%|*}" frame_deny="${parsed#*|}"
    if [ -n "$http_code" ] && [ "$http_code" -ge 400 ] 2>/dev/null; then
      echo "note: $url answered HTTP $http_code to curl; check the PNGs for an error or challenge page (capture.mjs detects walls)" >&2
    fi
  else
    echo "note: curl not found; reachability and framing of $url are unchecked" >&2
  fi ;;
esac

pw_version="$(sed -n "s/^export const PLAYWRIGHT_VERSION = '\(.*\)';/\1/p" "$here/lib/capture-core.mjs" 2>/dev/null || true)"
pw_version="${pw_version:-1.63.0}"
suffix=""; [ $dark -eq 1 ] && suffix="-dark"
status=0
for size in "${sizes[@]}"; do
  w="${size%x*}" h="${size#*x}"
  file="$out/$base-${w}x$h$suffix.png"
  rm -f "$file"
  if [ $full -eq 1 ] && command -v npx >/dev/null 2>&1; then
    scheme=light; [ $dark -eq 1 ] && scheme=dark
    npx --yes "playwright@$pw_version" screenshot --channel chrome --full-page --color-scheme "$scheme" \
      --viewport-size "$w,$h" --wait-for-timeout "$wait" "$url" "$file" >/dev/null \
      || { echo "shot.sh: playwright screenshot failed for $size" >&2; status=3; continue; }
  else
    [ -n "$browser" ] || die "no Chromium-family browser found; install Chrome, or use capture.mjs (Playwright)"
    win_w="$w" win_h="$h" shot_url="$url" wrapper=""
    if [ $full -eq 1 ]; then
      win_h=6000
      echo "note: no npx; using a ${win_h}px-tall window for $size - vh-based layouts will look wrong" >&2
    fi
    if [ "$w" -lt 500 ] && [ $full -eq 0 ]; then
      if [ -n "$frame_deny" ]; then
        echo "shot.sh: $url refuses to be framed ($frame_deny), so it cannot be rendered narrower than 500 px here." >&2
        echo "  Skipped $size. Use: node $here/capture.mjs \"$url\" --viewports $size (true $w px viewport)" >&2
        status=3; continue
      fi
      # The iframe sits at (1,1) because sips ignores a crop offset of 0 0 (it centres the crop instead),
      # so every crop starts at (dpr,dpr) device px. sandbox blocks frame-busting scripts from navigating
      # the wrapper away (headers are checked above; scripts cannot be).
      wrapper="$out/.shot-wrapper-$w-$$.html"
      printf '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}iframe{position:absolute;left:1px;top:1px;border:0;width:%spx;height:%spx}</style><iframe sandbox="allow-scripts allow-same-origin allow-forms" src="%s"></iframe>' "$w" "$h" "$url" > "$wrapper"
      shot_url="file://$(cd "$out" && pwd)/$(basename "$wrapper")" win_w=500 win_h=$((h + 1))
    fi
    flags=(--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor="$dpr"
           --window-size="$win_w,$win_h" --virtual-time-budget="$wait" --screenshot="$file"
           --blink-settings=preferredColorScheme=$((1 - dark)))
    "$browser" "${flags[@]}" "$shot_url" >/dev/null 2>&1 || true
    [ -z "$wrapper" ] || rm -f "$wrapper"
    [ -s "$file" ] || { echo "shot.sh: Chrome wrote no screenshot for $size" >&2; status=3; continue; }
    if [ -n "$wrapper" ]; then
      cw=$((w * dpr)) ch=$((h * dpr))
      if command -v magick >/dev/null 2>&1; then magick "$file" -crop "${cw}x${ch}+${dpr}+${dpr}" +repage "$file"
      elif command -v convert >/dev/null 2>&1; then convert "$file" -crop "${cw}x${ch}+${dpr}+${dpr}" +repage "$file"
      elif command -v sips >/dev/null 2>&1; then sips -c "$ch" "$cw" --cropOffset "$dpr" "$dpr" "$file" >/dev/null
      else echo "note: $file is 500 px wide; the page occupies $w px from the left (no crop tool found)" >&2; fi
    fi
  fi
  echo "$file"
done
exit $status
