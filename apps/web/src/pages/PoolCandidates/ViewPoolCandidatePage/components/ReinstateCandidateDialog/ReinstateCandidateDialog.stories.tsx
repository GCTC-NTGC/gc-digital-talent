import type { Meta, StoryObj } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ReinstateCandidateDialog, {
  ReinstateCandidateDialog_Fragment,
} from "./ReinstateCandidateDialog";

const mockCandidates = fakePoolCandidates(1);
const mockCandidateFragment = makeFragmentData(
  mockCandidates[0],
  ReinstateCandidateDialog_Fragment,
);

const meta = {
  title: "Components/Reinstate Candidate Dialog",
  component: ReinstateCandidateDialog,
  args: {
    reinstateQuery: mockCandidateFragment,
    defaultOpen: true,
  },
} satisfies Meta<typeof ReinstateCandidateDialog>;
export default meta;

export const ReinstateCandidateDialogStory: StoryObj<
  typeof ReinstateCandidateDialog
> = {
  name: "Default",
};
