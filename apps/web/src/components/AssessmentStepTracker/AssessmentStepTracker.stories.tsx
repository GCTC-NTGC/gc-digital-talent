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
const candidates: PoolCandidate[] = fakePoolCandidates(20).map((candidate) => {
  const furthestStep = faker.number.int({ min: 1, max: 3 });
  return {
    ...candidate,
    assessmentResults: Array.from<number>({ length: furthestStep }).map(
      (_, stepIndex) => ({
        id: faker.string.uuid(),
        assessmentStep: assessmentSteps[stepIndex],
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
      }),
    ),
  };
});

let mockPool = fakePools(1)[0];
mockPool = {
  ...mockPool,
  assessmentSteps: assessmentSteps.map((step) => ({
    ...step,
    assessmentResults: candidates
      .filter(
        (candidate) =>
          candidate.assessmentResults?.some(
            (result) => result?.assessmentStep?.id === step.id,
          ),
      )
      .map((candidate) => ({
        id: faker.string.uuid(),
        ...candidate.assessmentResults?.find(
          (result) => result?.assessmentStep?.id === step.id,
        ),
        poolCandidate: candidate,
      })),
  })),
};

export default {
  component: AssessmentStepTracker,
  title: "Components/Assessment Step Tracker",
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
