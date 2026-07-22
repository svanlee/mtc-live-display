# Contributing

Thanks for helping improve the Morgan Trading Company Live Display. This is a
small, dependency-free static site, so contributing is intentionally simple.

## Local development

1. Clone the repo.
2. Serve the folder with any static file server, for example:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` (or the port your server prints) in a browser.

No build step, bundler, or package installation is required to run the site.

## Making changes

- **Content / branding / API keys** → edit `config.js` only.
- **Layout or visual style** → edit `style.css`. Keep the CSS custom
  properties in `:root` in sync with `config.js`'s `theme` block.
- **Behavior** (clock, slideshow, ticker, price polling) → edit `script.js`.
- **Spot price providers** → edit `api/prices.js`. See the comment block at
  the top of that file for how to register a new provider.
- **Slideshow images** → drop files into `/images`. Do not hand-edit
  `images/manifest.json` — it's regenerated automatically by the GitHub
  Action on every push.

## Code style

- Vanilla ES6+, no frameworks, no build tooling for the site itself.
- Keep functions small and named for what they do.
- Comment "why", not "what" — the code should read clearly on its own.
- Match the existing formatting (2-space indentation, double quotes in JS).

## Testing your changes

Before opening a pull request:
- Load the page at 1920×1080 and confirm nothing overflows or clips.
- Resize down to a small window and confirm the responsive layout still
  reads cleanly.
- Temporarily disconnect from the network and confirm the display keeps
  running (clock and slideshow continue; prices show the "Last Updated"
  fallback instead of crashing).

## Submitting changes

1. Fork the repo and create a branch: `git checkout -b fix/short-description`.
2. Commit with a clear message describing the change.
3. Open a pull request describing what changed and why, and include a
   screenshot or screen recording for any visual change.
