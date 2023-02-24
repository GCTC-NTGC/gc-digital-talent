import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { PoolCandidateStatus } from "~/api/generated";

import ApplicationList from "./ApplicationList";

type Story = ComponentStory<typeof ApplicationList>;
type Meta = ComponentMeta<typeof ApplicationList>;

const mockApplications = fakePoolCandidates(20);
const draftApplication = {
  ...fakePoolCandidates(1)[0],
  status: PoolCandidateStatus.Draft,
};
const submittedApplication = {
  ...fakePoolCandidates(1)[0],
  status: PoolCandidateStatus.NewApplication,
};
const historicalApplication = {
  ...fakePoolCandidates(1)[0],
  status: PoolCandidateStatus.Expired,
};

export default {
  component: ApplicationList,
  title: "Components/Application List",
} as Meta;

const Template: Story = (args) => {
  const { applications } = args;
  return <ApplicationList applications={applications} />;
};

export const Default = Template.bind({});
Default.args = {
  // Ensures there is at least one card in each section
  applications: [
    ...mockApplications,
    draftApplication,
    submittedApplication,
    historicalApplication,
  ],
};

export const EmptySections = Template.bind({});
EmptySections.args = {
  applications: [],
};
