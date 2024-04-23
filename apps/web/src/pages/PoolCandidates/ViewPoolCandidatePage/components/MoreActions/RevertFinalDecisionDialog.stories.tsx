import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import RevertFinalDecisionDialog from "./RevertFinalDecisionDialog";

export default {
  component: RevertFinalDecisionDialog,
  title: "Components/Revert final decision dialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
  },
} as Meta;

const fakedCandidate = fakePoolCandidates(1)[0];

const Template: StoryFn<typeof RevertFinalDecisionDialog> = (args) => (
  <RevertFinalDecisionDialog {...args} />
);

const defaultArgs = {
  id: fakedCandidate.id,
  status: fakedCandidate.status,
  expiryDate: fakedCandidate.expiryDate,
  finalDecisionAt: fakedCandidate.finalDecisionAt,
};

export const Qualified = Template.bind({});
Qualified.args = {
  revertFinalDecisionQuery: {
    " $fragmentRefs": {
      RevertFinalDecisionDialogFragment: {
        ...defaultArgs,
        status: PoolCandidateStatus.QualifiedAvailable,
      },
    },
  },
};

export const Disqualified = Template.bind({});
Disqualified.args = {
  revertFinalDecisionQuery: {
    " $fragmentRefs": {
      RevertFinalDecisionDialogFragment: {
        ...defaultArgs,
        status: PoolCandidateStatus.ScreenedOutApplication,
      },
    },
  },
};
