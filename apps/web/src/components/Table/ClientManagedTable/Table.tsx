/* eslint-disable react/jsx-key */
import "regenerator-runtime/runtime"; // Hack: Needed for react-table?
import React, { HTMLAttributes, ReactElement } from "react";
import isEqual from "lodash/isEqual";
import { useIntl } from "react-intl";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  usePagination,
  HeaderGroup,
} from "react-table";
import { Button, Link } from "@common/components";
import Pagination from "@common/components/Pagination";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Dialog from "@common/components/Dialog";
import { Fieldset } from "@common/components/inputPartials";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import SortIcon from "./SortIcon";
import SearchForm from "./SearchForm";
import useInitialTableState from "./useInitialTableState";

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
  filterColumns?: boolean;
  search?: boolean;
  pagination?: boolean;
  hiddenCols?: string[];
  labelledBy?: string;
  initialSortBy?: Array<{ id: string; desc: boolean }>;
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

const getSortAttr = (
  isSorted: boolean,
  isSortedDesc?: boolean,
): React.AriaAttributes["aria-sort"] => {
  if (!isSorted) {
    return undefined;
  }

  return isSortedDesc ? "descending" : "ascending";
};

interface HeaderWrapperProps<T extends object> {
  column: HeaderGroup<T>;
  children: React.ReactNode;
}

const HeaderWrapper = <T extends object>({
  column,
  children,
}: HeaderWrapperProps<T>) => {
  if (!column.canSort) {
    return children as JSX.Element;
  }

  return (
    <button
      {...column.getSortByToggleProps({
        title: undefined, // Title is unnecessary
      })}
      type="button"
      data-h2-location="base(0)"
      data-h2-background-color="base(transparent) base:hover(dt-secondary.lightest.35) base:focus-visible(focus)"
      data-h2-color="base(dt-white)"
      data-h2-display="base(flex)"
      data-h2-radius="base(s)"
      data-h2-padding="base(x.25, x.5)"
      data-h2-align-items="base(center)"
      data-h2-text-align="base(left)"
      data-h2-width="base(100%)"
      data-h2-outline="base(none)"
    >
      {children}
    </button>
  );
};

const TABLE_DEFAULTS = {
  pageSize: 10,
  pageIndex: 0,
};

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  labelledBy,
  title,
  addBtn,
  filterColumns = true,
  search = true,
  pagination = true,
  hiddenCols,
  initialSortBy,
}: TableProps<T>): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialState = useInitialTableState(searchParams);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    rows,
    setGlobalFilter,
    state: { pageIndex, pageSize, hiddenColumns, sortBy },
    gotoPage,
    setPageSize,
    page,
  } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: initialState.hiddenColumns ?? hiddenCols ?? [],
        sortBy: initialState.sortBy ?? initialSortBy ?? [],
        pageSize: initialState.pageSize ?? TABLE_DEFAULTS.pageSize,
        pageIndex: initialState.pageIndex ?? TABLE_DEFAULTS.pageIndex,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const intl = useIntl();
  const methods = useForm();

  React.useEffect(() => {
    setSearchParams(
      (previous) => {
        if (pageSize && pageSize !== TABLE_DEFAULTS.pageSize) {
          const newPageSize = pageSize.toString();
          if (newPageSize !== previous.get("pageSize")) {
            previous.set("pageSize", newPageSize);
          }
        } else {
          previous.delete("pageSize");
        }

        if (pageIndex && pageIndex !== TABLE_DEFAULTS.pageIndex) {
          const newPageIndex = pageIndex.toString();
          if (newPageIndex !== previous.get("pageIndex")) {
            previous.set("pageIndex", newPageIndex);
          }
        } else {
          previous.delete("pageIndex");
        }

        if (sortBy && !isEqual(sortBy, initialSortBy)) {
          const newSortBy = encodeURIComponent(JSON.stringify(sortBy));
          if (previous.get("sortBy") !== newSortBy) {
            previous.set("sortBy", newSortBy);
          }
        } else {
          previous.delete("sortBy");
        }

        if (hiddenColumns && !isEqual(hiddenCols, hiddenColumns)) {
          const newHiddenColumns = hiddenColumns.join(",");
          if (previous.get("hiddenColumns") !== newHiddenColumns) {
            previous.set("hiddenColumns", newHiddenColumns);
          }
        } else {
          previous.delete("hiddenColumns");
        }

        return previous;
      },
      {
        replace: true,
      },
    );
  }, [
    pageSize,
    pageIndex,
    hiddenColumns,
    sortBy,
    setSearchParams,
    initialSortBy,
    hiddenCols,
  ]);

  return (
    <div>
      {/* Table header */}
      {(filterColumns || search || addBtn) && (
        <div data-h2-margin="base(x2, 0, x.5, 0)">
          <p>{title && <span data-h2-font-weight="base(700)">{title}</span>}</p>
          <div data-h2-flex-grid="base(center, x1)">
            <div data-h2-flex-item="base(1of1) l-tablet(fill)">
              <div data-h2-flex-grid="base(center, x.5)">
                {search && (
                  <div data-h2-flex-item="base(content)">
                    <SearchForm onChange={setGlobalFilter} />
                  </div>
                )}
                {filterColumns && (
                  <div data-h2-flex-item="base(content)">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          mode="solid"
                          color="secondary"
                          type="button"
                          data-h2-display="base(inline-flex)"
                          data-h2-align-items="base(center)"
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
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header color="ts-primary">
                          {intl.formatMessage({
                            defaultMessage: "Table columns",
                            id: "YH6bFU",
                            description:
                              "Dialog title for the admin tables columns toggle.",
                          })}
                        </Dialog.Header>
                        <FormProvider {...methods}>
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
                              <div
                                key={column.id}
                                data-h2-margin="base(x.125, 0)"
                              >
                                <label htmlFor={column.Header?.toString()}>
                                  <input
                                    id={column.Header?.toString()}
                                    type="checkbox"
                                    {...column.getToggleHiddenProps()}
                                  />
                                  {` ${column.Header}`}
                                </label>
                              </div>
                            ))}
                          </Fieldset>
                        </FormProvider>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                )}
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
          data-h2-border-right="base(1px solid dt-secondary)"
          data-h2-border-left="base(1px solid dt-secondary)"
          data-h2-overflow="base(auto)"
          data-h2-max-width="base(100%)"
        >
          <table
            aria-labelledby={labelledBy}
            data-h2-width="base(100%)"
            {...getTableProps()}
          >
            <caption>
              <span data-h2-visually-hidden="base(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Column headers with buttons are sortable",
                  id: "/bwX1a",
                  description:
                    "Text displayed to instruct users how to sort table rows",
                })}
              </span>
            </caption>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id}
                      data-h2-background-color="base(dt-secondary.light)"
                      data-h2-padding="base(x.5, x1)"
                      title={undefined}
                      aria-sort={getSortAttr(
                        column.isSorted,
                        column.isSortedDesc,
                      )}
                    >
                      <HeaderWrapper column={column}>
                        {column.render("Header")}
                        {column.isSorted && (
                          <SortIcon isSortedDesc={column.isSortedDesc} />
                        )}
                      </HeaderWrapper>
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
