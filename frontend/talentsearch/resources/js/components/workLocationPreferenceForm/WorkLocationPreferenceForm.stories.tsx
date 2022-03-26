import React from "react";
import { Meta, Story } from "@storybook/react";
import { CreateUserInput } from "@common/api/generated";
import { action } from "@storybook/addon-actions";
import WorkLocationPreferenceForm from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "Work Location Preference Form",
} as Meta;

const TemplateWorkLocationPreferenceForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      handleSubmit={async (data: CreateUserInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Work Location Preference")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreference =
  TemplateWorkLocationPreferenceForm.bind({});
