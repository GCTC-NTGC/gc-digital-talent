import type {
  CreateTalentNominationEventInput,
  TalentNominationEvent,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getMyCommunity } from "./communities";
import { getCommunityDevelopmentProgramsForCommunity } from "./developmentPrograms";

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
    contactEmail: "example@example.org",
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
  // Talent nomination events can be created by community_admin or
  // community_talent_coordinator (not community_recruiter), so this can't
  // reuse getMyCommunity's pool-creation default role list.
  const myCommunity = await getMyCommunity(ctx, {
    roles: ["community_admin", "community_talent_coordinator"],
  });
  const communityId =
    talentNominationEvent.community?.connect ?? myCommunity?.id;
  if (!communityId) {
    throw new Error(
      "No community found for the current user to create a talent nomination event for",
    );
  }
  const communityDevelopmentPrograms =
    await getCommunityDevelopmentProgramsForCommunity(ctx, { communityId });
  const communityDevelopmentProgramsSync = communityDevelopmentPrograms[0]?.id
    ? [
        {
          id: communityDevelopmentPrograms[0].id,
        },
      ]
    : [];
  return ctx
    .post<
      GraphQLResponse<"createTalentNominationEvent", TalentNominationEvent>
    >(Test_CreateTalentNominationEventMutation, {
      isPrivileged: true,
      variables: {
        talentNominationEvent: {
          ...defaultTalentNominationEvent,
          ...talentNominationEvent,
          community: {
            connect: communityId,
          },
          communityDevelopmentPrograms: {
            sync: communityDevelopmentProgramsSync,
          },
        },
      },
    })
    .then((res) => res.createTalentNominationEvent);
};
