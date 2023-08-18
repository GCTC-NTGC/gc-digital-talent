import {
  ContractAuthority,
  ContractStartTimeframe,
  ContractValueRange,
  DigitalContractingQuestionnaireInput,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";
import { emptyToNull, notEmpty } from "@gc-digital-talent/helpers";
import { OTHER_ID, stringToEnumOrNull } from "../util";

// backing object for questionnaire form
export type FormValues = {
  // preamble section
  readPreamble: boolean | null | undefined;

  // general information section
  department: string;
  departmentOther: string;
  branchOther: string;
  businessOwnerName: string;
  businessOwnerJobTitle: string;
  businessOwnerEmail: string;
  financialAuthorityName: string;
  financialAuthorityJobTitle: string;
  financialAuthorityEmail: string;
  authoritiesInvolved: Array<string>;
  authorityInvolvedOther: string;
  contractBehalfOfGc: string;
  contractServiceOfGc: string;
  contractForDigitalInitiative: string;
  digitalInitiativeName: string;
  digitalInitiativePlanSubmitted: string;
  digitalInitiativePlanUpdated: string;
  digitalInitiativePlanComplemented: string;

  // scope of contract section
  contractTitle: string;
  contractStartDate: string;
  contractEndDate: string;
  contractExtendable: string;
  contractAmendable: string;
  contractMultiyear: string;
  contractValue: string;
  contractResourcesStartTimeframe: string;
};

export function convertFormValuesToApiInput(
  formValues: FormValues,
): DigitalContractingQuestionnaireInput {
  return {
    // preamble
    readPreamble: !!formValues.readPreamble,

    // general information
    department:
      formValues.department !== OTHER_ID
        ? {
            connect: formValues.department,
          }
        : null,
    departmentOther: emptyToNull(formValues.departmentOther),
    branchOther: emptyToNull(formValues.branchOther),
    businessOwnerName: emptyToNull(formValues.businessOwnerName),
    businessOwnerJobTitle: emptyToNull(formValues.businessOwnerJobTitle),
    businessOwnerEmail: emptyToNull(formValues.businessOwnerEmail),
    financialAuthorityName: emptyToNull(formValues.financialAuthorityName),
    financialAuthorityJobTitle: emptyToNull(formValues.financialAuthorityName),
    financialAuthorityEmail: emptyToNull(formValues.financialAuthorityEmail),
    authoritiesInvolved: formValues.authoritiesInvolved
      ?.map((a) => stringToEnumOrNull(ContractAuthority, a))
      .filter(notEmpty),
    authorityInvolvedOther: emptyToNull(formValues.authorityInvolvedOther),
    contractBehalfOfGc: stringToEnumOrNull(
      YesNoUnsure,
      formValues.contractBehalfOfGc,
    ),
    contractServiceOfGc: stringToEnumOrNull(
      YesNoUnsure,
      formValues.contractServiceOfGc,
    ),
    contractForDigitalInitiative: stringToEnumOrNull(
      YesNoUnsure,
      formValues.contractForDigitalInitiative,
    ),
    digitalInitiativeName: emptyToNull(formValues.digitalInitiativeName),
    digitalInitiativePlanSubmitted: stringToEnumOrNull(
      YesNoUnsure,
      formValues.digitalInitiativePlanSubmitted,
    ),
    digitalInitiativePlanUpdated: stringToEnumOrNull(
      YesNoUnsure,
      formValues.digitalInitiativePlanUpdated,
    ),
    digitalInitiativePlanComplemented: stringToEnumOrNull(
      YesNoUnsure,
      formValues.digitalInitiativePlanComplemented,
    ),

    // scope of contract
    contractTitle: emptyToNull(formValues.contractTitle),
    contractStartDate: emptyToNull(formValues.contractStartDate),
    contractEndDate: emptyToNull(formValues.contractEndDate),
    contractExtendable: stringToEnumOrNull(
      YesNo,
      formValues.contractExtendable,
    ),
    contractAmendable: stringToEnumOrNull(YesNo, formValues.contractAmendable),
    contractMultiyear: stringToEnumOrNull(YesNo, formValues.contractMultiyear),
    contractValue: stringToEnumOrNull(
      ContractValueRange,
      formValues.contractValue,
    ),
    contractResourcesStartTimeframe: stringToEnumOrNull(
      ContractStartTimeframe,
      formValues.contractResourcesStartTimeframe,
    ),

    // commodityType: ContractCommodity @rename(attribute: "commodity_type")
    // commodityTypeOther: String @rename(attribute: "commodity_type_other")
    // instrumentType: ContractInstrument @rename(attribute: "instrument_type")
    // methodOfSupply: ContractSupplyMethod @rename(attribute: "method_of_supply")
    // methodOfSupplyOther: String @rename(attribute: "method_of_supply_other")
    // solicitationProcedure: ContractSolicitationProcedure
    //   @rename(attribute: "solicitation_procedure")
    // subjectToTradeAgreement: YesNoUnsure
    //   @rename(attribute: "subject_to_trade_agreement")
    // workRequirementDescription: String
    //   @rename(attribute: "work_requirement_description")
    // qualificationRequirement: String
    //   @rename(attribute: "qualification_requirement")
    // requirementAccessToSecure: YesNoUnsure
    //   @rename(attribute: "requirement_access_to_secure")
    // requirementScreeningLevels: [PersonnelScreeningLevel!]
    //   @rename(attribute: "requirement_screening_levels")
    // requirementScreeningLevelOther: String
    //   @rename(attribute: "requirement_screening_level_other")
    // requirementWorkLanguages: [PersonnelLanguage!]
    //   @rename(attribute: "requirement_work_languages")
    // requirementWorkLanguageOther: String
    //   @rename(attribute: "requirement_work_language_other")
    // requirementWorkLocations: [PersonnelWorkLocation!]
    //   @rename(attribute: "requirement_work_locations")
    // requirementWorkLocationSpecific: String
    //   @rename(attribute: "requirement_work_location_specific")
    // requirementOthers: [PersonnelOtherRequirement!]
    //   @rename(attribute: "requirement_others")
    // requirementOtherOther: String @rename(attribute: "requirement_other_other")
    // hasPersonnelRequirements: YesNo
    //   @rename(attribute: "has_personnel_requirements")
    // personnelRequirements: DigitalContractingPersonnelRequirementBelongsToMany
    // isTechnologicalChange: YesNo @rename(attribute: "is_technological_change")
    // hasImpactOnYourDepartment: YesNo
    //   @rename(attribute: "has_impact_on_your_department")
    // hasImmediateImpactOnOtherDepartments: YesNo
    //   @rename(attribute: "has_immediate_impact_on_other_departments")
    // hasFutureImpactOnOtherDepartments: YesNo
    //   @rename(attribute: "has_immediate_impact_on_other_departments")
    // operationsConsiderations: [OperationsConsideration!]
    //   @rename(attribute: "operations_considerations")
    // operationsConsiderationsOther: String
    //   @rename(attribute: "operations_considerations_other")
    // contractingRationalePrimary: ContractingRationale
    //   @rename(attribute: "contracting_rationale_primary")
    // contractingRationalePrimaryOther: String
    //   @rename(attribute: "contracting_rationale_primary_other")
    // contractingRationalesSecondary: [ContractingRationale!]
    //   @rename(attribute: "contracting_rationales_secondary")
    // contractingRationalesSecondaryOther: String
    //   @rename(attribute: "contracting_rationales_secondary_other")
    // ocioConfirmedTalentShortage: YesNo
    //   @rename(attribute: "ocio_confirmed_talent_shortage")
    // talentSearchTrackingNumber: String
    //   @rename(attribute: "talent_search_tracking_number")
    // ongoingNeedForKnowledge: YesNo
    //   @rename(attribute: "ongoing_need_for_knowledge")
    // knowledgeTransferInContract: YesNo
    //   @rename(attribute: "knowledge_transfer_in_contract")
    // employeesHaveAccessToKnowledge: YesNo
    //   @rename(attribute: "employees_have_access_to_knowledge")
    // ocioEngagedForTraining: YesNo @rename(attribute: "ocio_engaged_for_training");
  };
}
