# Reusing This as a Generic Template

This project was built for Morgan Trading Company, but nothing in
`index.html`, `style.css`, `script.js`, or `api/prices.js` mentions Morgan
Trading Company directly — every brand-specific detail was pulled out into
`config.js`, `ticker.json`, and `promotions.json`. That separation is what
makes it safe to reuse for a different store, or a different kind of
business entirely, without touching the app logic.

## What's generic (don't need to change)

- `index.html` — structural shell only, no hardcoded copy.
- `style.css` — reads all colors from CSS custom properties set by
  `config.js` at runtime.
- `script.js` — reads business name, tagline, timing, and provider choice
  from `config.js`; discovers images/videos automatically.
- `api/prices.js` — provider abstraction; swap providers via config, no code
  edits needed for the common case.
- `.github/workflows/deploy.yml` — validation + deploy pipeline, works for
  any content.

## What's brand-specific (change these per client)

| File | What to change |
|---|---|
| `config.js` | `business.name`, `business.tagline`, `business.logoPath`, `theme` colors, API provider/keys |
| `ticker.json` | Store-specific announcements |
| `promotions.json` | Store-specific seasonal deals |
| `/images` | Store photography (replace all placeholders) |
| `/media` | Store video slides, if used |
| `README.md` | Update the business name references |

## Suggested workflow for a new client

1. Fork or duplicate this repository.
2. Edit `config.js`: business name/tagline/logo, theme colors (a jeweler,
   a coin shop, and a pawn shop might each want a different palette — the
   `theme` block is the only place that needs to change).
3. Replace `ticker.json` and `promotions.json` with the new client's
   messaging.
4. Drop the new client's photos into `/images` and remove the bundled
   placeholders.
5. Push to `main` — GitHub Actions validates and deploys automatically.

Because every step above touches data files rather than app code, the same
underlying engine can power any number of differently-branded displays
across separate repositories (or separate `config.js`/`ticker.json` sets if
you later add multi-tenant support) without forking the logic itself.

## Going further: true multi-tenancy

If you end up managing several store displays from one codebase, the
natural next step is a `presets/` folder holding one config file per client
(e.g. `presets/morgan-trading.config.js`, `presets/acme-coins.config.js`) and
a small loader that picks the right preset by hostname or URL parameter.
That's intentionally left out of this build to keep the base template
simple — see the "Remote Config" item in `README.md`'s roadmap for where
this could go next.
