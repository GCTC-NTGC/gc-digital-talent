// https://glebbahmutov.com/cypress-examples/6.5.0/recipes/form-input-by-label.html#reusable-function
export const getInputByLabel = (label) => {
  return cy
    .contains('label', label)
    .invoke('attr', 'for')
    .then((id) => {
      cy.get('#' + id)
    })
}
