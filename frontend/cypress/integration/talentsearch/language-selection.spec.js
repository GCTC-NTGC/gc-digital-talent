describe('Language selection', () => {
  beforeEach(() => cy.visit('/'))

  it('has English and French buttons', () => {
    cy.findByRole('main').within(() => {
      cy.findByRole('link', { name: 'English' }).should('exist')
      cy.findByRole('link', { name: 'Français' }).should('exist')
      cy.findByRole('link', { name: 'Toki Pona' }).should('not.exist')
    })
  })
})
