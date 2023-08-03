import { faker } from "@faker-js/faker";
import {
  fakeDepartments,
  fakePoolCandidates,
  fakeTeams,
} from "@gc-digital-talent/fake-data";
import {
  PoolCandidateStatus,
  PublishingGroup,
} from "@gc-digital-talent/graphql";
import React from "react";
import { useIntl } from "react-intl";
import QualifiedRecruitmentCard from "~/components/QualifiedRecruitmentCard/QualifiedRecruitmentCard";

import SEO from "~/components/SEO/SEO";

import { About, Featured, Hero, Opportunities, Profile } from "./components";
import type { HeroProps } from "./components/Hero/Hero";

const HomePage = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();

  const mockDepartments = fakeDepartments();
  const mockTeams = fakeTeams(1, mockDepartments);
  const mockCandidates = fakePoolCandidates(1);
  const mockCandidate = {
    ...mockCandidates[0],
    pool: {
      ...mockCandidates[0].pool,
      team: mockTeams[0],
      publishingGroup: PublishingGroup.ItJobs,
      publishedAt: faker.date.past().toISOString(),
    },
  };

  const poolCandidateStatuses = Object.values(PoolCandidateStatus);
  const isAvailablePossibilities = [true, false];

  return (
    <>
      <div data-h2-display="base(flex)">
        <div data-h2-padding="base(x1)" data-h2-background="base(white)">
          {poolCandidateStatuses.map((poolCandidateStatus) =>
            isAvailablePossibilities.map((isAvailable) => (
              <div
                data-h2-margin="base(0, 0, x.5, 0)"
                key={`${poolCandidateStatus} - ${isAvailable}`}
              >
                <span>{`${poolCandidateStatus}, ${
                  isAvailable ? "Available" : "Unavailable"
                }`}</span>
                <QualifiedRecruitmentCard
                  candidate={{
                    ...mockCandidate,
                    status: poolCandidateStatus,
                    suspendedAt: isAvailable
                      ? null
                      : faker.date.past().toISOString(),
                  }}
                />
              </div>
            )),
          )}
        </div>
      </div>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Welcome",
          id: "4I6WIU",
          description: "Title for the homepage",
        })}
      />
      <Hero defaultImage={defaultImage} />
      <Opportunities />
      <Profile />
      <Featured />
      <About />
    </>
  );
};

export default HomePage;
