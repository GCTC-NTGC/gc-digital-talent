import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import { FormValues, SupportFormComponent } from "./SupportForm";

export default {
  component: SupportFormComponent,
  title: "Forms/Support Form",
} as Meta<typeof SupportFormComponent>;

const Template: StoryFn<typeof SupportFormComponent> = (args) => {
  const [showSupportForm, setShowSupportForm] = useState(true);
  return (
    <SupportFormComponent
      {...args}
      showSupportForm={showSupportForm}
      onFormToggle={setShowSupportForm}
      handleCreateTicket={async (data: FormValues) => {
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
