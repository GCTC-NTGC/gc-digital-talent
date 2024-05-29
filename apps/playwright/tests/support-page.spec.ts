import { expect, test } from "~/fixtures";

test.describe("Support page", () => {
  test.describe("Support page", () => {
    test("has heading", async ({ page }) => {
      await page.goto("/en/support");
      await expect(
        page.getByRole("heading", { name: "Contact and support", level: 1 }),
      ).toBeVisible();
    });
    test("has no accessibility violations", async ({
      appPage,
      makeAxeBuilder,
    }) => {
      await appPage.page.goto("/en/support");
      const accessibilityScanResults = await makeAxeBuilder().analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
  test.describe("Support form", () => {
    test("send POST request to existing API endpoint", async ({ request }) => {
      const newTicket = await request.post("/api/support/tickets", {
        data: {
          body: {
            name: "Test Person",
            email: "test@test.tld",
            details: "Test comments to send.",
            subject: "question",
          },
        },
      });
      expect(newTicket.status()).toBe(500); // 500 status if freshdesk is not locally configured.
    });
  });
});
