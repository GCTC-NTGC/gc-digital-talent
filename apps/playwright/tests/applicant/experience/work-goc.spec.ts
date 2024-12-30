import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

test.describe("GOC work experiences", () => {
  const uniqueTestId = Date.now().valueOf();

  test("Can create goc student work experience", async ({ appPage }) => {
    const role = `Test add goc student work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addGovStudentWorkExperience({
      role,
      startDate: "2001-01",
      endDate: "2200-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create goc casual work experience", async ({ appPage }) => {
    const role = `Test add goc casual work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addGovCasualWorkExperience({
      role,
      startDate: "2001-01",
      endDate: "2023-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create goc term or indeterminate work experience", async ({
    appPage,
  }) => {
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
});
