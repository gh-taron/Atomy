import { test, expect } from "@playwright/test";

async function openSite(page, options = {}) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("atomy_language", "ru");
    } catch {}
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://**/*", (route) => route.abort());
  if (options.endpoint) {
    await page.route("**/js/config.js", async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(
        'endpoint: ""',
        'endpoint: "/registration-test"',
      );
      await route.fulfill({ response, body });
    });
  }
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(
    options.mobile ? 4 : 8,
  );
  return errors;
}

async function completeForm(page) {
  await page.locator('[data-action="register"]:visible').first().click();
  await page.locator("#inputSurname").fill("Test");
  await page.locator("#inputFirstName").fill("Visitor");
  await page.locator("#gender-f").check();
  await page.locator("#birth_day").fill("15");
  await page.locator("#birth_month").fill("06");
  await page.locator("#birth_year").fill("1995");
  await page.locator('input[name="email"]').fill("visitor@example.test");
  await page.locator("#inputPhone").fill("+32 470 12 34 56");
  await page.locator("#toStep2").click();
  await page.locator("#address").fill("Brussels, Example street 1");
  await page.locator("#toStep3Address").click();
  await expect(page.locator("#summary-phone")).toHaveText("+32470123456");
  await page.locator("#confirmAll").check();
}

test("initialisation, recherche spéciale, filtre, fiche et FAQ sans erreur", async ({
  page,
}) => {
  const errors = await openSite(page);
  await page.locator("#productSearch").fill("[");
  await expect(page.locator("#productsList")).toContainText(
    "Товары не найдены",
  );
  await page.locator("#productSearch").fill("");
  await page.locator('[data-category="skincare"]').click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.locator(".product-card button").first().click();
  await expect(page.locator("#productModal")).toBeVisible();
  await expect(page.locator("#modalProductDescription")).not.toHaveText(
    "Загрузка…",
  );
  await page.locator("#productModal .btn-close").click();
  await page.locator('[data-bs-target="#faq2"]').click();
  await expect(page.locator("#faq2")).toBeVisible();
  expect(errors).toEqual([]);
});

test("ouverture rapide : les détails arrivent dans la fiche déjà ouverte", async ({
  page,
}) => {
  await page.route("**/data/products-details.json", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route.continue();
  });
  await openSite(page);
  await page.locator(".product-card button").first().click();
  await expect(page.locator("#modalProductDescription")).not.toHaveText(
    "Загрузка…",
    { timeout: 5000 },
  );
  await expect(page.locator("#modalProductDescription")).not.toBeEmpty();
});

test("chat : recherche réelle des produits et accès au catalogue", async ({
  page,
}) => {
  const errors = await openSite(page);
  await page.locator("#chat-toggle-btn").click();
  await page.locator("#chat-input").fill("крем");
  await page.locator("#chat-send-btn").click();
  await expect(page.locator("#chat-messages")).toContainText(
    "Вот что удалось найти",
  );
  await page.locator("#chat-input").fill("каталог");
  await page.locator("#chat-send-btn").click();
  await page.getByRole("button", { name: "🔍 Перейти к каталогу" }).click();
  await expect(page.locator("#chat-container")).toBeHidden();
  expect(errors).toEqual([]);
});

test("aucun contact du modèle ni inscription fictive", async ({ page }) => {
  await openSite(page);
  await expect(page.locator("[data-contact]:visible")).toHaveCount(0);
  await completeForm(page);
  await page.locator('#form-step-2 button[type="submit"]').click();
  await expect(page.locator("#registrationStatus")).toContainText(
    "никуда не отправлены",
  );
  await expect(page.locator("#registrationSuccessNoRegContainer")).toBeHidden();
  expect(
    await page.evaluate(() => localStorage.getItem("atomy_registered_leads")),
  ).toBeNull();
});

test("une erreur serveur reste une erreur ; succès confirmé seulement après réception", async ({
  page,
}) => {
  await openSite(page, { endpoint: true });
  let payload;
  let success = false;
  await page.route("**/registration-test", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: success ? 200 : 500,
      contentType: "application/json",
      body: JSON.stringify({ success }),
    });
  });
  await completeForm(page);
  await page.locator('#form-step-2 button[type="submit"]').click();
  await expect(page.locator("#registrationStatus")).toContainText("Не удалось");
  await expect(page.locator("#registrationSuccessNoRegContainer")).toBeHidden();
  expect(payload.phone).toBe("+32470123456");
  success = true;
  await page.locator('#form-step-2 button[type="submit"]').click();
  await expect(
    page.locator("#registrationSuccessNoRegContainer"),
  ).toBeVisible();
});

test("mobile : catalogue, formulaire, chat et fermeture par superposition", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = await openSite(page, { mobile: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#chat-toggle-btn").click();
  await expect(page.locator("#chat-container")).toBeVisible();
  await page.locator("#chat-close-btn").click();
  await completeForm(page);
  expect(errors).toEqual([]);
});

test("copie du lien produit sans icône cassée et solution de repli", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors = await openSite(page);
  await page.locator(".product-card button").first().click();
  await page.locator("#copyProductLinkBtn").click();
  await expect(page.locator("#copyProductLinkBtn")).toHaveAttribute(
    "aria-label",
    "Скопировано",
  );
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/#.+/);
  await expect(page.locator("#copyLinkIcon")).toHaveAttribute(
    "src",
    /good-link\.svg$/,
  );
  const fallback = await page.evaluate(async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    let calls = 0;
    document.execCommand = () => {
      calls++;
      return true;
    };
    const { copyText } = await import("/js/utils.js");
    await copyText(
      "test fallback",
      document.getElementById("copyProductLinkBtn"),
    );
    return calls;
  });
  expect(fallback).toBe(1);
  expect(errors).toEqual([]);
});

test("coordonnées et identité personnalisées depuis une seule configuration", async ({
  page,
}) => {
  await page.route("**/js/config.js", async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace('name: "Lusine Sargsyan"', 'name: "Test Partner"')
      .replace('whatsapp: ""', 'whatsapp: "32470123456"')
      .replace('telegram: ""', 'telegram: "https://t.me/test_partner"');
    await route.fulfill({ response, body });
  });
  await openSite(page);
  await expect(
    page.locator('[data-contact="telegram"]').first(),
  ).toHaveAttribute("href", "https://t.me/test_partner");
  await expect(
    page.locator('[data-contact="whatsapp"]').first(),
  ).toHaveAttribute("href", /^https:\/\/wa\.me\/32470123456/);
  await expect(page.locator('[data-contact="max"]:visible')).toHaveCount(0);
  await expect(page.locator("[data-consultant-name]").first()).toHaveText(
    "Test Partner",
  );
  await expect(page).toHaveTitle("Атоми | Партнер Test Partner");
});
