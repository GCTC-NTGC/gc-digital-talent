import { graphql } from "@gc-digital-talent/graphql";

const Application_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment Application_PoolCandidate on PoolCandidate {
    id
    submittedAt
    user {
      id
      firstName
      lastName
      email
      telephone
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
      currentProvince {
        value
        label {
          en
          fr
        }
      }
      currentCity
      citizenship {
        value
        label {
          en
          fr
        }
      }
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      firstOfficialLanguage {
        value
        label {
          en
          fr
        }
      }
      secondLanguageExamCompleted
      secondLanguageExamValidity
      comprehensionLevel {
        value
        label {
          en
          fr
        }
      }
      writtenLevel {
        value
        label {
          en
          fr
        }
      }
      verbalLevel {
        value
        label {
          en
          fr
        }
      }
      estimatedLanguageAbility {
        value
        label {
          en
          fr
        }
      }
      isGovEmployee
      govEmployeeType {
        value
        label {
          en
          fr
        }
      }
      armedForcesStatus {
        value
        label {
          en
          fr
        }
      }
      hasPriorityEntitlement
      priorityNumber
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
      indigenousCommunities {
        value
        label {
          en
          fr
        }
      }
      indigenousDeclarationSignature
      isVisibleMinority
      hasDiploma
      locationPreferences {
        value
        label {
          en
          fr
        }
      }
      locationExemptions
      acceptedOperationalRequirements {
        value
        label {
          en
          fr
        }
      }
      positionDuration
      experiences {
        id
        ...ExperienceCard
        ...SkillTreeExperience
        ...ApplicationSkillsExperience
      }
      workEmail
      isWorkEmailVerified
    }
    pool {
      id
      name {
        en
        fr
      }
      workStream {
        id
        name {
          en
          fr
        }
      }
      closingDate
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      language {
        value
        label {
          en
          fr
        }
      }
      classification {
        id
        group
        level
      }
      poolSkills {
        id
        type {
          value
          label {
            en
            fr
          }
        }
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
        }
      }
      screeningQuestions {
        id
        question {
          en
          fr
        }
      }
      generalQuestions {
        id
        question {
          en
          fr
        }
      }
    }
    educationRequirementOption {
      value
      label {
        en
        fr
      }
    }
    educationRequirementExperiences {
      id
      ...ExperienceCard
      ...SkillTreeExperience
      ...ApplicationSkillsExperience
    }
    submittedSteps
    screeningQuestionResponses {
      id
      answer
      screeningQuestion {
        id
        question {
          en
          fr
        }
      }
    }
    generalQuestionResponses {
      id
      answer
      generalQuestion {
        id
        question {
          en
          fr
        }
      }
    }
    signature
  }
`);

export default Application_PoolCandidateFragment;
