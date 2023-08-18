/* eslint-disable import/prefer-default-export */
import React from "react";

import { Link } from "@gc-digital-talent/ui";
import {
  ContractAuthority,
  ContractStartTimeframe,
  ContractValueRange,
  DigitalContractingQuestionnaireInput,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";
import { emptyToNull, notEmpty } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

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

// custom type guard for enum value
function isEnumValue<T extends object>(
  typeObject: T,
  value: unknown,
): value is T[keyof T] {
  return Object.values(typeObject).includes(value as T[keyof T]);
}

// helper function to validate enum value at runtime
function stringToEnumOrNull<T extends object>(
  typeObject: T,
  value: string,
): T[keyof T] | null {
  if (value === null) return null;
  if (value === undefined) return null;
  if (isEnumValue(typeObject, value)) return value;
  defaultLogger.error(
    `Unable to convert value "${value}" to enum of ${Object.values(
      typeObject,
    ).join(", ")}`,
  );
  return null;
}

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

export function enumToOptions<T extends object>(
  typeObject: T,
  sortOrder?: Array<T[keyof T]>,
): { value: T[keyof T]; label: string }[] {
  const entries = Object.entries(typeObject);
  if (sortOrder) {
    entries.sort((a, b) => {
      const aPosition = sortOrder.indexOf(a[1]);
      const bPosition = sortOrder.indexOf(b[1]);
      if (aPosition >= 0 && bPosition >= 0)
        // both are in sort list => sort by by that order
        return sortOrder.indexOf(a[1]) - sortOrder.indexOf(b[1]);
      if (aPosition >= 0 && bPosition < 0)
        // only a is in sort list => sort a before b
        return -1;
      if (aPosition < 0 && bPosition >= 0)
        // only b is in sort list => sort b before a
        return 1;
      // neither is in sort list => keep original order
      return 0;
    });
  }
  const options: { value: T[keyof T]; label: string }[] = entries.reduce(
    (accumulator: { value: T[keyof T]; label: string }[], currentValue) => {
      return [
        ...accumulator,
        { value: currentValue[1], label: currentValue[0] },
      ];
    },
    [],
  );
  return options;
}
