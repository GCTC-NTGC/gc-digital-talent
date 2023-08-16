import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeUsers, fakeExperiences } from "@gc-digital-talent/fake-data";

import ProfilePage, { ProfileForm, ProfilePageProps } from "./ProfilePage";

const fakeUserData = fakeUsers(1)[0];
const fakeExperienceArray = fakeExperiences(3);

export default {
  component: ProfilePage,
  title: "Pages/Profile Page",
  args: {},
} as Meta;

const Template: StoryFn<ProfilePageProps["user"]> = (args) => {
  return <ProfileForm user={args} />;
};

export const CompletedWithoutExperiences = Template.bind({});
export const CompletedWithExperiences = Template.bind({});
export const EmptyAllNull = Template.bind({});

CompletedWithoutExperiences.args = { ...fakeUserData };
CompletedWithExperiences.args = {
  ...fakeUserData,
  experiences: fakeExperienceArray,
};
EmptyAllNull.args = {
  id: "test ID", // this page can only be loaded by a logged in user
  email: undefined,
};
