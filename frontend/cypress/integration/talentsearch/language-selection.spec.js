describe('Language selection', () => {
  beforeEach(() => cy.visit('/'))

  it('has English and French buttons', () => {
    cy.get('#mainContent').within(() => {
      cy.get('a').contains('English').should('exist')
      cy.get('a').contains('Français').should('exist')
      cy.get('a').contains('Toki Pona').should('not.exist')
    })
  })
})
