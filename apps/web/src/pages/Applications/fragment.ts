import { graphql } from "@gc-digital-talent/graphql";

const Application_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment Application_PoolCandidate on PoolCandidate {
    id
    user {
      id
      firstName
      lastName
      email
      telephone
      preferredLang {
        value
      }
      preferredLanguageForInterview {
        value
      }
      preferredLanguageForExam {
        value
      }
      currentProvince {
        value
      }
      currentCity
      citizenship {
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
      govEmployeeType {
        value
      }
      armedForcesStatus {
        value
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
      }
      indigenousDeclarationSignature
      isVisibleMinority
      hasDiploma
      locationPreferences {
        value
      }
      locationExemptions
      acceptedOperationalRequirements {
        value
      }
      positionDuration
      experiences {
        id
        __typename
        user {
          id
          email
        }
        details
        skills {
          id
          key
          category {
            value
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
          experienceSkillRecord {
            details
          }
          families {
            id
            key
            description {
              en
              fr
            }
            name {
              en
              fr
            }
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo {
            value
          }
          awardedScope {
            value
          }
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type {
            value
          }
          status {
            value
          }
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
    }
    pool {
      id
      name {
        en
        fr
      }
      stream {
        value
      }
      closingDate
      publishingGroup {
        value
      }
      language {
        value
      }
      classification {
        id
        group
        level
        name {
          en
          fr
        }
        genericJobTitles {
          id
          key {
            value
          }
          name {
            en
            fr
          }
        }
      }
      poolSkills {
        id
        type {
          value
        }
        skill {
          id
          key
          category {
            value
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
          experienceSkillRecord {
            details
          }
          families {
            id
            key
            description {
              en
              fr
            }
            name {
              en
              fr
            }
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
    }
    educationRequirementExperiences {
      id
      __typename
      details
      user {
        id
        email
      }
      ... on AwardExperience {
        title
        issuedBy
        awardedDate
        awardedTo {
          value
        }
        awardedScope {
          value
        }
        details
      }
      ... on CommunityExperience {
        title
        organization
        project
        startDate
        endDate
        details
      }
      ... on EducationExperience {
        institution
        areaOfStudy
        thesisTitle
        startDate
        endDate
        type {
          value
        }
        status {
          value
        }
        details
      }
      ... on PersonalExperience {
        title
        description
        startDate
        endDate
        details
      }
      ... on WorkExperience {
        role
        organization
        division
        startDate
        endDate
        details
      }
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
