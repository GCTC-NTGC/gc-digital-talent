import {
  CreateUserMutation,
  GetMeQuery,
  ListRolesQuery,
  UpdateUserAsAdminMutation,
  CreateUserDocument,
  GetMeDocument,
  ListRolesDocument,
  UpdateUserAsAdminDocument,
  UpdateUserRolesMutation,
  UpdateUserRolesDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

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

Cypress.Commands.add("createUser", (user) => {
  cy.graphqlRequest<CreateUserMutation>({
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
  cy.graphqlRequest<UpdateUserAsAdminMutation>({
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

Cypress.Commands.add("updateUserRoles", ({ userId, roleAssignmentsInput }) => {
  cy.graphqlRequest<UpdateUserRolesMutation>({
    operationName: "UpdateUserRoles",
    query: getGqlString(UpdateUserRolesDocument),
    variables: {
      updateUserRolesInput: {
        userId: userId,
        roleAssignmentsInput: roleAssignmentsInput,
      },
    },
  }).then((data) => cy.wrap(data.updateUserRoles));
});

Cypress.Commands.add("getMe", () => {
  cy.graphqlRequest<GetMeQuery>({
    operationName: "getMe",
    query: getGqlString(GetMeDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.me);
  });
});

Cypress.Commands.add("getRoles", () => {
  cy.graphqlRequest<ListRolesQuery>({
    operationName: "ListRoles",
    query: getGqlString(ListRolesDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.roles);
  });
});
