import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createPool } from "~/utils/pools";
import { me } from "~/utils/user";

const UPDATE_MUTATION = "UpdatePool";

test.describe("Update pool", () => {
  test.beforeEach(async ({ appPage }) => {
    const adminCtx = await graphql.newContext();
    const user = await me(adminCtx, {});
    const createdPool = await createPool(adminCtx, {
      userId: user.id,
    });
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/pools/${createdPool.id}`);
    await appPage.waitForGraphqlResponse("ViewPoolPage");
    await appPage.page
      .getByRole("link", { name: /edit advertisement/i })
      .click();
    await appPage.waitForGraphqlResponse("EditPoolPage");
  });

  test("Update pool general questions", async ({ appPage }) => {
    // Add a question
    await appPage.page
      .getByRole("button", { name: /add a new question/i })
      .click();

    let questionDialog = appPage.page.getByRole("dialog", {
      name: /manage a general question/i,
    });

    await questionDialog
      .getByRole("textbox", { name: /question \(english\)/i })
      .fill("Question 1 EN");
    await questionDialog
      .getByRole("textbox", { name: /question \(french\)/i })
      .fill("Question 1 FR");

    await questionDialog
      .getByRole("button", { name: /save this question/i })
      .click();

    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);

    await expect(
      appPage.page.getByRole("button", { name: /edit item 1/i }),
    ).toBeVisible({ timeout: 15000 });

    await appPage.page
      .getByRole("button", { name: /add a new question/i })
      .click();

    questionDialog = appPage.page.getByRole("dialog", {
      name: /manage a general question/i,
    });

    await questionDialog
      .getByRole("textbox", { name: /question \(english\)/i })
      .fill("Question 2 EN");
    await questionDialog
      .getByRole("textbox", { name: /question \(french\)/i })
      .fill("Question 2 FR");

    await questionDialog
      .getByRole("button", { name: /save this question/i })
      .click();

    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);

    await expect(
      appPage.page.getByRole("button", { name: /edit item 1/i }),
    ).toBeVisible({ timeout: 15000 });

    // Reorder questions
    await appPage.page
      .getByRole("button", { name: /change order from 2 to 1/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Delete question
    await appPage.page.getByRole("button", { name: /remove item 1/i }).click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
  });
});
