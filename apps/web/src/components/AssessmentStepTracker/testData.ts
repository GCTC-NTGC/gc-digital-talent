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
  AssessmentStepType,
  Pool,
  PoolCandidate,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

faker.seed(0);

const fakePool = fakePools(1)[0];
const fakePoolAssessmentSteps = fakeAssessmentSteps(2);
const fakeCandidates = fakePoolCandidates(8);

const requiredAssessment = {
  ...fakePoolAssessmentSteps[0],
  type: AssessmentStepType.ApplicationScreening,
};

const getAssessmentResult = (
  decision?: AssessmentDecision | null,
): AssessmentResult => ({
  id: faker.string.uuid(),
  assessmentDecision:
    typeof decision === "undefined" ? AssessmentDecision.Successful : decision,
  assessmentResultType: AssessmentResultType.Education,
  assessmentStep: requiredAssessment,
});

export const priorityEntitlementCandidate: PoolCandidate = {
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
export const armedForcesCandidate: PoolCandidate = {
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
export const bookmarkedCandidate: PoolCandidate = {
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
export const unassessedCandidate: PoolCandidate = {
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
  assessmentResults: [
    getAssessmentResult(null),
    {
      ...getAssessmentResult(),
      assessmentResultType: AssessmentResultType.Skill,
      poolSkill: {
        id: faker.string.uuid(),
        type: PoolSkillType.Nonessential,
      },
    },
  ],
};
export const lastByFirstName: PoolCandidate = {
  ...fakeCandidates[4],
  id: "last-by-first-name",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  user: {
    id: faker.string.uuid(),
    firstName: "BB",
    lastName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};
export const firstByName: PoolCandidate = {
  ...fakeCandidates[5],
  id: "first-by-name",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  user: {
    id: faker.string.uuid(),
    firstName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};
export const secondLastByStatus: PoolCandidate = {
  ...fakeCandidates[6],
  id: "second-last-by-status",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(AssessmentDecision.Hold)],
  user: {
    id: faker.string.uuid(),
    firstName: "on",
    lastName: "hold",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};
export const lastByStatus: PoolCandidate = {
  ...fakeCandidates[7],
  id: "last-by-status",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(AssessmentDecision.Unsuccessful)],
  user: {
    id: faker.string.uuid(),
    firstName: "not",
    lastName: "successful",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};

export const testCandidates = [
  priorityEntitlementCandidate,
  armedForcesCandidate,
  bookmarkedCandidate,
  unassessedCandidate,
  lastByFirstName,
  firstByName,
  lastByStatus,
  secondLastByStatus,
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
      ...requiredAssessment,
      sortOrder: 1,
    },
  ],
  poolCandidates: testCandidates,
};
