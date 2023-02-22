import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeDepartments } from "@gc-digital-talent/fake-data";

import { UpdateDepartmentForm } from "./UpdateDepartmentPage";

const mockDepartments = fakeDepartments();

export default {
  component: UpdateDepartmentForm,
  title: "Forms/Update Department Form",
} as ComponentMeta<typeof UpdateDepartmentForm>;

const Template: ComponentStory<typeof UpdateDepartmentForm> = (args) => {
  const { initialDepartment } = args;

  return (
    <UpdateDepartmentForm
      initialDepartment={initialDepartment}
      handleUpdateDepartment={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update Department")({
              id,
              data,
            });
            resolve(mockDepartments[0]);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  initialDepartment: mockDepartments[0],
};
