import React from "react";
import { Meta, StoryFn, StoryObj } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import RevertFinalDecisionDialog, {
  RevertFinalDecisionDialog_Fragment,
} from "./RevertFinalDecisionDialog";

const fakedCandidate = fakePoolCandidates(1)[0];
const qualifiedData = makeFragmentData(
  { ...fakedCandidate, status: PoolCandidateStatus.QualifiedAvailable },
  RevertFinalDecisionDialog_Fragment,
);
const disqualifiedData = makeFragmentData(
  { ...fakedCandidate, status: PoolCandidateStatus.ScreenedOutAssessment },
  RevertFinalDecisionDialog_Fragment,
);

export default {
  component: RevertFinalDecisionDialog,
  title: "Components/Revert final decision dialog",
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
