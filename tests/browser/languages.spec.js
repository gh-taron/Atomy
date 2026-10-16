import { test, expect } from "@playwright/test";
async function open(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://**/*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(8);
  return errors;
}
test("français par défaut et recherche des noms traduits", async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByLabel("Langue")).toHaveValue("fr");
  await expect(page.locator(".navbar #languageSelect")).toBeVisible();
  await expect(page.locator(".language-bar")).toHaveCount(0);
  await expect(page.locator("#catalog h2")).toHaveText(
    "Catalogue des produits Atomy",
  );
  await expect(page.locator(".product-card h5").first()).toHaveText(
    "Atomy Crème contour des yeux The Fame",
  );
  await page.locator("#productSearch").fill("crème");
  await page.locator(".product-card button").first().click();
  await expect(
    page.locator("#productModal [data-source-notice]"),
  ).toContainText("russe");
  await page.locator("#productModal .btn-close").click();
  await page.locator('[data-action="register"]:visible').first().click();
  await expect(page.locator("#step1")).toContainText("Présentez-vous");
  await expect(
    page.locator('#selectNationality option[value="FR"]'),
  ).toHaveText("🇫🇷 France");
  expect(errors).toEqual([]);
});
test("anglais mémorisé et valeurs du formulaire conservées", async ({
  page,
}) => {
  const errors = await open(page);
  await page.locator('[data-action="register"]:visible').first().click();
  await page.locator("#inputFirstName").fill("Alice");
  await page.locator("#selectNationality").selectOption("BE");
  await page.locator("#languageSelect").selectOption("en");
  await expect(page.locator("#step1")).toContainText("Tell us about yourself");
  await expect(page.locator("#inputFirstName")).toHaveValue("Alice");
  await expect(page.locator("#selectNationality")).toHaveValue("BE");
  await expect(
    page.locator('#selectNationality option[value="BE"]'),
  ).toHaveText("🇧🇪 Belgium");
  await page.locator("#exitRegistration").click();
  await expect(page.locator("#catalog h2")).toHaveText("Atomy product catalog");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#languageSelect")).toHaveValue("en");
  expect(errors).toEqual([]);
});
test("chat français et anglais", async ({ page }) => {
  const errors = await open(page);
  await page.locator("#chat-toggle-btn").click();
  await expect(page.locator("#chat-messages")).toContainText(
    "assistant virtuel",
  );
  await page.locator("#chat-input").fill("crème");
  await page.locator("#chat-send-btn").click();
  await expect(page.locator("#chat-messages")).toContainText(
    "Voici les produits trouvés",
  );
  await page.locator("#chat-close-btn").click();
  await page.locator("#languageSelect").selectOption("en");
  await page.locator("#chat-toggle-btn").click();
  await expect(page.locator("#chat-messages")).toContainText(
    "virtual assistant",
  );
  await page.locator("#chat-input").fill("delivery");
  await page.locator("#chat-send-btn").click();
  await expect(page.locator("#chat-messages")).toContainText(
    "Atomy delivery and payment",
  );
  expect(errors).toEqual([]);
});
test("changement dans une fiche ouverte et retour au russe", async ({
  page,
}) => {
  const errors = await open(page);
  await page.locator(".product-card button").first().click();
  await page.evaluate(async () => {
    const { setLanguage } = await import("/js/i18n.js");
    setLanguage("en");
  });
  await expect(page.locator("#modalProductTitle")).toHaveText(
    "Atomy The Fame Eye Cream",
  );
  await expect(
    page.locator("#productModal [data-source-notice]"),
  ).toContainText("Russian");
  await page.locator("#productModal .btn-close").click();
  await page.locator("#languageSelect").selectOption("ru");
  await expect(page.locator("#catalog h2")).toHaveText("Каталог товаров Атоми");
  await expect(page.locator("#reviews [data-source-notice]")).toBeHidden();
  expect(errors).toEqual([]);
});
test("stockage indisponible : sélecteur utilisable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    });
  });
  const errors = await open(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.locator("#languageSelect").selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(errors).toEqual([]);
});
test("mobile : langue accessible dans le formulaire", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("https://**/*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.locator("#languageSelect").selectOption("en");
  const geometry = await page.evaluate(() => {
    const select = document
      .getElementById("languageSelect")
      .getBoundingClientRect();
    const button = document
      .querySelector('.navbar-actions [data-action="register"]')
      .getBoundingClientRect();
    return {
      rightGap: document.documentElement.clientWidth - select.right,
      sameRow:
        Math.abs(
          (button.top + button.bottom) / 2 - (select.top + select.bottom) / 2,
        ) < 2,
      afterButton: select.left > button.right,
    };
  });
  expect(geometry.rightGap).toBeLessThanOrEqual(9);
  expect(geometry.sameRow).toBe(true);
  expect(geometry.afterButton).toBe(true);
  await page.locator('[data-action="register"]:visible').first().click();
  await expect(page.locator("#languageSelect")).toBeVisible();
  await page.locator("#languageSelect").selectOption("fr");
  await expect(page.locator("#step1")).toContainText("Présentez-vous");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("message du formulaire traduit après changement au récapitulatif", async ({
  page,
}) => {
  const errors = await open(page);
  await page.locator('[data-action="register"]:visible').first().click();
  await page.locator("#inputSurname").fill("Test");
  await page.locator("#inputFirstName").fill("Alice");
  await page.locator("#gender-f").check();
  await page.locator("#birth_day").fill("15");
  await page.locator("#birth_month").fill("06");
  await page.locator("#birth_year").fill("1995");
  await page.locator('input[name="email"]').fill("alice@example.test");
  await page.locator("#inputPhone").fill("+32470123456");
  await page.locator("#toStep2").click();
  await page.locator("#address").fill("Bruxelles, rue Exemple 1");
  await page.locator("#toStep3Address").click();
  await expect(page.locator("#summary-gender")).toHaveText("Femme");
  await page.locator("#confirmAll").check();
  await page.locator('#form-step-2 button[type="submit"]').click();
  await expect(page.locator("#registrationStatus")).toContainText(
    "ni enregistrées ni envoyées",
  );
  await page.locator("#languageSelect").selectOption("en");
  await expect(page.locator("#summary-first_name")).toHaveText("Alice");
  await expect(page.locator("#summary-gender")).toHaveText("Female");
  await page.locator('#form-step-2 button[type="submit"]').click();
  await expect(page.locator("#registrationStatus")).toContainText(
    "not saved or sent",
  );
  expect(errors).toEqual([]);
});

test("une langue inconnue mémorisée revient au français", async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("atomy_language", "__proto__");
    } catch {}
  });
  const errors = await open(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  expect(errors).toEqual([]);
});
