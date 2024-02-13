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

const applicationScreeningStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ApplicationScreening,
  sortOrder: 1,
  poolSkills: [...essentialPoolSkills, nonEssentialPoolSkills[0]],
};

const applicationScreeningStepUserSkill = applicationScreeningStep.poolSkills
  ? fakeUserSkills(1, applicationScreeningStep.poolSkills[0]?.skill as Skill)[0]
  : null;

const screeningQuestionsStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ScreeningQuestionsAtApplication,
  sortOrder: 2,
  poolSkills: [...essentialPoolSkills, nonEssentialPoolSkills[1]],
};

const screeningQuestionsStepUserSkill = screeningQuestionsStep.poolSkills
  ? fakeUserSkills(1, screeningQuestionsStep.poolSkills[2]?.skill as Skill)[0]
  : null;

const interviewGroupStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.InterviewGroup,
  sortOrder: 3,
  poolSkills: [essentialPoolSkills[0], nonEssentialPoolSkills[1]],
};

const interviewGroupStepUserSkill = interviewGroupStep.poolSkills
  ? fakeUserSkills(1, interviewGroupStep.poolSkills[0]?.skill as Skill)[0]
  : null;

const referenceCheckStep: AssessmentStep = {
  ...assessmentSteps[0],
  id: faker.string.uuid(),
  type: AssessmentStepType.ReferenceCheck,
  sortOrder: 4,
  poolSkills: [essentialPoolSkills[0]],
};

const referenceCheckStepUserSkill = referenceCheckStep.poolSkills
  ? fakeUserSkills(1, referenceCheckStep.poolSkills[0]?.skill as Skill)[0]
  : null;

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
        assessmentResults: [
          getAssessmentResult(
            interviewGroupStep,
            AssessmentResultType.Skill,
            AssessmentDecision.Successful,
            AssessmentDecisionLevel.AboveRequired,
          ),
        ],
      },
      {
        ...applicationScreeningStep,
        assessmentResults: [
          getAssessmentResult(applicationScreeningStep),
          getAssessmentResult(
            applicationScreeningStep,
            AssessmentResultType.Education,
            AssessmentDecision.Successful,
            AssessmentDecisionLevel.AboveAndBeyondRequired,
          ),
        ],
      },
      {
        ...referenceCheckStep,
        assessmentResults: [
          getAssessmentResult(
            referenceCheckStep,
            AssessmentResultType.Skill,
            AssessmentDecision.Hold,
          ),
        ],
      },
      {
        ...screeningQuestionsStep,
        assessmentResults: [
          getAssessmentResult(
            screeningQuestionsStep,
            AssessmentResultType.Skill,
            AssessmentDecision.Unsuccessful,
          ),
        ],
      },
    ],
  },
  assessmentResults: [
    getAssessmentResult(applicationScreeningStep),
    getAssessmentResult(
      applicationScreeningStep,
      AssessmentResultType.Education,
      AssessmentDecision.Successful,
      AssessmentDecisionLevel.AboveAndBeyondRequired,
    ),
    getAssessmentResult(
      screeningQuestionsStep,
      AssessmentResultType.Skill,
      AssessmentDecision.Unsuccessful,
    ),
    getAssessmentResult(
      interviewGroupStep,
      AssessmentResultType.Skill,
      AssessmentDecision.Successful,
      AssessmentDecisionLevel.AboveRequired,
    ),
    getAssessmentResult(
      referenceCheckStep,
      AssessmentResultType.Skill,
      AssessmentDecision.Hold,
    ),
  ],
};
