import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import fakeDepartments from "@common/fakeData/fakeDepartments";

import { DepartmentTable } from "./DepartmentTable";

const mockDepartments = fakeDepartments();

export default {
  component: DepartmentTable,
  title: "Tables/Department Table",
} as ComponentMeta<typeof DepartmentTable>;

const Template: ComponentStory<typeof DepartmentTable> = (args) => {
  const { departments } = args;
  return <DepartmentTable departments={departments} />;
};

export const Default = Template.bind({});
Default.args = {
  departments: mockDepartments,
};
