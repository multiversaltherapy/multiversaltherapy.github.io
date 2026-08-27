(() => {
  "use strict";

  const CANONICAL_URL = "https://multiversaltherapy.github.io/";
  const params = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
  const profileTitle = document.getElementById("profile-title");

  let currentLanguage = "en";
  let fallbackTimer = 0;

  const copy = {
    en: {
      brand: "Multiversal Therapy",
      pageTitle: "Multiversal Therapy | Official Links",
      officialLinks: "Official links",
      share: "Share",
      shareAria: "Share Multiversal Therapy",
      tagline: "What if fictional characters had therapy?",
      subline: "Psychological character studies across worlds, choices, and consequences.",
      navAria: "Official Multiversal Therapy profiles",
      youtubeAria: "Watch Multiversal Therapy on YouTube",
      youtubeKicker: "YouTube",
      youtubeTitle: "Open YouTube",
      youtubeDetail: "@multiversaltherapy · Official channel",
      instagramAria: "Follow Multiversal Therapy on Instagram",
      instagramTitle: "Open Instagram",
      instagramDetail: "@multiversaltherapy · Official profile",
      tiktokAria: "Watch Multiversal Therapy on TikTok",
      tiktokTitle: "Open TikTok",
      tiktokDetail: "@multiversaltherapy · Official profile",
      mobileNote: "On mobile, each button tries to open the installed app directly.",
      inAppNote: "You’re viewing this page inside an in-app browser. Tap a platform once to hand the link to its installed app.",
      fallbackTitle: "The app did not open.",
      fallbackInApp: "The in-app browser may have blocked the handoff to {platform}.",
      fallbackOther: "The app may not be installed or the operating system may have blocked the handoff.",
      retry: "Try {platform} App Again",
      continueWeb: "Continue on Web",
      browserHelp: "Still here? Use the browser menu to open this page in your external browser, then try again.",
      disclaimer: "Fictional character analysis for education and entertainment — not mental-health advice.",
      privacy: "No ad cookies · Anonymous metrics",
      privacyLink: "Privacy",
      shareOpened: "Share menu opened.",
      linkCopied: "Link copied.",
      copyFailed: "Copy failed. Use the address in your browser."
    },
    tr: {
      brand: "Çokluevren Terapisi",
      pageTitle: "Çokluevren Terapisi | Resmî Bağlantılar",
      officialLinks: "Resmî bağlantılar",
      share: "Paylaş",
      shareAria: "Çokluevren Terapisi bağlantısını paylaş",
      tagline: "Kurgusal karakterler terapi alsaydı ne olurdu?",
      subline: "Farklı evrenlerde karakterlerin psikolojisini, seçimlerini ve sonuçlarını inceliyoruz.",
      navAria: "Çokluevren Terapisi resmî profilleri",
      youtubeAria: "Çokluevren Terapisi YouTube hesabını aç",
      youtubeKicker: "YouTube",
      youtubeTitle: "YouTube’u Aç",
      youtubeDetail: "@multiversaltherapy · Resmî kanal",
      instagramAria: "Çokluevren Terapisi Instagram hesabını aç",
      instagramTitle: "Instagram’ı Aç",
      instagramDetail: "@multiversaltherapy · Resmî profil",
      tiktokAria: "Çokluevren Terapisi TikTok hesabını aç",
      tiktokTitle: "TikTok’u Aç",
      tiktokDetail: "@multiversaltherapy · Resmî profil",
      mobileNote: "Mobilde her buton, ilgili uygulama yüklüyse doğrudan açmayı dener.",
      inAppNote: "Bu sayfayı uygulama içi tarayıcıda görüntülüyorsunuz. Platform düğmesine dokunduğunuzda yüklü uygulamaya geçiş denenir.",
      fallbackTitle: "Uygulama açılamadı.",
      fallbackInApp: "Uygulama içi tarayıcı {platform} uygulamasına geçişi engellemiş olabilir.",
      fallbackOther: "Uygulama yüklü olmayabilir veya işletim sistemi geçişi engellemiş olabilir.",
      retry: "{platform} Uygulamasını Tekrar Dene",
      continueWeb: "Web’de Devam Et",
      browserHelp: "Hâlâ buradaysanız tarayıcı menüsünden harici tarayıcıda açın ve tekrar deneyin.",
      disclaimer: "Kurgusal karakter analizi eğitim ve eğlence amaçlıdır; ruh sağlığı tavsiyesi değildir.",
      privacy: "Reklam çerezi yok · Anonim ölçüm",
      privacyLink: "Gizlilik",
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

  const applyLanguage = (language, { persist = false } = {}) => {
    const nextLanguage = language === "tr" ? "tr" : "en";
    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;

    languageButtons.forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.language === nextLanguage ? "true" : "false");
    });

    profileTitle.textContent = t("brand");
    document.title = t("pageTitle");
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
    text("#privacy-link", "privacyLink");

    if (persist) {
      try { localStorage.setItem("mt-language", nextLanguage); } catch (_) {}
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

  const browserLanguage = () =>
    (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";

  const chooseInitialLanguage = () => {
    const explicit = params.get("lang");
    if (explicit === "tr" || explicit === "en") {
      return { language: explicit, source: "query" };
    }

    const saved = savedLanguage();
    if (saved) return { language: saved, source: "saved" };

    return { language: browserLanguage(), source: "browser" };
  };

  const setLanguageSource = source => {
    document.documentElement.dataset.languageSource = source;
  };

  const createFallbackUrl = platform => {
    const url = new URL(CANONICAL_URL);
    url.searchParams.set("fallback", platform);
    if (currentLanguage === "tr") url.searchParams.set("lang", "tr");
    return url.href;
  };

  const androidIntent = (deepLink, packageName, fallbackUrl) => {
    const split = deepLink.indexOf("://");
    const scheme = deepLink.slice(0, split);
    const target = deepLink.slice(split + 3);
    return `intent://${target}#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
  };

  const routes = {
    youtube: {
      name: "YouTube",
      web: "https://www.youtube.com/@multiversaltherapy",
      deep: "vnd.youtube://www.youtube.com/@multiversaltherapy?feature=applinks",
      androidPackage: "com.google.android.youtube"
    },
    instagram: {
      name: "Instagram",
      web: "https://www.instagram.com/multiversaltherapy/",
      deep: "instagram://user?username=multiversaltherapy",
      androidPackage: "com.instagram.android"
    },
    tiktok: {
      name: "TikTok",
      web: "https://www.tiktok.com/@multiversaltherapy",
      deep: "snssdk1233://user/profile/7662102949010785301?refer=web",
      androidPackage: "com.zhiliaoapp.musically"
    }
  };

  const targetForDevice = (platform, route) => {
    if (isAndroid) return androidIntent(route.deep, route.androidPackage, createFallbackUrl(platform));
    if (isIOS) return route.deep;
    return route.web;
  };

  const clearFallbackTimer = () => {
    if (!fallbackTimer) return;
    window.clearTimeout(fallbackTimer);
    fallbackTimer = 0;
  };

  const showFallback = (platform, route) => {
    clearFallbackTimer();
    fallbackTitle.textContent = `${t("fallbackTitle").replace(/\.$/, "")} — ${route.name}`;
    fallbackCopy.textContent = isInAppBrowser ? format(t("fallbackInApp"), route.name) : t("fallbackOther");
    retryAppLink.href = targetForDevice(platform, route);
    retryAppLink.dataset.platform = platform;
    retryAppLink.textContent = format(t("retry"), route.name);
    openWebLink.href = route.web;
    openWebLink.textContent = t("continueWeb");
    externalBrowserHelp.textContent = t("browserHelp");
    externalBrowserHelp.hidden = !isInAppBrowser;
    fallbackPanel.hidden = false;
  };

  const prepareAppAttempt = (platform, route) => {
    clearFallbackTimer();
    fallbackPanel.hidden = true;
    retryAppLink.href = targetForDevice(platform, route);
    openWebLink.href = route.web;
    fallbackTimer = window.setTimeout(() => {
      if (!document.hidden) showFallback(platform, route);
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

  const wireEvents = () => {
    languageButtons.forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.language, { persist: true });
        setLanguageSource("manual");
      });
    });

    shareButton.addEventListener("click", async () => {
      const shareData = { title: t("brand"), text: t("tagline"), url: CANONICAL_URL };
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
      link.href = targetForDevice(platform, route);
      link.addEventListener("click", () => {
        link.href = targetForDevice(platform, route);
        if (isMobile) prepareAppAttempt(platform, route);
      });
    });

    retryAppLink.addEventListener("click", () => {
      const platform = retryAppLink.dataset.platform;
      const route = routes[platform];
      if (!route) return;
      retryAppLink.href = targetForDevice(platform, route);
      if (isMobile) prepareAppAttempt(platform, route);
    });
  };

  const initialize = () => {
    const initialLanguage = chooseInitialLanguage();
    applyLanguage(initialLanguage.language);
    setLanguageSource(initialLanguage.source);
    wireEvents();
    inAppNote.hidden = !isInAppBrowser;

    const requestedFallback = params.get("fallback") || "";
    if (Object.prototype.hasOwnProperty.call(routes, requestedFallback)) {
      showFallback(requestedFallback, routes[requestedFallback]);
    }

    window.mtLanguageReady = Promise.resolve({
      language: currentLanguage,
      source: initialLanguage.source
    });
  };

  initialize();
  window.addEventListener("pagehide", clearFallbackTimer);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearFallbackTimer();
  });
})();
