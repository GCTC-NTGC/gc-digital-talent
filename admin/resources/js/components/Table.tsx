/* eslint-disable react/jsx-key */
import React, { ReactElement, useState } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import GlobalFilter from "./GlobalFilter";
import Button from "./H2Components/Button";

export type ColumnsOf<T extends Record<string, unknown>> = Array<Column<T>>;

interface TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: Array<Column<T>>;
  data: Array<T>;
  filter?: boolean;
  hiddenCols?: string[];
}

const IndeterminateCheckbox: React.FC<
  React.HTMLProps<HTMLInputElement> & { indeterminate: boolean }
> = ({ indeterminate, ...rest }) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} {...rest} />;
};

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

  return (
    <table {...getTableProps()}>
      <thead>
        {filter ? (
          <>
            <tr>
              <td data-h2-padding="b(bottom, xs)">
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Button
                  color="secondary"
                  mode="solid"
                  onClick={() => {
                    setShowList((currentState) => !currentState);
                  }}
                >
                  Table Columns
                </Button>
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
                        {...(getToggleHideAllColumnsProps() as React.ComponentProps<
                          typeof IndeterminateCheckbox
                        >)}
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
          </>
        ) : null}
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
                data-h2-padding="b(top-bottom, s) b(right-left, m)"
                data-h2-text-align="b(center)"
                data-h2-font-size="b(caption)"
              >
                {column.render("Header")}
                <span data-h2-color="b(lightpurple)">
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
                return (
                  <td
                    {...cell.getCellProps()}
                    data-h2-padding="b(top-bottom, s) b(right-left, m)"
                    data-h2-text-align="b(center)"
                    data-h2-font-size="b(caption)"
                  >
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
}

export default Table;
