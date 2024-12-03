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
  RemoveCandidateOptions_Fragment,
} from "./RemoveCandidateDialog";

const mockCandidates = fakePoolCandidates(1);
const mockCandidateFragment = makeFragmentData(
  mockCandidates[0],
  RemoveCandidateDialog_Fragment,
);

const optionsFragment = makeFragmentData(
  { removalReasons: fakeLocalizedEnum(CandidateRemovalReason) },
  RemoveCandidateOptions_Fragment,
);

const meta = {
  title: "Components/Remove Candidate Dialog",
  component: RemoveCandidateDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    removalQuery: mockCandidateFragment,
    optionsQuery: optionsFragment,
    defaultOpen: true,
  },
} satisfies Meta<typeof RemoveCandidateDialog>;
export default meta;

export const RemoveCandidateDialogStory: StoryObj<
  typeof RemoveCandidateDialog
> = {
  name: "Default",
};
