import { faker } from "@faker-js/faker/locale/en";

import {
  fakeAssessmentSteps,
  fakePoolCandidates,
  fakePools,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  ArmedForcesStatus,
  AssessmentDecision,
  OverallAssessmentStatus,
  AssessmentResult,
  AssessmentResultType,
  AssessmentStepType,
  ClaimVerificationResult,
  Pool,
  PoolCandidate,
  PoolCandidateStatus,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

faker.seed(0);

const fakePool = fakePools(1)[0];
const fakePoolAssessmentSteps = fakeAssessmentSteps(2);
const fakeCandidates = fakePoolCandidates(8);

const requiredAssessment = {
  ...fakePoolAssessmentSteps[0],
  type: toLocalizedEnum(AssessmentStepType.ApplicationScreening),
};

const getAssessmentResult = (
  decision?: AssessmentDecision | null,
): AssessmentResult => ({
  id: faker.string.uuid(),
  assessmentDecision: toLocalizedEnum(
    decision ?? AssessmentDecision.Successful,
  ),
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
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  priorityVerification: ClaimVerificationResult.Accepted,
  assessmentStatus: {
    currentStep: 2,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Successful,
      },
    ],
  },
};
export const armedForcesCandidate: PoolCandidate = {
  ...fakeCandidates[1],
  id: "armed-forces",
  user: {
    ...fakeCandidates[1].user,
    firstName: "armed",
    lastName: "forces",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.Veteran),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  veteranVerification: ClaimVerificationResult.Accepted,
  assessmentStatus: {
    currentStep: 2,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Successful,
      },
    ],
  },
};
export const bookmarkedCandidate: PoolCandidate = {
  ...fakeCandidates[2],
  id: "bookmarked",
  user: {
    ...fakeCandidates[2].user,
    firstName: "bookmarked",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: true,
  assessmentResults: [getAssessmentResult()],
  assessmentStatus: {
    currentStep: 2,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Successful,
      },
    ],
  },
};
export const unassessedCandidate: PoolCandidate = {
  ...fakeCandidates[3],
  id: "unassessed",
  user: {
    ...fakeCandidates[3].user,
    firstName: "unassessed",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: false,
  assessmentResults: [
    getAssessmentResult(null),
    {
      ...getAssessmentResult(),
      assessmentResultType: AssessmentResultType.Skill,
      poolSkill: {
        id: faker.string.uuid(),
        type: toLocalizedEnum(PoolSkillType.Nonessential),
      },
    },
  ],
  assessmentStatus: {
    currentStep: 1,
    assessmentStepStatuses: [],
  },
};
export const lastByFirstName: PoolCandidate = {
  ...fakeCandidates[4],
  id: "last-by-first-name",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  assessmentStatus: {
    currentStep: 2,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Successful,
      },
    ],
  },
  user: {
    id: faker.string.uuid(),
    firstName: "BB",
    lastName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
};
export const firstByName: PoolCandidate = {
  ...fakeCandidates[5],
  id: "first-by-name",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  assessmentStatus: {
    currentStep: 2,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Successful,
      },
    ],
  },
  user: {
    id: faker.string.uuid(),
    firstName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
};
export const secondLastByStatus: PoolCandidate = {
  ...fakeCandidates[6],
  id: "second-last-by-status",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(AssessmentDecision.Hold)],
  assessmentStatus: {
    currentStep: 1,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Hold,
      },
    ],
  },
  user: {
    id: faker.string.uuid(),
    firstName: "on",
    lastName: "hold",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
};
export const lastByStatus: PoolCandidate = {
  ...fakeCandidates[7],
  id: "last-by-status",
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(AssessmentDecision.Unsuccessful)],
  assessmentStatus: {
    currentStep: 1,
    overallAssessmentStatus: OverallAssessmentStatus.Disqualified,
    assessmentStepStatuses: [
      {
        step: requiredAssessment.id,
        decision: AssessmentDecision.Unsuccessful,
      },
    ],
  },
  user: {
    id: faker.string.uuid(),
    firstName: "not",
    lastName: "successful",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
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

export const filterDisqualifiedTestData: PoolCandidate[] = [
  {
    ...fakeCandidates[0],
    user: fakeCandidates[0].user,
    status: toLocalizedEnum(PoolCandidateStatus.ScreenedOutApplication),
    assessmentResults: [],
  },
  {
    ...fakeCandidates[1],
    user: fakeCandidates[1].user,
    status: toLocalizedEnum(PoolCandidateStatus.NewApplication),
    assessmentResults: [],
  },
  {
    ...fakeCandidates[2],
    user: fakeCandidates[2].user,
    status: toLocalizedEnum(PoolCandidateStatus.ScreenedOutAssessment),
    assessmentResults: [{ id: "123" }],
  },
];

// claim verification test data
const priorityEntitlementAccepted: PoolCandidate = {
  ...fakeCandidates[0],
  id: "priority-entitlement-accepted",
  user: {
    ...fakeCandidates[0].user,
    firstName: "accepted",
    lastName: "priority",
    hasPriorityEntitlement: true,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  priorityVerification: ClaimVerificationResult.Accepted,
};
const priorityEntitlementUnverified: PoolCandidate = {
  ...fakeCandidates[1],
  id: "priority-entitlement-unverified",
  user: {
    ...fakeCandidates[1].user,
    firstName: "unverified",
    lastName: "priority",
    hasPriorityEntitlement: true,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  priorityVerification: ClaimVerificationResult.Unverified,
};
const priorityEntitlementRejected: PoolCandidate = {
  ...fakeCandidates[2],
  id: "priority-entitlement-rejected",
  user: {
    ...fakeCandidates[2].user,
    firstName: "rejected",
    lastName: "priority",
    hasPriorityEntitlement: true,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.NonCaf),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  priorityVerification: ClaimVerificationResult.Rejected,
};
const veteranAccepted: PoolCandidate = {
  ...fakeCandidates[3],
  id: "veteran-accepted",
  user: {
    ...fakeCandidates[3].user,
    firstName: "accepted",
    lastName: "veteran",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.Veteran),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  veteranVerification: ClaimVerificationResult.Accepted,
};
const veteranUnverified: PoolCandidate = {
  ...fakeCandidates[4],
  id: "veteran-unverified",
  user: {
    ...fakeCandidates[4].user,
    firstName: "unverified",
    lastName: "veteran",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.Veteran),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  veteranVerification: ClaimVerificationResult.Unverified,
};
const veteranRejected: PoolCandidate = {
  ...fakeCandidates[5],
  id: "veteran-rejected",
  user: {
    ...fakeCandidates[5].user,
    firstName: "rejected",
    lastName: "veteran",
    hasPriorityEntitlement: false,
    armedForcesStatus: toLocalizedEnum(ArmedForcesStatus.Veteran),
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
  veteranVerification: ClaimVerificationResult.Rejected,
};

export const claimVerificationTestData = [
  priorityEntitlementAccepted,
  priorityEntitlementUnverified,
  priorityEntitlementRejected,
  veteranAccepted,
  veteranUnverified,
  veteranRejected,
];
