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
  fakePoolSkills(2).map(() => {
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
  poolSkill?: PoolSkill,
): AssessmentResult => ({
  ...fakeAssessmentResults(1)[0],
  assessmentDecision: decision,
  assessmentResultType: type ?? AssessmentResultType.Skill,
  assessmentDecisionLevel: level ?? AssessmentDecisionLevel.AtRequired,
  poolSkill: poolSkill ?? essentialPoolSkills[0],
  assessmentStep,
});

/* Application screening step data (To assess status) */
export const applicationScreeningStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ApplicationScreening,
  sortOrder: 1,
  poolSkills: [...essentialPoolSkills, ...nonEssentialPoolSkills],
};
export const applicationScreeningResults: AssessmentResult[] = [
  getAssessmentResult(applicationScreeningStep, undefined, undefined),
  getAssessmentResult(applicationScreeningStep, undefined, undefined),
  getAssessmentResult(
    applicationScreeningStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Successful,
    AssessmentDecisionLevel.AboveAndBeyondRequired,
    essentialPoolSkills[1],
  ),
];

const experience = fakeExperiences(1)[0];
const experiencePoolSkill = fakePoolSkills(1)[0];
experience.skills?.push(experiencePoolSkill?.skill as Skill);

/* Screening questions step (Unsuccessful status) */
export const screeningQuestionsStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ScreeningQuestionsAtApplication,
  sortOrder: 2,
  poolSkills: [essentialPoolSkills[1], nonEssentialPoolSkills[0]],
};
export const screeningQuestionsResults: AssessmentResult[] = [
  getAssessmentResult(
    screeningQuestionsStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Unsuccessful,
  ),
];

/* Reference check step data (Hold status) */
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

/* Interview group step data (successful status) */
export const interviewGroupStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.InterviewGroup,
  sortOrder: 3,
  poolSkills: [...essentialPoolSkills],
};
export const interviewGroupResults: AssessmentResult[] = [
  getAssessmentResult(
    interviewGroupStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Successful,
    AssessmentDecisionLevel.AboveAndBeyondRequired,
    essentialPoolSkills[0],
  ),
  getAssessmentResult(
    interviewGroupStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Successful,
    AssessmentDecisionLevel.AtRequired,
    essentialPoolSkills[1],
  ),
];

// eslint-disable-next-line import/prefer-default-export
export const testPoolCandidate: PoolCandidate = {
  ...poolCandidate,
  id: faker.string.uuid(),
  user: {
    ...poolCandidate.user,
    userSkills: [
      fakeUserSkills(1, essentialPoolSkills[0].skill as Skill)[0],
      fakeUserSkills(1, essentialPoolSkills[1].skill as Skill)[0],
      fakeUserSkills(1, nonEssentialPoolSkills[0].skill as Skill)[0],
      fakeUserSkills(1, nonEssentialPoolSkills[1].skill as Skill)[0],
      fakeUserSkills(1, experiencePoolSkill.skill as Skill)[0],
    ],
    experiences: [experience],
  },
  pool: {
    ...poolCandidate.pool,
    poolSkills: [
      experiencePoolSkill,
      ...essentialPoolSkills,
      ...nonEssentialPoolSkills,
    ],
    assessmentSteps: [
      // set assessment steps out of order
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
    ...referenceCheckResults,
    ...interviewGroupResults,
  ],
};
