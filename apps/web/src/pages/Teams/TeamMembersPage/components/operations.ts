import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const UpdateUserTeamRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserTeamRoles(
    $teamRoleAssignments: UpdateUserTeamRolesInput!
  ) {
    updateUserTeamRoles(teamRoleAssignments: $teamRoleAssignments) {
      roleAssignments {
        role {
          name
        }
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`);
