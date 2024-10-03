import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import graphql from "~/utils/graphql";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, me } from "~/utils/user";
import { createAndSubmitApplication } from "~/utils/applications";
import { createAndPublishPool } from "~/utils/pools";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  let candidate: PoolCandidate;

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        sub,
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.Atlantic],
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${technicalSkill?.name.en}`,
                    id: technicalSkill?.id ?? "",
                  },
                ],
              },
              startDate: FAR_PAST_DATE,
              title: "Test Experience",
            },
          ],
        },
      },
    });

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      skillId: technicalSkill?.id ?? "",
      name: LOCALIZED_STRING,
    });

    const applicantCtx = await graphql.newContext(
      createdUser?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      experienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;
  });

  test("Qualifying candidate", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    await adminPage.page
      .getByRole("button", { name: /record final decision/i })
      .click();

    await adminPage.page
      .getByRole("radio", { name: /^qualify candidate/i })
      .click();

    const expiryDate = adminPage.page.getByRole("group", {
      name: /expiry date/i,
    });

    await expiryDate.getByRole("spinbutton", { name: /year/i }).fill("2400");
    await expiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await expiryDate.getByRole("spinbutton", { name: /day/i }).fill("1");
    await adminPage.page.getByRole("button", { name: /save changes/i }).click();

    await expect(
      adminPage.page.getByText(/expiry date: 2400-01-01/i),
    ).toBeVisible();
  });
});
