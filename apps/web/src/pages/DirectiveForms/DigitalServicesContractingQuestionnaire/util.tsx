/* eslint-disable import/prefer-default-export */
import React from "react";

import { Link } from "@gc-digital-talent/ui";
import { DigitalContractingQuestionnaireInput } from "@gc-digital-talent/graphql";
import { emptyToNull } from "@gc-digital-talent/helpers";
import { FormValues } from "./types";

export function buildExternalLink(
  href: string,
  chunks: React.ReactNode,
): React.ReactElement {
  return (
    <Link href={href} external>
      {chunks}
    </Link>
  );
}

// placeholder ID for fake option "other"
export const OTHER_ID = "OTHER";

export function convertFormValuesToApiInput(
  formValues: FormValues,
): DigitalContractingQuestionnaireInput {
  return {
    readPreamble: !!formValues.readPreamble,
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
    // authoritiesInvolved: [ContractAuthority!]
    //   @rename(attribute: "authorities_involved")
    // authorityInvolvedOther: String @rename(attribute: "authority_involved_other")
    // contractBehalfOfGc: YesNoUnsure @rename(attribute: "contract_behalf_of_gc")
    // contractServiceOfGc: YesNoUnsure @rename(attribute: "contract_service_of_gc")
    // contractForDigitalInitiative: YesNoUnsure
    //   @rename(attribute: "contract_for_digital_initiative")
    // digitalInitiativeName: String @rename(attribute: "digital_initiative_name")
    // digitalInitiativePlanSubmitted: YesNoUnsure
    //   @rename(attribute: "digital_initiative_plan_submitted")
    // digitalInitiativePlanUpdated: YesNoUnsure
    //   @rename(attribute: "digital_initiative_plan_updated")
    // digitalInitiativePlanComplemented: YesNoUnsure
    //   @rename(attribute: "digital_initiative_plan_complemented")
    // contractTitle: String @rename(attribute: "contract_title")
    // contractStartDate: Date @rename(attribute: "contract_start_date")
    // contractEndDate: Date @rename(attribute: "contract_end_date")
    // contractExtendable: YesNo @rename(attribute: "contract_extendable")
    // contractAmendable: YesNo @rename(attribute: "contract_amendable")
    // contractMultiyear: YesNo @rename(attribute: "contract_multiyear")
    // contractValue: ContractValueRange @rename(attribute: "contract_value")
    // contractResourcesStartTimeframe: ContractStartTimeframe
    //   @rename(attribute: "contract_resources_start_timeframe")
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
