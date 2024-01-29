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
import { aliasQuery } from "../../support/graphql-test-utils";

describe("Submit Application for IAP Workflow Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", function (req) {
      aliasQuery(req, "Application");
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
                      publishingGroup: PublishingGroup.Iap,
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
    cy.visit("/en/indigenous-it-apprentice");

    // IAP home page
    cy.findByRole("heading", {
      name: /IT Apprenticeship Program for Indigenous Peoples/i,
      level: 1,
    })
      .should("exist")
      .and("be.visible");
    cy.get("@testPoolId").then((testPoolId) => {
      cy.get(
        `a[href*="/browse/pools/${testPoolId}/create-application?personality=iap"]`,
      )
        .first() // there are several buttons on the page to "Apply Now"
        .click();
    });

    // Welcome page - step one
    cy.findByRole("heading", {
      name: "Apply to Cypress Test Pool EN",
      level: 1,
    })
      .should("exist")
      .and("be.visible"); // IAP heading does not include job stream
    cy.findByRole("heading", {
      name: /Welcome, Cypress/i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 1 of 7/i }) // IAP workflow has one extra step, but we're removing the screening questions step
      .should("exist")
      .and("be.visible");
    cy.contains(
      "The program is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples.",
    ); // customized copy for IAP
    cy.findByRole("button", { name: /Let's go!/i }).click();

    // Self-Declaration - step two
    cy.findByRole("heading", {
      name: /Indigenous Peoples Self-Declaration Form/i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("heading", { name: /Step 2 of 7/i }) // self declaration is the new step 2
      .should("exist")
      .and("be.visible");

    cy.findByRole("radio", {
      // don't affirm
      name: /I am not a member of an Indigenous group/i,
    }).click();
    cy.findByRole("button", { name: /Sign and continue/i }).should("not.exist"); // check that you cannot proceed without affirmation

    cy.findByRole("radio", {
      // affirmation
      name: /i affirm that i am first nations/i,
    }).click();
    cy.findByRole("button", { name: /Sign and continue/i }).should("not.exist"); // check that you cannot proceed without community selection

    cy.findByRole("checkbox", {
      // community selection
      name: /i am first nations/i,
    }).click();
    cy.findByRole("radio", {
      // affirmation
      name: /i am status first nations/i,
    }).click();
    cy.findByRole("textbox", {
      name: /signature/i,
    }).type(String(uniqueTestId));
    cy.findByRole("button", { name: /Sign and continue/i }).click();

    // Review profile page - step three
    cy.findByRole("heading", { name: /Review your profile/i })
      .should("exist")
      .and("be.visible");
    cy.contains(/I affirm that I am First Nations/i);
    cy.contains(/Status First Nations/i);
    cy.findByRole("button", { name: /Save and continue/i }).click();

    // Review career timeline page - step four
    cy.findByRole("heading", {
      name: /Great work! On to your career timeline./i,
    })
      .should("exist")
      .and("be.visible");

    // quit application to confirm draft message
    cy.url().then((urlBeforeQuitting) => {
      cy.findByRole("link", { name: /Save and quit for now/i }).click();

      // Back on dashboard
      cy.findByRole("heading", {
        name: /Welcome back, Cypress/i,
      })
        .should("exist")
        .and("be.visible");
      cy.contains(
        "Are you looking for your application to the IT Apprenticeship Program for Indigenous Peoples?",
      ); // customized notification for draft IAP application

      cy.visit(urlBeforeQuitting);
    });

    // back on career timeline intro
    cy.findByRole("link", { name: /Got it, let's go/i }).click();

    cy.findByRole("link", { name: /Add a new experience/i }).click();
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
    cy.expectToast(/Successfully added experience!/i);
    cy.wait("@gqlApplicationQuery");
    // returned to main career timeline review page
    cy.contains(/1 education and certificate experience/i)
      .should("exist")
      .and("be.visible");
    cy.contains(/QA Testing at Cypress University/i) // added experience present
      .should("exist")
      .and("be.visible");
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.expectToast(/Successfully updated your career timeline!/i);

    // Education experience page - step five
    cy.findByRole("heading", {
      name: /Minimum experience or equivalent education/i,
    })
      .should("exist")
      .and("be.visible");
    cy.findByRole("radio", {
      name: /high school diploma/i, // different eduction req for IAP
    }).click();
    cy.findByRole("checkbox", {
      name: /QA Testing at Cypress University/i,
    }).click();
    cy.findByRole("button", { name: /Save and continue/i }).click();
    cy.expectToast(/Successfully updated your education requirement!/i);

    // Skills requirement page - step six, no difference for IAP
    cy.findByRole("heading", { name: /Let's talk about skills/i })
      .should("exist")
      .and("be.visible");
    cy.findByRole("link", { name: /Let's get to it!/i }).click();
    cy.findByRole("button", {
      name: /Connect a career timeline experience/i,
    }).click();
    cy.findByRole("combobox", { name: /Select an experience/i }).select(
      "QA Testing at Cypress University",
    );
    cy.findByRole("textbox", {
      name: /Describe how you used this skill/i,
    }).type("Riveting justification.");
    cy.findByRole("button", { name: /Add this experience/i }).click();
    cy.findByRole("button", { name: /Save and continue/i }).click();

    // Review page - step eight
    cy.findByRole("heading", { name: /Review your submission/i })
      .should("exist")
      .and("be.visible");
    // time to submit!
    cy.findByRole("textbox", { name: /Your full name/i }).type("Signature");
    cy.findByRole("button", { name: /Submit my application/i }).click();

    // Success page
    cy.findByRole("heading", {
      name: /We successfully received your application/i,
    })
      .should("exist")
      .and("be.visible");
    cy.contains(
      "Thank you for your interest in becoming an IT apprentice with the Government of Canada.",
    ); // customized copy for IAP
    cy.findByRole("link", {
      name: /Visit your Profile and applications page/i,
    }).click();

    // Back on dashboard
    cy.findByRole("heading", {
      name: /Welcome back, Cypress/i,
    })
      .should("exist")
      .and("be.visible");
    cy.contains(
      "Thanks for applying to the IT Apprenticeship Program for Indigenous Peoples!",
    ); // special IAP notification
  });
});
