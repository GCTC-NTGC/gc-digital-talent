describe('Static pages', () => {
  context('Privacy Policy page', () => {
    it('should exist', () => {
      cy.visit('/en/privacy-notice')
      cy.findByRole('heading', { name: 'Privacy notice', level: 1 }).should('exist')
    })

    it('should have no accessibility errors', () => {
      cy.visit('/en/privacy-notice');
      cy.injectAxe();
      cy.checkA11y();
    });
  })

  context('Terms & Conditions page', () => {
    it('should exist', () => {
      cy.visit('/en/terms-and-conditions')
      cy.findByRole('heading', { name: 'Terms and conditions', level: 1 }).should('exist')
    })

    it('should have no accessibility errors', () => {
      cy.visit('/en/terms-and-conditions');
      cy.injectAxe();
      cy.checkA11y();
    });
  })

  context('Accessibility Statement page', () => {
    it('should exist', () => {
      cy.visit('/en/accessibility-statement')
      cy.findByRole('heading', { name: 'Accessibility statement', level: 1 }).should('exist')
    })

    it('should have no accessibility errors', () => {
      cy.visit('/en/accessibility-statement');
      cy.injectAxe();
      cy.findByRole('heading', { name: 'Accessibility statement', level: 1 }).should('exist');
      cy.checkA11y();
    });
  })
})
