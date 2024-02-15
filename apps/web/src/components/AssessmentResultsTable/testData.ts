import { faker } from "@faker-js/faker";

import {
  fakeAssessmentResults,
  fakeExperiences,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResult,
  AssessmentResultJustification,
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolCandidate,
  PoolSkill,
  PoolSkillType,
  Skill,
} from "@gc-digital-talent/graphql";

faker.seed(0);

const poolCandidate = fakePoolCandidates(1)[0];
const assessmentSteps = poolCandidate.pool.assessmentSteps as AssessmentStep[];

const essentialPoolSkills: PoolSkill[] =
  fakePoolSkills(3).map(() => {
    return {
      id: faker.string.uuid(),
      type: PoolSkillType.Essential,
      skill: {
        ...fakeSkills(1)[0],
        id: faker.string.uuid(),
        name: {
          en: `EN ${faker.lorem.word()}`,
          fr: `FR ${faker.lorem.word()}`,
        },
      },
    };
  }) || [];

const nonEssentialPoolSkills: PoolSkill[] =
  fakePoolSkills(2).map(() => {
    return {
      id: faker.string.uuid(),
      type: PoolSkillType.Nonessential,
      skill: {
        ...fakeSkills(1)[0],
        id: faker.string.uuid(),
        name: {
          en: `EN ${faker.lorem.word()}`,
          fr: `FR ${faker.lorem.word()}`,
        },
      },
    };
  }) || [];

const getAssessmentResult = (
  assessmentStep?: AssessmentStep,
  type?: AssessmentResultType,
  decision?: AssessmentDecision,
  level?: AssessmentDecisionLevel,
): AssessmentResult => ({
  ...fakeAssessmentResults(1)[0],
  assessmentDecision: decision ?? AssessmentDecision.Successful,
  assessmentResultType: type ?? AssessmentResultType.Skill,
  assessmentDecisionLevel: level ?? AssessmentDecisionLevel.AtRequired,
  poolSkill: essentialPoolSkills[0],
  justifications: [
    AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
  ],
  assessmentStep,
});

export const applicationScreeningStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ApplicationScreening,
  sortOrder: 1,
  poolSkills: [...essentialPoolSkills, nonEssentialPoolSkills[0]],
};

// TO ASSESS
export const applicationScreeningResults: AssessmentResult[] = [
  getAssessmentResult(applicationScreeningStep),
  getAssessmentResult(
    applicationScreeningStep,
    AssessmentResultType.Education,
    AssessmentDecision.Successful,
    AssessmentDecisionLevel.AboveAndBeyondRequired,
  ),
];

const applicationScreeningStepUserSkill = applicationScreeningStep.poolSkills
  ? fakeUserSkills(1, applicationScreeningStep.poolSkills[0]?.skill as Skill)[0]
  : null;

export const screeningQuestionsStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ScreeningQuestionsAtApplication,
  sortOrder: 2,
  poolSkills: [...essentialPoolSkills, nonEssentialPoolSkills[1]],
};

// UNSUCCESSFUL
export const screeningQuestionsResults: AssessmentResult[] = [
  getAssessmentResult(
    screeningQuestionsStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Unsuccessful,
  ),
];

const screeningQuestionsStepUserSkill = screeningQuestionsStep.poolSkills
  ? fakeUserSkills(1, screeningQuestionsStep.poolSkills[2]?.skill as Skill)[0]
  : null;

export const interviewGroupStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.InterviewGroup,
  sortOrder: 3,
  poolSkills: [essentialPoolSkills[0], nonEssentialPoolSkills[1]],
};

// SUCCESSFUL
export const interviewGroupResults: AssessmentResult[] = [
  getAssessmentResult(
    interviewGroupStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Successful,
    AssessmentDecisionLevel.AboveRequired,
  ),
];

const interviewGroupStepUserSkill = interviewGroupStep.poolSkills
  ? fakeUserSkills(1, interviewGroupStep.poolSkills[0]?.skill as Skill)[0]
  : null;

// HOLD
export const referenceCheckStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ReferenceCheck,
  sortOrder: 4,
  poolSkills: [essentialPoolSkills[0]],
};

export const referenceCheckResults: AssessmentResult[] = [
  getAssessmentResult(
    referenceCheckStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Hold,
  ),
];
const referenceCheckStepUserSkill = referenceCheckStep.poolSkills
  ? fakeUserSkills(1, referenceCheckStep.poolSkills[0]?.skill as Skill)[0]
  : null;

const experience = fakeExperiences(1)[0];
experience.skills?.push(essentialPoolSkills[0].skill as Skill);

// eslint-disable-next-line import/prefer-default-export
export const testPoolCandidate: PoolCandidate = {
  ...poolCandidate,
  id: faker.string.uuid(),
  user: {
    ...poolCandidate.user,
    userSkills: [
      interviewGroupStepUserSkill,
      applicationScreeningStepUserSkill,
      screeningQuestionsStepUserSkill,
      referenceCheckStepUserSkill,
    ],
    experiences: [experience],
  },
  pool: {
    ...poolCandidate.pool,
    poolSkills: [...essentialPoolSkills, ...nonEssentialPoolSkills],
    assessmentSteps: [
      {
        ...interviewGroupStep,
        assessmentResults: interviewGroupResults,
      },
      {
        ...applicationScreeningStep,
        assessmentResults: applicationScreeningResults,
      },
      {
        ...referenceCheckStep,
        assessmentResults: referenceCheckResults,
      },
      {
        ...screeningQuestionsStep,
        assessmentResults: screeningQuestionsResults,
      },
    ],
  },
  assessmentResults: [
    ...applicationScreeningResults,
    ...screeningQuestionsResults,
    ...interviewGroupResults,
    ...referenceCheckResults,
  ],
};
