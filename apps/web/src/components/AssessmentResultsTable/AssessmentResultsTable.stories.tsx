import React from "react";
import type { StoryFn } from "@storybook/react";

import AssessmentResultsTable from "./AssessmentResultsTable";
import { testPoolCandidate } from "./testData";

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
