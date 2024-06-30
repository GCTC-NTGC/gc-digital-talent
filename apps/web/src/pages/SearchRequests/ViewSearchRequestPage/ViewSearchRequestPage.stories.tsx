import { Meta, StoryFn } from "@storybook/react";

import {
  fakeLocalizedEnum,
  fakeSearchRequests,
} from "@gc-digital-talent/fake-data";
import {
  allModes,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";

import { ViewSearchRequest } from "./components/ViewSearchRequest";
import { PoolCandidateSearchStatus } from "@gc-digital-talent/graphql";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: ViewSearchRequest,
  decorators: [MockGraphqlDecorator],
  args: {
    searchRequestQuery: mockSearchRequests[0],
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
      },
    },
    apiResponses: {
      UpdateSearchRequestOptions: {
        data: {
          statuses: fakeLocalizedEnum(PoolCandidateSearchStatus),
        },
      },
    },
  },
} as Meta<typeof ViewSearchRequest>;

const Template: StoryFn<typeof ViewSearchRequest> = (args) => {
  const { searchRequestQuery } = args;

  return <ViewSearchRequest searchRequestQuery={searchRequestQuery} />;
};

export const Default = Template.bind({});
