import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import WorkLocationPreferenceForm, {
  FormValues,
} from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "Work Location Preference Form",
} as Meta;

const TemplateWorkLocationPreferenceForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      handleSubmit={async (data: FormValues) => {
        action("submit")(data);
      }}
    />
  );
};

export const IndividualWorkLocationPreference =
  TemplateWorkLocationPreferenceForm.bind({});
