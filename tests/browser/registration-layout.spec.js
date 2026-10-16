import { test, expect } from "@playwright/test";

async function expectStaticStep(page, step) {
  await expect
    .poll(() =>
      page.evaluate((step) => {
        const card = document.querySelector(".registration-form-wrapper .card");
        const rect = card.getBoundingClientRect();
        const navBottom = document
          .querySelector(".navbar")
          .getBoundingClientRect().bottom;
        const controls = [
          ...document.querySelectorAll(
            `#step${step} input, #step${step} select, #step${step} button`,
          ),
        ];
        return (
          document
            .querySelector(".navbar")
            .contains(
              document.elementFromPoint(innerWidth / 2, navBottom / 2),
            ) &&
          rect.top >= navBottom &&
          rect.bottom <= innerHeight &&
          controls
            .filter((el) => el.getBoundingClientRect().height)
            .every((el) => {
              const box = el.getBoundingClientRect();
              return (
                box.top >= navBottom &&
                box.bottom <= innerHeight &&
                box.left >= 0 &&
                box.right <= innerWidth
              );
            })
        );
      }, step),
    )
    .toBe(true);
  await page.locator(`#step${step} h2`).click();
  await page.mouse.wheel(0, 600);
  await page.keyboard.press("PageDown");
  await page.keyboard.press("End");
  const offsets = await page.evaluate(async () => {
    window.scrollTo(0, 600);
    document.querySelector(".registration-form-wrapper").scrollTo(0, 600);
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    return [
      scrollY,
      document.querySelector(".registration-form-wrapper").scrollTop,
    ];
  });
  expect(offsets).toEqual([0, 0]);
}

for (const viewport of [
  { width: 1920, height: 905 },
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
]) {
  test(`inscription fixe sans défilement ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.route("https://**/*", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator(".product-card").first()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 1800));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await page.locator('.navbar-actions [data-action="register"]').click();
    await expect(page.locator("#step1")).toBeVisible();
    await expectStaticStep(page, 1);
    await page.locator("#selectNationality").selectOption("BE");
    await page.locator("#inputSurname").fill("Sargsyan");
    await page.locator("#inputFirstName").fill("Alice");
    await page.locator("#gender-f").check();
    await page.locator("#birth_day").fill("15");
    await page.locator("#birth_month").fill("06");
    await page.locator("#birth_year").fill("1995");
    await page.locator('input[name="email"]').fill("alice@example.test");
    await page.locator("#inputPhone").fill("+32470123456");
    await page.locator("#toStep2").click();
    await expectStaticStep(page, 2);
    await page.locator("#address").fill("Bruxelles, rue Exemple 1");
    await page.locator("#toStep3Address").click();
    await expectStaticStep(page, 3);
    await page.locator("#languageSelect").selectOption("en");
    await expectStaticStep(page, 3);
    await page.locator("#confirmAll").check();
    await page.locator('#form-step-2 button[type="submit"]').click();
    await expect(page.locator("#registrationStatus")).toContainText(
      "not saved or sent",
    );
    await expectStaticStep(page, 3);
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).not.toHaveClass(/registration-page/);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}

test("les anciens fichiers en cache ne remplacent pas la mise en page fixe", async ({
  page,
}) => {
  const errors = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(new URL(request.url())));
  await page.route("https://**/*", (route) => route.abort());
  await page.route("**/css/style.css", (route) =>
    route.fulfill({
      contentType: "text/css",
      body: ".registration-form-wrapper { position: fixed; inset: 0; z-index: 1030; overflow-y: auto; }",
    }),
  );
  await page.route("**/js/registration.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'throw new Error("Ancien module d’inscription chargé");',
    }),
  );
  await page.goto("/#openform");
  await expect(page.locator("#step1")).toBeVisible();
  await expectStaticStep(page, 1);
  for (const path of [
    "/css/style.css",
    "/js/app.js",
    "/js/registration.js",
    "/js/registration-layout.js",
  ]) {
    const request = requests.find((url) => url.pathname === path);
    expect(request?.searchParams.get("v")).toBe("registration-fixed-2");
  }
  expect(errors).toEqual([]);
});
