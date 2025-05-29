import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import AssessmentStepTracker, {
  AssessmentStepTracker_CandidateFragment,
  AssessmentStepTracker_PoolFragment,
} from "./AssessmentStepTracker";
import { poolWithAssessmentSteps } from "./testData";

export default {
  component: AssessmentStepTracker,
  decorators: [MockGraphqlDecorator],
  args: {
    fetching: false,
    poolQuery: makeFragmentData(
      poolWithAssessmentSteps,
      AssessmentStepTracker_PoolFragment,
    ),
  },
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

export const Default = {
  args: {
    candidateQuery: unpackMaybes(poolWithAssessmentSteps.poolCandidates).map(
      (candidate) =>
        makeFragmentData(candidate, AssessmentStepTracker_CandidateFragment),
    ),
  },
};

export const Null = {
  args: {
    candidateQuery: [],
  },
};
