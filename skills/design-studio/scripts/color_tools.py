#!/usr/bin/env python3
"""Colour arithmetic for design work. Python standard library only.

Contrast, scales and colour-vision checks are computed here, never estimated.

Usage:
  color_tools.py contrast <fg> <bg> [<fg> <bg> ...] [--min 4.5]
  color_tools.py matrix --fg <c1,c2,...> --bg <c1,c2,...> [--min 4.5] [--apca]
  color_tools.py matrix --from tokens.css [--mode light|dark|both] [--text G] [--ui G] [--surface G] [--json]
  color_tools.py scale <seed> [--name blue] [--neutral] [--dark] [--no-anchor] [--format table|css|json]
  color_tools.py convert <colour> [...]
  color_tools.py cvd <colour|name=colour> [...] [--type protan,deutan,tritan] [--severity 1] [--min-de 0.06]
  color_tools.py <command> --help      options of one command

Colours: #rgb #rgba #rrggbb #rrggbbaa, CSS names (white, rebeccapurple, transparent), rgb()/rgba(),
hsl()/hsla(), hwb(), oklch(), oklab(), lab(), lch(), color(srgb|srgb-linear|display-p3|xyz|xyz-d50 ...),
color-mix(in srgb|srgb-linear|oklab|oklch|xyz, <c1> [p%], <c2> [p%]). Legacy commas and modern
space/slash syntax, percentages and `none` are accepted. Colours outside sRGB are clipped per channel,
as browsers show them on sRGB screens; convert also prints the in-gamut OKLCH equivalent. Quote
colours in the shell: "oklch(0.6 0.15 250)".

contrast  WCAG 2.x ratio per pair, a verdict, and APCA Lc. A translucent foreground is composited on its
          background. Exit 1 when a pair is below --min: 4.5 body text, 3 for large text (>= 24px, or
          >= 18.66px bold) and UI boundaries/icons (WCAG 2.2 SC 1.4.3 / 1.4.11).
matrix    Every fg x bg ratio. With --from, reads custom properties from a CSS file (var() chains,
          light-dark(), .dark / [data-theme=dark] / prefers-color-scheme blocks, bare shadcn-style
          "H S% L%" triplets), classifies colour roles by name and prints one matrix per mode:
            text roles    (text, fg, foreground, ink, link, placeholder, on-surface)  need 4.5 on surfaces
            ui roles      (focus, ring, icon, input, control, outline, *-strong borders) need 3 on surfaces
            on-X roles    (on-accent, primary-foreground, accent-fg)            need 4.5 on X and X-hover...
            decor roles   (border, border-subtle, divider, separator, outline-variant)   shown, no minimum
            fill roles    (accent, primary, danger...) shown on surfaces, no minimum: check the ones you
                          use as text (4.5) or as icons and boundaries (3)
            surfaces      (bg, background, surface, canvas, card, popover, muted, *-subtle...)
          Tokens whose name ends in a number (--p-neutral-9, --blue-500) are primitives and are skipped.
          Force a class with globs: --text 'brand-ink' --ui 'chip-edge*' --surface 'hero*'.
          Exit 1 when a required pair fails.
scale     11-step OKLCH tonal scale (50-950) from a seed. Chroma follows the sRGB gamut boundary at each
          lightness, scaled by the seed's relative chroma, so yellows and cyans stay bright near their
          natural lightness instead of spiking and collapsing. Light steps lighter than the seed are
          capped at C 0.02 / 0.05 / 0.085 / 0.12 (50 / 100 / 200 / 300), so green, lime and yellow
          backgrounds stay soft instead of neon. The seed is pinned to its nearest step
          (--no-anchor to skip). --dark mirrors the lightness ladder (50 = darkest) and pins the seed
          after mirroring, so its hex is in the output. --neutral makes a low-chroma tinted neutral.
convert   Hex and oklch() for each colour; flags input outside sRGB.
cvd       Simulates protanopia and deuteranopia (Vienot 1999) and tritanopia (Brettel 1997) - the
          libDaltonLens choices, public domain - on linear sRGB, and lists pairs whose OKLab distance
          drops below --min-de (0.02 is one just-noticeable difference; default 0.06). Pairs already too
          close in normal vision are listed as "normal". --severity < 1 approximates anomalous
          trichromacy. Exit 1 when a pair is confusable: separate it by lightness or add a non-colour
          cue (label, shape, pattern).

Exit: 0 all checks pass, 1 a pair fails (contrast, matrix, cvd), 2 unreadable colour, file or usage.

Status (2026-09): the WCAG 2.x ratio is the conformance number (WCAG 2.2 = ISO/IEC 40500:2025).
APCA Lc is informational only: APCA is not normative and is not in the current WCAG 3 Working Draft,
whose contrast measure is still undecided. Report both; never substitute APCA for the ratio.
"""
import argparse
import fnmatch
import json
import math
import re
import sys


class ColourError(ValueError):
    """A colour or token the tool cannot read; reported without a traceback."""


SYNTAXES = ('#hex, a CSS colour name, rgb(), hsl(), hwb(), oklch(), oklab(), lab(), lch(), '
            'color(srgb|srgb-linear|display-p3|xyz ...) or color-mix()')

# --- CSS named colours (CSS Color 4) ---------------------------------------------------------------

