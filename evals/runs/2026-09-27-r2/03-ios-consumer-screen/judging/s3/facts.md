# Measured facts: 03-ios-consumer-screen

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label, with --touch 44 (also counts every target under 44 x 44 CSS px). Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 3 of 3 manifest items rendered, 3 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- today.html (402x874@2): ok, frames today.png, page height 874 px.
- book.html (402x874@2): ok, frames book.png, page height 874 px.
- empty.html (402x874@2): ok, frames empty.png, page height 874 px.

A: 3 of 3 files present.
- today.html (402x874@2): text below AA: 0 of 44 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 8; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- book.html (402x874@2): text below AA: 0 of 26 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 9; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- empty.html (402x874@2): text below AA: 0 of 15 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 9; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 3 of 3 manifest items rendered, 3 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- today.html (402x874@2): ok, frames today.png, page height 874 px.
- book.html (402x874@2): ok, frames book.png, page height 874 px.
- empty.html (402x874@2): ok, frames empty.png, page height 874 px.

B: 3 of 3 files present.
- today.html (402x874@2): text below AA: 1 of 42 measured text nodes (8 over images or gradients, measured from pixels), lowest 4.43:1 (needs 4.5) div.t "H. D. Thoreau" #e5d7c1 on #825729, 3.4px, from pixels. Targets under 24 px that fail the spacing exception: 0 of 6; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- book.html (402x874@2): text below AA: 0 of 35 measured text nodes (2 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 11; under 44 px: 2. Images without alt: 0. Horizontal overflow: no.
- empty.html (402x874@2): text below AA: 0 of 16 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 10; under 44 px: 2. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
