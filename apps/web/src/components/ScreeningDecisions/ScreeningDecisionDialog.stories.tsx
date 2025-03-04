import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentSteps,
  fakeExperiences,
  fakeLocalizedEnum,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentStepType,
} from "@gc-digital-talent/graphql";

import { ScreeningDecisionDialog } from "./ScreeningDecisionDialog";

const assessmentStep = fakeAssessmentSteps(1)[0];
const poolCandidate = fakePoolCandidates(1)[0];
const experience = fakeExperiences(1)[0];
const poolSkill = fakePoolSkills(1)[0];
const skill = poolSkill?.skill ?? fakeSkills(1)[0];
experience.skills?.push(skill);
poolCandidate.user.experiences?.push(experience);
poolCandidate.user.userSkills?.push(fakeUserSkills(1, skill)[0]);

poolCandidate.profileSnapshot = JSON.stringify(poolCandidate.user);

export default {
  component: ScreeningDecisionDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    assessmentStep,
    poolCandidate,
    poolSkill,
    experiences: [experience],
    onSubmit: action("Submit Form"),
    isOpen: true,
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

const Template: StoryFn<typeof ScreeningDecisionDialog> = (args) => {
  return <ScreeningDecisionDialog {...args} />;
};

export const EducationRequirement = Template.bind({});
EducationRequirement.args = {
  assessmentStep: undefined,
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const ApplicationScreening = Template.bind({});
ApplicationScreening.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const ScreeningQuestions = Template.bind({});
ScreeningQuestions.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ScreeningQuestionsAtApplication,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const Generic = Template.bind({});
Generic.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.InterviewFollowup,
  )[0],
  poolCandidate,
  poolSkill,
  isOpen: true,
};
export const WithInitialValues = Template.bind({});
WithInitialValues.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
  initialValues: {
    assessmentDecision: AssessmentDecision.Successful,
    justifications: [],
    assessmentDecisionLevel: AssessmentDecisionLevel.AboveAndBeyondRequired,
    skillDecisionNotes:
      "This applicant went above and beyond our expectations.",
  },
  isOpen: true,
};
