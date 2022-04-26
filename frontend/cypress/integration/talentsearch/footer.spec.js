describe('Footer', () => {
  context('English page', () => {
    beforeEach(() => cy.visit('/en'))
    it('links to Privacy Policy', () => {
      cy.get('footer').within(() => {
        cy.get('a').contains('Terms & Conditions').should('have.attr', 'href', '/en/terms-and-conditions')
      })
    })

    it('links to Terms & Conditions', () => {
      cy.get('footer').within(() => {
        cy.get('a').contains('Privacy Policy').should('have.attr', 'href', '/en/privacy-notice')
      })
    })

    it.skip('links to Canada.ca', () => {
      cy.get('footer').within(() => {
        cy.get('a').contains('Canada.ca').should('have.attr', 'href', 'https:/www.canada.ca/en.html')
      })
    })
  })

  context('French page', () => {
    beforeEach(() => cy.visit('/fr'))
    it('links to Privacy Policy (french)', () => {
      cy.get('footer').within(() => {
        cy.get('a').contains('Avis').should('have.attr', 'href', '/fr/terms-and-conditions')
      })
    })

    it.skip('links to Canada.ca (french)', () => {
      cy.get('footer').within(() => {
        cy.get('a').contains('Canada.ca').should('have.attr', 'href', 'https:/www.canada.ca/fr.html')
      })
    })
  })

})
