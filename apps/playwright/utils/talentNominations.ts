import type {
  CreateTalentNominationEventInput,
  CreateTalentNominationInput,
  LocalizedNineBoxRating,
  LocalizedTalentNominationEventStatus,
  LocalizedTalentNominationGroupStatus,
  LocalizedTalentNominationLateralMovementOption,
  LocalizedTalentNominationNomineeRelationshipToNominator,
  LocalizedTalentNominationSubmitterRelationshipToNominator,
  TalentNomination,
  TalentNominationEvent,
  TalentNominationGroup,
  UpdateTalentNominationGroupInput,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql/schema-types";
import { TalentNominationEventStatus } from "@gc-digital-talent/graphql/schema-types";

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
    includeLeadershipCompetencies: false,
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
      includeNineBox
      includeLeadershipCompetencies
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

const Test_TalentNominationEventsQueryDocument = /* GraphQL */ `
  query Test_TalentNominationEvents(
    $status: TalentNominationEventStatus!
    $isActive: Boolean!
  ) {
    talentNominationEvents(where: { status: $status }) {
      id
      name {
        en
        fr
      }
      community {
        id
      }
      includeNineBox
      includeLeadershipCompetencies @include(if: $isActive)
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
export const getTalentNominationEvent: GraphQLRequestFunc<
  TalentNominationEvent,
  { status: TalentNominationEventStatus; name?: string; communityId?: string }
> = async (ctx, { status, name, communityId }) => {
  const event = await ctx
    .post<GraphQLResponse<"talentNominationEvents", TalentNominationEvent[]>>(
      Test_TalentNominationEventsQueryDocument,
      {
        variables: {
          status,
          isActive: status === TalentNominationEventStatus.Active,
        },
      },
    )
    .then((res) =>
      res.talentNominationEvents
        .filter((e) =>
          name
            ? e.name.en === name
            : e.community.id === communityId &&
              !e.name.en?.startsWith("Playwright"),
        )
        .pop(),
    );
  if (!event) {
    throw new Error(
      `No ${status} talent nomination event ${name ? `named "${name}"` : `in community ${communityId}`}`,
    );
  }
  return event;
};

const Test_CreateTalentNominationMutation = /* GraphQL */ `
  mutation Test_CreateTalentNomination(
    $talentNomination: CreateTalentNominationInput!
  ) {
    createTalentNomination(talentNomination: $talentNomination) {
      id
    }
  }
`;

export const createTalentNomination: GraphQLRequestFunc<
  TalentNomination | undefined,
  CreateTalentNominationInput
> = async (ctx, talentNomination) => {
  return ctx
    .post<GraphQLResponse<"createTalentNomination", TalentNomination>>(
      Test_CreateTalentNominationMutation,
      {
        isPrivileged: true,
        variables: { talentNomination },
      },
    )
    .then((res) => res.createTalentNomination);
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

const Test_TalentNominationGroupsByNomineeQueryDocument = /* GraphQL */ `
  query Test_TalentNominationGroupsByNominee($nomineeUserId: UUID!) {
    talentNominationGroupsByNominee(nomineeUserId: $nomineeUserId) {
      id
    }
  }
`;

export const getTalentNominationGroupsByNominee: GraphQLRequestFunc<
  TalentNominationGroup[],
  { nomineeUserId: string }
> = async (ctx, { nomineeUserId }) => {
  return ctx
    .post<
      GraphQLResponse<
        "talentNominationGroupsByNominee",
        TalentNominationGroup[]
      >
    >(Test_TalentNominationGroupsByNomineeQueryDocument, {
      isPrivileged: true,
      variables: { nomineeUserId },
    })
    .then((res) => res.talentNominationGroupsByNominee);
};

const Test_UpdateTalentNominationGroupMutation = /* GraphQL */ `
  mutation Test_UpdateTalentNominationGroup(
    $id: UUID!
    $talentNominationGroup: UpdateTalentNominationGroupInput!
  ) {
    updateTalentNominationGroup(
      id: $id
      talentNominationGroup: $talentNominationGroup
    ) {
      id
    }
  }
`;

/**
 * Evaluate a nomination group, e.g. approve the advancement and lateral movement nominations
 */
export const updateTalentNominationGroup: GraphQLRequestFunc<
  TalentNominationGroup | undefined,
  { id: string; talentNominationGroup: UpdateTalentNominationGroupInput }
> = async (ctx, { id, talentNominationGroup }) => {
  return ctx
    .post<
      GraphQLResponse<"updateTalentNominationGroup", TalentNominationGroup>
    >(Test_UpdateTalentNominationGroupMutation, {
      isPrivileged: true,
      variables: { id, talentNominationGroup },
    })
    .then((res) => res.updateTalentNominationGroup);
};

const Test_TalentNominationOptionsQueryDocument = /* GraphQL */ `
  query Test_TalentNominationOptions {
    eventStatuses: localizedEnumOptions(
      enumName: "TalentNominationEventStatus"
    ) {
      ... on LocalizedTalentNominationEventStatus {
        value
        label {
          en
        }
      }
    }
    groupStatuses: localizedEnumOptions(
      enumName: "TalentNominationGroupStatus"
    ) {
      ... on LocalizedTalentNominationGroupStatus {
        value
        label {
          en
        }
      }
    }
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
  eventStatuses: LocalizedTalentNominationEventStatus[];
  groupStatuses: LocalizedTalentNominationGroupStatus[];
  submitterRelationships: LocalizedTalentNominationSubmitterRelationshipToNominator[];
  nomineeRelationships: LocalizedTalentNominationNomineeRelationshipToNominator[];
  lateralMovementOptions: LocalizedTalentNominationLateralMovementOption[];
  nineBoxRatings: LocalizedNineBoxRating[];
}

export const getTalentNominationOptions: GraphQLRequestFunc<
  TalentNominationOptions
> = async (ctx) => {
  return ctx.post<TalentNominationOptions>(
    Test_TalentNominationOptionsQueryDocument,
  );
};
