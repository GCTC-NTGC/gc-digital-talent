import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "storybook/actions";
import {
  ColumnDef,
  createColumnHelper,
  CellContext,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import { matchStringCaseDiacriticInsensitive as match } from "@gc-digital-talent/forms";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { Language, User } from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import Table from "./ResponsiveTable";
import Selection from "./RowSelection";
import { SearchState } from "./types";

const mockUsers = fakeUsers(100);
const columnHelper = createColumnHelper<User>();
const defaultSearchProps = {
  id: "search",
  label: "Search",
  internal: true,
  onChange: (newState: SearchState) => {
    action("onSearchChange")(newState);
  },
};
const defaultSortProps = {
  internal: true,
  onSortChange: (newSort: SortingState) => {
    action("onSortChange")(newSort);
  },
};
const defaultPaginationProps = {
  internal: true,
  total: mockUsers.length,
  pageSizes: [10, 20, 50, 100],
  onPaginationChange: (newPagination: PaginationState) => {
    action("onPaginationChange")(newPagination);
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
    meta: {
      isRowTitle: true,
      mobileHeader: "Name",
    },
  }),
  columnHelper.accessor(
    (row) => (row.preferredLang?.value === Language.Fr ? "French" : "English"),
    {
      id: "preferredCommunication",
      header: "Preferred communication language",
      meta: {
        mobileHeader: "Preferred communication",
      },
    },
  ),
  columnHelper.accessor("email", {
    header: "Email",
  }),
] as ColumnDef<User>[];

export default {
  component: Table,
  args: {
    data: mockUsers,
    columns,
    rowTitle: "name",
    search: defaultSearchProps,
    sort: defaultSortProps,
    pagination: defaultPaginationProps,
  },
} as Meta<typeof Table<User>>;

const Template: StoryFn<typeof Table<User>> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  caption: "Default table",
  add: {
    linkProps: {
      label: "Add an item",
      href: "#add",
    },
  },
  search: {
    ...defaultSearchProps,
  },
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
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
    getRowId: (row) => row.id,
    onRowSelection: (rows) => action("onRowSelection")(rows),
    cell: rowSelectCell,
  },
};

export const InitialState = Template.bind({});
InitialState.args = {
  caption: "Default table",
  add: {
    linkProps: {
      label: "Add an item",
      href: "#add",
    },
  },
  pagination: {
    ...defaultPaginationProps,
    initialState: {
      pageIndex: 1,
      pageSize: 10,
    },
  },
  search: {
    ...defaultSearchProps,
    initialState: {
      term: "Sa",
      type: "name",
    },
  },
};

const ServerSideTemplate: StoryFn<typeof Table<User>> = (args) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<SearchState>({
    term: "",
    type: "",
  });
  const [, setRowSelection] = useState<User[]>([]);

  const handleSearchChange = (newSearchState: SearchState) => {
    setLoading(true);
    mockApi(newSearchState)
      .then((res) => {
        setSearchState(res);
      })
      .catch((err) => action("search error")(err))
      .finally(() => setLoading(false));
  };

  const handleRowSelection = (rows: string[]) => {
    action("onRowSelection")(rows);
    setLoading(true);
    mockApi(rows)
      .then(() => {
        const newSelection = mockUsers.filter(({ id }) => rows.includes(id));
        setRowSelection(newSelection);
      })
      .catch((err) => action("selection error")(err))
      .finally(() => setLoading(false));
  };

  const filteredData = mockUsers.filter((user) => {
    if (!searchState.term) {
      return mockUsers;
    }

    const key = searchState.type as keyof User;
    const { firstName, lastName, email } = user;

    if (searchState.type && user[key]) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return match(searchState.term, String(user[key]));
    }

    return (
      (firstName && match(searchState.term, firstName)) ??
      (lastName && match(searchState.term, lastName)) ??
      (email && match(searchState.term, email))
    );
  });

  return (
    <Table
      {...args}
      isLoading={isLoading}
      data={filteredData}
      rowSelect={{
        getRowId: (row) => row.id,
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
