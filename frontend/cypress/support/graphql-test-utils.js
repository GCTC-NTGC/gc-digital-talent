// Source: https://docs.cypress.io/guides/testing-strategies/working-with-graphql

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
  const { body } = req
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}

export const setUpGraphqlIntercepts = () => {
  cy.intercept('POST', '/graphql', (req) => {
    // Creates aliases for use later.
    // E.g., cy.wait('@gqlgetMeQuery')
    aliasQuery(req, 'getMe')
    aliasQuery(req, 'me')
    aliasQuery(req, 'countApplicantsQuery')
  })
}
