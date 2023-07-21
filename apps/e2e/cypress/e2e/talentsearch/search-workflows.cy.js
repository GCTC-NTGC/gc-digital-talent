import { PoolCandidateStatus } from "@gc-digital-talent/web/src/api/generated";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { createAndPublishPool } from "../../support/poolHelpers";
import { createApplicant, addRolesToUser } from "../../support/userHelpers";

describe("Talent Search Workflow Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "CountApplicantsAndCountPoolCandidatesByPool");
      aliasQuery(req, "getPoolCandidateSearchRequestData");
      aliasQuery(req, "getSearchFormDataAcrossAllPools");
      aliasMutation(req, "createPoolCandidateSearchRequest");
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
        name: `Cypress Test Pool EN 1 ${uniqueTestId} (I T 1 Business Line Advisory Services)`,
      }).within(() => {
        cy.contains("There is approximately 1 matching candidate in this pool");

        cy.findByRole("button", { name: /Request candidates/i })
          .should("exist")
          .and("be.visible")
          .and("not.be.disabled");
      });
    };

    const searchRejectsMySingleCandidate = () => {
      cy.findByRole("article", {
        name: `Cypress Test Pool 1 EN ${uniqueTestId} (I T 1 Business Line Advisory Services)`,
      }).should("not.exist");
    };

    // create a test user to attach test candidates to
    cy.loginByRole("admin");
    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get("@testGenericJobTitle1").then((genericJobTitle) => {
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
            cy.getDCM().then((dcmId) => {
              addRolesToUser(adminUserId, ["pool_operator"], dcmId);

              // create, update, and publish a new pool for testing matching
              cy.get("@testClassification1").then((classification) => {
                createAndPublishPool({
                  adminUserId,
                  teamId: dcmId,
                  englishName: `Cypress Test Pool EN 1 ${uniqueTestId}`,
                  classification,
                  poolAlias: "publishedTestPool1",
                });
              });

              // create, update, and publish a new pool for testing rejection
              cy.get("@testClassification2").then((classification) => {
                createAndPublishPool({
                  adminUserId,
                  teamId: dcmId,
                  englishName: `Cypress Test Pool EN 2 ${uniqueTestId}`,
                  classification,
                  poolAlias: "publishedTestPool2",
                });
              });
            });
          });
        });
      });

    // use new test user to submit an application
    cy.get("@testUser").then((testUser) => {
      cy.loginBySubject(testUser.sub);
      cy.getMe().then((testUser) => {
        cy.get("@publishedTestPool1").then((pool) => {
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
    cy.get("@poolCandidateId").then((poolCandidateId) => {
      cy.updatePoolCandidateAsAdmin(poolCandidateId, {
        status: PoolCandidateStatus.QualifiedAvailable,
      });
    });

    cy.visit("/en/search");

    // first request is without any filters
    cy.wait("@gqlgetSearchFormDataAcrossAllPoolsQuery");
    searchFindsMySingleCandidate();

    // classification filter - fail
    cy.get("@testClassification2").then((classification) => {
      cy.get("option")
        .contains(classificationName(classification))
        .invoke("text")
        .then((text) => {
          cy.findByRole("combobox", { name: /Classification/i }).select(text);
          cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
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

    // work location - fail
    cy.findByRole("checkbox", {
      name: /Atlantic \(NB, NS, PE and NL\)/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchRejectsMySingleCandidate();

    // work location - pass
    cy.findByRole("checkbox", {
      name: /Ontario \(excluding Ottawa area\)/i,
    }).click();
    cy.wait("@gqlCountApplicantsAndCountPoolCandidatesByPoolQuery");
    searchFindsMySingleCandidate();

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

    // employment duration moved to last change of page to avoid "dom detached" errors on request button

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
      searchFindsMySingleCandidate();
    });

    // conditions of employment, no negation possible
    cy.findByRole("checkbox", {
      name: /ability to work overtime \(Occasionally\)/i,
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

    // check total user count
    // no way to know what the exact number should be without resetting the database, so just check it's not zero
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });

    cy.findByRole("article", {
      name: `Cypress Test Pool EN 1 ${uniqueTestId} (I T 1 Business Line Advisory Services)`,
    }).within(() => {
      // Finding this button is sensitive to "dom detached" errors.
      // Must not try to click it unless we know there are no inflight searches.
      cy.findByRole("button", { name: /Request candidates/i }).click();
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
    cy.get("@testClassification1").then((classification) => {
      cy.findAllByText(classificationName(classification)).should("exist");
    });

    // stream doesn't actually appear on this page

    // education requirement
    cy.findAllByText("Required diploma from post-secondary institution").should(
      "exist",
    );

    // work location
    cy.findAllByText("Ontario (excluding Ottawa area)").should("exist");

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
