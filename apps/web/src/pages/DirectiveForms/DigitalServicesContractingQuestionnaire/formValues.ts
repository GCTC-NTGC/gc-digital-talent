import { emptyToNull } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";
import {
  ContractAuthority,
  ContractCommodity,
  ContractingRationale,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  ContractFteRange,
  DigitalContractingQuestionnaireInput,
  OperationsConsideration,
  PersonnelLanguage,
  PersonnelOtherRequirement,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  PersonnelWorkLocation,
  SkillLevel,
  YesNo,
  YesNoUnsure,
  Maybe,
} from "@gc-digital-talent/graphql";

import { OTHER_ID, stringToEnum } from "../util";

export interface SkillRequirementFormValues {
  skillId: string;
  level: string;
}

export function isSkillRequirementFormValues(
  value: unknown,
): value is SkillRequirementFormValues {
  const castedValue = value as SkillRequirementFormValues;
  return (
    castedValue.skillId !== undefined &&
    typeof castedValue.skillId === "string" &&
    castedValue.level !== undefined &&
    typeof castedValue.level === "string"
  );
}

function parseFormStringField(field: Maybe<string>): string | null {
  return emptyToNull(field);
}

function parseFormIntField(field: Maybe<string>): number | null {
  if (field === null || field === undefined) {
    return null;
  }
  const parsedInt = parseInt(field, 10);
  if (Number.isInteger(parsedInt)) {
    return parsedInt;
  }
  defaultLogger.error(`Failed to parse ${field} to number`);
  return null;
}

function parseFormEnumField<T extends object>(
  typeObject: T,
  field: Maybe<string>,
): ReturnType<typeof stringToEnum> | null {
  if (field === null || field === undefined) {
    return null;
  }
  return stringToEnum(typeObject, field);
}

function parseFormEnumArrayField<T extends object>(
  typeObject: T,
  field: Maybe<string[]>,
): ReturnType<typeof stringToEnum>[] | null {
  if (field === null || field === undefined) {
    return null;
  }
  return field.map((item) => parseFormEnumField(typeObject, item));
}

export interface PersonnelRequirementFormValues {
  resourceType: Maybe<string>;
  skillRequirements: Maybe<SkillRequirementFormValues[]>;
  language: Maybe<string>;
  languageOther: Maybe<string>;
  security: Maybe<string>;
  securityOther: Maybe<string>;
  telework: Maybe<string>;
  quantity: Maybe<string>;
}

// backing object for questionnaire form
export interface FormValues {
  // preamble section
  readPreamble: Maybe<boolean>;

  // general information section
  department: Maybe<string>;
  departmentOther: Maybe<string>;
  branchOther: Maybe<string>;
  businessOwnerName: Maybe<string>;
  businessOwnerJobTitle: Maybe<string>;
  businessOwnerEmail: Maybe<string>;
  financialAuthorityName: Maybe<string>;
  financialAuthorityJobTitle: Maybe<string>;
  financialAuthorityEmail: Maybe<string>;
  isAuthorityInvolved: Maybe<string>;
  authoritiesInvolved: Maybe<string[]>;
  authorityInvolvedOther: Maybe<string>;
  contractBehalfOfGc: Maybe<string>;
  contractServiceOfGc: Maybe<string>;
  contractForDigitalInitiative: Maybe<string>;
  digitalInitiativeName: Maybe<string>;
  digitalInitiativePlanSubmitted: Maybe<string>;
  digitalInitiativePlanUpdated: Maybe<string>;
  digitalInitiativePlanComplemented: Maybe<string>;

