import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { fakePoolCandidates } from "@common/fakeData";
import { FAR_PAST_DATE } from "@common/helpers/dateUtils";
import { action } from "@storybook/addon-actions";
import { ApplicationCard } from "./ApplicationCard";
import { PoolCandidateStatus } from "../../../api/generated";

type Story = ComponentStory<typeof ApplicationCard>;
type Meta = ComponentMeta<typeof ApplicationCard>;

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

const archivedApplications = fakePoolCandidates(5).map((application) => ({
  ...application,
  archivedAt: FAR_PAST_DATE,
}));

const applications = [...activeApplications, ...archivedApplications];

export default {
  component: ApplicationCard,
  title: "Direct Intake/Application Card",
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
          <div key={application.id}>
            <h2 data-h2-margin="base(x1, 0, x0.5, 0)">
              {application.archivedAt && "(ARCHIVED) "}
              {application.status}
            </h2>
            <ApplicationCard
              application={application}
              onDelete={() => action("Delete")}
              onArchive={() => action("Archive")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ApplicationCards = Template.bind({});
