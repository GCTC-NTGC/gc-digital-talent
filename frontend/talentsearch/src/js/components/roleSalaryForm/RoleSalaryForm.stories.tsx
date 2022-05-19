import React from "react";
import type { Meta, Story } from "@storybook/react";
import { RoleSalaryForm } from "./RoleSalaryForm";

export default {
  component: RoleSalaryForm,
  title: "Role Salary Expectation Form",
} as Meta;

const TemplateRoleSalaryForm: Story = () => <RoleSalaryForm />;

export const form = TemplateRoleSalaryForm.bind({});
