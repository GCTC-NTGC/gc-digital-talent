import { Args, Decorator, Meta, StoryObj } from "@storybook/react";

import {
  fakeDepartments,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  PoolCandidateStatus,
  User,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import MoreActions, { MoreActions_Fragment } from "./MoreActions";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { action } from "@storybook/addon-actions";

const poolCandidates = fakePoolCandidates(5);
const poolCandidate = poolCandidates[2];

const profileSnapshot: User = {
  id: poolCandidate.user.id,
};
poolCandidate.profileSnapshot = JSON.stringify(profileSnapshot);

const getData = (status: PoolCandidateStatus) =>
  makeFragmentData({ ...poolCandidate, status }, MoreActions_Fragment);

const ReactRouterDecorator: Decorator<Args> = (Story, options) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(".", {
      state: {
        candidateIds: poolCandidates.map((poolCandidate) => poolCandidate.id),
        stepName: "Step 1: Application screening",
      },
    }); // <-- redirect to current path with state
    action("location")(location);
  }, []);

  return <Story />;
};

export default {
  component: MoreActions,
  decorators: [OverlayOrDialogDecorator, ReactRouterDecorator],
  args: {
    departments: fakeDepartments(),
  },
} as Meta;

type Story = StoryObj<typeof MoreActions>;

export const RecordDecisionStatus: Story = {
  args: {
    poolCandidate: getData(PoolCandidateStatus.ApplicationReview),
  },
};

export const QualifiedStatus: Story = {
  args: {
    poolCandidate: getData(PoolCandidateStatus.QualifiedAvailable),
  },
};

export const PlacedStatus: Story = {
  args: {
    poolCandidate: getData(PoolCandidateStatus.PlacedIndeterminate),
  },
};

export const DisqualifiedStatus: Story = {
  args: {
    poolCandidate: getData(PoolCandidateStatus.ScreenedOutAssessment),
  },
};

export const RemovedStatus: Story = {
  args: {
    poolCandidate: getData(PoolCandidateStatus.Removed),
  },
};
