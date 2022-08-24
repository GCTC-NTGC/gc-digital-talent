import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SignAndSubmitForm } from "./SignAndSubmitPage";

export default {
  component: SignAndSubmitForm,
  title: "Sign and Submit page",
  args: {
    closingDate: new Date(Date.now() + 1),
    jobTitle: "Application Developer - React (IT-01)",
    isNotComplete: false,
  },
} as ComponentMeta<typeof SignAndSubmitForm>;

const Template: ComponentStory<typeof SignAndSubmitForm> = (args) => {
  return <SignAndSubmitForm {...args} />;
};

export const ApplicationIsComplete = Template.bind({});
export const ApplicationIsIncomplete = Template.bind({});

ApplicationIsIncomplete.args = {
  isNotComplete: true,
};
