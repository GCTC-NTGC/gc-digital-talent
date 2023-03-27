import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolCandidateStatus } from "~/api/generated";
import QualifiedRecruitments, { Application } from "./QualifiedRecruitments";

type Story = ComponentStory<typeof QualifiedRecruitments>;
type Meta = ComponentMeta<typeof QualifiedRecruitments>;

const mockApplications = fakePoolCandidates(20);

const activeRecruitments: Application[] = Object.values(PoolCandidateStatus)
  .filter((status) => status !== PoolCandidateStatus.Expired)
  .map((status, index) => {
    return {
      ...mockApplications[index],
      status,
      archivedAt: null,
      expiryDate: FAR_FUTURE_DATE,
    };
  });

const expiredRecruitments: Application[] = fakePoolCandidates(5).map(
  (application) => ({
    ...application,
    expiryDate: FAR_PAST_DATE,
  }),
);

export default {
  component: QualifiedRecruitments,
  title: "Pages/Applicant Dashboard/Qualified Recruitment",
  args: {
    activeRecruitments,
    expiredRecruitments,
  },
} as Meta;

const Template: Story = (args) => {
  return <QualifiedRecruitments {...args} />;
};

export const DefaultQualifiedRecruitments = Template.bind({});
export const NoQualifiedRecruitments = Template.bind({});
NoQualifiedRecruitments.args = {
  activeRecruitments: [],
  expiredRecruitments: [],
};
