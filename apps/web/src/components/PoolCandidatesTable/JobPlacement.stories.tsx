import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  fakeDepartments,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import {
  JobPlacementDialog,
  JobPlacementDialog_Fragment,
} from "./JobPlacementDialog";

const fakedCandidate = fakePoolCandidates(1)[0];
const departments = fakeDepartments();
const placedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: PoolCandidateStatus.PlacedCasual,
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);
const notPlacedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: PoolCandidateStatus.QualifiedAvailable,
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);

export default {
  component: JobPlacementDialog,
  title: "Components/Job placement dialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    departments,
    defaultOpen: true,
  },
} as Meta;

const Template: StoryFn<typeof JobPlacementDialog> = (args) => (
  <JobPlacementDialog {...args} />
);

export const Placed = Template.bind({});
Placed.args = {
  jobPlacementDialogQuery: placedData,
};

export const NotPlaced = Template.bind({});
NotPlaced.args = {
  jobPlacementDialogQuery: notPlacedData,
};
