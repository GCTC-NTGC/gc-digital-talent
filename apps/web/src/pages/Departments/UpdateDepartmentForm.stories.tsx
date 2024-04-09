import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeDepartments } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  DepartmentForm_Fragment,
  UpdateDepartmentForm,
} from "./UpdateDepartmentPage";

const mockDepartments = fakeDepartments();
const department = makeFragmentData(
  mockDepartments[0],
  DepartmentForm_Fragment,
);

export default {
  component: UpdateDepartmentForm,
  title: "Forms/Update Department Form",
} as Meta<typeof UpdateDepartmentForm>;

const Template: StoryFn<typeof UpdateDepartmentForm> = (args) => {
  const { query } = args;

  return (
    <UpdateDepartmentForm
      query={query}
      handleUpdateDepartment={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update Department")({
              id,
              data,
            });
            resolve(department);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  query: department,
};
