import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Pools", () => {
  const loginAndGoToPoolsPage = (role = "admin") => {
    cy.loginByRole(role);
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");

    cy.findByRole("paragraph", {
      name: role,
    }).should("not.exist");
  };

  /**
   * Wait for update mutation
   * Check for success toast
   */
  const expectUpdate = () => {
    cy.wait("@gqlupdatePoolAdvertisementMutation")
      .its("response.body.data.updatePoolAdvertisement")
      .should("have.property", "id");
    cy.expectToast(/pool updated successfully/i);
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getEditPoolData");
      aliasQuery(req, "getMePoolCreation");
      aliasQuery(req, "getMePools");
      aliasQuery(req, "allPools");
      aliasMutation(req, "createPoolAdvertisement");
      aliasMutation(req, "updatePoolAdvertisement");
      aliasMutation(req, "publishPoolAdvertisement");
      aliasMutation(req, "closePoolAdvertisement");
      aliasMutation(req, "deletePoolAdvertisement");
    });
  });

  it("Should show login page if user is not logged in", () => {
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", {
      name: /Login using GCKey/i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show non-authorized warning page if user has applicant role", () => {
    cy.loginByRole("applicant");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", {
      name: /Sorry, you are not authorized to view this page./i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show non-authorized warning page if user has request responder role", () => {
    cy.loginByRole("request_responder");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", {
      name: /Sorry, you are not authorized to view this page./i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show teams pools if user has pool operator role", () => {
    loginAndGoToPoolsPage("pool_operator");

    cy.wait("@gqlgetMePoolsQuery");

    cy.findByRole("paragraph", {
      name: /Oh no...\[GraphQL\] This action is unauthorized./,
    }).should("not.exist");
  });

  it("Should show all pools if user has platform admin role", () => {
    loginAndGoToPoolsPage("platform_admin");

    cy.wait("@gqlallPoolsQuery");

    cy.findByRole("paragraph", {
      name: /Oh no...\[GraphQL\] This action is unauthorized./,
    }).should("not.exist");
  });

  it("should create a new pool", () => {
    loginAndGoToPoolsPage();

    cy.findByRole("link", { name: /create pool/i }).click();

    cy.wait("@gqlgetMePoolCreationQuery");

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /create new pool/i })
      .should("exist")
      .and("be.visible");

    // Set starting group/level
    cy.findByRole("combobox", { name: /starting group and level/i })
      .select("IT-01 (Information Technology)")
      .within(() => {
        cy.get("option:selected").should(
          "have.text",
          "IT-01 (Information Technology)",
        );
      });

    // Set team
    cy.findByRole("combobox", { name: /parent team/i })
      .select("Digital Community Management")
      .within(() => {
        cy.get("option:selected").should(
          "have.text",
          "Digital Community Management",
        );
      });

    // Submit form
    cy.findByRole("button", { name: /create new pool/i }).click();
    cy.wait("@gqlcreatePoolAdvertisementMutation");
    cy.expectToast(/pool created successfully/i);

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /edit pool/i })
      .should("exist")
      .and("be.visible");

    // Update the classification field
    cy.findByRole("combobox", { name: /classification/i })
      .select("IT-04 (Information Technology)")
      .within(() => {
        cy.get("option:selected").should(
          "have.text",
          "IT-04 (Information Technology)",
        );
      });

    const title = "Test Pool";
    cy.findByRole("textbox", { name: /specific title \(english\)/i })
      .type(`${title} EN`)
      .should("have.value", `${title} EN`);

    cy.findByRole("textbox", { name: /specific title \(french\)/i })
      .type(`${title} FR`)
      .should("have.value", `${title} FR`);

    // Submit the form
    cy.findByRole("button", { name: /save pool name/i }).click();
    expectUpdate();

    // Update expiry date to some arbitrary date in the future
    cy.findByLabelText(/end date/i)
      .clear()
      .type("2030-01-01");

    cy.findByRole("button", { name: /save closing date/i }).click();
    expectUpdate();

    const langRequirement = "Bilingual intermediate";
    cy.findByRole("combobox", { name: /language requirement/i })
      .select(langRequirement)
      .within(() => {
        cy.get("option:selected").should("have.text", langRequirement);
      });

    const securityRequirement = "Reliability or higher";
    cy.findByRole("combobox", { name: /security requirement/i })
      .select(securityRequirement)
      .within(() => {
        cy.get("option:selected").should("have.text", securityRequirement);
      });

    const publishingGroup = "Other";
    cy.findByRole("combobox", { name: /publishing group/i })
      .select(publishingGroup)
      .within(() => {
        cy.get("option:selected").should("have.text", publishingGroup);
      });

    cy.findByRole("button", { name: /save other requirements/i }).click();
    expectUpdate();
  });

  /**
   * Update the Pool
   */
  it("should update the pool", () => {
    loginAndGoToPoolsPage();

    // Navigate to edit pool page
    cy.findByRole("combobox", { name: /page size/i }).select("Show 50");

    cy.findAllByRole("link", { name: /edit test pool en/i })
      .first()
      .click();

    cy.wait("@gqlgetEditPoolDataQuery");

    // Set a process number
    const processNumber = "process 123";
    cy.findByRole("textbox", { name: /process number/i }).type(processNumber);

    // Submit the form
    cy.findByRole("button", { name: /save pool name/i }).click();
    expectUpdate();

    // Navigate to view pool page
    cy.findByRole("link", { name: /pool information/i }).click();

    // Confirm process number has new value
    cy.findByRole("textbox", { name: /process number/i }).should(
      "have.value",
      processNumber,
    );
  });

  /**
   * Delete the Pool
   */
  it("should delete the pool", () => {
    loginAndGoToPoolsPage();

    // Navigate to edit pool page
    cy.findByRole("combobox", { name: /page size/i }).select("Show 50");

    cy.findAllByRole("link", { name: /edit test pool en/i })
      .first()
      .click();

    cy.wait("@gqlgetEditPoolDataQuery");

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByRole("dialog", { name: /delete/i })
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.findByRole("button", { name: /delete/i }).click();
      });

    cy.wait("@gqldeletePoolAdvertisementMutation");

    cy.expectToast(/pool deleted successfully/i);
  });
});
