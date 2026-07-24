/**
 * config.js — Morgan Trading Company Live TV Display
 * Everything an owner needs to customize lives here.
 * Loaded as a plain <script> so it sets window.MTC_CONFIG globally.
 */
window.MTC_CONFIG = {
  business: {
    name: "Morgan Trading Company",
    tagline: "Current Spot Prices",
    logoPath: null, // e.g. "assets/icons/logo.svg"
  },

  api: {
    provider: "goldapi", // "demo" | "goldapi" | "metalsdev" | "currentgold"
    goldapi: { apiKey: "goldapi-597e29075eb7cb7f0166ce8074455e96-io", baseUrl: "https://www.goldapi.io/api" },
    metalsdev: { apiKey: "YOUR_METALS_DEV_KEY", baseUrl: "https://api.metals.dev/v1" },
    currentgold: { apiKey: "YOUR_CURRENT_GOLD_KEY", baseUrl: "https://api.current.gold/v1" },
    refreshIntervalSeconds: 1800,
    retryIntervalSeconds: 15,
    marketHours: { startHour: 9, endHour: 17 }, // 24h local time; refreshes only fetch live prices in this window
  },

  slideshow: {
    imageFolder: "images/",
    mediaFolder: "media/",
    slideDurationSeconds: 10,
    crossfadeSeconds: 1,
    shuffle: false,
    manifestPath: "images/manifest.json",
    videoManifestPath: "media/manifest.json",
    videoFrequency: 4, // 1 video slide every N regular slides (0 = off)
    // Filenames listed here fill the screen edge-to-edge (may crop) instead of
    // the default fit-to-viewport (never crops, may letterbox).
    fillScreenImages: [
      "estate-jewelry-01.jpg", "jewelry-01.jpg", "rare-coins-05.jpg",
      "silver-bars-01.jpg", "coin-collections-01.jpg", "coin-collections-02.jpg", "coin-collections-03.jpg", "coin-collections-04.jpg",
      "firearms-01.jpg",
    ],
    // Per-filename background-position override for fill-screen images, when
    // centering crops out the interesting part of the photo.
    imagePosition: {
      "firearms-01.jpg": "center 55%",
    },
    // Per-filename caption text color override, for photos with a light/white
    // background where the default gold caption text is hard to read.
    captionColor: {},
  },

  promotions: {
    enabled: true,
    dataPath: "promotions.json",
    everyNSlides: 5, // 1 promo slide every N regular slides (0 = off)
  },

  ticker: {
    dataPath: "ticker.json",
    speedPxPerSecond: 90,
  },

  clock: {
    locale: "en-US",
    hour12: true,
    showSeconds: true,
    dateFormatOptions: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  },

  theme: {
    background: "#111111",
    gold: "#D4AF37",
    silver: "#C0C0C0",
    white: "#FFFFFF",
    divider: "#444444",
    accent: "#8B6F2A",
  },

  offline: {
    showLastUpdatedLabel: true,
    storageKey: "mtc_last_prices_v1",
  },
};
