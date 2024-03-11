import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeDepartments } from "@gc-digital-talent/fake-data";

import { CreateDepartmentForm } from "./CreateDepartmentPage";

const mockDepartments = fakeDepartments();

export default {
  component: CreateDepartmentForm,
  title: "Forms/Create Department Form",
} as ComponentMeta<typeof CreateDepartmentForm>;

const Template: ComponentStory<typeof CreateDepartmentForm> = () => (
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
