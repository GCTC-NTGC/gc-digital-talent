import { faker } from "@faker-js/faker/locale/en";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type { User } from "@gc-digital-talent/graphql/schema-types";
import {
  ApplicationStep,
  CandidateRemovalReason,
  DisqualificationReason,
  EducationRequirementOption,
  OverallAssessmentStatus,
  PlacementType,
  ScreeningStage,
  ApplicationStatus,
} from "@gc-digital-talent/graphql/schema-types";

import fakeDepartments from "./fakeDepartments";
import fakeExperiences from "./fakeExperiences";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generatePoolCandidate = (
  pools: ReturnType<typeof fakePools>,
  users: User[],
  index: number,
) => {
  faker.seed(index); // repeatable results

  const pool = faker.helpers.arrayElement(pools);
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

  // Every generated candidate has a submitted_at, so DRAFT is not a state it can be in.
  const status = faker.helpers.arrayElement(
    Object.values(ApplicationStatus).filter(
      (value) => value !== ApplicationStatus.Draft,
    ),
  );
  const isQualified = status === ApplicationStatus.Qualified;

  const placementType = isQualified
    ? faker.helpers.arrayElement<PlacementType>(Object.values(PlacementType))
    : null;
  const isPlaced =
    placementType !== null &&
    placementType !== PlacementType.NotPlaced &&
    placementType !== PlacementType.UnderConsideration;

  const isReferring = isQualified ? faker.datatype.boolean() : true;
  const pauseReferralsAt = isReferring ? null : faker.date.past().toISOString();
  const resumeReferralsAt = isReferring ? null : expiryDate;
  const pauseReferralsReason = isReferring ? null : faker.lorem.sentence();

  return {
    __typename: "PoolCandidate" as const,
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
      __typename: "PoolCandidateStatusData" as const,
      status: toLocalizedEnum(status, "LocalizedApplicationStatus"),
      screeningStage:
        status === ApplicationStatus.ToAssess
          ? toLocalizedEnum(
              faker.helpers.arrayElement<ScreeningStage>(
                Object.values(ScreeningStage),
              ),
              "LocalizedScreeningStage",
            )
          : null,
      pauseReferralsAt,
      resumeReferralsAt,
      pauseReferralsReason,
      disqualificationReason:
        status === ApplicationStatus.Disqualified
          ? toLocalizedEnum(
              faker.helpers.arrayElement<DisqualificationReason>(
                Object.values(DisqualificationReason),
              ),
              "LocalizedDisqualificationReason",
            )
          : null,
      removalReason:
        status === ApplicationStatus.Removed
          ? toLocalizedEnum(
              faker.helpers.arrayElement<CandidateRemovalReason>(
                Object.values(CandidateRemovalReason),
              ),
              "LocalizedCandidateRemovalReason",
            )
          : null,
      placementType: placementType
        ? toLocalizedEnum(placementType, "LocalizedPlacementType")
        : null,
      placedDepartment: isPlaced ? fakeDepartments()[0] : null,
    },
    statusUpdatedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: FAR_PAST_DATE,
    submittedSteps: Object.values(ApplicationStep),
    signature: faker.person.fullName(),
    isSpecialApplication: faker.datatype.boolean(),
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    isBookmarked: faker.datatype.boolean(),
    applicationAssessmentData: {
      __typename: "PoolCandidateAssessmentData" as const,
      isFlagged: faker.datatype.boolean(0.2),
    },
    generalQuestionResponses,
    screeningQuestionResponses,
    assessmentStep: pool.assessmentSteps?.[0] ?? null,
    assessmentStatus: {
      __typename: "AssessmentResultStatus" as const,
      assessmentStepStatuses: [],
      overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
    },
  };
};

export default (amount = 20) => {
  const pools = fakePools();
  const users = fakeUsers();

  return Array.from({ length: amount }, (_x, index) =>
    generatePoolCandidate(pools, users, index),
  );
};
