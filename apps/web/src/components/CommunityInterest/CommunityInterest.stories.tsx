import type { Meta, StoryObj } from "@storybook/react-vite";

import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import { fakeCommunityInterests } from "@gc-digital-talent/fake-data";
import {
  DevelopmentProgramParticipationStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import CommunityInterest, {
  CommunityInterest_Fragment,
  CommunityInterestOptions_Fragment,
} from "../CommunityInterest/CommunityInterest";

const meta = {
  component: CommunityInterest,
  decorators: [OverlayOrDialogDecorator],
} satisfies Meta<typeof CommunityInterest>;

export default meta;

const mockCommunityInterests = fakeCommunityInterests(1);
const communityInterestQuery = makeFragmentData(
  {
    ...mockCommunityInterests[0],
    jobInterest: false,
    trainingInterest: true,
    user: {
      __typename: "User",
      developmentProgramUserRecords:
        mockCommunityInterests[0].community.associatedDevelopmentPrograms
          // leave every third program without a record to show "Missing information"
          ?.filter((_, index) => index % 3 !== 2)
          .map((developmentProgram, index) => {
            const statuses = Object.values(
              DevelopmentProgramParticipationStatus,
            );
            return {
              __typename: "DevelopmentProgramUser" as const,
              id: index.toString(),
              developmentProgram: {
                __typename: "DevelopmentProgram" as const,
                id: developmentProgram.id,
              },
              participationStatus: statuses[index % statuses.length],
              completionDate: FAR_PAST_DATE,
            };
          }) ?? [],
    },
  },
  CommunityInterest_Fragment,
);

const communityInterestOptionsQuery = makeFragmentData(
  {
    __typename: "Query",
    communityInterestAdditionalDuties: [
      {
        __typename: "LocalizedEnumString",
        value: "1",
        label: { __typename: "LocalizedString", localized: "Duty 1" },
      },
      {
        __typename: "LocalizedEnumString",
        value: "2",
        label: { __typename: "LocalizedString", localized: "Duty 2" },
      },
    ],
    financeChiefRoles: [
      {
        __typename: "LocalizedEnumString",
        value: "1",
        label: { __typename: "LocalizedString", localized: "Role 1" },
      },
      {
        __typename: "LocalizedEnumString",
        value: "2",
        label: { __typename: "LocalizedString", localized: "Role 2" },
      },
    ],
  },
  CommunityInterestOptions_Fragment,
);

export const Default: StoryObj<typeof CommunityInterest> = {
  render: () => (
    <CommunityInterest
      communityInterestQuery={communityInterestQuery}
      communityInterestOptionsQuery={communityInterestOptionsQuery}
    />
  ),
};
