/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";
import SettingsIcon from "../../../public/images/settings.png";
import CheckmarkIcon from "../../../public/images/checkmark-icon.jpeg";

export type FilterableColumn = Column & { showCol?: boolean };

interface TableProps {
  columns: Array<FilterableColumn>;
  data: any;
  filter?: boolean;
}

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

  const [showList, setShowList] = useState(false);
  const [showColumns, setShowColumns] = useState(columns);

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
                onClick={() => {
                  setShowList(!showList);
                }}
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
                {showList && (
                  <ul
                    style={{
                      listStyleType: "none",
                      textAlign: "left",
                      position: "absolute",
                      marginLeft: "-35px",
                      backgroundColor: "white",
                    }}
                  >
                    {columns.map((column) => (
                      <li>
                        {column.showCol ? (
                          <img
                            src={CheckmarkIcon}
                            style={{
                              width: "10px",
                              height: "10px",
                              marginRight: "5px",
                            }}
                            alt="checkmark con"
                          />
                        ) : null}
                        <button
                          type="button"
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => {
                            setShowColumns(
                              showColumns.map((lColumn) => {
                                if (lColumn.accessor === column.accessor) {
                                  lColumn.showCol = !column.showCol;
                                  return lColumn;
                                }
                                return lColumn;
                              }),
                            );
                          }}
                        >
                          {column.Header}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
