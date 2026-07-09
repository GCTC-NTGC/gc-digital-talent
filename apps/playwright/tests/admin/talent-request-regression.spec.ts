import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

const sub =
  process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_PLATFORM_ADMIN_SUB env var is not set");
  })();

test.describe("Talent request regression", { tag: "@uat" }, () => {
  test.beforeEach(async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
  });

  test("talent request list renders with existing requests", async ({
    appPage,
  }) => {
    await appPage.page.goto("/en/admin/talent-requests");
    await expect(
      appPage.page.getByRole("heading", { name: "Talent requests", level: 1 }),
    ).toBeVisible();
    // At least one pre-existing request must be present in the environment
    await expect(
      appPage.page.locator('a[href*="/admin/talent-requests/"]').first(),
    ).toBeVisible();
  });

  test("can open a pre-existing talent request and core sections render", async ({
    appPage,
  }) => {
    await appPage.page.goto("/en/admin/talent-requests");
    await expect(
      appPage.page.getByRole("heading", { name: "Talent requests", level: 1 }),
    ).toBeVisible();

    // Pick the first request off the list — exercises existing (pre-refactor) UAT data
    const firstRequest = appPage.page
      .locator('a[href*="/admin/talent-requests/"]')
      .first();
    await firstRequest.click();

    // Detail page: job title is the h1
    await expect(
      appPage.page.getByRole("heading", { level: 1 }),
    ).toBeVisible();

    // These three cards are always rendered — failure here means old data broke post-refactor
    await expect(
      appPage.page.getByRole("heading", { name: "Request details" }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("heading", { name: "Source of talent" }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("heading", { name: "Candidate criteria" }),
    ).toBeVisible();
  });
});
