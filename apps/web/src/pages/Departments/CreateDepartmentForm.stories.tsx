import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeDepartments } from "@gc-digital-talent/fake-data";

import { CreateDepartmentForm } from "./CreateDepartmentPage";

const mockDepartments = fakeDepartments();

export default {
  component: CreateDepartmentForm,
  title: "Forms/Create Department Form",
} as Meta<typeof CreateDepartmentForm>;

const Template: StoryFn<typeof CreateDepartmentForm> = () => (
  <CreateDepartmentForm
    handleCreateDepartment={async (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          action("Create Department")(data);
          return resolve(mockDepartments[0]);
        }, 1000);
      });
    }}
  />
);

export const Default = Template.bind({});
