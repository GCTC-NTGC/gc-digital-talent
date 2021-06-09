import React, { useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";

interface UserTableProps {
  users: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    preferredLang: string;
  }>;
}

const UserTable: React.FC<UserTableProps> = (users) => {
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Preferred Language",
        accessor: "preferredLang",
      },
    ],
    [],
  );

  const data = useMemo(() => users, [users]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({ columns, data: data.users }, useGlobalFilter, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th colSpan={visibleColumns.length}>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={`header-group-${headerGroup.id}`}
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted && (column.isSortedDesc ? " ▼" : " ▲")}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={`row-${row.id}`}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} key={`cell-${cell.column.id}`}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserTable;
