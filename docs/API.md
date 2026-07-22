# Spot Price API

All price-fetching logic lives in **`api/prices.js`**, isolated from the
rest of the app so providers can be swapped without touching `script.js`.

## Choosing a provider

Set `prices.provider` in `config.js` to one of:

| Value          | Provider                          | Notes |
|-----------------|------------------------------------|-------|
| `"demo"`        | None (simulated)                   | Default. No API key needed. Randomized believable movement for testing. |
| `"goldapi"`      | [GoldAPI.io](https://www.goldapi.io/) | Simple REST API, per-metal endpoints. |
| `"metalsdev"`    | [Metals.dev](https://metals.dev/)  | Broad metals coverage. |
| `"currentgold"`  | Current.gold                       | Placeholder integration — confirm the current API shape with the provider before going live. |

## Setting API keys

In `config.js`:
```js
prices: {
  provider: "goldapi",
  goldapi: { apiKey: "YOUR_REAL_KEY", baseUrl: "https://www.goldapi.io/api" },
  currency: "USD",
},
```

**Do not commit real API keys to a public repository.** For a public repo,
either:
- Use a provider that supports domain-restricted/public keys meant for
  client-side use, or
- Proxy requests through a small serverless function (Cloudflare Worker,
  Netlify/Vercel function, AWS Lambda) that holds the real key server-side
  and forward only the response to the display. This requires a small
  amount of additional infrastructure beyond the "no server" baseline, but
  keeps secret keys off GitHub Pages.

## Refresh rate

`prices.refreshInterval` in `config.js` controls how often `fetchPrices()`
is called (default: 30000ms / 30 seconds, per the design spec). Most
providers rate-limit free tiers — check your plan before lowering this.

## Response shape expected by the app

Every provider function must resolve to:
```js
{
  gold:   { price: Number, change: Number, changePercent: Number, direction: "up"|"down"|"flat" },
  silver: { price: Number, change: Number, changePercent: Number, direction: "up"|"down"|"flat" },
}
```
`api/prices.js` wraps this with `currency`, `source`, and `updatedAt` before
handing it to `script.js`.

## Offline / failure behavior

If a live request fails (network down, rate limit, bad key), `fetchPrices()`
automatically falls back to the last successfully cached prices in
`localStorage`, tagging the result `source: "cache"` so the UI can show a
"Last Updated" label instead of crashing or showing blank data. If there is
no cache yet (e.g. first run with no network), it returns a clearly-marked
`"unavailable"` state.

## Adding a new provider

1. Write `async function fetchFromYourProvider(cfg) { ... }` in
   `api/prices.js` returning the shape above.
2. Add it to the `PROVIDERS` map at the bottom of the file:
   ```js
   const PROVIDERS = { demo, goldapi, metalsdev, currentgold, yourProvider };
   ```
3. Add a config block for its API key/base URL in `config.js`.
4. Set `prices.provider = "yourProvider"`.
