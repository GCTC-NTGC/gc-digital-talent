import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  CreateAccountForm,
  CreateAccount_QueryFragment,
} from "./CreateAccountPage";

const departments = fakeDepartments();
const classifications = fakeClassifications();
const mockFragmentData = makeFragmentData(
  {
    departments,
    classifications,
  },
  CreateAccount_QueryFragment,
);

export default {
  component: CreateAccountForm,
} as Meta<typeof CreateAccountForm>;

const Template: StoryFn<typeof CreateAccountForm> = () => {
  return (
    <CreateAccountForm
      query={mockFragmentData}
      handleCreateAccount={async (data) => {
        action("submit")(data);
      }}
    />
  );
};

export const Default = Template.bind({});
