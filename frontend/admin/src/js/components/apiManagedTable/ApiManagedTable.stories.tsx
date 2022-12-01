import React from "react";
import { Meta, Story } from "@storybook/react";

import { FromArray } from "@common/types/utilityTypes";

import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { Button } from "@common/components";
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
    | "filterComponent"
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
      <TableHeader
        columns={columns}
        hiddenColumnIds={hiddenColumnIds}
        filterComponent={
          <Button onClick={() => action("onOpenFilters")()}>Filters</Button>
        }
        onSearchChange={(term, type) => {
          setSearchState({
            term,
            type,
          });
          action("onSearchChange")({ term, type });
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
          action("onColumnHiddenChange")(event);
        }}
        {...header}
      />
      <BasicTable
        labelledBy="heading"
        columns={columns}
        data={paginatedUsers}
        onSortingRuleChange={(newSortingRule) => {
          setSortingRule(newSortingRule);
          action("onSortingRuleChange")(newSortingRule);
        }}
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
        onCurrentPageChange={(newPage) => {
          setCurrentPage(newPage);
          action("onCurrentPageChange")(newPage);
        }}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
          action("onPageSizeChange")(newPageSize);
        }}
      />
    </>
  );
};

export const Default = Template.bind({});
