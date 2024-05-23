import { Meta, StoryFn } from "@storybook/react";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ProfileAndApplicationsHeading, {
  DashboardHeadingUser_Fragment,
} from "./ProfileAndApplicationsHeading";

const mockUser = fakeUsers(1)[0];
mockUser.workExperiences = experienceGenerators.workExperiences(3);
mockUser.awardExperiences = experienceGenerators.awardExperiences(1);

export default {
  component: ProfileAndApplicationsHeading,
  args: {
    userQuery: makeFragmentData(mockUser, DashboardHeadingUser_Fragment),
  },
} as Meta;

const Template: StoryFn<typeof ProfileAndApplicationsHeading> = (args) => {
  return <ProfileAndApplicationsHeading {...args} />;
};

export const PartiallyCompletedProfile = Template.bind({});
