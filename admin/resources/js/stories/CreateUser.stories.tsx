import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { CreateUserForm } from "../components/CreateUser";

const stories = storiesOf("Components/User", module);

stories.add("Create User Form", () => {
  return (
    <CreateUserForm
      handleCreateUser={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create User")(data);
      }}
    />
  );
});
