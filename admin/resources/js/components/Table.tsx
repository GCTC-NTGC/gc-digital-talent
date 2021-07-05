/* eslint-disable react/jsx-key */
import React, { ReactElement, useState, RefObject } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  Renderer,
  HeaderProps,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import SettingsIcon from "../../../public/images/settings.png";
import CheckmarkIcon from "../../../public/images/checkmark-icon.jpeg";

export type FilterableColumn = Column & {
  showCol?: boolean;
};

interface TableProps<T extends Record<string, unknown>> {
  columns: FilterableColumn[];
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
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
  );

  const [showList, setShowList] = useState(false);
  const [showColumns, setShowColumns] = useState(columns);

  const IndeterminateCheckbox = React.forwardRef<RefObject<HTMLElement>, any>(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef<HTMLInputElement>(null);
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        if (resolvedRef && resolvedRef.current) {
          resolvedRef.current.indeterminate = indeterminate;
        }
      }, [resolvedRef, indeterminate]);

      return <input type="checkbox" ref={resolvedRef} {...rest} />;
    },
  );

  const shouldBeVisible = (
    header: Renderer<HeaderProps<T>> | undefined,
  ): boolean | undefined => {
    const column = columns.find((lColumn) => {
      return lColumn.Header === header;
    });

    if (column?.showCol === undefined) return true;
    return column?.showCol;
  };

  const setShowColumns_helper = (column: FilterableColumn) => {
    return setShowColumns(
      showColumns.map((lColumn) => {
        if (lColumn.Header === column.Header) {
          lColumn.showCol = !column.showCol;
          return lColumn;
        }
        return lColumn;
      }),
    );
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
                shouldBeVisible(column.Header) && (
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
                      <li key={column.id}>
                        {column.showCol || column.showCol === undefined ? (
                          <img
                            src={CheckmarkIcon}
                            style={{
                              width: "10px",
                              height: "10px",
                              marginRight: "5px",
                              display: "inline-block",
                            }}
                            alt="checkmark con"
                          />
                        ) : null}
                        <div
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            display: "inline-block",
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => {
                            setShowColumns_helper(column);
                          }}
                          onClick={() => {
                            setShowColumns_helper(column);
                          }}
                        >
                          {column.Header}
                        </div>
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
                if (!shouldBeVisible(cell.column.Header)) return null;
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
