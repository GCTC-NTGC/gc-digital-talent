import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { WorkLocationPreferenceQuery, WorkRegion } from "../../api/generated";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "WorkLocationPreferenceForm",
} as Meta;

const mockUser: WorkLocationPreferenceQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    locationPreferences: [WorkRegion.Atlantic],
    locationExemptions: "dagu",
  },
};

const TemplateWorkLocationPreferencesForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      initialData={mockUser}
      handleWorkLocationPreference={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Work Location Preference")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});
