import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";

test("Can create award experience", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
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
