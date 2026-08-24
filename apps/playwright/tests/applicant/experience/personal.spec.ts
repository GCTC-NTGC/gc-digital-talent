import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";

test("Can create personal experience", { tag: "@uat" }, async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const title = `Test add personal experience (${uniqueTestId})`;
  const experiencePage = new ExperiencePage(appPage.page);
  const applicantSub =
    process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";
  await loginBySub(experiencePage.page, applicantSub);

  await experiencePage.addPersonalExperience({
    title,
    startDate: "2001-01",
  });

  await expect(experiencePage.page.getByRole("alert").last()).toContainText(
    /successfully added experience/i,
  );

  const applicantCtx = await graphql.newContext(applicantSub);
  const applicant = await me(applicantCtx, {});

  const workExperience = applicant.experiences?.find((ex) =>
    Boolean(ex && "title" in ex && ex.title === title),
  );
  await experiencePage.removeExperience(`${workExperience?.id}`);
});
