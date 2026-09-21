#!/usr/bin/env python3
"""Colour arithmetic for design work. Standard library only.

Colour maths is where language models are weakest and scripts are strongest:
contrast ratios and perceptually even scales are computed here, never guessed.

Usage:
  color_tools.py contrast <fg> <bg> [<fg> <bg> ...]
  color_tools.py matrix --fg <c1,c2,...> --bg <c1,c2,...>
  color_tools.py scale <seed> [--name blue] [--neutral] [--dark] [--no-anchor] [--format css|json|table]
  color_tools.py convert <colour> [...]

Colours: #rgb, #rrggbb, #rrggbbaa, rgb(r g b / a), rgb(r,g,b), oklch(L C H / a).
L in oklch() may be 0-1 or a percentage.
"""
import argparse
import json
import math
import re
import sys

# --- parsing -----------------------------------------------------------------

def _clamp01(x):
    return max(0.0, min(1.0, x))


def parse(text):
    """Return (r, g, b, a) as sRGB floats in 0-1."""
    s = text.strip().lower()
    if s.startswith('#'):
        h = s[1:]
        if len(h) in (3, 4):
            h = ''.join(c * 2 for c in h)
        if len(h) not in (6, 8) or not re.fullmatch(r'[0-9a-f]+', h):
            raise ValueError(f'bad hex colour: {text}')
        r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return r, g, b, a
    m = re.fullmatch(r'(rgba?|oklch)\((.*)\)', s)
    if not m:
        raise ValueError(f'unsupported colour syntax: {text}')
    fn, body = m.groups()
    parts = [p for p in re.split(r'[\s,/]+', body.strip()) if p]

    def num(p, scale=1.0):
        return float(p[:-1]) / 100 * scale if p.endswith('%') else float(p)

    a = num(parts[3]) if len(parts) > 3 else 1.0
    if fn.startswith('rgb'):
        r, g, b = (num(p, 255) / 255 for p in parts[:3])
        return _clamp01(r), _clamp01(g), _clamp01(b), a
    L = num(parts[0])
    C = num(parts[1], 0.4)
    H = float(parts[2].replace('deg', ''))
    r, g, b = oklch_to_srgb(L, C, H)
    return _clamp01(r), _clamp01(g), _clamp01(b), a


def composite(fg, bg):
    """Flatten a translucent foreground over an opaque background."""
    r, g, b, a = fg
    br, bg_, bb, _ = bg
    return (r * a + br * (1 - a), g * a + bg_ * (1 - a), b * a + bb * (1 - a), 1.0)


def to_hex(rgb):
    return '#' + ''.join(f'{round(_clamp01(c) * 255):02x}' for c in rgb[:3])

# --- sRGB <-> OKLCH (Bjorn Ottosson's OKLab) -----------------------------------

def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def _cbrt(x):
    return math.copysign(abs(x) ** (1 / 3), x)


def srgb_to_oklch(r, g, b):
    r, g, b = _lin(r), _lin(g), _lin(b)
    l = _cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(A, B), math.degrees(math.atan2(B, A)) % 360


def _oklch_to_linear(L, C, H):
    A, B = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
    m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
    s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def in_gamut(L, C, H, eps=1e-4):
    return all(-eps <= c <= 1 + eps for c in _oklch_to_linear(L, C, H))


def fit_chroma(L, C, H):
    """Largest chroma <= C that stays inside sRGB at this lightness and hue."""
    if in_gamut(L, C, H):
        return C
    lo, hi = 0.0, C
    for _ in range(24):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if in_gamut(L, mid, H) else (lo, mid)
    return lo


def oklch_to_srgb(L, C, H):
    C = fit_chroma(L, C, H)
    return tuple(_gam(_clamp01(c)) for c in _oklch_to_linear(L, C, H))

# --- contrast ------------------------------------------------------------------

def wcag_ratio(fg, bg):
    def lum(c):
        return 0.2126 * _lin(c[0]) + 0.7152 * _lin(c[1]) + 0.0722 * _lin(c[2])
    a, b = lum(fg), lum(bg)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def apca_lc(fg, bg):
    """APCA-W3 0.0.98G-4g lightness contrast. Informational: APCA is part of a
    WCAG 3 draft, not a normative requirement."""
    def y(c):
        v = sum(k * (ch ** 2.4) for k, ch in zip((0.2126729, 0.7151522, 0.0721750), c[:3]))
        return v if v > 0.022 else v + (0.022 - v) ** 1.414
    yt, yb = y(fg), y(bg)
    if abs(yb - yt) < 0.0005:
        return 0.0
    if yb > yt:
        sapc = (yb ** 0.56 - yt ** 0.57) * 1.14
        return 0.0 if sapc < 0.1 else (sapc - 0.027) * 100
    sapc = (yb ** 0.65 - yt ** 0.62) * 1.14
    return 0.0 if sapc > -0.1 else (sapc + 0.027) * 100


def verdict(ratio):
    if ratio >= 7:
        return 'AAA text'
    if ratio >= 4.5:
        return 'AA text'
    if ratio >= 3:
        return 'AA large text / UI only'
    return 'FAIL'


