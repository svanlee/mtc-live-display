# Customization

## Changing the theme

Theme colors are defined in two places that should be kept in sync:

1. `config.js` → `theme` block (used for reference / any future JS-driven
   theming).
2. `style.css` → the `:root { }` custom properties at the top of the file.

| Purpose        | config.js key      | CSS variable        | Default   |
|-----------------|--------------------|----------------------|-----------|
| Background      | `theme.background` | `--color-bg`         | `#111111` |
| Gold accent     | `theme.gold`       | `--color-gold`       | `#D4AF37` |
| Silver accent   | `theme.silver`     | `--color-silver`     | `#C0C0C0` |
| Text / white    | `theme.white`      | `--color-white`      | `#FFFFFF` |
| Dividers        | `theme.divider`    | `--color-divider`    | `#444444` |
| Accent (status) | `theme.accent`     | `--color-accent`     | `#8B6F2A` |

## Changing fonts

Fonts are loaded from Google Fonts in `index.html`'s `<head>`. To swap a
typeface:
1. Update the Google Fonts `<link>` URL in `index.html` with your new
   family/weights.
2. Update the matching `--font-display` / `--font-heading` / `--font-body`
   custom properties in `style.css`.

## Changing the logo

1. Add your logo image to `assets/logo/`.
2. In `config.js`, set:
   ```js
   business: { logo: "assets/logo/your-logo.png", logoAlt: "Your Store Name" }
   ```
   The text business name is automatically hidden from view when a logo is
   set... actually it remains alongside it by default; remove the `<h1>` in
   `index.html`'s `.header__brand` if you want a logo-only header.

## Changing the ticker messages

Edit `ticker.json` — no code changes required:
```json
{ "messages": ["BUYING GOLD", "BUYING SILVER", "YOUR MESSAGE HERE"] }
```
The list supports any number of entries.

## Adjusting layout proportions

The slideshow is sized with CSS flexbox (`flex: 1 1 auto` on `.slideshow`),
so it automatically fills whatever space is left after the header, price
row, and ticker — no manual percentage math needed. To make the header or
ticker taller/shorter, adjust their padding/`min-height` in `style.css`.

## Adding a new spot-price provider

See the comment block at the top of `api/prices.js` — implement a
`fetchFromYourProvider(cfg)` function, register it in the `PROVIDERS` map,
and set `prices.provider` in `config.js`.
