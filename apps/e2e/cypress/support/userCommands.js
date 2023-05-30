import {
  CreateUserDocument,
  MeDocument,
  GetMeDocument,
  ListRolesDocument,
  UpdateUserAsAdminDocument,
} from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

const defaultUser = {
  // required
  firstName: "Cypress",
  lastName: "User",
  preferredLang: "EN",
  preferredLanguageForInterview: "EN",
  preferredLanguageForExam: "EN",

  // optional
  telephone: undefined,
  email: undefined,
  legacyRoles: [],
  currentProvince: undefined,
  currentCity: undefined,
  languageAbility: undefined,
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
  isIndigenous: undefined,
  isVisibleMinority: undefined,
  jobLookingStatus: undefined,
  hasDiploma: undefined,
  locationPreferences: undefined,
  locationExemptions: undefined,
  acceptedOperationalRequirements: undefined,
  expectedSalary: undefined,
  expectedClassifications: [],
  positionDuration: undefined,
};

Cypress.Commands.add("createUser", (user) => {
  cy.graphqlRequest({
    operationName: "CreateUser",
    query: getGqlString(CreateUserDocument),
    variables: {
      user: {
        ...defaultUser,
        ...user,
      },
    },
  }).then((data) => cy.wrap(data.createUser));
});

Cypress.Commands.add("updateUser", (id, user) => {
  cy.graphqlRequest({
    operationName: "UpdateUserAsAdmin",
    query: getGqlString(UpdateUserAsAdminDocument),
    variables: {
      id: id,
      user: {
        ...defaultUser,
        ...user,
      },
    },
  }).then((data) => cy.wrap(data.updateUserAsAdmin));
});

Cypress.Commands.add("getMe", () => {
  cy.graphqlRequest({
    operationName: "me",
    query: getGqlString(MeDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.me);
  });
});

Cypress.Commands.add("getMeAllData", () => {
  cy.graphqlRequest({
    operationName: "getMe",
    query: getGqlString(GetMeDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.me);
  });
});

Cypress.Commands.add("getRoles", () => {
  cy.graphqlRequest({
    operationName: "ListRoles",
    query: getGqlString(ListRolesDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.roles);
  });
});
