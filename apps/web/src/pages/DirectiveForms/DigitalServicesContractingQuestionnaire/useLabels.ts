import { IntlShape, useIntl } from "react-intl";

import { FieldLabels } from "@gc-digital-talent/forms";

const getLabels = (intl: IntlShape) => {
  return {
    // Preamble section
    readPreamble: intl.formatMessage({
      defaultMessage: "I have read the preamble.",
      id: "xj7X6V",
      description:
        "Preamble confirmation statement of the _digital services contracting questionnaire_",
    }),

    // General information section
    department: intl.formatMessage({
      defaultMessage: "Select your department or agency",
      id: "fSEfTI",
      description:
        "Label for _department / agency_ field in the _digital services contracting questionnaire_",
    }),
    departmentOther: intl.formatMessage({
      defaultMessage: "Please specify your department or agency",
      id: "BJ38Kf",
      description:
        "Label for _ other department / agency_ field in the _digital services contracting questionnaire_",
    }),
    branchOther: intl.formatMessage({
      defaultMessage: "Branch",
      id: "FXJMDV",
      description:
        "Label for _branch_ field in the _digital services contracting questionnaire_",
    }),
    businessOwnerName: intl.formatMessage({
      defaultMessage: "Name",
      id: "AkuIfT",
      description:
        "Label for _business owner name_ field in the _digital services contracting questionnaire_",
    }),
    businessOwnerJobTitle: intl.formatMessage({
      defaultMessage: "Job title",
      id: "HBuWZ0",
      description: "Title for job title for a position",
    }),
    businessOwnerEmail: intl.formatMessage({
      defaultMessage: "Email",
      id: "sg9olk",
      description:
        "Label for _business owner email_ field in the _digital services contracting questionnaire_",
    }),
    financialAuthorityName: intl.formatMessage({
      defaultMessage: "Name",
      id: "ttIQ0Q",
      description:
        "Label for _financial authority name_ field in the _digital services contracting questionnaire_",
    }),
    financialAuthorityJobTitle: intl.formatMessage({
      defaultMessage: "Job title",
      id: "HBuWZ0",
      description: "Title for job title for a position",
    }),
    financialAuthorityEmail: intl.formatMessage({
      defaultMessage: "Email",
      id: "51Hc86",
      description:
        "Label for _financial authority email_ field in the _digital services contracting questionnaire_",
    }),
    isAuthorityInvolved: intl.formatMessage({
      defaultMessage:
        "Are there any other authorities involved or engaged on this contract?",
      id: "2QDT5C",
      description:
        "Label for _ is authorities involved_ fieldset in the _digital services contracting questionnaire_",
    }),
    authoritiesInvolved: intl.formatMessage({
      defaultMessage: "Other authorities involved / engaged on this contract",
      id: "nfcDvX",
      description:
        "Label for _authorities involved_ fieldset in the _digital services contracting questionnaire_",
    }),
    authorityInvolvedOther: intl.formatMessage({
      defaultMessage: "Please specify the authority",
      id: "uIWCnb",
      description:
        "Label for _other authorities involved_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractBehalfOfGc: intl.formatMessage({
      defaultMessage:
        "Is this contract being put in place on behalf of another Government of Canada department or agency?",
      id: "KifUVY",
      description:
        "Label for _contract on behalf of gc_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractServiceOfGc: intl.formatMessage({
      defaultMessage:
        "Is this contract being put in place for the purpose of service provision to another Government of Canada department or agency?",
      id: "u42Yks",
      description:
        "Label for _contract of service to gc_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractForDigitalInitiative: intl.formatMessage({
      defaultMessage:
        "Is this contract related to a specific digital initiative?",
      id: "ci72ST",
      description:
        "Label for _contract for digital initiative_ fieldset in the _digital services contracting questionnaire_",
    }),
    digitalInitiativeName: intl.formatMessage({
      defaultMessage: "Name of the digital initiative",
      id: "6ntAxU",
      description:
        "Label for _name of digital initiative_ field in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
    }),
    digitalInitiativePlanSubmitted: intl.formatMessage({
      defaultMessage:
        "Has a digital initiative forward talent plan been submitted previously for the initiative?",
      id: "aH4Suk",
      description:
        "Label for _digital initiative plan submitted_ fieldset in the _digital services contracting questionnaire_",
    }),
    digitalInitiativePlanUpdated: intl.formatMessage({
      defaultMessage:
        "Has the plan been updated when the contract is initiated?",
      id: "siF4qC",
      description:
        "Label for _digital initiative plan updated_ fieldset in the _digital services contracting questionnaire_",
    }),
    digitalInitiativePlanComplemented: intl.formatMessage({
      defaultMessage:
        "Does this procurement complement other talent sourcing activities (e.g. staffing, training) for this initiative?",
      id: "qRPPY2",
      description:
        "Label for _digital initiative plan complemented_ fieldset in the _digital services contracting questionnaire_",
    }),

    // Scope of contract section
    contractTitle: intl.formatMessage({
      defaultMessage: "Contract title",
      id: "Cl3GCt",
      description:
        "Label for _contract title_ field in the _digital services contracting questionnaire_",
    }),
    contractStartDate: intl.formatMessage({
      defaultMessage: "Expected start date of the contract",
      id: "/Oq5UR",
      description:
        "Label for _contract start date_ field in the _digital services contracting questionnaire_",
    }),
    contractEndDate: intl.formatMessage({
      defaultMessage: "Expected end date of the contract",
      id: "bIdalW",
      description:
        "Label for _contract end date_ field in the _digital services contracting questionnaire_",
    }),
    contractExtendable: intl.formatMessage({
      defaultMessage:
        "Is the option to extend the contract currently scoped in?",
      id: "Kss450",
      description:
        "Label for _contract extendable_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractAmendable: intl.formatMessage({
      defaultMessage:
        "Is the option to amend the contract currently scoped in?",
      id: "pjTZQr",
      description:
        "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractMultiyear: intl.formatMessage({
      defaultMessage: "Is this a multi-year contract?",
      id: "by9soK",
      description:
        "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractValue: intl.formatMessage({
      defaultMessage: "Select the total contract value of this contract",
      id: "FMJiDY",
      description:
        "Label for _contract value_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractFtes: intl.formatMessage({
      defaultMessage:
        "In terms of full-time-equivalents (FTEs), the estimated total number of resources expected from the contract, or required to produce contract deliverables",
      id: "G8cmgj",
      description:
        "Label for _contract FTEs_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractResourcesStartTimeframe: intl.formatMessage({
      defaultMessage: "Contract resources expected to start work in",
      id: "5GUCh4",
      description:
        "Label for _contract start timeframe_ fieldset in the _digital services contracting questionnaire_",
    }),
    commodityType: intl.formatMessage({
      defaultMessage: "Commodity type",
      id: "lDRl7g",
      description:
        "Label for _commodity type_ fieldset in the _digital services contracting questionnaire_",
    }),
    commodityTypeOther: intl.formatMessage({
      defaultMessage: "Please specify the commodity",
      id: "BfU5BR",
      description:
        "Label for _other commodity type_ fieldset in the _digital services contracting questionnaire_",
    }),
    instrumentType: intl.formatMessage({
      defaultMessage: "Instrument type",
      id: "5pyCTN",
      description:
        "Label for _instrument type_ fieldset in the _digital services contracting questionnaire_",
    }),
    instrumentTypeOther: intl.formatMessage({
      defaultMessage: "Please specify the instrument",
      id: "z5YYOk",
      description:
        "Label for _instrument type other_ fieldset in the _digital services contracting questionnaire_",
    }),
    methodOfSupply: intl.formatMessage({
      defaultMessage: "Method of supply",
      id: "YRZ5Cx",
      description:
        "Label for _method of supply_ fieldset in the _digital services contracting questionnaire_",
    }),
    methodOfSupplyOther: intl.formatMessage({
      defaultMessage: "Please specify the method",
      id: "4QXiPk",
      description:
        "Label for _other method of supply_ fieldset in the _digital services contracting questionnaire_",
    }),
    solicitationProcedure: intl.formatMessage({
      defaultMessage: "Solicitation procedure",
      id: "GsHDxH",
      description:
        "Label for _solicitation procedure_ fieldset in the _digital services contracting questionnaire_",
    }),
    subjectToTradeAgreement: intl.formatMessage({
      defaultMessage:
        "Select whether this contract is subject to any trade agreements",
      id: "lYLIe5",
      description:
        "Label for _trade agreement_ fieldset in the _digital services contracting questionnaire_",
    }),

    // Requirements section
    workRequirementDescription: intl.formatMessage({
      defaultMessage:
        "List the tasks that the contractor is expected to perform within the contract.",
      id: "D3UXq2",
      description:
        "Label for _work requirement description_ textbox in the _digital services contracting questionnaire_",
    }),
    requirementAccessToSecure: intl.formatMessage({
      defaultMessage:
        "Will the supplier and its employees require access to protected and/or classified information or assets?",
      id: "glDA2j",
      description:
        "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementScreeningLevels: intl.formatMessage({
      defaultMessage:
        "Select the personnel security screening level required for the contractor",
      id: "RvG69R",
      description:
        "Label for _contractor screening levels_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementScreeningLevelOther: intl.formatMessage({
      defaultMessage: "Please specify the screening level",
      id: "76vo/V",
      description:
        "Label for _other contractor screening levels_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementWorkLanguages: intl.formatMessage({
      defaultMessage:
        "Select the language which the work will be performed and delivered in.",
      id: "yGyjXK",
      description:
        "Label for _required work languages_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementWorkLanguageOther: intl.formatMessage({
      defaultMessage: "Please specify the language of work",
      id: "BSkVBd",
      description:
        "Label for _other required work languages_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementWorkLocations: intl.formatMessage({
      defaultMessage:
        "Select the geographic location where the work is to be performed.",
      id: "mNfi9b",
      description:
        "Label for _required work locations_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementWorkLocationGcSpecific: intl.formatMessage({
      defaultMessage: "Please specify GC premises",
      id: "WHkMFr",
      description:
        "Label for _gc specific work locations_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementWorkLocationOffsiteSpecific: intl.formatMessage({
      defaultMessage: "Please specify offsite locations",
      id: "X+IHFX",
      description:
        "Label for _offsite specific work locations_ fieldset in the _digital services contracting questionnaire_",
    }),
    hasPersonnelRequirements: intl.formatMessage({
      defaultMessage: "Does the contract have specific personnel requirements?",
      id: "uK+4La",
      description:
        "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
    }),
    qualificationRequirement: intl.formatMessage({
      defaultMessage: "Qualification requirement",
      id: "8v/v3u",
      description:
        "Label for _qualification requirement_ textbox in the _digital services contracting questionnaire_",
    }),

    // Personnel requirements section
    "personnelRequirements.*.resourceType": intl.formatMessage({
      defaultMessage: "Type of personnel",
      id: "Yik/xN",
      description:
        "Label for _type of resource_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.language": intl.formatMessage({
      defaultMessage: "Official language requirement",
      id: "gZKJeF",
      description:
        "Label for _official language requirement_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.languageOther": intl.formatMessage({
      defaultMessage: "Please specify the language requirement",
      id: "P6jGb4",
      description:
        "Label for _other official language requirement_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.security": intl.formatMessage({
      defaultMessage: "Security level",
      id: "zemp3H",
      description:
        "Label for _security level_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.securityOther": intl.formatMessage({
      defaultMessage: "Please specify the security level",
      id: "yXWaAj",
      description:
        "Label for _other security level_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.telework": intl.formatMessage({
      defaultMessage: "Telework allowed",
      id: "DeQTkE",
      description:
        "Label for _telework option_ fieldset in the _digital services contracting questionnaire_",
    }),
    "personnelRequirements.*.quantity": intl.formatMessage({
      defaultMessage: "Quantity",
      id: "5yv4Ko",
      description:
        "Label for _quantity of personnel_ field in the _digital services contracting questionnaire_",
    }),

    hasOtherRequirements: intl.formatMessage({
      defaultMessage:
        "Are there other requirements (e.g., shift work, on-call 24/7, as and when needed, overtime, etc.) for this contract?",
      id: "Y9N3Fw",
      description:
        "Label for _has other requirements_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementOthers: intl.formatMessage({
      defaultMessage: "Select all the other requirements that apply.",
      id: "52MYM4",
      description:
        "Label for _other requirements_ fieldset in the _digital services contracting questionnaire_",
    }),
    requirementOtherOther: intl.formatMessage({
      defaultMessage: "Please specify the other requirement",
      id: "guIFRq",
      description:
        "Label for _other other requirements_ fieldset in the _digital services contracting questionnaire_",
    }),

    // Technological change section
    isTechnologicalChange: intl.formatMessage({
      defaultMessage:
        'Select "yes" if any of the listed technological change factors apply.',
      id: "AinG8I",
      description:
        "Label for _is technological change_ field in the _digital services contracting questionnaire_",
    }),
    hasImpactOnYourDepartment: intl.formatMessage({
      defaultMessage:
        "Do you expect this contract to have immediate impacts on your department in terms of staffing level or skill sets required?",
      id: "kMpqRq",
      description:
        "Label for _has impact on your department_ fieldset in the _digital services contracting questionnaire_",
    }),
    hasImmediateImpactOnOtherDepartments: intl.formatMessage({
      defaultMessage:
        "Do you expect any potential immediate carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required?",
      id: "gsaza3",
      description:
        "Label for _has immediate impact on other departments_ fieldset in the _digital services contracting questionnaire_",
    }),
    hasFutureImpactOnOtherDepartments: intl.formatMessage({
      defaultMessage:
        "Do you expect any potential long-term carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required?",
      id: "0aU6BD",
      description:
        "Label for _has future impact on other departments_ fieldset in the _digital services contracting questionnaire_",
    }),

    // Operations considerations
    hasOperationsConsiderations: intl.formatMessage({
      defaultMessage:
        "Do any of the listed operational factors influence the decision to contract?",
      id: "NDkViv",
      description:
        "Label for _has operations considerations_ fieldset in the _digital services contracting questionnaire_",
    }),
    operationsConsiderations: intl.formatMessage({
      defaultMessage:
        "Select all the factors that have influenced the decision to contract.",
      id: "E3lQMA",
      description:
        "Label for _operations considerations_ fieldset in the _digital services contracting questionnaire_",
    }),
    operationsConsiderationsOther: intl.formatMessage({
      defaultMessage: "Please specify the factor",
      id: "1MtuHa",
      description:
        "Label for _other operations considerations_ fieldset in the _digital services contracting questionnaire_",
    }),

    // Talent sourcing decision
    contractingRationalePrimary: intl.formatMessage({
      defaultMessage: "Select the primary rationale",
      id: "dwFVEN",
      description:
        "Label for _primary contracting rationale_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractingRationalePrimaryOther: intl.formatMessage({
      defaultMessage: "Please specify the other primary rationale",
      id: "VYzixZ",
      description:
        "Label for _an other contracting rationale_ field in the _digital services contracting questionnaire_",
    }),
    ocioConfirmedTalentShortage: intl.formatMessage({
      defaultMessage:
        "Has OCIO confirmed that there is no available pre-qualified talent in an OCIO-coordinated talent pool that could meet the need in the timeframe provided?",
      id: "Jehcen",
      description:
        "Label for _OCIO confirmed talent shortage_ field in the _digital services contracting questionnaire_",
    }),
    talentSearchTrackingNumber: intl.formatMessage({
      defaultMessage: "GC Digital Talent search request tracking number",
      id: "dVlECR",
      description:
        "Label for _talent search tracking number_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractingRationalesSecondary: intl.formatMessage({
      defaultMessage: "Identify any secondary rationales",
      id: "ckDYuu",
      description:
        "Label for _secondary contracting rationales_ fieldset in the _digital services contracting questionnaire_",
    }),
    contractingRationalesSecondaryOther: intl.formatMessage({
      defaultMessage: "Please specify the other secondary rationale",
      id: "8ownC2",
      description:
        "Label for _an other contracting rationale_ field in the _digital services contracting questionnaire_",
    }),
    ongoingNeedForKnowledge: intl.formatMessage({
      defaultMessage:
        "Will there be an ongoing need for the knowledge or skill sets in the work unit for which the contractor is being engaged?",
      id: "R5eNu/",
      description:
        "Label for _ongoing need for knowledge_ fieldset in the _digital services contracting questionnaire_",
    }),
    knowledgeTransferInContract: intl.formatMessage({
      defaultMessage:
        "Has knowledge transfer from the contractor to the government work unit been built into the contract?",
      id: "IjBtl5",
      description:
        "Label for _knowledge transfer in contract_ fieldset in the _digital services contracting questionnaire_",
    }),
    employeesHaveAccessToKnowledge: intl.formatMessage({
      defaultMessage:
        "Will employees have access to training and development for the knowledge or skill sets required in the contract?",
      id: "dD3S0i",
      description:
        "Label for _employees have access to knowledge_ fieldset in the _digital services contracting questionnaire_",
    }),
    ocioEngagedForTraining: intl.formatMessage({
      defaultMessage:
        "Has OCIO been engaged on connecting employees to training and development opportunities related to the requirements in this contract, if appropriate?",
      id: "KcvmuN",
      description:
        "Label for _OCIO engaged for training_ fieldset in the _digital services contracting questionnaire_",
    }),
  } as const;
};

const useLabels = () => {
  const intl = useIntl();
  const labels = getLabels(intl) satisfies FieldLabels;
  return labels;
};

export default useLabels;
