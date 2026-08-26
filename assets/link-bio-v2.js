(() => {
  "use strict";

  const CANONICAL_URL = "https://multiversaltherapy.github.io/";
  const ANALYTICS_NAMESPACE = "multiversaltherapy.github.io";
  const ANALYTICS_BASE = "https://counterapi.com/api";
  const YOUTUBE_CHANNEL_ID = "UCPO0-IQp1HNt39COoYquIGg";
  const TIKTOK_USER_ID = "7662102949010785301";
  const params = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMobile = isAndroid || isIOS;
  const isInAppBrowser = /Instagram|FBAN|FBAV|TikTok|musical_ly|BytedanceWebview/i.test(userAgent);

  const languageButtons = Array.from(document.querySelectorAll(".language-button[data-language]"));
  const shareButton = document.getElementById("share-button");
  const shareStatus = document.getElementById("share-status");
  const inAppNote = document.getElementById("in-app-note");
  const fallbackPanel = document.getElementById("app-fallback");
  const fallbackTitle = document.getElementById("fallback-title");
  const fallbackCopy = document.getElementById("fallback-copy");
  const retryAppLink = document.getElementById("retry-app-link");
  const openWebLink = document.getElementById("open-web-link");
  const externalBrowserHelp = document.getElementById("external-browser-help");

  let currentLanguage = "en";
  let fallbackTimer = 0;

  const copy = {
    en: {
      officialLinks: "Official links",
      share: "Share",
      shareAria: "Share Multiversal Therapy",
      tagline: "What if fictional characters had therapy?",
      subline: "Psychological character studies across worlds, choices, and consequences.",
      navAria: "Official Multiversal Therapy profiles",
      youtubeAria: "Watch full videos by Multiversal Therapy on YouTube",
      youtubeKicker: "Full episodes",
      youtubeTitle: "Watch Full Videos on YouTube",
      youtubeDetail: "@multiversaltherapy · Long-form analyses",
      instagramAria: "Follow Multiversal Therapy on Instagram",
      instagramTitle: "Follow on Instagram",
      instagramDetail: "@multiversaltherapy · Visual stories & updates",
      tiktokAria: "Watch short analyses by Multiversal Therapy on TikTok",
      tiktokTitle: "Watch Short Analyses on TikTok",
      tiktokDetail: "@multiversaltherapy · Short-form videos",
      mobileNote: "On mobile, each button tries to open the installed app directly.",
      inAppNote: "You’re viewing this page inside an in-app browser. Tap a platform once to hand the link to its installed app.",
      fallbackTitle: "The app did not open.",
      fallbackInApp: "The in-app browser may have blocked the handoff to {platform}.",
      fallbackOther: "The app may not be installed or the operating system may have blocked the handoff.",
      retry: "Try {platform} App Again",
      continueWeb: "Continue on Web",
      browserHelp: "Still here? In Instagram, tap ⋮ and choose “Open in external browser,” then tap the platform again.",
      disclaimer: "Fictional character analysis for education and entertainment — not mental-health advice.",
      privacy: "No ad cookies · Anonymous usage metrics",
      geoPrivacy: "Country is used only to choose the initial TR/EN language.",
      shareOpened: "Share menu opened.",
      linkCopied: "Link copied.",
      copyFailed: "Copy failed. Use the address in your browser."
    },
    tr: {
      officialLinks: "Resmî bağlantılar",
      share: "Paylaş",
      shareAria: "Multiversal Therapy bağlantısını paylaş",
      tagline: "Kurgusal karakterler terapi alsaydı ne olurdu?",
      subline: "Farklı evrenlerde karakterlerin psikolojisini, seçimlerini ve sonuçlarını inceliyoruz.",
      navAria: "Multiversal Therapy resmî profilleri",
      youtubeAria: "Multiversal Therapy uzun videolarını YouTube’da izle",
      youtubeKicker: "Uzun bölümler",
      youtubeTitle: "YouTube’da Uzun Videoları İzle",
      youtubeDetail: "@multiversaltherapy · Uzun format analizler",
      instagramAria: "Multiversal Therapy hesabını Instagram’da takip et",
      instagramTitle: "Instagram’da Takip Et",
      instagramDetail: "@multiversaltherapy · Görsel hikâyeler ve güncellemeler",
      tiktokAria: "Multiversal Therapy kısa analizlerini TikTok’ta izle",
      tiktokTitle: "TikTok’ta Kısa Analizleri İzle",
      tiktokDetail: "@multiversaltherapy · Kısa format videolar",
      mobileNote: "Mobilde her buton, ilgili uygulama yüklüyse doğrudan açmayı dener.",
      inAppNote: "Bu sayfayı uygulama içi tarayıcıda görüntülüyorsunuz. Bağlantıyı yüklü uygulamaya aktarmak için platforma bir kez dokunun.",
      fallbackTitle: "Uygulama açılamadı.",
      fallbackInApp: "Uygulama içi tarayıcı {platform} uygulamasına geçişi engellemiş olabilir.",
      fallbackOther: "Uygulama yüklü olmayabilir veya işletim sistemi geçişi engellemiş olabilir.",
      retry: "{platform} Uygulamasını Tekrar Dene",
      continueWeb: "Web’de Devam Et",
      browserHelp: "Hâlâ buradaysanız Instagram’da ⋮ menüsüne dokunup “Harici tarayıcıda aç” seçeneğini seçin; ardından platforma tekrar dokunun.",
      disclaimer: "Kurgusal karakter analizi eğitim ve eğlence amaçlıdır; ruh sağlığı tavsiyesi değildir.",
      privacy: "Reklam çerezi yok · Anonim kullanım ölçümü",
      geoPrivacy: "Ülke bilgisi yalnızca başlangıç TR/EN dilini seçmek için kullanılır.",
      shareOpened: "Paylaşım menüsü açıldı.",
      linkCopied: "Bağlantı kopyalandı.",
      copyFailed: "Kopyalama başarısız oldu. Tarayıcıdaki adresi kullanın."
    }
  };

  const t = key => copy[currentLanguage][key] || copy.en[key] || key;
  const text = (selector, key) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = t(key);
  };
  const format = (template, platform) => template.replace("{platform}", platform);

  const trackEvent = (action, key) => {
    const safeAction = String(action).toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 64);
    const safeKey = String(key).toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 96);
    if (!safeAction || !safeKey) return;

    const url = `${ANALYTICS_BASE}/${encodeURIComponent(ANALYTICS_NAMESPACE)}/${encodeURIComponent(safeAction)}/${encodeURIComponent(safeKey)}?trackOnly=true`;
    fetch(url, { method: "GET", mode: "cors", credentials: "omit", cache: "no-store", keepalive: true }).catch(() => {});
  };

  const normalizeSource = value => {
    const source = String(value || "").trim().toLowerCase();
    if (["ig", "instagram"].includes(source)) return "instagram";
    if (["tt", "tiktok"].includes(source)) return "tiktok";
    if (["yt", "youtube"].includes(source)) return "youtube";
    if (["direct", "none"].includes(source)) return "direct";
    return "";
  };

  const detectSource = () => {
    const explicit = normalizeSource(params.get("src") || params.get("utm_source"));
    if (explicit) return explicit;
    if (/Instagram|FBAN|FBAV/i.test(userAgent)) return "instagram";
    if (/TikTok|musical_ly|BytedanceWebview/i.test(userAgent)) return "tiktok";
    if (/YouTube/i.test(userAgent)) return "youtube";

    const referrer = (document.referrer || "").toLowerCase();
    if (referrer.includes("instagram.com")) return "instagram";
    if (referrer.includes("tiktok.com")) return "tiktok";
    if (referrer.includes("youtube.com") || referrer.includes("youtu.be")) return "youtube";
    return referrer ? "other" : "direct";
  };

  const source = detectSource();

  const applyLanguage = (language, { persist = false, trackSwitch = false } = {}) => {
    const nextLanguage = language === "tr" ? "tr" : "en";
    const previousLanguage = currentLanguage;
    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;

    languageButtons.forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.language === nextLanguage ? "true" : "false");
    });

    text(".eyebrow", "officialLinks");
    text(".share-label", "share");
    shareButton.setAttribute("aria-label", t("shareAria"));
    text(".tagline", "tagline");
    text(".subline", "subline");
    document.querySelector(".links").setAttribute("aria-label", t("navAria"));

    const youtubeLink = document.getElementById("youtube-link");
    youtubeLink.setAttribute("aria-label", t("youtubeAria"));
    text("#youtube-link .link-kicker", "youtubeKicker");
    text("#youtube-link .link-title", "youtubeTitle");
    text("#youtube-link .link-detail", "youtubeDetail");

    const instagramLink = document.querySelector('[data-platform="instagram"]');
    instagramLink.setAttribute("aria-label", t("instagramAria"));
    text('[data-platform="instagram"] .link-title', "instagramTitle");
    text('[data-platform="instagram"] .link-detail', "instagramDetail");

    const tiktokLink = document.querySelector('[data-platform="tiktok"]');
    tiktokLink.setAttribute("aria-label", t("tiktokAria"));
    text('[data-platform="tiktok"] .link-title', "tiktokTitle");
    text('[data-platform="tiktok"] .link-detail', "tiktokDetail");

    text("#mobile-note-text", "mobileNote");
    text("#in-app-note", "inAppNote");
    text("#fallback-title", "fallbackTitle");
    text("#open-web-link", "continueWeb");
    text("#external-browser-help", "browserHelp");
    text("#footer-disclaimer", "disclaimer");
    text("#privacy-note", "privacy");
    text("#geo-privacy", "geoPrivacy");

    document.title = nextLanguage === "tr" ? "Multiversal Therapy | Resmî Bağlantılar" : "Multiversal Therapy | Official Links";

    if (persist) {
      try { localStorage.setItem("mt-language", nextLanguage); } catch (_) {}
    }
    if (trackSwitch && previousLanguage !== nextLanguage) {
      trackEvent("language_switch", `${previousLanguage}_to_${nextLanguage}`);
    }
  };

  const savedLanguage = () => {
    try {
      const value = localStorage.getItem("mt-language");
      return value === "tr" || value === "en" ? value : "";
    } catch (_) {
      return "";
    }
  };

  const fetchCountry = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1400);
    try {
      const response = await fetch("https://ipapi.co/country/", { method: "GET", mode: "cors", credentials: "omit", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Country lookup failed");
      return (await response.text()).trim().toUpperCase();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const chooseInitialLanguage = async () => {
    const explicit = params.get("lang");
    if (explicit === "tr" || explicit === "en") {
      applyLanguage(explicit);
      return explicit;
    }

    const saved = savedLanguage();
    if (saved) {
      applyLanguage(saved);
      return saved;
    }

    try {
      const country = await fetchCountry();
      const language = country === "TR" ? "tr" : "en";
      applyLanguage(language);
      return language;
    } catch (_) {
      const language = (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
      applyLanguage(language);
      return language;
    }
  };

  const createFallbackUrl = platform => {
    const url = new URL(CANONICAL_URL);
    url.searchParams.set("fallback", platform);
    if (source !== "direct" && source !== "other") url.searchParams.set("src", source);
    if (currentLanguage === "tr") url.searchParams.set("lang", "tr");
    return url.href;
  };

  const androidIntent = (deepLink, packageName, fallbackUrl) => {
    const split = deepLink.indexOf("://");
    const scheme = deepLink.slice(0, split);
    const target = deepLink.slice(split + 3);
    return `intent://${target}#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
  };

  const buildRoutes = () => {
    const youtubeWeb = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
    const youtubeDeep = `vnd.youtube://${youtubeWeb.slice("https://".length)}?feature=applinks`;
    const instagramWeb = "https://www.instagram.com/multiversaltherapy/";
    const instagramDeep = "instagram://user?username=multiversaltherapy";
    const tiktokWeb = "https://www.tiktok.com/@multiversaltherapy";
    const tiktokDeep = `snssdk1233://user/profile/${TIKTOK_USER_ID}?params_url=${encodeURIComponent(tiktokWeb)}&refer=web`;

    return {
      youtube: { name: "YouTube", web: youtubeWeb, deep: youtubeDeep, android: androidIntent(youtubeDeep, "com.google.android.youtube", createFallbackUrl("youtube")) },
      instagram: { name: "Instagram", web: instagramWeb, deep: instagramDeep, android: androidIntent(instagramDeep, "com.instagram.android", createFallbackUrl("instagram")) },
      tiktok: { name: "TikTok", web: tiktokWeb, deep: tiktokDeep, android: androidIntent(tiktokDeep, "com.zhiliaoapp.musically", createFallbackUrl("tiktok")) }
    };
  };

  const targetForDevice = route => isAndroid ? route.android : (isIOS ? route.deep : route.web);

  const clearFallbackTimer = () => {
    if (!fallbackTimer) return;
    window.clearTimeout(fallbackTimer);
    fallbackTimer = 0;
  };

  const showFallback = route => {
    clearFallbackTimer();
    fallbackTitle.textContent = `${t("fallbackTitle").replace(/\.$/, "")} — ${route.name}`;
    fallbackCopy.textContent = isInAppBrowser ? format(t("fallbackInApp"), route.name) : t("fallbackOther");
    retryAppLink.href = targetForDevice(route);
    retryAppLink.textContent = format(t("retry"), route.name);
    openWebLink.href = route.web;
    openWebLink.textContent = t("continueWeb");
    externalBrowserHelp.textContent = t("browserHelp");
    externalBrowserHelp.hidden = !isInAppBrowser;
    fallbackPanel.hidden = false;
    trackEvent("app_fallback", route.name.toLowerCase());
  };

  const prepareAppAttempt = route => {
    clearFallbackTimer();
    fallbackPanel.hidden = true;
    retryAppLink.href = targetForDevice(route);
    openWebLink.href = route.web;
    fallbackTimer = window.setTimeout(() => {
      if (!document.hidden) showFallback(route);
    }, 1600);
  };

  const announce = message => {
    shareStatus.textContent = "";
    window.setTimeout(() => { shareStatus.textContent = message; }, 20);
  };

  const copyLink = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(CANONICAL_URL);
      return;
    }
    const input = document.createElement("textarea");
    input.value = CANONICAL_URL;
    input.readOnly = true;
    input.className = "copy-helper";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("Clipboard fallback failed");
  };

  const wireEvents = routes => {
    languageButtons.forEach(button => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language, { persist: true, trackSwitch: true }));
    });

    shareButton.addEventListener("click", async () => {
      trackEvent("click", "share");
      const shareData = { title: "Multiversal Therapy", text: t("tagline"), url: CANONICAL_URL };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          announce(t("shareOpened"));
          return;
        }
        await copyLink();
        announce(t("linkCopied"));
      } catch (error) {
        if (error && error.name === "AbortError") return;
        try { await copyLink(); announce(t("linkCopied")); }
        catch (_) { announce(t("copyFailed")); }
      }
    });

    document.querySelectorAll(".social-link[data-platform]").forEach(link => {
      const platform = link.dataset.platform;
      const route = routes[platform];
      if (!route) return;
      link.href = targetForDevice(route);
      link.addEventListener("click", () => {
        trackEvent("click", platform);
        retryAppLink.dataset.platform = platform;
        if (isMobile) prepareAppAttempt(route);
      });
    });

    retryAppLink.addEventListener("click", () => {
      const platform = retryAppLink.dataset.platform;
      const route = routes[platform];
      if (!route) return;
      trackEvent("retry_app", platform);
      if (isMobile) prepareAppAttempt(route);
    });
  };

  const initialize = async () => {
    const initialLanguage = await chooseInitialLanguage();
    const routes = buildRoutes();
    wireEvents(routes);
    inAppNote.hidden = !isInAppBrowser;

    trackEvent("page_view", "home");
    trackEvent("source", source);
    trackEvent("language", initialLanguage);

    const requestedFallback = params.get("fallback") || "";
    if (Object.prototype.hasOwnProperty.call(routes, requestedFallback)) {
      retryAppLink.dataset.platform = requestedFallback;
      showFallback(routes[requestedFallback]);
    }
  };

  initialize();
  window.addEventListener("pagehide", clearFallbackTimer);
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearFallbackTimer(); });
})();
