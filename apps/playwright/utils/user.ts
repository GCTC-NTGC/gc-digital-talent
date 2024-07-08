import {
  Language,
  ProvinceOrTerritory,
  WorkRegion,
  PositionDuration,
  CitizenshipStatus,
  ArmedForcesStatus,
  CreateUserInput,
} from "@gc-digital-talent/graphql";

export const defaultUser: Partial<CreateUserInput> = {
  // required
  firstName: "Playwright",
  lastName: "User",
  email: "playwright@example.com",
  telephone: "555-555-5555",
  preferredLang: Language.En,
  preferredLanguageForInterview: Language.En,
  preferredLanguageForExam: Language.En,
  currentProvince: ProvinceOrTerritory.Alberta,
  currentCity: "Village",
  lookingForEnglish: true,
  isGovEmployee: true,
  hasPriorityEntitlement: false,
  locationPreferences: [WorkRegion.Atlantic],
  positionDuration: [PositionDuration.Permanent],
  citizenship: CitizenshipStatus.Citizen,
  armedForcesStatus: ArmedForcesStatus.NonCaf,
};

export const Test_CreateUserMutationDocument = /* GraphQL */ `
  mutation Test_CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      firstName
      lastName
      email
      authInfo {
        id
        sub
      }
    }
  }
`;

export const Test_MeQueryDocument = /* GraphQL */ `
  query Test_Me {
    me {
      id
      experiences {
        id
        __typename
        details
        skills {
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
          keywords {
            en
            fr
          }
          category {
            value
          }
          experienceSkillRecord {
            details
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
  }
`;
