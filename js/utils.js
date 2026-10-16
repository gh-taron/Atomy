import { t } from "./i18n.js";
export function normalizePhone(value) {
  const digits = String(value).replace(/[^0-9]/g, "");
  if (!/^[1-9][0-9]{6,14}$/.test(digits)) {
    throw new Error(t("phone.invalid"));
  }
  return `+${digits}`;
}

export function matchesSearch(query, text) {
  const words = String(query).trim().toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = String(text).toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

export async function copyText(text, button) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      markCopied(button);
      return;
    } catch {
      /* Essayer la copie classique. */
    }
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.append(field);
  field.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Copie indisponible");
    markCopied(button);
  } finally {
    field.remove();
    button?.focus();
  }
}

function markCopied(button) {
  if (!button) return;
  const label = button.getAttribute("aria-label");
  button.setAttribute("aria-label", t("copy.done"));
  button.classList.add("is-copied");
  setTimeout(() => {
    button.classList.remove("is-copied");
    if (label) button.setAttribute("aria-label", label);
    else button.removeAttribute("aria-label");
  }, 2000);
}

export async function sendRegistration(endpoint, payload) {
  if (!endpoint) throw new Error(t("registration.unavailable"));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(t("registration.error"));
  const result = await response.json();
  if (result.success !== true) throw new Error(t("registration.unconfirmed"));
  return result;
}
