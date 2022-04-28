describe('Static pages', () => {
  context('Privacy Policy page', () => {
    it('should exist', () => {
      cy.visit('/en/privacy-notice')
      cy.get('h1').contains('Privacy notice').should('exist')
    })
  })

  context('Terms & Conditions page', () => {
    it('should exist', () => {
      cy.visit('/en/terms-and-conditions')
      cy.get('h1').contains('Terms and conditions').should('exist')
    })
  })
})
