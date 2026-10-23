# AGENTS.md

AI Compute Footprint: a static page showing the compute, energy, water and CO₂ of AI tasks, scaled from one person to the world.

## Structure
- `index.html`: markup
- `assets/app.js`: calculations, charts, floor plan
- `assets/styles.css`: tokens and layout (light and dark)
- `data/model.js`: all figures and sources; change numbers only here
- `build.py`: bundles into `dist/` (git-ignored)
- `og.sh`: regenerates the share image `assets/og.png`
- Bump the `?v=` on asset links in `index.html` when assets change (GitHub Pages caches them).
- After visible changes to the top of the page (title, opening line, scenario bar, stat card), run `./og.sh` and bump `og.png?v=` in `index.html` (link previews cache it).

## Conventions
- Plain HTML, CSS and JS; no frameworks; must open from `file://`.
- Every figure in `data/model.js` has a source id; mark own derivations `DER`.

## Git
- Commit as Tim Plaisted <406739+heyyeah@users.noreply.github.com>. No co-author or tool attribution lines.
- Commit sparingly, with concise or no commit messages.

## Comments
- Concise code comments only. No discussion in comments.
