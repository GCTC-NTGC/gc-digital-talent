import {
  GetDigitalContractingQuestionnaireDocument,
  GetDigitalContractingQuestionnaireQuery,
} from "@gc-digital-talent/web/src/api/generated";

import {
  aliasMutation,
  aliasQuery,
  getGqlString,
} from "../../support/graphql-test-utils";

describe("Directive Forms Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "GetDigitalContractingQuestionnaire");
      aliasMutation(req, "CreateDigitalContractingQuestionnaire");
    });
  });

  it("can submit a digital services contracting questionnaire with specific personnel requirements", () => {
    cy.loginByRole("admin");
    cy.visit(
      "/en/directive-on-digital-talent/digital-services-contracting-questionnaire",
    );

    // preamble
    cy.findByRole("checkbox", {
      name: /I have read the preamble/i,
    }).click();

    // general information
    cy.findByRole("combobox", {
      name: /Select your department or agency/i,
    }).then((dropdown) => {
      cy.wrap(dropdown).select("Other");
    });
    cy.findByRole("textbox", { name: /specify your department/i }).type(
      "specify your department",
    );
    cy.findByRole("textbox", { name: /Branch/i }).type("Branch");
    cy.findByRole("group", {
      name: /Business owner/i,
    }).within(() => {
      cy.findByRole("textbox", { name: /Name/i }).type("Business owner, Name");
      cy.findByRole("textbox", { name: /Job title/i }).type(
        "Business owner, Job title",
      );
      cy.findByRole("textbox", { name: /Email/i }).type(
        "business.owner@example.org",
      );
    });
    cy.findByRole("group", {
      name: /Delegated financial authority/i,
    }).within(() => {
      cy.findByRole("textbox", { name: /Name/i }).type(
        "Delegated financial authority, Name",
      );
      cy.findByRole("textbox", { name: /Job title/i }).type(
        "Delegated financial authority, Job title",
      );
      cy.findByRole("textbox", { name: /Email/i }).type(
        "financial.authority@example.org",
      );
    });
    cy.findByRole("group", {
      name: /Are there any other authorities involved/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /Other authorities involved \/ engaged on this contract/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", { name: /Please specify the authority/i }).type(
      "Please specify the authority",
    );
    cy.findByRole("group", {
      name: /contract being put in place on behalf of another Government of Canada department/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /contract being put in place for the purpose of service provision/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /contract related to a specific digital initiative/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("textbox", { name: /Name of the digital initiative/i }).type(
      "Name of the digital initiative",
    );
    cy.findByRole("group", {
      name: /Has a digital initiative forward talent plan been submitted/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /Has the plan been updated/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /Does this procurement complement other talent sourcing activities/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });

    // scope of contract
    cy.findByRole("textbox", { name: /Contract title/i }).type(
      "Contract title",
    );
    cy.findByRole("group", {
      name: /Expected start date/i,
    }).within(() => {
      cy.findByRole("spinbutton", { name: /Year/i }).type("2050");
      cy.findByRole("combobox", { name: /Month/i }).then((dropdown) => {
        cy.wrap(dropdown).select("January");
      });
    });
    cy.findByRole("group", {
      name: /Expected end date/i,
    }).within(() => {
      cy.findByRole("spinbutton", { name: /Year/i }).type("2059");
      cy.findByRole("combobox", { name: /Month/i }).then((dropdown) => {
        cy.wrap(dropdown).select("December");
      });
    });
    cy.findByRole("group", {
      name: /option to extend the contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /option to amend the contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /multi-year contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /total contract value/i,
    }).within(() => {
      cy.findByRole("radio", { name: "$0 to $10,000" }).click();
    });
    cy.findByRole("group", {
      name: /the estimated total number of resources expected/i,
    }).within(() => {
      cy.findByRole("radio", { name: "1 to 5" }).click();
    });
    cy.findByRole("group", {
      name: /expected to start work in/i,
    }).within(() => {
      cy.findByRole("radio", { name: "0 to 3 months" }).click();
    });
    cy.findByRole("group", {
      name: /Commodity type/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: "Other",
      }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the commodity/i,
    }).type("Please specify the commodity");
    cy.findByRole("group", {
      name: /Instrument type/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the instrument/i,
    }).type("Please specify the instrument");
    cy.findByRole("group", {
      name: /Method of supply/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the method/i,
    }).type("Please specify the method");
    cy.findByRole("group", {
      name: /Solicitation procedure/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Advance contract award notice" }).click();
    });
    cy.findByRole("group", {
      name: /subject to any trade agreements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });

    // requirements
    cy.findByRole("textbox", {
      name: /tasks that the contractor is expected to perform/i,
    }).type("tasks that the contractor is expected to perform");
    cy.findByRole("group", {
      name: /specific personnel requirements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });

    cy.findByRole("button", { name: "Add personnel requirement" }).click();
    cy.findByRole("group", { name: "Personnel requirement 1" }).within(() => {
      cy.findByRole("textbox", {
        name: /Type of personnel/i,
      }).type("Type of personnel");
      cy.findByRole("button", { name: "Add a skill" }).click();
    });

    cy.findByRole("dialog", { name: "Find a skill" }).within(() => {
      cy.findByRole("combobox", {
        name: "Skill category",
      }).then((dropdown) => {
        cy.wrap(dropdown).select(1); // All categories
      });
      cy.findByRole("combobox", {
        name: "Skill family",
      }).then((dropdown) => {
        cy.wrap(dropdown).select(1); // All families
      });
      cy.findByRole("combobox", { name: "Skill*" }).then((combobox) => {
        cy.wrap(combobox).type("Ability to Learn Quickly{downArrow}{enter}");
      });
      cy.findByRole("group", {
        name: /Current experience in skill/i,
      }).within(() => {
        cy.findByRole("radio", { name: "In early development" }).click();
      });
      cy.findByRole("button", { name: "Save and add this skill" }).click();
    });

    cy.findByRole("group", { name: "Personnel requirement 1" }).within(() => {
      cy.findByRole("combobox", {
        name: /Official language requirement/i,
      }).then((dropdown) => {
        cy.wrap(dropdown).select("Other");
      });
      cy.findByRole("textbox", {
        name: /Please specify the language requirement/i,
      }).type("Please specify the language requirement");
      cy.findByRole("combobox", {
        name: /Security level/i,
      }).then((dropdown) => {
        cy.wrap(dropdown).select("Other");
      });
      cy.findByRole("textbox", {
        name: /Please specify the security level/i,
      }).type("Please specify the security level");
      cy.findByRole("combobox", {
        name: /Telework allowed/i,
      }).then((dropdown) => {
        cy.wrap(dropdown).select("Yes, full-time");
      });
      cy.findByRole("spinbutton", {
        name: /Quantity/i,
      }).type("1");
    });

    cy.findByRole("group", {
      name: /Are there other requirements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /Select all the other requirements that apply/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the other requirement/i,
    }).type("Please specify the other requirement");

    //technological change
    cy.findByRole("group", {
      name: /Select "yes" if any of the listed technological change factors apply/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /immediate impacts on your department/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /potential immediate carry-forward/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /potential long-term carry-forward/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });

    // operations considerations
    cy.findByRole("group", {
      name: /Do any of the listed operational factors influence the decision to contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /Select all the factors that have influenced/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", { name: /Please specify the factor/i }).type(
      "Please specify the factor",
    );

    // talent sourcing decision
    cy.findByRole("group", {
      name: /primary rationale/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: "Other",
      }).click();
    });
    cy.findByRole("textbox", {
      name: /specify the other primary rationale/i,
    }).type("specify the other primary rationale");
    cy.findByRole("group", {
      name: /secondary rationales/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the other secondary rationale/i,
    }).type("Please specify the other secondary rationale");

    // knowledge transfer
    cy.findByRole("group", {
      name: /ongoing need for the knowledge/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /knowledge transfer from the contractor to the government work unit/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /employees have access to training and development/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("group", {
      name: /OCIO been engaged on connecting employees to training/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });

    cy.findByRole("button", { name: "Submit" }).click();

    cy.wait("@gqlCreateDigitalContractingQuestionnaireMutation")
      .its("response.body.data.createDigitalContractingQuestionnaire.id")
      .as("questionnaireId");

    cy.expectToast(/Questionnaire successfully saved/i);

    cy.get("@questionnaireId").then((questionnaireId) => {
      cy.graphqlRequest<GetDigitalContractingQuestionnaireQuery>({
        operationName: "GetDigitalContractingQuestionnaire",
        query: getGqlString(GetDigitalContractingQuestionnaireDocument),
        variables: {
          id: questionnaireId,
        },
      }).then((data) => {
        expect(
          Cypress._.isMatch(data.digitalContractingQuestionnaire, {
            // preamble not saved
            department: null,
            departmentOther: "specify your department",
            branchOther: "Branch",
            businessOwnerName: "Business owner, Name",
            businessOwnerJobTitle: "Business owner, Job title",
            businessOwnerEmail: "business.owner@example.org",
            financialAuthorityName: "Delegated financial authority, Name",
            financialAuthorityJobTitle:
              "Delegated financial authority, Job title",
            financialAuthorityEmail: "financial.authority@example.org",
            authoritiesInvolved: ["OTHER"],
            authorityInvolvedOther: "Please specify the authority",
            contractBehalfOfGc: "YES",
            contractServiceOfGc: "YES",
            contractForDigitalInitiative: "YES",
            digitalInitiativeName: "Name of the digital initiative",
            digitalInitiativePlanSubmitted: "YES",
            digitalInitiativePlanUpdated: "YES",
            digitalInitiativePlanComplemented: "YES",
            contractTitle: "Contract title",
            contractStartDate: "2050-01-01",
            contractEndDate: "2059-12-01",
            contractExtendable: "YES",
            contractAmendable: "YES",
            contractMultiyear: "YES",
            contractValue: "FROM_0_TO_10K",
            contractFtes: "FROM_1_TO_5",
            contractResourcesStartTimeframe: "FROM_0_TO_3M",
            commodityType: "OTHER",
            commodityTypeOther: "Please specify the commodity",
            instrumentType: "OTHER",
            instrumentTypeOther: "Please specify the instrument",
            methodOfSupply: "OTHER",
            methodOfSupplyOther: "Please specify the method",
            solicitationProcedure: "ADVANCE_CONTRACT_AWARD_NOTICE",
            subjectToTradeAgreement: "YES",
            workRequirementDescription:
              "tasks that the contractor is expected to perform",
            hasPersonnelRequirements: "YES",
            personnelRequirements: [
              {
                resourceType: "Type of personnel",
                skillRequirements: [
                  {
                    skill: {
                      name: {
                        en: "Ability to Learn Quickly",
                      },
                    },
                    level: "BEGINNER",
                  },
                ],
                language: "OTHER",
                languageOther: "Please specify the language requirement",
                security: "OTHER",
                securityOther: "Please specify the security level",
                telework: "FULL_TIME",
                quantity: 1,
              },
            ],
            qualificationRequirement: null,
            requirementAccessToSecure: null,
            requirementScreeningLevels: null,
            requirementScreeningLevelOther: null,
            requirementWorkLanguages: null,
            requirementWorkLanguageOther: null,
            requirementWorkLocations: null,
            requirementWorkLocationGcSpecific: null,
            requirementWorkLocationOffsiteSpecific: null,
            requirementOthers: ["OTHER"],
            requirementOtherOther: "Please specify the other requirement",
            isTechnologicalChange: "YES",
            hasImpactOnYourDepartment: "YES",
            hasImmediateImpactOnOtherDepartments: "YES",
            hasFutureImpactOnOtherDepartments: "YES",
            operationsConsiderations: ["OTHER"],
            operationsConsiderationsOther: "Please specify the factor",
            contractingRationalePrimary: "OTHER",
            contractingRationalePrimaryOther:
              "specify the other primary rationale",
            contractingRationalesSecondary: ["OTHER"],
            contractingRationalesSecondaryOther:
              "Please specify the other secondary rationale",
            ocioConfirmedTalentShortage: null,
            talentSearchTrackingNumber: null,
            ongoingNeedForKnowledge: "YES",
            knowledgeTransferInContract: "YES",
            employeesHaveAccessToKnowledge: "YES",
            ocioEngagedForTraining: "YES",
          }),
        ).to.be.true;
      });
    });
  });

  it("can submit a digital services contracting with general personnel requirements", () => {
    cy.loginByRole("admin");
    cy.visit(
      "/en/directive-on-digital-talent/digital-services-contracting-questionnaire",
    );

    // preamble
    cy.findByRole("checkbox", {
      name: /I have read the preamble/i,
    }).click();

    // general information
    cy.findByRole("combobox", {
      name: /Select your department or agency/i,
    }).then((dropdown) => {
      cy.wrap(dropdown).select(
        "Administrative Tribunals Support Service of Canada",
      );
    });
    cy.findByRole("textbox", { name: /Branch/i }).type("Branch");
    cy.findByRole("group", {
      name: /Business owner/i,
    }).within(() => {
      cy.findByRole("textbox", { name: /Name/i }).type("Business owner, Name");
      cy.findByRole("textbox", { name: /Job title/i }).type(
        "Business owner, Job title",
      );
      cy.findByRole("textbox", { name: /Email/i }).type(
        "business.owner@example.org",
      );
    });
    cy.findByRole("group", {
      name: /Delegated financial authority/i,
    }).within(() => {
      cy.findByRole("textbox", { name: /Name/i }).type(
        "Delegated financial authority, Name",
      );
      cy.findByRole("textbox", { name: /Job title/i }).type(
        "Delegated financial authority, Job title",
      );
      cy.findByRole("textbox", { name: /Email/i }).type(
        "financial.authority@example.org",
      );
    });
    cy.findByRole("group", {
      name: /any other authorities involved/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /contract being put in place on behalf of another Government of Canada department/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /contract being put in place for the purpose of service provision/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /contract related to a specific digital initiative/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    // scope of contract
    cy.findByRole("textbox", { name: /Contract title/i }).type(
      "Contract title",
    );
    cy.findByRole("group", {
      name: /Expected start date/i,
    }).within(() => {
      cy.findByRole("spinbutton", { name: /Year/i }).type("2050");
      cy.findByRole("combobox", { name: /Month/i }).then((dropdown) => {
        cy.wrap(dropdown).select("January");
      });
    });
    cy.findByRole("group", {
      name: /Expected end date/i,
    }).within(() => {
      cy.findByRole("spinbutton", { name: /Year/i }).type("2059");
      cy.findByRole("combobox", { name: /Month/i }).then((dropdown) => {
        cy.wrap(dropdown).select("December");
      });
    });
    cy.findByRole("group", {
      name: /option to extend the contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /option to amend the contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /multi-year contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /total contract value/i,
    }).within(() => {
      cy.findByRole("radio", { name: "$0 to $10,000" }).click();
    });
    cy.findByRole("group", {
      name: /the estimated total number of resources expected/i,
    }).within(() => {
      cy.findByRole("radio", { name: "1 to 5" }).click();
    });
    cy.findByRole("group", {
      name: /expected to start work in/i,
    }).within(() => {
      cy.findByRole("radio", { name: "0 to 3 months" }).click();
    });
    cy.findByRole("group", {
      name: /Commodity type/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: "Information processing and related telecom services",
      }).click();
    });
    cy.findByRole("group", {
      name: /Instrument type/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Supply arrangement" }).click();
    });
    cy.findByRole("group", {
      name: /Method of supply/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Not applicable (N/A)" }).click();
    });
    cy.findByRole("group", {
      name: /Solicitation procedure/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Advance contract award notice" }).click();
    });
    cy.findByRole("group", {
      name: /subject to any trade agreements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    // requirements
    cy.findByRole("textbox", {
      name: /tasks that the contractor is expected to perform/i,
    }).type("tasks that the contractor is expected to perform");
    cy.findByRole("group", {
      name: /specific personnel requirements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("textbox", {
      name: /Qualification requirement/i,
    }).type("Qualification requirement");
    cy.findByRole("group", {
      name: /require access to protected/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /personnel security screening level/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the screening level/i,
    }).type("Please specify the screening level");
    cy.findByRole("group", {
      name: /language which the work will be performed and delivered in/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Other" }).click();
    });
    cy.findByRole("textbox", {
      name: /Please specify the language of work/i,
    }).type("Please specify the language of work");
    cy.findByRole("group", {
      name: /geographic location where the work is to be performed/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "GC premises" }).click();
      cy.findByRole("checkbox", { name: "Offsite, specific location" }).click();
    });
    cy.findByRole("textbox", { name: /Please specify GC premises/i }).type(
      "Please specify GC premises",
    );
    cy.findByRole("textbox", {
      name: /Please specify offsite locations/i,
    }).type("Please specify offsite locations");
    cy.findByRole("group", {
      name: /other requirements/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    //technological change
    cy.findByRole("group", {
      name: /Select "yes" if any of the listed technological change factors apply/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /immediate impacts on your department/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /potential immediate carry-forward/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /potential long-term carry-forward/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    // operations considerations
    cy.findByRole("group", {
      name: /Do any of the listed operational factors influence the decision to contract/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    // talent sourcing decision
    cy.findByRole("group", {
      name: /primary rationale/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: "Shortage of available or qualified talent",
      }).click();
    });
    cy.findByRole("group", {
      name: /OCIO confirmed that there is no available pre-qualified talent/i,
    }).within(() => {
      cy.findByRole("radio", { name: "Yes" }).click();
    });
    cy.findByRole("textbox", {
      name: /search request tracking number/i,
    }).type("search request tracking number");
    cy.findByRole("group", {
      name: /secondary rationales/i,
    }).within(() => {
      cy.findByRole("checkbox", { name: "Timing requirements" }).click();
    });

    // knowledge transfer
    cy.findByRole("group", {
      name: /ongoing need for the knowledge/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /knowledge transfer from the contractor to the government work unit/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /employees have access to training and development/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });
    cy.findByRole("group", {
      name: /OCIO been engaged on connecting employees to training/i,
    }).within(() => {
      cy.findByRole("radio", { name: "No" }).click();
    });

    cy.findByRole("button", { name: "Submit" }).click();

    cy.wait("@gqlCreateDigitalContractingQuestionnaireMutation")
      .its("response.body.data.createDigitalContractingQuestionnaire.id")
      .as("questionnaireId");

    cy.expectToast(/Questionnaire successfully saved/i);

    cy.get("@questionnaireId").then((questionnaireId) => {
      cy.graphqlRequest<GetDigitalContractingQuestionnaireQuery>({
        operationName: "GetDigitalContractingQuestionnaire",
        query: getGqlString(GetDigitalContractingQuestionnaireDocument),
        variables: {
          id: questionnaireId,
        },
      }).then((data) => {
        expect(
          Cypress._.isMatch(data.digitalContractingQuestionnaire, {
            // preamble not saved
            department: {
              name: {
                en: "Administrative Tribunals Support Service of Canada",
              },
            },
            departmentOther: null,
            branchOther: "Branch",
            businessOwnerName: "Business owner, Name",
            businessOwnerJobTitle: "Business owner, Job title",
            businessOwnerEmail: "business.owner@example.org",
            financialAuthorityName: "Delegated financial authority, Name",
            financialAuthorityJobTitle:
              "Delegated financial authority, Job title",
            financialAuthorityEmail: "financial.authority@example.org",
            authoritiesInvolved: null,
            authorityInvolvedOther: null,
            contractBehalfOfGc: "NO",
            contractServiceOfGc: "NO",
            contractForDigitalInitiative: "NO",
            digitalInitiativeName: null,
            digitalInitiativePlanSubmitted: null,
            digitalInitiativePlanUpdated: null,
            digitalInitiativePlanComplemented: null,
            contractTitle: "Contract title",
            contractStartDate: "2050-01-01",
            contractEndDate: "2059-12-01",
            contractExtendable: "NO",
            contractAmendable: "NO",
            contractMultiyear: "NO",
            contractValue: "FROM_0_TO_10K",
            contractFtes: "FROM_1_TO_5",
            contractResourcesStartTimeframe: "FROM_0_TO_3M",
            commodityType: "TELECOM_SERVICES",
            commodityTypeOther: null,
            instrumentType: "SUPPLY_ARRANGEMENT",
            instrumentTypeOther: null,
            methodOfSupply: "NOT_APPLICABLE",
            methodOfSupplyOther: null,
            solicitationProcedure: "ADVANCE_CONTRACT_AWARD_NOTICE",
            subjectToTradeAgreement: "NO",
            workRequirementDescription:
              "tasks that the contractor is expected to perform",
            hasPersonnelRequirements: "NO",
            personnelRequirements: [],
            qualificationRequirement: "Qualification requirement",
            requirementAccessToSecure: "NO",
            requirementScreeningLevels: ["OTHER"],
            requirementScreeningLevelOther:
              "Please specify the screening level",
            requirementWorkLanguages: ["OTHER"],
            requirementWorkLanguageOther: "Please specify the language of work",
            requirementWorkLocations: ["GC_PREMISES", "OFFSITE_SPECIFIC"],
            requirementWorkLocationGcSpecific: "Please specify GC premises",
            requirementWorkLocationOffsiteSpecific:
              "Please specify offsite locations",
            requirementOthers: null,
            requirementOtherOther: null,
            isTechnologicalChange: "NO",
            hasImpactOnYourDepartment: "NO",
            hasImmediateImpactOnOtherDepartments: "NO",
            hasFutureImpactOnOtherDepartments: "NO",
            operationsConsiderations: null,
            operationsConsiderationsOther: null,
            contractingRationalePrimary: "SHORTAGE_OF_TALENT",
            contractingRationalePrimaryOther: null,
            contractingRationalesSecondary: ["TIMING_REQUIREMENTS"],
            contractingRationalesSecondaryOther: null,
            ocioConfirmedTalentShortage: "YES",
            talentSearchTrackingNumber: "search request tracking number",
            ongoingNeedForKnowledge: "NO",
            knowledgeTransferInContract: "NO",
            employeesHaveAccessToKnowledge: "NO",
            ocioEngagedForTraining: "NO",
          }),
        ).to.be.true;
      });
    });
  });
});
