# Installation

## Requirements

- A GitHub account (free tier is sufficient).
- A modern browser (Chrome, Edge, Firefox, or Safari) for local preview.
- No Node.js, npm, or build tools are required to *run* the site — they're
  only used by the optional GitHub Actions validation/manifest workflow.

## Option A — Use as a GitHub template (recommended)

1. Click **Use this template** on the repository page (or fork it).
2. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mtc-live-display.git
   cd mtc-live-display
   ```
3. Follow `docs/Configuration.md` to set your business name, theme, and
   spot-price provider.
4. Follow `docs/GitHub-Pages.md` to deploy.

## Option B — Download the files directly

1. Download/copy all project files into a folder named `mtc-live-display`.
2. Push the folder to a new GitHub repository.
3. Continue with `docs/GitHub-Pages.md`.

## Local preview before deploying

Because the app uses `fetch()` to load `config.js` data, `ticker.json`, and
image manifests, opening `index.html` directly via `file://` will not work in
most browsers (CORS restrictions on local file fetches). Serve it instead:

```bash
# Python (any OS with Python 3 installed)
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## Next steps

- `docs/Configuration.md` — business info, theme, clock, refresh rates.
- `docs/API.md` — connecting a live gold/silver spot price provider.
- `docs/Media.md` — adding slideshow images and (future) videos.
- `docs/TV-Kiosk.md` — running fullscreen on an actual TV or mini PC.
