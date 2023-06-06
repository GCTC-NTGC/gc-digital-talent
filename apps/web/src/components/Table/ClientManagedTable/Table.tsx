/* eslint-disable react/jsx-key */
import "regenerator-runtime/runtime"; // Hack: Needed for react-table?
import React, { ReactElement, useId } from "react";
import isEqual from "lodash/isEqual";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  usePagination,
  HeaderGroup,
} from "react-table";

import { Button, Dialog, IconType, Link } from "@gc-digital-talent/ui";
import { Fieldset } from "@gc-digital-talent/forms";

import Pagination from "~/components/Pagination";

import SortIcon from "./SortIcon";
import SearchForm from "./SearchForm";
import useInitialTableState from "./useInitialTableState";
import tableMessages from "../tableMessages";

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
  addDialog?: React.ReactNode;
  filterColumns?: boolean;
  search?: boolean;
  pagination?: boolean;
  hiddenCols?: string[];
  labelledBy?: string;
  initialSortBy?: Array<{ id: string; desc: boolean }>;
}

const IndeterminateCheckbox = ({
  indeterminate,
  ...rest
}: React.HTMLProps<HTMLInputElement> & { indeterminate: boolean }) => {
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
      data-h2-background-color="base(transparent) base:hover(secondary.lightest.35) base:focus-visible(focus)"
      data-h2-color="base(white)"
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
  addDialog,
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
    state: { pageIndex, pageSize, hiddenColumns, sortBy, globalFilter },
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

  const staticId = useId();
  const inputId = `table-search-${staticId}`;
  const inputLabel = intl.formatMessage(
    {
      defaultMessage: "Search {title}",
      id: "/7RNZm",
      description: "Label for search input",
    },
    {
      title: title?.toLowerCase(),
    },
  );

  return (
    <div>
      {/* Table header */}
      {(filterColumns || search || addBtn) && (
        <div data-h2-margin="base(x2, 0, x.5, 0)">
          <p>
            {title && (
              <label data-h2-font-weight="base(700)" htmlFor={inputId}>
                {inputLabel}
              </label>
            )}
          </p>
          <div data-h2-flex-grid="base(center, x1)">
            <div data-h2-flex-item="base(1of1) l-tablet(fill)">
              <div data-h2-flex-grid="base(center, x.5)">
                {search && (
                  <div data-h2-flex-item="base(content)">
                    <SearchForm
                      onChange={setGlobalFilter}
                      value={globalFilter}
                      inputId={inputId}
                      inputLabel={inputLabel}
                    />
                  </div>
                )}
                {filterColumns && (
                  <div data-h2-flex-item="base(content)">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          icon={TableCellsIcon}
                          mode="outline"
                          color="secondary"
                          type="button"
                        >
                          {intl.formatMessage({
                            defaultMessage: "Columns",
                            id: "xcBl1q",
                            description:
                              "Label displayed on the Table Columns toggle button.",
                          })}
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          {intl.formatMessage({
                            defaultMessage: "Table columns",
                            id: "YH6bFU",
                            description:
                              "Dialog title for the admin tables columns toggle.",
                          })}
                        </Dialog.Header>
                        <Dialog.Body>
                          <FormProvider {...methods}>
                            <Fieldset
                              name="visibleColumns"
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
                        </Dialog.Body>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                )}
              </div>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(content)">
              <div
                data-h2-display="base(flex)"
                data-h2-justify-content="base(flex-end)"
              >
                {addBtn && (
                  <Link
                    mode="solid"
                    color="primary"
                    icon={PlusIcon}
                    style={{ textDecoration: "none" }}
                    href={addBtn.path}
                  >
                    {addBtn.label}
                  </Link>
                )}
                {addDialog || null}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Table wrapper */}
      <div data-h2-radius="base(s)">
        {/* Table body */}
        <div
          data-h2-radius="base(rounded, rounded, 0px, 0px)"
          data-h2-border-right="base(1px solid black.darkest)"
          data-h2-border-left="base(1px solid black.darkest)"
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
                {title}
                <br />
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
                      data-h2-background-color="base(black.9)"
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
            <tbody
              data-h2-background="base(foreground) base:children[>tr:nth-child(odd)](primary.darker.1)"
              {...getTableBodyProps()}
            >
              {rows.length ? (
                page.map((row) => {
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
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    data-h2-padding="base(x1)"
                    data-h2-text-align="base(center)"
                  >
                    {intl.formatMessage(tableMessages.noItems)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div
          data-h2-background-color="base(black.9)"
          data-h2-radius="base(0px, 0px, rounded, rounded)"
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
                    pageSizes={[10, 20, 50, 100, 500]}
                    totalCount={rows.length}
                    ariaLabel={intl.formatMessage({
                      defaultMessage: "Table results",
                      id: "hlcd+5",
                    })}
                    color="white"
                    mode="solid"
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
