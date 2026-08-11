import { faker } from "@faker-js/faker/locale/en";

import type {
  Classification,
  Community,
  CommunityInterest,
  DevelopmentProgram,
  WorkStream,
} from "@gc-digital-talent/graphql/schema-types";
import {
  CommunityReferralStatus,
  DevelopmentProgramParticipationStatus,
} from "@gc-digital-talent/graphql/schema-types";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import fakeClassifications from "./fakeClassifications";
import fakeCommunities from "./fakeCommunities";
import { fakeUser } from "./fakeUsers";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateCommunityInterest = (
  communities: Community[],
  classifications: Classification[],
): CommunityInterest => {
  const community = faker.helpers.arrayElement<Community>(communities);
  const classification =
    faker.helpers.arrayElement<Classification>(classifications);
  const workStreams = faker.helpers.arrayElements<WorkStream>(
    community.workStreams ?? [],
  );
  const developmentPrograms = faker.helpers.arrayElements<DevelopmentProgram>(
    community?.associatedDevelopmentPrograms ?? [],
  );

  const referralStatus = faker.helpers.arrayElement<CommunityReferralStatus>(
    Object.values(CommunityReferralStatus),
  );

  const referralFollowUp =
    referralStatus === CommunityReferralStatus.NotReferred
      ? null
      : faker.date
          .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
          .toISOString()
          .substring(0, 10);

  return {
    id: faker.string.uuid(),
    community,
    workStreams,
    user: fakeUser(),
    jobInterest: faker.datatype.boolean(),
    trainingInterest: faker.datatype.boolean(),
    additionalInformation: faker.lorem.paragraph(),
    referralStatus: {
      status: toLocalizedEnum(referralStatus),
      followUpDate: referralFollowUp,
      classification:
        referralStatus === CommunityReferralStatus.AvailableForReferral
          ? classification
          : null,
      notes: faker.lorem.paragraph(),
    },
    interestInDevelopmentPrograms: developmentPrograms.map(
      (developmentProgram) => ({
        id: faker.string.uuid(),
        communityDevelopmentProgram: {
          id: faker.string.uuid(),
          community: community,
          developmentProgram: developmentProgram,
        },
        developmentProgram,
        completionDate: FAR_PAST_DATE,
        participationStatus: faker.helpers.arrayElement(
          Object.values(DevelopmentProgramParticipationStatus),
        ),
      }),
    ),
  };
};

export default (numToGenerate = 10): CommunityInterest[] => {
  faker.seed(0); // repeatable results
  const communities = fakeCommunities();
  const classifications = fakeClassifications();
  return Array.from({ length: numToGenerate }, () =>
    generateCommunityInterest(communities, classifications),
  );
};
