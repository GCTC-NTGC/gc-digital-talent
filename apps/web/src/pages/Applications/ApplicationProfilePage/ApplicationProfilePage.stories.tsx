import type { Meta, StoryFn } from "@storybook/react-vite";

import { fakePoolCandidates, fakeUser } from "@gc-digital-talent/fake-data";

import { ApplicationProfile } from "./ApplicationProfilePage";

const [fakeApplication] = fakePoolCandidates();

const generatedUser = fakeUser();
const emptyUser = {
  ...generatedUser,
  ...Object.fromEntries(
    Object.keys(generatedUser).map((field) => [field, null]),
  ),
  __typename: "User" as const,
  id: "",
  isEmailVerified: null,
  isProfileComplete: null,
  indigenousDeclarationSignature: null,
  isWorkEmailVerified: null,
  department: null,
  currentClassification: null,
};

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
    user: emptyUser,
  },
};
