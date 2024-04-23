import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import RemoveCandidateDialog, {
  RemoveCandidateDialog_Fragment,
} from "./RemoveCandidateDialog";
import { makeFragmentData } from "@gc-digital-talent/graphql";

const mockCandidates = fakePoolCandidates(1);
const mockCandidateFragment = makeFragmentData(
  mockCandidates[0],
  RemoveCandidateDialog_Fragment,
);

const meta = {
  title: "Components/Remove Candidate Dialog",
  component: RemoveCandidateDialog,
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