_NAMES = """
aliceblue f0f8ff antiquewhite faebd7 aqua 00ffff aquamarine 7fffd4 azure f0ffff beige f5f5dc
bisque ffe4c4 black 000000 blanchedalmond ffebcd blue 0000ff blueviolet 8a2be2 brown a52a2a
burlywood deb887 cadetblue 5f9ea0 chartreuse 7fff00 chocolate d2691e coral ff7f50
cornflowerblue 6495ed cornsilk fff8dc crimson dc143c cyan 00ffff darkblue 00008b darkcyan 008b8b
darkgoldenrod b8860b darkgray a9a9a9 darkgreen 006400 darkgrey a9a9a9 darkkhaki bdb76b
darkmagenta 8b008b darkolivegreen 556b2f darkorange ff8c00 darkorchid 9932cc darkred 8b0000
darksalmon e9967a darkseagreen 8fbc8f darkslateblue 483d8b darkslategray 2f4f4f
darkslategrey 2f4f4f darkturquoise 00ced1 darkviolet 9400d3 deeppink ff1493 deepskyblue 00bfff
dimgray 696969 dimgrey 696969 dodgerblue 1e90ff firebrick b22222 floralwhite fffaf0
forestgreen 228b22 fuchsia ff00ff gainsboro dcdcdc ghostwhite f8f8ff gold ffd700 goldenrod daa520
gray 808080 green 008000 greenyellow adff2f grey 808080 honeydew f0fff0 hotpink ff69b4
indianred cd5c5c indigo 4b0082 ivory fffff0 khaki f0e68c lavender e6e6fa lavenderblush fff0f5
lawngreen 7cfc00 lemonchiffon fffacd lightblue add8e6 lightcoral f08080 lightcyan e0ffff
lightgoldenrodyellow fafad2 lightgray d3d3d3 lightgreen 90ee90 lightgrey d3d3d3 lightpink ffb6c1
lightsalmon ffa07a lightseagreen 20b2aa lightskyblue 87cefa lightslategray 778899
lightslategrey 778899 lightsteelblue b0c4de lightyellow ffffe0 lime 00ff00 limegreen 32cd32
linen faf0e6 magenta ff00ff maroon 800000 mediumaquamarine 66cdaa mediumblue 0000cd
mediumorchid ba55d3 mediumpurple 9370db mediumseagreen 3cb371 mediumslateblue 7b68ee
mediumspringgreen 00fa9a mediumturquoise 48d1cc mediumvioletred c71585 midnightblue 191970
mintcream f5fffa mistyrose ffe4e1 moccasin ffe4b5 navajowhite ffdead navy 000080 oldlace fdf5e6
olive 808000 olivedrab 6b8e23 orange ffa500 orangered ff4500 orchid da70d6 palegoldenrod eee8aa
palegreen 98fb98 paleturquoise afeeee palevioletred db7093 papayawhip ffefd5 peachpuff ffdab9
peru cd853f pink ffc0cb plum dda0dd powderblue b0e0e6 purple 800080 rebeccapurple 663399
red ff0000 rosybrown bc8f8f royalblue 4169e1 saddlebrown 8b4513 salmon fa8072 sandybrown f4a460
seagreen 2e8b57 seashell fff5ee sienna a0522d silver c0c0c0 skyblue 87ceeb slateblue 6a5acd
slategray 708090 slategrey 708090 snow fffafa springgreen 00ff7f steelblue 4682b4 tan d2b48c
teal 008080 thistle d8bfd8 tomato ff6347 turquoise 40e0d0 violet ee82ee wheat f5deb3
white ffffff whitesmoke f5f5f5 yellow ffff00 yellowgreen 9acd32
""".split()
NAMED = dict(zip(_NAMES[::2], _NAMES[1::2]))

# --- colour spaces ----------------------------------------------------------------------------------

def _clamp01(x):
    return max(0.0, min(1.0, x))


def _lin(c):
    return math.copysign(abs(c) / 12.92 if abs(c) <= 0.04045 else ((abs(c) + 0.055) / 1.055) ** 2.4, c)


def _gam(c):
    return math.copysign(12.92 * abs(c) if abs(c) <= 0.0031308 else 1.055 * abs(c) ** (1 / 2.4) - 0.055, c)


def _cbrt(x):
    return math.copysign(abs(x) ** (1 / 3), x)


def _mul(m, v):
    return tuple(sum(m[i][j] * v[j] for j in range(3)) for i in range(3))


# Matrices from CSS Color 4 sample code.
XYZ65_TO_LIN = ((3.2409699419045226, -1.537383177570094, -0.4986107602930034),
                (-0.9692436362808796, 1.8759675015077202, 0.04155505740717559),
                (0.05563007969699366, -0.20397695888897652, 1.0569715142428786))
LIN_TO_XYZ65 = ((0.41239079926595934, 0.357584339383878, 0.1804807884018343),
                (0.21263900587151027, 0.715168678767756, 0.07219231536073371),
                (0.01933081871559182, 0.11919477979462598, 0.9505321522496607))
P3_TO_XYZ65 = ((0.4865709486482162, 0.26566769316909306, 0.1982172852343625),
               (0.2289745640697488, 0.6917385218365064, 0.079286914093745),
               (0.0, 0.04511338185890264, 1.043944368900976))
D50_TO_D65 = ((0.955473421488075, -0.02309845494876471, 0.06325924320057072),
              (-0.0283697093338637, 1.0099953980813041, 0.021041441191917323),
              (0.012314014864481998, -0.020507649298898964, 1.330365926242124))
D50_WHITE = (0.3457 / 0.3585, 1.0, (1 - 0.3457 - 0.3585) / 0.3585)


def lin_to_oklab(r, g, b):
    l = _cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


def oklab_to_lin(L, A, B):
    l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
    m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
    s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def _lch_to_lab(L, C, H):
    return L, C * math.cos(math.radians(H)), C * math.sin(math.radians(H))


def _lab_to_lch(L, A, B):
    return L, math.hypot(A, B), math.degrees(math.atan2(B, A)) % 360


def srgb_to_oklch(r, g, b):
    return _lab_to_lch(*lin_to_oklab(_lin(r), _lin(g), _lin(b)))


def cielab_to_lin(L, a, b):
    k, e = 24389 / 27, 216 / 24389
    f1 = (L + 16) / 116
    f0, f2 = a / 500 + f1, f1 - b / 200
    x = f0 ** 3 if f0 ** 3 > e else (116 * f0 - 16) / k
    y = f1 ** 3 if L > k * e else L / k
    z = f2 ** 3 if f2 ** 3 > e else (116 * f2 - 16) / k
    xyz50 = tuple(v * w for v, w in zip((x, y, z), D50_WHITE))
    return _mul(XYZ65_TO_LIN, _mul(D50_TO_D65, xyz50))


