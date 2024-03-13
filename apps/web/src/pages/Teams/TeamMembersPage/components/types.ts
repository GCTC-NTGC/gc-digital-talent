import { FragmentType, Scalars, graphql } from "@gc-digital-talent/graphql";

export type TeamMemberFormValues = {
  teamId: Scalars["UUID"]["output"];
  teamDisplay: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Array<Scalars["UUID"]["output"]>;
};

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

export type TeamMembersPageFragment = FragmentType<
  typeof TeamMembersPage_TeamFragment
>;
