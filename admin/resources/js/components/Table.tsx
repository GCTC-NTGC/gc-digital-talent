/* eslint-disable react/jsx-key */
import React, { ReactElement, useState } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";

export type ColumnsOf<T extends Record<string, unknown>> = Array<Column<T>>;

interface TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: Array<Column<T>>;
  data: Array<T>;
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
    allColumns,
    getToggleHideAllColumnsProps,
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

  const IndeterminateCheckbox: React.FC<
    (React.HTMLProps<HTMLInputElement> & { indeterminate: boolean }) | any
  > = ({ indeterminate, ...rest }) => {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} {...rest} />;
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
            <td>
              <button
                style={{
                  marginLeft: "15px",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                type="button"
                onClick={() => {
                  setShowList(!showList);
                }}
              >
                Table Columns
              </button>
              {showList ? (
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "10px",
                    border: "1px solid grey",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <IndeterminateCheckbox
                      {...getToggleHideAllColumnsProps()}
                    />{" "}
                    Toggle All
                  </div>
                  {allColumns.map((column) => (
                    <div key={column.id}>
                      <label>
                        <input
                          type="checkbox"
                          {...column.getToggleHiddenProps()}
                        />{" "}
                        {column.id}
                      </label>
                    </div>
                  ))}
                </div>
              ) : null}
            </td>
          </tr>
        ) : null}
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
}

export default Table;
