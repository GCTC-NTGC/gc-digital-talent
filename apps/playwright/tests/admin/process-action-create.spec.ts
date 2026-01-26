import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";

const UPDATE_MUTATION = "UpdatePool";

test("Create pool", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const PROCESS_TITLE = `Test process ${uniqueTestId}`;
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
    .selectOption({ label: "Treasury Board of Canada Secretariat" });

  await appPage.page
    .getByRole("combobox", { name: /community/i })
    .selectOption({ label: "Digital Community" });

  await appPage.page.getByRole("button", { name: /create process/i }).click();
  await appPage.waitForGraphqlResponse("CreatePool");

  // Update basic information section
  await appPage.page
    .getByRole("button", { name: /edit advertisement details/i })
    .click();

  await appPage.page
    .getByRole("combobox", { name: /classification/i })
    .selectOption({ label: "IT-04 (Information Technology)" });

  await appPage.page
    .getByRole("textbox", { name: /job title \(english\)/i })
    .fill(`${PROCESS_TITLE} (EN)`);

  await appPage.page
    .getByRole("textbox", { name: /job title \(french\)/i })
    .fill(`${PROCESS_TITLE} (FR)`);

  await appPage.page
    .getByRole("combobox", { name: /employment duration/i })
    .selectOption({ label: "Various" });

  await appPage.page
    .getByRole("combobox", { name: /publishing group/i })
    .selectOption({ label: "Other" });

  await appPage.page
    .getByRole("button", { name: /save advertisement details/i })
    .click();
  await appPage.waitForGraphqlResponse(UPDATE_MUTATION);

  // Update closing date
  await appPage.page
    .getByRole("button", { name: /edit closing date/i })
    .click();

  const closingDate = appPage.page.getByRole("group", {
    name: /closing date/i,
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
