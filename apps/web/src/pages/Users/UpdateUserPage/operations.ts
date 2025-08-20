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

    ...UpdateUserOptions

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
          teamable {
            id
            __typename
            ... on Pool {
              name {
                en
                fr
              }
              teamIdForRoleAssignment
            }
            ... on Community {
              name {
                en
                fr
              }
              key
              teamIdForRoleAssignment
            }
          }
        }
      }
      deletedDate
      firstName
      lastName
      telephone
      isGovEmployee
      workEmail
      preferredLang {
        value
        label {
          en
          fr
        }
      }
      preferredLanguageForInterview {
        value
        label {
          en
          fr
        }
      }
      preferredLanguageForExam {
        value
        label {
          en
          fr
        }
      }
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
      currentProvince {
        value
      }
      currentCity

      preferredLang {
        value
      }
      preferredLanguageForInterview {
        value
      }
      preferredLanguageForExam {
        value
      }
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      firstOfficialLanguage {
        value
      }
      secondLanguageExamCompleted
      secondLanguageExamValidity
      comprehensionLevel {
        value
      }
      writtenLevel {
        value
      }
      verbalLevel {
        value
      }
      estimatedLanguageAbility {
        value
      }

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
      indigenousCommunities {
        value
      }
      indigenousDeclarationSignature

      hasDiploma
      locationPreferences {
        value
      }
      locationExemptions
      acceptedOperationalRequirements {
        value
      }
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
