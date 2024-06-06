import type { Meta, StoryObj } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import RemoveCandidateDialog, {
  RemoveCandidateDialog_Fragment,
} from "./RemoveCandidateDialog";

const mockCandidates = fakePoolCandidates(1);
const mockCandidateFragment = makeFragmentData(
  mockCandidates[0],
  RemoveCandidateDialog_Fragment,
);

const meta = {
  component: RemoveCandidateDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    removalQuery: mockCandidateFragment,
    defaultOpen: true,
  },
} satisfies Meta<typeof RemoveCandidateDialog>;
export default meta;

export const RemoveCandidateDialogStory: StoryObj<
  typeof RemoveCandidateDialog
> = {
  name: "Default",
};
