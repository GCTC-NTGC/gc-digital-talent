import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

test("Can link skill to experience", async ({ appPage }) => {
  const experiencePage = new ExperiencePage(appPage.page);
  await loginBySub(experiencePage.page, "applicant@test.com");

  const skill = "Courage";

  await experiencePage.linkSkillToExperience({
    experienceType: "work",
    skill: skill,
  });

  await expect(experiencePage.page.getByRole("alert")).toContainText(
    skill + " selected.",
  );
});
