import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentSteps,
  fakeExperiences,
  fakePoolCandidates,
  fakePoolSkills,
  fakeSkills,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentStepType,
} from "@gc-digital-talent/graphql";

import { ScreeningDecisionDialog } from "./ScreeningDecisionDialog";

const assessmentStep = fakeAssessmentSteps(1)[0];
const poolCandidate = fakePoolCandidates(1)[0];
const experience = fakeExperiences(1)[0];
const poolSkill = fakePoolSkills(1)[0];
const skill = poolSkill?.skill ? poolSkill.skill : fakeSkills(1)[0];
experience.skills?.push(skill);
poolCandidate.user.experiences?.push(experience);
poolCandidate.user.userSkills?.push(fakeUserSkills(1, skill)[0]);

export default {
  component: ScreeningDecisionDialog,
  title: "Components/Screening Decisions/ScreeningDecisionDialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    assessmentStep,
    poolCandidate,
    poolSkill,
    onSubmit: action("Submit Form"),
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
};
export const ApplicationScreening = Template.bind({});
ApplicationScreening.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ApplicationScreening,
  )[0],
  poolCandidate,
  poolSkill,
};
export const ScreeningQuestions = Template.bind({});
ScreeningQuestions.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.ScreeningQuestionsAtApplication,
  )[0],
  poolCandidate,
  poolSkill,
};
export const Generic = Template.bind({});
Generic.args = {
  assessmentStep: fakeAssessmentSteps(
    1,
    AssessmentStepType.InterviewFollowup,
  )[0],
  poolCandidate,
  poolSkill,
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
    assessmentNotes: undefined,
    otherJustificationNotes: undefined,
  },
};
