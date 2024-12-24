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

  test("Update pool details", async ({ appPage }) => {
    await appPage.page
      .getByRole("button", { name: /edit advertisement details/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /job title \(en\)/i })
      .fill("Update pool test (EN)");
    await appPage.page
      .getByRole("textbox", { name: /job title \(fr\)/i })
      .fill("Update pool test (FR)");
    await appPage.page
      .getByRole("combobox", { name: /work stream/i })
      .selectOption({ label: "Business Line Advisory Services" });
    await appPage.page
      .getByRole("textbox", { name: /process number/i })
      .fill("123");
    await appPage.page
      .getByRole("button", { name: /save advertisement details/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
  });

  test("Update pool closing date", async ({ appPage }) => {
    // Update closing date
    await appPage.page
      .getByRole("button", { name: /edit closing date/i })
      .click();

    const closingDate = appPage.page.getByRole("group", {
      name: /end date/i,
    });
    await closingDate.getByRole("spinbutton", { name: /year/i }).fill("2500");
    await closingDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await closingDate.getByRole("spinbutton", { name: /day/i }).fill("1");

    await appPage.page
      .getByRole("button", { name: /save closing date/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
  });

  test("Update pool core requirements", async ({ appPage }) => {
    // Update core requirements
    await appPage.page
      .getByRole("button", { name: /edit core requirements/i })
      .click();

    await appPage.page
      .getByRole("combobox", { name: /language requirement/i })
      .selectOption({ label: "Bilingual intermediate (B B B)" });

    await appPage.page
      .getByRole("combobox", { name: /security requirement/i })
      .selectOption({ label: "Reliability or higher" });

    await appPage.page
      .getByRole("button", { name: /save core requirements/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
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
      .getByRole("textbox", { name: /question \(en\)/i })
      .fill("Question 1 EN");
    await questionDialog
      .getByRole("textbox", { name: /question \(fr\)/i })
      .fill("Question 1 FR");

    await questionDialog
      .getByRole("button", { name: /save this question/i })
      .click();

    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);

    await expect(
      appPage.page.getByRole("button", { name: /edit item 0/i }),
    ).toBeVisible({ timeout: 15000 });

    await appPage.page
      .getByRole("button", { name: /add a new question/i })
      .click();

    questionDialog = appPage.page.getByRole("dialog", {
      name: /manage a general question/i,
    });

    await questionDialog
      .getByRole("textbox", { name: /question \(en\)/i })
      .fill("Question 2 EN");
    await questionDialog
      .getByRole("textbox", { name: /question \(fr\)/i })
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
