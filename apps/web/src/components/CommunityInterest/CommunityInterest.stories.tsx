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
      developmentProgramUserRecords:
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        mockCommunityInterests[0].interestInDevelopmentPrograms?.map(
          (interest, index) => {
            return {
              id: index.toString(),
              developmentProgram: {
                id: interest.developmentProgram.id,
              },
              participationStatus: interest.participationStatus,
              completionDate: interest.completionDate,
            };
          },
        ),
    },
  },
  CommunityInterest_Fragment,
);

const communityInterestOptionsQuery = makeFragmentData(
  {
    communityInterestAdditionalDuties: [
      { value: "1", label: { localized: "Duty 1" } },
      { value: "2", label: { localized: "Duty 2" } },
    ],
    financeChiefRoles: [
      { value: "1", label: { localized: "Role 1" } },
      { value: "2", label: { localized: "Role 2" } },
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
