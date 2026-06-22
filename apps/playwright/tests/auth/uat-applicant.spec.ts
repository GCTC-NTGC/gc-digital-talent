import { test, expect } from "@playwright/test";

import AUTH from "~/constants/auth";

test.describe("Applicant user", () => {
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
