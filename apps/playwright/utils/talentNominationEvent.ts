import { FAR_FUTURE_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  CreateTalentNominationEventInput,
  TalentNominationEvent,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getCommunities } from "./communities";

export const defaultEvent: Partial<CreateTalentNominationEventInput> = {
  name: {
    en: "Playwright event EN",
    fr: "Playwright event FR",
  },
  description: {
    en: "Description EN",
    fr: "Description FR",
  },
  openDate: `${PAST_DATE} 00:00:00`,
  closeDate: `${FAR_FUTURE_DATE} 00:00:00`,
};

export const Test_CreateTalentNominationEventMutationDocument = /* GraphQL */ `
  mutation Test_CreateTalentNominationEvent(
    $event: CreateTalentNominationEventInput!
  ) {
    createTalentNominationEvent(talentNominationEvent: $event) {
      id
    }
  }
`;

export const createTalentNominationEvent: GraphQLRequestFunc<
  TalentNominationEvent,
  Partial<CreateTalentNominationEventInput>
> = async (ctx, event) => {
  const communities = await getCommunities(ctx, {});
  const firstCommunity = communities[0];

  return ctx
    .post(Test_CreateTalentNominationEventMutationDocument, {
      isPrivileged: true,
      variables: {
        event: {
          ...defaultEvent,
          community: {
            connect: firstCommunity.id,
          },
          ...event,
        },
      },
    })
    .then(
      (
        res: GraphQLResponse<
          "createTalentNominationEvent",
          TalentNominationEvent
        >,
      ) => res.createTalentNominationEvent,
    );
};
