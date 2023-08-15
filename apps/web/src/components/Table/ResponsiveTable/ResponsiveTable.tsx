import * as React from "react";
import { useSearchParams } from "react-router-dom";
import isEqual from "lodash/isEqual";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";

import { useIntl } from "react-intl";
import Table from "./Table";
import SearchForm from "./SearchForm";
import ColumnDialog from "./ColumnDialog";
import NullMessage, { NullMessageProps } from "./NullMessage";
import RowSelection, { getRowSelectionColumn } from "./RowSelection";
import useControlledTableState from "./useControlledTableState";
import TablePagination from "./TablePagination";
import { SEARCH_PARAM_KEY } from "./constants";

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
  const id = React.useId();
  const intl = useIntl();
  const [, setSearchParams] = useSearchParams();
  const isInternalSearch = search && search.internal;
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => {
    if (!rowSelect) return columns;
    // Inject the selection column if it is enabled
    return [getRowSelectionColumn(rowSelect.cell, intl), ...columns];
  }, [columns, intl, rowSelect]);
  const columnIds = memoizedColumns.map((column) => column.id).filter(notEmpty);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const { state, initialState, updaters } = useControlledTableState({
    columnIds,
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

  const sortRule = table.getState().sorting;
  React.useEffect(() => {
    setSearchParams((previous) => {
      const newParams = new URLSearchParams(previous);

      if (isEqual(sortRule, sort?.initialState)) {
        newParams.delete(SEARCH_PARAM_KEY.SORT_RULE);
      } else {
        newParams.set(SEARCH_PARAM_KEY.SORT_RULE, JSON.stringify(sortRule));
      }

      return newParams;
    });
  }, [setSearchParams, sort?.initialState, sortRule]);

  const handleSearchChange = (newSearchState: SearchState) => {
    if (search?.onChange) {
      search.onChange(newSearchState);
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
            state={initialState.searchState}
            {...search}
          />
        )}
        {/** Note: `div` prevents button from taking up entire space on desktop */}
        <div>
          <ColumnDialog table={table} initialState={hiddenColumnIds} />
        </div>
      </Table.Controls>
      {!hasNoData ? (
        <div aria-labelledby={captionId}>
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
            <TablePagination table={table} pagination={pagination} />
          )}
        </div>
      ) : (
        <NullMessage {...(nullMessage ? { ...nullMessage } : {})} />
      )}
    </>
  );
};

export default ResponsiveTable;
