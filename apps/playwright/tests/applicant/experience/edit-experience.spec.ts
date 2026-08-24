import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { me } from "~/utils/user";

test("Can edit work experience", { tag: "@uat" }, async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const role = `Test edit work experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  const applicantSub =
    process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";
  await loginBySub(experiencePage.page, applicantSub);

  await experiencePage.addCafWorkExperience({
    role,
    startDate: "2001-01",
  });

  await expect(experiencePage.page.getByRole("alert").last()).toContainText(
    /successfully added experience/i,
  );

  await experiencePage.goToIndex();

  const applicantCtx = await graphql.newContext(applicantSub);
  const applicant = await me(applicantCtx, {});

  const workExperience = applicant.experiences?.find((ex) =>
    Boolean(ex && "role" in ex && ex.role === role),
  );

  await experiencePage.editWorkExperience(`${workExperience?.id}`, {
    role,
    startDate: "2001-01",
    endDate: "2200-01",
  });

  await experiencePage.removeExperience(`${workExperience?.id}`);
});
