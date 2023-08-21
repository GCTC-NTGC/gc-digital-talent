import {
  ContractAuthority,
  ContractCommodity,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  DigitalContractingQuestionnaireInput,
  PersonnelLanguage,
  PersonnelOtherRequirement,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  PersonnelWorkLocation,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";
import { emptyToNull, notEmpty } from "@gc-digital-talent/helpers";

import { OTHER_ID, stringToEnum } from "../util";

// backing object for questionnaire form
export type FormValues = {
  // preamble section
  readPreamble: boolean | null | undefined;

  // general information section
  // department: string;
  // departmentOther: string;
  // branchOther: string;
  // businessOwnerName: string;
  // businessOwnerJobTitle: string;
  // businessOwnerEmail: string;
  // financialAuthorityName: string;
  // financialAuthorityJobTitle: string;
  // financialAuthorityEmail: string;
  // authoritiesInvolved: Array<string>;
  // authorityInvolvedOther: string;
  // contractBehalfOfGc: string;
  // contractServiceOfGc: string;
  // contractForDigitalInitiative: string;
  // digitalInitiativeName: string;
  // digitalInitiativePlanSubmitted: string;
  // digitalInitiativePlanUpdated: string;
  // digitalInitiativePlanComplemented: string;

  // scope of contract section
  // contractTitle: string;
  // contractStartDate: string;
  // contractEndDate: string;
  // contractExtendable: string;
  // contractAmendable: string;
  // contractMultiyear: string;
  // contractValue: string;
  // contractResourcesStartTimeframe: string;
  // commodityType: string;
  // commodityTypeOther: string;
  // instrumentType: string;
  // methodOfSupply: string;
  // methodOfSupplyOther: string;
  // solicitationProcedure: string;
  // subjectToTradeAgreement: string;

  // requirements section
  workRequirementDescription: string;
  qualificationRequirement: string;
  requirementAccessToSecure: string;
  requirementScreeningLevels: Array<string>;
  requirementScreeningLevelOther: string;
  requirementWorkLanguages: Array<string>;
  requirementWorkLanguageOther: string;
  requirementWorkLocations: Array<string>;
  requirementWorkLocationGcSpecific: string;
  requirementWorkLocationOffsiteSpecific: string;
  requirementOthers: Array<string>;
  requirementOtherOther: string;

  // personnel requirements section
  hasPersonnelRequirements: string;
  personnelRequirements: Array<{
    resourceType: string;
    // skillRequirements
    language: string;
    languageOther: string;
    security: string;
    securityOther: string;
    telework: string;
    quantity: string;
  }>;
};

export function convertFormValuesToApiInput(
  formValues: FormValues,
): DigitalContractingQuestionnaireInput {
  return {
    // preamble
    readPreamble: !!formValues.readPreamble,

    // general information
    // department:
    //   formValues.department !== OTHER_ID
    //     ? {
    //         connect: formValues.department,
    //       }
    //     : null,
    // departmentOther: emptyToNull(formValues.departmentOther),
    // branchOther: emptyToNull(formValues.branchOther),
    // businessOwnerName: emptyToNull(formValues.businessOwnerName),
    // businessOwnerJobTitle: emptyToNull(formValues.businessOwnerJobTitle),
    // businessOwnerEmail: emptyToNull(formValues.businessOwnerEmail),
    // financialAuthorityName: emptyToNull(formValues.financialAuthorityName),
    // financialAuthorityJobTitle: emptyToNull(formValues.financialAuthorityName),
    // financialAuthorityEmail: emptyToNull(formValues.financialAuthorityEmail),
    // authoritiesInvolved: formValues.authoritiesInvolved
    //   ?.map((a) => stringToEnum(ContractAuthority, a))
    //   ,
    // authorityInvolvedOther: emptyToNull(formValues.authorityInvolvedOther),
    // contractBehalfOfGc: stringToEnum(
    //   YesNoUnsure,
    //   formValues.contractBehalfOfGc,
    // ),
    // contractServiceOfGc: stringToEnum(
    //   YesNoUnsure,
    //   formValues.contractServiceOfGc,
    // ),
    // contractForDigitalInitiative: stringToEnum(
    //   YesNoUnsure,
    //   formValues.contractForDigitalInitiative,
    // ),
    // digitalInitiativeName: emptyToNull(formValues.digitalInitiativeName),
    // digitalInitiativePlanSubmitted: stringToEnum(
    //   YesNoUnsure,
    //   formValues.digitalInitiativePlanSubmitted,
    // ),
    // digitalInitiativePlanUpdated: stringToEnum(
    //   YesNoUnsure,
    //   formValues.digitalInitiativePlanUpdated,
    // ),
    // digitalInitiativePlanComplemented: stringToEnum(
    //   YesNoUnsure,
    //   formValues.digitalInitiativePlanComplemented,
    // ),

    // scope of contract
    // contractTitle: emptyToNull(formValues.contractTitle),
    // contractStartDate: emptyToNull(formValues.contractStartDate),
    // contractEndDate: emptyToNull(formValues.contractEndDate),
    // contractExtendable: stringToEnum(
    //   YesNo,
    //   formValues.contractExtendable,
    // ),
    // contractAmendable: stringToEnum(YesNo, formValues.contractAmendable),
    // contractMultiyear: stringToEnum(YesNo, formValues.contractMultiyear),
    // contractValue: stringToEnum(
    //   ContractValueRange,
    //   formValues.contractValue,
    // ),
    // contractResourcesStartTimeframe: stringToEnum(
    //   ContractStartTimeframe,
    //   formValues.contractResourcesStartTimeframe,
    // ),
    // commodityType: stringToEnum(
    //   ContractCommodity,
    //   formValues.commodityType,
    // ),
    // commodityTypeOther: emptyToNull(formValues.commodityTypeOther),
    // instrumentType: stringToEnum(
    //   ContractInstrument,
    //   formValues.instrumentType,
    // ),
    // methodOfSupply: stringToEnum(
    //   ContractSupplyMethod,
    //   formValues.methodOfSupply,
    // ),
    // methodOfSupplyOther: emptyToNull(formValues.methodOfSupplyOther),
    // solicitationProcedure: stringToEnum(
    //   ContractSolicitationProcedure,
    //   formValues.solicitationProcedure,
    // ),
    // subjectToTradeAgreement: stringToEnum(
    //   YesNoUnsure,
    //   formValues.subjectToTradeAgreement,
    // ),

    // Requirements section
    workRequirementDescription: emptyToNull(
      formValues.workRequirementDescription,
    ),
    qualificationRequirement: emptyToNull(formValues.qualificationRequirement),
    requirementAccessToSecure: stringToEnum(
      YesNo,
      formValues.requirementAccessToSecure,
    ),
    requirementScreeningLevels: formValues.requirementScreeningLevels?.map(
      (a) => stringToEnum(PersonnelScreeningLevel, a),
    ),
    requirementScreeningLevelOther: emptyToNull(
      formValues.requirementScreeningLevelOther,
    ),
    requirementWorkLanguages: formValues.requirementWorkLanguages?.map((a) =>
      stringToEnum(PersonnelLanguage, a),
    ),
    requirementWorkLanguageOther: emptyToNull(
      formValues.requirementWorkLanguageOther,
    ),
    requirementWorkLocations: formValues.requirementWorkLocations?.map((a) =>
      stringToEnum(PersonnelWorkLocation, a),
    ),
    requirementWorkLocationGcSpecific: emptyToNull(
      formValues.requirementWorkLocationGcSpecific,
    ),
    requirementWorkLocationOffsiteSpecific: emptyToNull(
      formValues.requirementWorkLocationOffsiteSpecific,
    ),
    requirementOthers: formValues.requirementOthers?.map((a) =>
      stringToEnum(PersonnelOtherRequirement, a),
    ),
    requirementOtherOther: emptyToNull(formValues.requirementOtherOther),

    // Personnel requirements section
    hasPersonnelRequirements: stringToEnum(
      YesNo,
      formValues.hasPersonnelRequirements,
    ),
    personnelRequirements: {
      create: formValues.personnelRequirements.map((requirement) => {
        return {
          resourceType: requirement.resourceType,
          language: stringToEnum(PersonnelLanguage, requirement.language),
          languageOther: emptyToNull(requirement.languageOther),
          security: stringToEnum(PersonnelScreeningLevel, requirement.security),
          securityOther: emptyToNull(requirement.securityOther),
          telework: stringToEnum(PersonnelTeleworkOption, requirement.telework),
          quantity: parseInt(requirement.quantity, 10) ?? null,
        };
      }),
    },
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
