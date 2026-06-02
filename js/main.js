/**
 * main.js — Hamov Patar
 * Handles: language switch, menu rendering, header scroll, burger, reveal animations
 */
(function () {
  "use strict";

  let currentLang = localStorage.getItem("hp_lang") || "ru";
  let activeTab   = 0;

  const langToggle = document.getElementById("langToggle");
  const langRU     = document.getElementById("langRU");
  const langHY     = document.getElementById("langHY");
  const burger     = document.getElementById("burger");
  const nav        = document.getElementById("nav");
  const header     = document.getElementById("header");
  const menuGrid   = document.getElementById("menuGrid");

  /* ── Translation helper (for data-key elements) ── */
  function t(key) {
    const dict = window.TRANSLATIONS[currentLang];
    const ru   = window.TRANSLATIONS["ru"];
    const val  = dict ? dict[key] : undefined;
    if (val === undefined || val === null || val === "")
      return (ru && ru[key] !== undefined) ? ru[key] : "";
    return val;
  }

  /* ── Apply language to ALL translatable elements ── */
  function applyLanguage() {
    document.documentElement.lang = currentLang === "hy" ? "hy" : "ru";

    /* 1. Elements with data-ru / data-hy attributes (HTML-inline translations) */
    document.querySelectorAll("[data-ru]").forEach(el => {
      const ru = el.dataset.ru;
      const hy = el.dataset.hy;
      if (currentLang === "hy" && hy && hy.trim() !== "") {
        el.textContent = hy;
      } else {
        el.textContent = ru;
      }
    });

    /* 2. Elements with data-key (JS translations.js driven) */
    document.querySelectorAll("[data-key]").forEach(el => {
      el.textContent = t(el.dataset.key);
    });

    /* 3. Logo sub — driven by translations.js */
    const logoSub = document.querySelector(".logo__sub");
    if (logoSub) {
      const val = t("logo_sub");
      if (val) logoSub.textContent = val;
    }

    /* 4. Toggle button highlight */
    langRU.classList.toggle("active", currentLang === "ru");
    langHY.classList.toggle("active", currentLang === "hy");

    buildMenu();
  }

  /* ── Language toggle ── */
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "hy" : "ru";
    localStorage.setItem("hp_lang", currentLang);
    applyLanguage();
  });

  /* ── Build menu from translations.js ── */
  function buildMenu() {
    if (!menuGrid) return;

    const ruCats = window.TRANSLATIONS.ru.menu_categories || [];
    const hyCats = window.TRANSLATIONS.hy.menu_categories || [];

    const cats = ruCats.map((ruCat, i) => {
      const hyCat = hyCats[i] || {};
      const name  = (currentLang === "hy" && hyCat.name && hyCat.name !== "")
        ? hyCat.name : ruCat.name;
      const items = ruCat.items.map((rItem, j) => {
        const hItem = (hyCat.items && hyCat.items[j]) || {};
        return {
          name: (currentLang === "hy" && hItem.name && hItem.name !== "") ? hItem.name : rItem.name,
          desc: (currentLang === "hy" && hItem.desc && hItem.desc !== "") ? hItem.desc : rItem.desc
        };
      });
      return { emoji: ruCat.emoji, name, items };
    });

    if (activeTab >= cats.length) activeTab = 0;

    const tabsHTML = cats.map((cat, i) => `
      <button class="menu-tab ${i === activeTab ? "active" : ""}" data-idx="${i}" aria-selected="${i === activeTab}">
        <span class="menu-tab__emoji">${cat.emoji}</span>
        <span class="menu-tab__name">${cat.name}</span>
      </button>
    `).join("");

    const activeCat = cats[activeTab];
    const itemsHTML = activeCat.items.map(item => `
      <div class="menu-item reveal">
        <span class="menu-item__name">${item.name || "—"}</span>
        ${item.desc ? `<span class="menu-item__desc">${item.desc}</span>` : ""}
      </div>
    `).join("");

    menuGrid.innerHTML = `
      <div class="menu-tabs" id="menuTabs" role="tablist">${tabsHTML}</div>
      <div class="menu-panel" id="menuPanel" role="tabpanel">
        <div class="menu-panel__header">
          <span class="menu-panel__emoji">${activeCat.emoji}</span>
          <span class="menu-panel__title">${activeCat.name}</span>
        </div>
        <div class="menu-items">${itemsHTML || "<p class='menu-empty'>—</p>"}</div>
      </div>
    `;

    document.querySelectorAll(".menu-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = parseInt(btn.dataset.idx, 10);
        buildMenu();
        observeReveal();
      });
    });

    observeReveal();
  }

  /* ── Header scroll ── */
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });

  /* ── Burger ── */
  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("open");
      nav.classList.remove("open");
    });
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.08 }
  );

  function observeReveal() {
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
  }

  document.querySelectorAll(
    ".about__text, .about__visual, .contact__info, .contact__map-embed, .gallery__item, .badge"
  ).forEach(el => el.classList.add("reveal"));

  /* ── Init ── */
  applyLanguage();
  observeReveal();

})();
