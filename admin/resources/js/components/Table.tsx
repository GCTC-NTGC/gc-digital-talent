/* eslint-disable react/jsx-key */
import React from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";
import SettingsIcon from "../../../public/images/settings.png";

interface TableProps {
  columns: Array<Column>;
  data: any;
  filter?: boolean;
}

const toggleList = () => {
  console.log("test");
};

const Table: React.FunctionComponent<TableProps> = ({
  columns,
  data,
  filter = true,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    preGlobalFilteredRows,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <table {...getTableProps()}>
      {filter ? (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      ) : null}
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
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
            <th>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "0",
                  boxShadow: "none",
                  marginLeft: "15px",
                  marginTop: "7px",
                  cursor: "pointer",
                }}
                type="button"
                onClick={toggleList}
              >
                <img
                  src={SettingsIcon}
                  alt="settings icon"
                  style={{
                    width: "25px",
                    height: "25",
                    display: "inline-block",
                  }}
                />
              </button>
            </th>
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
