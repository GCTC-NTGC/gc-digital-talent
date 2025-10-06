import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { generateUniqueNumber, generateUniqueTestId } from "~/utils/id";

test("Create department", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const uniqueDepartmentNumber = generateUniqueNumber();
  const DEPARTMENT_TITLE = `Test department ${uniqueTestId}`;
  await loginBySub(appPage.page, "platform@test.com");
  await appPage.page.goto("/en/admin/settings/departments");
  await appPage.waitForGraphqlResponse("Departments");

  await appPage.page.getByRole("link", { name: /create department/i }).click();
  await appPage.waitForGraphqlResponse("CreateDepartmentOptions");

  await appPage.page
    .getByRole("textbox", { name: /name \(english\)/i })
    .fill(`${DEPARTMENT_TITLE} (EN)`);

  await appPage.page
    .getByRole("textbox", { name: /name \(french\)/i })
    .fill(`${DEPARTMENT_TITLE} (FR)`);

  await appPage.page
    .getByRole("spinbutton", { name: /department number/i })
    .fill(uniqueDepartmentNumber);

  await appPage.page
    .getByRole("spinbutton", { name: /organization id/i })
    .fill(`1`);

  await appPage.page
    .getByRole("combobox", { name: /department size/i })
    .selectOption({ label: "Small (up to 1000 employees)" });

  await appPage.page
    .getByRole("button", { name: /create department/i })
    .click();
  await appPage.waitForGraphqlResponse("CreateDepartment");
  await expect(appPage.page.getByRole("alert").last()).toContainText(
    /department created successfully/i,
  );
  await appPage.waitForGraphqlResponse("ViewDepartmentPage");
  await expect(
    appPage.page.getByRole("heading", {
      name: /department information/i,
    }),
  ).toBeVisible();
});
