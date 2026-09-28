# Superseded judging of set 02-devtool-landing-en, sample 3

These are the first facts sheet and the first three judge replies for this set. They are kept for the record and
are not counted.

The facts sheet told the judges that label B (suite-0.8.1) had a text node at 1.12:1 on the desktop page: the
install command `npm install @driftless/client`, "#f4f2ea on #ffffff". That was false. The text sits on a dark band
(#15171c) and measures 16:1; `desktop-07.png` shows it. `evals/tools/facts.mjs` sampled the node in the last pixel
row of a frame, where the browser's hit test returns nothing, and composited the text onto the default white
(fixed in 396df58, with a regression fixture).

Because a judge cited the false failure (J3 preferred A for it, and scored B's Platform / Accessibility 2), the set
was judged again by three fresh judges with the corrected facts sheet, as evals/README.md requires for a protocol
error. First result: B preferred 2-1. Second result, the one that counts: B preferred 3-0.
