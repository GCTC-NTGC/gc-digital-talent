import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeUsers, fakeExperiences } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ProfilePage, { ProfileForm, UserProfile_Fragment } from "./ProfilePage";

const fakeUserData = fakeUsers(1)[0];
const fakeExperienceArray = fakeExperiences(3);

export default {
  component: ProfilePage,
  title: "Pages/Profile Page",
  args: {},
} as Meta;

const Template: StoryFn<typeof ProfileForm> = (args) => {
  const { userQuery } = args;
  return <ProfileForm userQuery={userQuery} />;
};

export const CompletedWithoutExperiences = Template.bind({});
CompletedWithoutExperiences.args = {
  userQuery: makeFragmentData(fakeUserData, UserProfile_Fragment),
};

export const CompletedWithExperiences = Template.bind({});
CompletedWithExperiences.args = {
  userQuery: makeFragmentData(
    {
      ...fakeUserData,
      experiences: fakeExperienceArray,
    },
    UserProfile_Fragment,
  ),
};

export const EmptyAllNull = Template.bind({});

EmptyAllNull.args = {
  userQuery: makeFragmentData(
    {
      id: "test ID", // this page can only be loaded by a logged in user
      email: undefined,
    },
    UserProfile_Fragment,
  ),
};
