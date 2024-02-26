import {
  Classification,
  GenericJobTitle,
  Pool,
  Skill,
  User,
} from "@gc-digital-talent/web/src/api/generated";

import { createAndPublishPool } from "../../support/poolHelpers";
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
      cy.wrap(testGenericJobTitle.classification).as("testClassification");
    });
    // select some dimensions to use for testing
    cy.createTeam({
      name: `new-team-${Date.now().valueOf()}`,
      displayName: {
        en: "New Team (EN)",
        fr: "New Team (FR)",
      },
    }).then((team) => {
      cy.wrap(team.id).as("newTeam"); // take a team for testing that's not attached to the pool operator
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

              // fetch the newTeamId for pool creation
              let newTeamId;
              cy.get<string>("@newTeam").then((newTeam) => {
                newTeamId = newTeam;
                addRolesToUser(adminUserId, ["pool_operator"], newTeam);
              });

              // fetch the dcmId for pool creation
              cy.getDCM().then((dcmId) => {
                // create and publish a new dcm pool
                cy.get<Classification>("@testClassification").then(
                  (classification) => {
                    createAndPublishPool({
                      adminUserId,
                      teamId: dcmId,
                      englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                      classification,
                      poolAlias: "dcmPool",
                    });
                  },
                );
              });

              // create and publish a new newTeam pool
              cy.get<Classification>("@testClassification").then(
                (classification) => {
                  createAndPublishPool({
                    adminUserId,
                    teamId: newTeamId,
                    englishName: `Cypress Test Pool EN ${uniqueTestId}`,
                    classification,
                    poolAlias: "newTeamPool",
                  });
                },
              );
            });
          },
        );
      });

    cy.get<User>("@testUser").then((testUser) => {
      const loginAndVisitTestUser = (role: string) => {
        cy.loginByRole(`${role}`);
        cy.visit(`/en/admin/users/${testUser.id}`);
        cy.findByRole("heading", {
          name: /view user/i,
        })
          .should("exist")
          .and("be.visible");
        cy.findByText(/cypress user/i)
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
      cy.loginBySubject(testUser.authInfo.sub);
      cy.getMe().then((testUser) => {
        cy.get<Pool>("@dcmPool").then((pool) => {
          cy.createApplication(testUser.id, pool.id).then((poolCandidate) => {
            cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
              .its("id")
              .as("poolCandidateId");
          });
        });
      });

      // Submit an application to newTeam pool (NOT connected to pool_operator) with the test user
      cy.loginBySubject(testUser.authInfo.sub);
      cy.getMe().then((testUser) => {
        cy.get<Pool>("@newTeamPool").then((pool) => {
          cy.createApplication(testUser.id, pool.id).then((poolCandidate) => {
            cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
              .its("id")
              .as("poolCandidateId");
          });
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
