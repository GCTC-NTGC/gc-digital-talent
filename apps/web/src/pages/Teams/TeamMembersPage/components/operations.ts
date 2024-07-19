import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const UpdateUserTeamRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
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
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`);

export const TeamMembersPage_TeamFragment = graphql(/* GraphQL */ `
  fragment TeamMembersPage_Team on Team {
    id
    name
    contactEmail
    displayName {
      en
      fr
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    description {
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
        email
        firstName
        lastName
      }
    }
  }
`);
