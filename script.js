/**
 * script.js — Morgan Trading Company Live TV Display
 * Vanilla ES6. Reads from window.MTC_CONFIG and window.MTCPrices.
 * Responsibilities: clock, spot prices (with offline fallback),
 * slideshow (images + videos + seasonal promo slides), ticker.
 */
(function () {
  "use strict";
  const CFG = window.MTC_CONFIG;

  function applyBranding() {
    const root = document.documentElement.style;
    root.setProperty("--bg", CFG.theme.background);
    root.setProperty("--gold", CFG.theme.gold);
    root.setProperty("--silver", CFG.theme.silver);
    root.setProperty("--white", CFG.theme.white);
    root.setProperty("--divider", CFG.theme.divider);
    root.setProperty("--accent", CFG.theme.accent);

    document.getElementById("business-name").textContent = CFG.business.name;
    document.getElementById("business-tagline").textContent = CFG.business.tagline;
    document.title = `${CFG.business.name} — Live Display`;

    if (CFG.business.logoPath) {
      const h1 = document.getElementById("business-name");
      const img = document.createElement("img");
      img.src = CFG.business.logoPath;
      img.alt = CFG.business.name;
      img.style.maxHeight = "2.4em";
      img.style.display = "block";
      img.style.margin = "0 auto 0.3em";
      h1.parentNode.insertBefore(img, h1);
    }
  }

  // ---------------- CLOCK ----------------
  function startClock() {
    const timeEl = document.getElementById("clock-time");
    const meridiemEl = document.getElementById("clock-meridiem");
    const dateEl = document.getElementById("clock-date");
    const { locale, hour12, showSeconds, dateFormatOptions } = CFG.clock;

    function render() {
      const now = new Date();
      const timeOptions = { hour: "2-digit", minute: "2-digit", hour12 };
      if (showSeconds) timeOptions.second = "2-digit";

      let formatted = new Intl.DateTimeFormat(locale, timeOptions).format(now);
      let meridiem = "";
      if (hour12) {
        const match = formatted.match(/\s?(AM|PM)$/i);
        if (match) {
          meridiem = match[1].toUpperCase();
          formatted = formatted.replace(/\s?(AM|PM)$/i, "");
        }
      }
      timeEl.childNodes[0].nodeValue = formatted + " ";
      meridiemEl.textContent = meridiem;
      dateEl.textContent = new Intl.DateTimeFormat(locale, dateFormatOptions).format(now);
    }
    render();
    setInterval(render, 1000);
  }

  // ---------------- SPOT PRICES ----------------
  function formatUSD(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }
  function arrowGlyph(dir) { return dir === "up" ? "▲" : dir === "down" ? "▼" : "•"; }

  function renderMetal(name, data) {
    const priceEl = document.getElementById(`${name}-price`);
    const arrowEl = document.getElementById(`${name}-arrow`);
    const changeEl = document.getElementById(`${name}-change`);
    const priceContainer = priceEl.parentElement;

    priceEl.textContent = formatUSD(data.price);
    arrowEl.textContent = arrowGlyph(data.direction);
    arrowEl.className = `metal-arrow ${data.direction}`;

    const sign = data.changePercent > 0 ? "+" : "";
    changeEl.textContent = `${sign}${data.changePercent.toFixed(2)}%`;
    changeEl.className = `metal-change ${data.direction}`;

    priceContainer.classList.remove("flash");
    void priceContainer.offsetWidth;
    priceContainer.classList.add("flash");
  }

  function runSweep() {
    const sweep = document.getElementById("sweep-line");
    sweep.classList.remove("run");
    void sweep.offsetWidth;
    sweep.classList.add("run");
  }

  function setLastUpdatedLabel(date, reason) {
    const el = document.getElementById("last-updated");
    if (!CFG.offline.showLastUpdatedLabel) return;
    if (reason) {
      const time = new Intl.DateTimeFormat(CFG.clock.locale, { hour: "2-digit", minute: "2-digit" }).format(date);
      const prefix = reason === "closed" ? "Market Closed" : "Offline";
      el.textContent = `${prefix} — Last Updated ${time}`;
      el.classList.add("visible");
    } else {
      el.textContent = "";
      el.classList.remove("visible");
    }
  }

  function isMarketOpen(date) {
    const { startHour, endHour } = CFG.api.marketHours;
    const hour = date.getHours();
    return hour >= startHour && hour < endHour;
  }

  function msUntilMarketOpen(date) {
    const { startHour } = CFG.api.marketHours;
    const next = new Date(date);
    next.setHours(startHour, 0, 0, 0);
    if (next <= date) next.setDate(next.getDate() + 1);
    return next.getTime() - date.getTime();
  }

  function saveToCache(data) {
    try { localStorage.setItem(CFG.offline.storageKey, JSON.stringify(data)); }
    catch (e) { console.warn("Unable to cache prices:", e); }
  }
  function loadFromCache() {
    try {
      const raw = localStorage.getItem(CFG.offline.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  let priceTimer = null;
  function scheduleNext(seconds) {
    if (priceTimer) clearTimeout(priceTimer);
    priceTimer = setTimeout(refreshPrices, seconds * 1000);
  }

  async function refreshPrices() {
    const now = new Date();
    if (!isMarketOpen(now)) {
      const cached = loadFromCache();
      if (cached) {
        renderMetal("gold", cached.gold);
        renderMetal("silver", cached.silver);
        setLastUpdatedLabel(new Date(cached.fetchedAt), "closed");
      } else {
        setLastUpdatedLabel(now, "closed");
      }
      scheduleNext(msUntilMarketOpen(now) / 1000);
      return;
    }
    try {
      const data = await window.MTCPrices.fetchPrices();
      renderMetal("gold", data.gold);
      renderMetal("silver", data.silver);
      runSweep();
      setLastUpdatedLabel(data.fetchedAt, null);
      saveToCache({ gold: data.gold, silver: data.silver, fetchedAt: data.fetchedAt });
      scheduleNext(CFG.api.refreshIntervalSeconds);
    } catch (err) {
      console.error("Spot price fetch failed, falling back to cache:", err);
      const cached = loadFromCache();
      if (cached) {
        renderMetal("gold", cached.gold);
        renderMetal("silver", cached.silver);
        setLastUpdatedLabel(new Date(cached.fetchedAt), "offline");
      } else {
        setLastUpdatedLabel(new Date(), "offline");
      }
      scheduleNext(CFG.api.retryIntervalSeconds);
    }
  }

  // ---------------- SLIDESHOW (images + video + promos) ----------------
  const FALLBACK_IMAGE_LIST = [
    "gold-bars-01.jpg", "silver-bars-01.jpg",
    "american-eagles-01.jpg", "american-eagles-02.jpg", "american-eagles-03.jpg", "morgan-dollars-01.jpg", "morgan-dollars-02.jpg",
    "peace-dollars-01.jpg", "rare-coins-01.jpg", "rare-coins-02.jpg", "rare-coins-03.jpg", "rare-coins-04.jpg", "rare-coins-05.jpg", "jewelry-01.jpg",
    "luxury-watches-01.jpg", "estate-jewelry-01.jpg",
    "coin-collections-01.jpg", "store-interior-01.jpg",
  ];

  function captionFromFilename(filename) {
    return filename.replace(/\.[^/.]+$/, "").replace(/[-_]\d+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function discoverImages() {
    const { manifestPath, imageFolder } = CFG.slideshow;
    try {
      const res = await fetch(manifestPath, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.files;
        if (Array.isArray(list) && list.length) return list.map((f) => imageFolder + f);
      }
    } catch (e) { /* fall through */ }
    return FALLBACK_IMAGE_LIST.map((f) => imageFolder + f);
  }

  async function discoverVideos() {
    const { videoManifestPath, mediaFolder } = CFG.slideshow;
    try {
      const res = await fetch(videoManifestPath, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.files;
        if (Array.isArray(list) && list.length) {
          return list.filter((f) => /\.(mp4|webm)$/i.test(f)).map((f) => mediaFolder + f);
        }
      }
    } catch (e) { /* optional — no videos yet is fine */ }
    return [];
  }

  async function discoverPromotions() {
    const promoCfg = CFG.promotions;
    if (!promoCfg || !promoCfg.enabled) return [];
    try {
      const res = await fetch(promoCfg.dataPath, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      const list = Array.isArray(data.promotions) ? data.promotions : [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return list.filter((promo) => {
        if (promo.startDate && today < new Date(promo.startDate)) return false;
        if (promo.endDate && today > new Date(promo.endDate + "T23:59:59")) return false;
        return true;
      });
    } catch (e) {
      console.warn("Could not load promotions.json:", e);
      return [];
    }
  }

  function buildImageSlide(src) {
    const div = document.createElement("div");
    div.className = "slide slide--image";
    const filename = src.split("/").pop();
    const fillList = (CFG.slideshow && CFG.slideshow.fillScreenImages) || [];
    if (fillList.includes(filename)) div.classList.add("slide--image-fill");
    const positionMap = (CFG.slideshow && CFG.slideshow.imagePosition) || {};
    if (positionMap[filename]) div.style.backgroundPosition = positionMap[filename];
    div.style.backgroundImage = `url("${src}")`;
    const caption = document.createElement("div");
    caption.className = "slide-caption";
    caption.textContent = captionFromFilename(src.split("/").pop());
    div.appendChild(caption);
    return { el: div, kind: "image" };
  }

  function buildVideoSlide(src) {
    const div = document.createElement("div");
    div.className = "slide slide--video";
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    div.appendChild(video);
    const caption = document.createElement("div");
    caption.className = "slide-caption";
    caption.textContent = captionFromFilename(src.split("/").pop());
    div.appendChild(caption);
    return { el: div, kind: "video", videoEl: video };
  }

  function buildPromoSlide(promo) {
    const div = document.createElement("div");
    div.className = "slide slide--promo";
    if (promo.image) {
      div.classList.add("slide--promo-image");
      div.style.backgroundImage = `url("${promo.image}")`;
    }
    div.innerHTML = `
      <div class="promo-card">
        ${promo.badge ? `<div class="promo-badge">${promo.badge}</div>` : ""}
        <div class="promo-headline">${promo.headline}</div>
        ${promo.subtext ? `<div class="promo-subtext">${promo.subtext}</div>` : ""}
      </div>`;
    return { el: div, kind: "promo" };
  }

  function interleave(imageSlides, videoSlides, promoSlides, videoFrequency, promoFrequency) {
    const result = [];
    let videoPtr = 0, promoPtr = 0;
    imageSlides.forEach((slide, i) => {
      result.push(slide);
      const position = i + 1;
      if (videoSlides.length && videoFrequency > 0 && position % videoFrequency === 0) {
        result.push(videoSlides[videoPtr % videoSlides.length]); videoPtr++;
      }
      if (promoSlides.length && promoFrequency > 0 && position % promoFrequency === 0) {
        result.push(promoSlides[promoPtr % promoSlides.length]); promoPtr++;
      }
    });
    return result;
  }

  async function startSlideshow() {
    const container = document.getElementById("slideshow");
    const emptyState = document.getElementById("slideshow-empty");

    const [images, videos, promos] = await Promise.all([discoverImages(), discoverVideos(), discoverPromotions()]);

    if (!images.length && !videos.length && !promos.length) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    document.documentElement.style.setProperty("--crossfade", `${CFG.slideshow.crossfadeSeconds}s`);
    const slideDurationMs = CFG.slideshow.slideDurationSeconds * 1000;

    let imageOrder = images.slice();
    if (CFG.slideshow.shuffle) imageOrder = imageOrder.sort(() => Math.random() - 0.5);

    const imageSlides = imageOrder.map(buildImageSlide);
    const videoSlideDefs = videos.map(buildVideoSlide);
    const promoSlideDefs = promos.map(buildPromoSlide);

    const promoFrequency = (CFG.promotions && CFG.promotions.everyNSlides) || 0;
    const videoFrequency = CFG.slideshow.videoFrequency || 0;

    const playlist = interleave(imageSlides, videoSlideDefs, promoSlideDefs, videoFrequency, promoFrequency);
    if (!playlist.length) { emptyState.hidden = false; return; }

    playlist.forEach((slide, i) => {
      container.appendChild(slide.el);
      if (i === 0) slide.el.classList.add("active");
    });

    let currentIndex = 0;
    let advanceTimer = null;

    function activate(index) {
      const current = playlist[currentIndex];
      const next = playlist[index];
      next.el.classList.add("active");
      current.el.classList.remove("active");
      if (current.kind === "video" && current.videoEl) {
        current.videoEl.pause();
        current.videoEl.currentTime = 0;
      }
      currentIndex = index;
      if (next.kind === "video" && next.videoEl) {
        next.videoEl.play().catch(() => {});
      }
    }

    function scheduleAdvance(durationMs) {
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(advance, durationMs);
    }

    function advance() {
      const nextIndex = (currentIndex + 1) % playlist.length;
      activate(nextIndex);
      const next = playlist[nextIndex];
      if (next.kind === "video" && next.videoEl) {
        const nativeMs = isFinite(next.videoEl.duration) && next.videoEl.duration > 0 ? next.videoEl.duration * 1000 : slideDurationMs;
        scheduleAdvance(Math.min(nativeMs, slideDurationMs * 3));
      } else {
        scheduleAdvance(slideDurationMs);
      }
    }

    if (playlist[0].kind === "video" && playlist[0].videoEl) playlist[0].videoEl.play().catch(() => {});
    scheduleAdvance(slideDurationMs);
  }

  // ---------------- TICKER ----------------
  async function startTicker() {
    const track = document.getElementById("ticker-track");
    let messages = [];
    try {
      const res = await fetch(CFG.ticker.dataPath, { cache: "no-store" });
      const data = await res.json();
      messages = Array.isArray(data.messages) ? data.messages : [];
    } catch (e) {
      messages = ["BUYING GOLD", "BUYING SILVER", "TOP PRICES PAID", "FREE APPRAISALS"];
    }
    if (!messages.length) return;

    function buildItems() {
      return messages.map((msg) => `<span class="ticker-item">${msg}</span>`).join(`<span class="ticker-item">•</span>`);
    }
    track.innerHTML = buildItems() + buildItems();

    requestAnimationFrame(() => {
      const fullWidth = track.scrollWidth / 2;
      const duration = fullWidth / CFG.ticker.speedPxPerSecond;
      track.style.animationDuration = `${duration}s`;
    });
  }

  // ---------------- BOOT ----------------
  function boot() {
    applyBranding();
    startClock();
    refreshPrices();
    startSlideshow();
    startTicker();
    window.addEventListener("online", () => refreshPrices());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
