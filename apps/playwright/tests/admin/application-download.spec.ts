import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import ExcelDocument from "~/fixtures/ExcelDocument";
import PoolCandidatePage from "~/fixtures/PoolCandidatePage";
import WordDocument from "~/fixtures/WordDocument";
import { createAndSubmitApplication } from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createAndPublishPool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, me } from "~/utils/user";

test.describe("Application download", () => {
  let user: User;
  let application: PoolCandidate;

  test.beforeAll(async () => {
    const testId = generateUniqueTestId();
    const adminCtx = await graphql.newContext();
    const sub = `application.download.${testId}`;

    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        firstName: sub,
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
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${skill?.name.en}`,
                    id: skill?.id ?? "",
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
      skillIds: skill ? [skill?.id] : undefined,
      name: {
        en: `App download ${testId} (EN)`,
        fr: `App download ${testId} (FR)`,
      },
    });

    const applicantCtx = await graphql.newContext(
      createdUser?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const candidate = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    application = candidate;
    user = createdUser ?? { id: "" };
  });

  test("Verify application download contents", async ({ appPage }) => {
    const candidatePage = new PoolCandidatePage(appPage.page);
    await loginBySub(candidatePage.page, "admin@test.com");

    await candidatePage.toGoCandidate(application.id);

    const path = await candidatePage.downloadApplication();

    const doc = new WordDocument(appPage.page);
    await doc.setContent(path);

    const name = user.firstName ?? "Failed test, no user name";

    await expect(
      doc.page.getByRole("heading", { name: new RegExp(name, "i") }),
    ).toBeVisible();
    await expect(
      doc.page.getByText(new RegExp(`signed: ${name} signature`, "i")),
    ).toBeVisible();
  });

  // NOTE: Skipping until subscriptions are added so we know when the file has been generated
  // This was broken when we removed the polling query
  // Remember, you will need to modify the downloadProfileExcel function for subscriptions likely
  //
  // REF: https://github.com/GCTC-NTGC/gc-digital-talent/issues/15038
  //
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip("Verify profile excel contents", async ({ appPage }) => {
    const candidatePage = new PoolCandidatePage(appPage.page);
    await loginBySub(candidatePage.page, "admin@test.com");

    const name = user.firstName ?? "Failed test, no user name";

    await candidatePage.searchForCandidate(name);
    await candidatePage.page
      .getByRole("button", { name: new RegExp(`select ${name}`, "i") })
      .first()
      .click();

    const path = await candidatePage.downloadProfileExcel();

    const excel = new ExcelDocument();
    const data = await excel.getContents(path);

    const firstNames = data.map((profile) => profile["First name"]);

    expect(firstNames).toEqual([name]);
  });
});
