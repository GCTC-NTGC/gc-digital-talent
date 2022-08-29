import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { GenericJobTitleKey } from "@common/api/generated";
import { RoleSalaryForm } from "./RoleSalaryForm";

export default {
  component: RoleSalaryForm,
  title: "Role Salary Expectation Form",
} as Meta;

const TemplateRoleSalaryForm: Story = (args) => {
  const { initialFormValues, handleSubmit } = args;
  return (
    <RoleSalaryForm
      initialData={initialFormValues}
      updateRoleSalary={handleSubmit}
    />
  );
};
export const formEmpty = TemplateRoleSalaryForm.bind({});
export const formSomeSelected = TemplateRoleSalaryForm.bind({});

formEmpty.args = {
  initialFormValues: {
    me: { id: "user-id", expectedGenericJobTitles: [] },
  },
  handleSubmit: action("handleSubmit"),
};

formSomeSelected.args = {
  ...formEmpty.args,
  initialFormValues: {
    me: {
      id: "user-id",
      expectedGenericJobTitles: [
        { key: GenericJobTitleKey.AnalystIt02 },
        { key: GenericJobTitleKey.TechnicalAdvisorIt03 },
      ],
    },
  },
};
