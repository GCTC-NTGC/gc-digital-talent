import { CreateUserDocument, MeDocument } from "../../admin/src/js/api/generated"

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add('createUser', (user) => {
  const defaultUser = {
    // required
    firstName: "Cypress",
    lastName: "User",
    preferredLang: "EN",

    // optional
    telephone: undefined,
    email: undefined,
    roles: [],
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
  }
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'CreateUser',
      query: getGqlString(CreateUserDocument),
      variables: {
        user: {
          ...defaultUser,
          ...user,
        },
      },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.createUser);
  });
})

Cypress.Commands.add('getMe', () => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'me',
      query: getGqlString(MeDocument),
      variables: { },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.me);
  });
});
