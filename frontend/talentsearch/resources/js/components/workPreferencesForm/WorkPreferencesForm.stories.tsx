import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeOperationalRequirements } from "@common/fakeData";
import WorkPreferencesForm from "./WorkPreferencesForm";

export default {
  component: WorkPreferencesForm,
  title: "WorkPreferencesForm",
} as Meta;

const TemplatePreferencesForm: Story = () => {
  return (
    <WorkPreferencesForm
      operationalRequirements={fakeOperationalRequirements()}
      handleSubmit={async (data: any) => {
        action("submit")(data);
      }}
    />
  );
};

export const IndividualWorkPreferences = TemplatePreferencesForm.bind({});
