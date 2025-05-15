import { Meta, StoryFn } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import { ApplicationProfile } from "./ApplicationProfilePage";

const fakeApplication = fakePoolCandidates()[0];

export default {
  component: ApplicationProfile,
  args: {
    application: fakeApplication,
  },
} as Meta<typeof ApplicationProfile>;

const Template: StoryFn<typeof ApplicationProfile> = (args) => {
  return <ApplicationProfile {...args} />;
};

export const Default = Template.bind({});

export const EmptyUser = Template.bind({});
EmptyUser.args = {
  application: {
    ...fakeApplication,
    user: { id: "" },
  },
};
