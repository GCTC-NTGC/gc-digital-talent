import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { PoolCandidateStatus } from "~/api/generated";
import { isExpired } from "~/utils/poolCandidate";

import TrackApplicationsCard from "./TrackApplicationsCard";

type Story = ComponentStory<typeof TrackApplicationsCard>;
type Meta = ComponentMeta<typeof TrackApplicationsCard>;

const mockApplications = fakePoolCandidates(20);

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

const applications = [...activeApplications, ...expiredApplications];

export default {
  component: TrackApplicationsCard,
  title: "Components/Track Applications Card",
} as Meta;

const Template: Story = () => {
  return (
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x0.5, 0)"
      >
        {applications.map((application) => (
          <div
            key={`${application.id}-${application.status}-${application.archivedAt}`}
          >
            <h2 data-h2-margin="base(x1, 0, x0.5, 0)">
              {isExpired(application.status, application.expiryDate) &&
                "(EXPIRED)"}
              {application.status}
            </h2>
            <TrackApplicationsCard application={application} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ApplicationCards = Template.bind({});
