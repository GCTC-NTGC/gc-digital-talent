import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";
import isEqual from "lodash/isEqual";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import isEmpty from "lodash/isEmpty";

import { empty, notEmpty } from "@gc-digital-talent/helpers";
import { Loading } from "@gc-digital-talent/ui";

import Table from "./Table";
import SearchForm from "./SearchForm";
import ColumnDialog from "./ColumnDialog";
import NullMessage, { NullMessageProps } from "./NullMessage";
import RowSelection, {
  getRowSelectionColumn,
  useRowSelection,
  rowSelectCell,
} from "./RowSelection";
import useControlledTableState, {
  getTableStateFromSearchParams,
} from "./useControlledTableState";
import TablePagination from "./TablePagination";
import { INITIAL_STATE, SEARCH_PARAM_KEY } from "./constants";
import type {
  AddDef,
  DatasetDownload,
  DatasetPrint,
  FilterDef,
  PaginationDef,
  RowSelectDef,
  SearchDef,
  SearchState,
  SortDef,
} from "./types";
import { getColumnHeader, sortingStateToOrderByClause } from "./utils";

interface TableProps<TData, TFilters> {
  /** Accessible name for the table */
  caption: React.ReactNode;
  /** Data to be displayed within the table */
  data: TData[];
  /** Column definitions for `react-table` */
  columns: ColumnDef<TData>[];
  /** Column definitions for `react-table` */
  hiddenColumnIds?: string[];
  /** Determine if any aspect of the table is loading (server side) */
  isLoading?: boolean;
  /** Override default null message with a custom one */
  nullMessage?: NullMessageProps;
  /** Override default null message with a custom one */
  nullSearchMessage?: NullMessageProps;
  /** Enable row selection */
  rowSelect?: RowSelectDef<TData>;
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
  add?: AddDef;
  filter?: FilterDef<TFilters>;
  /** Should this sync state in the URL? */
  urlSync?: boolean;
}

