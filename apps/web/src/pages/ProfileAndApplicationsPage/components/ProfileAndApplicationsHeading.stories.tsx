import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";

import ProfileAndApplicationsHeading from "./ProfileAndApplicationsHeading";

const mockUser = fakeUsers(1)[0];
mockUser.workExperiences = experienceGenerators.workExperiences(3);
mockUser.awardExperiences = experienceGenerators.awardExperiences(1);

export default {
  component: ProfileAndApplicationsHeading,
  title: "Pages/Profile and Applications/Profile and Applications Heading",
  args: {
    user: mockUser,
  },
} as Meta;

const Template: StoryFn<typeof ProfileAndApplicationsHeading> = (args) => {
  return <ProfileAndApplicationsHeading {...args} />;
};

export const PartiallyCompletedProfile = Template.bind({});
