import {
  Command_CreateUserMutation,
  Command_UpdateUserMutation,
  Command_UpdateUserRolesMutation,
  Command_CurrentUserQuery,
  Command_RolesQuery,
  graphql,
} from "@gc-digital-talent/graphql";

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
  firstOfficialLanguage: undefined,
  secondLanguageExamCompleted: undefined,
  secondLanguageExamValidity: undefined,
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

const commandCreateUserMutationDoc = /* GraphQL */ `
  mutation Command_CreateUser($user: CreateUserInput!) {
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

const Command_CreateUserMutation = graphql(commandCreateUserMutationDoc);

Cypress.Commands.add("createUser", (user) => {
  cy.graphqlRequest<Command_CreateUserMutation>({
    operationName: "Command_CreateUser",
    query: commandCreateUserMutationDoc,
    variables: {
      user: {
        ...defaultUser,
        ...user,
      },
    },
  }).then((data) => cy.wrap(data.createUser));
});

const commandUpdateUserMutationDoc = /* GraphQL */ `
  mutation Command_UpdateUser($id: ID!, $user: UpdateUserAsAdminInput!) {
    updateUserAsAdmin(id: $id, user: $user) {
      id
    }
  }
`;

const Command_UpdateUserMutation = graphql(commandUpdateUserMutationDoc);

Cypress.Commands.add("updateUser", (id, user) => {
  cy.graphqlRequest<Command_UpdateUserMutation>({
    operationName: "Command_UpdateUser",
    query: commandUpdateUserMutationDoc,
    variables: {
      id: id,
      user: {
        ...defaultUser,
        ...user,
      },
    },
  }).then((data) => cy.wrap(data.updateUserAsAdmin));
});

const commandUpdateUserRolesMutationDoc = /* GraphQL */ `
  mutation Command_UpdateUserRoles(
    $updateUserRolesInput: UpdateUserRolesInput!
  ) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
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
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`;

const Command_UpdateUserRolesMutation = graphql(
  commandUpdateUserRolesMutationDoc,
);

Cypress.Commands.add("updateUserRoles", ({ userId, roleAssignmentsInput }) => {
  cy.graphqlRequest<Command_UpdateUserRolesMutation>({
    operationName: "Command_UpdateUserRoles",
    query: commandUpdateUserRolesMutationDoc,
    variables: {
      updateUserRolesInput: {
        userId: userId,
        roleAssignmentsInput: roleAssignmentsInput,
      },
    },
  }).then((data) => cy.wrap(data.updateUserRoles));
});

const commandCurrentUserQueryDoc = /* GraphQL */ `
  query Command_CurrentUser {
    me {
      id
      email
      experiences {
        id
      }
    }
  }
`;

const Command_CurrentUserQuery = graphql(commandCurrentUserQueryDoc);

Cypress.Commands.add("getMe", () => {
  cy.graphqlRequest<Command_CurrentUserQuery>({
    operationName: "Command_CurrentUser",
    query: commandCurrentUserQueryDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.me);
  });
});

const commandRolesQueryDoc = /* GraphQL */ `
  query Command_Roles {
    roles {
      id
      name
    }
  }
`;

const Command_RolesQuery = graphql(commandRolesQueryDoc);

Cypress.Commands.add("getRoles", () => {
  cy.graphqlRequest<Command_RolesQuery>({
    operationName: "Command_Roles",
    query: commandRolesQueryDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.roles);
  });
});