const ResponsiveTable = <TData extends object, TFilters = object>({
  caption,
  data,
  columns,
  hiddenColumnIds,
  isLoading,
  nullMessage,
  nullSearchMessage,
  rowSelect,
  search,
  sort,
  download,
  print,
  add,
  pagination,
  filter,
  urlSync = true,
}: TableProps<TData, TFilters>) => {
  const id = React.useId();
  const intl = useIntl();
  const [, setSearchParams] = useSearchParams();
  const isInternalSearch = search && search.internal;
  const memoizedColumns = React.useMemo(() => {
    if (!rowSelect) return columns;
    // Inject the selection column if it is enabled
    return [getRowSelectionColumn(rowSelect.cell, intl), ...columns];
  }, [columns, intl, rowSelect]);
  const columnIds = memoizedColumns.map((column) => column.id).filter(notEmpty);

  const [rowSelection, setRowSelection] = useRowSelection<TData>(rowSelect);
  const { state, initialState, initialParamState, updaters } =
    useControlledTableState({
      columnIds,
      initialState: {
        hiddenColumnIds,
        searchState: search?.initialState,
        sortState: sort?.initialState,
        paginationState: pagination?.initialState,
      },
    });

  const manualPageSize = !pagination?.internal
    ? Math.ceil(
        (pagination?.total ?? 0) /
          (state.pagination?.pageSize ??
            INITIAL_STATE.paginationState.pageSize),
      )
    : undefined;

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    initialState,
    state: {
      ...state,
      rowSelection,
    },
    getRowId: rowSelect?.getRowId,
    autoResetPageIndex: false,
    enableGlobalFilter: isInternalSearch,
    enableRowSelection: !!rowSelect,
    enableSorting: !!sort,
    manualSorting: !sort?.internal,
    manualPagination: !pagination?.internal,
    pageCount: manualPageSize,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection, // Note: We should probably do the state sync here
    ...updaters,
  });

  const searchColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanFilter())
    .map((column) => ({
      label: getColumnHeader(column, "searchHeader"),
      value: column.id,
    }));

  const {
    sorting: sortingState,
    columnFilters: columnFilterState,
    globalFilter: globalFilterState,
    columnVisibility: columnVisibilityState,
    pagination: paginationState,
  } = table.getState();

  React.useEffect(() => {
    if (urlSync) {
      const currentParams = new URLSearchParams(window.location.search);
      const newParams = new URLSearchParams(window.location.search);

      let searchState: SearchState = {
        term: String(globalFilterState),
      };
      if (columnFilterState.length) {
        searchState = {
          term: String(columnFilterState[0].value),
          type: columnFilterState[0].id,
        };
      }

      const newHiddenIds = Object.keys(columnVisibilityState)
        .map((colId) => (columnVisibilityState[colId] ? undefined : colId))
        .filter(notEmpty);

      const initialSortState = sort?.initialState ?? INITIAL_STATE.sortState;
      if (isEqual(sortingState, initialSortState) || isEmpty(sortingState)) {
        newParams.delete(SEARCH_PARAM_KEY.SORT_RULE);
      } else {
        newParams.set(SEARCH_PARAM_KEY.SORT_RULE, JSON.stringify(sortingState));
      }

      if (isEqual(hiddenColumnIds, newHiddenIds) || isEmpty(sortingState)) {
        newParams.delete(SEARCH_PARAM_KEY.HIDDEN_COLUMNS);
      } else {
        newParams.set(SEARCH_PARAM_KEY.HIDDEN_COLUMNS, newHiddenIds.join(","));
      }

      const initialPageSize =
        pagination?.initialState?.pageSize ??
        INITIAL_STATE.paginationState.pageSize;
      if (paginationState.pageSize === initialPageSize) {
        newParams.delete(SEARCH_PARAM_KEY.PAGE_SIZE);
      } else {
        newParams.set(
          SEARCH_PARAM_KEY.PAGE_SIZE,
          String(paginationState.pageSize),
        );
      }

      const initialPageIndex =
        pagination?.initialState?.pageIndex ??
        INITIAL_STATE.paginationState.pageIndex;
      if (paginationState.pageIndex === initialPageIndex) {
        newParams.delete(SEARCH_PARAM_KEY.PAGE);
      } else {
        newParams.set(
          SEARCH_PARAM_KEY.PAGE,
          String(paginationState.pageIndex + 1),
        );
      }

      const initialSearchState =
        search?.initialState ?? INITIAL_STATE.searchState;
      if (isEqual(initialSearchState, searchState)) {
        newParams.delete(SEARCH_PARAM_KEY.SEARCH_COLUMN);
        newParams.delete(SEARCH_PARAM_KEY.SEARCH_TERM);
      } else if (columnFilterState.length > 0) {
        newParams.set(SEARCH_PARAM_KEY.SEARCH_COLUMN, columnFilterState[0].id);
        newParams.set(
          SEARCH_PARAM_KEY.SEARCH_TERM,
          String(columnFilterState[0].value),
        );
      } else {
        newParams.delete(SEARCH_PARAM_KEY.SEARCH_COLUMN);
        if (globalFilterState) {
          newParams.set(SEARCH_PARAM_KEY.SEARCH_TERM, globalFilterState);
        } else {
          newParams.delete(SEARCH_PARAM_KEY.SEARCH_TERM);
        }
      }

      if (
        empty(filter?.state) ||
        isEmpty(filter?.state) ||
        isEqual(filter?.initialState, filter?.state)
      ) {
        newParams.delete(SEARCH_PARAM_KEY.FILTERS);
      } else {
        newParams.set(SEARCH_PARAM_KEY.FILTERS, JSON.stringify(filter?.state));
      }

      if (
        !isEqual(
          Object.fromEntries(currentParams),
          Object.fromEntries(newParams),
        )
      ) {
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [
    sortingState,
    columnFilterState,
    globalFilterState,
    paginationState,
    columnVisibilityState,
    setSearchParams,
    sort?.initialState,
    hiddenColumnIds,
    search?.initialState,
    pagination?.initialState?.pageSize,
    pagination?.initialState?.pageIndex,
    urlSync,
    filter?.state,
    filter?.initialState,
  ]);

  React.useEffect(() => {
    if (sort?.onSortChange) {
      sort.onSortChange(sortingState);
    }
  }, [sortingState, sort?.onSortChange, sort]);

  const hasNoData = !isLoading && (!data || data.length === 0);
  const hasNoVisibleRows = !isLoading && table.getRowModel().rows.length <= 0;
  const captionId = `${id}-caption`;
  const hidableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide());

  const nullStateMessage =
    columnFilterState.length > 0 || globalFilterState !== ""
      ? nullSearchMessage
      : nullMessage;

  return (
    <>
      <Table.Controls add={add}>
        {search && (
          <SearchForm
            id={`${id}-search`}
            table={table}
            state={initialParamState.searchState}
            searchBy={searchColumns}
            {...search}
          />
        )}
        {filter?.component && <Table.Control>{filter.component}</Table.Control>}
        {hidableColumns.length > 0 ? (
          <Table.Control>
            <ColumnDialog table={table} />
          </Table.Control>
        ) : null}
      </Table.Controls>
      {hasNoData || hasNoVisibleRows ? (
        <NullMessage {...(nullStateMessage ? { ...nullStateMessage } : {})} />
      ) : (
        <div aria-labelledby={captionId}>
          <Table.Wrapper data-h2-position="base(relative)">
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
            {isLoading && (
              <Loading
                data-h2-radius="base(s)"
                data-h2-position="base(absolute)"
                data-h2-margin="base(0)"
                data-h2-location="base(0, 0, 0, 0)"
              />
            )}
          </Table.Wrapper>
          {pagination && (
            <TablePagination table={table} pagination={pagination} />
          )}
        </div>
      )}
    </>
  );
};

export default ResponsiveTable;
export {
  getTableStateFromSearchParams,
  rowSelectCell,
  sortingStateToOrderByClause,
};
