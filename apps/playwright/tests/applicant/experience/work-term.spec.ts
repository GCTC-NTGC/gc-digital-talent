import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";

test("Can create goc term or indeterminate work experience", async ({
  appPage,
}) => {
  const uniqueTestId = generateUniqueTestId();
  const role = `Test add goc term or indeterminate work experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  await loginBySub(experiencePage.page, "applicant@test.com");

  await experiencePage.addGovTermOrIndeterminateWorkExperience({
    role,
    startDate: "2001-01",
    endDate: "2023-01",
  });

  await expect(experiencePage.page.getByRole("alert")).toContainText(
    /successfully added experience/i,
  );
});