def in_gamut(L, C, H, eps=1e-4):
    return all(-eps <= c <= 1 + eps for c in oklab_to_lin(*_lch_to_lab(L, C, H)))


def fit_chroma(L, C, H):
    """Largest chroma <= C that stays inside sRGB at this lightness and hue."""
    if in_gamut(L, C, H):
        return C
    lo, hi = 0.0, C
    for _ in range(24):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if in_gamut(L, mid, H) else (lo, mid)
    return lo


def max_chroma(L, H):
    return fit_chroma(L, 0.5, H)


def oklch_to_srgb(L, C, H):
    L = _clamp01(L)
    lin = oklab_to_lin(*_lch_to_lab(L, fit_chroma(L, C, H), H))
    return tuple(_clamp01(_gam(_clamp01(c))) for c in lin)


def to_hex(rgb):
    return '#' + ''.join(f'{round(_clamp01(c) * 255):02x}' for c in rgb[:3])


def oklch_text(rgb):
    L, C, H = srgb_to_oklch(*rgb[:3])
    return f'oklch({L:.3f} {C:.3f} {H if C > 1e-4 else 0:.1f})'

# --- parsing ----------------------------------------------------------------------------------------

def split_top(text, sep=','):
    """Split on sep outside parentheses."""
    out, depth, cur = [], 0, ''
    for ch in text:
        depth += (ch == '(') - (ch == ')')
        if ch == sep and depth == 0:
            out.append(cur.strip())
            cur = ''
        else:
            cur += ch
    return out + [cur.strip()] if cur.strip() else out


def _num(p, pct=1.0):
    if p == 'none':
        return 0.0
    try:
        return float(p[:-1]) / 100 * pct if p.endswith('%') else float(p)
    except ValueError:
        raise ColourError(f'not a number: {p!r}') from None


def _hue(p):
    units = {'deg': 1, 'grad': 0.9, 'rad': 180 / math.pi, 'turn': 360}
    for u, k in units.items():
        if p.endswith(u):
            return _num(p[:-len(u)]) * k
    return _num(p)


def _components(body):
    body = body.strip()
    if ',' in body:
        parts = [p.strip() for p in body.split(',')]
        return parts[:3], (parts[3] if len(parts) > 3 else None)
    left, _, alpha = body.partition('/')
    return left.split(), (alpha.strip() or None)


def _hsl_to_srgb(h, s, l):
    def f(n):
        k = (n + h / 30) % 12
        return l - s * min(l, 1 - l) * max(-1, min(k - 3, 9 - k, 1))
    return f(0), f(8), f(4)


def _to_linear(fn, comps):
    """Linear-light sRGB (may be outside 0-1) from a colour function's components."""
    if fn in ('rgb', 'rgba'):
        return tuple(_lin(_num(p, 255) / 255) for p in comps)
    if fn in ('hsl', 'hsla'):
        h, s, l = _hue(comps[0]), _num(comps[1].rstrip('%')) / 100, _num(comps[2].rstrip('%')) / 100
        return tuple(_lin(c) for c in _hsl_to_srgb(h, _clamp01(s), _clamp01(l)))
    if fn == 'hwb':
        h, w, b = _hue(comps[0]), _num(comps[1].rstrip('%')) / 100, _num(comps[2].rstrip('%')) / 100
        if w + b >= 1:
            return (_lin(w / (w + b)),) * 3
        return tuple(_lin(c * (1 - w - b) + w) for c in _hsl_to_srgb(h, 1, 0.5))
    if fn == 'oklab':
        return oklab_to_lin(_num(comps[0]), _num(comps[1], 0.4), _num(comps[2], 0.4))
    if fn == 'oklch':
        return oklab_to_lin(*_lch_to_lab(_num(comps[0]), _num(comps[1], 0.4), _hue(comps[2])))
    if fn == 'lab':
        return cielab_to_lin(_num(comps[0], 100), _num(comps[1], 125), _num(comps[2], 125))
    if fn == 'lch':
        return cielab_to_lin(*_lch_to_lab(_num(comps[0], 100), _num(comps[1], 150), _hue(comps[2])))
    raise ColourError(f'unsupported colour function {fn}(); expected {SYNTAXES}')


def _color_fn(body):
    parts, alpha = body.split('/')[0].split(), (body.split('/')[1].strip() if '/' in body else None)
    space, vals = parts[0], [_num(p, 1.0) for p in parts[1:4]]
    if len(vals) != 3:
        raise ColourError(f'color() needs a space and three values: color({body})')
    if space == 'srgb':
        lin = tuple(_lin(v) for v in vals)
    elif space == 'srgb-linear':
        lin = tuple(vals)
    elif space == 'display-p3':
        lin = _mul(XYZ65_TO_LIN, _mul(P3_TO_XYZ65, [_lin(v) for v in vals]))
    elif space in ('xyz', 'xyz-d65'):
        lin = _mul(XYZ65_TO_LIN, vals)
    elif space == 'xyz-d50':
        lin = _mul(XYZ65_TO_LIN, _mul(D50_TO_D65, vals))
    else:
        raise ColourError(f'unsupported color() space {space!r}; use srgb, srgb-linear, display-p3, xyz or xyz-d50')
    return lin, alpha


def _finish(lin, alpha):
    """Linear sRGB -> gamma sRGB. Out-of-gamut input is clipped per channel, as browsers render it on
    sRGB screens. Returns ((r, g, b, a), out_of_gamut)."""
    a = 1.0 if alpha is None else _clamp01(_num(alpha))
    outside = not all(-1e-4 <= c <= 1 + 1e-4 for c in lin)
    return tuple(_clamp01(_gam(_clamp01(c))) for c in lin) + (a,), outside


