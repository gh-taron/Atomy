import fr from "./locales/fr.js";
import en from "./locales/en.js";
import ru from "./locales/ru.js";
import productNames from "./locales/products.js";

const dictionaries = { fr, en, ru };
const storageKey = "atomy_language";
let language = "fr";

export function getLanguage() {
  return language;
}

export function t(key, values = {}) {
  const text = dictionaries[language][key] ?? fr[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    String(values[name] ?? match),
  );
}

export function productName(product) {
  return productNames[language]?.[product.id] || product.name;
}

export function translateRoot(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  for (const attribute of ["placeholder", "aria-label", "title", "alt"]) {
    root.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      element.setAttribute(
        attribute,
        t(element.getAttribute(`data-i18n-${attribute}`)),
      );
    });
  }
  root.querySelectorAll("[data-source-notice]").forEach((element) => {
    element.hidden = language === "ru";
    element.lang = language;
  });
}

export function setLanguage(value, persist = true) {
  if (!Object.hasOwn(dictionaries, value)) return;
  language = value;
  document.documentElement.lang = language;
  document.getElementById("languageSelect").value = language;
  if (persist) {
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      /* Stockage indisponible. */
    }
  }
  translateRoot();
  window.dispatchEvent(new CustomEvent("languagechange", { detail: language }));
}

export function initI18n() {
  let saved;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {
    /* Utiliser la langue par défaut. */
  }
  // Français par défaut ; le choix explicite du visiteur est prioritaire.
  setLanguage(
    saved && Object.hasOwn(dictionaries, saved) ? saved : "fr",
    false,
  );
  document
    .getElementById("languageSelect")
    .addEventListener("change", (event) => setLanguage(event.target.value));
}
