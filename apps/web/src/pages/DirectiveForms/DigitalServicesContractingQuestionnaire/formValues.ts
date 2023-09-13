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
  TechnologicalChangeFactor,
} from "@gc-digital-talent/graphql";
import { emptyToNull } from "@gc-digital-talent/helpers";

import { OTHER_ID, stringToEnum } from "../util";

export type SkillRequirementFormValues = {
  skillId: string;
  level: string;
};

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

export type PersonnelRequirementFormValues = {
  resourceType: string;
  skillRequirements: Array<SkillRequirementFormValues>;
  language: string;
  languageOther: string;
  security: string;
  securityOther: string;
  telework: string;
  quantity: string;
};

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
  isAuthorityInvolved: string;
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
  contractFtes: string;
  contractResourcesStartTimeframe: string;
  commodityType: string;
  commodityTypeOther: string;
  instrumentType: string;
  instrumentTypeOther: string;
  methodOfSupply: string;
  methodOfSupplyOther: string;
  solicitationProcedure: string;
  subjectToTradeAgreement: string;

  // requirements section
  workRequirementDescription: string;
  requirementAccessToSecure: string;
  requirementScreeningLevels: Array<string>;
  requirementScreeningLevelOther: string;
  requirementWorkLanguages: Array<string>;
  requirementWorkLanguageOther: string;
  requirementWorkLocations: Array<string>;
  requirementWorkLocationGcSpecific: string;
  requirementWorkLocationOffsiteSpecific: string;
  hasOtherRequirements: string;
  requirementOthers: Array<string>;
  requirementOtherOther: string;

  // personnel requirements section
  hasPersonnelRequirements: string;
  personnelRequirements: Array<PersonnelRequirementFormValues> | null;
  qualificationRequirement: string;

  // technological change section
  hasTechnologicalChangeFactors: string;
  technologicalChangeFactors: Array<string>;
  hasImpactOnYourDepartment: string;
  hasImmediateImpactOnOtherDepartments: string;
  hasFutureImpactOnOtherDepartments: string;

  // operations considerations section
  hasOperationsConsiderations: string;
  operationsConsiderations: Array<string>;
  operationsConsiderationsOther: string;

  // Talent sourcing decision section
  contractingRationalePrimary: string;
  contractingRationalePrimaryOther: string;
  contractingRationalesSecondary: Array<string>;
  contractingRationalesSecondaryOther: string;
  ocioConfirmedTalentShortage: string;
  talentSearchTrackingNumber: string;
  ongoingNeedForKnowledge: string;
  knowledgeTransferInContract: string;
  employeesHaveAccessToKnowledge: string;
  ocioEngagedForTraining: string;
};

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
    departmentOther: emptyToNull(formValues.departmentOther),
    branchOther: emptyToNull(formValues.branchOther),
    businessOwnerName: emptyToNull(formValues.businessOwnerName),
    businessOwnerJobTitle: emptyToNull(formValues.businessOwnerJobTitle),
    businessOwnerEmail: emptyToNull(formValues.businessOwnerEmail),
    financialAuthorityName: emptyToNull(formValues.financialAuthorityName),
    financialAuthorityJobTitle: emptyToNull(
      formValues.financialAuthorityJobTitle,
    ),
    financialAuthorityEmail: emptyToNull(formValues.financialAuthorityEmail),
    // otherAuthoritiesInvolved not sent to api
    authoritiesInvolved: formValues.authoritiesInvolved?.map((a) =>
      stringToEnum(ContractAuthority, a),
    ),
    authorityInvolvedOther: emptyToNull(formValues.authorityInvolvedOther),
    contractBehalfOfGc: stringToEnum(
      YesNoUnsure,
      formValues.contractBehalfOfGc,
    ),
    contractServiceOfGc: stringToEnum(
      YesNoUnsure,
      formValues.contractServiceOfGc,
    ),
    contractForDigitalInitiative: stringToEnum(
      YesNoUnsure,
      formValues.contractForDigitalInitiative,
    ),
    digitalInitiativeName: emptyToNull(formValues.digitalInitiativeName),
    digitalInitiativePlanSubmitted: stringToEnum(
      YesNoUnsure,
      formValues.digitalInitiativePlanSubmitted,
    ),
    digitalInitiativePlanUpdated: stringToEnum(
      YesNoUnsure,
      formValues.digitalInitiativePlanUpdated,
    ),
    digitalInitiativePlanComplemented: stringToEnum(
      YesNoUnsure,
      formValues.digitalInitiativePlanComplemented,
    ),

    // scope of contract
    contractTitle: emptyToNull(formValues.contractTitle),
    contractStartDate: emptyToNull(formValues.contractStartDate),
    contractEndDate: emptyToNull(formValues.contractEndDate),
    contractExtendable: stringToEnum(YesNo, formValues.contractExtendable),
    contractAmendable: stringToEnum(YesNo, formValues.contractAmendable),
    contractMultiyear: stringToEnum(YesNo, formValues.contractMultiyear),
    contractValue: stringToEnum(ContractValueRange, formValues.contractValue),
    contractFtes: stringToEnum(ContractFteRange, formValues.contractFtes),
    contractResourcesStartTimeframe: stringToEnum(
      ContractStartTimeframe,
      formValues.contractResourcesStartTimeframe,
    ),
    commodityType: stringToEnum(ContractCommodity, formValues.commodityType),
    commodityTypeOther: emptyToNull(formValues.commodityTypeOther),
    instrumentType: stringToEnum(ContractInstrument, formValues.instrumentType),
    instrumentTypeOther: emptyToNull(formValues.instrumentTypeOther),
    methodOfSupply: stringToEnum(
      ContractSupplyMethod,
      formValues.methodOfSupply,
    ),
    methodOfSupplyOther: emptyToNull(formValues.methodOfSupplyOther),
    solicitationProcedure: stringToEnum(
      ContractSolicitationProcedure,
      formValues.solicitationProcedure,
    ),
    subjectToTradeAgreement: stringToEnum(
      YesNoUnsure,
      formValues.subjectToTradeAgreement,
    ),

    // Requirements section
    workRequirementDescription: emptyToNull(
      formValues.workRequirementDescription,
    ),
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
    // hasOtherRequirements not sent to API
    requirementOthers: formValues.requirementOthers?.map((a) =>
      stringToEnum(PersonnelOtherRequirement, a),
    ),
    requirementOtherOther: emptyToNull(formValues.requirementOtherOther),

    // Personnel requirements section
    hasPersonnelRequirements: stringToEnum(
      YesNo,
      formValues.hasPersonnelRequirements,
    ),
    personnelRequirements: formValues.personnelRequirements
      ? {
          create: formValues.personnelRequirements.map(
            (personnelRequirement) => {
              return {
                resourceType: personnelRequirement.resourceType,
                skillRequirements: {
                  create: personnelRequirement.skillRequirements.map(
                    (skillRequirement) => {
                      return {
                        skill: {
                          connect: skillRequirement.skillId,
                        },
                        level: stringToEnum(SkillLevel, skillRequirement.level),
                      };
                    },
                  ),
                },
                language: stringToEnum(
                  PersonnelLanguage,
                  personnelRequirement.language,
                ),
                languageOther: emptyToNull(personnelRequirement.languageOther),
                security: stringToEnum(
                  PersonnelScreeningLevel,
                  personnelRequirement.security,
                ),
                securityOther: emptyToNull(personnelRequirement.securityOther),
                telework: stringToEnum(
                  PersonnelTeleworkOption,
                  personnelRequirement.telework,
                ),
                quantity: parseInt(personnelRequirement.quantity, 10) ?? null,
              };
            },
          ),
        }
      : undefined,
    qualificationRequirement: emptyToNull(formValues.qualificationRequirement),

    // Technological change section
    // hasTechnologicalChangeFactors not sent to api
    technologicalChangeFactors: formValues.technologicalChangeFactors?.map(
      (a) => stringToEnum(TechnologicalChangeFactor, a),
    ),
    hasImpactOnYourDepartment: stringToEnum(
      YesNo,
      formValues.hasImpactOnYourDepartment,
    ),
    hasImmediateImpactOnOtherDepartments: stringToEnum(
      YesNo,
      formValues.hasImmediateImpactOnOtherDepartments,
    ),
    hasFutureImpactOnOtherDepartments: stringToEnum(
      YesNo,
      formValues.hasFutureImpactOnOtherDepartments,
    ),

    // Operations considerations section
    // hasOperationsConsiderations not sent to api
    operationsConsiderations: formValues.operationsConsiderations?.map((a) =>
      stringToEnum(OperationsConsideration, a),
    ),
    operationsConsiderationsOther: emptyToNull(
      formValues.operationsConsiderationsOther,
    ),

    // Talent sourcing decision section
    contractingRationalePrimary: stringToEnum(
      ContractingRationale,
      formValues.contractingRationalePrimary,
    ),
    contractingRationalePrimaryOther: emptyToNull(
      formValues.contractingRationalePrimaryOther,
    ),
    contractingRationalesSecondary:
      formValues.contractingRationalesSecondary?.map((a) =>
        stringToEnum(ContractingRationale, a),
      ),
    contractingRationalesSecondaryOther: emptyToNull(
      formValues.contractingRationalesSecondaryOther,
    ),
    ocioConfirmedTalentShortage: formValues.ocioConfirmedTalentShortage
      ? stringToEnum(YesNo, formValues.ocioConfirmedTalentShortage)
      : null,
    talentSearchTrackingNumber: emptyToNull(
      formValues.talentSearchTrackingNumber,
    ),
    ongoingNeedForKnowledge: stringToEnum(
      YesNo,
      formValues.ongoingNeedForKnowledge,
    ),
    knowledgeTransferInContract: stringToEnum(
      YesNo,
      formValues.knowledgeTransferInContract,
    ),
    employeesHaveAccessToKnowledge: stringToEnum(
      YesNo,
      formValues.employeesHaveAccessToKnowledge,
    ),
    ocioEngagedForTraining: stringToEnum(
      YesNo,
      formValues.ocioEngagedForTraining,
    ),
  };
}
