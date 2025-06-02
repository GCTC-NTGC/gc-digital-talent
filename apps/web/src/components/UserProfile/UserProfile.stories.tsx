import { Meta, StoryFn } from "@storybook/react";

import {
  fakeExperiences,
  fakeApplicants,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  IndigenousCommunity,
  AdminUserProfileUserFragment,
} from "@gc-digital-talent/graphql";

import UserProfile from "./UserProfile";

const fakeUserArray = fakeApplicants(5);

export default {
  component: UserProfile,
  args: {},
} as Meta;

const TemplateUserProfile: StoryFn<AdminUserProfileUserFragment> = (args) => {
  return <UserProfile user={args} headingLevel="h3" />;
};

export const Default = TemplateUserProfile.bind({});
export const Null = TemplateUserProfile.bind({});

Default.args = {
  ...fakeUserArray[4],
  indigenousCommunities: [
    toLocalizedEnum(IndigenousCommunity.LegacyIsIndigenous),
  ],
  experiences: fakeExperiences(5),
};
Null.args = {
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
  firstOfficialLanguage: null,
  secondLanguageExamCompleted: null,
  secondLanguageExamValidity: null,
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
  locationPreferences: null,
  locationExemptions: null,
  acceptedOperationalRequirements: null,
  positionDuration: null,
  armedForcesStatus: null,
  citizenship: null,
};
