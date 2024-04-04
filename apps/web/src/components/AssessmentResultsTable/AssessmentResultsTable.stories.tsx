import React from "react";
import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import AssessmentResultsTable from "./AssessmentResultsTable";
import { testPoolCandidate } from "./testData";

faker.seed(0);

const poolCandidate = testPoolCandidate;

export default {
  component: AssessmentResultsTable,
  title: "Components/Assessment Step Table",
};

const Template: StoryFn<typeof AssessmentResultsTable> = (args) => (
  <AssessmentResultsTable {...args} />
);

export const WithCandidates = Template.bind({});
WithCandidates.args = {
  poolCandidate,
};
