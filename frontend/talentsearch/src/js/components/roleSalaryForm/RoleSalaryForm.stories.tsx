import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ClassificationRoleType } from "@common/api/generated";
import { RoleSalaryForm } from "./RoleSalaryForm";

export default {
  component: RoleSalaryForm,
  title: "Role Salary Expectation Form",
} as Meta;

const TemplateRoleSalaryForm: Story = (args) => {
  const { initialFormValues, handleSubmit } = args;
  return (
    <RoleSalaryForm
      initialFormValues={initialFormValues}
      handleSubmit={handleSubmit}
    />
  );
};
export const formEmpty = TemplateRoleSalaryForm.bind({});
export const formSomeSelected = TemplateRoleSalaryForm.bind({});

formEmpty.args = {
  initialFormValues: { expectedClassificationRoles: [] },
  handleSubmit: action("handleSubmit"),
};

formSomeSelected.args = {
  ...formEmpty.args,
  initialFormValues: {
    expectedClassificationRoles: [
      ClassificationRoleType.AnalystIt02,
      ClassificationRoleType.TechnicalAdvisorIt03,
    ],
  },
};
