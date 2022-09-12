/* eslint-disable react/jsx-key */
import "regenerator-runtime/runtime"; // Hack: Needed for react-table?
import React, { HTMLAttributes, ReactElement, useState } from "react";
import { useIntl } from "react-intl";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  usePagination,
} from "react-table";
import { Button, Link } from "@common/components";
import Pagination from "@common/components/Pagination";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Dialog from "@common/components/Dialog";
import { Fieldset } from "@common/components/inputPartials";
import SortIcon from "./SortIcon";
import SearchForm from "./SearchForm";

export type ColumnsOf<T extends Record<string, unknown>> = Array<Column<T>>;

export interface TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: Array<Column<T>>;
  data: Array<T>;
  title?: string;
  addBtn?: {
    path: string;
    label: React.ReactNode;
  };
  filter?: boolean;
  pagination?: boolean;
  hiddenCols?: string[];
  labelledBy?: string;
}

const IndeterminateCheckbox: React.FC<
  React.HTMLProps<HTMLInputElement> & { indeterminate: boolean }
> = ({ indeterminate, ...rest }) => {
  const intl = useIntl();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <label htmlFor="column-fieldset-toggle-all">
      <input
        id="column-fieldset-toggle-all"
        type="checkbox"
        ref={ref}
        {...rest}
      />{" "}
      {intl.formatMessage({
        defaultMessage: "Toggle All",
        id: "7d/ot8",
        description: "Label displayed on the Table Columns toggle fieldset.",
      })}
    </label>
  );
};

