import {
  CreateTalentNominationEventInput,
  TalentNominationEvent,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getCommunities } from "./communities";

const oldDate = new Date();
const newDate = new Date();
newDate.setTime(oldDate.getTime() + 30 * 60 * 1000);
export const defaultTalentNominationEvent: Partial<CreateTalentNominationEventInput> =
  {
    name: {
      en: "Playwright test talent nomination event EN",
      fr: "Playwright test talent nomination event FR",
    },
    openDate: oldDate.toISOString().slice(0, 19).replace("T", " "),
    closeDate: newDate.toISOString().slice(0, 19).replace("T", " "),
  };

const Test_CreateTalentNominationEventMutation = /* GraphQL */ `
  mutation Test_CreateTalentNominationEvent(
    $talentNominationEvent: CreateTalentNominationEventInput!
  ) {
    createTalentNominationEvent(talentNominationEvent: $talentNominationEvent) {
      id
      community {
        id
      }
    }
  }
`;

/**
 * Create Talent Nomination Event
 */
export const createTalentNominationEvent: GraphQLRequestFunc<
  TalentNominationEvent | undefined,
  Partial<CreateTalentNominationEventInput>
> = async (ctx, talentNominationEvent) => {
  const communities = await getCommunities(ctx, {});
  const firstCommunity = communities[0];
  const communityId =
    talentNominationEvent.community?.connect ?? firstCommunity.id ?? "";
  return ctx
    .post(Test_CreateTalentNominationEventMutation, {
      isPrivileged: true,
      variables: {
        talentNominationEvent: {
          ...defaultTalentNominationEvent,
          ...talentNominationEvent,
          community: {
            connect: communityId,
          },
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
