/* eslint-disable react/jsx-key */
import React, { ReactElement, useState } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";
import SettingsIcon from "../../../public/images/settings.png";
import CheckmarkIcon from "../../../public/images/checkmark-icon.jpeg";

export type FilterableColumn<T extends Record<string, unknown>> = Column<T> & {
  showCol?: boolean;
};

interface TableProps<T extends Record<string, unknown>> {
  columns: FilterableColumn<T>[];
  data: T[];
  filter?: boolean;
  hiddenCols?: string[];
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  filter = true,
  hiddenCols = [],
}: TableProps<T>): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    preGlobalFilteredRows,
  } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: hiddenCols,
      },
    },
    useGlobalFilter,
    useSortBy,
  );

  const [showList, setShowList] = useState(false);
  const [showColumns, setShowColumns] = useState(columns);

  // This is a hack to sync isVisible with showCol
  headerGroups.map((headerGroup) => {
    return headerGroup.headers.map((header) => {
      const column = columns.find((lColumn) => {
        return lColumn.accessor === header.id;
      });

      if (!column?.showCol === true) {
        header.isVisible = false;
      }
      return header;
    });
  });

  const shouldBeVisible = (id: string): boolean | undefined => {
    const column = columns.find((lColumn) => {
      return lColumn.accessor === id;
    });

    if (column?.showCol === undefined) return true;
    return column?.showCol;
  };

  return (
    <table {...getTableProps()}>
      <thead>
        {filter ? (
          <tr>
            <td>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </td>
          </tr>
        ) : null}
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(
              (column) =>
                shouldBeVisible(column.id) && (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted && (column.isSortedDesc ? " ▼" : " ▲")}
                    </span>
                  </th>
                ),
            )}
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
                        {column.showCol || column.showCol === undefined ? (
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
                if (!shouldBeVisible(cell.column.id)) return null;
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
