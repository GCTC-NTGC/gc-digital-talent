import { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeLocalizedEnum,
  fakeSearchRequests,
} from "@gc-digital-talent/fake-data";
import {
  allModes,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  FlexibleWorkLocation,
  makeFragmentData,
  PoolCandidateSearchStatus,
} from "@gc-digital-talent/graphql";

import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

import { ViewSearchRequest } from "./components/ViewSearchRequest";

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

const flexibleWorkOptionsQuery = makeFragmentData(
  {
    flexibleWorkLocation: [
      {
        value: FlexibleWorkLocation.Remote,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "REMOTE LOCALIZED",
        },
      },
      {
        value: FlexibleWorkLocation.Hybrid,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "HYBRID LOCALIZED",
        },
      },
      {
        value: FlexibleWorkLocation.Onsite,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "ONSITE LOCALIZED",
        },
      },
    ],
  },
  FlexibleWorkLocationOptions_Fragment,
);

const Template: StoryFn<typeof ViewSearchRequest> = (args) => {
  const { searchRequestQuery } = args;

  return (
    <ViewSearchRequest
      searchRequestQuery={searchRequestQuery}
      flexibleLocationOptionsQuery={flexibleWorkOptionsQuery}
    />
  );
};

export const Default = Template.bind({});
