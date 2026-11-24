# Workshop diagrams

`build.mjs` draws every diagram and banner in the workshop as SVG and renders it to a PNG at twice its layout size,
so images stay sharp on high-density screens. Each image is written to the `.github/images/` folder of the
exercises that use it, and a copy goes to `preview/` for quick checks.

## Build

```bash
npm ci
npm run build
```

Run it after changing a diagram, then review every changed image in `preview/` before committing it in the
exercises.

## Fonts

The renderer loads only the fonts it needs, so output is identical on every machine that has them:
Segoe UI (`segoeui.ttf`, `seguisb.ttf`, `segoeuib.ttf`, `seguisym.ttf`) and Consolas (`consola.ttf`,
`consolab.ttf`). They are read from `C:/Windows/Fonts` by default. On another system, copy those files into a
folder and point `DIAGRAM_FONT_DIR` at it:

```bash
DIAGRAM_FONT_DIR=/path/to/fonts npm run build
```

## Conventions

- Icons are [Primer Octicons](https://primer.style/octicons/), GitHub's icon set. Colors follow the Primer light
  palette for diagrams and the dark palette for banners.
- Text is measured with the same renderer that draws it. Wrapped text is balanced so lines are even; where a box
  is wide, pass explicit lines instead.
- Every image in a step needs `alt` text that carries the same information as the picture.
- Reference images from step files as `../images/<file>.png` with `width="800"` for 1000-wide diagrams and banners.

| Image | Used in |
| --- | --- |
| `banner.png` | Each exercise: README and the top of step 1 |
| `workshop-map.png` | Each exercise: README and review, with that exercise highlighted |
| `spec-loop.png`, `trace-chain.png`, `evidence-gap.png` | Exercise 1 |
| `question-lenses.png`, `requirement-anatomy.png`, `late-gaps.png` | Exercise 2 (`requirement-anatomy.png` also in exercise 4) |
| `delivery-flow-1.png` to `delivery-flow-5.png`, `archive-flow.png` | Exercise 3 |
| `readiness-gate.png` | Exercise 4 |
