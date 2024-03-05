import React from "react";
import { Meta, Story } from "@storybook/react";

import { fakeExperiences, fakeApplicants } from "@gc-digital-talent/fake-data";
import { User, IndigenousCommunity } from "@gc-digital-talent/graphql";

import UserProfile from "./UserProfile";

const fakeUserArray = fakeApplicants(5);

export default {
  component: UserProfile,
  title: "Components/User Profile",
  args: {},
} as Meta;

const TemplateUserProfile: Story<User> = (args) => {
  return (
    <UserProfile
      user={args}
      sections={{
        about: { isVisible: true },
        language: { isVisible: true },
        government: { isVisible: true },
        workLocation: { isVisible: true },
        workPreferences: { isVisible: true },
        employmentEquity: { isVisible: true },
        careerTimelineAndRecruitment: { isVisible: true },
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
  indigenousCommunities: [IndigenousCommunity.LegacyIsIndigenous],
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
  indigenousCommunities: null,
  isVisibleMinority: null,
  hasDiploma: null,
  locationPreferences: null,
  locationExemptions: null,
  acceptedOperationalRequirements: null,
  positionDuration: null,
  armedForcesStatus: null,
  citizenship: null,
};
