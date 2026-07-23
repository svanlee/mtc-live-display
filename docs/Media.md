# Adding Images & Videos

## Sourcing real store photos

The images bundled with this project started as original placeholder artwork
(simple labeled illustrations), not photographs — that avoids any licensing
question out of the box, but they are a stand-in only. Before going live,
replace them with real photos. Two easy, free routes:

- **Your own store/product photography** — the best option for a real
  jeweler or coin shop, since generic stock never quite matches actual
  inventory.
- **Free, license-clear stock photography** — Unsplash (unsplash.com) and
  Pexels (pexels.com) both offer photos free for commercial use with no
  attribution required. Useful search terms per category: "gold bars",
  "silver bullion", "American eagle coin", "Morgan silver dollar", "rare
  coins collection", "fine jewelry", "luxury watch", "estate
  jewelry", "coin collection case", "currency cash", "jewelry store
  interior". Download the files, drop them into `/images`, and regenerate
  the manifest as described below.

## Adding images

1. Copy `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` files into `/images`.
2. Regenerate `images/manifest.json` (see below).
3. Commit and push — GitHub Pages redeploys automatically.

Recommended: 1920×1080 or larger landscape images for the sharpest result,
since the slideshow uses `background-size: cover`.

### Regenerating the image manifest

```bash
ls images | grep -E '\.(jpg|jpeg|png|webp|gif)$' | python3 -c \
  "import json,sys; print(json.dumps([l.strip() for l in sys.stdin]))" \
  > images/manifest.json
```

If `manifest.json` is ever missing or fails to load, the app falls back to
its bundled placeholder list, so the display never shows a blank screen.

## Adding videos

Video slides are supported natively. Drop `.mp4` or `.webm` files into
`/media`, then regenerate `media/manifest.json` the same way:

```bash
ls media | grep -E '\.(mp4|webm)$' | python3 -c \
  "import json,sys; print(json.dumps([l.strip() for l in sys.stdin]))" \
  > media/manifest.json
```

Videos play muted and looped, and are woven into the slide rotation at the
frequency set by `config.js → slideshow.videoFrequency` (e.g. `4` means
"one video slide every 4 images"). Set it to `0` to disable video slides
entirely. Keep clips short (10–20 seconds) and silent/ambient — the display
has no audio output in most kiosk setups.

## Seasonal deals / promotions

Promo slides don't need image files at all — they're generated from
`promotions.json` and woven into the rotation at the frequency set by
`config.js → promotions.everyNSlides`. Each entry supports an optional
`startDate`/`endDate` so a holiday or seasonal deal turns on and off
automatically. See `promotions.json` for examples and
[Customization.md](Customization.md) for the full field reference.

## Automating manifest regeneration in CI

To avoid running the commands above by hand every time, add this step to
`.github/workflows/deploy.yml` before the deploy job:

```yaml
      - name: Regenerate media manifests
        run: |
          ls images | grep -E '\.(jpg|jpeg|png|webp|gif)$' | \
            python3 -c "import json,sys; print(json.dumps([l.strip() for l in sys.stdin]))" \
            > images/manifest.json
          ls media | grep -E '\.(mp4|webm)$' | \
            python3 -c "import json,sys; print(json.dumps([l.strip() for l in sys.stdin]))" \
            > media/manifest.json || echo "[]" > media/manifest.json
```
