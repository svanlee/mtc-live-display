/**
 * api/prices.js — spot price provider abstraction.
 * window.MTCPrices.fetchPrices() always resolves to:
 *   { gold: {price, changePercent, direction}, silver: {...}, fetchedAt }
 */
(function () {
  const cfg = () => window.MTC_CONFIG.api;

  function direction(changePercent) {
    if (changePercent > 0) return "up";
    if (changePercent < 0) return "down";
    return "flat";
  }

  async function fetchFromGoldAPI() {
    const { apiKey, baseUrl } = cfg().goldapi;
    const headers = { "x-access-token": apiKey, "Content-Type": "application/json" };
    const [goldRes, silverRes] = await Promise.all([
      fetch(`${baseUrl}/XAU/USD`, { headers }),
      fetch(`${baseUrl}/XAG/USD`, { headers }),
    ]);
    if (!goldRes.ok || !silverRes.ok) throw new Error("GoldAPI request failed");
    const gold = await goldRes.json();
    const silver = await silverRes.json();
    return {
      gold: { price: gold.price, changePercent: gold.chp ?? 0, direction: direction(gold.chp ?? 0) },
      silver: { price: silver.price, changePercent: silver.chp ?? 0, direction: direction(silver.chp ?? 0) },
    };
  }

  async function fetchFromMetalsDev() {
    const { apiKey, baseUrl } = cfg().metalsdev;
    const res = await fetch(`${baseUrl}/latest?api_key=${apiKey}&currency=USD&unit=toz`);
    if (!res.ok) throw new Error("Metals.Dev request failed");
    const data = await res.json();
    const gold = data.metals?.gold ?? {};
    const silver = data.metals?.silver ?? {};
    return {
      gold: { price: gold.price ?? 0, changePercent: gold.change_percentage ?? 0, direction: direction(gold.change_percentage ?? 0) },
      silver: { price: silver.price ?? 0, changePercent: silver.change_percentage ?? 0, direction: direction(silver.change_percentage ?? 0) },
    };
  }

  async function fetchFromCurrentGold() {
    const { apiKey, baseUrl } = cfg().currentgold;
    const res = await fetch(`${baseUrl}/spot?symbols=XAU,XAG`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error("Current.Gold request failed");
    const data = await res.json();
    return {
      gold: { price: data.XAU?.price ?? 0, changePercent: data.XAU?.changePercent ?? 0, direction: direction(data.XAU?.changePercent ?? 0) },
      silver: { price: data.XAG?.price ?? 0, changePercent: data.XAG?.changePercent ?? 0, direction: direction(data.XAG?.changePercent ?? 0) },
    };
  }

  let demoState = null;
  async function fetchFromDemo() {
    if (!demoState) demoState = { gold: 4012.45, silver: 56.81 };
    const wiggle = (base, magnitude) => Math.max(0, base + (Math.random() - 0.5) * magnitude);
    const prevGold = demoState.gold;
    const prevSilver = demoState.silver;
    demoState.gold = wiggle(demoState.gold, 6);
    demoState.silver = wiggle(demoState.silver, 0.3);
    const goldChangePercent = ((demoState.gold - prevGold) / prevGold) * 100;
    const silverChangePercent = ((demoState.silver - prevSilver) / prevSilver) * 100;
    return {
      gold: { price: demoState.gold, changePercent: goldChangePercent, direction: direction(goldChangePercent) },
      silver: { price: demoState.silver, changePercent: silverChangePercent, direction: direction(silverChangePercent) },
    };
  }

  const PROVIDERS = { goldapi: fetchFromGoldAPI, metalsdev: fetchFromMetalsDev, currentgold: fetchFromCurrentGold, demo: fetchFromDemo };

  // Returns a NEW metal object with today's config's multiplier/rounding
  // applied — never mutates the input, so raw fetched/cached data stays raw.
  function adjustMetal(metal, key) {
    if (!metal) return metal;
    const multiplier = cfg().priceMultiplier || {};
    const roundDown = cfg().roundDownToDollar || {};
    let price = metal.price * (multiplier[key] ?? 1);
    if (roundDown[key]) price = Math.floor(price);
    return { ...metal, price };
  }

  // Applied at render time (not baked into what gets fetched/cached) so a
  // formula change here takes effect immediately, even against a price that
  // was cached under an older formula.
  function applyPriceAdjustment(result) {
    return {
      ...result,
      gold: adjustMetal(result.gold, "gold"),
      silver: adjustMetal(result.silver, "silver"),
    };
  }

  async function fetchPrices() {
    const providerKey = cfg().provider;
    const providerFn = PROVIDERS[providerKey];
    if (!providerFn) throw new Error(`Unknown spot price provider "${providerKey}" in config.js`);
    const result = await providerFn();
    result.fetchedAt = new Date();
    return result;
  }

  window.MTCPrices = { fetchPrices, applyPriceAdjustment, PROVIDERS };
})();
