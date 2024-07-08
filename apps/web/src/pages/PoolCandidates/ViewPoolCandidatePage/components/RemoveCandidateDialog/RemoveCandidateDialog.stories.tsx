import type { Meta, StoryObj } from "@storybook/react";

import {
  fakeLocalizedEnum,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import {
  CandidateRemovalReason,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";

import RemoveCandidateDialog, {
  RemoveCandidateDialog_Fragment,
} from "./RemoveCandidateDialog";

const mockCandidates = fakePoolCandidates(1);
const mockCandidateFragment = makeFragmentData(
  mockCandidates[0],
  RemoveCandidateDialog_Fragment,
);

const meta = {
  title: "Components/Remove Candidate Dialog",
  component: RemoveCandidateDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    removalQuery: mockCandidateFragment,
    defaultOpen: true,
  },
  parameters: {
    apiResponses: {
      RemoveCandidateOptions: {
        data: {
          removalReasons: fakeLocalizedEnum(CandidateRemovalReason),
        },
      },
    },
  },
} satisfies Meta<typeof RemoveCandidateDialog>;
export default meta;

export const RemoveCandidateDialogStory: StoryObj<
  typeof RemoveCandidateDialog
> = {
  name: "Default",
};
