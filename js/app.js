import { initI18n } from "./i18n.js";
import { initPersonalization } from "./personalization.js";
import { initCountries } from "./countries.js";
import { initUi } from "./ui.js";
import { initCatalog } from "./catalog.js";
import {
  initRegistration,
  showRegistrationForm,
  hideRegistrationForm,
  showStep,
} from "./registration.js";
import { initChat } from "./chat.js";
import { copyText } from "./utils.js";

// Compatibilité avec les actions HTML existantes ; le code métier reste dans ses modules.
Object.assign(window, {
  showRegistrationForm,
  hideRegistrationForm,
  showStep,
  returnToMainFromSuccess: hideRegistrationForm,
  returnToMainFromError: hideRegistrationForm,
  copyToClipboard: (id, button) =>
    copyText(document.getElementById(id).textContent, button).catch(() => {}),
});

initI18n();
initPersonalization();
initCountries();
initUi();
initRegistration();
initChat();
initCatalog();
