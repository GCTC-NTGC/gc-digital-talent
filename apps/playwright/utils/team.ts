import { Team } from "@gc-digital-talent/graphql";

import { graphqlRequest } from "./graphql";

export const Test_TeamsQueryDocument = /* GraphQL */ `
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

/**
 * Get DCM
 *
 * Get all the DCM team directly from
 * the API.
 */
export async function getDCM(): Promise<Team> {
  const res = await graphqlRequest(Test_TeamsQueryDocument);

  const dcm = res.teams.find(
    (team) => team.name === "digital-community-management",
  );

  return dcm;
}
