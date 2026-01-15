import { faker } from "@faker-js/faker/locale/en";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  PoolCandidate,
  Pool,
  User,
  EducationRequirementOption,
  OverallAssessmentStatus,
  ScreeningStage,
  ApplicationStatus,
} from "@gc-digital-talent/graphql";

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
      id: faker.string.uuid(),
      answer: faker.lorem.sentence(),
      generalQuestion,
    })) ?? [];
  const screeningQuestionResponses =
    pool.screeningQuestions?.map((screeningQuestion) => ({
      id: faker.string.uuid(),
      answer: faker.lorem.sentence(),
      screeningQuestion,
    })) ?? [];
  const educationRequirementExperiences = fakeExperiences(1);

  return {
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
    ),
    expiryDate: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<ApplicationStatus>(
        Object.values(ApplicationStatus),
      ),
    ),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: FAR_PAST_DATE,
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    isFlagged: faker.datatype.boolean(0.2),
    generalQuestionResponses,
    screeningQuestionResponses,
    screeningStage: toLocalizedEnum(
      faker.helpers.arrayElement<ScreeningStage>(Object.values(ScreeningStage)),
    ),
    assessmentStep: pool.assessmentSteps?.[0] ?? null,
    assessmentStatus: {
      assessmentStepStatuses: [],
      overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
    },
    finalDecisionAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
  };
};

export default (amount = 20): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();

  return Array.from({ length: amount }, (_x, index) =>
    generatePoolCandidate(pools, users, index),
  );
};
