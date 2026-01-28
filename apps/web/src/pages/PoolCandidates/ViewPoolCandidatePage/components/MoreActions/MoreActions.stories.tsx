import { useEffect } from "react";
import { Args, Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useNavigate } from "react-router";

import {
  fakeDepartments,
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  ApplicationStatus,
  PlacementType,
  User,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import MoreActions, { MoreActions_Fragment } from "./MoreActions";

const poolCandidates = fakePoolCandidates(5);
const fakeCandidate = poolCandidates[2];

const profileSnapshot: User = {
  id: fakeCandidate.user.id,
};
fakeCandidate.profileSnapshot = JSON.stringify(profileSnapshot);

const getData = (status: ApplicationStatus, placementType?: PlacementType) =>
  makeFragmentData(
    {
      ...fakeCandidate,
      viewStatus: { status: toLocalizedEnum(status) },
      status: toLocalizedEnum(status),
      placementType: placementType ? toLocalizedEnum(placementType) : null,
    },
    MoreActions_Fragment,
  );

const ReactRouterDecorator: Decorator<Args> = (Story) => {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate(".", {
      state: {
        candidateIds: poolCandidates.map((poolCandidate) => poolCandidate.id),
        stepName: "Step 1: Application screening",
      },
    }); // <-- redirect to current path with state
  }, [navigate]);

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
    poolCandidate: getData(ApplicationStatus.ToAssess),
  },
};

export const QualifiedStatus: Story = {
  args: {
    poolCandidate: getData(ApplicationStatus.Qualified),
  },
};

export const PlacedStatus: Story = {
  args: {
    poolCandidate: getData(
      ApplicationStatus.Qualified,
      PlacementType.PlacedIndeterminate,
    ),
  },
};

export const DisqualifiedStatus: Story = {
  args: {
    poolCandidate: getData(ApplicationStatus.Disqualified),
  },
};

export const RemovedStatus: Story = {
  args: {
    poolCandidate: getData(ApplicationStatus.Removed),
  },
};
