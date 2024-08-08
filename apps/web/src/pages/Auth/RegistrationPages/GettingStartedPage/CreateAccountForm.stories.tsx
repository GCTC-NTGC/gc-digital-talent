import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeClassifications,
  fakeDepartments,
  fakeLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import {
  CreateAccountForm,
  CreateAccount_QueryFragment,
} from "./GettingStartedPage";

const departments = fakeDepartments();
const classifications = fakeClassifications();
const mockFragmentData = makeFragmentData(
  {
    departments,
    classifications,
    languages: fakeLocalizedEnum(Language),
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
