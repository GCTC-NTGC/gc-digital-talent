import type { Meta, StoryObj } from "@storybook/react-vite";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakeCommunityInterests } from "@gc-digital-talent/fake-data";

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
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        mockCommunityInterests[0].interestInDevelopmentPrograms?.map(
          (interest, index) => {
            return {
              __typename: "DevelopmentProgramUser" as const,
              id: index.toString(),
              developmentProgram: {
                __typename: "DevelopmentProgram" as const,
                id: interest.developmentProgram.id,
              },
              participationStatus: interest.participationStatus,
              completionDate: interest.completionDate,
            };
          },
        ) ?? [],
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
