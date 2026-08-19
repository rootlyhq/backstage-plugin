import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/rootly");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Enter" }).click();
  await expect(page.getByRole("heading", { name: "Rootly" })).toBeVisible();
});

test("loads the Rootly plugin inside its Backstage development app", async ({
  page,
}) => {
  await expect(page.getByRole("heading", { name: "Rootly" })).toBeVisible();

  for (const tab of [
    "Incidents",
    "Entities",
    "Services",
    "Functionalities",
    "Teams",
    "Catalog",
  ]) {
    await expect(page.getByRole("tab", { name: tab })).toBeVisible();
  }
});

test("navigates between Rootly resource tables backed by the dev API", async ({
  page,
}) => {
  await page.getByRole("tab", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/rootly\/services$/);
  await expect(
    page.getByRole("link", {
      name: "backstage-plugin-test-service",
      description: "Backstage Plugin Test Service",
    }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Functionalities" }).click();
  await expect(page).toHaveURL(/\/rootly\/functionalities$/);
  await expect(
    page.getByRole("link", { name: "Backstage Plugin Test Functionality" }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Teams" }).click();
  await expect(page).toHaveURL(/\/rootly\/teams$/);
  await expect(
    page.getByRole("link", { name: "Backstage Plugin Test Team" }),
  ).toBeVisible();
});

test("renders incident, catalog, and Backstage entity integrations", async ({
  page,
}) => {
  await expect(
    page.getByRole("link", { name: "Backstage Plugin Test Incident" }),
  ).toHaveAttribute(
    "href",
    "https://rootly.com/account/incidents/1-backstage-plugin-test-incident",
  );

  await page.getByRole("tab", { name: "Entities" }).click();
  await expect(page).toHaveURL(/\/rootly\/entities$/);
  await expect(
    page
      .getByRole("link", { name: "backstage-plugin-test-service" })
      .and(
        page.locator(
          'a[href="https://rootly.example/services/backstage-plugin-test-service"]',
        ),
      ),
  ).toHaveAttribute(
    "href",
    "https://rootly.example/services/backstage-plugin-test-service",
  );

  await page.getByRole("tab", { name: "Catalog" }).click();
  await expect(page).toHaveURL(/\/rootly\/catalog-entities$/);
  await expect(
    page.getByRole("link", { name: "Backstage Plugin Test Catalog Entity" }),
  ).toHaveAttribute(
    "href",
    "https://rootly.example/catalog/entities/backstage-plugin-test-service",
  );
});
