import React from "react";
import { StoryFn } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import { User } from "~/api/generated";

import Table from "./ResponsiveTable";
import Cell from "./CellValue";

const mockUsers = fakeUsers(10);
const columnHelper = createColumnHelper<User>();

export default {
  component: Table,
  title: "Components/Table",
  args: {
    data: mockUsers,
    columns: [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "name",
        header: "Candidate name",
        cell: (info) => <Cell header="Candidate name">{info.getValue()}</Cell>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <Cell header="Email">{info.getValue()}</Cell>,
      }),
    ],
  },
};

const Template: StoryFn<typeof Table> = (args) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  caption: "Default table",
};

export const Empty = Template.bind({});
Empty.args = {
  caption: "Empty table",
  data: [],
};
