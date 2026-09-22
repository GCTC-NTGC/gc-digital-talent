import type {
  TalentRequestTrackedUserFilterInput,
  TalentRequestTrackedUserStatus,
  UpdateTalentRequestTrackedUserInput,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const TalentRequestTrackedUsersQueryDocument = /* GraphQL */ `
  query Test_TalentRequestTrackedUsers(
    $talentRequestId: UUID!
    $where: TalentRequestTrackedUserFilterInput
  ) {
    talentRequestTrackedUsers(
      talentRequestId: $talentRequestId
      where: $where
    ) {
      data {
        id
        user {
          id
        }
        status {
          value
        }
      }
    }
  }
`;

export interface TrackedCandidateSummary {
  id: string;
  user: { id: string };
  status?: { value: TalentRequestTrackedUserStatus } | null;
}

interface GetTalentRequestTrackedUsersArgs {
  talentRequestId: string;
  where?: TalentRequestTrackedUserFilterInput;
}

/**
 * Get a talent request's tracked users using the graphql API
 */
export const getTalentRequestTrackedUsers: GraphQLRequestFunc<
  TrackedCandidateSummary[],
  GetTalentRequestTrackedUsersArgs
> = async (ctx, { talentRequestId, where }) => {
  return ctx
    .post<
      GraphQLResponse<
        "talentRequestTrackedUsers",
        { data: TrackedCandidateSummary[] }
      >
    >(TalentRequestTrackedUsersQueryDocument, {
      isPrivileged: true,
      variables: { talentRequestId, where },
    })
    .then((res) => res.talentRequestTrackedUsers.data);
};

const Test_UpdateTalentRequestTrackedUserMutationDocument = /* GraphQL */ `
  mutation Test_UpdateTalentRequestTrackedUser(
    $id: UUID!
    $input: UpdateTalentRequestTrackedUserInput!
  ) {
    updateTalentRequestTrackedUser(id: $id, input: $input) {
      id
    }
  }
`;

interface UpdateTalentRequestTrackedUserArgs {
  id: string;
  input: UpdateTalentRequestTrackedUserInput;
}

/**
 * Update a talent request tracked user's referral/selection decision using the graphql API
 */
export const updateTalentRequestTrackedUser: GraphQLRequestFunc<
  { id: string },
  UpdateTalentRequestTrackedUserArgs
> = async (ctx, { id, input }) => {
  return ctx
    .post<GraphQLResponse<"updateTalentRequestTrackedUser", { id: string }>>(
      Test_UpdateTalentRequestTrackedUserMutationDocument,
      {
        isPrivileged: true,
        variables: { id, input },
      },
    )
    .then((res) => res.updateTalentRequestTrackedUser);
};
