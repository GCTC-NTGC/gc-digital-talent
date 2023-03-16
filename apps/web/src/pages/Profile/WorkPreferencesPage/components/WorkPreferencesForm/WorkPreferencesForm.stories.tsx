import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { OperationalRequirementV2 } from "@gc-digital-talent/i18n";
import { PositionDuration, UpdateUserAsUserInput, User } from "~/api/generated";

import WorkPreferencesForm from "./WorkPreferencesForm";

const mockUser: User = {
  __typename: "User",
  id: "11",
  positionDuration: [PositionDuration.Permanent, PositionDuration.Temporary],
  acceptedOperationalRequirements: [OperationalRequirementV2[0]],
};

export default {
  component: WorkPreferencesForm,
  title: "Forms/Work Preferences Form",
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
