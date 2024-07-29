import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { makeFragmentData } from "@gc-digital-talent/graphql";

import AssessmentResultsTable, {
  AssessmentResultsTable_Fragment,
} from "./AssessmentResultsTable";
import { testPoolCandidate } from "./testData";

faker.seed(0);

const poolCandidate = testPoolCandidate;

export default {
  component: AssessmentResultsTable,
};

const Template: StoryFn<typeof AssessmentResultsTable> = (args) => (
  <AssessmentResultsTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  poolCandidateQuery: makeFragmentData(
    poolCandidate,
    AssessmentResultsTable_Fragment,
  ),
};
