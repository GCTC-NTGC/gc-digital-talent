import { faker } from "@faker-js/faker";

import {
  fakeAssessmentSteps,
  fakePoolCandidates,
  fakePools,
} from "@gc-digital-talent/fake-data";
import {
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  Pool,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

faker.seed(0);

const fakePool = fakePools(1)[0];
const fakePoolAssessmentSteps = fakeAssessmentSteps(2);
const fakeCandidates = fakePoolCandidates(4);

const getAssessmentResult = (
  decision?: AssessmentDecision | null,
): AssessmentResult => ({
  id: faker.string.uuid(),
  assessmentDecision:
    typeof decision === "undefined" ? AssessmentDecision.Successful : decision,
  assessmentStep: fakePoolAssessmentSteps[0],
});

export const priorityEntitlementCandidate = {
  ...fakeCandidates[0],
  id: "priority-entitlement",
  user: {
    ...fakeCandidates[0].user,
    firstName: "priority",
    lastName: "entitlement",
    hasPriorityEntitlement: true,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
};
export const armedForcesCandidate = {
  ...fakeCandidates[1],
  id: "armed-forces",
  user: {
    ...fakeCandidates[1].user,
    firstName: "armed",
    lastName: "forces",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.Veteran,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
};
export const bookmarkedCandidate = {
  ...fakeCandidates[2],
  id: "bookmarked",
  user: {
    ...fakeCandidates[2].user,
    firstName: "bookmarked",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: true,
  assessmentResults: [getAssessmentResult()],
};
export const unassessedCandidate = {
  ...fakeCandidates[3],
  id: "unassessed",
  user: {
    ...fakeCandidates[3].user,
    firstName: "unassessed",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(null)],
};
export const unassessedWithSuccess = {
  ...unassessedCandidate,
  assessmentResults: [
    {
      ...getAssessmentResult(),
      type: AssessmentResultType.Skill,
      poolSkill: {
        id: faker.string.uuid(),
        type: PoolSkillType.Nonessential,
      },
    },
  ],
};
export const lastByFirstName = {
  ...unassessedWithSuccess,
  id: "last-by-first-name",
  isBookmarked: false,
  user: {
    id: faker.string.uuid(),
    firstName: "BB",
    lastName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};
export const firstByName = {
  ...unassessedWithSuccess,
  id: "first-by-name",
  isBookmarked: false,
  user: {
    id: faker.string.uuid(),
    firstName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};

export const testCandidates = [
  priorityEntitlementCandidate,
  armedForcesCandidate,
  bookmarkedCandidate,
  unassessedCandidate,
  unassessedWithSuccess,
  lastByFirstName,
  firstByName,
];

// eslint-disable-next-line import/prefer-default-export
export const poolWithAssessmentSteps: Pool = {
  ...fakePool,
  assessmentSteps: [
    {
      ...fakePoolAssessmentSteps[1],
      sortOrder: 2,
      assessmentResults: [],
    },
    {
      ...fakePoolAssessmentSteps[0],
      sortOrder: 1,
      assessmentResults: testCandidates.map((candidate) => ({
        ...candidate.assessmentResults[0],
        poolCandidate: candidate,
      })),
    },
  ],
  poolCandidates: testCandidates,
};
