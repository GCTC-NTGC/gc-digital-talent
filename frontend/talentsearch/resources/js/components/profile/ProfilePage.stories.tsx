import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { ProfilePage } from "./ProfilePage";
import { User } from "../../api/generated";

export default {
  component: ProfilePage,
  title: "Profile Page",
  args: fakeUsers()[0],
} as Meta;

const TemplateProfilePage: Story<User> = (args) => {
  return <ProfilePage {...args} />;
};

export const ProfilePageStory = TemplateProfilePage.bind({});
