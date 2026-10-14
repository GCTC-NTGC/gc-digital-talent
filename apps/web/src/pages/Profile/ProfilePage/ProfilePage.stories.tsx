import type { Meta, StoryFn } from "@storybook/react-vite";

import { fakeUsers } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ProfilePage, { ProfileForm, UserProfile_Fragment } from "./ProfilePage";

const fakeUserData = fakeUsers(1)[0];

export default {
  component: ProfilePage,
  args: {},
} as Meta;

const Template: StoryFn<typeof ProfileForm> = (args) => {
  const { userQuery } = args;
  return <ProfileForm userQuery={userQuery} />;
};

export const WithData = Template.bind({});
WithData.args = {
  userQuery: makeFragmentData(
    {
      ...fakeUserData,
      isVerifiedGovEmployee: fakeUserData.isVerifiedGovEmployee ?? null,
    },
    UserProfile_Fragment,
  ),
};

export const Null = Template.bind({});
Null.args = {
  userQuery: makeFragmentData(
    { __typename: "User", isVerifiedGovEmployee: null },
    UserProfile_Fragment,
  ),
};
