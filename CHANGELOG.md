# Changelog

All notable changes to this project are documented in this file.
This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-07-21

### Added
- Initial release of the Morgan Trading Company Live TV Display.
- Header with business name, tagline, and optional logo.
- Live Gold and Silver spot price panels with 30-second refresh, up/down
  arrows, and percent-change indicators.
- Real-time clock with configurable locale and 12/24-hour format.
- Fullscreen slideshow (~70% of viewport) with 10-second slides and
  1-second crossfades, automatically discovering images in `/images`.
- Bottom scrolling ticker driven by `ticker.json`, supporting unlimited
  messages.
- Pluggable spot-price API layer (`api/prices.js`) supporting GoldAPI,
  Metals.dev, Current.gold, and an offline-friendly demo mode.
- Offline handling: cached last-known prices with a "Last Updated" label,
  no crashes when the network is unavailable.
- GitHub Actions workflow: validates HTML/CSS, regenerates the media
  manifest, and deploys to GitHub Pages on every push to `main`.
- 24 placeholder slideshow images covering all requested categories.
- Full documentation set under `/docs`.

### Planned
See "Future Roadmap" in `README.md`.