  // scope of contract section
  contractTitle: Maybe<string>;
  contractStartDate: Maybe<string>;
  contractEndDate: Maybe<string>;
  contractExtendable: Maybe<string>;
  contractAmendable: Maybe<string>;
  contractMultiyear: Maybe<string>;
  contractValue: Maybe<string>;
  contractFtes: Maybe<string>;
  contractResourcesStartTimeframe: Maybe<string>;
  commodityType: Maybe<string>;
  commodityTypeOther: Maybe<string>;
  instrumentType: Maybe<string>;
  instrumentTypeOther: Maybe<string>;
  methodOfSupply: Maybe<string>;
  methodOfSupplyOther: Maybe<string>;
  solicitationProcedure: Maybe<string>;
  subjectToTradeAgreement: Maybe<string>;

  // requirements section
  workRequirementDescription: Maybe<string>;

  // personnel requirements section
  hasPersonnelRequirements: Maybe<string>;
  personnelRequirements:
    | PersonnelRequirementFormValues[]
    | null
    | undefined;
  qualificationRequirement: Maybe<string>;
  requirementAccessToSecure: Maybe<string>;
  requirementScreeningLevels: Maybe<string[]>;
  requirementScreeningLevelOther: Maybe<string>;
  requirementWorkLanguages: Maybe<string[]>;
  requirementWorkLanguageOther: Maybe<string>;
  requirementWorkLocations: Maybe<string[]>;
  requirementWorkLocationGcSpecific: Maybe<string>;
  requirementWorkLocationOffsiteSpecific: Maybe<string>;

  hasOtherRequirements: Maybe<string>;
  requirementOthers: Maybe<string[]>;
  requirementOtherOther: Maybe<string>;

  // technological change section
  isTechnologicalChange: Maybe<string>;
  hasImpactOnYourDepartment: Maybe<string>;
  hasImmediateImpactOnOtherDepartments: Maybe<string>;
  hasFutureImpactOnOtherDepartments: Maybe<string>;

  // operations considerations section
  hasOperationsConsiderations: Maybe<string>;
  operationsConsiderations: Maybe<string[]>;
  operationsConsiderationsOther: Maybe<string>;

  // Talent sourcing decision section
  contractingRationalePrimary: Maybe<string>;
  contractingRationalePrimaryOther: Maybe<string>;
  contractingRationalesSecondary: Maybe<string[]>;
  contractingRationalesSecondaryOther: Maybe<string>;
  ocioConfirmedTalentShortage: Maybe<string>;
  talentSearchTrackingNumber: Maybe<string>;
  ongoingNeedForKnowledge: Maybe<string>;
  knowledgeTransferInContract: Maybe<string>;
  employeesHaveAccessToKnowledge: Maybe<string>;
  ocioEngagedForTraining: Maybe<string>;
}