def cmd_contrast(args):
    if len(args.colours) % 2:
        sys.exit('contrast needs pairs: <fg> <bg> [<fg> <bg> ...]')
    failed = False
    for i in range(0, len(args.colours), 2):
        bg = parse(args.colours[i + 1])
        fg = composite(parse(args.colours[i]), bg)
        ratio = wcag_ratio(fg, bg)
        failed |= ratio < args.min
        print(f'{args.colours[i]} on {args.colours[i + 1]}: '
              f'{ratio:.2f}:1  {verdict(ratio)}  (APCA Lc {apca_lc(fg, bg):.0f})')
    sys.exit(1 if failed else 0)


def cmd_matrix(args):
    fgs, bgs = args.fg.split(','), args.bg.split(',')
    print('| fg \\ bg | ' + ' | '.join(bgs) + ' |')
    print('| --- |' + ' --- |' * len(bgs))
    for f in fgs:
        cells = []
        for b in bgs:
            bg = parse(b)
            ratio = wcag_ratio(composite(parse(f), bg), bg)
            cells.append(f'{ratio:.2f} {"ok" if ratio >= args.min else "FAIL"}')
        print(f'| {f} | ' + ' | '.join(cells) + ' |')

# --- tonal scale ---------------------------------------------------------------

STEPS = (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
LIGHTNESS = (0.975, 0.935, 0.885, 0.815, 0.715, 0.625, 0.550, 0.485, 0.420, 0.370, 0.280)
CHROMA = (0.06, 0.13, 0.24, 0.43, 0.67, 0.87, 1.00, 0.99, 0.81, 0.60, 0.37)


def build_scale(seed, neutral=False, dark=False, anchor=True):
    L0, C0, H = srgb_to_oklch(*parse(seed)[:3])
    peak = min(C0, 0.02) if neutral else max(C0, 0.04)
    rows = []
    for step, L, k in zip(STEPS, LIGHTNESS, CHROMA):
        rows.append([step, L, peak * (max(k, 0.5) if neutral else k)])
    if anchor and not neutral:
        nearest = min(rows, key=lambda r: abs(r[1] - L0))
        nearest[1], nearest[2] = L0, C0
    if dark:
        # Dark surfaces read top-down from darkest; keep step names, mirror lightness.
        for row, L in zip(rows, reversed([r[1] for r in rows])):
            row[1] = L
    out = []
    for step, L, C in rows:
        C = fit_chroma(L, C, H)
        out.append({'step': step, 'hex': to_hex(oklch_to_srgb(L, C, H)),
                    'oklch': f'oklch({L:.3f} {C:.3f} {H:.1f})'})
    return out


def cmd_scale(args):
    scale = build_scale(args.seed, args.neutral, args.dark, not args.no_anchor)
    if args.format == 'json':
        print(json.dumps({args.name: {str(s['step']): s for s in scale}}, indent=2))
    elif args.format == 'css':
        for s in scale:
            print(f'  --{args.name}-{s["step"]}: {s["oklch"]}; /* {s["hex"]} */')
    else:
        white, black = parse('#fff'), parse('#000')
        print('| step | hex | oklch | vs white | vs black |')
        print('| --- | --- | --- | --- | --- |')
        for s in scale:
            c = parse(s['hex'])
            print(f'| {s["step"]} | {s["hex"]} | {s["oklch"]} | '
                  f'{wcag_ratio(c, white):.2f} | {wcag_ratio(c, black):.2f} |')


def cmd_convert(args):
    for text in args.colours:
        r, g, b, a = parse(text)
        L, C, H = srgb_to_oklch(r, g, b)
        alpha = '' if a == 1 else f' / {a:.2f}'
        print(f'{text}: {to_hex((r, g, b))}  oklch({L:.3f} {C:.3f} {H:.1f}{alpha})')


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)

    c = sub.add_parser('contrast', help='WCAG 2.x ratio (and APCA Lc) for fg/bg pairs')
    c.add_argument('colours', nargs='+')
    c.add_argument('--min', type=float, default=4.5, help='exit 1 if any pair is below this ratio')
    c.set_defaults(fn=cmd_contrast)

    m = sub.add_parser('matrix', help='contrast table for every fg x bg')
    m.add_argument('--fg', required=True)
    m.add_argument('--bg', required=True)
    m.add_argument('--min', type=float, default=4.5)
    m.set_defaults(fn=cmd_matrix)

    s = sub.add_parser('scale', help='perceptually even 11-step tonal scale from a seed')
    s.add_argument('seed')
    s.add_argument('--name', default='brand')
    s.add_argument('--neutral', action='store_true', help='low-chroma neutral tinted with the seed hue')
    s.add_argument('--dark', action='store_true', help='mirror lightness for a dark-mode scale')
    s.add_argument('--no-anchor', action='store_true', help='do not pin the seed onto its nearest step')
    s.add_argument('--format', choices=('table', 'css', 'json'), default='table')
    s.set_defaults(fn=cmd_scale)

    v = sub.add_parser('convert', help='show hex and oklch() for colours')
    v.add_argument('colours', nargs='+')
    v.set_defaults(fn=cmd_convert)

    args = p.parse_args()
    args.fn(args)


if __name__ == '__main__':
    main()
