import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolLanguage,
  PoolStream,
  PositionDuration,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  WorkRegion,
  SkillCategory,
  User,
} from "@gc-digital-talent/web/src/api/generated";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import { addRolesToUser } from "../../support/userHelpers";
import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Submit Application Workflow Tests", () => {
  beforeEach(() => {
    // register queries
    cy.intercept("POST", "/graphql", function (req) {
      aliasQuery(req, "BrowsePoolsPage");
      aliasQuery(req, "PoolAdvertisementPage");
      aliasQuery(req, "Application");
      aliasQuery(req, "MyApplications");

      aliasMutation(req, "CreateApplication");
      aliasMutation(req, "UpdateApplication");
      aliasMutation(req, "Application_Submit");
      aliasMutation(req, "CreateEducationExperience");
      aliasMutation(req, "UpdateEducationExperience");
    });

    cy.getSkills().then((allSkills) => {
      cy.wrap([
        [...allSkills].find(
          (skill) => skill.category === SkillCategory.Technical,
        ).id,
      ]).as("testSkillIds"); // take the first ID for testing
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
    cy.get<string[]>("@testGenericJobTitleIds").then(
      (testGenericJobTitleIds) => {
        // This user must have the entire profile completed to be able to apply to a pool
        cy.createUser({
          email: `cypress.user.${uniqueTestId}@example.org`,
          sub: `cypress.sub.${uniqueTestId}`,
          currentProvince: ProvinceOrTerritory.Ontario,
          currentCity: "Test City",
          telephone: "+10123456789",
          armedForcesStatus: ArmedForcesStatus.NonCaf,
          citizenship: CitizenshipStatus.Citizen,
          lookingForEnglish: true,
          isGovEmployee: false,
          hasPriorityEntitlement: false,
          locationPreferences: [WorkRegion.Ontario],
          positionDuration: [PositionDuration.Permanent],
        }).as("testUser");
      },
    );

    cy.get<User>("@testUser").then((testUser) => {
      addRolesToUser(testUser.id, ["guest", "base_user", "applicant"]);
    });

    cy.getDCM().then((dcmId) => {
      cy.getMe()
        .its("id")
        .then((adminUserId) => {
          cy.get<string>("@testClassificationId").then(
            (testClassificationId) => {
              cy.createPool(adminUserId, dcmId, [testClassificationId])
                .its("id")
                .as("testPoolId")
                .then((testPoolId) => {
                  cy.get<string[]>("@testSkillIds").then((testSkillIds) => {
                    cy.updatePool(testPoolId, {
                      name: {
                        en: "Cypress Test Pool EN",
                        fr: "Cypress Test Pool FR",
                      },
                      stream: PoolStream.BusinessAdvisoryServices,
                      closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
                      yourImpact: {
                        en: "test impact EN",
                        fr: "test impact FR",
                      },
                      keyTasks: { en: "key task EN", fr: "key task FR" },
                      essentialSkills: {
                        sync: testSkillIds,
                      },
                      language: PoolLanguage.Various,
                      securityClearance: SecurityStatus.Secret,
                      location: {
                        en: "test location EN",
                        fr: "test location FR",
                      },
                      isRemote: true,
                      publishingGroup: PublishingGroup.ItJobs,
                      generalQuestions: {
                        create: [
                          {
                            question: { en: "Question EN", fr: "Question FR" },
                            sortOrder: 1,
                          },
                        ],
                      },
                    });
                    cy.publishPool(testPoolId);
                  });
                });
            },
          );
        });
    });

    cy.get<User>("@testUser").then((user) => {
      cy.loginBySubject(user.authInfo.sub);
    });
    cy.visit("/en/browse/pools");

    // Browse pools page - placeholder so it could change
    cy.wait("@gqlBrowsePoolsPageQuery");
    cy.findByRole("heading", { name: /browse jobs/i })
      .should("exist")
      .and("be.visible");
    cy.get("@testPoolId").then((testPoolId) => {
      cy.get(`a[href*="${testPoolId}"]`).click(); // names could be duplicated - choose the one with the right ID in the url
    });

    // Pool poster page
    cy.wait("@gqlPoolAdvertisementPageQuery");
    cy.findByRole("heading", { name: /Start an application/i })
      .should("exist")
      .and("be.visible");
    cy.findAllByRole("link", { name: /Apply for this process/i })
      .first()
      .click();
    cy.wait("@gqlCreateApplicationMutation");

    // Welcome page - step one
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", { name: /Welcome, Cypress/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 1 of 7/i }) // this workflow currently is a seven step process
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Let's go!/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");

    // Review profile page - step two
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", { name: /Review your profile/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 2 of 7/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/Just a heads up!/i).should("not.exist"); // error summary message on profile page not present
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");

    // Review career timeline page - step three
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", {
      name: /Great work! On to your career timeline./i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 3 of 7/i })
      .should("exist")
      .and("be.visible");

    // Attempt skipping to review
    cy.url().then((url) => {
      const reviewCareerTimelineIntroUrl = url;
      expect(reviewCareerTimelineIntroUrl).to.have.string(
        "career-timeline/introduction",
      );
      const hackedUrl = reviewCareerTimelineIntroUrl.replace(
        "career-timeline/introduction",
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
    cy.findByRole("heading", { name: /Create your career timeline/i }) // returned to career timeline step
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", {
      name: /Review and submit/i,
    }).click();
    cy.findByRole("heading", { name: /Create your career timeline/i })
      .should("exist")
      .and("be.visible"); // can't skip with the stepper, still on the same page

    // Quit trying to skip and continue step three honestly
    cy.contains(/You don’t have any career timeline experiences yet./i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click(); // will it let you continue?
    cy.contains(/Please add at least one experience./i)
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /Add a new experience/i }).click();
    cy.url().should("contain", "/career-timeline/add");
    // at adding experience to career timeline page now
    cy.contains(/Add an experience to your career timeline/i)
      .should("exist")
      .and("be.visible");
    // fill in education experience
    cy.findByRole("combobox", { name: /Experience type/i }).select(
      "Education and certificates",
    );
    cy.findByRole("combobox", { name: /Type of Education/i }).select(
      "Certification",
    );
    cy.findByRole("textbox", { name: /Area of study/i }).type("QA Testing");
    cy.findByRole("textbox", { name: /Institution/i }).type(
      "Cypress University",
    );
    cy.findByRole("group", { name: /start date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).type("2001");
      cy.findAllByRole("combobox", { name: /month/i }).select("01");
    });
    cy.findByRole("group", { name: /end date/i }).within(() => {
      cy.findAllByRole("spinbutton", { name: /year/i }).type("2001");
      cy.findAllByRole("combobox", { name: /month/i }).select("02");
    });
    cy.findByRole("combobox", { name: /Status/i }).select(
      "Successful Completion (Credential Awarded)",
    );
    cy.findByRole("textbox", { name: /Additional details/i }).type(
      "Mastering Cypress",
    );
    cy.findByRole("button", { name: /Save and go back/i }).click();
    cy.wait("@gqlCreateEducationExperienceMutation");
    cy.expectToast(/Successfully added experience!/i);
    // returned to main career timeline review page
    cy.wait("@gqlApplicationQuery");
    cy.contains(/1 education and certificate experience/i)
      .should("exist")
      .and("be.visible");
    cy.contains(/QA Testing at Cypress University/i) // added experience present
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated your career timeline!/i);

    // Education experience page - step four
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", {
      name: /Minimum experience or equivalent education/i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 4 of 7/i })
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
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", { name: /Let's talk about skills/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 5 of 7/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /Let's get to it!/i }).click();
    cy.findByRole("heading", { name: /Skill requirements/i })
      .should("exist")
      .and("be.visible");
    cy.contains(
      /This required skill must have at least 1 career timeline experience associated with it./i,
    )
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click(); // will it let you skip without filling
    cy.contains(
      /Please connect at least one career timeline experience to each required technical skill./i,
    )
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", {
      name: /Connect a career timeline experience/i,
    }).click();
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
      /Please connect at least one career timeline experience to each required technical skill./i,
    ).should("not.exist"); // Experience and skill linked
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.wait("@gqlUpdateApplicationMutation");
    cy.expectToast(/Successfully updated your skills!/i);

    // Screening questions page - step six
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", { name: /A few related questions/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 6 of 7/i })
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
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", { name: /Review your submission/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 7 of 7/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/Definitely not getting screened out response./i) // screening response present
      .should("exist")
      .and("be.visible");
    cy.contains(/QA Testing at Cypress University/i) // experience present
      .should("exist")
      .and("be.visible");
    // assert no error/empty case messages appear
    cy.contains(
      /It looks like you haven't added any experiences to your career timeline yet./i,
    ).should("not.exist");
    cy.contains(
      /It looks like you haven't selected an education requirement yet./i,
    ).should("not.exist");
    cy.contains(
      /It looks like you haven't answered any screening questions yet./i,
    ).should("not.exist");
    // time to submit!
    cy.findByRole("textbox", { name: /Your full name/i }).type("Signature");
    cy.findByRole("button", { name: /Submit my application/i }).click();
    cy.wait("@gqlApplication_SubmitMutation");
    cy.expectToast(/We successfully received your application/i);

    // Application home after submitting
    cy.wait("@gqlApplicationQuery");
    cy.findByRole("heading", {
      name: /We successfully received your application/i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", {
      name: /visit your Profile and applications page/i,
    }).should("exist");
  });
});
