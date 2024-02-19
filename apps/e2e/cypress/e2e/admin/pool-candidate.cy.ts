import {
  Classification,
  GenericJobTitle,
  Pool,
  Skill,
  User,
} from "@gc-digital-talent/web/src/api/generated";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPool } from "../../support/poolHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";

describe("Pool Candidates", () => {
  const loginAndGoToPoolsPage = () => {
    cy.loginByRole("admin");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /processes/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");
  };

  beforeEach(() => {
    cy.overrideFeatureFlags({ FEATURE_RECORD_OF_DECISION: false });
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "ViewPoolCandidatesPage");
      aliasQuery(req, "PoolTable");
      aliasQuery(req, "CandidatesTableCandidatesPaginated_Query");

      aliasMutation(req, "ApplicationStatusForm_Mutation");
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
        cy.get<GenericJobTitle>("@testGenericJobTitle").then(
          (genericJobTitle) => {
            cy.get<Skill>("@testSkill").then((skill) => {
              // This user must have the entire profile completed to be able to apply to a pool
              createApplicant({
                email: `cypress.user.${uniqueTestId}@example.org`,
                sub: `cypress.sub.${uniqueTestId}`,
                skill,
                genericJobTitle,
                userAlias: "testUser",
              });

              cy.get<User>("@testUser").then((testUser) => {
                addRolesToUser(testUser.id, [
                  "guest",
                  "base_user",
                  "applicant",
                ]);
              });

              // fetch the dcmId for its team from database, needed for pool creation
              cy.getDCM().then((dcmId) => {
                // create, update, and publish a new pool for testing matching
                cy.get<Classification>("@testClassification").then(
                  (classification) => {
                    createAndPublishPool({
                      adminUserId,
                      teamId: dcmId,
                      englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                      classification,
                      poolAlias: "publishedTestPool",
                    });
                  },
                );
              });
            });
          },
        );
      });

    // use new test user to submit an application
    cy.get<User>("@testUser").then((testUser) => {
      cy.loginBySubject(testUser.authInfo.sub);
      cy.getMe().then((testUser) => {
        cy.get<Pool>("@publishedTestPool").then((pool) => {
          cy.createApplication(testUser.id, pool.id).then((poolCandidate) => {
            cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
              .its("id")
              .as("poolCandidateId");
          });
        });
      });
    });

    loginAndGoToPoolsPage();

    cy.wait("@gqlPoolTableQuery");

    cy.findByRole("textbox", { name: /search/i }).type("cypress");

    cy.findByRole("link", {
      name: new RegExp(
        `View Candidates for I T 1: Cypress Test Pool EN ${uniqueTestId}`,
        "i",
      ),
    })
      .should("exist")
      .click();
    cy.wait("@gqlCandidatesTableCandidatesPaginated_QueryQuery");

    cy.findAllByRole("link", { name: /view(.+)application/i })
      .eq(0)
      .click();

    cy.wait("@gqlViewPoolCandidatesPageQuery");

    cy.findByRole("combobox", { name: /candidate pool status/i }).select(
      "Screened In",
    );
    cy.findByRole("combobox", { name: /candidate pool status/i }).within(() => {
      cy.get("option:selected").should("have.text", "Screened In");
    });

    cy.findByRole("group", { name: /candidate expiry date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).clear();
      cy.findAllByRole("spinbutton", { name: /year/i }).type("2023");
      cy.findAllByRole("combobox", { name: /month/i }).select("12");
      cy.findAllByRole("spinbutton", { name: /day/i }).clear();
      cy.findAllByRole("spinbutton", { name: /day/i }).type("01");
    });

    cy.findByRole("textbox", { name: /notes/i }).type("New Notes");

    cy.findByRole("button", { name: /save changes/i }).click();

    cy.wait("@gqlApplicationStatusForm_MutationMutation");

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
        cy.get<GenericJobTitle>("@testGenericJobTitle").then(
          (genericJobTitle) => {
            cy.get<Skill>("@testSkill").then((skill) => {
              // This user must have the entire profile completed to be able to apply to a pool
              createApplicant({
                email: `cypress.user.${uniqueTestId}@example.org`,
                sub: `cypress.sub.${uniqueTestId}`,
                skill,
                genericJobTitle,
                userAlias: "testUser",
              });

              cy.get<User>("@testUser").then((testUser) => {
                addRolesToUser(testUser.id, [
                  "guest",
                  "base_user",
                  "applicant",
                ]);
              });

              // fetch the dcmId for its team from database, needed for pool creation
              cy.getDCM().then((dcmId) => {
                // create, update, and publish a new pool for testing matching
                cy.get<Classification>("@testClassification").then(
                  (classification) => {
                    createAndPublishPool({
                      adminUserId,
                      teamId: dcmId,
                      englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                      classification,
                      poolAlias: "publishedTestPool",
                    });
                  },
                );
              });
            });
          },
        );
      });

    // use new test user to submit an application
    cy.get<User>("@testUser").then((testUser) => {
      cy.loginBySubject(testUser.authInfo.sub);
      cy.getMe().then((testUser) => {
        cy.get<Pool>("@publishedTestPool").then((pool) => {
          cy.createApplication(testUser.id, pool.id).then((poolCandidate) => {
            cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
              .its("id")
              .as("poolCandidateId");
          });
        });
      });
    });

    loginAndGoToPoolsPage();

    cy.wait("@gqlPoolTableQuery");

    cy.findByRole("textbox", { name: /search/i }).type("cypress");

    cy.findByRole("link", {
      name: new RegExp(
        `View Candidates for I T 1: Cypress Test Pool EN ${uniqueTestId}`,
        "i",
      ),
    })
      .should("exist")
      .click();
    cy.wait("@gqlCandidatesTableCandidatesPaginated_QueryQuery");

    cy.findAllByRole("link", { name: /view(.+)application/i })
      .eq(0)
      .click();

    cy.wait("@gqlViewPoolCandidatesPageQuery");

    cy.findByRole("combobox", { name: /candidate pool status/i }).select(
      "Screened In",
    );
    cy.findByRole("combobox", { name: /candidate pool status/i }).within(() => {
      cy.get("option:selected").should("have.text", "Screened In");
    });

    cy.findByRole("group", { name: /candidate expiry date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).clear();
      cy.findAllByRole("combobox", { name: /month/i }).select("");
      cy.findAllByRole("spinbutton", { name: /day/i }).clear();
    });

    cy.findByRole("textbox", { name: /notes/i }).clear();

    cy.findByRole("button", { name: /save changes/i }).click();

    cy.wait("@gqlApplicationStatusForm_MutationMutation");

    cy.expectToast(/pool candidate status updated successfully/i);
  });
});
