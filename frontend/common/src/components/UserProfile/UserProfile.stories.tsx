import React from "react";
import { Meta, Story } from "@storybook/react";
import fakeExperiences from "../../fakeData/fakeExperiences";
import { fakeApplicants } from "../../fakeData";
import UserProfile from "./UserProfile";
import { Applicant } from "../../api/generated";

const fakeUserArray = fakeApplicants(5);

export default {
  component: UserProfile,
  title: "Admin/User Profile",
  args: {},
} as Meta;

const TemplateUserProfile: Story<Applicant> = (args) => {
  return (
    <UserProfile
      applicant={args as Applicant}
      sections={{
        about: { isVisible: true },
        language: { isVisible: true },
        government: { isVisible: true },
        workLocation: { isVisible: true },
        workPreferences: { isVisible: true },
        employmentEquity: { isVisible: true },
        roleSalary: { isVisible: true },
        skillsExperience: { isVisible: true },
      }}
    />
  );
};

export const UserProfileStory1 = TemplateUserProfile.bind({});
export const UserProfileStory2 = TemplateUserProfile.bind({});
export const UserProfileStory3 = TemplateUserProfile.bind({});
export const UserProfileStory4 = TemplateUserProfile.bind({});
export const UserProfileStory5 = TemplateUserProfile.bind({});
export const UserProfileNull = TemplateUserProfile.bind({});

UserProfileStory1.args = { ...fakeUserArray[0] };
UserProfileStory2.args = { ...fakeUserArray[1] };
UserProfileStory3.args = {
  ...fakeUserArray[2],
  experiences: fakeExperiences(3),
};
UserProfileStory4.args = {
  ...fakeUserArray[3],
  experiences: fakeExperiences(4),
};
UserProfileStory5.args = {
  ...fakeUserArray[4],
  experiences: fakeExperiences(5),
};
UserProfileNull.args = {
  firstName: null,
  lastName: null,
  email: undefined,
  telephone: null,
  preferredLang: null,
  preferredLanguageForInterview: null,
  preferredLanguageForExam: null,
  currentCity: null,
  currentProvince: null,
  languageAbility: null,
  lookingForEnglish: null,
  lookingForFrench: null,
  lookingForBilingual: null,
  bilingualEvaluation: null,
  comprehensionLevel: null,
  writtenLevel: null,
  verbalLevel: null,
  estimatedLanguageAbility: null,
  isGovEmployee: null,
  department: null,
  currentClassification: null,
  isWoman: null,
  hasDisability: null,
  isIndigenous: null,
  isVisibleMinority: null,
  jobLookingStatus: null,
  hasDiploma: null,
  locationPreferences: null,
  locationExemptions: null,
  acceptedOperationalRequirements: null,
  expectedSalary: null,
  expectedClassifications: null,
  positionDuration: null,
  armedForcesStatus: null,
  citizenship: null,
};
