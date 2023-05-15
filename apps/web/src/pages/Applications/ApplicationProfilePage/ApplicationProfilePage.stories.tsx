import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import { ApplicationProfile } from "./ApplicationProfilePage";

const fakeApplication = fakePoolCandidates()[0];

export default {
  component: ApplicationProfile,
  title: "Pages/Application/Profile",
  args: {
    application: fakeApplication,
    user: fakeApplication.user,
  },
} as ComponentMeta<typeof ApplicationProfile>;

const Template: ComponentStory<typeof ApplicationProfile> = (args) => {
  return <ApplicationProfile {...args} />;
};

export const Default = Template.bind({});

export const EmptyUser = Template.bind({});
EmptyUser.args = {
  user: {
    id: fakeApplication.user.id,
  },
};
