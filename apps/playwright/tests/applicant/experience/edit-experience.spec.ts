import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { me } from "~/utils/user";

test("Can edit work experience", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
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

  const workExperience = applicant.experiences?.find((ex) =>
    Boolean(ex && "role" in ex && ex.role === role),
  );

  await experiencePage.editWorkExperience(`${workExperience?.id}`, {
    role,
    startDate: "2001-01",
    endDate: "2020-01",
  });
});
