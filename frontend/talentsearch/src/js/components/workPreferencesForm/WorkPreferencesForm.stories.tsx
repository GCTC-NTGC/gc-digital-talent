import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import {
  GetWorkPreferencesQuery,
  OperationalRequirement,
  UpdateUserAsUserInput,
} from "../../api/generated";

import { WorkPreferencesForm } from "./WorkPreferencesForm";

const mockUser: GetWorkPreferencesQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    wouldAcceptTemporary: true,
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
      handleWorkPreferences={async (_: string, data: UpdateUserAsUserInput) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
        action("Update Work Preferences")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkPreferences = TemplatePreferencesForm.bind({});
