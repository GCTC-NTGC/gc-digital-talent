import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeDepartments, getStaticSkills } from "@gc-digital-talent/fake-data";
import {
  ContractAuthority,
  ContractCommodity,
  ContractFteRange,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  ContractingRationale,
  OperationsConsideration,
  PersonnelLanguage,
  PersonnelOtherRequirement,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  PersonnelWorkLocation,
  SkillLevel,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";

import { DigitalServicesContractingQuestionnaire } from "./DigitalServicesContractingQuestionnairePage";
import { FormValues } from "./formValues";

const mockSkills = getStaticSkills();
const mockDepartments = fakeDepartments();

const meta: Meta<typeof DigitalServicesContractingQuestionnaire> = {
  component: DigitalServicesContractingQuestionnaire,
  args: {
    skills: mockSkills,
    departments: mockDepartments,
    onSubmit: async (values: FormValues) => {
      await new Promise<void>((resolve) => {
        action("onSave")(values);
        resolve();
      });
    },
  },
};
export default meta;
type Story = StoryObj<typeof DigitalServicesContractingQuestionnaire>;

export const Empty: Story = {};

export const WithValues: Story = {
  args: {
    defaultValues: {
      // preamble section
      readPreamble: true,

      // general information section
      department: "OTHER",
      departmentOther: "Some other department",
      branchOther: "Some other branch",
      businessOwnerName: "Mr. Business Owner",
      businessOwnerJobTitle: "Owner of Business",
      businessOwnerEmail: "business.owner@example.org",
      financialAuthorityName: "Ms. Financial Authority",
      financialAuthorityJobTitle: "Authority of Finance",
      financialAuthorityEmail: "financial.authority@example.org",
      isAuthorityInvolved: YesNo.Yes,
      authoritiesInvolved: [
        ContractAuthority.Procurement,
        ContractAuthority.Other,
      ],
      authorityInvolvedOther: "Some other authority",
      contractBehalfOfGc: YesNoUnsure.Yes,
      contractServiceOfGc: YesNoUnsure.Yes,
      contractForDigitalInitiative: YesNoUnsure.Yes,
      digitalInitiativeName: "Amazing Digital Stuff",
      digitalInitiativePlanSubmitted: YesNoUnsure.Yes,
      digitalInitiativePlanUpdated: YesNoUnsure.Yes,
      digitalInitiativePlanComplemented: YesNoUnsure.Yes,

      // scope of contract section
      contractTitle: "Super Contract",
      contractStartDate: "2099-01-01",
      contractEndDate: "2099-12-31",
      contractExtendable: YesNo.Yes,
      contractAmendable: YesNo.Yes,
      contractMultiyear: YesNo.Yes,
      contractValue: ContractValueRange.From_50KTo_1M,
      contractFtes: ContractFteRange.From_11To_30,
      contractResourcesStartTimeframe: ContractStartTimeframe.Unknown,
      commodityType: ContractCommodity.Other,
      commodityTypeOther: "Some other commodity",
      instrumentType: ContractInstrument.Other,
      instrumentTypeOther: "Some other instrument",
      methodOfSupply: ContractSupplyMethod.Other,
      methodOfSupplyOther: "Some other supply method",
      solicitationProcedure: ContractSolicitationProcedure.Competitive,
      subjectToTradeAgreement: YesNoUnsure.IDontKnow,

      // requirements section
      workRequirementDescription: "Super important requirements.",
      requirementAccessToSecure: YesNo.Yes,
      requirementScreeningLevels: [
        PersonnelScreeningLevel.TopSecret,
        PersonnelScreeningLevel.Other,
      ],
      requirementScreeningLevelOther: "Ultra-High Security",
      requirementWorkLanguages: [
        PersonnelLanguage.BilingualAdvanced,
        PersonnelLanguage.Other,
      ],
      requirementWorkLanguageOther: "Klingon",
      requirementWorkLocations: [
        PersonnelWorkLocation.GcPremises,
        PersonnelWorkLocation.OffsiteSpecific,
      ],
      requirementWorkLocationGcSpecific: "The Town",
      requirementWorkLocationOffsiteSpecific: "The City",
      hasOtherRequirements: YesNo.Yes,
      requirementOthers: [
        PersonnelOtherRequirement.OvertimeShortNotice,
        PersonnelOtherRequirement.Other,
      ],
      requirementOtherOther: "Chess master",

      // personnel requirements section
      hasPersonnelRequirements: YesNo.Yes,
      personnelRequirements: [
        {
          resourceType: "Programmer",
          skillRequirements: [
            {
              skillId: mockSkills[0].id,
              level: SkillLevel.Beginner,
            },
            {
              skillId: mockSkills[1].id,
              level: SkillLevel.Intermediate,
            },
          ],
          language: PersonnelLanguage.EnglishOnly,
          languageOther: "",
          security: PersonnelScreeningLevel.EnhancedReliability,
          securityOther: "",
          telework: PersonnelTeleworkOption.No,
          quantity: "100",
        },
        {
          resourceType: "Manager",
          skillRequirements: [
            {
              skillId: mockSkills[2].id,
              level: SkillLevel.Advanced,
            },
          ],
          language: PersonnelLanguage.Other,
          languageOther: "Galactic Standard",
          security: PersonnelScreeningLevel.Other,
          securityOther: "Diplomatic Immunity",
          telework: PersonnelTeleworkOption.FullTime,
          quantity: "7",
        },
      ],
      qualificationRequirement: "Super special qualifications",

      // technological change section
      isTechnologicalChange: YesNo.Yes,
      hasImpactOnYourDepartment: YesNo.Yes,
      hasImmediateImpactOnOtherDepartments: YesNo.Yes,
      hasFutureImpactOnOtherDepartments: YesNo.Yes,

      // operations considerations section
      hasOperationsConsiderations: YesNo.Yes,
      operationsConsiderations: [
        OperationsConsideration.StaffingFreeze,
        OperationsConsideration.Other,
      ],
      operationsConsiderationsOther: "Some other consideration",

      // Talent sourcing decision section
      contractingRationalePrimary: ContractingRationale.ShortageOfTalent,
      contractingRationalePrimaryOther: "",
      contractingRationalesSecondary: [
        ContractingRationale.TimingRequirements,
        ContractingRationale.Other,
      ],
      contractingRationalesSecondaryOther: "Some other rationale",
      ocioConfirmedTalentShortage: YesNo.Yes,
      talentSearchTrackingNumber: "00000000-0000-0000-0000-000000000000",
      ongoingNeedForKnowledge: YesNo.Yes,
      knowledgeTransferInContract: YesNo.Yes,
      employeesHaveAccessToKnowledge: YesNo.Yes,
      ocioEngagedForTraining: YesNo.Yes,
    },
  },
};
