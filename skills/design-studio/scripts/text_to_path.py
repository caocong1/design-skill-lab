#!/usr/bin/env python3
"""Set text in a font file and write it as SVG outlines: one <path> per glyph, no live <text>.

  text_to_path.py FONT "TEXT" [-o out.svg] [--size 100] [--tracking 0] [--pairs "AV:-40,To:-20"]
                  [--var wght=700] [--index 0]

FONT      a .ttf, .otf or .ttc/.otc file (use --index for a collection member)
--size    font size in SVG units (default 100)
--tracking extra space after every glyph, in 1/1000 em (default 0; negative tightens)
--pairs   extra space between two given characters, in 1/1000 em, added to the font's kerning:
          the pair-by-pair spacing pass of a wordmark; re-run until the rhythm is even
--var     variable-font axis values, comma-separated: wght=650,wdth=90
--index   font number inside a collection (default 0)

Needs fontTools (pip install fonttools). With uharfbuzz installed (pip install uharfbuzz) the text
is shaped: kerning, ligatures and contextual forms are applied. Without it, glyphs are placed by
their advance widths only and the script says so; space the letters by eye afterwards.
Each glyph is its own <path data-char="..."> so letters can be adjusted one by one. Fill is
currentColor; the viewBox is tight to the ink. The font's licence (name ID 13) and embedding bits
are printed to stderr: outlining does not change what the licence allows.
"""
import argparse
import sys


def num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def shape(path, index, text, location, font, glyph_set):
    """Return [(glyph_name, cluster_char, x_advance, x_offset, y_offset)] in font units."""
    try:
        import uharfbuzz as hb
    except ImportError:
        print("note: uharfbuzz not installed; no kerning or ligatures applied", file=sys.stderr)
        cmap = font.getBestCmap()
        out = []
        for ch in text:
            name = cmap.get(ord(ch), ".notdef")
            out.append((name, ch, glyph_set[name].width, 0, 0))
        return out
    blob = hb.Blob.from_file_path(path)
    hb_font = hb.Font(hb.Face(blob, index))
    if location:
        hb_font.set_variations(location)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    order = font.getGlyphOrder()
    out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((order[info.codepoint], text[info.cluster], pos.x_advance, pos.x_offset, pos.y_offset))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("font")
    ap.add_argument("text")
    ap.add_argument("-o", "--out")
    ap.add_argument("--size", type=float, default=100)
    ap.add_argument("--tracking", type=float, default=0)
    ap.add_argument("--pairs", default="")
    ap.add_argument("--var", default="")
    ap.add_argument("--index", type=int, default=0)
    a = ap.parse_args()
    try:  # imported after parsing so that --help works without fontTools
        from fontTools.pens.boundsPen import BoundsPen
        from fontTools.pens.svgPathPen import SVGPathPen
        from fontTools.pens.transformPen import TransformPen
        from fontTools.ttLib import TTFont
    except ImportError:
        sys.exit("text_to_path.py needs fontTools: pip install fonttools (uharfbuzz optional, for kerning)")

    try:
        font = TTFont(a.font, fontNumber=a.index)
    except Exception as e:  # unreadable or not a font: say so plainly
        sys.exit(f"cannot open font {a.font}: {e}")
    location = {}
    for part in filter(None, a.var.split(",")):
        tag, _, value = part.partition("=")
        location[tag.strip()] = float(value)
    if location and "fvar" not in font:
        sys.exit("--var given but this font is not variable")
    glyph_set = font.getGlyphSet(location=location or None)

    upm = font["head"].unitsPerEm
    scale = a.size / upm
    track = a.tracking * upm / 1000
    pairs = {}
    for part in filter(None, a.pairs.split(",")):
        pair, _, value = part.rpartition(":")
        if len(pair) != 2:
            sys.exit(f"--pairs: '{part}' must be two characters, a colon and a number, e.g. AV:-40")
        pairs[pair] = float(value) * upm / 1000
    ascender = font["hhea"].ascent

    paths, x, prev = [], 0.0, ""
    xmin = ymin = float("inf")
    xmax = ymax = float("-inf")
    for name, ch, adv, dx, dy in shape(a.font, a.index, a.text, location, font, glyph_set):
        x += pairs.get(prev + ch, 0.0)
        prev = ch
        if name == ".notdef":
            print(f"warning: no glyph for {ch!r} in this font", file=sys.stderr)
        # font units, y up -> SVG units, y down, baseline at the ascender
        t = (scale, 0, 0, -scale, (x + dx) * scale, (ascender - dy) * scale)
        pen = SVGPathPen(glyph_set, ntos=num)
        glyph_set[name].draw(TransformPen(pen, t))
        bounds = BoundsPen(glyph_set)
        glyph_set[name].draw(TransformPen(bounds, t))
        d = pen.getCommands()
        if d and bounds.bounds:
            b = bounds.bounds
            xmin, ymin, xmax, ymax = min(xmin, b[0]), min(ymin, b[1]), max(xmax, b[2]), max(ymax, b[3])
            safe = ch.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")
            paths.append(f'  <path data-char="{safe}" d="{d}"/>')
        x += adv + track
    if not paths:
        sys.exit("nothing to draw: the text has no visible glyphs in this font")

    w, h = xmax - xmin, ymax - ymin
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{num(xmin)} {num(ymin)} {num(w)} {num(h)}" '
        f'width="{num(w)}" height="{num(h)}" fill="currentColor">\n' + "\n".join(paths) + "\n</svg>\n"
    )
    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            f.write(svg)
    else:
        sys.stdout.write(svg)

    licence = font["name"].getDebugName(13) or "(no licence text in the font)"
    fs_type = font["OS/2"].fsType if "OS/2" in font else 0
    print(f"licence (name 13): {licence[:160]}", file=sys.stderr)
    if fs_type & 0x0002:
        print("fsType: restricted licence embedding; check the licence before any use", file=sys.stderr)


if __name__ == "__main__":
    main()
