import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import {
  // createAndPublishPoolAdvertisement,
  createAndPublishPoolAdvertisement2,
} from "../../support/poolAdvertisementHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";

describe("User Information Page", () => {
  beforeEach(() => {
    cy.loginByRole("admin");

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
      // cy.wrap(testGenericJobTitle.classification).as("testClassification");
    });
    // select some dimensions to use for testing
    cy.getTeams().then((allTeams) => {
      cy.wrap(
        allTeams.filter(
          (team) =>
            team.name !== "test-team" ||
            team.name !== "digital-community-management",
        )[0].id,
      ).as("newTeam"); // take a team for testing that's not attached to the pool operator
    });
  });

  it("tests the behavior of admin user information page with different user roles", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    // create a new test user then create pool candidates with new user
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

            // create and publish a new dcm pool advertisement
            // cy.get("@testClassification").then((classification) => {
            // fetch the dcmId for pool creation
            cy.getDCM().then((dcmId) => {
              addRolesToUser(adminUserId, ["pool_operator"], dcmId);

              createAndPublishPoolAdvertisement2({
                // userId: adminUserId,
                teamId: dcmId,
                name: `Cypress Test Pool ${uniqueTestId} dcmPoolAdvertisement`,
                // classification,
                poolAdvertisementAlias: "dcmPoolAdvertisement",
              });
            });
            // });

            // create and publish a new newTeam pool advertisement
            // cy.get("@testClassification").then((classification) => {
            // fetch the newTeamId for pool creation
            cy.get("@newTeam").then((newTeamId) => {
              addRolesToUser(adminUserId, ["pool_operator"], newTeamId);

              createAndPublishPoolAdvertisement2({
                // userId: adminUserId,
                teamId: newTeamId,
                name: `Cypress Test Pool ${uniqueTestId} newTeamPoolAdvertisement`,
                // classification,
                poolAdvertisementAlias: "newTeamPoolAdvertisement",
              });
            });
            // });
          });
        });
      });

    cy.get("@testUser").then((testUser) => {
      const loginAndVisitTestUser = (role) => {
        cy.log(role);
        cy.loginByRole(`${role}`);
        cy.visit(`/en/admin/users/${testUser.id}`);
        cy.findByRole("heading", {
          name: /Cypress User/i,
        })
          .should("exist")
          .and("be.visible");
      };

      /* TEST VIEWING NEW USER WITH NO APPLICATIONS */

      // Should fail visiting test users info page with applicant role.
      cy.loginByRole("applicant");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByRole("heading", {
        name: /Sorry, you are not authorized to view this page./i,
      })
        .should("exist")
        .and("be.visible");

      // Should fail visiting test users info page with pool operator role.
      cy.loginByRole("pool_operator");
      cy.visit(`/en/admin/users/${testUser.id}`);
      cy.findByText("Oh no...[GraphQL] This action is unauthorized.")
        .should("exist")
        .and("be.visible");

      // Should pass visiting test users info page with request responder role.
      loginAndVisitTestUser("request_responder");

      // Should pass visiting test users info page with admin role.
      loginAndVisitTestUser("admin");

      /* TEST VIEWING NEW USER WITH APPLICATIONS */
      // Submit an application to DCM pool (connected to pool_operator) with the test user
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
      // Submit an application to newTeam pool (NOT connected to pool_operator) with the test user
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

      // Should pass visiting test users info page with pool operator role.
      loginAndVisitTestUser("pool_operator");

      // Should pass visiting test users info page with request responder role.
      loginAndVisitTestUser("request_responder");

      // Should pass visiting test users info page with admin role.
      loginAndVisitTestUser("admin");
    });
  });
});
