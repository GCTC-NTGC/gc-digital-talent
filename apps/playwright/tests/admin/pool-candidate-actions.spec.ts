import type { PoolCandidate, Skill, User } from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import graphql from "~/utils/graphql";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import { createAndSubmitApplication } from "~/utils/applications";
import { createAndPublishPool } from "~/utils/pools";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  let uniqueTestId: string;
  let sub: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;
  let user: User | undefined;

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    user = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
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
        flexibleWorkLocations: [FlexibleWorkLocation.Hybrid],
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              organization: "Test Organization or platform",
              learningDescription: "Test Experience Learning Description",
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
    const admin = await me(adminCtx, {});
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: admin?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: LOCALIZED_STRING,
    });

    const applicantCtx = await graphql.newContext(
      user?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      poolId: createdPool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;
  });

  test.afterEach(async () => {
    if (user?.id) {
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Verification and notes mutations", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // priority verification
    await appPage.page
      .getByRole("button", { name: "Edit Priority status" })
      .click();
    await appPage.page
      .getByRole("radio", { name: "This claim has been verified" })
      .click();
    await appPage.page.getByRole("spinbutton", { name: "Year" }).fill("2030");
    await appPage.page
      .getByRole("combobox", { name: "Month" })
      .selectOption("01");
    await appPage.page.getByRole("spinbutton", { name: "Day" }).fill("25");
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      appPage.page.getByText(
        /This claim has been verified, expires on January 25th, 2030/i,
      ),
    ).toBeVisible();

    // veteran verification
    await appPage.page
      .getByRole("button", { name: "Edit Veteran status" })
      .click();
    await appPage.page
      .getByRole("radio", { name: "This claim does not apply to" })
      .click();
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      appPage.page.getByText(/This claim does not apply to/i),
    ).toBeVisible();

    // notes
    await appPage.page.getByRole("button", { name: "Add notes" }).click();
    await appPage.page
      .getByRole("textbox", { name: "Notes" })
      .fill("Notes notes notes");
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await appPage.waitForGraphqlResponse("UpdateApplicationNotes");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await expect(
      appPage.page.getByRole("button", { name: /edit notes/i }),
    ).toBeVisible();
    await expect(appPage.page.getByText(/Notes notes notes/i)).toBeVisible();
  });
});
