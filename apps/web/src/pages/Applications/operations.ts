import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const Application_UserFragment = graphql(/* GraphQL */ `
  fragment Application_User on User {
    firstName
    lastName
    email
    telephone
    preferredLang
    preferredLanguageForInterview
    preferredLanguageForExam
    currentProvince
    currentCity
    citizenship
    armedForcesStatus
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
    govEmployeeType
    isProfileComplete
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
      group
      level
      name {
        en
        fr
      }
    }
    isWoman
    hasDisability
    indigenousCommunities
    indigenousDeclarationSignature
    isVisibleMinority
    hasDiploma
    locationPreferences
    locationExemptions
    acceptedOperationalRequirements
    positionDuration
    userSkills {
      id
      skill {
        id
        key
        name {
          en
          fr
        }
        category
      }
    }
  }
`);
