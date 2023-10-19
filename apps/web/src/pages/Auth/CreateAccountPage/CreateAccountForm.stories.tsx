import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";

import { CreateAccountForm } from "./CreateAccountPage";

const departments = fakeDepartments();
const classifications = fakeClassifications();

export default {
  component: CreateAccountForm,
  title: "Pages/Create account",
} as Meta<typeof CreateAccountForm>;

const Template: StoryFn<typeof CreateAccountForm> = () => {
  return (
    <CreateAccountForm
      departments={departments}
      classifications={classifications}
      handleCreateAccount={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
