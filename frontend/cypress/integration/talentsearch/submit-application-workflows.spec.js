import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Submit Workflow Tests", () => {

  beforeEach(() => {
    // reseed database to ensure no existing application
    cy.exec('php ../api/artisan migrate:fresh --seed');

    // register queries
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "browsePools");
      aliasQuery(req, "getPoolAdvertisement")
      aliasQuery(req, "getReviewMyApplicationPageData");
      aliasQuery(req, "getApplicationData");
      aliasQuery(req, "MyApplications");

      aliasMutation(req, "createApplication");
      aliasMutation(req, "submitApplication");
    });

    cy.visit("/en/search");
  });

  it("Submits an application to the CMO pool", () => {
    cy.login("applicant");
    cy.visit("/en/browse/pools");

    // Browse pools page
    cy.wait("@gqlbrowsePoolsQuery");
    cy.findByRole("heading", { name: /Browse Pools/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /CMO Digital Careers/i }).click();

    // Pool advertisement page
    cy.wait("@gqlgetPoolAdvertisementQuery");
    cy.findByRole("heading", { name: /Apply now/i })
      .should("exist")
      .and("be.visible");
    cy.findAllByRole("button", { name: /Apply for this process/i } ).first().click();
    cy.wait("@gqlcreateApplicationMutation");

    // Review my profile page
    cy.wait("@gqlgetReviewMyApplicationPageDataQuery");
    cy.findByRole("heading", { name: /My application profile/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/There are required fields missing/i )
      .should('not.exist');
    cy.contains(/required skills are missing from your profile/i )
      .should('not.exist');
    cy.findByRole("link", {name: /Continue to step 2/i } ).click();

    // Sign and submit page
    cy.wait("@gqlgetApplicationDataQuery");
    cy.findByRole("heading", { name: /My application profile/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("textbox", { name: /Signature/i })
      .clear()
      .type("Test Signature");
    cy.findByRole("button", { name: /Submit my application/i }).click();
    cy.wait("@gqlsubmitApplicationMutation");

    // Confirmation page
    cy.wait("@gqlMyApplicationsQuery");
    cy.expectToast(/Application submitted successfully/i);
    cy.findByRole("heading", { name: /My applications/i })
    .should("exist")
    .and("be.visible");
  });
});
