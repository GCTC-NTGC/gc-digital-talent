import type {
  CreateTalentNominationEventInput,
  LocalizedNineBoxRating,
  LocalizedTalentNominationEventStatus,
  LocalizedTalentNominationGroupStatus,
  LocalizedTalentNominationLateralMovementOption,
  LocalizedTalentNominationNomineeRelationshipToNominator,
  LocalizedTalentNominationSubmitterRelationshipToNominator,
  TalentNomination,
  TalentNominationEvent,
  UpdateTalentNominationInput,
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
      name {
        en
        fr
      }
      community {
        id
      }
      communityDevelopmentPrograms {
        developmentProgram {
          name {
            en
          }
        }
      }
    }
  }
`;

export const createTalentNominationEvent: GraphQLRequestFunc<
  TalentNominationEvent | undefined,
  Partial<CreateTalentNominationEventInput>
> = async (ctx, talentNominationEvent) => {
  const myCommunity = await getMyCommunity(ctx, {});
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

const Test_UpdateTalentNominationMutation = /* GraphQL */ `
  mutation Test_UpdateTalentNomination(
    $talentNomination: UpdateTalentNominationInput!
  ) {
    updateTalentNomination(talentNomination: $talentNomination) {
      id
    }
  }
`;

/**
 * Privileged so community roles apply, e.g. talent coordinators nominating for a past event
 */
export const updateTalentNomination: GraphQLRequestFunc<
  TalentNomination | undefined,
  UpdateTalentNominationInput
> = async (ctx, talentNomination) => {
  return ctx
    .post<GraphQLResponse<"updateTalentNomination", TalentNomination>>(
      Test_UpdateTalentNominationMutation,
      {
        isPrivileged: true,
        variables: { talentNomination },
      },
    )
    .then((res) => res.updateTalentNomination);
};

const Test_SubmitTalentNominationMutation = /* GraphQL */ `
  mutation Test_SubmitTalentNomination($id: UUID!) {
    submitTalentNomination(id: $id) {
      id
    }
  }
`;

export const submitTalentNomination: GraphQLRequestFunc<
  TalentNomination | undefined,
  { id: string }
> = async (ctx, { id }) => {
  return ctx
    .post<GraphQLResponse<"submitTalentNomination", TalentNomination>>(
      Test_SubmitTalentNominationMutation,
      {
        isPrivileged: true,
        variables: { id },
      },
    )
    .then((res) => res.submitTalentNomination);
};

const Test_TalentNominationGroupStatusesQueryDocument = /* GraphQL */ `
  query Test_TalentNominationGroupStatuses {
    localizedEnumOptions(enumName: "TalentNominationGroupStatus") {
      ... on LocalizedTalentNominationGroupStatus {
        value
        label {
          en
        }
      }
    }
  }
`;

export const getTalentNominationGroupStatuses: GraphQLRequestFunc<
  LocalizedTalentNominationGroupStatus[]
> = async (ctx) => {
  return ctx
    .post<
      GraphQLResponse<
        "localizedEnumOptions",
        LocalizedTalentNominationGroupStatus[]
      >
    >(Test_TalentNominationGroupStatusesQueryDocument)
    .then((res) => res.localizedEnumOptions);
};

const Test_TalentNominationEventStatusesQueryDocument = /* GraphQL */ `
  query Test_TalentNominationEventStatuses {
    localizedEnumOptions(enumName: "TalentNominationEventStatus") {
      ... on LocalizedTalentNominationEventStatus {
        value
        label {
          en
        }
      }
    }
  }
`;

/**
 * Get the talent event statuses (e.g. Upcoming) and their labels using the graphql API
 */
export const getTalentNominationEventStatuses: GraphQLRequestFunc<
  LocalizedTalentNominationEventStatus[]
> = async (ctx) => {
  return ctx
    .post<
      GraphQLResponse<
        "localizedEnumOptions",
        LocalizedTalentNominationEventStatus[]
      >
    >(Test_TalentNominationEventStatusesQueryDocument)
    .then((res) => res.localizedEnumOptions);
};

const Test_TalentNominationOptionsQueryDocument = /* GraphQL */ `
  query Test_TalentNominationOptions {
    submitterRelationships: localizedEnumOptions(
      enumName: "TalentNominationSubmitterRelationshipToNominator"
    ) {
      ... on LocalizedTalentNominationSubmitterRelationshipToNominator {
        value
        label {
          en
        }
      }
    }
    nomineeRelationships: localizedEnumOptions(
      enumName: "TalentNominationNomineeRelationshipToNominator"
    ) {
      ... on LocalizedTalentNominationNomineeRelationshipToNominator {
        value
        label {
          en
        }
      }
    }
    lateralMovementOptions: localizedEnumOptions(
      enumName: "TalentNominationLateralMovementOption"
    ) {
      ... on LocalizedTalentNominationLateralMovementOption {
        value
        label {
          en
        }
      }
    }
    nineBoxRatings: localizedEnumOptions(enumName: "NineBoxRating") {
      ... on LocalizedNineBoxRating {
        value
        label {
          en
        }
      }
    }
  }
`;

interface TalentNominationOptions {
  submitterRelationships: LocalizedTalentNominationSubmitterRelationshipToNominator[];
  nomineeRelationships: LocalizedTalentNominationNomineeRelationshipToNominator[];
  lateralMovementOptions: LocalizedTalentNominationLateralMovementOption[];
  nineBoxRatings: LocalizedNineBoxRating[];
}

/**
 * Get the options a nominator picks from (relationships, lateral movement, nine box) and their labels using the graphql API
 */
export const getTalentNominationOptions: GraphQLRequestFunc<
  TalentNominationOptions
> = async (ctx) => {
  return ctx.post<TalentNominationOptions>(
    Test_TalentNominationOptionsQueryDocument,
  );
};
