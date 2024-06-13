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
  title:
    "Pages/Directive On Digital Talent/Digital Services Contracting Questionnaire",
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
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
export default meta;
type Story = StoryObj<typeof DigitalServicesContractingQuestionnaire>;

export const Empty: Story = {};

// This story has specific personnel requirements and skips most optional questions
export const WithSpecificPersonnel: Story = {
  args: {
    defaultValues: {
      // preamble section
      readPreamble: true,

      // general information section
      department: mockDepartments[0].id,
      branchOther: "Some other branch",
      businessOwnerName: "Mr. Business Owner",
      businessOwnerJobTitle: "Owner of Business",
      businessOwnerEmail: "business.owner@example.org",
      financialAuthorityName: "Ms. Financial Authority",
      financialAuthorityJobTitle: "Authority of Finance",
      financialAuthorityEmail: "financial.authority@example.org",
      isAuthorityInvolved: YesNo.No,
      contractBehalfOfGc: YesNoUnsure.Yes,
      contractServiceOfGc: YesNoUnsure.Yes,
      contractForDigitalInitiative: YesNoUnsure.No,

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
      commodityType: ContractCommodity.SupportServices,
      instrumentType: ContractInstrument.Contract,
      methodOfSupply:
        ContractSupplyMethod.TaskBasedInformaticsProfessionalServices,
      solicitationProcedure: ContractSolicitationProcedure.Competitive,
      subjectToTradeAgreement: YesNoUnsure.IDontKnow,

      // requirements section
      workRequirementDescription: "Super important requirements.",

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

      hasOtherRequirements: YesNo.No,

      // technological change section
      isTechnologicalChange: YesNo.Yes,
      hasImpactOnYourDepartment: YesNo.Yes,
      hasImmediateImpactOnOtherDepartments: YesNo.Yes,
      hasFutureImpactOnOtherDepartments: YesNo.Yes,

      // operations considerations section
      hasOperationsConsiderations: YesNo.No,

      // Talent sourcing decision section
      contractingRationalePrimary: ContractingRationale.ShortageOfTalent,
      contractingRationalesSecondary: [
        ContractingRationale.RequiresIndependent,
        ContractingRationale.HrSituation,
      ],
      ocioConfirmedTalentShortage: YesNo.Yes,
      talentSearchTrackingNumber: "00000000-0000-0000-0000-000000000000",
      ongoingNeedForKnowledge: YesNo.Yes,
      knowledgeTransferInContract: YesNo.Yes,
      employeesHaveAccessToKnowledge: YesNo.Yes,
      ocioEngagedForTraining: YesNo.Yes,
    },
  },
};

// This story does not have specific personnel requirements and fills in most optional questions
export const WithGeneralPersonnel: Story = {
  args: {
    defaultValues: {
      ...WithSpecificPersonnel.args?.defaultValues,
      department: "OTHER",
      departmentOther: "Some other department",
      isAuthorityInvolved: YesNo.Yes,
      authoritiesInvolved: [
        ContractAuthority.Procurement,
        ContractAuthority.Other,
      ],
      authorityInvolvedOther: "Some other authority",
      contractForDigitalInitiative: YesNoUnsure.Yes,
      digitalInitiativeName: "Amazing Digital Stuff",
      digitalInitiativePlanSubmitted: YesNoUnsure.Yes,
      digitalInitiativePlanUpdated: YesNoUnsure.Yes,
      digitalInitiativePlanComplemented: YesNoUnsure.Yes,
      commodityType: ContractCommodity.Other,
      commodityTypeOther: "Some other commodity",
      instrumentType: ContractInstrument.Other,
      instrumentTypeOther: "Some other instrument",
      methodOfSupply: ContractSupplyMethod.Other,
      methodOfSupplyOther: "Some other supply method",

      // requirements section
      hasPersonnelRequirements: YesNo.No,
      personnelRequirements: undefined,

      qualificationRequirement: "Super special qualifications",
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

      // operations considerations section
      hasOperationsConsiderations: YesNo.Yes,
      operationsConsiderations: [
        OperationsConsideration.StaffingFreeze,
        OperationsConsideration.Other,
      ],
      operationsConsiderationsOther: "Some other consideration",

      // Talent sourcing decision section
      contractingRationalePrimary: ContractingRationale.Other,
      contractingRationalePrimaryOther: "Some other primary rationale",
      contractingRationalesSecondary: [
        ContractingRationale.TimingRequirements,
        ContractingRationale.Other,
      ],
      contractingRationalesSecondaryOther: "Some other secondary rationale",
    },
  },
};
