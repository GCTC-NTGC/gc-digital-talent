import { faker } from "@faker-js/faker/locale/en";

import {
  CommunityInterestAdditionalDuty,
  DevelopmentProgramParticipationStatus,
  FinanceChiefRole,
} from "@gc-digital-talent/graphql/schema-types";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import fakeCommunities from "./fakeCommunities";
import toLocalizedEnum from "./fakeLocalizedEnum";
import { fakeUser } from "./fakeUsers";

const generateCommunityInterest = (
  communities: ReturnType<typeof fakeCommunities>,
) => {
  const community = faker.helpers.arrayElement(communities);
  const workStreams = faker.helpers.arrayElements(community.workStreams);
  const developmentPrograms = faker.helpers.arrayElements(
    community.associatedDevelopmentPrograms,
  );
  const financeIsChief =
    community.key === "finance" ? faker.datatype.boolean() : null;
  const procurementIsSDO =
    community.key === "procurement" ? faker.datatype.boolean() : null;
  const financeOtherRoles = financeIsChief
    ? faker.helpers
        .arrayElements<FinanceChiefRole>(Object.values(FinanceChiefRole))
        .map((role) => toLocalizedEnum(role, "LocalizedFinanceChiefRole"))
    : [];
  return {
    __typename: "CommunityInterest" as const,
    id: faker.string.uuid(),
    community,
    workStreams,
    user: fakeUser(),
    jobInterest: faker.datatype.boolean(),
    trainingInterest: faker.datatype.boolean(),
    additionalInformation: faker.lorem.paragraph(),
    financeIsChief,
    procurementIsSDO,
    financeOtherRoles,
    financeOtherRolesOther: financeOtherRoles.some(
      (role) => role.value === FinanceChiefRole.Other,
    )
      ? faker.person.jobTitle()
      : null,
    communityInterestAdditionalDuties:
      (financeIsChief ?? procurementIsSDO)
        ? faker.helpers
            .arrayElements<CommunityInterestAdditionalDuty>(
              Object.values(CommunityInterestAdditionalDuty),
            )
            .map((duty) =>
              toLocalizedEnum(duty, "LocalizedCommunityInterestAdditionalDuty"),
            )
        : [],
    interestInDevelopmentPrograms: developmentPrograms.map(
      (developmentProgram) => ({
        __typename: "DevelopmentProgramInterest" as const,
        id: faker.string.uuid(),
        communityDevelopmentProgram: {
          __typename: "CommunityDevelopmentProgram" as const,
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

export default (numToGenerate = 10) => {
  faker.seed(0); // repeatable results
  const communities = fakeCommunities();
  return Array.from({ length: numToGenerate }, () =>
    generateCommunityInterest(communities),
  );
};
