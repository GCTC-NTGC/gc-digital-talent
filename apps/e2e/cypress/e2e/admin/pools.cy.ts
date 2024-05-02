import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Pools", () => {
  const loginAndGoToPoolsPage = (role = "admin") => {
    cy.loginByRole(role);
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /processes/i })
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
    cy.wait("@gqlUpdatePoolMutation")
      .its("response.body.data.updatePool")
      .should("have.property", "id");
    cy.expectToast(/process updated successfully/i);
  };

  /** Add a question */
  const addQuestion = (index: number) => {
    cy.findByRole("button", { name: /add a new question/i }).click();

    cy.findByRole("dialog", {
      name: /manage a general question/i,
    }).within(() => {
      cy.findByRole("textbox", { name: /question \(en\)/i }).type(
        `New question ${index} (EN)`,
      );
      cy.findByRole("textbox", { name: /question \(fr\)/i }).type(
        `New question ${index} (FR)`,
      );

      cy.findByRole("button", { name: /save this question/i }).click();
    });
  };

  beforeEach(() => {
    cy.intercept("POST", "**/graphql", (req) => {
      aliasQuery(req, "EditPoolPage");
      aliasQuery(req, "CreatePoolPage");
      aliasQuery(req, "ViewPoolPage");
      aliasQuery(req, "PoolTable");
      aliasMutation(req, "CreatePool");
      aliasMutation(req, "UpdatePool");
      aliasMutation(req, "publishPool");
      aliasMutation(req, "closePool");
      aliasMutation(req, "DeletePool");
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

    cy.wait("@gqlPoolTableQuery");

    cy.findByRole("heading", { name: /processes/i }).should("exist");
    cy.findByRole("table").should("exist");
  });

  it("Should show all pools if user has platform admin role", () => {
    loginAndGoToPoolsPage("platform_admin");

    cy.wait("@gqlPoolTableQuery");

    cy.findByRole("heading", { name: /processes/i }).should("exist");
    cy.findByRole("table").should("exist");
  });

  it("should create a new pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlPoolTableQuery");

    cy.findByRole("link", { name: /create process/i }).click();

    cy.wait("@gqlCreatePoolPageQuery");

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /create process/i })
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
    cy.findByRole("button", { name: /create process/i }).click();
    cy.wait("@gqlCreatePoolMutation");
    cy.expectToast(/process created successfully/i);

    // Ensure we got to the correct page
    cy.findByText("Digital Community Management")
      .should("exist")
      .and("be.visible");

    cy.findByRole("heading", { name: /basic information/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("button", { name: /edit advertisement details/i }).click();

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
    cy.findByRole("textbox", { name: /Job title \(EN\)/i }).type(`${title} EN`);

    cy.findByRole("textbox", { name: /Job title \(EN\)/i }).should(
      "have.value",
      `${title} EN`,
    );

    cy.findByRole("textbox", { name: /Job title \(FR\)/i }).type(`${title} FR`);

    cy.findByRole("textbox", { name: /Job title \(FR\)/i }).should(
      "have.value",
      `${title} FR`,
    );

    const opportunityLength = "Various";
    cy.findByRole("combobox", { name: /length of opportunity/i }).select(
      opportunityLength,
    );
    cy.findByRole("combobox", { name: /length of opportunity/i }).within(() => {
      cy.get("option:selected").should("have.text", opportunityLength);
    });

    const publishingGroup = "Other";
    cy.findByRole("combobox", { name: /publishing group/i }).select(
      publishingGroup,
    );
    cy.findByRole("combobox", { name: /publishing group/i }).within(() => {
      cy.get("option:selected").should("have.text", publishingGroup);
    });

    // Submit the form
    cy.findByRole("button", { name: /save advertisement details/i }).click();
    expectUpdate();

    cy.findByRole("button", { name: /edit closing date/i }).click();

    // Update expiry date to some arbitrary date in the future
    cy.findByRole("group", { name: /end date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).clear();
      cy.findAllByRole("spinbutton", { name: /year/i }).type("2030");
      cy.findAllByRole("combobox", { name: /month/i }).select("01");
      cy.findAllByRole("spinbutton", { name: /day/i }).clear();
      cy.findAllByRole("spinbutton", { name: /day/i }).type("01");
    });

    cy.findByRole("button", { name: /save closing date/i }).click();
    expectUpdate();

    cy.findByRole("button", { name: /edit core requirements/i }).click();

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

    cy.findByRole("button", { name: /save core requirements/i }).click();
    expectUpdate();

    // Add first question
    addQuestion(1);
    expectUpdate();

    addQuestion(2);
    expectUpdate();
  });

  /**
   * Update the Pool
   */
  it("should update the pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlPoolTableQuery");

    // Navigate to edit pool page
    cy.findByRole("button", { name: /show 10/i }).click();
    cy.get("[role=menuitemradio]").contains(/50/i).click();

    cy.findAllByRole("link", { name: /test pool en/i })
      .first()
      .click();

    cy.findByRole("link", { name: /edit advertisement/i }).click();

    cy.wait("@gqlEditPoolPageQuery");

    cy.findByRole("button", { name: /edit advertisement details/i }).click();

    // Set a process number
    const processNumber = "process 123";
    cy.findByRole("textbox", { name: /process number/i }).type(processNumber);

    const title = "New test pool";
    cy.findByRole("textbox", { name: /job title \(EN\)/i }).clear();
    cy.findByRole("textbox", { name: /job title \(EN\)/i }).type(`${title} EN`);

    // Submit the form
    cy.findByRole("button", { name: /save advertisement details/i }).click();
    expectUpdate();

    // Move questions
    cy.findByRole("button", { name: /change order from 2 to 1/i }).click();
    expectUpdate();

    // Delete a question
    cy.findByRole("button", { name: /remove item 1/i }).click();
    expectUpdate();

    // Navigate to view pool page
    cy.findAllByRole("link", { name: /test pool en/i })
      .first()
      .click();
  });

  /**
   * Delete the Pool
   */
  it("should delete the pool", () => {
    loginAndGoToPoolsPage();

    cy.wait("@gqlPoolTableQuery");

    // Navigate to edit pool page
    cy.findByRole("button", { name: /show 10/i }).click();
    cy.get("[role=menuitemradio]").contains(/50/i).click();

    cy.findAllByRole("link", { name: /new test pool en/i })
      .first()
      .click();

    cy.wait("@gqlViewPoolPageQuery");

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByRole("dialog", { name: /delete/i })
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.findByRole("button", { name: /delete/i }).click();
      });

    cy.wait("@gqlDeletePoolMutation");

    cy.expectToast(/process deleted successfully/i);
  });
});
