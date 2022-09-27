import { aliasQuery } from "../../support/graphql-test-utils";

describe("Talentsearch Direct Intake Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getPoolAdvertisement");
    });
  });
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
  }

  context('Anonymous visitor', () => {
    it('redirects restricted pages to login', () => {
      [
        '/en/browse/pools',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        onAuthLoginPage()
      })

    })
  })

  context('logged in but no applicant role', () => {
    beforeEach(() => cy.loginByRole('noroles'))

    it('displays not authorized', () => {
      [
        '/en/browse/pools',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        cy.contains('not authorized');
      })

    })
  })

  context('logged in as applicant', () => {
    beforeEach(() => cy.loginByRole('applicant'))

    it("allows an applicant to apply to a pool", () => {
      cy.visit('/en/browse/pools')
      cy.contains("Browse Pools")

      cy.findByRole('link', { name: 'CMO Digital Careers' })
        .should('exist').and('be.visible')
        .click()

      cy.wait("@gqlgetPoolAdvertisementQuery");

      cy.findAllByRole('button', { name: /Apply for this process/i })
        .should('exist')
        .and('be.visible')
        .click({multiple: true});

      // TODO: need to fill this out once it is possible to apply a pool in the app
    });
  })

  context('logged in with no email', () => {
    beforeEach(() => cy.loginByRole('noemail'));

    it("redirects to create account", () => {
      cy.visit('/en/browse/pools');

      cy.location('pathname').should('eq', '/en/create-account');
      cy.contains("successfully logged in");
    });
  })

});
