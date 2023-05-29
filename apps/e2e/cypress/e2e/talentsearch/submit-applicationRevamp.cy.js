import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolAdvertisementLanguage,
  PoolStream,
  PositionDuration,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  WorkRegion,
  EducationType,
  EducationStatus,
} from "@gc-digital-talent/web/src/api/generated";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { addRolesToUser } from "../../support/userHelpers";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Submit Application Workflow Tests", () => {
  beforeEach(() => {
    // register queries
    cy.intercept("POST", "/graphql", function (req) {
      aliasQuery(req, "browsePoolAdvertisements");
      aliasQuery(req, "getPoolAdvertisement");
      aliasQuery(req, "GetApplication");
      aliasQuery(req, "getApplicationData");
      aliasQuery(req, "MyApplications");

      aliasMutation(req, "createApplication");
      aliasMutation(req, "UpdateApplication");
      aliasMutation(req, "submitApplication");
      aliasMutation(req, "UpdateEducationExperience");
    });

    cy.getSkills().then((allSkills) => {
      cy.wrap([allSkills[0].id]).as("testSkillIds"); // take the first ID for testing
    });
    cy.getGenericJobTitles().then((allGenericJobTitles) => {
      cy.wrap([allGenericJobTitles[0].id]).as("testGenericJobTitleIds"); // take the first ID for testing
      cy.wrap(allGenericJobTitles[0].classification.id).as(
        "testClassificationId",
      ); // take the first ID for testing
    });
  });

  it("Submits an application to a new pool", () => {
    const uniqueTestId = Date.now().valueOf();
    cy.log(`Test run ${uniqueTestId}`);

    cy.loginByRole("admin");
    cy.get("@testGenericJobTitleIds").then((testGenericJobTitleIds) => {
      // This user must have the entire profile completed to be able to apply to a pool
      cy.createUser({
        email: `cypress.user.${uniqueTestId}@example.org`,
        sub: `cypress.sub.${uniqueTestId}`,
        legacyRoles: ["APPLICANT"],
        currentProvince: ProvinceOrTerritory.Ontario,
        currentCity: "Test City",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.NonCaf,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: false,
        locationPreferences: WorkRegion.Ontario,
        positionDuration: PositionDuration.Permanent,
        expectedGenericJobTitles: {
          sync: testGenericJobTitleIds,
        },
        educationExperiences: {
          create: [
            {
              institution: "Cypress University",
              areaOfStudy: "QA Testing",
              startDate: FAR_PAST_DATE,
              endDate: FAR_PAST_DATE,
              type: EducationType.Certification,
              status: EducationStatus.SuccessCredential,
              details: "Mastering Cypress",
            },
          ],
        },
      }).as("testUser");
    });

    cy.get("@testUser").then((testUser) => {
      addRolesToUser(testUser.id, ["guest", "base_user", "applicant"]);
    });

    // fetch the dcmId for its team from database, needed for pool creation
    let dcmId;
    cy.getDCM().then((dcm) => {
      dcmId = dcm;
    });

    cy.getMe()
      .its("id")
      .then((adminUserId) => {
        cy.get("@testClassificationId").then((testClassificationId) => {
          cy.createPoolAdvertisement(adminUserId, dcmId, [testClassificationId])
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
                  closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
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
                  screeningQuestions: {
                    create: [
                      {
                        question: { en: "Question EN", fr: "Question FR" },
                        sortOrder: 1,
                      },
                    ],
                  },
                });
                cy.publishPoolAdvertisement(testPoolAdvertisementId);
              });
            });
        });
      });

    cy.get("@testUser").then((user) => {
      cy.loginBySubject(user.sub);
    });
    cy.visit("/en/browse/pools");

    // Browse pools page - placeholder so it could change
    cy.wait("@gqlbrowsePoolAdvertisementsQuery");
    cy.findByRole("heading", { name: /browse jobs/i })
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
    cy.findAllByRole("link", { name: /Apply for this process/i })
      .first()
      .click();
    cy.wait("@gqlcreateApplicationMutation");

    // Welcome page - step one
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Welcome, Cypress/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Let's go!/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");

    // Review profile page - step two
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Review your profile/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/Just a heads up!/i).should("not.exist"); // error summary message on profile page not present
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");

    // Review resume page - step three
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Great work! On to your résumé./i })
      .should("exist")
      .and("be.visible");

    // Attempt skipping to review
    cy.url().then((url) => {
      const reviewResumeIntroUrl = url;
      cy.expect(reviewResumeIntroUrl).to.have.string("resume/introduction");
      const hackedUrl = reviewResumeIntroUrl.replace(
        "resume/introduction",
        "review",
      );
      cy.visit(hackedUrl);
    });
    cy.findByRole("heading", {
      name: /Uh oh, it looks like you jumped ahead!/i, // message for skipping steps
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", {
      name: /Return to the last step I was working on/i,
    }).click();
    cy.findByRole("heading", { name: /Review your résumé/i }) // returned to resume step
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", {
      name: /Review and submit/i,
    }).click();
    cy.findByRole("heading", { name: /Review your résumé/i })
      .should("exist")
      .and("be.visible"); // can't skip with the stepper, still on the same page

    // Quit trying to skip and continue step three honestly
    cy.contains(/QA Testing at Cypress University/i)
      .should("exist")
      .and("be.visible");
    cy.contains(/1 education and certificate experience/i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated your résumé!/i);

    // Education experience page - step four
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Minimum experience or education/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/Please select an option to continue./i) // must select education/work option for experiences to appear
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click(); // will it let you skip without filling
    cy.contains(/This field is required./i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("radio", {
      name: /I meet the 2-year post-secondary option/i,
    }).click();
    cy.findByRole("checkbox", { name: /QA Testing at Cypress University/i })
      .should("exist")
      .click();
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated your education requirement!/i);

    // Skills requirement page - step five
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Let's talk about skills/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /Let's get to it!/i }).click();
    cy.findByRole("heading", { name: /Skill requirements/i })
      .should("exist")
      .and("be.visible");
    cy.contains(
      /This required skill must have at least 1 résumé experience associated with it./i,
    )
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click(); // will it let you skip without filling
    cy.contains(
      /Please connect at least one résumé experience to each required technical skill./i,
    )
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Connect a résumé experience/i }).click();
    cy.contains(/Choose the experience you'd like to add/i) // modal appeared
      .should("exist")
      .and("be.visible");
    cy.findByRole("combobox", { name: /Select an experience/i }).select(
      "QA Testing at Cypress University",
    );
    cy.findByRole("textbox", {
      name: /Describe how you used this skill/i,
    }).type("Riveting justification.");
    cy.findByRole("button", { name: /Add this experience/i }).click();
    cy.wait("@gqlUpdateEducationExperienceMutation");
    cy.expectToast(/Successfully linked experience!/i);
    cy.contains(/Choose the experience you'd like to add/i).should("not.exist"); // modal gone
    cy.contains(
      /Please connect at least one résumé experience to each required technical skill./i,
    ).should("not.exist"); // Experience and skill linked
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated your skills!/i);

    // Screening questions page - step six
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /A few related questions/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /I'm ready!/i }).click();
    cy.findByRole("heading", { name: /Screening questions/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/Question EN/i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click(); // will it let you skip without filling
    cy.contains(/This field is required./i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("textbox", {
      name: /Answer to question 1/i,
    }).type("Definitely not getting screened out response.");
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated screening question responses!/i);

    // Review page - step seven
    cy.wait("@gqlGetApplicationQuery");
    cy.findByRole("heading", { name: /Review your submission/i })
      .should("exist")
      .and("be.visible");
  });
});
