import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeDepartments } from "@gc-digital-talent/fake-data";

import { DepartmentTable } from "./DepartmentTable";

const mockDepartments = fakeDepartments();

export default {
  component: DepartmentTable,
  title: "Tables/Department Table",
} as ComponentMeta<typeof DepartmentTable>;

const Template: ComponentStory<typeof DepartmentTable> = (args) => {
  const { departments, title } = args;
  return <DepartmentTable departments={departments} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  departments: mockDepartments,
  title: "Departments",
};
