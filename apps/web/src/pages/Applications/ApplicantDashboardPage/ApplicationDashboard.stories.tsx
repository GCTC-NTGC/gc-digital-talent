import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PoolCandidateStatus } from "@gc-digital-talent/graphql";
import { fakePoolCandidates, fakeUsers } from "@gc-digital-talent/fake-data";

import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import { ApplicantDashboard } from "./ApplicantDashboardPage";

const mockApplications = fakePoolCandidates(20);
const mockUsers = fakeUsers(1);

const activeApplications = Object.values(PoolCandidateStatus).map(
  (status, index) => {
    return {
      ...mockApplications[index],
      status,
      archivedAt: null,
    };
  },
);

const expiredApplications = fakePoolCandidates(5).map((application) => ({
  ...application,
  expiryDate: FAR_PAST_DATE,
}));

mockApplications[0].status = PoolCandidateStatus.Draft;

export default {
  component: ApplicantDashboard,
  title: "Pages/Applicant Dashboard",
} as ComponentMeta<typeof ApplicantDashboard>;

const Template: ComponentStory<typeof ApplicantDashboard> = (args) => (
  <ApplicantDashboard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  user: {
    ...mockUsers[0],
    poolCandidates: [...activeApplications, ...expiredApplications],
  },
};
