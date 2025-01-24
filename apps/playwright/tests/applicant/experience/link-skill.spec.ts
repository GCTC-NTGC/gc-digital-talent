import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

const uniqueTestId = Date.now().valueOf();

test("Can link skill to experience", async ({ appPage }) => {
  const role = `Test add goc term or indeterminate work experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  await loginBySub(experiencePage.page, "applicant@test.com");

  // Ensure the other fields are filled out first
  await experiencePage.addGovTermOrIndeterminateWorkExperience(
    {
      role,
      startDate: "2001-01",
      endDate: "2023-01",
    },
    false,
  );

  const skill = "Courage";

  await experiencePage.linkSkillToExperience({
    experienceType: "work",
    skill: skill,
  });

  await expect(experiencePage.page.getByRole("alert")).toContainText(
    skill + " selected.",
  );

  await experiencePage.save();
  await experiencePage.waitForGraphqlResponse("CreateWorkExperience");

  await expect(experiencePage.page.getByRole("alert")).toContainText(
    /successfully added experience/i,
  );
});
