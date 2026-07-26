# David Cui — Portfolio

A personal portfolio site. Plain static site (HTML, CSS, JS) with **no build step**, so it
deploys anywhere with zero configuration and a custom domain is just a DNS change later.

```
portfolio/
├── index.html      # home: robotics, social impact, violin
├── sotm.html       # writeup: shoot-on-the-move targeting system
├── sim.html        # writeup: Unity robotics simulator
├── styles.css      # styling (shared by all pages)
├── main.js         # scroll reveals + footer year
├── images/         # photos and logos
└── README.md
```

## Run locally

Just open `index.html` in a browser. Or, for a local server (fonts/canvas behave best this way):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Put it on GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

After this, **every `git push` updates the live site automatically** once it's connected to a host.

## Deploy to Vercel (use this now — free, no domain needed)

1. Go to vercel.com and sign in with GitHub.
2. **Add New → Project**, import this repo.
3. Framework preset: **Other**. Leave build command and output empty (it's static).
4. Deploy. You get a live URL like `your-portfolio.vercel.app`.

That URL is fully live and shareable. You can put it in your Common App right away.

## Add a custom domain later (no code changes)

When you buy a domain (e.g. `davidcui.dev`):

1. In Vercel: **Project → Settings → Domains → Add**, type your domain.
2. Vercel shows you DNS records to add.
3. In your registrar (Namecheap, Cloudflare, etc.), add those records.
4. Wait a few minutes. The domain now points at the same deployment.

Nothing in the code changes — the domain is just a new address for the same site.

## Alternative host: GitHub Pages

This also works with no changes:

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save. Site goes live at `YOUR_USERNAME.github.io/portfolio`.

A custom domain can be added here too, under the same Pages settings.

## Editing notes

- **Keep claims checkable.** Every number on the site should be one you could back up if
  someone asked. Prefer describing what you built and what you learned over headline stats.
- **Images:** anything over ~300 KB should be resized before committing. Square logos use
  `class="imgfill imgfill--logo"` so they aren't cropped; photos use plain `imgfill`.
- **New writeup page:** copy `sim.html`, change the `<main class="page">` content. It picks up
  the shared nav, footer, and styles automatically.
