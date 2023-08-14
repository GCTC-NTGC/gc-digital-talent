import * as React from "react";
import { useIntl } from "react-intl";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";

import Table from "./Table";
import SearchForm from "./SearchForm";
import ColumnDialog from "./ColumnDialog";
import NullMessage, { NullMessageProps } from "./NullMessage";
import RowSelection, { getRowSelectionColumn } from "./RowSelection";
import Pagination from "../../Pagination";

import useControlledTableState from "./useControlledTableState";

import type {
  AddLinkProps,
  DatasetDownload,
  DatasetPrint,
  PaginationDef,
  RowSelect,
  SearchDef,
  SearchState,
  SortDef,
} from "./types";

interface TableProps<TData> {
  /** Accessible name for the table */
  caption: React.ReactNode;
  /** Data to be displayed within the table */
  data: TData[];
  /** Column definitions for `react-table` */
  columns: ColumnDef<TData>[];
  /** Column definitions for `react-table` */
  hiddenColumnIds: string[];
  /** Determine if any aspect of the table is loading (server side) */
  isLoading?: boolean;
  /** Override default null message with a custom one */
  nullMessage?: NullMessageProps;
  /** Enable row selection */
  rowSelect?: RowSelect<TData>;
  /** Enable the search form */
  search?: SearchDef<TData>;
  /** Enable sorting */
  sort?: SortDef;
  /** Enable pagination */
  pagination?: PaginationDef;
  /** Enable printing selected rows (requires rowSelect) */
  print?: DatasetPrint;
  /** Enable downloading selected rows and/or all data (requires rowSelect) */
  download?: DatasetDownload;
  /** Enable the "add item" button */
  add?: AddLinkProps;
}

const ResponsiveTable = <TData extends object>({
  caption,
  data,
  columns,
  hiddenColumnIds,
  isLoading,
  nullMessage,
  rowSelect,
  search,
  sort,
  download,
  print,
  add,
  pagination,
}: TableProps<TData>) => {
  const intl = useIntl();
  const id = React.useId();
  const isInternalSearch = search && search.internal;
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => {
    if (!rowSelect) return columns;
    // Inject the selection column if it is enabled
    return [getRowSelectionColumn(rowSelect.cell), ...columns];
  }, [columns, rowSelect]);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const { state, updaters } = useControlledTableState({
    columnIds: memoizedColumns.map((column) => column.id).filter(notEmpty),
    initialState: {
      hiddenColumnIds,
      searchState: search?.initialState,
      sortState: sort?.initialState,
      paginationState: pagination?.initialState,
    },
  });

  React.useEffect(() => {
    if (rowSelect?.onRowSelection) {
      const selectedRows = Object.values(rowSelection)
        .map((value, index) => {
          return value ? memoizedData[index] : undefined;
        })
        .filter(notEmpty);

      rowSelect.onRowSelection(selectedRows);
    }
    // Note: This is probably due to mis-use of useEffect but
    // adding exhaustive deps causes this to run infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      ...state,
      rowSelection,
    },
    enableGlobalFilter: isInternalSearch,
    enableRowSelection: !!rowSelect,
    enableSorting: !!sort,
    manualSorting: !sort?.internal,
    manualPagination: !pagination?.internal,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection, // Note: We should probably do the state sync here
    ...updaters,
  });

  const handleSearchChange = (newSearchState: SearchState) => {
    if (search?.onChange) {
      search.onChange(newSearchState);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (pagination) {
      table.setPageSize(newPageSize);
      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: table.getState().pagination.pageIndex,
          pageSize: newPageSize,
        });
      }
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    if (pagination) {
      table.setPageIndex(newPageIndex - 1);
      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: newPageIndex - 1,
          pageSize: table.getState().pagination.pageSize,
        });
      }
    }
  };

  const hasNoData = !isLoading && (!memoizedData || memoizedData.length === 0);
  const captionId = `${id}-caption`;

  return (
    <>
      <Table.Controls addLink={add}>
        {search && (
          <SearchForm
            id={`${id}-search`}
            onChange={handleSearchChange}
            table={table}
            state={search.initialState}
            {...search}
          />
        )}
        {/** Note: `div` prevents button from taking up entire space on desktop */}
        <div>
          <ColumnDialog table={table} />
        </div>
      </Table.Controls>
      {!hasNoData ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div aria-labelledby={captionId} tabIndex={0}>
          <Table.Wrapper>
            <Table.Table>
              <Table.Caption id={captionId}>{caption}</Table.Caption>
              <Table.Head>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.HeadRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.HeadCell key={header.id} header={header} />
                    ))}
                  </Table.HeadRow>
                ))}
              </Table.Head>
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id} cell={cell} />
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>
            {rowSelect && (
              <RowSelection.Actions
                {...{
                  download,
                  print,
                  isLoading,
                  count: Object.values(rowSelection).length,
                  onClear: () => table.resetRowSelection(),
                }}
              />
            )}
          </Table.Wrapper>
          {pagination && (
            <Pagination
              data-h2-margin-top="base(x.5)"
              ariaLabel={intl.formatMessage({
                defaultMessage: "Page navigation",
                description: "Label for the table pagination",
                id: "N3sUUc",
              })}
              color="black"
              currentPage={table.getState().pagination.pageIndex + 1}
              pageSize={table.getState().pagination.pageSize}
              pageSizes={pagination.pageSizes}
              totalCount={pagination.total}
              totalPages={table.getPageCount() ?? 0}
              onPageSizeChange={handlePageSizeChange}
              onCurrentPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <NullMessage {...(nullMessage ? { ...nullMessage } : {})} />
      )}
    </>
  );
};

export default ResponsiveTable;
