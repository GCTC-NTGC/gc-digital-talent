import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolAdvertisementLanguage,
  PoolStream,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  WorkRegion,
} from "../../../talentsearch/src/js/api/generated";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "../../../common/src/helpers/dateUtils";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { __Directive } from "graphql";
import {
  JobLookingStatus,
  Language,
  LanguageAbility,
  OperationalRequirement,
  PoolCandidateStatus,
  PositionDuration,
  Role,
} from "../../../common/src/api/generated";

const uniqueTestId = Date.now().valueOf();

describe("Talent Search Workflow Tests", () => {
  beforeEach(() => {
    cy.log(`Test run ${uniqueTestId}`);

    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "CountApplicantsAndCountPoolCandidatesByPool");
      aliasQuery(req, "getPoolCandidateSearchRequestData");
      aliasMutation(req, "createPoolCandidateSearchRequest");
    });

    // select some dimensions to use for testing
    cy.getSkills().then((allSkills) => {
      cy.wrap(allSkills[0]).as("testSkill"); // take the first ID for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      const testGenericJobTitle1 = allGenericJobTitles[0]; // take the first ID for testing
      const testGenericJobTitle2 = allGenericJobTitles[1]; // take the second ID for negation
      cy.wrap(testGenericJobTitle1.id).as("testGenericJobTitleId1");
      cy.wrap(testGenericJobTitle2.id).as("testGenericJobTitleId2");
      const testClassification1 = testGenericJobTitle1.classification;
      const testClassification2 = testGenericJobTitle2.classification;
      cy.wrap(testClassification1.id).as("testClassificationId1");
      cy.wrap(testClassification2.id).as("testClassificationId2");
      cy.wrap(
        `${testClassification1.group}-${testClassification1.level
          .toString()
          .padStart(2, "0")}`,
      ).as("testClassificationName1");
      cy.wrap(
        `${testClassification2.group}-${testClassification2.level
          .toString()
          .padStart(2, "0")}`,
      ).as("testClassificationName2");
    });

    // create a test user to attach test candidates to
    cy.loginByRole("admin").then(() => {
      cy.getMe()
        .its("id")
        .then((adminUserId) => {
          cy.get("@testGenericJobTitleId1").then((genericJobTitleId1) => {
            cy.get("@testSkill").then((skill) => {
              // This user must have the entire profile completed to be able to apply to a pool
              cy.createUser({
                email: `cypress.user.${uniqueTestId}@example.org`,
                sub: `cypress.sub.${uniqueTestId}`,
                roles: [Role.Applicant],
                currentProvince: ProvinceOrTerritory.Ontario,
                currentCity: "Test City",
                telephone: "+10123456789",
                armedForcesStatus: ArmedForcesStatus.NonCaf,
                citizenship: CitizenshipStatus.Citizen,
                lookingForEnglish: true,
                languageAbility: LanguageAbility.English,
                isGovEmployee: false,
                isWoman: true,
                hasPriorityEntitlement: false,
                jobLookingStatus: JobLookingStatus.ActivelyLooking,
                hasDiploma: true,
                locationPreferences: WorkRegion.Ontario,
                acceptedOperationalRequirements: [
                  OperationalRequirement.OvertimeOccasional,
                ],
                positionDuration: [PositionDuration.Permanent],
                expectedGenericJobTitles: {
                  sync: [genericJobTitleId1],
                },
                personalExperiences: {
                  create: [
                    {
                      description: "Test Experience Description",
                      details: "A Cypress test personal experience",
                      skills: {
                        sync: [
                          {
                            details: `Test Skill ${skill.name.en}`,
                            id: skill.id,
                          },
                        ],
                      },
                      startDate: FAR_PAST_DATE,
                      title: "Test Experience",
                    },
                  ],
                },
              })
                .its("sub")
                .as("testUserSub");

              // create, update, and publish a new pool advertisement
              cy.get("@testClassificationId1").then((classificationId) => {
                cy.createPoolAdvertisement(adminUserId, [
                  classificationId,
                ]).then((createdPoolAdvertisement) => {
                  cy.get("@testSkill").then((skill) => {
                    cy.log(skill);
                    cy.updatePoolAdvertisement(createdPoolAdvertisement.id, {
                      name: {
                        en: `Cypress Test Pool EN 1 ${uniqueTestId}`,
                        fr: `Cypress Test Pool FR 1 ${uniqueTestId}`,
                      },
                      stream: PoolStream.BusinessAdvisoryServices,
                      expiryDate: `${FAR_FUTURE_DATE} 00:00:00`,
                      yourImpact: {
                        en: "test impact EN",
                        fr: "test impact FR",
                      },
                      keyTasks: { en: "key task EN", fr: "key task FR" },
                      essentialSkills: {
                        sync: skill.id,
                      },
                      advertisementLanguage: PoolAdvertisementLanguage.Various,
                      securityClearance: SecurityStatus.Secret,
                      advertisementLocation: {
                        en: "test location EN",
                        fr: "test location FR",
                      },
                      isRemote: true,
                      publishingGroup: PublishingGroup.ItJobs,
                    }).then((updatedPoolAdvertisement) => {
                      cy.publishPoolAdvertisement(updatedPoolAdvertisement.id)
                        .its("id")
                        .as("publishedTestPoolAdvertisementId1");
                    });
                  });
                });
              });

              // create, update, and publish a new pool advertisement for negation
              cy.get("@testClassificationId2").then((classificationId) => {
                cy.createPoolAdvertisement(adminUserId, [
                  classificationId,
                ]).then((createdPoolAdvertisement) => {
                  cy.get("@testSkill").then((skill) => {
                    cy.log(skill);
                    cy.updatePoolAdvertisement(createdPoolAdvertisement.id, {
                      name: {
                        en: `Cypress Test Pool EN 2 ${uniqueTestId}`,
                        fr: `Cypress Test Pool FR 2 ${uniqueTestId}`,
                      },
                      stream: PoolStream.BusinessAdvisoryServices,
                      expiryDate: `${FAR_FUTURE_DATE} 00:00:00`,
                      yourImpact: {
                        en: "test impact EN",
                        fr: "test impact FR",
                      },
                      keyTasks: { en: "key task EN", fr: "key task FR" },
                      essentialSkills: {
                        sync: skill.id,
                      },
                      advertisementLanguage: PoolAdvertisementLanguage.Various,
                      securityClearance: SecurityStatus.Secret,
                      advertisementLocation: {
                        en: "test location EN",
                        fr: "test location FR",
                      },
                      isRemote: true,
                      publishingGroup: PublishingGroup.ItJobs,
                    }).then((updatedPoolAdvertisement) => {
                      cy.publishPoolAdvertisement(updatedPoolAdvertisement.id)
                        .its("id")
                        .as("publishedTestPoolAdvertisementId2");
                    });
                  });
                });
              });
            });
          });
        });
    });

    // use new test user to submit an application
    cy.get("@testUserSub").then((sub) => {
      cy.loginBySubject(sub).then(() => {
        cy.getMe().then((testUser) => {
          cy.get("@publishedTestPoolAdvertisementId1").then(
            (poolAdvertisementId) => {
              cy.createApplication(testUser.id, poolAdvertisementId).then(
                (poolCandidate) => {
                  cy.submitApplication(
                    poolCandidate.id,
                    uniqueTestId.toString(),
                  )
                    .its("id")
                    .as("poolCandidateId");
                },
              );
            },
          );
        });
      });
    });

    // admin approve the application
    cy.loginByRole("admin").then(() => {
      cy.get("@poolCandidateId").then((poolCandidateId) => {
        cy.updatePoolCandidateAsAdmin(poolCandidateId, {
          status: PoolCandidateStatus.QualifiedAvailable,
        });
      });
    });

    cy.visit("/en/search");
  });

  const searchReturnsGreaterThanZeroApplicants = () => {
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });
  };

  const searchFindsMySingleCandidate = () => {
    cy.findAllByRole("article", {
      name: `Cypress Test Pool EN 1 ${uniqueTestId} (IT-01 Business Line Advisory Services)`,
    }).within(() => {
      cy.contains("There is 1 matching candidate in this pool");

      cy.findByRole("button", { name: /Request Candidates/i })
        .should("exist")
        .and("be.visible")
        .and("not.be.disabled");
    });
  };

  const searchRejectsMySingleCandidate = () => {
    cy.findAllByRole("article", {
      name: `Cypress Test Pool 1 EN ${uniqueTestId} (IT-01 Business Line Advisory Services)`,
    }).should("not.exist");
  };

  it("searches for a candidate with all the filters and submits a request", () => {
    // first request is without any filters
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");

    searchFindsMySingleCandidate();

    // classification filter - fail
    cy.get("@testClassificationName2").then((classificationName) => {
      cy.get("option")
        .contains(classificationName)
        .invoke("text")
        .then((text) => {
          cy.findByRole("combobox", { name: /Classification/i }).select(text);
          cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
          searchRejectsMySingleCandidate();
        });
    });

    // classification filter - pass
    cy.get("@testClassificationName1").then((classificationName) => {
      cy.get("option")
        .contains(classificationName)
        .invoke("text")
        .then((text) => {
          cy.findByRole("combobox", { name: /Classification/i }).select(text);
          cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
          searchFindsMySingleCandidate();
        });
    });

    // test stream dropdown, changes do not trigger api requests
    cy.findByRole("combobox", { name: /Stream/i }).then((dropdown) => {
      // fail
      cy.wrap(dropdown).select("Database Management");
      searchRejectsMySingleCandidate();
      // pass
      cy.wrap(dropdown).select("Business Line Advisory Services");
      searchFindsMySingleCandidate();
    });

    // education requirement, no negation possible
    cy.findByRole("radio", {
      name: /Required diploma from post-secondary institution/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

    // work location combobox
    cy.findByRole("combobox", { name: /Region/i }).then((combobox) => {
      // fail
      cy.wrap(combobox).type("Atlantic{enter}{enter}");
      cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
      searchRejectsMySingleCandidate();
      // reset
      cy.wrap(combobox).type("{backspace}");
      // clearing does not trigger another api request
      // pass
      cy.wrap(combobox).type("Ontario{enter}{enter}");
      cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
      searchFindsMySingleCandidate();
    });

    // working language ability - fail
    cy.findByRole("radio", {
      name: /French only/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchRejectsMySingleCandidate();

    // working language ability - pass
    cy.findByRole("radio", {
      name: /English only/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

    // employment duration - fail
    cy.findByRole("radio", {
      name: /Term duration/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchRejectsMySingleCandidate();

    // employment duration - pass
    cy.findByRole("radio", {
      name: /Indeterminate duration/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

    // employment equity, no negation possible
    cy.findByRole("checkbox", {
      name: /Woman/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

    // skills selection, not currently used in search
    cy.get("@testSkill").then((skill) => {
      cy.findByRole("button", {
        name: `Add this skill : ${skill.name.en}`,
      }).click();
      // skill selection does not trigger an api request
    });

    // conditions of employment, no negation possible
    cy.findByRole("checkbox", {
      name: /ability to work overtime \(Occasionally\)/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

    // no way to know what the exact number should be without resetting the database
    searchReturnsGreaterThanZeroApplicants();

    cy.findAllByRole("article", {
      name: `Cypress Test Pool EN 1 ${uniqueTestId} (IT-01 Business Line Advisory Services)`,
    }).within(() => {
      cy.findByRole("button", { name: /Request Candidates/i }).click();
    });

    /*
     * Request Page (/en/search/request)
     * I'm using findAllByText instead of findByText since the strings appear multiple times in the DOM.
     */

    cy.wait("@gqlgetPoolCandidateSearchRequestDataQuery");

    cy.findByRole("textbox", { name: /Full Name/i }).type("Test Full Name");

    cy.findByRole("textbox", { name: /Government e-mail/i }).type(
      "test@tbs-sct.gc.ca",
    );

    cy.findByRole("textbox", {
      name: /What is the job title for this position\?/i,
    }).type("Test Job Title");

    cy.findByRole("textbox", { name: /Additional Comments/i }).type(
      "Test Comments",
    );

    cy.findByRole("combobox", { name: /Department/i }).select(
      "Treasury Board Secretariat",
    );

    // classification filter
    cy.get("@testClassificationName1").then((classificationName) => {
      cy.findAllByText(classificationName).should("exist");
    });

    // stream doesn't actually appear on this page

    // education requirement
    cy.findAllByText("Required diploma from post-secondary institution").should(
      "exist",
    );

    // work location
    cy.findAllByText("Ontario").should("exist");

    // working language ability
    cy.findAllByText("English only").should("exist");

    // employment duration
    cy.findAllByText("Indeterminate duration (permanent)").should("exist");

    // employment equity
    cy.findAllByText("Woman").should("exist");

    // skills selection
    cy.get("@testSkill").then((skill) => {
      cy.findAllByText(skill.name.en).should("exist");
    });

    // conditions of employment
    cy.findAllByText(
      "Availability, willingness and ability to work overtime (Occasionally).",
    ).should("exist");

    // estimated total
    cy.findByText("1 estimated candidate");

    cy.findByRole("button", { name: /Submit Request/i }).click();

    cy.wait("@gqlcreatePoolCandidateSearchRequestMutation");

    cy.expectToast(/Request created successfully/i);
  });
});
