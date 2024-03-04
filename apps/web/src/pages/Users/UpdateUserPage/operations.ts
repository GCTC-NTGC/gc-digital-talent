import { graphql } from "@gc-digital-talent/graphql";

export const UpdateUserData_Query = graphql(/* GraphQL */ `
  query UpdateUserData($id: UUID!) {
    roles {
      id
      name
      isTeamBased
      displayName {
        en
        fr
      }
    }

    user(id: $id, trashed: WITH) {
      id
      email
      authInfo {
        id
        sub
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
      deletedDate
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
    }
  }
`);

export const UpdateUserAsAdmin_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsAdmin($id: ID!, $user: UpdateUserAsAdminInput!) {
    updateUserAsAdmin(id: $id, user: $user) {
      id
      authInfo {
        id
        sub
      }

      firstName
      lastName
      telephone
      currentProvince
      currentCity

      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility

      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }

      isWoman
      hasDisability
      isVisibleMinority
      indigenousCommunities
      indigenousDeclarationSignature

      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      positionDuration
    }
  }
`);

export const UpdateUserSub_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserSub($updateUserSubInput: UpdateUserSubInput!) {
    updateUserSub(updateUserSubInput: $updateUserSubInput) {
      id
      sub
    }
  }
`);

export const UpdateUserRoles_Mutation = graphql(/* GraphQL */ `
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

export const DeleteUser_Mutation = graphql(/* GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      deletedDate
      authInfo {
        id
        sub
      }
      email
      poolCandidates {
        id
        deletedDate
        pool {
          id
        }
      }
      experiences {
        id
        deletedDate
      }
    }
  }
`);