def gamut_mapped(text):
    """The in-gamut equivalent of a colour: chroma reduced in OKLCH at constant lightness and hue."""
    s = ' '.join(str(text).strip().lower().split())
    m = re.fullmatch(r'(oklch|oklab|lab|lch|color)\((.*)\)', s)
    if m and m.group(1) == 'color':
        lin, _ = _color_fn(m.group(2))
    elif m:
        lin = _to_linear(m.group(1), _components(m.group(2))[0])
    else:
        return None
    return oklch_to_srgb(*_lab_to_lch(*lin_to_oklab(*lin)))


def parse_full(text):
    """Return ((r, g, b, a) gamma sRGB floats 0-1, gamut_mapped)."""
    s = ' '.join(str(text).strip().lower().split())
    if not s:
        raise ColourError('empty colour')
    if s in NAMED:
        s = '#' + NAMED[s]
    if s == 'transparent':
        return (0.0, 0.0, 0.0, 0.0), False
    if s.startswith('#'):
        h = s[1:]
        if len(h) in (3, 4):
            h = ''.join(c * 2 for c in h)
        if len(h) not in (6, 8) or not re.fullmatch(r'[0-9a-f]+', h):
            raise ColourError(f'bad hex colour: {text!r}')
        r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
        return (r, g, b, int(h[6:8], 16) / 255 if len(h) == 8 else 1.0), False
    m = re.fullmatch(r'([a-z-]+)\((.*)\)', s)
    if not m:
        hint = ' (currentColor exists only in a page)' if s == 'currentcolor' else ''
        raise ColourError(f'cannot read colour {text!r}{hint}; expected {SYNTAXES}')
    fn, body = m.groups()
    if fn == 'var' or 'var(' in body:
        raise ColourError(f'{text!r} uses var(); resolve it first, or use: matrix --from <file.css>')
    if fn == 'light-dark':
        raise ColourError(f'{text!r} depends on the colour scheme; use: matrix --from <file.css>')
    if body.startswith('from '):
        raise ColourError(f'relative colour syntax is not evaluated: {text!r}')
    if fn == 'color-mix':
        return _color_mix(body)
    if fn == 'color':
        return _finish(*_color_fn(body))
    comps, alpha = _components(body)
    if len(comps) != 3:
        raise ColourError(f'{fn}() needs three components: {text!r}')
    return _finish(_to_linear(fn, comps), alpha)


def parse(text):
    return parse_full(text)[0]


def _color_mix(body):
    parts = split_top(body)
    if len(parts) != 3 or not parts[0].startswith('in '):
        raise ColourError(f'color-mix() needs "in <space>, <colour> [p%], <colour> [p%]": color-mix({body})')
    space = parts[0].split()[1]
    cols, pcts = [], []
    for part in parts[1:]:
        m = re.fullmatch(r'(?:([\d.]+)%\s+)?(.+?)(?:\s+([\d.]+)%)?', part)
        cols.append(parse(m.group(2)))
        p = m.group(1) or m.group(3)
        pcts.append(float(p) if p else None)
    p1, p2 = pcts
    if p1 is None and p2 is None:
        p1 = p2 = 50.0
    p1 = 100 - p2 if p1 is None else p1
    p2 = 100 - p1 if p2 is None else p2
    total = p1 + p2
    if total <= 0:
        raise ColourError('color-mix() percentages sum to zero')
    t, alpha_mult = p2 / total, min(total, 100) / 100

    def coords(c):
        lin = tuple(_lin(v) for v in c[:3])
        if space == 'srgb':
            return list(c[:3])
        if space == 'srgb-linear':
            return list(lin)
        if space in ('xyz', 'xyz-d65'):
            return list(_mul(LIN_TO_XYZ65, lin))
        if space == 'oklab':
            return list(lin_to_oklab(*lin))
        if space == 'oklch':
            return list(_lab_to_lch(*lin_to_oklab(*lin)))
        raise ColourError(f'color-mix() space {space!r} is not supported; use srgb, srgb-linear, oklab, oklch or xyz')

    (c1, a1), (c2, a2) = (coords(cols[0]), cols[0][3]), (coords(cols[1]), cols[1][3])
    hue = space == 'oklch'
    if hue:
        if c1[1] < 1e-6:
            c1[2] = c2[2]
        if c2[1] < 1e-6:
            c2[2] = c1[2]
        d = (c2[2] - c1[2] + 180) % 360 - 180
        c2[2] = c1[2] + d
    a = a1 * (1 - t) + a2 * t
    mixed = []
    for i in range(3):
        if hue and i == 2:
            mixed.append((c1[i] * (1 - t) + c2[i] * t) % 360)
        else:
            v = c1[i] * a1 * (1 - t) + c2[i] * a2 * t
            mixed.append(v / a if a else 0.0)
    if space == 'srgb':
        lin = tuple(_lin(v) for v in mixed)
    elif space == 'srgb-linear':
        lin = tuple(mixed)
    elif space in ('xyz', 'xyz-d65'):
        lin = _mul(XYZ65_TO_LIN, mixed)
    elif space == 'oklab':
        lin = oklab_to_lin(*mixed)
    else:
        lin = oklab_to_lin(*_lch_to_lab(*mixed))
    return _finish(lin, str(a * alpha_mult))


def composite(fg, bg):
    """Flatten a translucent colour over an opaque one."""
    r, g, b, a = fg
    return (r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a), 1.0)

# --- contrast ---------------------------------------------------------------------------------------

def wcag_ratio(fg, bg):
    def lum(c):
        return 0.2126 * _lin(c[0]) + 0.7152 * _lin(c[1]) + 0.0722 * _lin(c[2])
    a, b = lum(fg), lum(bg)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def apca_lc(fg, bg):
    """APCA-W3 0.0.98G-4g lightness contrast; below the 0.1 low clip (|Lc| < ~7) it is 0. Informational only."""
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


