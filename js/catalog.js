import { t, productName } from "./i18n.js";
import { matchesSearch, copyText } from "./utils.js";

const placeholder = "assets/static/websites/images/placeholder.svg";
let products = [];
let detailsPromise;
let category = "all";
let search = "";
let visibleCount = window.innerWidth <= 767 ? 4 : 8;
let modal;
let opening = 0;
let activeProductId = null;

export function getProducts() {
  return products;
}

async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Impossible de charger ${path}`);
  return response.json();
}

function setImage(image, src) {
  image.onerror = () => {
    image.onerror = null;
    image.src = placeholder;
  };
  image.src = src || placeholder;
}

function renderProducts() {
  const container = document.getElementById("productsList");
  container.replaceChildren();
  const filtered = products.filter(
    (product) =>
      (category === "all" || product.categories?.includes(category)) &&
      matchesSearch(
        search,
        `${productName(product)} ${product.name} ${product.nameEn || ""} ${product.article || ""}`,
      ),
  );
  filtered.slice(0, visibleCount).forEach((product) => {
    const column = document.createElement("div");
    column.className = "col-6 col-lg-3 mb-4";
    column.innerHTML = `<div class="card product-card h-100">
      <img class="card-img-top" loading="lazy">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title"></h5>
        <div class="mt-auto">
          <div class="price-original"></div>
          <div class="price-discount"></div>
          <button type="button" class="btn btn-primary btn-sm w-100">${t("product.details")}</button>
        </div>
      </div>
    </div>`;
    const image = column.querySelector("img");
    image.alt = productName(product);
    setImage(image, product.image);
    column.querySelector("h5").textContent = productName(product);
    column.querySelector(".price-original").textContent =
      `${product.priceOriginal.toFixed(0)} ₽`;
    column.querySelector(".price-discount").textContent =
      `${product.priceDiscount.toFixed(0)} ₽`;
    column
      .querySelector(".product-card")
      .addEventListener("click", () => showProduct(product.id));
    container.append(column);
  });
  if (!filtered.length) {
    const message = document.createElement("p");
    message.className = "text-muted text-center";
    message.textContent = t("product.none");
    container.append(message);
  }
  document.getElementById("loadMoreBtn").style.display =
    visibleCount < filtered.length ? "" : "none";
}

export async function showProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  activeProductId = id;
  const request = ++opening;
  const element = document.getElementById("productModal");
  modal ||= bootstrap.Modal.getOrCreateInstance(element);
  const text = (id, value) => {
    document.getElementById(id).textContent = value || "";
  };
  setImage(document.getElementById("modalProductImage"), product.image);
  document.getElementById("modalProductImage").alt = productName(product);
  text("modalProductTitle", productName(product));
  text("modalProductNameEn", product.nameEn);
  text("modalProductArticle", product.article);
  text("modalProductDiscountPrice", `${product.priceDiscount.toFixed(0)} ₽`);
  text("modalProductPrice", `${product.priceOriginal.toFixed(0)} ₽`);
  text("modalProductPoints", String(product.points || 0));
  const fields = {
    Description: "description",
    Ingredients: "ingredients",
    Instructions: "instructions",
    Warnings: "warnings",
    Reviews: "reviews",
  };
  Object.keys(fields).forEach((field) =>
    text(`modalProduct${field}`, t("product.loading")),
  );
  ["instructions-tab", "warnings-tab", "reviews-tab"].forEach((id) => {
    document.getElementById(id).style.display = "";
  });
  bootstrap.Tab.getOrCreateInstance(
    document.getElementById("overview-tab"),
  ).show();
  if (product.article) {
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#${encodeURIComponent(product.article)}`,
    );
  }
  modal.show();
  const button = document.getElementById("copyProductLinkBtn");
  button.onclick = async () => {
    const link = new URL(location.href);
    link.search = "";
    link.hash = product.article || "";
    try {
      await copyText(link.href, button);
    } catch {
      button.setAttribute("aria-label", t("copy.error"));
    }
  };
  try {
    detailsPromise ||= readJson("data/products-details.json");
    const details = (await detailsPromise)[id] || {};
    if (request !== opening) return;
    Object.entries(fields).forEach(([field, key]) => {
      // Le JSON local contient les descriptions HTML éditoriales du catalogue.
      document.getElementById(`modalProduct${field}`).innerHTML =
        details[key] || product[key] || "";
    });
    ["instructions", "warnings", "reviews"].forEach((key) => {
      document.getElementById(`${key}-tab`).style.display = String(
        details[key] || product[key] || "",
      ).trim()
        ? ""
        : "none";
    });
  } catch {
    if (request !== opening) return;
    Object.keys(fields).forEach((field) =>
      text(`modalProduct${field}`, t("product.unavailable")),
    );
    detailsPromise = null;
  }
}

function openFromHash() {
  let article;
  try {
    article = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const product = products.find((item) => item.article === article);
  if (product) showProduct(product.id);
}

export async function initCatalog() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.category;
      document
        .querySelectorAll("[data-category]")
        .forEach((item) => item.classList.toggle("active", item === button));
      if (category === "all") {
        search = "";
        document.getElementById("productSearch").value = "";
      }
      visibleCount = window.innerWidth <= 767 ? 4 : 8;
      renderProducts();
    });
  });
  document
    .getElementById("productSearch")
    .addEventListener("input", (event) => {
      search = event.target.value;
      category = "all";
      document
        .querySelectorAll("[data-category]")
        .forEach((button) =>
          button.classList.toggle("active", button.dataset.category === "all"),
        );
      visibleCount = window.innerWidth <= 767 ? 4 : 8;
      renderProducts();
    });
  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    renderProducts();
  });
  document
    .getElementById("productModal")
    .addEventListener("hidden.bs.modal", () => {
      opening++;
      activeProductId = null;
      history.replaceState(null, "", location.pathname + location.search);
    });
  window.addEventListener("hashchange", openFromHash);
  try {
    const data = await readJson("data/products.json");
    if (!Array.isArray(data) || !data.length)
      throw new Error("Catalogue invalide");
    products = data.map((item) => ({
      ...item,
      priceOriginal: Number(item.priceOriginal),
      priceDiscount: Number(item.priceDiscount),
    }));
    detailsPromise = readJson("data/products-details.json");
    // Éviter un rejet non traité avant la première ouverture de fiche.
    detailsPromise.catch(() => {});
    renderProducts();
    openFromHash();
  } catch {
    document.getElementById("productsList").textContent = t("product.error");
    document.getElementById("loadMoreBtn").hidden = true;
  }
}

window.addEventListener("languagechange", () => {
  if (products.length) renderProducts();
  const product = products.find((item) => item.id === activeProductId);
  if (product) {
    document.getElementById("modalProductTitle").textContent =
      productName(product);
    document.getElementById("modalProductImage").alt = productName(product);
  }
});
