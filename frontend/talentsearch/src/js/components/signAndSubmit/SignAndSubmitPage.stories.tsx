import React from "react";
import { Meta, Story } from "@storybook/react";
import { SignAndSubmitForm, SignAndSubmitFormProps } from "./SignAndSubmitPage";

export default {
  component: SignAndSubmitForm,
  title: "Sign and Submit page",
  args: {
    closingDate: Date.now() + 1,
    jobTitle: "Application Developer - React (IT-01)",
    isNotComplete: false,
  },
} as Meta;

const Template: Story<SignAndSubmitFormProps> = (args) => {
  return <SignAndSubmitForm {...args} />;
};

export const ApplicationIsComplete = Template.bind({});
export const ApplicationIsIncomplete = Template.bind({});

ApplicationIsIncomplete.args = {
  isNotComplete: true,
};
