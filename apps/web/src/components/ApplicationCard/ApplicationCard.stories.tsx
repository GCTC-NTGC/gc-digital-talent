import type { Meta, StoryFn } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";
import {
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import { isExpired } from "~/utils/poolCandidate";

import ApplicationCard, { ApplicationCard_Fragment } from "./ApplicationCard";

const mockApplications = fakePoolCandidates(20);

const applications = Object.values(PoolCandidateStatus).map((status, index) => {
  return {
    ...mockApplications[index],
    status,
    archivedAt: null,
    pool: {
      ...mockApplications[index].pool,
      closingDate: FAR_FUTURE_DATE,
    },
  };
});

export default {
  component: ApplicationCard,
} as Meta;

const Template: StoryFn<typeof ApplicationCard> = () => {
  return (
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <div
        className="flex"
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
            <ApplicationCard
              poolCandidateQuery={makeFragmentData(
                application,
                ApplicationCard_Fragment,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
