import type { Meta, StoryFn } from "@storybook/react";

import {
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import TrackApplications, {
  TrackApplicationsCandidate_Fragment,
} from "./TrackApplications";

const mockApplications = fakePoolCandidates(20);

const activeRecruitments = Object.values(PoolCandidateStatus)
  .filter((status) => status !== PoolCandidateStatus.Expired)
  .map((status, index) => {
    return makeFragmentData(
      {
        ...mockApplications[index],
        status: toLocalizedEnum(status),
        archivedAt: null,
        expiryDate: FAR_FUTURE_DATE,
      },
      TrackApplicationsCandidate_Fragment,
    );
  });

const expiredRecruitments = fakePoolCandidates(5).map((application) =>
  makeFragmentData(
    {
      ...application,
      expiryDate: FAR_PAST_DATE,
    },
    TrackApplicationsCandidate_Fragment,
  ),
);

export default {
  component: TrackApplications,
  args: {
    applicationsQuery: [...activeRecruitments, ...expiredRecruitments],
  },
} as Meta;

const Template: StoryFn<typeof TrackApplications> = (args) => {
  return <TrackApplications {...args} />;
};

export const DefaultQualifiedRecruitments = Template.bind({});
export const NoQualifiedRecruitments = Template.bind({});
NoQualifiedRecruitments.args = {
  applicationsQuery: [],
};
