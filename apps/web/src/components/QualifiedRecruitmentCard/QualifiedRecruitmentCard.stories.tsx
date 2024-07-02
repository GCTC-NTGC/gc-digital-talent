import { faker } from "@faker-js/faker/locale/en";
import { StoryFn } from "@storybook/react";

import {
  fakePoolCandidates,
  fakeTeams,
  fakeDepartments,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { PublishingGroup, makeFragmentData } from "@gc-digital-talent/graphql";

import { QUALIFIED_STATUSES } from "~/constants/poolCandidate";

import QualifiedRecruitmentCard, {
  QualifiedRecruitmentCard_Fragment,
} from "./QualifiedRecruitmentCard";

faker.seed(0);

const mockDepartments = fakeDepartments();
const mockTeams = fakeTeams(1, mockDepartments);
const mockCandidates = fakePoolCandidates(1);
const mockCandidate = {
  ...mockCandidates[0],
  pool: {
    ...mockCandidates[0].pool,
    team: mockTeams[0],
    publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
    publishedAt: faker.date.past().toISOString(),
  },
};

type Availability = "Available" | "Unavailable";
const availabilities: Availability[] = ["Available", "Unavailable"];

export default {
  component: QualifiedRecruitmentCard,
};

const Template: StoryFn<typeof QualifiedRecruitmentCard> = () => {
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {QUALIFIED_STATUSES.map((poolCandidateStatus) =>
          availabilities.map((availability) => (
            <div
              data-h2-margin="base(0, 0, x.5, 0)"
              key={`${poolCandidateStatus} - ${availability}`}
            >
              <span>{`${poolCandidateStatus}  ${availability}`}</span>
              <QualifiedRecruitmentCard
                candidateQuery={makeFragmentData(
                  {
                    ...mockCandidate,
                    status: toLocalizedEnum(poolCandidateStatus),
                    suspendedAt:
                      availability === "Available"
                        ? null
                        : faker.date.past().toISOString(),
                  },
                  QualifiedRecruitmentCard_Fragment,
                )}
                headingLevel="h2"
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
