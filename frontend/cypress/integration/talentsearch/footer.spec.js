describe('Footer', () => {
  const testPage = '/talent'

  context('English page', () => {
    beforeEach(() => {
      cy.setLocale('en')
      cy.visit(testPage)
    })

    it('links to Privacy Policy', () => {
      // This is the aria role for "footer".
      cy.findByRole('contentinfo').within(() => {
        // TODO: Update all these tests to use cy.findByRole().
        // See: https://github.com/GCTC-NTGC/gc-digital-talent/issues/2902
        //cy.findByRole('link', { name: 'Privacy Policy' }).should('have.attr', 'href', '/en/privacy-notice')
        cy.findByText('Privacy Policy').should('have.attr', 'href', '/en/privacy-notice')
      })
    })

    it('links to Terms & Conditions', () => {
      cy.findByRole('contentinfo').within(() => {
        cy.findByText('Terms & Conditions').should('have.attr', 'href', '/en/terms-and-conditions')
      })
    })

    it('links to Canada.ca', () => {
      cy.findByRole('contentinfo').within(() => {
        cy.findByText('Canada.ca').should('have.attr', 'href', 'https://www.canada.ca/en.html')
      })
    })
  })

  context('French page', () => {
    beforeEach(() => {
      cy.setLocale('fr')
      cy.visit(testPage)
    })

    it('links to Privacy Policy (french)', () => {
      cy.findByRole('contentinfo').within(() => {
        cy.findByText('Modalités').should('have.attr', 'href', '/fr/terms-and-conditions')
      })
    })

    it('links to Canada.ca (french)', () => {
      cy.findByRole('contentinfo').within(() => {
        cy.findByText('canada.ca').should('have.attr', 'href', 'https://www.canada.ca/fr.html')
      })
    })
  })

})
