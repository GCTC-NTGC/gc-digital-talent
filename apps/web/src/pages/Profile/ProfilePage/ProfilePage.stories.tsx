import React from "react";
import { Meta, Story } from "@storybook/react";

import { fakeUsers, fakeExperiences } from "@gc-digital-talent/fake-data";

import { JobLookingStatus, User } from "~/api/generated";

import ProfilePage, { ProfileForm } from "./ProfilePage";

const fakeUserData = fakeUsers(1)[0];
const fakeExperienceArray = fakeExperiences(3);

export default {
  component: ProfilePage,
  title: "Pages/Profile Page",
  args: {},
  parameters: {
    apiResponses: {
      getMyStatus: {
        data: {
          me: {
            isProfileComplete: true,
            jobLookingStatus: JobLookingStatus.OpenToOpportunities,
          },
        },
      },
    },
  },
} as Meta;

const Template: Story<User> = (args) => {
  return <ProfileForm profileDataInput={args} />;
};

export const CompletedWithoutExperiences = Template.bind({});
export const CompletedWithExperiences = Template.bind({});
export const EmptyAllNull = Template.bind({});

CompletedWithoutExperiences.args = { ...fakeUserData };
CompletedWithExperiences.args = {
  ...fakeUserData,
  experiences: fakeExperienceArray,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullUserData: any = {};
Object.keys(fakeUserData).forEach((key) => {
  nullUserData[key] = null;
});
EmptyAllNull.args = {
  ...nullUserData,
  id: "test ID", // this page can only be loaded by a logged in user
  email: undefined,
};
