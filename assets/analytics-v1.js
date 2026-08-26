(() => {
  "use strict";

  const BASE = "https://counterapi.com/api";
  const NAMESPACE = "multiversaltherapy.github.io";
  const params = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const fallbackPlatform = params.get("fallback") || "";
  const isFallbackReturn = ["youtube", "instagram", "tiktok"].includes(fallbackPlatform);

  const normalizeSource = value => {
    const source = String(value || "").trim().toLowerCase();
    if (["ig", "instagram"].includes(source)) return "instagram";
    if (["tt", "tiktok"].includes(source)) return "tiktok";
    if (["yt", "youtube"].includes(source)) return "youtube";
    if (["fb", "facebook"].includes(source)) return "facebook";
    if (["direct", "none"].includes(source)) return "direct";
    return "";
  };

  const detectSource = () => {
    const explicit = normalizeSource(params.get("src") || params.get("utm_source"));
    if (explicit) return explicit;
    if (/Instagram/i.test(userAgent)) return "instagram";
    if (/TikTok|musical_ly|BytedanceWebview/i.test(userAgent)) return "tiktok";
    if (/YouTube/i.test(userAgent)) return "youtube";
    if (/FBAN|FBAV/i.test(userAgent)) return "facebook";
    const referrer = (document.referrer || "").toLowerCase();
    if (referrer.includes("instagram.com")) return "instagram";
    if (referrer.includes("tiktok.com")) return "tiktok";
    if (referrer.includes("youtube.com") || referrer.includes("youtu.be")) return "youtube";
    if (referrer.includes("facebook.com") || referrer.includes("fb.com")) return "facebook";
    return referrer ? "other" : "direct";
  };

  const track = (action, key) => {
    const safeAction = String(action).toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 64);
    const safeKey = String(key).toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 96);
    if (!safeAction || !safeKey) return;
    const url = `${BASE}/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(safeAction)}/${encodeURIComponent(safeKey)}?trackOnly=true`;
    fetch(url, { method: "GET", mode: "cors", credentials: "omit", cache: "no-store", keepalive: true }).catch(() => {});
  };

  const currentLanguage = () => document.documentElement.lang === "tr" ? "tr" : "en";
  let lastLanguage = currentLanguage();

  const updatePrivacyLabel = () => {
    const node = document.getElementById("privacy-note");
    if (!node) return;
    node.textContent = currentLanguage() === "tr"
      ? "Reklam çerezi yok · Anonim ölçüm · Oturumluk IP-ülke dil seçimi"
      : "No ad cookies · Anonymous metrics · Session-based IP-country language";
  };

  document.querySelectorAll(".social-link[data-platform]").forEach(link => {
    link.addEventListener("click", () => track("click", link.dataset.platform));
  });

  const share = document.getElementById("share-button");
  if (share) share.addEventListener("click", () => track("click", "share"));

  const retry = document.getElementById("retry-app-link");
  if (retry) retry.addEventListener("click", () => {
    const platform = retry.dataset.platform;
    if (platform) track("retry_app", platform);
  });

  document.querySelectorAll(".language-button[data-language]").forEach(button => {
    button.addEventListener("click", () => {
      const next = button.dataset.language === "tr" ? "tr" : "en";
      if (next !== lastLanguage) track("language_switch", `${lastLanguage}_to_${next}`);
      lastLanguage = next;
    }, { capture: true });
  });

  const observer = new MutationObserver(() => {
    lastLanguage = currentLanguage();
    updatePrivacyLabel();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  updatePrivacyLabel();

  if (isFallbackReturn) {
    track("app_fallback", fallbackPlatform);
  } else {
    track("page_view", "home");
    track("source", detectSource());

    const languageReady = window.mtLanguageReady;
    if (languageReady && typeof languageReady.then === "function") {
      languageReady.then(
        () => track("language", currentLanguage()),
        () => track("language", currentLanguage())
      );
    } else {
      track("language", currentLanguage());
    }
  }
})();