def pair(fg_text, bg_text):
    """Ratio and APCA for a pair; a translucent background is flattened on white."""
    bg = parse(bg_text)
    if bg[3] < 1:
        bg = composite(bg, (1.0, 1.0, 1.0, 1.0))
    fg = composite(parse(fg_text), bg)
    return wcag_ratio(fg, bg), apca_lc(fg, bg)


def cmd_contrast(args):
    if len(args.colours) % 2:
        raise ColourError('contrast needs pairs: <fg> <bg> [<fg> <bg> ...]')
    failed = False
    for fg, bg in zip(args.colours[::2], args.colours[1::2]):
        ratio, lc = pair(fg, bg)
        failed |= ratio < args.min
        note = '  (bg flattened on white)' if parse(bg)[3] < 1 else ''
        print(f'{fg} on {bg}: {ratio:.2f}:1  {verdict(ratio)}  (APCA Lc {lc:.0f}){note}')
    return 1 if failed else 0


def cmd_matrix(args):
    if args.source:
        return matrix_from_css(args)
    if not (args.fg and args.bg):
        raise ColourError('matrix needs --fg and --bg lists, or --from <file.css>')
    fgs, bgs = split_top(args.fg), split_top(args.bg)
    print('| fg \\ bg | ' + ' | '.join(bgs) + ' |')
    print('| --- |' + ' --- |' * len(bgs))
    failed = False
    for f in fgs:
        cells = []
        for b in bgs:
            ratio, lc = pair(f, b)
            failed |= ratio < args.min
            cells.append(f'{ratio:.2f} {"ok" if ratio >= args.min else "FAIL"}' + (f' Lc{lc:.0f}' if args.apca else ''))
        print(f'| {f} | ' + ' | '.join(cells) + ' |')
    return 1 if failed else 0

# --- tokens from CSS --------------------------------------------------------------------------------

def css_declarations(text):
    """Yield (preludes, name, value) for every custom property, in source order."""
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    stack, buf, out = [], '', []

    def flush(chunk):
        for decl in split_top(chunk, ';'):
            name, sep, value = decl.partition(':')
            if sep and name.strip().startswith('--'):
                out.append((tuple(stack), name.strip(), value.strip().removesuffix('!important').strip()))

    depth = 0
    for ch in text:
        depth += (ch == '(') - (ch == ')')
        if ch == '{' and depth == 0:
            head, _, prelude = buf.rpartition(';')
            flush(head)
            stack.append(prelude.strip())
            buf = ''
        elif ch == '}' and depth == 0:
            flush(buf)
            buf = ''
            if stack:
                stack.pop()
        else:
            buf += ch
    return out


ROOTISH = re.compile(r':root|\bhtml\b|:host|\[data-(theme|mode|color-scheme)|\.(dark|light)\b')


def token_env(decls, mode, scope=None):
    """Custom properties visible at the root in one mode ('light' or 'dark')."""
    env = {}
    for want in ('base', mode):
        for preludes, name, value in decls:
            ctx = ' '.join(preludes).lower()
            selectors = [p for p in preludes if not p.startswith('@')]
            if not selectors or not (ROOTISH.search(selectors[-1]) or (scope and scope in selectors[-1])):
                continue
            kind = 'dark' if re.search(r'\bdark\b', ctx) else 'light' if re.search(r'\blight\b', ctx) else 'base'
            if kind == want:
                env[name] = value
    return env


def resolve(name, env, mode, seen=()):
    if name in seen:
        raise ColourError(f'var() cycle: {" -> ".join(seen + (name,))}')
    if name not in env:
        raise ColourError(f'undefined {name}')
    value = env[name]

    def sub_var(args):
        inner = split_top(args)
        try:
            return resolve(inner[0], env, mode, seen + (name,))
        except ColourError:
            if len(inner) > 1:
                return ','.join(inner[1:]).strip()
            raise

    for _ in range(50):
        new = _replace_fn(value, 'var', sub_var)
        new = _replace_fn(new, 'light-dark', lambda a: split_top(a)[0 if mode == 'light' else 1])
        if new == value:
            break
        value = new
    return value


def _replace_fn(text, fn, repl):
    """Replace each fn(...) call, however deeply nested its arguments are, with repl(arguments)."""
    m = re.search(r'(?<![\w-])' + fn + r'\(', text)
    if not m:
        return text
    depth, i = 1, m.end()
    while i < len(text) and depth:
        depth += (text[i] == '(') - (text[i] == ')')
        i += 1
    if depth:
        raise ColourError(f'unbalanced parentheses in {text!r}')
    return text[:m.start()] + repl(text[m.end():i - 1]) + _replace_fn(text[i:], fn, repl)


BARE_HSL = re.compile(r'-?[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%(\s*/\s*[\d.]+%?)?')
BARE_RGB = re.compile(r'\d{1,3}\s+\d{1,3}\s+\d{1,3}')
COLOURISH = re.compile(r'\s*(#|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\()', re.I)
ROLE_PREFIX = re.compile(r'^(md-sys-color-|sys-color-|colou?r-|clr-|c-)')
STATES = ('hover', 'active', 'pressed', 'focus', 'selected', 'strong', 'emphasis')


