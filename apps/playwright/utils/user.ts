export const defaultUser = {
  // required
  firstName: "Playwright",
  lastName: "User",
  preferredLang: "EN",
  preferredLanguageForInterview: "EN",
  preferredLanguageForExam: "EN",

  // optional
  telephone: undefined,
  email: undefined,
  currentProvince: undefined,
  currentCity: undefined,
  lookingForEnglish: undefined,
  lookingForFrench: undefined,
  lookingForBilingual: undefined,
  bilingualEvaluation: undefined,
  comprehensionLevel: undefined,
  writtenLevel: undefined,
  verbalLevel: undefined,
  estimatedLanguageAbility: undefined,
  isGovEmployee: undefined,
  hasPriorityEntitlement: undefined,
  priorityNumber: undefined,
  department: undefined,
  currentClassification: undefined,
  isWoman: undefined,
  hasDisability: undefined,
  isVisibleMinority: undefined,
  hasDiploma: undefined,
  locationPreferences: undefined,
  locationExemptions: undefined,
  acceptedOperationalRequirements: undefined,
  positionDuration: undefined,
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
    }
  }
`;
