import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { action } from "@storybook/addon-actions";
import { CreateTicketInput, SupportForm } from "./SupportForm";

export default {
  component: SupportForm,
  title: "Support/Support Form",
} as ComponentMeta<typeof SupportForm>;

const Template: ComponentStory<typeof SupportForm> = (args) => {
  const [showSupportForm, setShowSupportForm] = useState(true);
  return (
    <SupportForm
      {...args}
      showSupportForm={showSupportForm}
      onFormToggle={setShowSupportForm}
      handleCreateTicket={async (data: CreateTicketInput) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Create ticket")(data);
        return null;
      }}
    />
  );
};

export const Default = Template.bind({});
export const FormWithUser = Template.bind({});

const userData = fakeUsers();

FormWithUser.args = {
  currentUser: userData[0],
};
