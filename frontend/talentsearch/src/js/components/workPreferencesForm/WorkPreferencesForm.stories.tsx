import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import {
  GetWorkPreferencesQuery,
  UpdateUserAsUserInput,
  OperationalRequirement,
} from "../../api/generated";

import { WorkPreferencesForm } from "./WorkPreferencesForm";

const mockUser: GetWorkPreferencesQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    wouldAcceptTemporary: false,
    acceptedOperationalRequirements: [OperationalRequirement.DriversLicense],
  },
};

export default {
  component: WorkPreferencesForm,
  title: "WorkPreferencesForm",
} as Meta;

const TemplatePreferencesForm: Story = () => {
  return (
    <WorkPreferencesForm
      initialData={mockUser}
      handleWorkPreferences={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Work Location Preference")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkPreferences = TemplatePreferencesForm.bind({});
