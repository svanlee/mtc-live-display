# Configuration

Everything customizable lives in **`config.js`**. You should not need to
touch `index.html`, `style.css`, or `script.js` for day-to-day changes.

## Business / branding

```js
business: {
  name: "Morgan Trading Company",
  tagline: "Current Spot Prices",
  logo: "",            // e.g. "assets/logo/logo.png" — leave "" for text name
  logoAlt: "Morgan Trading Company Logo",
},
```

## Theme colors

```js
theme: {
  background: "#111111",
  gold: "#D4AF37",
  silver: "#C0C0C0",
  white: "#FFFFFF",
  divider: "#444444",
  accent: "#8B6F2A",
  fonts: { display: "'Cinzel', serif", heading: "'Montserrat', sans-serif", body: "'Open Sans', sans-serif" },
},
```

If you change these, also update the matching CSS custom properties at the
top of `style.css` (`:root { --color-gold: ...; }`) so the two stay in sync —
see `docs/Customization.md`.

## Clock

```js
clock: {
  locale: "en-US",      // try "en-GB" for DD/MM date formatting, etc.
  hour12: true,         // false = 24-hour clock
  showSeconds: true,
  showDate: true,
  dateOptions: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
},
```

## Spot prices

```js
prices: {
  provider: "demo",      // "demo" | "goldapi" | "metalsdev" | "currentgold"
  refreshInterval: 30000, // milliseconds
  goldapi: { apiKey: "...", baseUrl: "https://www.goldapi.io/api" },
  metalsdev: { apiKey: "...", baseUrl: "https://api.metals.dev/v1" },
  currentgold: { apiKey: "...", baseUrl: "https://api.current.gold/v1" },
  currency: "USD",
},
```

The site ships set to `"demo"` so it works out of the box with no API key,
using believable randomized price movement. Switch `provider` and fill in the
matching API key to go live — see `docs/API.md`.

## Slideshow timing

```js
slideshow: {
  imageDir: "images/",
  mediaDir: "media/",
  slideDuration: 10000,       // ms per slide
  transitionDuration: 1000,   // ms crossfade
  imageFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  videoFormats: ["mp4", "webm"],
  shuffle: false,
  loop: true,
},
```

## Ticker

```js
ticker: {
  source: "ticker.json",
  speed: 90,          // pixels per second
  separator: "  •  ",
},
```

## Offline behavior

```js
offline: {
  showLastUpdatedLabel: true,
  staleAfter: 1000 * 60 * 60 * 6, // 6 hours
},
```

## GitHub repo info (for automatic media discovery fallback)

```js
repo: {
  owner: "YOUR-GITHUB-USERNAME",
  name: "mtc-live-display",
  branch: "main",
},
```

Set this to your actual GitHub username/repo. It's only used as a fallback
if `images/manifest.json` hasn't been generated yet (see `docs/Media.md`).
