import type { Meta, StoryObj } from "@storybook/react-vite";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

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
  decorators: [OverlayOrDialogDecorator],
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
