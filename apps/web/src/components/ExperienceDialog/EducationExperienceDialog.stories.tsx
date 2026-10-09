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
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import EducationExperienceDialog from "./EducationExperienceDialog";

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
  experience: {
    ...experience,
    educationType: educationType(EducationType.DegreeDiplomaCertificate),
    degreeType: toLocalizedEnum(
      DegreeType.MastersDegree,
      "LocalizedDegreeType",
    ),
    status: educationStatus(EducationStatus.SuccessCredential),
  },
  userSkills,
};

export const LicenseOrAccreditation = Template.bind({});
LicenseOrAccreditation.args = {
  experience: {
    ...experience,
    educationType: educationType(EducationType.LicenseAccreditation),
    status: educationStatus(EducationStatus.Success),
  },
  userSkills,
};

export const ProfessionalCertification = Template.bind({});
ProfessionalCertification.args = {
  experience: {
    ...experience,
    educationType: educationType(EducationType.ProfessionalCertification),
    status: educationStatus(EducationStatus.Success),
  },
  userSkills,
};

export const IndividualCourse = Template.bind({});
IndividualCourse.args = {
  experience: {
    ...experience,
    educationType: educationType(EducationType.IndividualCourse),
    status: educationStatus(EducationStatus.SuccessCredential),
  },
  userSkills,
};

export const Fellowship = Template.bind({});
Fellowship.args = {
  experience: {
    ...experience,
    educationType: educationType(EducationType.Fellowship),
    fellowshipType: toLocalizedEnum(
      FellowshipType.Other,
      "LocalizedFellowshipType",
    ),
    otherFellowshipType: faker.lorem.words(),
    status: educationStatus(EducationStatus.SuccessCredential),
  },
  userSkills,
};

export const Other = Template.bind({});
Other.args = {
  experience: {
    ...experience,
    educationType: educationType(EducationType.Other),
    otherEducationType: faker.lorem.words(),
    status: educationStatus(EducationStatus.SuccessCredential),
  },
  userSkills,
};

export const MissingInfo = Template.bind({});
MissingInfo.args = {
  experience: {
    ...experience,
    institution: null,
  },
  userSkills,
};
