import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPoolAdvertisement } from "../../support/poolAdvertisementHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";
import { createSearchRequest } from "../../support/searchRequestHelpers";
import { PoolCandidateStatus } from "@gc-digital-talent/web/src/api/generated";

describe("User Info Tests", () => {
  const initialSetup = (uniqueTestId) => {
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

            cy.get("@testUser").then((testUser) => {
              addRolesToUser(testUser.id, ["guest", "base_user", "applicant"]);
            });

            // fetch the dcmId for its team from database, needed for pool creation
            let dcmId;
            cy.getDCM().then((dcm) => {
              dcmId = dcm;
              addRolesToUser(adminUserId, ["pool_operator"], dcm);
            });

            // create, update, and publish a new pool advertisement for testing rejection
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

    // Create a search request for new test user
    cy.loginByRole("admin");
    cy.get("@publishedTestPoolAdvertisement").then((poolAdvertisement) => {
      cy.get("@testClassification").then((classification) => {
        cy.get("@testDepartment").then((department) => {
          createSearchRequest({
            departmentId: department.id,
            classificationId: classification.id,
            poolId: poolAdvertisement.id,
            searchRequestAlias: "testSearchRequest",
          });
        });
      });
    });

    // Change test users pool candidate status to qualified available
    cy.get("@poolCandidateId").then((poolCandidateId) => {
      cy.updatePoolCandidateAsAdmin(poolCandidateId, {
        status: PoolCandidateStatus.QualifiedAvailable,
      });
    });
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getMePools");
      aliasQuery(req, "allPools");
      aliasQuery(req, "GetPoolCandidatesPaginated");
      aliasQuery(req, "getPoolCandidateSearchRequests");
      aliasMutation(req, "UpdatePoolCandidateStatus");
      aliasMutation(req, "createPoolCandidateSearchRequest");
    });

    // select some dimensions to use for testing
    cy.getSkills().then((allSkills) => {
      cy.wrap(allSkills[0]).as("testSkill"); // take the first skill for testing
    });
    cy.getDepartments().then((allDepartments) => {
      cy.wrap(allDepartments[0]).as("testDepartment"); // take the first department for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      const testGenericJobTitle = allGenericJobTitles[0]; // take the first ID for testing matching
      cy.wrap(testGenericJobTitle).as("testGenericJobTitle");
      cy.wrap(testGenericJobTitle.classification).as("testClassification");
    });
  });

  it("Should show non-authorized warning page if user has applicant role", () => {
    cy.loginByRole("applicant");
    cy.visit("/en/admin");

    cy.findByRole("heading", {
      name: /Sorry, you are not authorized to view this page./i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show the pool operator a candidate's user information page on their team", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    initialSetup(uniqueTestId);

    // Log in as a pool operator that is part of the DCM team.
    cy.loginByRole("pool_operator");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");

    cy.wait("@gqlgetMePoolsQuery");

    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type("cypress");

    cy.findByRole("link", {
      name: new RegExp(
        `View Candidates for Cypress Test Pool EN ${uniqueTestId}`,
        "i",
      ),
    })
      .should("exist")
      .click();

    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    // Go to the test user's info page
    cy.findAllByRole("link", { name: /view profile/i })
      .eq(0)
      .click();

    cy.findByRole("heading", {
      name: /View User/i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show the request responder any candidate's user information page", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    initialSetup(uniqueTestId);

    // Log in as a request responder that is part of the DCM team.
    cy.loginByRole("request_responder");
    cy.visit("/en/admin/talent-requests");

    cy.findByRole("heading", { name: /all requests/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/talent-requests");

    cy.wait("@gqlgetPoolCandidateSearchRequestsQuery");

    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type("cypress");

    cy.findAllByRole("link", {
      name: /view request cypress test/i,
    })
      .eq(0)
      .click();

    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    // Go to the test user's info page
    cy.findAllByRole("link", { name: /view profile/i })
      .eq(0)
      .click();

    cy.findByRole("heading", {
      name: /View User/i,
    })
      .should("exist")
      .and("be.visible");
  });

  it("Should show the admin any candidate's user information page", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    initialSetup(uniqueTestId);

    // Log in as a pool operator that is part of the DCM team.
    cy.loginByRole("admin");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");

    cy.wait("@gqlallPoolsQuery");

    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type("cypress");

    cy.findByRole("link", {
      name: new RegExp(
        `View Candidates for Cypress Test Pool EN ${uniqueTestId}`,
        "i",
      ),
    })
      .should("exist")
      .click();

    cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

    // Go to the test user's info page
    cy.findAllByRole("link", { name: /view profile/i })
      .eq(0)
      .click();

    cy.findByRole("heading", {
      name: /View User/i,
    })
      .should("exist")
      .and("be.visible");
  });
});
