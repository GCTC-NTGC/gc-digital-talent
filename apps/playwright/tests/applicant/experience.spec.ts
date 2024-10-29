import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";

test.describe("Experiences", () => {
  const uniqueTestId = Date.now().valueOf();

  test("Can create experience", async ({ appPage }) => {
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
});
