import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeOperationalRequirements } from "@common/fakeData";
import WorkPreferencesFormWithoutWrapper from "./WorkPreferencesFormWithoutWrapper";

export default {
  component: WorkPreferencesFormWithoutWrapper,
  title: "WorkPreferencesFormWithoutWrapper",
} as Meta;

const TemplatePreferencesForm2: Story = () => {
  return (
    <WorkPreferencesFormWithoutWrapper
      operationalRequirements={fakeOperationalRequirements()}
      handleSubmit={async (data: any) => {
        action("submit")(data);
      }}
    />
  );
};

export const IndividualWorkPreferences2 = TemplatePreferencesForm2.bind({});
