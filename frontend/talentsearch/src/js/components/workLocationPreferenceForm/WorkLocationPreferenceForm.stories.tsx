import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Language, User, WorkRegion } from "../../api/generated";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "WorkLocationPreferenceForm",
} as Meta;

const user: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  telephone: "+867365373244",
  preferredLang: Language.En,
  locationPreferences: [WorkRegion.Atlantic],
  locationExemptions: "",
};

const TemplateWorkLocationPreferencesForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      initialData={user}
      handleWorkLocationPreference={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Work Location Preference")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});
