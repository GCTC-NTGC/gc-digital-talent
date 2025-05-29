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

export const Default = {
  args: {
    poolCandidateQuery: makeFragmentData(
      poolCandidate,
      AssessmentResultsTable_Fragment,
    ),
  },
};
