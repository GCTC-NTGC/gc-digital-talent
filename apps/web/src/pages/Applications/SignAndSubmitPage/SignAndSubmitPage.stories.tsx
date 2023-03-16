import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";
import { SignAndSubmitForm } from "./SignAndSubmitPage";

export default {
  component: SignAndSubmitForm,
  title: "Pages/Sign and Submit Page",
  args: {
    applicationId: "1",
    poolAdvertisementId: "1",
    userId: "1",
    closingDate: FAR_FUTURE_DATE,
    jobTitle: "Application Developer - React (IT-01)",
    handleSubmitApplication: async (id, signature) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Submit Application")({ id, signature });
      return null;
    },
  },
} as ComponentMeta<typeof SignAndSubmitForm>;

const Template: ComponentStory<typeof SignAndSubmitForm> = (args) => {
  return <SignAndSubmitForm {...args} />;
};

export const Default = Template.bind({});
