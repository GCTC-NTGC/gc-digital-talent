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
    cy.wait("@gqlupdatePoolMutation")
      .its("response.body.data.updatePool")
      .should("have.property", "id");
    cy.expectToast(/pool updated successfully/i);
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getEditPoolData");
      aliasQuery(req, "getMePoolCreation");
      aliasQuery(req, "GetProcessInfo");
      aliasQuery(req, "allPools");
      aliasMutation(req, "createPool");
      aliasMutation(req, "updatePool");
      aliasMutation(req, "publishPool");
      aliasMutation(req, "closePool");
      aliasMutation(req, "deletePool");
    });
  });

  it("Should show login page if user is not logged in", () => {
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", {
      name: /Sign in using GCKey/i,
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

    cy.wait("@gqlallPoolsQuery");

    cy.findByRole("heading", { name: /pools/i }).should("exist");
    cy.findByRole("table").should("exist");
  });

  it("Should show all pools if user has platform admin role", () => {
    loginAndGoToPoolsPage("platform_admin");

    cy.wait("@gqlallPoolsQuery");

    cy.findByRole("heading", { name: /pools/i }).should("exist");
    cy.findByRole("table").should("exist");
  });

  it("should create a new pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlallPoolsQuery");

    cy.findByRole("link", { name: /create pool/i }).click();

    cy.wait("@gqlgetMePoolCreationQuery");

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /create new pool/i })
      .should("exist")
      .and("be.visible");

    // Set starting group/level
    cy.findByRole("combobox", { name: /starting group and level/i }).select(
      "IT-01 (Information Technology)",
    );
    cy.findByRole("combobox", { name: /starting group and level/i }).within(
      () => {
        cy.get("option:selected").should(
          "have.text",
          "IT-01 (Information Technology)",
        );
      },
    );

    // Set team
    cy.findByRole("combobox", { name: /parent team/i }).select(
      "Digital Community Management",
    );
    cy.findByRole("combobox", { name: /parent team/i }).within(() => {
      cy.get("option:selected").should(
        "have.text",
        "Digital Community Management",
      );
    });

    // Submit form
    cy.findByRole("button", { name: /create new pool/i }).click();
    cy.wait("@gqlcreatePoolMutation");
    cy.expectToast(/pool created successfully/i);

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /advertisement information/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("button", { name: /edit pool name/i }).click();

    // Update the classification field
    cy.findByRole("combobox", { name: /classification/i }).select(
      "IT-04 (Information Technology)",
    );

    cy.findByRole("combobox", { name: /classification/i }).within(() => {
      cy.get("option:selected").should(
        "have.text",
        "IT-04 (Information Technology)",
      );
    });

    const title = "Test Pool";
    cy.findByRole("textbox", { name: /specific title \(english\)/i }).type(
      `${title} EN`,
    );

    cy.findByRole("textbox", { name: /specific title \(english\)/i }).should(
      "have.value",
      `${title} EN`,
    );

    cy.findByRole("textbox", { name: /specific title \(french\)/i }).type(
      `${title} FR`,
    );

    cy.findByRole("textbox", { name: /specific title \(french\)/i }).should(
      "have.value",
      `${title} FR`,
    );

    const publishingGroup = "Other";
    cy.findByRole("combobox", { name: /publishing group/i }).select(
      publishingGroup,
    );
    cy.findByRole("combobox", { name: /publishing group/i }).within(() => {
      cy.get("option:selected").should("have.text", publishingGroup);
    });

    // Submit the form
    cy.findByRole("button", { name: /save pool name/i }).click();
    expectUpdate();

    cy.findByRole("button", { name: /edit closing date/i }).click();

    // Update expiry date to some arbitrary date in the future
    cy.findByRole("group", { name: /end date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).clear()
      cy.findAllByRole("spinbutton", { name: /year/i }).type("2030");
      cy.findAllByRole("combobox", { name: /month/i }).select("01");
      cy.findAllByRole("spinbutton", { name: /day/i }).clear();
      cy.findAllByRole("spinbutton", { name: /day/i }).type("01");
    });

    cy.findByRole("button", { name: /save closing date/i }).click();
    expectUpdate();

    cy.findByRole("button", { name: /edit other requirements/i }).click();

    const langRequirement = "Bilingual intermediate";
    cy.findByRole("combobox", { name: /language requirement/i }).select(
      langRequirement,
    );
    cy.findByRole("combobox", { name: /language requirement/i }).within(() => {
      cy.get("option:selected").should("have.text", langRequirement);
    });

    const securityRequirement = "Reliability or higher";
    cy.findByRole("combobox", { name: /security requirement/i }).select(
      securityRequirement,
    );
    cy.findByRole("combobox", { name: /security requirement/i }).within(() => {
      cy.get("option:selected").should("have.text", securityRequirement);
    });

    cy.findByRole("button", { name: /save other requirements/i }).click();
    expectUpdate();
  });

  /**
   * Update the Pool
   */
  it("should update the pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlallPoolsQuery");

    // Navigate to edit pool page
    cy.findByRole("button", { name: /show 10/i }).click();
    cy.get("[role=menuitemradio]").contains(/50/i).click();

    cy.findAllByRole("link", { name: /edit test pool en/i })
      .first()
      .click();

    cy.wait("@gqlgetEditPoolDataQuery");

    cy.findByRole("button", { name: /edit pool name/i }).click()

    // Set a process number
    const processNumber = "process 123";
    cy.findByRole("textbox", { name: /process number/i }).type(processNumber);

    const title = "New test pool";
    cy.findByRole("textbox", { name: /specific title \(english\)/i })
      .clear();
    cy.findByRole("textbox", { name: /specific title \(english\)/i })
      .type(`${title} EN`);

    // Submit the form
    cy.findByRole("button", { name: /save pool name/i }).click();
    expectUpdate();

    // Navigate to view pool page
    cy.findAllByRole("link", { name: /Process information/i }).first().click();

    // Confirm process number has new value
    cy.findByRole("heading", { name: /new test pool/i });
  });

  /**
   * Delete the Pool
   */
  it("should delete the pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlallPoolsQuery");

    // Navigate to edit pool page
    cy.findByRole("button", { name: /show 10/i }).click();
    cy.get("[role=menuitemradio]").contains(/50/i).click();

    cy.findAllByRole("link", { name: /new test pool en/i })
      .first()
      .click();

    cy.wait("@gqlGetProcessInfoQuery");

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByRole("dialog", { name: /delete/i })
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.findByRole("button", { name: /delete/i }).click();
      });

    cy.wait("@gqldeletePoolMutation");

    cy.expectToast(/pool deleted successfully/i);
  });
});
