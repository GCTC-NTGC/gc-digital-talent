import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPoolAdvertisement } from "../../support/poolAdvertisementHelpers";
import { createApplicant } from "../../support/userHelpers";

describe("Pool Candidates", () => {
  const loginAndGoToPoolsPage = () => {
    cy.loginByRole("admin");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "GetPoolCandidateStatus");
      aliasQuery(req, "getPoolCandidateSnapshot");
      aliasQuery(req, "getPools");
      aliasQuery(req, "GetPoolCandidatesPaginated");

      aliasMutation(req, "UpdatePoolCandidateStatus");
    });

    // select some dimensions to use for testing
    cy.getSkills().then((allSkills) => {
      cy.wrap(allSkills[0]).as("testSkill"); // take the first skill for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      const testGenericJobTitle = allGenericJobTitles[0]; // take the first ID for testing matching
      cy.wrap(testGenericJobTitle).as("testGenericJobTitle");
      cy.wrap(testGenericJobTitle.classification).as("testClassification");
    });
  });

  it("should update pool candidate status", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    // create a test user to attach test candidates to
    cy.loginByRole("admin");
    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get("@testGenericJobTitle").then((genericJobTitle) => {
          cy.get("@testSkill").then((skill) => {
            // This user must have the entire profile completed to be able to apply to a pool
            createApplicant({
              email: `cypress.user.${uniqueTestId}@example.org`,
              sub: `cypress.sub.${uniqueTestId}`,
              skill,
              genericJobTitle,
              userAlias: "testUser",
            });

            // fetch the dcmId for its team from database, needed for pool creation
            let dcmId;
            cy.getDCM().then((dcm) => {
              dcmId = dcm;
            })

            // create, update, and publish a new pool advertisement for testing matching
            cy.get("@testClassification").then((classification) => {
              createAndPublishPoolAdvertisement({
                adminUserId,
                teamId: dcmId,
                englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                classification,
                poolAdvertisementAlias: "publishedTestPoolAdvertisement",
              });
            });
          });
        });
      });

    // use new test user to submit an application
    cy.get("@testUser").then((testUser) => {
      cy.loginBySubject(testUser.sub);
      cy.getMe().then((testUser) => {
        cy.get("@publishedTestPoolAdvertisement").then((poolAdvertisement) => {
          cy.createApplication(testUser.id, poolAdvertisement.id).then(
            (poolCandidate) => {
              cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
                .its("id")
                .as("poolCandidateId");
            },
          );
        });
      });
    });

    loginAndGoToPoolsPage();

    cy.wait("@gqlgetPoolsQuery");

    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type("cypress");

    cy.findByRole("link", {name: new RegExp(`View Candidates for Cypress Test Pool EN ${uniqueTestId}`, "i")})
      .should("exist")
      .click();
    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    cy.findAllByRole("button", { name: /availability/i })
      .eq(0)
      .click();
    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    cy.findAllByRole("link", { name: /view application/i })
      .eq(0)
      .click();

    cy.wait("@gqlgetPoolCandidateSnapshotQuery");
    cy.wait("@gqlGetPoolCandidateStatusQuery");

    cy.findByRole("combobox", { name: /candidate pool status/i })
      .select("Screened In")
      .within(() => {
        cy.get("option:selected").should("have.text", "Screened In");
      });

    cy.findByLabelText(/Candidate expiry date/i).type("2023-12-01");

    cy.findByRole("textbox", { name: /notes/i }).clear().type("New Notes");

    cy.findByRole("button", { name: /save changes/i }).click();

    cy.wait("@gqlUpdatePoolCandidateStatusMutation");

    cy.expectToast(/pool candidate status updated successfully/i);
  });

  it("should update pool candidate status with optional fields", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    // create a test user to attach test candidates to
    cy.loginByRole("admin");
    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get("@testGenericJobTitle").then((genericJobTitle) => {
          cy.get("@testSkill").then((skill) => {
            // This user must have the entire profile completed to be able to apply to a pool
            createApplicant({
              email: `cypress.user.${uniqueTestId}@example.org`,
              sub: `cypress.sub.${uniqueTestId}`,
              skill,
              genericJobTitle,
              userAlias: "testUser",
            });

            // fetch the dcmId for its team from database, needed for pool creation
            let dcmId;
            cy.getDCM().then((dcm) => {
              dcmId = dcm;
            })

            // create, update, and publish a new pool advertisement for testing matching
            cy.get("@testClassification").then((classification) => {
              createAndPublishPoolAdvertisement({
                adminUserId,
                teamId: dcmId,
                englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                classification,
                poolAdvertisementAlias: "publishedTestPoolAdvertisement",
              });
            });
          });
        });
      });

    // use new test user to submit an application
    cy.get("@testUser").then((testUser) => {
      cy.loginBySubject(testUser.sub);
      cy.getMe().then((testUser) => {
        cy.get("@publishedTestPoolAdvertisement").then((poolAdvertisement) => {
          cy.createApplication(testUser.id, poolAdvertisement.id).then(
            (poolCandidate) => {
              cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
                .its("id")
                .as("poolCandidateId");
            },
          );
        });
      });
    });

    loginAndGoToPoolsPage();

    cy.wait("@gqlgetPoolsQuery");

    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type("cypress");

    cy.findByRole("link", {name: new RegExp(`View Candidates for Cypress Test Pool EN ${uniqueTestId}`, "i")})
      .should("exist")
      .click();
    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    cy.findAllByRole("button", { name: /availability/i })
      .eq(0)
      .click();
    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    cy.findAllByRole("link", { name: /view application/i })
      .eq(0)
      .click();

    cy.wait("@gqlgetPoolCandidateSnapshotQuery");
    cy.wait("@gqlGetPoolCandidateStatusQuery");

    cy.findByRole("combobox", { name: /candidate pool status/i })
      .select("Screened In")
      .within(() => {
        cy.get("option:selected").should("have.text", "Screened In");
      });

    cy.findByLabelText(/Candidate expiry date/i).clear();

    cy.findByRole("textbox", { name: /notes/i }).clear();

    cy.findByRole("button", { name: /save changes/i }).click();

    cy.wait("@gqlUpdatePoolCandidateStatusMutation");

    cy.expectToast(/pool candidate status updated successfully/i);
  });

});
