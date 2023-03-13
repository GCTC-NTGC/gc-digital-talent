import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CreateUserForm } from "./CreateUserPage";

export default {
  component: CreateUserForm,
  title: "Forms/Create User Form",
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof CreateUserForm>;

const Template: ComponentStory<typeof CreateUserForm> = () => (
  <CreateUserForm
    handleCreateUser={async (data) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create User")(data);
      return null;
    }}
  />
);

export const Default = Template.bind({});
