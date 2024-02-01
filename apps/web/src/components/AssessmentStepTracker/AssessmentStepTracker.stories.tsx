import React from "react";
import type { StoryFn } from "@storybook/react";

import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import AssessmentStepTracker from "./AssessmentStepTracker";
import { poolWithAssessmentSteps } from "./testData";

export default {
  component: AssessmentStepTracker,
  title: "Components/Assessment Step Tracker",
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 500,
        max: 2000,
      },
    },
    apiResponses: {
      ToggleBookmark_Mutation: {
        data: {
          togglePoolCandidateBookmark: true,
        },
      },
    },
  },
};

const Template: StoryFn<typeof AssessmentStepTracker> = (args) => (
  <AssessmentStepTracker {...args} />
);

export const WithCandidates = Template.bind({});
WithCandidates.args = {
  pool: poolWithAssessmentSteps,
};

export const Empty = Template.bind({});
Empty.args = {
  pool: {
    ...poolWithAssessmentSteps,
    poolCandidates: [],
  },
};
