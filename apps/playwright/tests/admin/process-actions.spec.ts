import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createPool } from "~/utils/pools";
import { me } from "~/utils/user";

const UPDATE_MUTATION = "UpdatePool";

/**
 * Actions associated with processes
 */
test.describe("Process actions", () => {
  const uniqueTestId = Date.now().valueOf();
  const PROCESS_TITLE = `Test process ${uniqueTestId}`;

  test("Should create a pool", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/en/admin/pools");
    await appPage.waitForGraphqlResponse("PoolTable");

    await appPage.page.getByRole("link", { name: /create process/i }).click();
    await appPage.waitForGraphqlResponse("CreatePoolPage");

    await appPage.page
      .getByRole("combobox", { name: /group and level/i })
      .selectOption({ label: "IT-01 (Information Technology)" });

    await appPage.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board Secretariat" });

    await appPage.page
      .getByRole("combobox", { name: /community/i })
      .selectOption({ label: "Digital Community" });

    await appPage.page.getByRole("button", { name: /create process/i }).click();
    await appPage.waitForGraphqlResponse("CreatePool");
    await expect(appPage.page.getByRole("alert")).toContainText(
      /recruitment process created successfully/i,
    );
    await appPage.waitForGraphqlResponse("EditPoolPage");
    await appPage.waitForGraphqlResponse("CoreRequirementOptions");
    await expect(
      appPage.page.getByRole("heading", {
        name: /advertisement information/i,
      }),
    ).toBeVisible();

    // Update basic information section
    await appPage.page
      .getByRole("button", { name: /edit advertisement details/i })
      .click();

    await appPage.page
      .getByRole("combobox", { name: /classification/i })
      .selectOption({ label: "IT-04 (Information Technology)" });

    await appPage.page
      .getByRole("textbox", { name: /job title \(en\)/i })
      .fill(`${PROCESS_TITLE} (EN)`);

    await appPage.page
      .getByRole("textbox", { name: /job title \(fr\)/i })
      .fill(`${PROCESS_TITLE} (FR)`);

    await appPage.page
      .getByRole("combobox", { name: /length of opportunity/i })
      .selectOption({ label: "Various" });

    await appPage.page
      .getByRole("combobox", { name: /publishing group/i })
      .selectOption({ label: "Other" });

    await appPage.page
      .getByRole("button", { name: /save advertisement details/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

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

  test("Update pool", async ({ appPage }) => {
    test.slow();
    const adminCtx = await graphql.newContext();

    const user = await me(adminCtx, {});
    const poolName = {
      en: "Update pool test (EN)",
      fr: "Update pool test (FR)",
    };

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

    await appPage.page
      .getByRole("button", { name: /edit advertisement details/i })
      .click();

    await appPage.page
      .getByRole("textbox", { name: /job title \(en\)/i })
      .fill(poolName.en);

    await appPage.page
      .getByRole("textbox", { name: /job title \(fr\)/i })
      .fill(poolName.fr);

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

    // Preview advertisement
    await appPage.page.goto(`/en/admin/pools/${createdPool.id}`);
    await appPage.waitForGraphqlResponse("ViewPoolPage");

    const newTabPromise = appPage.page.waitForEvent("popup");
    await appPage.page
      .getByRole("link", { name: /preview advertisement/i })
      .click();
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await expect(
      newTab.getByRole("heading", {
        name: /employment details/i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("Delete pool", async ({ appPage }) => {
    const adminCtx = await graphql.newContext();

    const user = await me(adminCtx, {});

    const createdPool = await createPool(adminCtx, {
      userId: user.id,
    });

    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/pools/${createdPool.id}`);
    await appPage.waitForGraphqlResponse("ViewPoolPage");

    await appPage.page.getByRole("button", { name: /delete/i }).click();
    const deleteDialog = appPage.page.getByRole("dialog", {
      name: /delete/i,
    });
    await deleteDialog.getByRole("button", { name: /delete/i }).click();

    await appPage.waitForGraphqlResponse("DeletePool");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process deleted successfully/i,
    );
  });
});
