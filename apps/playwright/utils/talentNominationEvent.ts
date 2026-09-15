import type {
  CreateTalentNominationEventInput,
  TalentNominationEvent,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getCommunities } from "./communities";
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
  // Pick a community that has a development program, not just the first one returned
  // The list is unordered and other tests add communities with none, which quietly creates
  // an event with no "development opportunities" option
  const requestedCommunityId = talentNominationEvent.community?.connect;
  let communityId = requestedCommunityId ?? "";
  let communityDevelopmentPrograms = communityId
    ? await getCommunityDevelopmentProgramsForCommunity(ctx, { communityId })
    : [];

  if (!requestedCommunityId) {
    const communities = await getCommunities(ctx, {});
    for (const community of communities) {
      const programs = await getCommunityDevelopmentProgramsForCommunity(ctx, {
        communityId: community.id,
      });
      if (programs[0]?.id) {
        communityId = community.id;
        communityDevelopmentPrograms = programs;
        break;
      }
    }
  }

  if (!communityId) {
    throw new Error(
      "createTalentNominationEvent: no community with a development program was found",
    );
  }

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
