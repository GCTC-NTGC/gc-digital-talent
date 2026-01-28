import { faker } from "@faker-js/faker/locale/en";

import {
  fakeAssessmentSteps,
  fakeClassifications,
  fakeDepartments,
  fakePoolCandidates,
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
  fakeWorkStreams,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  OverallAssessmentStatus,
  AssessmentResult,
  AssessmentResultType,
  AssessmentStep,
  PoolCandidate,
  PoolSkill,
  ApplicationStatus,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

faker.seed(0);

// Create a fake pool with three required skills
const fakePool = fakePools(
  1,
  fakeSkills(20, fakeSkillFamilies(6)),
  fakeClassifications(),
  fakeDepartments(),
  fakeWorkStreams(),
  3,
)[0];
// make three assessment steps which assess all the pool skills
const fakePoolAssessmentSteps = fakeAssessmentSteps(3).map((step, index) => {
  return {
    ...step,
    sortOrder: index + 1,
    poolSkills: fakePool.poolSkills,
  };
});
const fakeCandidates = fakePoolCandidates(8).map((candidate) => ({
  ...candidate,
  status: toLocalizedEnum(ApplicationStatus.ToAssess),
}));

const makeAssessmentResult = (
  assessmentStep: AssessmentStep,
  poolSkill: PoolSkill | null, // Leave this null for an Education assessment
  decision: AssessmentDecision | undefined,
): AssessmentResult => ({
  id: faker.string.uuid(),
  assessmentDecision: decision ? toLocalizedEnum(decision) : undefined,
  assessmentResultType:
    poolSkill === null
      ? AssessmentResultType.Education
      : AssessmentResultType.Skill,
  poolSkill,
  assessmentStep,
});

export const candidateFullyQualifiedExceptMissingEducation: PoolCandidate = {
  ...fakeCandidates[0],
  assessmentStep: fakePoolAssessmentSteps[0],
  assessmentStatus: {
    assessmentStepStatuses: [],
    overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step) =>
      step.poolSkills?.map((poolSkill) =>
        makeAssessmentResult(step, poolSkill, AssessmentDecision.Successful),
      ),
    ),
  ].filter(notEmpty),
};

export const candidateFullyQualified: PoolCandidate = {
  ...fakeCandidates[1],
  assessmentStep: null,
  assessmentStatus: {
    overallAssessmentStatus: OverallAssessmentStatus.Qualified,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step) =>
      step.poolSkills?.map((poolSkill) =>
        makeAssessmentResult(step, poolSkill, AssessmentDecision.Successful),
      ),
    ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateQualifiedExceptHoldOnMiddleAssessment: PoolCandidate = {
  ...fakeCandidates[2],
  assessmentStep: null,
  assessmentStatus: {
    overallAssessmentStatus: OverallAssessmentStatus.Qualified,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step, index) =>
      step.poolSkills?.map((poolSkill) =>
        makeAssessmentResult(
          step,
          poolSkill,
          index === 1 // Index 1 is the middle of three assessment steps
            ? AssessmentDecision.Hold
            : AssessmentDecision.Successful,
        ),
      ),
    ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateQualifiedExceptHoldOnFinalAssessment: PoolCandidate = {
  ...fakeCandidates[3],
  assessmentStep: fakePoolAssessmentSteps[2],
  assessmentStatus: {
    assessmentStepStatuses: [],
    overallAssessmentStatus: OverallAssessmentStatus.Qualified,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step, index) =>
      step.poolSkills?.map((poolSkill) =>
        makeAssessmentResult(
          step,
          poolSkill,
          index === 2 // Index 2 is the final of three assessment steps
            ? AssessmentDecision.Hold
            : AssessmentDecision.Successful,
        ),
      ),
    ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateUnfinishedFinalAssessment: PoolCandidate = {
  ...fakeCandidates[4],
  assessmentStep: fakePoolAssessmentSteps[2],
  assessmentStatus: {
    assessmentStepStatuses: fakePoolAssessmentSteps.flatMap((step) => ({
      step: step.id,
      decision: null,
    })),
    overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step, stepIndex) =>
      step.poolSkills?.map((poolSkill, skillIndex) =>
        makeAssessmentResult(
          step,
          poolSkill,
          stepIndex === 2 && skillIndex === 0 // Leave one skill on final step undecided
            ? undefined
            : AssessmentDecision.Successful,
        ),
      ),
    ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateHoldOnMiddleStepAndNoResultsOnFinalStep: PoolCandidate = {
  ...fakeCandidates[5],
  assessmentStep: fakePoolAssessmentSteps[2],
  assessmentStatus: {
    assessmentStepStatuses: [],
    overallAssessmentStatus: OverallAssessmentStatus.ToAssess,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps
      .slice(0, 2)
      .flatMap((step, index) =>
        step.poolSkills?.map((poolSkill) =>
          makeAssessmentResult(
            step,
            poolSkill,
            index === 1
              ? AssessmentDecision.Hold
              : AssessmentDecision.Successful,
          ),
        ),
      ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateOneFailingAssessment: PoolCandidate = {
  ...fakeCandidates[6],
  assessmentStep: fakePoolAssessmentSteps[0],
  assessmentStatus: {
    assessmentStepStatuses: fakePoolAssessmentSteps.flatMap((step) => ({
      step: step.id,
      decision: AssessmentDecision.Unsuccessful,
    })),
    overallAssessmentStatus: OverallAssessmentStatus.Disqualified,
  },
  assessmentResults: [
    ...fakePoolAssessmentSteps.flatMap((step, stepIndex) =>
      step.poolSkills?.map((poolSkill, skillIndex) =>
        makeAssessmentResult(
          step,
          poolSkill,
          stepIndex === 1 && skillIndex === 1
            ? AssessmentDecision.Unsuccessful
            : AssessmentDecision.Successful,
        ),
      ),
    ),
    // Add one more assessment result for Education requirement of Application Assessment step
    makeAssessmentResult(
      fakePoolAssessmentSteps[0],
      null,
      AssessmentDecision.Successful,
    ),
  ].filter(notEmpty),
};

export const candidateNoAssessments: PoolCandidate = fakeCandidates[7];
