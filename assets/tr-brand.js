(() => {
  "use strict";

  const applyLocalizedBrand = () => {
    const title = document.getElementById("profile-title");
    if (!title) return;

    title.textContent = document.documentElement.lang === "tr"
      ? "Çokluevren Terapisi"
      : "Multiversal Therapy";
  };

  applyLocalizedBrand();

  const observer = new MutationObserver(applyLocalizedBrand);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();
