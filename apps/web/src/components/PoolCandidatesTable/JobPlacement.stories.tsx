import { Meta, StoryObj } from "@storybook/react";

import {
  fakeDepartments,
  fakeLocalizedEnum,
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  PlacementType,
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import JobPlacementDialog, {
  JobPlacementDialog_Fragment,
} from "./JobPlacementDialog";

const fakedCandidate = fakePoolCandidates(1)[0];
const departments = fakeDepartments();
const placedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: toLocalizedEnum(PoolCandidateStatus.PlacedCasual),
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);
const notPlacedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: toLocalizedEnum(PoolCandidateStatus.QualifiedAvailable),
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);

export default {
  component: JobPlacementDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
  args: {
    departments,
    defaultOpen: true,
  },
  parameters: {
    apiResponses: {
      JobPlacementOptions: {
        data: {
          placementTypes: fakeLocalizedEnum(PlacementType),
        },
      },
    },
  },
} as Meta;

type Story = StoryObj<typeof JobPlacementDialog>;

export const Placed: Story = {
  args: {
    jobPlacementDialogQuery: placedData,
  },
};

export const NotPlaced: Story = {
  args: {
    jobPlacementDialogQuery: notPlacedData,
  },
};
