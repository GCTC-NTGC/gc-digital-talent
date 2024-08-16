import { Team } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_TeamsQueryDocument = /* GraphQL */ `
  query Test_Teams {
    teams {
      id
      name
      displayName {
        en
        fr
      }
    }
  }
`;

export const Test_CreateTeamMutationDocument = /* GraphQL */ `
  mutation Test_CreateTeam($team: CreateTeamInput!) {
    createTeam(team: $team) {
      id
    }
  }
`;

/**
 * Get DCM
 *
 * Get all the DCM team directly from
 * the API.
 */
export const getDCM: GraphQLRequestFunc<Team> = async (ctx) => {
  return await ctx
    .post(Test_TeamsQueryDocument)
    .then((res: GraphQLResponse<"teams", Team[]>) => {
      return res.teams.find(
        (team) => team.name === "digital-community-management",
      );
    });
};
