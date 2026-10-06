import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";

test("Can link skill to experience", { tag: "@uat" }, async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const role = `Test add goc term or indeterminate work experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  const applicantSub =
    process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";
  await loginBySub(experiencePage.page, applicantSub);

  // Ensure the other fields are filled out first
  // Must be a work experience as regression
  // for fields resetting on skill link
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

  await expect(experiencePage.page.getByRole("alert").last()).toContainText(
    skill + " selected.",
  );

  await expect(experiencePage.page.getByText(skill + " selected")).toBeHidden();

  await experiencePage.page
    .getByRole("textbox", { name: new RegExp(`how ${skill} featured`, "i") })
    .fill("Test description");

  await experiencePage.save();
  await experiencePage.waitForGraphqlResponse("CreateWorkExperience");

  await expect(experiencePage.page.getByRole("alert").last()).toContainText(
    /successfully added experience/i,
  );

  const applicantCtx = await graphql.newContext(applicantSub);
  const applicant = await me(applicantCtx, {});

  const workExperience = applicant.experiences?.find((ex) =>
    Boolean(ex && "role" in ex && ex.role === role),
  );
  await experiencePage.removeExperience(`${workExperience?.id}`);
});
