import { graphql } from "@gc-digital-talent/graphql";

export const UpdateUserProcessRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserProcessRole($updateUserRolesInput: UpdateUserRolesInput!) {
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

export const ManageAccessPage_PoolFragment = graphql(/* GraphQL */ `
  fragment ManageAccessPagePool on Pool {
    id
    name {
      en
      fr
    }
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
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`);
