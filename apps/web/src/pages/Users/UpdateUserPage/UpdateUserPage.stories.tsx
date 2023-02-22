import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import { UpdateUserForm } from "./UpdateUserPage";

const userData = fakeUsers(1);
// It is possible data may come back from api with missing data.
const flawedUserData = [
  { id: "100-bob", email: "bob@boop.com", lastName: null },
  ...userData,
];

export default {
  component: UpdateUserForm,
  title: "Forms/Update User Form",
} as ComponentMeta<typeof UpdateUserForm>;

const Template: ComponentStory<typeof UpdateUserForm> = (args) => {
  const { initialUser } = args;

  return (
    <UpdateUserForm
      initialUser={initialUser}
      handleUpdateUser={async (id, data) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Update User")({
          id,
          data,
        });
        return null;
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  initialUser: userData[0],
};

export const FlawedUserData = Template.bind({});
FlawedUserData.args = {
  initialUser: flawedUserData[0],
};
