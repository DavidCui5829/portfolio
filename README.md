# David Cui, portfolio

Personal portfolio site. Plain static HTML and CSS with **no build step and no JavaScript**,
deployed on Vercel from the `main` branch. Every push to `main` updates the live site.

```
portfolio/
├── index.html         # home: engineering, research, community, violin, recognition, contact
├── sotm.html          # write-up: shoot-on-the-move targeting system
├── sim.html           # write-up: robot simulator in CloSim (Unity)
├── styles.css         # all styling, shared by every page
├── sotm-diagram.svg   # vector diagram used on sotm.html
├── sim-diagram.svg    # loop diagram used on sim.html
├── *-diagram-tall.svg # narrow versions of both diagrams, shown on phones
├── images/            # photos, screenshots and logos (all JPEG, each under 150 KB)
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve the folder so fonts load the same way they do online:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Design notes

- **Look:** light engineering paper. Pale green sheet with a faint grid, graphite ink, one pine accent
  (`--pine`) and a little gold (`--gold`). Colors live as variables at the top of `styles.css`.
- **Type:** Schibsted Grotesk for headings, labels and the drawing, Source Serif 4 for reading text,
  JetBrains Mono only for code on `sotm.html`.
- **Hero figure:** a photo of the Extended Essay launcher next to a to-scale plot of its measured
  average landing distances (topspin 2.215 m, no spin 2.334 m, backspin 2.451 m, launched at 45 degrees
  from 0.165 m). The plot is inline SVG in `index.html`, in a wide version and a narrow one for phones
  (switched at 600 px). Each flight is an exact parabola through the launch point and its landing point.
  The flights draw in once on load and stay still for anyone with reduced motion turned on.
- **No em dashes or semicolons** in site copy.

## Editing notes

- **Keep claims checkable.** Every number on the site should be one you could back up if asked, and it
  should match your resume and Common App.
- **Images:** resize anything over about 300 KB before committing, and keep `width` and `height` on
  every `<img>` so the page doesn't jump while loading.
- **New write-up page:** copy `sim.html` and replace what is inside `<main class="page">`. It picks up the
  shared header, footer and styles.
- **Updating the date:** the "Revised" field in the hero title block and the footer both say when the
  site was last updated.