export function convertFormValuesToApiInput(
  formValues: FormValues,
): DigitalContractingQuestionnaireInput {
  return {
    // preamble not sent to api

    // general information
    department:
      formValues.department !== OTHER_ID
        ? {
            connect: formValues.department,
          }
        : null,
    departmentOther: parseFormStringField(formValues.departmentOther),
    branchOther: parseFormStringField(formValues.branchOther),
    businessOwnerName: parseFormStringField(formValues.businessOwnerName),
    businessOwnerJobTitle: parseFormStringField(
      formValues.businessOwnerJobTitle,
    ),
    businessOwnerEmail: parseFormStringField(formValues.businessOwnerEmail),
    financialAuthorityName: parseFormStringField(
      formValues.financialAuthorityName,
    ),
    financialAuthorityJobTitle: parseFormStringField(
      formValues.financialAuthorityJobTitle,
    ),
    financialAuthorityEmail: parseFormStringField(
      formValues.financialAuthorityEmail,
    ),
    // otherAuthoritiesInvolved not sent to api
    authoritiesInvolved: parseFormEnumArrayField(
      ContractAuthority,
      formValues.authoritiesInvolved,
    ),
    authorityInvolvedOther: parseFormStringField(
      formValues.authorityInvolvedOther,
    ),
    contractBehalfOfGc: parseFormEnumField(
      YesNoUnsure,
      formValues.contractBehalfOfGc,
    ),
    contractServiceOfGc: parseFormEnumField(
      YesNoUnsure,
      formValues.contractServiceOfGc,
    ),
    contractForDigitalInitiative: parseFormEnumField(
      YesNoUnsure,
      formValues.contractForDigitalInitiative,
    ),
    digitalInitiativeName: parseFormStringField(
      formValues.digitalInitiativeName,
    ),
    digitalInitiativePlanSubmitted: parseFormEnumField(
      YesNoUnsure,
      formValues.digitalInitiativePlanSubmitted,
    ),
    digitalInitiativePlanUpdated: parseFormEnumField(
      YesNoUnsure,
      formValues.digitalInitiativePlanUpdated,
    ),
    digitalInitiativePlanComplemented: parseFormEnumField(
      YesNoUnsure,
      formValues.digitalInitiativePlanComplemented,
    ),

    // scope of contract
    contractTitle: parseFormStringField(formValues.contractTitle),
    contractStartDate: parseFormStringField(formValues.contractStartDate),
    contractEndDate: parseFormStringField(formValues.contractEndDate),
    contractExtendable: parseFormEnumField(
      YesNo,
      formValues.contractExtendable,
    ),
    contractAmendable: parseFormEnumField(YesNo, formValues.contractAmendable),
    contractMultiyear: parseFormEnumField(YesNo, formValues.contractMultiyear),
    contractValue: parseFormEnumField(
      ContractValueRange,
      formValues.contractValue,
    ),
    contractFtes: parseFormEnumField(ContractFteRange, formValues.contractFtes),
    contractResourcesStartTimeframe: parseFormEnumField(
      ContractStartTimeframe,
      formValues.contractResourcesStartTimeframe,
    ),
    commodityType: parseFormEnumField(
      ContractCommodity,
      formValues.commodityType,
    ),
    commodityTypeOther: parseFormStringField(formValues.commodityTypeOther),
    instrumentType: parseFormEnumField(
      ContractInstrument,
      formValues.instrumentType,
    ),
    instrumentTypeOther: parseFormStringField(formValues.instrumentTypeOther),
    methodOfSupply: parseFormEnumField(
      ContractSupplyMethod,
      formValues.methodOfSupply,
    ),
    methodOfSupplyOther: parseFormStringField(formValues.methodOfSupplyOther),
    solicitationProcedure: parseFormEnumField(
      ContractSolicitationProcedure,
      formValues.solicitationProcedure,
    ),
    subjectToTradeAgreement: parseFormEnumField(
      YesNoUnsure,
      formValues.subjectToTradeAgreement,
    ),

    // Requirements section
    workRequirementDescription: parseFormStringField(
      formValues.workRequirementDescription,
    ),

    // Personnel requirements section
    hasPersonnelRequirements: parseFormEnumField(
      YesNo,
      formValues.hasPersonnelRequirements,
    ),
    personnelRequirements:
      formValues.hasPersonnelRequirements === YesNo.Yes
        ? {
            create: formValues.personnelRequirements?.map(
              (personnelRequirement) => {
                return {
                  resourceType: personnelRequirement.resourceType,
                  skillRequirements: {
                    create: personnelRequirement.skillRequirements?.map(
                      (skillRequirement) => {
                        return {
                          skill: {
                            connect: skillRequirement.skillId,
                          },
                          level: parseFormEnumField(
                            SkillLevel,
                            skillRequirement.level,
                          ),
                        };
                      },
                    ),
                  },
                  language: parseFormEnumField(
                    PersonnelLanguage,
                    personnelRequirement.language,
                  ),
                  languageOther: parseFormStringField(
                    personnelRequirement.languageOther,
                  ),
                  security: parseFormEnumField(
                    PersonnelScreeningLevel,
                    personnelRequirement.security,
                  ),
                  securityOther: parseFormStringField(
                    personnelRequirement.securityOther,
                  ),
                  telework: parseFormEnumField(
                    PersonnelTeleworkOption,
                    personnelRequirement.telework,
                  ),
                  quantity: parseFormIntField(personnelRequirement.quantity),
                };
              },
            ),
          }
        : undefined,
    qualificationRequirement: parseFormStringField(
      formValues.qualificationRequirement,
    ),
    requirementAccessToSecure: parseFormEnumField(
      YesNo,
      formValues.requirementAccessToSecure,
    ),
    requirementScreeningLevels: parseFormEnumArrayField(
      PersonnelScreeningLevel,
      formValues.requirementScreeningLevels,
    ),
    requirementScreeningLevelOther: parseFormStringField(
      formValues.requirementScreeningLevelOther,
    ),
    requirementWorkLanguages: parseFormEnumArrayField(
      PersonnelLanguage,
      formValues.requirementWorkLanguages,
    ),
    requirementWorkLanguageOther: parseFormStringField(
      formValues.requirementWorkLanguageOther,
    ),
    requirementWorkLocations: parseFormEnumArrayField(
      PersonnelWorkLocation,
      formValues.requirementWorkLocations,
    ),
    requirementWorkLocationGcSpecific: parseFormStringField(
      formValues.requirementWorkLocationGcSpecific,
    ),
    requirementWorkLocationOffsiteSpecific: parseFormStringField(
      formValues.requirementWorkLocationOffsiteSpecific,
    ),

    // hasOtherRequirements not sent to API
    requirementOthers: parseFormEnumArrayField(
      PersonnelOtherRequirement,
      formValues.requirementOthers,
    ),
    requirementOtherOther: parseFormStringField(
      formValues.requirementOtherOther,
    ),

    // Technological change section
    isTechnologicalChange: parseFormEnumField(
      YesNo,
      formValues.isTechnologicalChange,
    ),
    hasImpactOnYourDepartment: parseFormEnumField(
      YesNo,
      formValues.hasImpactOnYourDepartment,
    ),
    hasImmediateImpactOnOtherDepartments: parseFormEnumField(
      YesNo,
      formValues.hasImmediateImpactOnOtherDepartments,
    ),
    hasFutureImpactOnOtherDepartments: parseFormEnumField(
      YesNo,
      formValues.hasFutureImpactOnOtherDepartments,
    ),

    // Operations considerations section
    // hasOperationsConsiderations not sent to api
    operationsConsiderations: parseFormEnumArrayField(
      OperationsConsideration,
      formValues.operationsConsiderations,
    ),
    operationsConsiderationsOther: parseFormStringField(
      formValues.operationsConsiderationsOther,
    ),

    // Talent sourcing decision section
    contractingRationalePrimary: parseFormEnumField(
      ContractingRationale,
      formValues.contractingRationalePrimary,
    ),
    contractingRationalePrimaryOther: parseFormStringField(
      formValues.contractingRationalePrimaryOther,
    ),
    contractingRationalesSecondary: parseFormEnumArrayField(
      ContractingRationale,
      formValues.contractingRationalesSecondary,
    ),
    contractingRationalesSecondaryOther: parseFormStringField(
      formValues.contractingRationalesSecondaryOther,
    ),
    ocioConfirmedTalentShortage: parseFormEnumField(
      YesNo,
      formValues.ocioConfirmedTalentShortage,
    ),
    talentSearchTrackingNumber: parseFormStringField(
      formValues.talentSearchTrackingNumber,
    ),
    ongoingNeedForKnowledge: parseFormEnumField(
      YesNo,
      formValues.ongoingNeedForKnowledge,
    ),
    knowledgeTransferInContract: parseFormEnumField(
      YesNo,
      formValues.knowledgeTransferInContract,
    ),
    employeesHaveAccessToKnowledge: parseFormEnumField(
      YesNo,
      formValues.employeesHaveAccessToKnowledge,
    ),
    ocioEngagedForTraining: parseFormEnumField(
      YesNo,
      formValues.ocioEngagedForTraining,
    ),
  };
}
