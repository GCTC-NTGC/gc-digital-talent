import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

const uniqueTestId = Date.now().valueOf();

test("Can create goc contractor work experience", async ({ appPage }) => {
  const role = `Test add goc contractor work experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  await loginBySub(experiencePage.page, "applicant@test.com");

  await experiencePage.addGovContractorWorkExperience({
    role,
    startDate: "2001-01",
    endDate: "2023-01",
  });

  await expect(experiencePage.page.getByRole("alert")).toContainText(
    /successfully added experience/i,
  );
});
