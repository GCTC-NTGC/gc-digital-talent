import { graphql } from "@gc-digital-talent/graphql";

export const UpdateUserCommunityRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunityUserRoles(
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

export const CommunityMembersPage_CommunityFragment = graphql(/* GraphQL */ `
  fragment CommunityMembersPage_Community on Community {
    id
    key
    name {
      en
      fr
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