def classify(name, forced):
    """(kind, partner) for a token name; kind in text, ui, on, decor, fill, surface, None."""
    bare = name[2:]
    for kind, globs in forced.items():
        if any(fnmatch.fnmatch(bare, g) for g in globs):
            return kind, None
    if re.search(r'-\d+a?$', bare):
        return None, None
    role = ROLE_PREFIX.sub('', bare)
    words = role.split('-')
    surface_words = {'bg', 'background', 'surface', 'canvas', 'paper', 'backdrop', 'base', 'layer', 'well',
                     'card', 'popover', 'panel', 'sheet', 'overlay', 'scrim', 'container', 'subtle', 'muted',
                     'tint', 'wash', 'sidebar'}
    partner = None
    if words[0] == 'on' and len(words) > 1:
        partner = '-'.join(words[1:])
    elif words[-1] in ('foreground', 'fg', 'contrast') and len(words) > 1:
        partner = '-'.join(words[:-1])
    if partner is not None:
        tones = {'variant', 'high', 'higher', 'highest', 'low', 'lower', 'lowest', 'dim', 'bright', 'raised', 'sunken'}
        return ('text', None) if set(partner.split('-')) <= surface_words | tones else ('on', partner)
    if set(words) & {'text', 'fg', 'foreground', 'ink', 'link', 'placeholder', 'heading'}:
        return 'text', None
    if 'variant' in words or set(words) & {'divider', 'separator', 'hairline'}:
        return 'decor', None
    if set(words) & {'focus', 'ring', 'icon', 'input', 'control'} or role == 'outline':
        return 'ui', None
    if set(words) & {'border', 'stroke', 'outline', 'line', 'rule'}:
        return ('ui', None) if set(words) & {'strong', 'emphasis', 'control', 'input'} else ('decor', None)
    if set(words) & surface_words:
        return 'surface', None
    return 'fill', None


def matrix_from_css(args):
    try:
        with open(args.source, encoding='utf-8') as f:
            decls = css_declarations(f.read())
    except OSError as e:
        raise ColourError(f'cannot read {args.source}: {e.strerror}') from None
    forced = {k: split_top(v) for k, v in (('text', args.text), ('ui', args.ui), ('surface', args.surface)) if v}
    modes = ('light', 'dark') if args.mode == 'both' else (args.mode,)
    report, failed, skipped = {}, False, {}
    for mode in modes:
        env = token_env(decls, mode, args.scope)
        roles = {}
        for name in env:
            kind, partner = classify(name, forced)
            if not kind:
                continue
            try:
                value = resolve(name, env, mode).strip()
            except ColourError as e:
                if kind != 'fill' or COLOURISH.match(env[name]):
                    skipped[name] = str(e)
                continue
            if BARE_HSL.fullmatch(value):
                value = f'hsl({value})'
            elif BARE_RGB.fullmatch(value):
                value = f'rgb({value})'
            elif not (COLOURISH.match(value) or value.lower() in NAMED):
                continue
            try:
                rgba = parse(value)
            except ColourError as e:
                skipped[name] = str(e)
                continue
            roles[name] = {'kind': kind, 'partner': partner, 'rgba': rgba, 'hex': to_hex(rgba)}
        report[mode], mode_failed = matrix_rows(roles, mode)
        failed |= mode_failed
    if args.json:
        print(json.dumps({'source': args.source, 'modes': report, 'skipped': skipped}, indent=2))
    else:
        for mode in modes:
            print_matrix(mode, report[mode])
        for name, why in skipped.items():
            print(f'skipped {name}: {why}')
        if not any(r['rows'] for r in report.values()):
            print('No fg/bg colour roles found. Name them (text, bg, surface, border...) or pass '
                  '--text/--ui/--surface globs.')
    return 1 if failed else 0


def matrix_rows(roles, mode):
    surfaces = [n for n, r in roles.items() if r['kind'] == 'surface']
    base_name = next((n for n in surfaces if re.search(r'(^|-)(bg|background|canvas)$', n)), surfaces[0] if surfaces else None)
    base = roles[base_name]['rgba'] if base_name else ((1.0,) * 4 if mode == 'light' else (0.0, 0.0, 0.0, 1.0))
    if base[3] < 1:
        base = composite(base, (1.0,) * 4 if mode == 'light' else (0.0, 0.0, 0.0, 1.0))

    def flat(n):
        c = roles[n]['rgba']
        return c if c[3] >= 1 else composite(c, base)

    def norm(n):
        return ROLE_PREFIX.sub('', n[2:])

    on_targets = {}
    for n, r in roles.items():
        if r['kind'] == 'on':
            on_targets[n] = [m for m in roles if m != n and roles[m]['kind'] != 'on' and
                             (norm(m) == r['partner'] or any(norm(m) == f'{r["partner"]}-{s}' for s in STATES))]
    columns = surfaces + [m for t in on_targets.values() for m in t if m not in surfaces]
    columns = list(dict.fromkeys(columns))
    order = {'text': 0, 'ui': 1, 'on': 2, 'decor': 3, 'fill': 4}
    rows, failed = [], False
    for n in sorted((n for n in roles if roles[n]['kind'] in order), key=lambda n: order[roles[n]['kind']]):
        kind, cells = roles[n]['kind'], []
        for col in columns:
            if kind == 'on':
                applies = col in on_targets[n]
            else:
                applies = col in surfaces and col != n
            if not applies:
                cells.append(None)
                continue
            bg = flat(col)
            fg = composite(roles[n]['rgba'], bg)
            ratio = wcag_ratio(fg, bg)
            need = {'text': 4.5, 'on': 4.5, 'ui': 3.0}.get(kind)
            ok = None if need is None else ratio >= need
            failed |= ok is False
            cells.append({'bg': col, 'ratio': round(ratio, 2), 'apca': round(apca_lc(fg, bg)), 'min': need, 'pass': ok})
        rows.append({'role': n, 'kind': kind, 'hex': roles[n]['hex'], 'cells': cells})
    return {'columns': columns, 'hex': {c: roles[c]['hex'] for c in columns}, 'rows': rows}, failed


def print_matrix(mode, data):
    cols = data['columns']
    print(f'\n## {mode}\n')
    if not data['rows']:
        print('(no roles)')
        return
    print('| role (kind) | ' + ' | '.join(f'{c} {data["hex"][c]}' for c in cols) + ' |')
    print('| --- |' + ' --- |' * len(cols))
    for row in data['rows']:
        cells = []
        for c in row['cells']:
            if c is None:
                cells.append('·')
            elif c['pass'] is None:
                cells.append(f'({c["ratio"]:.2f})')
            else:
                cells.append(f'{c["ratio"]:.2f} {"ok" if c["pass"] else "FAIL"}')
        print(f'| {row["role"]} {row["hex"]} ({row["kind"]}) | ' + ' | '.join(cells) + ' |')
    print('\nok/FAIL: text and on-X roles need 4.5, ui roles 3. (ratio) on decor and fill rows is information: '
          'check fills used as text (4.5) or as icons and boundaries (3). · = pair not evaluated.')

