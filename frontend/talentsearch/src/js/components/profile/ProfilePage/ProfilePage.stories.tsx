import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { ProfilePage, ProfileForm } from "./ProfilePage";
import { User } from "../../../api/generated";

const fakeUserArray = fakeUsers(5);

export default {
  component: ProfilePage,
  title: "Profile Form",
  args: {},
} as Meta;

const TemplateProfilePage: Story<User> = (args) => {
  return <ProfileForm profileDataInput={args} />;
};

export const ProfilePageStory1 = TemplateProfilePage.bind({});
export const ProfilePageStory2 = TemplateProfilePage.bind({});
export const ProfilePageStory3 = TemplateProfilePage.bind({});
export const ProfilePageStory4 = TemplateProfilePage.bind({});
export const ProfilePageStory5 = TemplateProfilePage.bind({});
export const ProfilePageNull = TemplateProfilePage.bind({});

ProfilePageStory1.args = { ...fakeUserArray[0] };
ProfilePageStory2.args = { ...fakeUserArray[1] };
ProfilePageStory3.args = { ...fakeUserArray[2] };
ProfilePageStory4.args = { ...fakeUserArray[3] };
ProfilePageStory5.args = { ...fakeUserArray[4] };
ProfilePageNull.args = {
  firstName: null,
  lastName: null,
  email: undefined,
  telephone: null,
  preferredLang: null,
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
  interestedInLaterOrSecondment: null,
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
  wouldAcceptTemporary: null,
  cmoAssets: null,
  poolCandidates: null,
};
