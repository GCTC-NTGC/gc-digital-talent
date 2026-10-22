import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  fakeUserSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import EducationExperienceDialog, {
  EducationExperienceDialog_Fragment,
} from "./EducationExperienceDialog";

faker.seed(0);

export default {
  component: EducationExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof EducationExperienceDialog> = (args) => (
  <EducationExperienceDialog {...args} />
);

const experience = experienceGenerators.educationExperiences()[0];

const skills = experience.skills ?? [];
const mockUserSkills = fakeUserSkills(skills.length);
const userSkills = skills.map((skill, index) => ({
  skillId: skill.id,
  skillLevel: mockUserSkills[index]?.skillLevel,
}));

const educationType = (type: EducationType) =>
  toLocalizedEnum(type, "LocalizedEducationType");
const educationStatus = (status: EducationStatus) =>
  toLocalizedEnum(status, "LocalizedEducationStatus");

export const Degree = Template.bind({});
Degree.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.DegreeDiplomaCertificate),
      degreeType: toLocalizedEnum(
        DegreeType.MastersDegree,
        "LocalizedDegreeType",
      ),
      status: educationStatus(EducationStatus.SuccessCredential),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};

export const LicenseOrAccreditation = Template.bind({});
LicenseOrAccreditation.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.LicenseAccreditation),
      status: educationStatus(EducationStatus.Success),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};

export const ProfessionalCertification = Template.bind({});
ProfessionalCertification.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.ProfessionalCertification),
      status: educationStatus(EducationStatus.Success),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};

export const IndividualCourse = Template.bind({});
IndividualCourse.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.IndividualCourse),
      status: educationStatus(EducationStatus.SuccessCredential),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};

export const Fellowship = Template.bind({});
Fellowship.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.Fellowship),
      fellowshipType: toLocalizedEnum(
        FellowshipType.Other,
        "LocalizedFellowshipType",
      ),
      otherFellowshipType: faker.lorem.words(),
      status: educationStatus(EducationStatus.SuccessCredential),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};

export const Other = Template.bind({});
Other.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      educationType: educationType(EducationType.Other),
      otherEducationType: faker.lorem.words(),
      status: educationStatus(EducationStatus.SuccessCredential),
    },
    EducationExperienceDialog_Fragment,
  ),
  userSkills,
};
