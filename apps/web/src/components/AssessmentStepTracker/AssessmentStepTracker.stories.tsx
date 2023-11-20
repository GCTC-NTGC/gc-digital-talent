import React from "react";
import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  fakeAssessmentSteps,
  fakePoolCandidates,
  fakePools,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentResultType,
  AssessmentStep,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import AssessmentStepTracker from "./AssessmentStepTracker";

faker.seed(0);

const assessmentSteps: AssessmentStep[] = fakeAssessmentSteps(3);
const candidates: PoolCandidate[] = fakePoolCandidates(50).map((candidate) => ({
  ...candidate,
  assessmentResults: faker.helpers
    .arrayElements(assessmentSteps, { min: 1, max: 3 })
    .map((step) => ({
      id: faker.string.uuid(),
      assessmentStep: step,
      assessmentResultType: faker.helpers.arrayElement<AssessmentResultType>(
        Object.values(AssessmentResultType),
      ),
      assessmentDecision: faker.helpers.arrayElement<AssessmentDecision>(
        Object.values(AssessmentDecision),
      ),
      assessmentResultJustification:
        faker.helpers.arrayElement<AssessmentResultJustification>(
          Object.values(AssessmentResultJustification),
        ),
      assessmentDecisionLevel:
        faker.helpers.arrayElement<AssessmentDecisionLevel>(
          Object.values(AssessmentDecisionLevel),
        ),
    })),
}));

let mockPool = fakePools(1)[0];
mockPool = {
  ...mockPool,
  assessmentSteps,
  poolCandidates: candidates,
};

export default {
  component: AssessmentStepTracker,
  title: "Components/AssessmentStepTracker",
};

const Template: StoryFn<typeof AssessmentStepTracker> = (args) => (
  <AssessmentStepTracker {...args} />
);

export const WithCandidates = Template.bind({});
WithCandidates.args = {
  pool: mockPool,
};

export const Empty = Template.bind({});
Empty.args = {
  pool: {
    ...mockPool,
    poolCandidates: [],
  },
};
