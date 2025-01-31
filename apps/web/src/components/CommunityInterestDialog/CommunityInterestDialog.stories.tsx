import type { Meta, StoryObj } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakeCommunityInterests } from "@gc-digital-talent/fake-data";

import CommunityInterestDialog, {
  CommunityInterestDialog_Fragment,
} from "./CommunityInterestDialog";

const meta = {
  component: CommunityInterestDialog,
  decorators: [OverlayOrDialogDecorator],
} satisfies Meta<typeof CommunityInterestDialog>;

export default meta;

const mockCommunityInterests = fakeCommunityInterests(1);
const communityInterestQuery = makeFragmentData(
  {
    ...mockCommunityInterests[0],
    jobInterest: false,
    trainingInterest: true,
  },
  CommunityInterestDialog_Fragment,
);

export const Default: StoryObj<typeof CommunityInterestDialog> = {
  render: () => (
    <CommunityInterestDialog
      communityInterestQuery={communityInterestQuery}
      defaultOpen
    />
  ),
};
