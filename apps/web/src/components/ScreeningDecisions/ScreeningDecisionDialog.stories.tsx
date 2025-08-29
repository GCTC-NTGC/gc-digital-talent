import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";

import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentResults,
  fakeAssessmentSteps,
  fakeExperiences,
  fakeLocalizedEnum,
  fakePoolCandidates,
  fakePools,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResult,
  AssessmentResultJustification,
  AssessmentStepType,
  makeFragmentData,
  Pool,
  PoolCandidate,
  User,
} from "@gc-digital-talent/graphql";

import ScreeningDecisionDialog, {
  ScreeningDecisionDialog_Fragment,
} from "./ScreeningDecisionDialog";

faker.seed(0);

const poolSkill = fakePoolSkills(1)[0];
const applicationScreeningStep = {
  ...fakeAssessmentSteps(1, AssessmentStepType.ApplicationScreening, [
    poolSkill,
  ])[0],
  id: AssessmentStepType.ApplicationScreening,
};
const screeningQuestionsStep = {
  ...fakeAssessmentSteps(
    1,
    AssessmentStepType.ScreeningQuestionsAtApplication,
    [poolSkill],
  )[0],
  id: AssessmentStepType.ScreeningQuestionsAtApplication,
};
const genericStep = {
  ...fakeAssessmentSteps(1, AssessmentStepType.InterviewFollowup, [
    poolSkill,
  ])[0],
  id: "GENERIC",
};

const experience = fakeExperiences(1)[0];
const skill = poolSkill?.skill ?? fakeSkills(1)[0];
const pool: Pool = {
  ...fakePools(1)[0],
  poolSkills: [poolSkill],
  assessmentSteps: [
    applicationScreeningStep,
    screeningQuestionsStep,
    genericStep,
  ],
};

const fakeCandidate = fakePoolCandidates(1)[0];
const user: User = {
  ...fakeCandidate.user,
  experiences: [experience],
  userSkills: fakeUserSkills(1, skill),
};
const poolCandidate: PoolCandidate = {
  ...fakeCandidate,
  pool,
  profileSnapshot: JSON.stringify(user),
  user,
};

const meta = {
  component: ScreeningDecisionDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    query: makeFragmentData(poolCandidate, ScreeningDecisionDialog_Fragment),
    poolSkillId: poolSkill.id,
    defaultOpen: true,
  },
  parameters: {
    apiResponses: {
      ScreeningOptions: {
        data: {
          justifications: fakeLocalizedEnum(AssessmentResultJustification),
          decisions: fakeLocalizedEnum(AssessmentDecision),
          decisionLevels: fakeLocalizedEnum(AssessmentDecisionLevel),
        },
      },
    },
  },
} satisfies Meta<typeof ScreeningDecisionDialog>;
export default meta;

type Story = StoryObj<typeof ScreeningDecisionDialog>;

export const EducationRequirement: Story = {
  args: {
    stepId: applicationScreeningStep.id,
    poolSkillId: undefined,
  },
};

export const ApplicationScreening: Story = {
  args: {
    stepId: applicationScreeningStep.id,
  },
};

export const ScreeningQuestions: Story = {
  args: {
    stepId: screeningQuestionsStep.id,
  },
};

export const Generic: Story = {
  args: {
    stepId: genericStep.id,
  },
};

const result: AssessmentResult = {
  ...fakeAssessmentResults(1, applicationScreeningStep, poolSkill)[0],
  assessmentDecision: toLocalizedEnum(AssessmentDecision.Successful),
  justifications: [],
  assessmentDecisionLevel: toLocalizedEnum(
    AssessmentDecisionLevel.AboveAndBeyondRequired,
  ),
  skillDecisionNotes: faker.lorem.paragraph(),
};

const initialValuesCandidate: PoolCandidate = {
  ...poolCandidate,
  assessmentResults: [result],
};

export const WithInitialValues: Story = {
  args: {
    stepId: applicationScreeningStep.id,
    query: makeFragmentData(
      initialValuesCandidate,
      ScreeningDecisionDialog_Fragment,
    ),
  },
};
