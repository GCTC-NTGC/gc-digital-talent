import { User, Language } from "@gc-digital-talent/graphql";

export const defaultUser: Partial<User> = {
  // required
  firstName: "Playwright",
  lastName: "User",
  preferredLang: Language.En,
  preferredLanguageForInterview: Language.En,
  preferredLanguageForExam: Language.En,
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
