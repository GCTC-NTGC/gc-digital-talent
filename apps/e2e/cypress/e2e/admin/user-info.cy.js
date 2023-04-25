import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPoolAdvertisement } from "../../support/poolAdvertisementHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";

describe("User Information Page", () => {
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

  it("tests the behavior of admin user information page with different user roles", () => {
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

            cy.get("@testUser").then((testUser) => {
              addRolesToUser(testUser.id, ["guest", "base_user", "applicant"]);
            });

            // fetch the dcmId for its team from database, needed for pool creation
            let dcmId;
            cy.getDCM().then((dcm) => {
              dcmId = dcm;
              addRolesToUser(adminUserId, ["pool_operator"], dcm);
            });

            // fetch the test team id for its team from database, needed for pool creation
            let newTeamId;
            cy.getNewTeam().then((newTeam) => {
              newTeamId = newTeam;
              addRolesToUser(adminUserId, ["pool_operator"], newTeam);
            });

            // create and publish a new pool advertisement
            cy.get("@testClassification").then((classification) => {
              createAndPublishPoolAdvertisement({
                adminUserId,
                teamId: dcmId,
                englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                classification,
                poolAdvertisementAlias: "dcmPoolAdvertisement",
              });
            });

            // create and publish a new pool advertisement
            cy.get("@testClassification").then((classification) => {
              createAndPublishPoolAdvertisement({
                adminUserId,
                teamId: newTeamId,
                englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                classification,
                poolAdvertisementAlias: "newTeamPoolAdvertisement",
              });
            });
          });
        });
      });

    cy.get("@testUser").then((testUser) => {
      const loginAndVisitTestUser = (role) => {
        cy.loginByRole(`${role}`);
        cy.visit(`/en/admin/users/${testUser.id}`);
        cy.findByRole("heading", {
          name: /Cypress User/i,
        })
          .should("exist")
          .and("be.visible");
      };

      // Visit new test users info page with applicant role.
      cy.loginByRole("applicant");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByRole("heading", {
        name: /Sorry, you are not authorized to view this page./i,
      })
        .should("exist")
        .and("be.visible");

      // Visit new test users info page with pool operator role.
      cy.loginByRole("pool_operator");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByText("Oh no...[GraphQL] This action is unauthorized.")
        .should("exist")
        .and("be.visible");

      // Visit new test users info page with request responder role.
      loginAndVisitTestUser("request_responder");

      // Visit new test users info page with admin role.
      loginAndVisitTestUser("admin");

      // use new test user to submit an application
      cy.loginBySubject(testUser.sub);
      cy.getMe().then((testUser) => {
        cy.get("@dcmPoolAdvertisement").then((poolAdvertisement) => {
          cy.createApplication(testUser.id, poolAdvertisement.id).then(
            (poolCandidate) => {
              cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
                .its("id")
                .as("poolCandidateId");
            },
          );
        });
      });

      // Visit new test users info page with applicant role.
      cy.loginByRole("applicant");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByRole("heading", {
        name: /Sorry, you are not authorized to view this page./i,
      })
        .should("exist")
        .and("be.visible");

      // Visit new test users info page with pool operator role.
      loginAndVisitTestUser("pool_operator");

      // Visit new test users info page with request responder role.
      loginAndVisitTestUser("request_responder");

      // Visit new test users info page with admin role.
      loginAndVisitTestUser("admin");

      // use new test user to submit an application
      cy.loginBySubject(testUser.sub);
      cy.getMe().then((testUser) => {
        cy.get("@newTeamPoolAdvertisement").then((poolAdvertisement) => {
          cy.createApplication(testUser.id, poolAdvertisement.id).then(
            (poolCandidate) => {
              cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
                .its("id")
                .as("poolCandidateId");
            },
          );
        });
      });

      // Visit new test users info page with applicant role.
      cy.loginByRole("applicant");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByRole("heading", {
        name: /Sorry, you are not authorized to view this page./i,
      })
        .should("exist")
        .and("be.visible");

      // Visit new test users info page with pool operator role.
      loginAndVisitTestUser("pool_operator");

      // Visit new test users info page with request responder role.
      loginAndVisitTestUser("request_responder");

      // Visit new test users info page with admin role.
      loginAndVisitTestUser("admin");
    });
  });
});
