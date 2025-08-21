import AppPage from "~/fixtures/AppPage";
import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

const USERS_PAGINATED_QUERY = "UsersPaginated";

const searchForUser = async (appPage: AppPage, name: string) => {
  await appPage.page
    .getByRole("textbox", { name: /search/i })
    .first()
    .fill(name, { timeout: 30000 });

  await appPage.waitForGraphqlResponse(USERS_PAGINATED_QUERY);
};

const goToUsersPage = async (appPage: AppPage) => {
  await appPage.page.goto("/en/admin/users");
  await appPage.waitForGraphqlResponse(USERS_PAGINATED_QUERY);
};

test.describe("Admin workflows", () => {
  test.beforeEach(async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
  });

  test("Search for user and review profile", async ({ appPage }) => {
    await goToUsersPage(appPage);
    await searchForUser(appPage, "Applicant");

    await appPage.page.getByRole("link", { name: /gul fields/i }).click();

    await expect(
      appPage.page.getByRole("heading", { name: /gul fields/i }),
    ).toBeVisible();

    await expect(
      appPage.page.getByRole("button", { name: /download profile/i }),
    ).toBeVisible();
  });

  test("Search for user and edit phone number", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
    await goToUsersPage(appPage);
    await searchForUser(appPage, "Applicant");

    await appPage.page.getByRole("link", { name: /gul fields/i }).click();
    await appPage.page.getByRole("link", { name: /advanced tools/i }).click();

    await appPage.page
      .getByRole("textbox", { name: /telephone/i })
      .fill("+10123456789");
    await appPage.page
      .getByRole("button", { name: /update information/i })
      .first()
      .click();

    await appPage.waitForGraphqlResponse("UpdateAccountInformation");

    await expect(appPage.page.getByRole("alert")).toContainText(
      /updated account information successfully/i,
    );

    await goToUsersPage(appPage);
    await searchForUser(appPage, "Applicant");
    await appPage.page
      .getByRole("button", { name: /show or hide columns/i })
      .click();
    await appPage.page.getByRole("checkbox", { name: /telephone/i }).click();
    await appPage.page
      .getByRole("dialog", { name: /show or hide columns/i })
      .press("Escape");

    await expect(
      appPage.page
        .getByRole("row", { name: /applicant/i })
        .getByText("+10123456789"),
    ).toBeVisible();
  });

  test("Filter users table", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
    await goToUsersPage(appPage);

    await appPage.page.getByRole("button", { name: /filters/i }).click();
    await appPage.page
      .getByRole("checkbox", { name: /profile complete/i })
      .click();
    await appPage.page.getByRole("button", { name: /show results/i }).click();
    await appPage.waitForGraphqlResponse(USERS_PAGINATED_QUERY);

    await expect(
      appPage.page.getByRole("button", { name: /filters 1/i }),
    ).toBeVisible();
  });
});
