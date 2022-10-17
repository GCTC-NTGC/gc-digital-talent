import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolAdvertisementLanguage,
  PoolStream,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  WorkRegion,
} from "../../../admin/src/js/api/generated";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "../../../common/src/helpers/dateUtils";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

const uniqueTestId = Date.now().valueOf();

describe("Submit Application Workflow Tests", () => {
  beforeEach(() => {
    // register queries
    cy.intercept("POST", "/graphql", function (req) {
      aliasQuery(req, "browsePoolAdvertisements");
      aliasQuery(req, "getPoolAdvertisement");
      aliasQuery(req, "getReviewMyApplicationPageData");
      aliasQuery(req, "getApplicationData");
      aliasQuery(req, "MyApplications");

      aliasMutation(req, "createApplication");
      aliasMutation(req, "submitApplication");
    });

    cy.getSkills().then((allSkills) => {
      cy.wrap([allSkills[0].id]).as("testSkillIds"); // take the first ID for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      cy.wrap([allGenericJobTitles[0].id]).as("testGenericJobTitleIds"); // take the first ID for testing
      cy.wrap([allGenericJobTitles[0].classification.id]).as("testClassificationIds"); // take the first ID for testing
    });

    cy.loginByRole("admin").then(() => {
      cy.get("@testGenericJobTitleIds").then((testGenericJobTitleIds) => {
        cy.get("@testSkillIds")
          .then((testSkillIds) => {
            // This user must have the entire profile completed to be able to apply to a pool
            cy.createUser({
              email: `cypress.user.${uniqueTestId}@example.org`,
              sub: `cypress.sub.${uniqueTestId}`,
              roles: ["APPLICANT"],
              currentProvince: ProvinceOrTerritory.Ontario,
              currentCity: "Test City",
              telephone: "+10123456789",
              armedForcesStatus: ArmedForcesStatus.NonCaf,
              citizenship: CitizenshipStatus.Citizen,
              lookingForEnglish: true,
              isGovEmployee: false,
              hasPriorityEntitlement: false,
              locationPreferences: WorkRegion.Ontario,
              wouldAcceptTemporary: false,
              expectedGenericJobTitles: {
                sync: testGenericJobTitleIds,
              },
              personalExperiences: {
                create: [
                  {
                    description: "Test Experience Description",
                    details: "A Cypress test personal experience",
                    skills: {
                      sync: testSkillIds.map((skillId) => {
                        return {
                          details: `Test Skill ${skillId}`,
                          id: skillId,
                        };
                      }),
                    },
                    startDate: FAR_PAST_DATE,
                    title: "Test Experience",
                  },
                ],
              },
            });
          })
          .its("sub")
          .as("testUserSub");
      });
    });

    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get("@testClassificationIds").then((testClassificationIds) => {
          cy.createPoolAdvertisement(adminUserId, testClassificationIds)
            .its("id")
            .as("testPoolAdvertisementId")
            .then((testPoolAdvertisementId) => {
              cy.get("@testSkillIds").then((testSkillIds) => {
                cy.updatePoolAdvertisement(testPoolAdvertisementId, {
                  name: {
                    en: "Cypress Test Pool EN",
                    fr: "Cypress Test Pool FR",
                  },
                  stream: PoolStream.BusinessAdvisoryServices,
                  expiryDate: `${FAR_FUTURE_DATE}T00:00:00+00:00`,
                  yourImpact: { en: "test impact EN", fr: "test impact FR" },
                  keyTasks: { en: "key task EN", fr: "key task FR" },
                  essentialSkills: {
                    sync: testSkillIds,
                  },
                  advertisementLanguage: PoolAdvertisementLanguage.Various,
                  securityClearance: SecurityStatus.Secret,
                  advertisementLocation: {
                    en: "test location EN",
                    fr: "test location FR",
                  },
                  isRemote: true,
                  publishingGroup: PublishingGroup.ItJobs,
                }).then(() => {
                  cy.publishPoolAdvertisement(testPoolAdvertisementId);
                });
              });
            });
        });
      });
  });

  it("Submits an application to a new pool", () => {
    cy.get("@testUserSub").then((sub) => {
      cy.loginBySubject(sub);
    });
    cy.visit("/en/browse/pools");

    // Browse pools page - placeholder so it could change
    cy.wait("@gqlbrowsePoolAdvertisementsQuery");
    cy.findByRole("heading", { name: /browse it jobs/i })
      .should("exist")
      .and("be.visible");
    cy.get("@testPoolAdvertisementId").then((testPoolAdvertisementId) => {
      cy.get(`a[href*="${testPoolAdvertisementId}"]`).click(); // names could be duplicated - choose the one with the right ID in the url
    });

    // Pool advertisement page
    cy.wait("@gqlgetPoolAdvertisementQuery");
    cy.findByRole("heading", { name: /Apply now/i })
      .should("exist")
      .and("be.visible");
    cy.findAllByRole("button", { name: /Apply for this process/i })
      .first()
      .click();
    cy.wait("@gqlcreateApplicationMutation");

    // Review my profile page
    cy.wait("@gqlgetReviewMyApplicationPageDataQuery");
    cy.findByRole("heading", { name: /My application profile/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/There are required fields missing/i).should("not.exist");
    cy.contains(/required skills are missing from your profile/i).should(
      "not.exist",
    );
    cy.findByRole("link", { name: /Continue to step 2/i }).click();

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
    cy.expectToast(/Application submitted successfully/i);
    cy.wait("@gqlMyApplicationsQuery");
    cy.findByRole("heading", { name: /My applications/i })
      .should("exist")
      .and("be.visible");
  });
});
