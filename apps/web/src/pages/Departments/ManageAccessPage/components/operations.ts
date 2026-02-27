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

export const DepartmentManageAccessPage_DepartmentFragment = graphql(
  /* GraphQL */ `
    fragment DepartmentManageAccessPage_Department on Department {
      id
      name {
        localized
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
          email
          firstName
          lastName
        }
      }
    }
  `,
);
