import { StoryFn, Meta } from "@storybook/react-vite";

import { fakeDepartments } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import {
  DepartmentTable,
  DepartmentTableRow_Fragment,
} from "./DepartmentTable";

const mockDepartments = fakeDepartments();
const departmentFragments = mockDepartments.map((department) =>
  makeFragmentData(department, DepartmentTableRow_Fragment),
);

export default {
  component: DepartmentTable,
} as Meta<typeof DepartmentTable>;

const Template: StoryFn<typeof DepartmentTable> = (args) => {
  const { departmentsQuery, title, myRolesAndTeams } = args;
  return (
    <DepartmentTable
      departmentsQuery={departmentsQuery}
      title={title}
      myRolesAndTeams={myRolesAndTeams}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  departmentsQuery: departmentFragments,
  title: "Departments",
  myRolesAndTeams: [
    {
      departmentId: mockDepartments[0].id,
      roleName: { en: ROLE_NAME.DepartmentAdmin },
    },
  ],
};
