import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

test.describe("Experiences", () => {
  const uniqueTestId = Date.now().valueOf();

  test("Can create work experience", async ({ appPage }) => {
    const role = `Test add work experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addWorkExperience({
      role,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create personal experience", async ({ appPage }) => {
    const title = `Test add personal experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addPersonalExperience({
      title,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create community experience", async ({ appPage }) => {
    const title = `Test add community experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addCommunityExperience({
      title,
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create award experience", async ({ appPage }) => {
    const title = `Test add award experience (${uniqueTestId})`;
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addAwardExperience({
      title,
      awardedDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can create education experience", async ({ appPage }) => {
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    await experiencePage.addEducationExperience({
      startDate: "2001-01",
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      /successfully added experience/i,
    );
  });

  test("Can link skill to experience", async ({ appPage }) => {
    const experiencePage = new ExperiencePage(appPage.page);
    await loginBySub(experiencePage.page, "applicant@test.com");

    const skill = "Courage";

    await experiencePage.linkSkilltoExperience({
      experienceType: "work",
      skill: skill,
    });

    await expect(experiencePage.page.getByRole("alert")).toContainText(
      skill + " selected.",
    );
  });
});
