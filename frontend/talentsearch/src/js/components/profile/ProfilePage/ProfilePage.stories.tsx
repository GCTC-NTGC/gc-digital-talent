import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { ProfilePage } from "./ProfilePage";
import { User } from "../../../api/generated";

const fakeUserArray = fakeUsers(5);

export default {
  component: ProfilePage,
  title: "Profile Page",
  args: {},
} as Meta;

const TemplateProfilePage: Story<User> = (args) => {
  return <ProfilePage {...args} />;
};

export const ProfilePageStory1 = TemplateProfilePage.bind({});
export const ProfilePageStory2 = TemplateProfilePage.bind({});
export const ProfilePageStory3 = TemplateProfilePage.bind({});
export const ProfilePageStory4 = TemplateProfilePage.bind({});
export const ProfilePageStory5 = TemplateProfilePage.bind({});

ProfilePageStory1.args = { ...fakeUserArray[0] };
ProfilePageStory2.args = { ...fakeUserArray[1] };
ProfilePageStory3.args = { ...fakeUserArray[2] };
ProfilePageStory4.args = { ...fakeUserArray[3] };
ProfilePageStory5.args = { ...fakeUserArray[4] };
