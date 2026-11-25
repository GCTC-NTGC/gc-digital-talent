import { faker } from "@faker-js/faker/locale/en";

import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  CommunityInterestAdditionalDuty,
  FinanceChiefRole,
} from "@gc-digital-talent/graphql/schema-types";

import fakeCommunities from "./fakeCommunities";
import toLocalizedEnum from "./fakeLocalizedEnum";
import { fakeUser } from "./fakeUsers";

const generateCommunityInterest = (
  communities: ReturnType<typeof fakeCommunities>,
) => {
  const community = faker.helpers.arrayElement(communities);
  const workStreams = faker.helpers.arrayElements(community.workStreams);
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
  };
};

export default (numToGenerate = 10) => {
  faker.seed(0); // repeatable results
  const communities = fakeCommunities();
  return Array.from({ length: numToGenerate }, () =>
    generateCommunityInterest(communities),
  );
};
