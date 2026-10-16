import { t, productName } from "./i18n.js";
import { config } from "./config.js";
import { getProducts } from "./catalog.js";
import { whatsappLink } from "./personalization.js";
import { escapeHtml } from "./utils.js";

class AtomiChatWidget {
  constructor() {
    this.isOpen = false;
    this.isLoading = false;
    this.loaderEl = null;
    this.welcomeShown = false;
    this.consultantName = config.consultant.name;
    this.consultantWa = config.consultant.whatsapp;
    this.waLink = whatsappLink();

    this.elements = {
      toggleBtn: document.getElementById("chat-toggle-btn"),
      container: document.getElementById("chat-container"),
      closeBtn: document.getElementById("chat-close-btn"),
      messagesContainer: document.getElementById("chat-messages"),
      input: document.getElementById("chat-input"),
      sendBtn: document.getElementById("chat-send-btn"),
      notificationBadge: document.querySelector(".chat-notification-badge"),
      overlay: document.getElementById("chat-overlay"),
    };
    this.init();
  }

  init() {
    if (!this.elements.toggleBtn || !this.elements.container) return;
    this.elements.toggleBtn.addEventListener("click", () => this.toggleChat());
    this.elements.closeBtn.addEventListener("click", () => this.closeChat());
    this.elements.overlay?.addEventListener("click", () => this.closeChat());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isOpen) this.closeChat();
    });
    this.elements.sendBtn.addEventListener("click", () => this.sendMessage());
    this.elements.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.elements.input.addEventListener("input", () => {
      this.elements.input.style.height = "auto";
      this.elements.input.style.height =
        this.elements.input.scrollHeight + "px";
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    if (window.innerWidth <= 768 && this.elements.overlay) {
      this.elements.overlay.classList.add("active");
    }
    this.elements.container.style.display = "flex";
    if (this.elements.notificationBadge) {
      this.elements.notificationBadge.style.display = "none";
    }
    if (!matchMedia("(pointer: coarse)").matches && this.elements.input) {
      this.elements.input.focus();
    }

    if (!this.welcomeShown) {
      this.showWelcomeMessage();
      this.welcomeShown = true;
    }
    this.pauseBootstrapFocusTrap(true);
  }

  closeChat() {
    this.isOpen = false;
    if (this.elements.overlay) {
      this.elements.overlay.classList.remove("active");
    }
    this.elements.container.style.display = "none";
    this.pauseBootstrapFocusTrap(false);
  }

  showWelcomeMessage() {
    this.addMessage(
      t("chat.welcome", { name: this.consultantName }),
      "assistant",
      false,
    );
    this.addQuickChips([
      { text: t("chat.register"), query: t("text.14") },
      { text: t("chat.delivery"), query: t("text.123") },
      { text: t("chat.catalog"), query: t("text.10") },
      { text: t("chat.whatsapp"), action: "whatsapp" },
    ]);
  }

  addQuickChips(chips) {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-quick-chips d-flex flex-wrap gap-2 my-2";
    chips.forEach((chip) => {
      if (chip.action === "whatsapp" && !this.waLink) return;
      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-primary rounded-pill";
      btn.textContent = chip.text;
      btn.addEventListener("click", () => {
        if (chip.action === "catalog") {
          this.closeChat();
          document
            .getElementById("catalog")
            .scrollIntoView({ behavior: "smooth" });
        } else if (chip.action === "whatsapp") {
          window.open(this.waLink, "_blank");
        } else if (chip.query) {
          this.elements.input.value = chip.query;
          this.sendMessage();
        }
      });
      wrapper.appendChild(btn);
    });
    this.elements.messagesContainer.appendChild(wrapper);
    this.scrollToBottom();
  }

  async sendMessage() {
    if (this.isLoading) return;
    const message = this.elements.input.value.trim();
    if (!message) return;

    this.elements.input.value = "";
    this.elements.input.style.height = "auto";
    this.addMessage(message, "user");
    this.showLoading();

    // Réponse simulée / intelligente locale
    setTimeout(() => {
      this.hideLoading();
      this.generateBotResponse(message);
    }, 600);
  }

  generateBotResponse(text) {
    const lower = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const has = (words) => words.some((word) => lower.includes(word));
    if (
      has([
        "регистрац",
        "зарегистр",
        "кабинет",
        "купить",
        "заказ",
        "inscr",
        "register",
        "registration",
        "account",
        "commander",
        "order",
      ])
    ) {
      this.addMessage(
        t("chat.registrationReply"),
        "assistant",
        true,
        "registration",
      );
      return;
    }
    if (
      has([
        "доставк",
        "оплат",
        "пункт",
        "склад",
        "livraison",
        "paiement",
        "delivery",
        "payment",
        "shipping",
      ])
    ) {
      this.addMessage(t("chat.deliveryReply"), "assistant");
      this.addQuickChips([
        { text: t("chat.register"), query: t("text.14") },
        { text: t("chat.whatsapp"), action: "whatsapp" },
      ]);
      return;
    }
    if (
      has([
        "ватсап",
        "whatsapp",
        "телефон",
        "контакт",
        "связ",
        "contact",
        "consultant",
        "conseill",
      ])
    ) {
      this.addMessage(
        { text: t("chat.contactReply", { name: this.consultantName }) },
        "assistant",
        true,
        "error_with_wa",
      );
      return;
    }
    const words = lower.split(/\s+/).filter((word) => word.length > 2);
    const found = getProducts()
      .filter((product) => {
        const name =
          `${productName(product)} ${product.name} ${product.nameEn || ""}`
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "");
        return words.some((word) => name.includes(word));
      })
      .slice(0, 3);
    if (found.length) {
      let reply = `${t("chat.found")}\n\n`;
      found.forEach((product) => {
        reply += `• **${productName(product)}** — ${product.priceDiscount} ₽ (PV: ${product.points})\n`;
      });
      this.addMessage(reply, "assistant");
      this.addQuickChips([
        { text: t("chat.gotoCatalog"), action: "catalog" },
        { text: t("chat.register"), query: t("text.14") },
      ]);
      return;
    }
    if (
      has(["каталог", "товар", "ассортимент", "catalog", "product", "produit"])
    ) {
      this.addMessage(t("chat.browse"), "assistant");
      this.addQuickChips([
        { text: t("chat.gotoCatalog"), action: "catalog" },
        { text: t("chat.register"), query: t("text.14") },
      ]);
      return;
    }
    this.addMessage(
      { text: t("chat.general", { name: this.consultantName }) },
      "assistant",
      true,
      "error_with_wa",
    );
  }

  addMessage(content, role, animate = true, responseType = "text") {
    const msg = document.createElement("div");
    msg.className = `chat-message ${role}`;
    const body = document.createElement("div");
    body.className = "chat-message-content";

    if (role === "assistant") {
      if (responseType === "registration") {
        body.innerHTML = this.parseRegistrationContent(content);
      } else if (
        responseType === "no_answer" ||
        responseType === "error_with_wa"
      ) {
        body.innerHTML = this.parseWhatsAppContent(content);
      } else {
        body.innerHTML = this.parseMarkdown(content);
      }
    } else {
      body.textContent = content;
    }

    msg.appendChild(body);
    if (role === "assistant") this.hideLoading();
    this.elements.messagesContainer.appendChild(msg);

    if (role === "assistant") {
      const registrationButtons = msg.querySelectorAll(
        '[data-action="register"]',
      );
      registrationButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeChat();
          if (typeof window.showRegistrationForm === "function") {
            window.showRegistrationForm();
          }
        });
      });
    }

    if (animate) {
      msg.classList.add("fade-in");
      setTimeout(() => msg.classList.remove("fade-in"), 300);
    }

    if (role === "assistant") {
      this.scrollToMessage(msg);
    } else {
      this.scrollToBottom();
    }
  }

  parseRegistrationContent(content) {
    let html = this.parseMarkdown(content);
    const buttonId = `reg-btn-${Date.now()}`;
    html += `
            <div class="chat-registration-button-wrapper mt-3">
                <button data-action="register" id="${buttonId}" class="btn btn-primary rounded-pill w-100 atomy-registration-btn">
                    ${t("text.15")}
                </button>
            </div>
        `;
    return html;
  }

  parseWhatsAppContent(payload) {
    let data;
    if (typeof payload === "string") {
      try {
        data = JSON.parse(payload);
      } catch {
        data = { text: payload };
      }
    } else {
      data = payload;
    }
    let html = this.parseMarkdown(data.text || "");
    const waLink = this.waLink;
    if (!waLink) return html + `<p>${t("chat.noContact")}</p>`;
    html += `
            <div class="chat-whatsapp-button-wrapper mt-3">
                <a href="${waLink}" target="_blank" class="btn btn-success w-100 rounded-pill">
                    ${t("text.247")} →
                </a>
            </div>
        `;
    return html;
  }

  scrollToMessage(messageElement) {
    setTimeout(() => {
      const c = this.elements.messagesContainer;
      if (!c) return;
      const top = messageElement.offsetTop;
      const h = messageElement.offsetHeight;
      if (h < c.clientHeight - 40) {
        c.scrollTop = Math.max(0, top - 20);
      } else {
        c.scrollTop = top - 100;
      }
    }, 80);
  }

  scrollToBottom() {
    setTimeout(() => {
      const c = this.elements.messagesContainer;
      if (c) c.scrollTop = c.scrollHeight;
    }, 80);
  }

  showLoading() {
    if (this.loaderEl) return;
    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message assistant";
    const contentDiv = document.createElement("div");
    contentDiv.className = "chat-message-content";
    contentDiv.innerHTML = `
            ${t("chat.typing")}
            <div class="typing-dots"><span></span><span></span><span></span></div>
        `;
    messageDiv.appendChild(contentDiv);
    this.loaderEl = messageDiv;
    this.elements.messagesContainer.appendChild(this.loaderEl);
    this.isLoading = true;
    this.scrollToBottom();
  }

  hideLoading() {
    if (!this.loaderEl) return;
    this.loaderEl.remove();
    this.loaderEl = null;
    this.isLoading = false;
  }

  pauseBootstrapFocusTrap(pause = true) {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      const inst = bootstrap.Modal.getInstance(modal);
      const trap = inst?._focustrap;
      if (!trap) return;
      if (
        typeof trap.pause === "function" &&
        typeof trap.unpause === "function"
      ) {
        pause ? trap.pause() : trap.unpause();
      } else if (typeof trap.deactivate === "function") {
        pause ? trap.deactivate() : trap.activate && trap.activate();
      }
    });
  }

  parseMarkdown(text) {
    if (!text) return "";
    let html = escapeHtml(text).replace(/\n/g, "<br>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");
    return html;
  }
}

export function initChat() {
  window.atomiChat = new AtomiChatWidget();
  window.addEventListener("languagechange", () => {
    const chat = window.atomiChat;
    chat.waLink = whatsappLink();
    chat.elements.messagesContainer.replaceChildren();
    chat.loaderEl = null;
    chat.isLoading = false;
    chat.welcomeShown = false;
    if (chat.isOpen) {
      chat.showWelcomeMessage();
      chat.welcomeShown = true;
    }
  });
}
