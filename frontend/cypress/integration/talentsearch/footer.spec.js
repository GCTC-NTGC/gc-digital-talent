describe('Footer', () => {
  const testPage = '/talent'

  context('English page', () => {
    beforeEach(() => {
      cy.setLocale('en')
      cy.visit(testPage)
    })

    it('links to Privacy Policy', () => {
      // TODO: Update to use cy.findByRole().
      cy.get('footer').within(() => {
        cy.get('a').contains('Privacy Policy').should('have.attr', 'href', '/en/privacy-notice')
      })
    })

    it('links to Terms & Conditions', () => {
      // TODO: Update to use cy.findByRole().
      cy.get('footer').within(() => {
        cy.get('a').contains('Terms & Conditions').should('have.attr', 'href', '/en/terms-and-conditions')
      })
    })

    it('links to Canada.ca', () => {
      // TODO: Update to use cy.findByRole().
      cy.get('footer').within(() => {
        cy.get('a').contains('Canada.ca').should('have.attr', 'href', 'https://www.canada.ca/en.html')
      })
    })
  })

  context('French page', () => {
    beforeEach(() => {
      cy.setLocale('fr')
      cy.visit(testPage)
    })

    it('links to Privacy Policy (french)', () => {
      // TODO: Update to use cy.findByRole().
      cy.get('footer').within(() => {
        cy.get('a').contains('Modalités').should('have.attr', 'href', '/fr/terms-and-conditions')
      })
    })

    it('links to Canada.ca (french)', () => {
      // TODO: Update to use cy.findByRole().
      cy.get('footer').within(() => {
        cy.get('a').contains('canada.ca').should('have.attr', 'href', 'https://www.canada.ca/fr.html')
      })
    })
  })

})
