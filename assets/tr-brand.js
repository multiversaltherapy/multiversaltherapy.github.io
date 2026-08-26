(() => {
  "use strict";

  const ensureVisualRefresh = () => {
    if (!document.querySelector('link[data-visual-refresh]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "assets/visual-refresh.css";
      link.dataset.visualRefresh = "true";
      document.head.appendChild(link);
    }

    const avatar = document.querySelector(".avatar");
    if (avatar) {
      avatar.src = "assets/profile-v2.webp";
      avatar.removeAttribute("srcset");
      avatar.sizes = "136px";
    }
  };

  const applyLocalizedBrand = () => {
    const title = document.getElementById("profile-title");
    if (!title) return;

    title.textContent = document.documentElement.lang === "tr"
      ? "Çokluevren Terapisi"
      : "Multiversal Therapy";
  };

  ensureVisualRefresh();
  applyLocalizedBrand();

  const observer = new MutationObserver(applyLocalizedBrand);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();
