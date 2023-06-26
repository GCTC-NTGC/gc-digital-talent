import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import { User } from "~/api/generated";

import Table from "./ResponsiveTable";
import Cell from "./CellValue";
import Selection from "./RowSelection";

const mockUsers = fakeUsers(10);
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "name",
    header: "Candidate name",
    cell: (info) => <Cell header="Candidate name">{info.getValue()}</Cell>,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <Cell header="Email">{info.getValue()}</Cell>,
  }),
] as ColumnDef<User>[];

export default {
  component: Table,
  title: "Components/Table",
  args: {
    data: mockUsers,
    columns,
  },
};

const Template: StoryFn<typeof Table<User>> = (args) => {
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

export const RowSelection = Template.bind({});
RowSelection.args = {
  columns: [
    {
      id: "rowSelection",
      header: ({ table }) => (
        <Selection.Header table={table} label="Select all" color="white" />
      ),
      cell: ({ row }) => (
        <Selection.Cell
          row={row}
          label={`Select ${row.original.firstName} ${row.original.lastName}`}
        />
      ),
    },
    ...columns,
  ],
  onRowSelection: (rows) => action("onRowSelection")(rows),
};
