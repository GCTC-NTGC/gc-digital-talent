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
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      citizenship
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      firstOfficialLanguage
      secondLanguageExamCompleted
      secondLanguageExamValidity
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      govEmployeeType
      armedForcesStatus
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
      indigenousCommunities
      indigenousDeclarationSignature
      isVisibleMinority
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
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
          category
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
          awardedTo
          awardedScope
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
          type
          status
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
      stream
      closingDate
      publishingGroup
      language
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
          key
          name {
            en
            fr
          }
        }
      }
      essentialSkills {
        id
        key
        category
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
      nonessentialSkills {
        id
        key
        category
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
    educationRequirementOption
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
        awardedTo
        awardedScope
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
        type
        status
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
