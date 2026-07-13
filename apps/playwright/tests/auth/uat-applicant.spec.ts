import { test, expect } from "@playwright/test";

import { loginBySub } from "~/utils/auth";
import AUTH from "~/constants/auth";

const sub =
  process.env.PLAYWRIGHT_APPLICANT_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_APPLICANT_SUB env var is not set");
  })();

test.describe("Applicant user", () => {
  test.beforeEach(async ({ page }) => {
    await loginBySub(page, sub);
  });

  test(
    "cannot access admin restricted paths",
    { tag: "@uat" },
    async ({ page }) => {
      await Promise.all(
        AUTH.RESTRICTED_PATHS.ADMIN.map(async (restrictedPath) => {
          const newPage = await page.context().newPage();
          await newPage.goto(restrictedPath);
          await expect(
            newPage.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
          await newPage.close();
        }),
      );
    },
  );
});
