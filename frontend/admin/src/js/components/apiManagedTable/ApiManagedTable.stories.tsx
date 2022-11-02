import React from "react";
import { Meta, Story } from "@storybook/react";

import { FromArray } from "@common/types/utilityTypes";

import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import BasicTable from "./BasicTable";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  IdType,
  SortingRule,
} from "./basicTableHelpers";
import { User } from "../../api/generated";

type ApiManageTableProps = {
  header: Omit<
    React.ComponentProps<typeof TableHeader>,
    | "onSearchChange"
    | "onColumnHiddenChange"
    | "hiddenColumnIds"
    | "filterButtonComponent"
    | "columns"
  >;
};

const mockUsers = fakeUsers(100);

type Users = Array<User>;

type SearchState = {
  term?: string;
  type?: string;
};

type Data = NonNullable<FromArray<Users>>;

const columns: ColumnsOf<Data> = [
  {
    label: "First Name",
    id: "firstName",
    accessor: (row: User) => row.firstName,
    sortColumnName: "firstName",
  },
  {
    label: "Last Name",
    id: "lastName",
    accessor: (row: User) => row.lastName,
    sortColumnName: "lastName",
  },
  {
    label: "Email",
    id: "email",
    accessor: (row: User) => row.email,
    sortColumnName: "email",
  },
  {
    label: "Edit",
    id: "edit",
    accessor: () => <a href="/#">Edit</a>,
  },
];

export default {
  component: BasicTable,
  title: "API Managed Table",
  subcomponents: {
    TableHeader,
    TableFooter,
  },
  args: {
    header: {
      addBtn: {
        label: "Add row",
        path: "/#",
      },
    },
  },
} as Meta<ApiManageTableProps>;

const allColumnIds = columns.map((c) => c.id);

const Template: Story<ApiManageTableProps> = (args) => {
  const { header } = args;
  const [sortingRule, setSortingRule] = React.useState<SortingRule<Data>>();
  const [hiddenColumnIds, setHiddenColumnIds] = React.useState<IdType<Data>[]>(
    [],
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [, setSearchState] = React.useState<SearchState>({
    type: "",
    term: "",
  });

  const paginatedUsers = React.useMemo(() => {
    const page = currentPage - 1;
    const start = page * pageSize;
    const end = start + pageSize;
    return mockUsers.slice(start, end);
  }, [pageSize, currentPage]);

  return (
    <>
      <h2 id="heading">API Managed Table</h2>
      <p>Note: Search not functional</p>
      <TableHeader
        columns={columns}
        hiddenColumnIds={hiddenColumnIds}
        filterButtonComponent={null}
        onSearchChange={(term, type) => {
          action(JSON.stringify({ term, type }));
          setSearchState({
            term,
            type,
          });
        }}
        searchBy={[
          { label: "First Name", value: "firstName" },
          { label: "Last Name", value: "lastName" },
          { label: "Email", value: "email" },
        ]}
        onColumnHiddenChange={(event) => {
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds,
            setHiddenColumnIds,
            event,
          );
        }}
        {...header}
      />
      <BasicTable
        labelledBy="heading"
        columns={columns}
        data={paginatedUsers}
        onSortingRuleChange={setSortingRule}
        sortingRule={sortingRule}
        hiddenColumnIds={hiddenColumnIds}
      />
      <TableFooter
        paginatorInfo={{
          count: mockUsers.length,
          total: mockUsers.length,
          currentPage,
          perPage: pageSize,
          lastPage: mockUsers.length / pageSize,
          hasMorePages: pageSize + currentPage * pageSize < mockUsers.length,
        }}
        onCurrentPageChange={setCurrentPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
        }}
      />
    </>
  );
};

export const Default = Template.bind({});