# --- tonal scale ------------------------------------------------------------------------------------

STEPS = (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
# (lightness, taper): the share of the sRGB gamut's chroma at that lightness a step may use. Light
# steps stay near the gamut edge (it narrows toward white by itself); dark steps taper so 800-950 do
# not turn into saturated inks. Calibrated against Tailwind v4 blue, red and cyan (2026-09).
LADDER = ((0.975, 0.85), (0.935, 0.92), (0.885, 0.97), (0.815, 1.0), (0.715, 1.0), (0.625, 1.0),
          (0.550, 1.0), (0.485, 0.95), (0.420, 0.86), (0.370, 0.76), (0.280, 0.62))
# Chroma ceiling for the light steps 50-300 (OKLCH chroma, roughly hue-uniform in colourfulness).
# Hues whose sRGB gamut stays wide at high lightness (green, lime, yellow, cyan) would otherwise follow
# the gamut edge there and come out neon; blue, red and violet already sit under it. A ceiling as a
# share of the hue's peak chroma was tried and dropped: it turned yellow backgrounds beige. Only steps
# lighter than the pinned seed are capped; the seed and the steps beyond it keep the ramp's chroma.
SOFT = {50: 0.02, 100: 0.05, 200: 0.085, 300: 0.12}


def build_scale(seed, neutral=False, dark=False, anchor=True):
    L0, C0, H = srgb_to_oklch(*parse(seed)[:3])
    ladder = LADDER[::-1] if dark else LADDER
    Ls, taper = [L for L, _ in ladder], [t for _, t in ladder]
    k = min(range(len(Ls)), key=lambda i: abs(Ls[i] - L0)) if anchor and not neutral else None
    if neutral:
        Cs = [min(C0, 0.02) * max(t, 0.5) for t in taper]
    else:
        rel = 0.0 if C0 < 1e-3 else min(1.0, C0 / max(max_chroma(L0, H), 1e-6))
        if k is not None:
            Ls[k] = L0
            taper = [min(1.0, t / taper[k]) for t in taper]
        Cs = [rel * max_chroma(L, H) * t for L, t in zip(Ls, taper)]
        for i, step in enumerate(STEPS):
            j = len(STEPS) - 1 - i if dark else i          # the step at this light position
            lighter = k is None or (j > k if dark else j < k)
            if step in SOFT and lighter:
                Cs[j] = min(Cs[j], SOFT[step])
        if k is not None:
            Cs[k] = C0
        peak = max(range(len(Cs)), key=Cs.__getitem__)
        for i in list(range(peak + 1, len(Cs))):
            if i != k:
                Cs[i] = min(Cs[i], Cs[i - 1])
        for i in range(peak - 1, -1, -1):
            if i != k:
                Cs[i] = min(Cs[i], Cs[i + 1])
    out = []
    for step, L, C in zip(STEPS, Ls, Cs):
        C = fit_chroma(L, C, H)
        out.append({'step': step, 'hex': to_hex(oklch_to_srgb(L, C, H)), 'oklch': f'oklch({L:.3f} {C:.3f} {H:.1f})'})
    return out, C0


def cmd_scale(args):
    scale, C0 = build_scale(args.seed, args.neutral, args.dark, not args.no_anchor)
    if C0 < 0.03 and not args.neutral:
        print(f'note: {args.seed} is nearly achromatic (C {C0:.3f}); --neutral is probably what you want', file=sys.stderr)
    if args.format == 'json':
        print(json.dumps({args.name: {str(s['step']): s for s in scale}}, indent=2))
    elif args.format == 'css':
        for s in scale:
            print(f'  --{args.name}-{s["step"]}: {s["oklch"]}; /* {s["hex"]} */')
    else:
        white, black = (1.0, 1.0, 1.0), (0.0, 0.0, 0.0)
        print('| step | hex | oklch | vs white | vs black |')
        print('| --- | --- | --- | --- | --- |')
        for s in scale:
            c = parse(s['hex'])
            print(f'| {s["step"]} | {s["hex"]} | {s["oklch"]} | {wcag_ratio(c, white):.2f} | {wcag_ratio(c, black):.2f} |')
    return 0


def cmd_convert(args):
    for text in args.colours:
        (r, g, b, a), outside = parse_full(text)
        alpha = '' if a == 1 else f'  alpha {a:.2f}'
        note = ''
        if outside:
            fitted = gamut_mapped(text)
            note = '  (outside sRGB: browsers clip it to this hex' + (
                f'; in-gamut equivalent {to_hex(fitted)} {oklch_text(fitted)})' if fitted else ')')
        print(f'{text}: {to_hex((r, g, b))}  {oklch_text((r, g, b))}{alpha}{note}')
    return 0


# --- colour-vision deficiency -----------------------------------------------------------------------
# libDaltonLens (public domain) precomputed matrices on linear sRGB: Vienot 1999 for protan and deutan,
# Brettel 1997 (two half-planes split by a normal) for tritan.

VIENOT = {'protan': ((0.11238, 0.88762, 0.0), (0.11238, 0.88762, 0.0), (0.00401, -0.00401, 1.0)),
          'deutan': ((0.29275, 0.70725, 0.0), (0.29275, 0.70725, 0.0), (-0.02234, 0.02234, 1.0))}
BRETTEL_TRITAN = (((1.01277, 0.13548, -0.14826), (-0.01243, 0.86812, 0.14431), (0.07589, 0.80500, 0.11911)),
                  ((0.93678, 0.18979, -0.12657), (0.06154, 0.81526, 0.12320), (-0.37562, 1.12767, 0.24796)),
                  (0.03901, -0.02788, -0.01113))
CVD_NAMES = {'protan': 'protanopia', 'deutan': 'deuteranopia', 'tritan': 'tritanopia'}


def simulate(rgb, kind, severity=1.0):
    lin = tuple(_lin(c) for c in rgb[:3])
    if kind == 'tritan':
        m1, m2, n = BRETTEL_TRITAN
        m = m1 if sum(a * b for a, b in zip(lin, n)) >= 0 else m2
    else:
        m = VIENOT[kind]
    sim = _mul(m, lin)
    return tuple(_clamp01(_gam(_clamp01(s * severity + c * (1 - severity)))) for s, c in zip(sim, lin))


def delta_e_ok(c1, c2):
    a = lin_to_oklab(*(_lin(c) for c in c1[:3]))
    b = lin_to_oklab(*(_lin(c) for c in c2[:3]))
    return math.dist(a, b), abs(a[0] - b[0])


def cmd_cvd(args):
    items = []
    for text in args.colours:
        label, sep, value = text.partition('=')
        value = value if sep else label
        rgba = parse(value)
        items.append((label if sep else value, rgba if rgba[3] >= 1 else composite(rgba, (1.0,) * 4)))
    if len(items) < 2:
        raise ColourError('cvd needs at least two colours')
    kinds = split_top(args.type)
    for k in kinds:
        if k not in CVD_NAMES:
            raise ColourError(f'unknown --type {k!r}; use protan, deutan, tritan')
    print('| colour | hex | ' + ' | '.join(CVD_NAMES[k] for k in kinds) + ' |')
    print('| --- | --- |' + ' --- |' * len(kinds))
    for label, rgb in items:
        print(f'| {label} | {to_hex(rgb)} | ' + ' | '.join(to_hex(simulate(rgb, k, args.severity)) for k in kinds) + ' |')
    problems = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            (n1, c1), (n2, c2) = items[i], items[j]
            normal, _ = delta_e_ok(c1, c2)
            if normal < args.min_de:
                problems.append(('normal', n1, n2, normal, normal, delta_e_ok(c1, c2)[1]))
                continue
            for k in kinds:
                de, dl = delta_e_ok(simulate(c1, k, args.severity), simulate(c2, k, args.severity))
                if de < args.min_de:
                    problems.append((k, n1, n2, de, normal, dl))
    print()
    if not problems:
        print(f'No confusable pairs (every pair keeps OKLab distance >= {args.min_de} under {", ".join(kinds)}).')
        return 0
    print(f'Confusable pairs (OKLab distance < {args.min_de}; 0.02 is one just-noticeable difference):')
    for k, n1, n2, de, normal, dl in problems:
        hint = 'separate by lightness (dL < 0.1)' if dl < 0.1 else 'add a label, shape or pattern'
        print(f'  {k:<7} {n1} ~ {n2}: {de:.3f} (normal vision {normal:.3f}, dL {dl:.2f}) -> {hint}')
    return 1

# --- CLI --------------------------------------------------------------------------------------------

def main(argv=None):
    p = argparse.ArgumentParser(prog='color_tools.py', description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True, metavar='command')

    c = sub.add_parser('contrast', help='WCAG 2.x ratio and APCA Lc for fg/bg pairs')
    c.add_argument('colours', nargs='+', help='fg bg [fg bg ...]')
    c.add_argument('--min', type=float, default=4.5, help='exit 1 below this ratio (3 for large text and UI)')
    c.set_defaults(fn=cmd_contrast)

    m = sub.add_parser('matrix', help='contrast table for fg x bg lists or for roles in a CSS token file')
    m.add_argument('--fg', help='comma-separated colours')
    m.add_argument('--bg', help='comma-separated colours')
    m.add_argument('--min', type=float, default=4.5, help='with --fg/--bg: exit 1 below this ratio')
    m.add_argument('--apca', action='store_true', help='with --fg/--bg: add APCA Lc to each cell')
    m.add_argument('--from', dest='source', metavar='FILE.css', help='read custom properties from a CSS file')
    m.add_argument('--mode', choices=('light', 'dark', 'both'), default='both')
    m.add_argument('--scope', help='also read blocks whose selector contains this text, e.g. data-family="ink"')
    m.add_argument('--text', help='globs forced to text roles (4.5), e.g. "brand-ink,label-*"')
    m.add_argument('--ui', help='globs forced to ui roles (3)')
    m.add_argument('--surface', help='globs forced to surfaces')
    m.add_argument('--json', action='store_true', help='with --from: machine-readable output')
    m.set_defaults(fn=cmd_matrix)

    s = sub.add_parser('scale', help='11-step OKLCH tonal scale from a seed')
    s.add_argument('seed')
    s.add_argument('--name', default='brand', help='token prefix for css/json output')
    s.add_argument('--neutral', action='store_true', help='low-chroma neutral tinted with the seed hue')
    s.add_argument('--dark', action='store_true', help='mirrored ladder for dark surfaces (50 = darkest)')
    s.add_argument('--no-anchor', action='store_true', help='do not pin the seed onto its nearest step')
    s.add_argument('--format', choices=('table', 'css', 'json'), default='table')
    s.set_defaults(fn=cmd_scale)

    v = sub.add_parser('convert', help='hex and oklch() for colours')
    v.add_argument('colours', nargs='+')
    v.set_defaults(fn=cmd_convert)

    d = sub.add_parser('cvd', help='colour-vision simulation and confusable pairs')
    d.add_argument('colours', nargs='+', help='colours, optionally labelled: error=#d92d20')
    d.add_argument('--type', default='protan,deutan,tritan', help='comma list of protan, deutan, tritan')
    d.add_argument('--severity', type=float, default=1.0, help='0-1; below 1 approximates anomalous trichromacy')
    d.add_argument('--min-de', type=float, default=0.06, help='OKLab distance below which a pair is confusable')
    d.set_defaults(fn=cmd_cvd)

    args = p.parse_args(argv)
    try:
        return args.fn(args)
    except ColourError as e:
        print(f'color_tools.py {args.cmd}: {e}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
