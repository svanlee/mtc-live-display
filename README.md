# Morgan Trading Company — Live TV Display

A professional, zero-server digital signage display for Morgan Trading
Company: live gold and silver spot prices, a fullscreen promotional
slideshow, a scrolling announcement ticker, and a clock — built as a static
site so it runs entirely in the browser and deploys for free on GitHub
Pages.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Live spot prices** — large gold/silver price panels with up/down
  arrows and percent change, refreshing every 30 seconds.
- **Pluggable price providers** — GoldAPI, Metals.dev, Current.gold, or an
  offline-friendly demo mode (no API key needed to try it out).
- **Fullscreen slideshow** — occupies ~70% of the screen, auto-crossfades
  between images every 10 seconds, and **automatically discovers new
  images** dropped into `/images` (no code changes required). Also supports
  video slides and seasonal promotion slides woven into the rotation.
- **Scrolling ticker** — unlimited announcement messages via `ticker.json`.
- **Live clock** — configurable locale and 12/24-hour format.
- **Offline-safe** — caches the last known prices and shows a
  "Last Updated" label instead of crashing when the network drops.
- **TV & kiosk ready** — tested guidance for Chrome/Edge kiosk mode,
  Raspberry Pi, Samsung/LG Smart TVs, Android TV, Fire TV, and Windows mini
  PCs.
- **Fully static** — plain HTML/CSS/vanilla ES6 JavaScript. No React, no
  Angular, no Vue, no build step, no backend.

# Display Layout
<!--
----------------------------------------------------------------
|                     MORGAN TRADING COMPANY                   |
|    GOLD                     TIME               SILVER        |
| $4,012.45 ▲            00:00:00 AM/PM          $56.81 ▼      |
|--------------------------------------------------------------|
|                                                              |
|                                                              |
|                                                              |
|                                                              |
|                 FULL SCREEN SLIDESHOW                        |
|                                                              |
|                                                              |
|                                                              |
|                                                              |
|--------------------------------------------------------------|
| BUYING GOLD • BUYING SILVER • COINS • ESTATES • WATCHES ...  |
----------------------------------------------------------------
-->

<table width="100%" style="border-collapse: collapse; border: 1px solid #7f7f7f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

  <!-- Header (Forced spacing using embedded Unicode layout characters) -->
  <tr>
    <td colspan="3" align="center" style="text-align: center; font-weight: bold; font-size: 1.5em; padding: 15px; border-bottom: 1px solid #7f7f7f; letter-spacing: 2px;">
      &#8195;&#8195;MORGAN TRADING COMPANY
    </td>
  </tr>

  <!-- Tickers (Strict Equal Widths) -->
  <tr style="background-color: #f6f8fa;">
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.1em; padding: 10px; border-bottom: 1px solid #d0d7de; border-right: 1px solid #d0d7de; width: 33.33%;">GOLD</td>
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.1em; padding: 10px; border-bottom: 1px solid #d0d7de; border-right: 1px solid #d0d7de; width: 33.33%;">TIME</td>
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.1em; padding: 10px; border-bottom: 1px solid #d0d7de; width: 33.33%;">SILVER</td>
  </tr>
  <tr>
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.2em; padding: 12px; color: #1a7f37; border-bottom: 1px solid #7f7f7f; border-right: 1px solid #d0d7de; width: 33.33%;">$4,012.45 ▲</td>
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.2em; padding: 12px; border-bottom: 1px solid #7f7f7f; border-right: 1px solid #d0d7de; width: 33.33%;">00:00:00 AM/PM</td>
    <td align="center" style="text-align: center; font-weight: bold; font-size: 1.2em; padding: 12px; color: #cf222e; border-bottom: 1px solid #7f7f7f; width: 33.33%;">$56.81 ▼</td>
  </tr>

  <!-- Main Slideshow Window (Pure Inline, Old-School Hard Centering) -->
  <tr>
    <td colspan="3" align="center" style="text-align: center; background-color: #f6f8fa; color: #57606a; font-size: 1.5em; font-weight: bold; border-bottom: 1px solid #7f7f7f;">
      <br><br><br><br><br><br>
      FULL SCREEN SLIDESHOW
      <br><br><br><br><br><br>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td colspan="3" align="center" style="text-align: center; font-size: 1em; padding: 15px; background-color: #ffffff; letter-spacing: 1px;">
      <strong>BUYING GOLD</strong> • <strong>BUYING SILVER</strong> • <strong>COINS</strong> • <strong>ESTATES</strong> • <strong>WATCHES</strong> ...
    </td>
  </tr>
</table>

---
## Quick start

