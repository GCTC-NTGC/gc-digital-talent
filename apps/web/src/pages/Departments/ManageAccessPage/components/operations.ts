import { graphql } from "@gc-digital-talent/graphql";

export const UpdateUserDepartmentRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateDepartmentUserRoles(
    $updateUserRolesInput: UpdateUserRolesInput!
  ) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`);