const ButtonIcon: React.FC<{
  icon: React.FC<HTMLAttributes<HTMLOrSVGElement>>;
}> = ({ icon }) => {
  const Icon = icon;

  return (
    <Icon
      style={{ height: "1em", width: "1rem" }}
      data-h2-margin="base(0, x.5, 0, 0)"
    />
  );
};

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  labelledBy,
  title,
  addBtn,
  filter = true,
  pagination = true,
  hiddenCols = [],
}: TableProps<T>): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    rows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
    gotoPage,
    setPageSize,
    page,
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
    usePagination,
  );

  const [showList, setShowList] = useState(false);
  const intl = useIntl();

  return (
    <div>
      {/* Table header */}
      {filter && (
        <div data-h2-margin="base(x2, 0, x.5, 0)">
          <p>{title && <span data-h2-font-weight="base(700)">{title}</span>}</p>
          <div data-h2-flex-grid="base(center, x1)">
            <div data-h2-flex-item="base(1of1) l-tablet(fill)">
              <div data-h2-flex-grid="base(center, x.5)">
                <div data-h2-flex-item="base(content)">
                  <SearchForm onChange={setGlobalFilter} />
                </div>
                <div data-h2-flex-item="base(content)">
                  <Button
                    mode="solid"
                    color="secondary"
                    type="button"
                    data-h2-display="base(inline-flex)"
                    data-h2-align-items="base(center)"
                    onClick={() => setShowList(!showList)}
                  >
                    <ButtonIcon icon={TableCellsIcon} />
                    <span>
                      {intl.formatMessage({
                        defaultMessage: "Columns",
                        id: "xcBl1q",
                        description:
                          "Label displayed on the Table Columns toggle button.",
                      })}
                    </span>
                  </Button>
                  <Dialog
                    color="ts-primary"
                    isOpen={showList}
                    onDismiss={() => setShowList(false)}
                    title={intl.formatMessage({
                      defaultMessage: "Table columns",
                      id: "YH6bFU",
                      description:
                        "Dialog title for the admin tables columns toggle.",
                    })}
                  >
                    <Fieldset
                      legend={intl.formatMessage({
                        defaultMessage: "Visible columns",
                        id: "H9rxOR",
                        description:
                          "Legend for the column toggle in admin tables.",
                      })}
                    >
                      <div data-h2-margin="base(x.125, 0)">
                        <IndeterminateCheckbox
                          {...(getToggleHideAllColumnsProps() as React.ComponentProps<
                            typeof IndeterminateCheckbox
                          >)}
                        />
                      </div>
                      {allColumns.map((column) => (
                        <div key={column.id} data-h2-margin="base(x.125, 0)">
                          <label htmlFor={column.Header?.toString()}>
                            <input
                              id={column.Header?.toString()}
                              type="checkbox"
                              {...column.getToggleHiddenProps()}
                            />{" "}
                            {column.Header}
                          </label>
                        </div>
                      ))}
                    </Fieldset>
                  </Dialog>
                </div>
              </div>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(content)">
              {addBtn && (
                <Link
                  mode="solid"
                  color="primary"
                  type="button"
                  data-h2-display="base(inline-flex)"
                  data-h2-align-items="base(center)"
                  style={{ textDecoration: "none" }}
                  href={addBtn.path}
                >
                  <ButtonIcon icon={PlusIcon} />
                  <span>{addBtn.label}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Table wrapper */}
      <div data-h2-radius="base(s)">
        {/* Table body */}
        <div
          data-h2-radius="base(s, s, 0px, 0px)"
          data-h2-border="base(right-left, 1px, solid, dt-secondary)"
          data-h2-overflow="base(auto)"
          data-h2-max-width="base(100%)"
        >
          <table
            aria-labelledby={labelledBy}
            data-h2-width="base(100%)"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      data-h2-background-color="base(dt-secondary.light)"
                      data-h2-padding="base(x.5, x1)"
                    >
                      <span
                        data-h2-color="base(dt-white)"
                        data-h2-display="base(flex)"
                        data-h2-padding="base(x.5, 0)"
                        data-h2-align-items="base(center)"
                        data-h2-text-align="base(left)"
                      >
                        <span>{column.render("Header")}</span>
                        {column.isSorted && (
                          <SortIcon isSortedDesc={column.isSortedDesc} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          data-h2-padding="base(x.5, x1)"
                          data-h2-text-align="base(left)"
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
        </div>
        {/* Table footer */}
        <div
          data-h2-background-color="base(dt-secondary.light)"
          data-h2-radius="base(0px, 0px, s, s)"
        >
          {/* <p>
            {intl.formatMessage({
              defaultMessage: "Selected actions:",
              description: "Label for action buttons in footer of admin table.",
            })}
          </p> */}
          <div data-h2-padding="base(x1, x1)">
            <div data-h2-flex-grid="base(center, x2, 0)">
              <div data-h2-flex-item="base(content)">
                <div data-h2-flex-grid="base(center, x1, 0)">
                  <div data-h2-flex-item="base(content)">
                    <Button type="button" mode="inline" color="white">
                      {intl.formatMessage({
                        defaultMessage: "Download CSV",
                        id: "mxOuYK",
                        description:
                          "Text label for button to download a csv file of items in a table.",
                      })}
                    </Button>
                  </div>
                  <div data-h2-flex-item="base(content)">
                    <Button type="button" mode="inline" color="white">
                      {intl.formatMessage({
                        defaultMessage: "Print",
                        id: "jX1JC3",
                        description:
                          "Text label for button to download a pdf of items in a table.",
                      })}
                    </Button>
                  </div>
                </div>
              </div>
              <div data-h2-flex-item="base(fill)">
                {pagination && (
                  <Pagination
                    currentPage={pageIndex + 1}
                    onCurrentPageChange={(pageNumber) =>
                      gotoPage(pageNumber - 1)
                    }
                    onPageSizeChange={setPageSize}
                    pageSize={pageSize}
                    pageSizes={[10, 20, 30, 40, 50]}
                    totalCount={rows.length}
                    ariaLabel={intl.formatMessage({
                      defaultMessage: "Table results",
                      id: "hlcd+5",
                    })}
                    color="white"
                    mode="outline"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
