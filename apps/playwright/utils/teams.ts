import { CreateTeamInput, Team } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

export const Test_CreateTeamMutationDocument = /* GraphQL */ `
  mutation Test_CreateTeam($team: CreateTeamInput!) {
    createTeam(team: $team) {
      id
    }
  }
`;

export const createTeam: GraphQLRequestFunc<Team, CreateTeamInput> = async (
  ctx,
  team,
) => {
  return ctx
    .post(Test_CreateTeamMutationDocument, {
      isPrivileged: true,
      variables: { team },
    })
    .then((res: GraphQLResponse<"createTeam", Team>) => res.createTeam);
};
