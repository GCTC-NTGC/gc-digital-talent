import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  experienceGenerators,
  fakeClassifications,
  fakeCommunities,
  fakeDepartments,
  fakeLocalizedEnum,
  getStaticSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  CafEmploymentType,
  CafForce,
  CafRank,
  CSuiteRoleTitle,
  EmploymentCategory,
  ExternalRoleSeniority,
  ExternalSizeOfOrganization,
  GovContractorRoleSeniority,
  GovContractorType,
  GovEmployeeType,
  GovPositionType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import { ExperienceFormSkill_Fragment } from "./ExperienceFormPage";
import WorkExperienceForm, {
  WorkExperienceForm_Fragment,
} from "./WorkExperienceForm";

const skillFragments = getStaticSkills().map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);
const departments = fakeDepartments();
const experience = {
  ...experienceGenerators.workExperiences()[0],
  department: departments[5],
  govContractorRoleSeniority: toLocalizedEnum(
    GovContractorRoleSeniority.Senior,
    "LocalizedGovContractorRoleSeniority",
  ),
};

const meta = {
  component: WorkExperienceForm,
  decorators: [MockGraphqlDecorator],
  args: {
    skillsQuery: skillFragments,
    userId: "user-id",
    organizationSuggestions: [],
  },
  parameters: {
    apiResponses: {
      WorkFieldOptions: {
        data: {
          employmentCategoryTypes: fakeLocalizedEnum(
            EmploymentCategory,
            "LocalizedEmploymentCategory",
          ),
        },
      },
      ExternalWorkFieldOptions: {
        data: {
          extSizeOfOrganizations: fakeLocalizedEnum(
            ExternalSizeOfOrganization,
            "LocalizedExternalSizeOfOrganization",
          ),
          extRoleSeniorities: fakeLocalizedEnum(
            ExternalRoleSeniority,
            "LocalizedExternalRoleSeniority",
          ),
        },
      },
      CafFieldsOptions: {
        data: {
          cafEmploymentTypes: fakeLocalizedEnum(
            CafEmploymentType,
            "LocalizedCafEmploymentType",
          ),
          cafForces: fakeLocalizedEnum(CafForce, "LocalizedCafForce"),
          cafRanks: fakeLocalizedEnum(CafRank, "LocalizedCafRank"),
        },
      },
      GovFieldOptions: {
        data: {
          me: { workExperiences: [] },
          departments,
          classifications: fakeClassifications(),
          govEmploymentTypes: fakeLocalizedEnum(
            GovEmployeeType,
            "LocalizedGovEmployeeType",
          ),
          govPositionTypes: fakeLocalizedEnum(
            GovPositionType,
            "LocalizedGovPositionType",
          ),
          govContractorRoleSeniorities: fakeLocalizedEnum(
            GovContractorRoleSeniority,
            "LocalizedGovContractorRoleSeniority",
          ),
          govContractorTypes: fakeLocalizedEnum(
            GovContractorType,
            "LocalizedGovContractorType",
          ),
        },
      },
      SupervisoryFieldOptions: {
        data: {
          cSuiteRoleTitles: fakeLocalizedEnum(
            CSuiteRoleTitle,
            "LocalizedCSuiteRoleTitle",
          ),
        },
      },
      ExperienceWorkStreamsCommunity: {
        data: {
          communities: fakeCommunities(),
        },
      },
    },
  },
} satisfies Meta<typeof WorkExperienceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    edit: true,
    experienceId: experience.id,
    experienceQuery: makeFragmentData(experience, WorkExperienceForm_Fragment),
  },
};

export const EditWithRelatedAward: Story = {
  args: {
    ...Edit.args,
    experienceQuery: makeFragmentData(
      {
        ...experience,
        awardExperiences: experienceGenerators.awardExperiences(),
      },
      WorkExperienceForm_Fragment,
    ),
  },
};
