import { faker } from "@faker-js/faker/locale/en";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type {
  PoolCandidate,
  Pool,
  User,
} from "@gc-digital-talent/graphql/schema-types";
import {
  EducationRequirementOption,
  OverallAssessmentStatus,
  ScreeningStage,
  ApplicationStatus,
} from "@gc-digital-talent/graphql/schema-types";

import fakeExperiences from "./fakeExperiences";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generatePoolCandidate = (
  pools: Pool[],
  users: User[],
  index: number,
): PoolCandidate => {
  faker.seed(index); // repeatable results

  const pool = faker.helpers.arrayElement<Pool>(pools);
  const user = faker.helpers.arrayElement<User>(users);
  const generalQuestionResponses =
    pool.generalQuestions?.map((generalQuestion) => ({
      __typename: "GeneralQuestionResponse" as const,
      id: faker.string.uuid(),
      answer: faker.lorem.sentence(),
      generalQuestion,
    })) ?? [];
  const screeningQuestionResponses =
    pool.screeningQuestions?.map((screeningQuestion) => ({
      __typename: "ScreeningQuestionResponse" as const,
      id: faker.string.uuid(),
      answer: faker.lorem.sentence(),
      screeningQuestion,
    })) ?? [];
  const educationRequirementExperiences = fakeExperiences(1);

  const expiryDate = faker.date
    .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
    .toISOString()
    .substring(0, 10);

  return {
    __typename: "PoolCandidate",
    id: faker.string.uuid(),
    pool,
    user,
    educationRequirementExperiences,
    educationRequirementExperienceIds: educationRequirementExperiences.flatMap(
      ({ id }) => id,
    ),
    educationRequirementOption: toLocalizedEnum(
      faker.helpers.arrayElement<EducationRequirementOption>(
        Object.values(EducationRequirementOption),
      ),
      "LocalizedEducationRequirementOption",
    ),
    expiryDate,
    applicationStatusData: {
      __typename: "PoolCandidateStatusData",
      status: toLocalizedEnum(
        faker.helpers.arrayElement<ApplicationStatus>(
          Object.values(ApplicationStatus),
        ),
        "LocalizedApplicationStatus",
      ),
      screeningStage: toLocalizedEnum(
        faker.helpers.arrayElement<ScreeningStage>(
          Object.values(ScreeningStage),
        ),
        "LocalizedScreeningStage",
      ),
      pauseReferralsAt: faker.date.past().toISOString(),
      resumeReferralsAt: expiryDate,
      pauseReferralsReason: faker.lorem.sentence(),
    },
    statusUpdatedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: FAR_PAST_DATE,
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    applicationAssessmentData: {
      __typename: "PoolCandidateAssessmentData",
      isFlagged: faker.datatype.boolean(0.2),
    },
    generalQuestionResponses,
    screeningQuestionResponses,
    assessmentStep: pool.assessmentSteps?.[0] ?? null,
    assessmentStatus: {
      __typename: "AssessmentResultStatus",
      assessmentStepStatuses: [],
      overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
    },
  };
};

export default (amount = 20): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();

  return Array.from({ length: amount }, (_x, index) =>
    generatePoolCandidate(pools, users, index),
  );
};
