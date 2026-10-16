import { t } from "./i18n.js";
import { config } from "./config.js";

export function whatsappLink() {
  const number = config.consultant.whatsapp.replace(/[^0-9]/g, "");
  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(t("contact.message", { name: config.consultant.name }))}`
    : "";
}

export function initPersonalization() {
  const links = {
    whatsapp: whatsappLink(),
    telegram: config.consultant.telegram,
    max: config.consultant.max,
  };
  document.querySelectorAll("[data-contact]").forEach((anchor) => {
    const link = links[anchor.dataset.contact];
    if (!link) {
      anchor.hidden = true;
      anchor.removeAttribute("href");
      return;
    }
    let valid = false;
    try {
      valid = new URL(link).protocol === "https:";
    } catch {
      /* URL incomplète. */
    }
    anchor.hidden = !valid;
    if (valid) {
      anchor.href = link;
      anchor.rel = "noopener noreferrer";
    } else anchor.removeAttribute("href");
  });
  document.querySelectorAll("[data-consultant-name]").forEach((element) => {
    element.textContent = config.consultant.name;
  });
  document.querySelectorAll("[data-consultant-photo]").forEach((image) => {
    image.src = config.consultant.photo;
    image.alt = config.consultant.name;
  });
  let pageUrl = new URL(location.href);
  if (config.site.url) {
    try {
      pageUrl = new URL(config.site.url);
    } catch {
      /* URL à compléter. */
    }
  }
  pageUrl.search = "";
  pageUrl.hash = "";
  document.querySelectorAll("[data-site-host]").forEach((element) => {
    element.textContent = pageUrl.host;
  });
  const description = t("meta.description", { name: config.consultant.name });
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content =
    description;
  document.querySelector('meta[property="og:url"]').content = pageUrl.href;
  document.querySelector('meta[property="og:image"]').content = new URL(
    config.site.shareImage,
    pageUrl,
  ).href;
  document.querySelector('meta[property="og:title"]').content = t(
    "meta.title",
    { name: config.consultant.name },
  );
  document.title = t("meta.title", { name: config.consultant.name });
}

window.addEventListener("languagechange", initPersonalization);