```bash
git clone https://github.com/YOUR-USERNAME/mtc-live-display.git
cd mtc-live-display
python3 -m http.server 8080   # or: npx serve .
```
Open `http://localhost:8080`. It runs immediately in demo mode — no API key
required.

To deploy for real, see **[docs/GitHub-Pages.md](docs/GitHub-Pages.md)**.

## Folder structure

```
mtc-live-display/
├── index.html              # Page structure
├── style.css                # Theme, layout, animations
├── script.js                 # Clock, price polling, slideshow, ticker logic
├── config.js                  # ALL customization lives here
├── ticker.json                 # Scrolling ticker messages
├── promotions.json             # Seasonal deals woven into the slideshow
├── api/
│   └── prices.js                # Spot-price provider abstraction
├── images/                        # Slideshow photos (drop files in, auto-discovered)
├── media/                          # Slideshow videos (.mp4/.webm, auto-discovered)
├── assets/
│   ├── fonts/                        # Optional local font files
│   └── icons/                         # Favicon, logo
├── components/                          # Reserved for future UI modules
├── docs/                                 # Full documentation set
├── .github/
│   └── workflows/deploy.yml               # Validate + auto-manifest + deploy
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
└── .gitignore
```

## Configuration

Everything customizable — business name, logo, theme colors, API keys,
refresh rates, slideshow/ticker timing — lives in **`config.js`**. See
**[docs/Configuration.md](docs/Configuration.md)** for the full reference.

## Documentation

| Doc | Covers |
|---|---|
| [docs/Installation.md](docs/Installation.md) | Getting the project running locally |
| [docs/Configuration.md](docs/Configuration.md) | Every setting in `config.js` |
| [docs/API.md](docs/API.md) | Connecting a live gold/silver price provider |
| [docs/Media.md](docs/Media.md) | Adding slideshow images, videos, and seasonal deals |
| [docs/Customization.md](docs/Customization.md) | Theme, fonts, logo, ticker |
| [docs/GitHub-Pages.md](docs/GitHub-Pages.md) | Deploying for free on GitHub Pages |
| [docs/TV-Kiosk.md](docs/TV-Kiosk.md) | Running fullscreen on an actual TV |
| [docs/Rebranding.md](docs/Rebranding.md) | Reusing this as a generic template for another client |

## Adding your own photos

Drop `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` files into `/images` and
push to `main`. A GitHub Action automatically regenerates the image list and
redeploys — the new photos appear on the live display within a minute or
two, with no code edits. See [docs/Media.md](docs/Media.md).

## Changing the theme

Edit the color values in `config.js` (`theme` block) — the matching CSS
custom properties in `style.css` update automatically at runtime. Full
walkthrough in [docs/Customization.md](docs/Customization.md).

## Local development

No build step is required. Any static file server works:
```bash
python3 -m http.server 8080
# or
npx serve .
```
(A local server is required — opening `index.html` directly via `file://`
will block the `fetch()` calls the app uses to load config/manifests.)

## Browser & device support

Chrome, Edge, Firefox, Safari — and Smart TV browsers on Samsung, LG,
Android TV, Fire TV, plus Raspberry Pi Chromium kiosk and Windows mini PCs.
See [docs/TV-Kiosk.md](docs/TV-Kiosk.md) for kiosk-mode setup per platform.

## Future roadmap

- Live weather widget
- Inventory / promotions feed
- QR codes linking to appraisal requests or the store's website
- Remote configuration (update settings without pushing code)
- Multiple selectable themes
- Store announcement banner overlays
- Optional live price history chart

## Troubleshooting

**Prices show `$----.--` and never update:** the configured API key/provider
is unreachable. Check `config.js`; the app falls back to the last cached
price automatically once one exists.

**Slideshow shows "Add Photos To Get Started":** confirm files exist in
`/images` and that `images/manifest.json` lists them (regenerated
automatically by the GitHub Action on push — see
[docs/Media.md](docs/Media.md) for the manual command).

**Fonts look like a fallback serif/sans-serif:** check your network can
reach `fonts.googleapis.com` — kiosks on locked-down networks sometimes
block it. Self-hosting the three fonts in `/assets/fonts` is a supported
fallback; see [docs/Customization.md](docs/Customization.md).

**Ticker isn't scrolling:** confirm `ticker.json` is valid JSON (a trailing
comma is the most common culprit) and that `prefers-reduced-motion` isn't
enabled in your OS/browser accessibility settings, which intentionally slows
the animation.

## Credits

Built for Morgan Trading Company by VonDuke Designs LLC. Placeholder
slideshow imagery included in this repository is original generated artwork
meant as a drop-in template — replace it with your own store photography
before going live in-store (see [docs/Media.md](docs/Media.md)).

## License

MIT — see [LICENSE](LICENSE).
