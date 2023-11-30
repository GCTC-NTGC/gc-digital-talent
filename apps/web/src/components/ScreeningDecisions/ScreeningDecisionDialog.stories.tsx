import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  fakeAssessmentSteps,
  fakeExperiences,
  fakePoolCandidates,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import { AssessmentStepType } from "@gc-digital-talent/graphql";

import ScreeningDecisionDialog from "./ScreeningDecisionDialog";

const assessmentStep = fakeAssessmentSteps(1)[0];
const poolCandidate = fakePoolCandidates(1)[0];
const experience = fakeExperiences(1)[0];
const skill = fakeSkills(1)[0];
experience.skills?.push(skill);
poolCandidate.user.experiences?.push(experience);

export default {
  component: ScreeningDecisionDialog,
  title: "Components/Screening Decisions/ScreeningDecisionDialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    assessmentStep,
    poolCandidate,
    skill,
    onSubmit: action("Submit Form"),
  },
} satisfies Meta<typeof ScreeningDecisionDialog>;

const Template: StoryFn<typeof ScreeningDecisionDialog> = (args) => {
  return <ScreeningDecisionDialog {...args} />;
};

export const Default = Template.bind({});
