import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  ColumnDef,
  createColumnHelper,
  CellContext,
} from "@tanstack/react-table";

import { matchStringCaseDiacriticInsensitive as match } from "@gc-digital-talent/forms";
import { fakeUsers } from "@gc-digital-talent/fake-data";

import { User } from "~/api/generated";

import { Language } from "@gc-digital-talent/graphql";
import Table from "./ResponsiveTable";
import Cell from "./CellValue";
import Selection from "./RowSelection";
import { SearchState } from "./types";

const mockUsers = fakeUsers(10);
const columnHelper = createColumnHelper<User>();
const defaultSearchProps = {
  id: "search",
  label: "Search",
  internal: true,
  onChange: (newState: SearchState) => {
    action("onSearchChange")(newState);
  },
};

const rowSelectCell = ({ row }: CellContext<User, unknown>) => (
  <Selection.Cell
    row={row}
    label={`Select ${row.original.firstName} ${row.original.lastName}`}
  />
);

const mockApi = async <T,>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "name",
    header: "Candidate name",
    cell: (info) => (
      <Cell header="Candidate name" isRowTitle>
        {info.getValue()}
      </Cell>
    ),
  }),
  columnHelper.accessor(
    (row) => (row.preferredLang === Language.Fr ? "French" : "English"),
    {
      id: "preferredCommunication",
      header: "Preferred Communication Language",
      cell: (info) => (
        <Cell header="Preferred Communication Language">{info.getValue()}</Cell>
      ),
    },
  ),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <Cell header="Email">{info.getValue()}</Cell>,
  }),
] as ColumnDef<User>[];

export default {
  component: Table,
  title: "Tables/Responsive Table",
  args: {
    data: mockUsers,
    columns,
    rowTitle: "name",
    search: defaultSearchProps,
  },
} as Meta<typeof Table<User>>;

const Template: StoryFn<typeof Table<User>> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  caption: "Default table",
  search: {
    ...defaultSearchProps,
    searchBy: [
      {
        label: "Name",
        value: "name",
      },
    ],
  },
};

export const Empty = Template.bind({});
Empty.args = {
  caption: "Empty table",
  data: [],
};

export const RowSelection = Template.bind({});
RowSelection.args = {
  rowSelect: {
    onRowSelection: (rows) => action("onRowSelection")(rows),
    cell: rowSelectCell,
  },
};

const ServerSideTemplate: StoryFn<typeof Table<User>> = (args) => {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [searchState, setSearchState] = React.useState<SearchState>({
    term: "",
    type: "",
  });
  const [, setRowSelection] = React.useState<User[]>([]);

  const handleSearchChange = async (newSearchState: SearchState) => {
    setLoading(true);
    await mockApi(newSearchState)
      .then((res) => {
        setSearchState(res);
      })
      .finally(() => setLoading(false));
  };

  const handleRowSelection = async (rows: User[]) => {
    action("onRowSelection")(rows);
    setLoading(true);
    await mockApi(rows)
      .then((res) => {
        setRowSelection(res);
      })
      .finally(() => setLoading(false));
  };

  const filteredData = mockUsers.filter((user) => {
    if (!searchState.term) {
      return mockUsers;
    }

    const key = searchState.type as keyof User;
    const { firstName, lastName, email } = user;

    if (searchState.type && user[key]) {
      return match(searchState.term, String(user[key]));
    }

    return (
      (firstName && match(searchState.term, firstName)) ||
      (lastName && match(searchState.term, lastName)) ||
      (email && match(searchState.term, email))
    );
  });

  return (
    <Table
      {...args}
      isLoading={isLoading}
      data={filteredData}
      rowSelect={{
        onRowSelection: handleRowSelection,
        cell: rowSelectCell,
      }}
      search={{
        ...defaultSearchProps,
        internal: false,
        onChange: handleSearchChange,
      }}
    />
  );
};

export const ServerSide = ServerSideTemplate.bind({});
