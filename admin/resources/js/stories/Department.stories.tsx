import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeDepartments } from "@common/fakeData";
import { DepartmentTable } from "../components/department/DepartmentTable";
import { CreateDepartmentForm } from "../components/department/CreateDepartment";
import { CreateDepartmentInput, Department } from "../api/generated";
import { UpdateDepartmentForm } from "../components/department/UpdateDepartment";

const stories = storiesOf("Departments", module);

stories.add("Departments Table", () => (
  <DepartmentTable departments={fakeDepartments()} editUrlRoot="#" />
));

stories.add("Create Department Form", () => {
  return (
    <CreateDepartmentForm
      handleCreateDepartment={async (data: CreateDepartmentInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Department")(data);
        return null;
      }}
    />
  );
});

stories.add("Update Department Form", () => {
  const department: Department = {
    id: "1",
    departmentNumber: 1,
    name: {
      en: "Agriculture and Agri-Food",
      fr: "Agriculture et de l'Agroalimentaire",
    },
  };

  return (
    <UpdateDepartmentForm
      initialDepartment={department}
      handleUpdateDepartment={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Department")(data);
        return {
          id,
          departmentNumber: data.departmentNumber || 0,
          name: data.name || {
            en: "No department name found.",
            fr: "No department name found.",
          },
        };
      }}
    />
  );
});
