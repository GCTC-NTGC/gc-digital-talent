describe('Static pages', () => {
  context('Privacy Policy page', () => {
    it('should exist', () => {
      cy.visit('/en/privacy-notice')
      cy.findByRole('heading', { name: 'Privacy notice', level: 1 }).should('exist')
    })
  })

  context('Terms & Conditions page', () => {
    it('should exist', () => {
      cy.visit('/en/terms-and-conditions')
      cy.findByRole('heading', { name: 'Terms and conditions', level: 1 }).should('exist')
    })
  })
})
