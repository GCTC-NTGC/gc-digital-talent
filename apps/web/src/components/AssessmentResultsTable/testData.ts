import { faker } from "@faker-js/faker/locale/en";

import {
  fakeAssessmentResults,
  fakeExperiences,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultType,
  AssessmentStepType,
  PoolSkillType,
  SkillLevel,
} from "@gc-digital-talent/graphql";

faker.seed(0);

const poolCandidate = fakePoolCandidates(1)[0];
const assessmentSteps = unpackMaybes(poolCandidate.pool.assessmentSteps);

const makeTestPoolSkill = (type: PoolSkillType) => ({
  id: faker.string.uuid(),
  type: toLocalizedEnum(type),
  requiredLevel: SkillLevel.Beginner,
  skill: {
    ...fakeSkills(1)[0],
    id: faker.string.uuid(),
    name: {
      en: `EN ${faker.lorem.word()}`,
      fr: `FR ${faker.lorem.word()}`,
    },
  },
});

type TestPoolSkill = ReturnType<typeof makeTestPoolSkill>;

const makeTestAssessmentStep = (
  type: AssessmentStepType,
  sortOrder: number,
  poolSkills: TestPoolSkill[],
) => ({
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: toLocalizedEnum(type),
  sortOrder,
  poolSkills,
});

type TestAssessmentStep = ReturnType<typeof makeTestAssessmentStep>;

const essentialPoolSkills = fakePoolSkills(2).map(() =>
  makeTestPoolSkill(PoolSkillType.Essential),
);

const nonEssentialPoolSkills = fakePoolSkills(2).map(() =>
  makeTestPoolSkill(PoolSkillType.Nonessential),
);

const getAssessmentResult = (
  assessmentStep?: TestAssessmentStep,
  type?: AssessmentResultType,
  decision?: AssessmentDecision,
  level?: AssessmentDecisionLevel,
  poolSkill?: TestPoolSkill,
) => ({
  ...fakeAssessmentResults(1)[0],
  assessmentDecision: decision ? toLocalizedEnum(decision) : undefined,
  assessmentResultType: type ?? AssessmentResultType.Skill,
  assessmentDecisionLevel: toLocalizedEnum(
    level ?? AssessmentDecisionLevel.AtRequired,
  ),
  poolSkill: poolSkill ?? essentialPoolSkills[0],
  assessmentStep,
});

/* Application screening step data (To assess status) */
export const applicationScreeningStep = makeTestAssessmentStep(
  AssessmentStepType.ApplicationScreening,
  1,
  [...essentialPoolSkills, ...nonEssentialPoolSkills],
);
const applicationScreeningResults = [
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
if (experiencePoolSkill.skill) {
  experience.skills?.push(experiencePoolSkill?.skill);
}

/* Screening questions step (Unsuccessful status) */
export const screeningQuestionsStep = makeTestAssessmentStep(
  AssessmentStepType.ScreeningQuestionsAtApplication,
  2,
  [essentialPoolSkills[1], nonEssentialPoolSkills[0]],
);
const screeningQuestionsResults = [
  getAssessmentResult(
    screeningQuestionsStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Unsuccessful,
    undefined,
    essentialPoolSkills[1],
  ),
];

/* Reference check step data (Hold status) */
export const referenceCheckStep = makeTestAssessmentStep(
  AssessmentStepType.ReferenceCheck,
  4,
  [essentialPoolSkills[0]],
);
const referenceCheckResults = [
  getAssessmentResult(
    referenceCheckStep,
    AssessmentResultType.Skill,
    AssessmentDecision.Hold,
    undefined,
    essentialPoolSkills[0],
  ),
];

/* Interview group step data (successful status) */
export const interviewGroupStep = makeTestAssessmentStep(
  AssessmentStepType.InterviewGroup,
  3,
  [...essentialPoolSkills],
);
const interviewGroupResults = [
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

export const testPoolCandidate = {
  ...poolCandidate,
  id: faker.string.uuid(),
  user: {
    ...poolCandidate.user,
    userSkills: [
      fakeUserSkills(1, essentialPoolSkills[0].skill)[0],
      fakeUserSkills(1, essentialPoolSkills[1].skill)[0],
      fakeUserSkills(1, nonEssentialPoolSkills[0].skill)[0],
      fakeUserSkills(1, nonEssentialPoolSkills[1].skill)[0],
      fakeUserSkills(1, experiencePoolSkill.skill!)[0],
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
      },
      {
        ...applicationScreeningStep,
      },
      {
        ...referenceCheckStep,
      },
      {
        ...screeningQuestionsStep,
      },
    ],
  },
  assessmentResults: [
    ...applicationScreeningResults,
    ...screeningQuestionsResults,
    ...referenceCheckResults,
    ...interviewGroupResults,
  ],
  profileSnapshot: null,
};
