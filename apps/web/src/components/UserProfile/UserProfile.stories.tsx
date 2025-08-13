import { Meta, StoryFn } from "@storybook/react";

import {
  makeFragmentData,
  IndigenousCommunity,
  AdminUserProfileUserFragment,
  FlexibleWorkLocation,
} from "@gc-digital-talent/graphql";
import {
  fakeExperiences,
  fakeApplicants,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";

import UserProfile from "./UserProfile";
import { FlexibleWorkLocationOptions_Fragment } from "../Profile/components/WorkPreferences/fragment";

const fakeUserArray = fakeApplicants(5);

export default {
  component: UserProfile,
  args: {},
} as Meta;

const flexibleWorkOptionsQuery = makeFragmentData(
  {
    flexibleWorkLocation: [
      {
        value: FlexibleWorkLocation.Remote,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "REMOTE LOCALIZED",
        },
      },
      {
        value: FlexibleWorkLocation.Hybrid,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "HYBRID LOCALIZED",
        },
      },
      {
        value: FlexibleWorkLocation.Onsite,
        label: {
          __typename: undefined,
          en: undefined,
          fr: undefined,
          localized: "ONSITE LOCALIZED",
        },
      },
    ],
  },
  FlexibleWorkLocationOptions_Fragment,
);

const TemplateUserProfile: StoryFn<AdminUserProfileUserFragment> = (args) => {
  return (
    <UserProfile
      user={args}
      flexibleWorkOptionsQuery={flexibleWorkOptionsQuery}
      headingLevel="h3"
    />
  );
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
  flexibleWorkLocations: null,
  locationExemptions: null,
  acceptedOperationalRequirements: null,
  positionDuration: null,
  armedForcesStatus: null,
  citizenship: null,
};
