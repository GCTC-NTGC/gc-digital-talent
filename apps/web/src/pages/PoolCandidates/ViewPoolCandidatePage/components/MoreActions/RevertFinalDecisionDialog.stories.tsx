import { Meta, StoryObj } from "@storybook/react-vite";

import {
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  ApplicationStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import RevertFinalDecisionDialog, {
  RevertFinalDecisionDialog_Fragment,
} from "./RevertFinalDecisionDialog";

const fakedCandidate = fakePoolCandidates(1)[0];
const qualifiedData = makeFragmentData(
  {
    ...fakedCandidate,
    status: toLocalizedEnum(ApplicationStatus.Qualified),
  },
  RevertFinalDecisionDialog_Fragment,
);
const disqualifiedData = makeFragmentData(
  {
    ...fakedCandidate,
    status: toLocalizedEnum(ApplicationStatus.Disqualified),
  },
  RevertFinalDecisionDialog_Fragment,
);

export default {
  component: RevertFinalDecisionDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
  },
} as Meta;

type Story = StoryObj<typeof RevertFinalDecisionDialog>;

export const Qualified: Story = {
  args: {
    revertFinalDecisionQuery: qualifiedData,
  },
};

export const Disqualified: Story = {
  args: {
    revertFinalDecisionQuery: disqualifiedData,
  },
};
