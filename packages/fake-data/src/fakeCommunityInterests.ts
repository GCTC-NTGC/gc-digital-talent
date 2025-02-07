import { faker } from "@faker-js/faker/locale/en";

import {
  Community,
  CommunityInterest,
  DevelopmentProgram,
  DevelopmentProgramParticipationStatus,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import fakeCommunities from "./fakeCommunities";
import { fakeUser } from "./fakeUsers";

const generateCommunityInterest = (
  communities: Community[],
): CommunityInterest => {
  const community = faker.helpers.arrayElement<Community>(communities);
  const workStreams = faker.helpers.arrayElements<WorkStream>(
    community.workStreams ?? [],
  );
  const interestedDevelopmentPrograms =
    faker.helpers.arrayElements<DevelopmentProgram>(
      community?.developmentPrograms ?? [],
    );
  return {
    id: faker.string.uuid(),
    community,
    workStreams,
    user: fakeUser(),
    jobInterest: faker.datatype.boolean(),
    trainingInterest: faker.datatype.boolean(),
    additionalInformation: faker.lorem.paragraph(),
    interestInDevelopmentPrograms: interestedDevelopmentPrograms.map(
      (developmentProgram) => ({
        id: faker.string.uuid(),
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
  return Array.from({ length: numToGenerate }, () =>
    generateCommunityInterest(communities),
  );
};
