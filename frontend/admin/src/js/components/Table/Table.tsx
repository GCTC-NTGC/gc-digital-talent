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
import { PlusIcon, TableIcon } from "@heroicons/react/outline";
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
    label: string;
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
        description: "Label displayed on the Table Columns toggle fieldset.",
      })}
    </label>
  );
};

const Spacer: React.FC = ({ children }) => (
  <div data-h2-margin="base(0, 0, 0, x.5)" style={{ flexShrink: 0 }}>
    {children}
  </div>
);

const ButtonIcon: React.FC<{
  icon: React.FC<HTMLAttributes<HTMLOrSVGElement>>;
}> = ({ icon }) => {
  const Icon = icon;

  return (
    <Icon
      style={{ height: "1em", width: "1rem" }}
      data-h2-margin="base(right, xs)"
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
    <div data-h2-margin="base(top-bottom, m)">
      {filter && (
        <div
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-background-color="base(dt-gray.light)"
          data-h2-justify-content="base(space-between)"
          data-h2-radius="base(s, s, none, none)"
          data-h2-padding="base(x.5)"
        >
          <div style={{ flexShrink: 0 }}>
            {title && <span data-h2-font-weight="base(800)">{title}</span>}
          </div>
          <div
            style={{ flexShrink: 0 }}
            data-h2-display="base(flex)"
            data-h2-justify-content="base(flex-end)"
          >
            <SearchForm onChange={setGlobalFilter} />
            <Spacer>
              <div data-h2-position="base(relative)">
                <Button
                  mode="outline"
                  color="black"
                  type="button"
                  data-h2-display="base(inline-flex)"
                  data-h2-align-items="base(center)"
                  onClick={() => setShowList(!showList)}
                >
                  <ButtonIcon icon={TableIcon} />
                  <span>
                    {intl.formatMessage({
                      defaultMessage: "Columns",
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
                    description:
                      "Dialog title for the admin tables columns toggle.",
                  })}
                >
                  <Fieldset
                    legend={intl.formatMessage({
                      defaultMessage: "Visible columns",
                      description:
                        "Legend for the column toggle in admin tables.",
                    })}
                  >
                    <div data-h2-margin="base(top-bottom, xxs)">
                      <IndeterminateCheckbox
                        {...(getToggleHideAllColumnsProps() as React.ComponentProps<
                          typeof IndeterminateCheckbox
                        >)}
                      />
                    </div>
                    {allColumns.map((column) => (
                      <div
                        key={column.id}
                        data-h2-margin="base(top-bottom, xxs)"
                      >
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
            </Spacer>
            {addBtn && (
              <Spacer>
                <Link
                  mode="outline"
                  color="black"
                  type="button"
                  data-h2-display="base(inline-flex)"
                  data-h2-align-items="base(center)"
                  style={{ textDecoration: "none" }}
                  href={addBtn.path}
                >
                  <ButtonIcon icon={PlusIcon} />
                  <span>{addBtn.label}</span>
                </Link>
              </Spacer>
            )}
          </div>
        </div>
      )}
      <div
        data-h2-overflow="base(auto, all)"
        style={{ maxWidth: "100%" }}
        data-h2-shadow="base(m)"
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
                    data-h2-background-color="base(light.dt-secondary)"
                    data-h2-color="base(dt-white)"
                    data-h2-font-weight="base(700)"
                    data-h2-padding="base(x.5, x1)"
                    data-h2-text-align="base(left)"
                    data-h2-font-size="base(caption)"
                  >
                    <span
                      data-h2-display="base(flex)"
                      data-h2-align-items="base(center)"
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
                        data-h2-padding="base(x.5)"
                        data-h2-text-align="base(left)"
                        data-h2-font-size="base(caption)"
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
      <div
        data-h2-align-items="base(center)"
        data-h2-display="base(flex)"
        data-h2-background-color="base(dt-gray.light)"
        data-h2-justify-content="base(space-between)"
        data-h2-radius="base(none, none, s, s)"
        data-h2-padding="base(x.5)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-margin="base(0, x.5, 0, 0)"
        >
          <p>
            {intl.formatMessage({
              defaultMessage: "Selected actions:",
              description: "Label for action buttons in footer of admin table.",
            })}
          </p>
          <Spacer>
            <Button type="button" mode="solid" color="primary">
              {intl.formatMessage({
                defaultMessage: "Download XML",
                description:
                  "Text label for button to download an xml file of items in a table.",
              })}
            </Button>
          </Spacer>
          <Spacer>
            <Button type="button" mode="solid" color="primary">
              {intl.formatMessage({
                defaultMessage: "Download PDF",
                description:
                  "Text label for button to download a pdf of items in a table.",
              })}
            </Button>
          </Spacer>
        </div>
        {pagination && (
          <Pagination
            currentPage={pageIndex + 1}
            onCurrentPageChange={(pageNumber) => gotoPage(pageNumber - 1)}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
            pageSizes={[10, 20, 30, 40, 50]}
            totalCount={rows.length}
            ariaLabel={intl.formatMessage({ defaultMessage: "Table results" })}
            color="black"
            mode="outline"
            data-h2-margin="base(all, none)"
          />
        )}
      </div>
    </div>
  );
}

export default Table;
