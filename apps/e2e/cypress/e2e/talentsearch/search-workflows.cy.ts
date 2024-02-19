import {
  Classification,
  GenericJobTitle,
  Pool,
  Skill,
  PoolCandidateStatus,
  User,
} from "@gc-digital-talent/web/src/api/generated";

import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPool } from "../../support/poolHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";

describe("Talent Search Workflow Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "CandidateCount");
      aliasQuery(req, "SearchForm");
      aliasMutation(req, "RequestForm_CreateRequest");
    });

    // select some dimensions to use for testing
    cy.getSkills().then((allSkills) => {
      cy.wrap(allSkills[0]).as("testSkill"); // take the first skill for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      const testGenericJobTitle1 = allGenericJobTitles[0]; // take the first ID for testing matching
      cy.wrap(testGenericJobTitle1).as("testGenericJobTitle1");
      cy.wrap(testGenericJobTitle1.classification).as("testClassification1");

      const testGenericJobTitle2 = allGenericJobTitles[1]; // take the second ID for testing rejection
      cy.wrap(testGenericJobTitle2.id).as("testGenericJobTitleId2");
      cy.wrap(testGenericJobTitle2.classification).as("testClassification2");
    });
  });

  // calculate how the classification will be displayed in the UI
  const classificationName = (classification) =>
    `${classification.group}-${classification.level
      .toString()
      .padStart(2, "0")}`;

  it("searches for a candidate with all the filters and submits a request", () => {
    // have a unique ID to track the test objects with
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    const searchFindsMySingleCandidate = () => {
      cy.findByRole("article", {
        name: `I T 1: Cypress Test Pool EN 1 ${uniqueTestId}`,
      }).within(() => {
        cy.contains("1 approximate match");

        cy.findByRole("button", { name: /Request candidates/i })
          .should("exist")
          .and("be.visible")
          .and("not.be.disabled");
      });
    };

    const searchRejectsMySingleCandidate = () => {
      cy.findByRole("article", {
        name: `I T 1: Cypress Test Pool 1 EN ${uniqueTestId}`,
      }).should("not.exist");
    };

    // create a test user to attach test candidates to
    cy.loginByRole("admin");
    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get<GenericJobTitle>("@testGenericJobTitle1").then(
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
                addRolesToUser(adminUserId, ["pool_operator"], dcmId);

                // create, update, and publish a new pool for testing matching
                cy.get<Classification>("@testClassification1").then(
                  (classification) => {
                    createAndPublishPool({
                      adminUserId,
                      teamId: dcmId,
                      englishName: `Cypress Test Pool EN 1 ${uniqueTestId}`,
                      classification,
                      poolAlias: "publishedTestPool1",
                    });
                  },
                );

                // create, update, and publish a new pool for testing rejection
                cy.get<Classification>("@testClassification2").then(
                  (classification) => {
                    createAndPublishPool({
                      adminUserId,
                      teamId: dcmId,
                      englishName: `Cypress Test Pool EN 2 ${uniqueTestId}`,
                      classification,
                      poolAlias: "publishedTestPool2",
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
        cy.get<Pool>("@publishedTestPool1").then((pool) => {
          cy.createApplication(testUser.id, pool.id).then((poolCandidate) => {
            cy.submitApplication(poolCandidate.id, uniqueTestId.toString())
              .its("id")
              .as("poolCandidateId");
          });
        });
      });
    });

    // admin approve the application
    cy.loginByRole("admin");
    cy.get<string>("@poolCandidateId").then((poolCandidateId) => {
      cy.updatePoolCandidateAsAdmin(poolCandidateId, {
        status: PoolCandidateStatus.QualifiedAvailable,
      });
    });

    cy.visit("/en/search");

    // first request is without any filters
    searchFindsMySingleCandidate();

    // classification filter - fail
    cy.get("@testClassification2").then((classification) => {
      cy.get("option")
        .contains(classificationName(classification))
        .invoke("text")
        .then((text) => {
          cy.findByRole("combobox", { name: /Classification/i }).select(text);
          cy.wait("@gqlCandidateCountQuery");
          searchRejectsMySingleCandidate();
        });
    });

    // classification filter - pass
    cy.get("@testClassification1").then((classification) => {
      cy.get("option")
        .contains(classificationName(classification))
        .invoke("text")
        .then((text) => {
          cy.findByRole("combobox", { name: /Classification/i }).select(text);
          cy.wait("@gqlCandidateCountQuery");
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

    // work location - fail
    cy.findByRole("checkbox", {
      name: /Atlantic \(NB, NS, PE and NL\)/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchRejectsMySingleCandidate();

    // work location - pass
    cy.findByRole("checkbox", {
      name: /Ontario \(excluding Ottawa area\)/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchFindsMySingleCandidate();

    // working language ability - fail
    cy.findByRole("radio", {
      name: /French only/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchRejectsMySingleCandidate();

    // working language ability - pass
    cy.findByRole("radio", {
      name: /English only/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchFindsMySingleCandidate();

    // employment duration moved to last change of page to avoid "dom detached" errors on request button

    // employment equity, no negation possible
    cy.findByRole("checkbox", {
      name: /Woman/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchFindsMySingleCandidate();

    // skills selection, not currently used in search
    cy.get<Skill>("@testSkill").then((skill) => {
      cy.findByRole("combobox", { name: /skill family/i }).then((dropdown) => {
        cy.wrap(dropdown).select(1); // All skills
        searchRejectsMySingleCandidate();
      });

      cy.findByRole("combobox", { name: /skill$/i }).then((combobox) => {
        cy.wrap(combobox).type(`${skill.name.en}{DownArrow}{Enter}`);
      });
      // skill selection does not trigger an api request
      searchFindsMySingleCandidate();
    });

    // conditions of employment, no negation possible
    cy.findByRole("button", {
      name: /conditions of employment/i,
    }).click();
    cy.findByRole("checkbox", {
      name: /ability to work overtime \(Occasionally\)/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchFindsMySingleCandidate();

    // employment duration - fail
    cy.findByRole("button", {
      name: /employment duration/i,
    }).click();
    cy.findByRole("radio", {
      name: /Term duration/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchRejectsMySingleCandidate();

    // employment duration - pass
    cy.findByRole("radio", {
      name: /Indeterminate duration/i,
    }).click();
    cy.wait("@gqlCandidateCountQuery");
    searchFindsMySingleCandidate();

    // check total user count
    // no way to know what the exact number should be without resetting the database, so just check it's not zero
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });

    cy.findByRole("article", {
      name: `I T 1: Cypress Test Pool EN 1 ${uniqueTestId}`,
    }).within(() => {
      // Finding this button is sensitive to "dom detached" errors.
      // Must not try to click it unless we know there are no inflight searches.
      cy.findByRole("button", { name: /Request candidates/i }).click();
    });

    /*
     * Request Page (/en/search/request)
     * I'm using findAllByText instead of findByText since the strings appear multiple times in the DOM.
     */
    cy.wait("@gqlSearchFormQuery");

    cy.findByRole("textbox", { name: /Full name/i }).type("Test Full Name");

    cy.findByRole("textbox", { name: /Government e-mail/i }).type(
      "test@tbs-sct.gc.ca",
    );

    cy.findByRole("textbox", { name: /What is your job title\?/i }).type(
      "Manager",
    );

    cy.findByRole("textbox", {
      name: /What is the job title for this position\?/i,
    }).type("Test Job Title");

    cy.findByRole("radio", {
      name: /general interest/i,
    }).click();

    cy.findByRole("textbox", { name: /Additional Comments/i }).type(
      "Test Comments",
    );

    cy.findByRole("combobox", { name: /Department/i }).select(
      "Treasury Board Secretariat",
    );

    // classification filter
    cy.get("@testClassification1").then((classification) => {
      cy.findAllByText(classificationName(classification)).should("exist");
    });

    // stream doesn't actually appear on this page

    // work location
    cy.findAllByText("Ontario (excluding Ottawa area)").should("exist");

    // working language ability
    cy.findAllByText("English only").should("exist");

    // employment duration
    cy.findAllByText("Indeterminate duration (permanent)").should("exist");

    // employment equity
    cy.findAllByText("Woman").should("exist");

    // skills selection
    cy.get<Skill>("@testSkill").then((skill) => {
      cy.findAllByText(skill.name.en).should("exist");
    });

    // conditions of employment
    cy.findAllByText(
      "Availability, willingness and ability to work overtime (Occasionally).",
    ).should("exist");

    // estimated total
    cy.findByText("1 estimated candidate");

    cy.findByRole("button", { name: /Submit Request/i }).click();

    cy.wait("@gqlRequestForm_CreateRequestMutation");

    cy.expectToast(/Request created successfully/i);
  });
});
