import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { CreateUserInput, User, WorkRegion } from "../../api/generated";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "Work Location Preference Form",
} as Meta;

const user: User = {
  id: "1",
  locationPreferences: [],
  locationExemptions: "",
  email: "",
};

const TemplateWorkLocationPreferenceForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      initialUser={user}
      handleWorkLocationPreference={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create User")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreference =
  TemplateWorkLocationPreferenceForm.bind({});
