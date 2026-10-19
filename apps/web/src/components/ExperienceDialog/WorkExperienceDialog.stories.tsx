import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  fakeClassifications,
  fakeCommunities,
  fakeDepartments,
  fakeUserSkills,
  fakeWorkStreams,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  CafEmploymentType,
  CafForce,
  CafRank,
  EmploymentCategory,
  ExternalRoleSeniority,
  ExternalSizeOfOrganization,
  GovEmployeeType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import WorkExperienceDialog, {
  WorkExperienceDialog_Fragment,
} from "./WorkExperienceDialog";

faker.seed(0);

export default {
  component: WorkExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof WorkExperienceDialog> = (args) => (
  <WorkExperienceDialog {...args} />
);

const experience = experienceGenerators.workExperiences()[0];

const skills = experience.skills ?? [];
const mockUserSkills = fakeUserSkills(skills.length);
const userSkills = skills.map((skill, index) => ({
  skillId: skill.id,
  skillLevel: mockUserSkills[index]?.skillLevel,
}));

const community = fakeCommunities(1)[0];
const workStreams = fakeWorkStreams(1).map((workStream) => ({
  ...workStream,
  community,
}));
const classification = { ...fakeClassifications()[0], level: 3 };

const departments = fakeDepartments();
const findDepartment = (name: string) =>
  departments.find((department) => department.name.en?.startsWith(name)) ??
  null;

const employmentCategory = (category: EmploymentCategory) =>
  toLocalizedEnum(category, "LocalizedEmploymentCategory");
const govEmploymentType = (type: GovEmployeeType) =>
  toLocalizedEnum(type, "LocalizedGovEmployeeType");

export const ExternalOrganization = Template.bind({});
ExternalOrganization.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      employmentCategory: employmentCategory(
        EmploymentCategory.ExternalOrganization,
      ),
      extSizeOfOrganization: toLocalizedEnum(
        ExternalSizeOfOrganization.OneHundredOneToOneThousand,
        "LocalizedExternalSizeOfOrganization",
      ),
      extRoleSeniority: toLocalizedEnum(
        ExternalRoleSeniority.Senior,
        "LocalizedExternalRoleSeniority",
      ),
    },
    WorkExperienceDialog_Fragment,
  ),
  userSkills,
};

const governmentOfCanada = {
  ...experience,
  govEmploymentType: govEmploymentType(GovEmployeeType.Term),
  govContractorType: null,
  classification,
  workStreams,
};

export const GovernmentOfCanadaDepartment = Template.bind({});
GovernmentOfCanadaDepartment.args = {
  experienceQuery: makeFragmentData(
    {
      ...governmentOfCanada,
      department: findDepartment("Treasury Board of Canada Secretariat"),
    },
    WorkExperienceDialog_Fragment,
  ),
  userSkills,
};

export const GovernmentOfCanadaAgency = Template.bind({});
GovernmentOfCanadaAgency.args = {
  experienceQuery: makeFragmentData(
    {
      ...governmentOfCanada,
      department: findDepartment("Canada Revenue Agency"),
    },
    WorkExperienceDialog_Fragment,
  ),
  userSkills,
};

export const GovernmentOfCanadaCrownCorporation = Template.bind({});
GovernmentOfCanadaCrownCorporation.args = {
  experienceQuery: makeFragmentData(
    {
      ...governmentOfCanada,
      department: findDepartment("Canada Post"),
    },
    WorkExperienceDialog_Fragment,
  ),
  userSkills,
};

export const CanadianArmedForces = Template.bind({});
CanadianArmedForces.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      employmentCategory: employmentCategory(
        EmploymentCategory.CanadianArmedForces,
      ),
      cafEmploymentType: toLocalizedEnum(
        CafEmploymentType.RegularForce,
        "LocalizedCafEmploymentType",
      ),
      cafForce: toLocalizedEnum(CafForce.CanadianArmy, "LocalizedCafForce"),
      cafRank: toLocalizedEnum(CafRank.GeneralFlagOfficer, "LocalizedCafRank"),
    },
    WorkExperienceDialog_Fragment,
  ),
  userSkills,
};
