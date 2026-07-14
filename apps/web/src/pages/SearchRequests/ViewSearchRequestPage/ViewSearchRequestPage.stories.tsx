import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeSearchRequests,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { allModes } from "@gc-digital-talent/storybook-helpers";
import {
  FlexibleWorkLocation,
  makeFragmentData,
  TalentRequestCompletionDetail,
  TalentRequestInProgressDetail,
  TalentRequestSource,
  TalentRequestStatus,
} from "@gc-digital-talent/graphql";

import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";
import { TalentRequestSourceOptions_Fragment } from "~/components/SearchRequestFilters/fragment";

import {
  TalentRequestOptions_Fragment,
  ViewSearchRequest,
} from "./components/ViewSearchRequest";
import { TalentRequestStatusOptions_Fragment } from "./components/TalentRequestStatusDialog";

const mockSearchRequests = fakeSearchRequests();

const locationOptions = makeFragmentData(
  {
    __typename: "Query",
    flexibleWorkLocation: Object.values(FlexibleWorkLocation).map((loc) => ({
      value: loc,
      label: {
        en: `${loc} EN`,
        fr: `${loc} FR`,
        localized: `${loc} LOCALIZED`,
      },
    })),
  },
  FlexibleWorkLocationOptions_Fragment,
);

const talentSourceOptions = makeFragmentData(
  {
    __typename: "Query",
    talentSource: Object.values(TalentRequestSource).map((source) => ({
      value: source,
      label: {
        en: `${source} EN`,
        fr: `${source} FR`,
      },
    })),
  },
  TalentRequestSourceOptions_Fragment,
);

const statusOptions = makeFragmentData(
  {
    __typename: "Query",
    statuses: Object.values(TalentRequestStatus).map((status) => ({
      __typename: "LocalizedTalentRequestStatus" as const,
      ...toLocalizedEnum(status),
    })),
    inProgressDetails: Object.values(TalentRequestInProgressDetail).map(
      (detail) => ({
        __typename: "LocalizedTalentRequestInProgressDetail" as const,
        ...toLocalizedEnum(detail),
      }),
    ),
    completionDetails: Object.values(TalentRequestCompletionDetail).map(
      (detail) => ({
        __typename: "LocalizedTalentRequestCompletionDetail" as const,
        ...toLocalizedEnum(detail),
      }),
    ),
  },
  TalentRequestStatusOptions_Fragment,
);

const options = makeFragmentData(
  Object.assign(
    { __typename: "Query" as const },
    locationOptions,
    talentSourceOptions,
    statusOptions,
  ),
  TalentRequestOptions_Fragment,
);

export default {
  component: ViewSearchRequest,
  args: {
    searchRequestQuery: mockSearchRequests[0],
    optionsQuery: options,
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
      },
    },
  },
} as Meta<typeof ViewSearchRequest>;

const Template: StoryFn<typeof ViewSearchRequest> = (args) => {
  const { searchRequestQuery, optionsQuery } = args;

  return (
    <ViewSearchRequest
      searchRequestQuery={searchRequestQuery}
      optionsQuery={optionsQuery}
    />
  );
};

export const Default = Template.bind({});
