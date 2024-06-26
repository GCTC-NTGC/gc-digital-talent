import { test, expect } from "~/fixtures";

const UPDATE_MUTATION = "UpdatePool";

/**
 * Actions associated with processes
 *
 * Note: Separate so they can be run in serial mode
 */
test.describe.configure({ mode: "serial" });
test.describe("Process actions", () => {
  const uniqueTestId = Date.now().valueOf();
  const PROCESS_TITLE = `Test process ${uniqueTestId}`;

  test("Should create a new pool", async ({ adminPage }) => {
    await adminPage.page.goto("/en/admin/pools");
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page.getByRole("link", { name: /create process/i }).click();
    await adminPage.waitForGraphqlResponse("CreatePoolPage");

    await adminPage.page
      .getByRole("combobox", { name: /starting group and level/i })
      .selectOption({ label: "IT-01 (Information Technology)" });

    await adminPage.page
      .getByRole("combobox", { name: /parent team/i })
      .selectOption({ label: "Digital Community Management" });

    await adminPage.page
      .getByRole("combobox", { name: /parent department/i })
      .selectOption({ label: "Treasury Board Secretariat" });

    await adminPage.page
      .getByRole("button", { name: /create process/i })
      .click();
    await adminPage.waitForGraphqlResponse("CreatePool");
    await expect(adminPage.page.getByRole("alert")).toContainText(
      /recruitment process created successfully/i,
    );
    await adminPage.waitForGraphqlResponse("EditPoolPage");
    await expect(
      adminPage.page.getByRole("heading", {
        name: /advertisement information/i,
      }),
    ).toBeVisible();

    // Update basic information section
    await adminPage.page
      .getByRole("button", { name: /edit advertisement details/i })
      .click();

    await adminPage.page
      .getByRole("combobox", { name: /classification/i })
      .selectOption({ label: "IT-04 (Information Technology)" });

    await adminPage.page
      .getByRole("textbox", { name: /job title \(en\)/i })
      .fill(`${PROCESS_TITLE} (EN)`);

    await adminPage.page
      .getByRole("textbox", { name: /job title \(fr\)/i })
      .fill(`${PROCESS_TITLE} (FR)`);

    await adminPage.page
      .getByRole("combobox", { name: /length of opportunity/i })
      .selectOption({ label: "Various" });

    await adminPage.page
      .getByRole("combobox", { name: /publishing group/i })
      .selectOption({ label: "Other" });

    await adminPage.page
      .getByRole("button", { name: /save advertisement details/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Update closing date
    await adminPage.page
      .getByRole("button", { name: /edit closing date/i })
      .click();

    const closingDate = adminPage.page.getByRole("group", {
      name: /end date/i,
    });
    await closingDate.getByRole("spinbutton", { name: /year/i }).fill("2500");
    await closingDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await closingDate.getByRole("spinbutton", { name: /day/i }).fill("1");

    await adminPage.page
      .getByRole("button", { name: /save closing date/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Update core requirements
    await adminPage.page
      .getByRole("button", { name: /edit core requirements/i })
      .click();

    await adminPage.page
      .getByRole("combobox", { name: /language requirement/i })
      .selectOption({ label: "Bilingual intermediate" });

    await adminPage.page
      .getByRole("combobox", { name: /security requirement/i })
      .selectOption({ label: "Reliability or higher" });

    await adminPage.page
      .getByRole("button", { name: /save core requirements/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Add a question
    await adminPage.page
      .getByRole("button", { name: /add a new question/i })
      .click();

    let questionDialog = adminPage.page.getByRole("dialog", {
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

    await adminPage.page
      .getByRole("button", { name: /add a new question/i })
      .click();

    questionDialog = adminPage.page.getByRole("dialog", {
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

    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
  });

  test("Update pool", async ({ adminPage }) => {
    await adminPage.page.goto("/en/admin/pools");
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page.getByRole("button", { name: /show 10/i }).click();
    await adminPage.page.getByRole("menuitemradio", { name: /50/i }).click();
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page
      .getByRole("textbox", { name: /search processes/i })
      .fill(PROCESS_TITLE);
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page
      .getByRole("link", { name: new RegExp(PROCESS_TITLE, "i") })
      .click();

    await adminPage.page
      .getByRole("link", { name: /edit advertisement/i })
      .click();
    await adminPage.waitForGraphqlResponse("EditPoolPage");

    await adminPage.page
      .getByRole("button", { name: /edit advertisement/i })
      .click();

    await adminPage.page
      .getByRole("combobox", { name: /work stream/i })
      .selectOption({ label: "Business Line Advisory Services" });

    await adminPage.page
      .getByRole("textbox", { name: /process number/i })
      .fill("123");

    await adminPage.page
      .getByRole("button", { name: /save advertisement details/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Reorder questions
    await adminPage.page
      .getByRole("button", { name: /change order from 2 to 1/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Delete question
    await adminPage.page
      .getByRole("button", { name: /remove item 1/i })
      .click();
    await adminPage.waitForGraphqlResponse(UPDATE_MUTATION);
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );

    // Preview advertisement
    await adminPage.page
      .getByRole("link", { name: new RegExp(PROCESS_TITLE, "i") })
      .click();

    const newTabPromise = adminPage.page.waitForEvent("popup");
    await adminPage.page
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

  test("Delete pool", async ({ adminPage }) => {
    await adminPage.page.goto("/en/admin/pools");
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page.getByRole("button", { name: /show 10/i }).click();
    await adminPage.page.getByRole("menuitemradio", { name: /50/i }).click();
    await adminPage.waitForGraphqlResponse("PoolTable");

    await adminPage.page
      .getByRole("link", { name: new RegExp(PROCESS_TITLE, "i") })
      .click();
    await adminPage.waitForGraphqlResponse("ViewPoolPage");

    await adminPage.page.getByRole("button", { name: /delete/i }).click();
    const deleteDialog = adminPage.page.getByRole("dialog", {
      name: /delete/i,
    });
    await deleteDialog.getByRole("button", { name: /delete/i }).click();

    await adminPage.waitForGraphqlResponse("DeletePool");
    await expect(adminPage.page.getByRole("alert").last()).toContainText(
      /process deleted successfully/i,
    );
  });
});
