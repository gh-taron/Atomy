import { t } from "./i18n.js";
import { config } from "./config.js";
import { initRegistrationLayout } from "./registration-layout.js";
import { normalizePhone, sendRegistration } from "./utils.js";

const id = (value) => document.getElementById(value);
let submitting = false;

export function showRegistrationForm() {
  window.atomiChat?.closeChat();
  const productModal = document.querySelector(".modal.show");
  if (productModal) {
    productModal.addEventListener("hidden.bs.modal", showRegistrationForm, {
      once: true,
    });
    bootstrap.Modal.getInstance(productModal)?.hide();
    return;
  }
  [
    "mainContent",
    "registrationSuccessContainer",
    "registrationSuccessNoRegContainer",
    "registrationErrorContainer",
    "atomi-chat-widget",
    "cookieConsent",
  ].forEach((name) => {
    if (id(name)) id(name).style.display = "none";
  });
  document.documentElement.classList.add("registration-page");
  id("registrationFormContainer").style.display = "block";
  showStep(1);
  window.scrollTo(0, 0);
}

export function hideRegistrationForm() {
  document.documentElement.classList.remove("registration-page");
  [
    "registrationFormContainer",
    "registrationSuccessContainer",
    "registrationSuccessNoRegContainer",
    "registrationErrorContainer",
  ].forEach((name) => {
    id(name).style.display = "none";
  });
  id("mainContent").style.display = "block";
  id("atomi-chat-widget").style.display = "block";
  if (!document.cookie.includes("cookieAccepted=true"))
    id("cookieConsent").style.display = "block";
  if (location.hash === "#openform")
    history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);
}

export function showStep(step) {
  [1, 2, 3, 4].forEach((number) =>
    id(`step${number}`).classList.toggle("d-none", number !== step),
  );
  if (step === 3) populateSummary();
}

function validateBirthDate() {
  const day = Number(id("birth_day").value);
  const month = Number(id("birth_month").value);
  const year = Number(id("birth_year").value);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  )
    age--;
  const valid =
    /^\d{4}$/.test(id("birth_year").value) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    age >= 18 &&
    age <= 90;
  id("birth_year").setCustomValidity(valid ? "" : t("birth.invalid"));
  if (valid)
    id("birth_date_combined").value =
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return valid;
}

function getPayload() {
  const form = id("form-step-1");
  const data = Object.fromEntries(new FormData(form));
  ["birth_day", "birth_month", "birth_year"].forEach((key) => delete data[key]);
  data.phone = normalizePhone(id("inputPhone").value);
  data.address = id("address").value.trim();
  data.consents = Object.fromEntries(
    [...id("form-step-2").querySelectorAll("input[name]")].map((input) => [
      input.name,
      input.checked,
    ]),
  );
  return data;
}

function populateSummary() {
  const data = getPayload();
  Object.entries(data).forEach(([key, value]) => {
    const element = id(`summary-${key}`);
    if (element) element.textContent = value;
  });
  id("summary-nationality").textContent =
    id("selectNationality").selectedOptions[0]?.textContent || "";
  id("summary-gender").textContent =
    data.gender === "M" ? t("text.174") : t("text.175");
}

async function submit(event) {
  event.preventDefault();
  if (submitting) return;
  const form = id("form-step-2");
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const message = id("registrationStatus");
  message.textContent = "";
  if (!config.registration.endpoint) {
    message.textContent = t("registration.disabled");
    return;
  }
  submitting = true;
  button.disabled = true;
  button.textContent = t("registration.sending");
  try {
    await sendRegistration(config.registration.endpoint, getPayload());
    document.documentElement.classList.remove("registration-page");
    id("registrationFormContainer").style.display = "none";
    id("registrationSuccessNoRegContainer").style.display = "block";
    window.scrollTo(0, 0);
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitting = false;
    button.disabled = false;
    button.textContent = t("text.221");
  }
}

export function initRegistration() {
  initRegistrationLayout();
  const phone = id("inputPhone");
  id("phone-prefix").parentElement.style.display = "none";
  phone.placeholder = "+32470123456";
  phone.maxLength = 20;
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  ["birth_day", "birth_month", "birth_year"].forEach((name) =>
    id(name).addEventListener("input", () =>
      id("birth_year").setCustomValidity(""),
    ),
  );
  id("toStep2").addEventListener("click", () => {
    validateBirthDate();
    try {
      normalizePhone(phone.value);
      phone.setCustomValidity("");
    } catch (error) {
      phone.setCustomValidity(error.message);
    }
    if (id("form-step-1").reportValidity()) showStep(2);
  });
  id("form-step-1").addEventListener("submit", (event) => {
    event.preventDefault();
    id("toStep2").click();
  });
  id("toStep3Address").addEventListener("click", () => {
    id("address").setCustomValidity(
      id("address").value.trim().length >= 3 ? "" : t("address.invalid"),
    );
    if (id("address").reportValidity()) showStep(3);
  });
  id("address").addEventListener("input", () =>
    id("address").setCustomValidity(""),
  );
  id("exitRegistration").addEventListener("click", hideRegistrationForm);
  id("form-step-2").addEventListener("submit", submit);
  const checkboxes = [
    ...id("form-step-2").querySelectorAll(
      'input[type="checkbox"]:not(#confirmAll)',
    ),
  ];
  checkboxes.forEach((input) => {
    input.checked = false;
    input.addEventListener("change", () => {
      id("confirmAll").checked = checkboxes
        .filter((item) => item.required)
        .every((item) => item.checked);
    });
  });
  id("confirmAll").checked = false;
  id("confirmAll").addEventListener("change", () =>
    checkboxes.forEach((input) => {
      input.checked = id("confirmAll").checked;
    }),
  );
  document.addEventListener("click", (event) => {
    if (event.target.closest('[data-action="register"]')) {
      event.preventDefault();
      showRegistrationForm();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      id("registrationFormContainer").style.display === "block" &&
      !submitting
    )
      hideRegistrationForm();
  });
  if (!config.registration.endpoint) {
    const notice = document.createElement("p");
    notice.className = "alert alert-info";
    notice.dataset.i18n = "registration.preview";
    notice.textContent = t("registration.preview");
    id("step1").prepend(notice);
  }
  const fromHash = () => {
    if (location.hash === "#openform") showRegistrationForm();
  };
  window.addEventListener("hashchange", fromHash);
  fromHash();
}

window.addEventListener("languagechange", () => {
  const status = id("registrationStatus");
  if (status) status.textContent = "";
  if (id("step3") && !id("step3").classList.contains("d-none"))
    populateSummary();
  ["inputPhone", "birth_year", "address"].forEach((name) =>
    id(name)?.setCustomValidity(""),
  );
});
