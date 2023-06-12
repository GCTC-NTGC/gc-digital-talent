import React from "react";
import { faker } from "@faker-js/faker";
import { StoryFn } from "@storybook/react";

import {
  fakePoolCandidates,
  fakeTeams,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";

import { PoolCandidateStatus, PublishingGroup } from "~/api/generated";

import QualifiedRecruitmentCard from "./QualifiedRecruitmentCard";

faker.seed(0);

const mockDepartments = fakeDepartments();
const mockTeams = fakeTeams(1, mockDepartments);
const mockCandidates = fakePoolCandidates(1);
const mockCandidate = {
  ...mockCandidates[0],
  status: PoolCandidateStatus.QualifiedAvailable,
  pool: {
    ...mockCandidates[0].pool,
    team: mockTeams[0],
    publishingGroup: PublishingGroup.ItJobs,
    publishedAt: faker.date.past().toISOString(),
  },
};

export default {
  component: QualifiedRecruitmentCard,
  title: "Components/Qualified Recruitment Card",
  args: {
    headingLevel: "h2",
  },
};

const Template: StoryFn<typeof QualifiedRecruitmentCard> = (args) => (
  <QualifiedRecruitmentCard {...args} />
);

export const Available = Template.bind({});
Available.args = {
  candidate: {
    ...mockCandidate,
    suspendedAt: null,
  },
};

export const Suspended = Template.bind({});
Suspended.args = {
  candidate: {
    ...mockCandidate,
    suspendedAt: faker.date.past().toISOString(),
  },
};

export const Ongoing = Template.bind({});
Ongoing.args = {
  candidate: {
    ...mockCandidate,
    pool: {
      ...mockCandidate.pool,
      publishingGroup: PublishingGroup.ItJobsOngoing,
    },
  },
};

export const Expired = Template.bind({});
Expired.args = {
  candidate: {
    ...mockCandidate,
    status: PoolCandidateStatus.Expired,
  },
};
