import { Meta, StoryFn } from "@storybook/react-vite";

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

export const WithData = {
  render: Template,

  args: {
    userQuery: makeFragmentData(fakeUserData, UserProfile_Fragment),
  },
};

export const Null = {
  render: Template,

  args: {
    userQuery: makeFragmentData(
      {
        id: "test ID", // this page can only be loaded by a logged in user
        email: undefined,
      },
      UserProfile_Fragment,
    ),
  },
};
