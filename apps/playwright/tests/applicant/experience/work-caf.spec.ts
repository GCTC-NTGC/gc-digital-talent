import { WorkExperience } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import ExperiencePage from "~/fixtures/ExperiencePage";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";

test.describe("CAF work experience", () => {
  const uniqueTestId = Date.now().valueOf();

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
});
