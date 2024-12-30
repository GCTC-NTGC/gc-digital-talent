import { WorkExperience } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";

test.describe("Experiences", () => {
  const uniqueTestId = Date.now().valueOf();

  test("Can create external work experience", async ({ appPage }) => {
    const role = `Test add external work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addExternalWorkExperience({
      role,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

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

  test("Can create caf work experience", async ({ appPage }) => {
    const role = `Test add caf work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addCafWorkExperience({
      role,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can edit work experience", async ({ appPage }) => {
    const role = `Test edit work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addCafWorkExperience({
      role,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );

    await experiencePage.goToIndex();

    const applicantCtx = await graphql.newContext("applicant@test.com");
    const applicant = await me(applicantCtx, {});

    const workExperience = applicant.experiences?.find(
      (ex: WorkExperience) => ex?.role === role,
    );

    await experiencePage.editWorkExperience(`${workExperience?.id}`, {
      role,
      startDate: "2001-01",
      endDate: "2200-01",
    });
  });
});
